from .models import User, Week, Pick
from .apiModels import TeamSerializer, UserSerializer, WeekSerializer
from .stats import (game_map, outcome_of, standings_through, ranks,
                    season_players)

#Builds the weekly recap.
#Everything in here is derived from picks and final scores that are already
#in the database - no new models, no migration.


def _pick_card(entry):
    #shape one pick for the awards section
    game = entry["game"]
    return {
        "user": UserSerializer(entry["pick"].picker, many=False).data,
        "team": TeamSerializer(entry["pick"].team, many=False).data,
        "margin": entry["margin"],
        "result": entry["result"],
        "score": f"{game.home.abrv} {game.home_score} - {game.away.abrv} {game.away_score}",
    }


def latest_week():
    #The most recently completed week that actually has a recap to show.
    #Week.finished is the right signal - the update_week cron maintains it -
    #but the newest finished week is not always the newest *played* one: weeks
    #can sit marked finished with no picks against them (an ended season, or
    #a whole year flagged complete at once). So walk back from the newest
    #finished week until one has a settled pick.
    #This is not Week.getCurrentWeek(), which returns the first *unfinished*
    #week and so points at a week nobody has played yet.
    finished = Week.objects.filter(finished=True).order_by("-year", "-week")
    with_picks = set(Pick.objects.values_list("week", flat=True).distinct())
    for week in finished[:60]:
        if week.id not in with_picks:
            continue
        games = game_map([week])
        for pick in Pick.objects.filter(week=week).select_related("team"):
            outcome, _ = outcome_of(pick, games)
            if outcome:
                return week
    #nothing settled anywhere - fall back to the newest finished week
    return finished.first()


def build(week_num, year):
    #url kwargs arrive as strings
    try:
        week_num = int(week_num)
        year = int(year)
    except (TypeError, ValueError):
        return None

    week = Week.objects.filter(year=year, week=week_num).first()
    if week is None:
        return None

    users = season_players(year)
    user_ids = set(u.id for u in users)
    games = game_map([week])
    picks = Pick.objects.filter(week=week).select_related("picker", "team")

    #resolve every pick in this week into a small record
    entries = []
    for pick in picks:
        if pick.picker_id not in user_ids:
            continue
        game = games.get((pick.week_id, pick.team_id))
        if not game:
            continue
        outcome, value = outcome_of(pick, games)
        entries.append({
            "pick": pick, "game": game,
            "margin": value if outcome else None,
            "result": outcome if outcome else "pending",
        })

    settled = [e for e in entries if e["result"] != "pending"]

    #--- league scoreboard -------------------------------------------------
    #picks and players are not the same number: the last week of the season
    #gives everyone three picks, so count them separately
    scoreboard = {
        "picks": len(entries),
        "players": len(set(e["pick"].picker_id for e in entries)),
        "wins": len([e for e in settled if e["result"] == "win"]),
        "loss": len([e for e in settled if e["result"] == "loss"]),
        "ties": len([e for e in settled if e["result"] == "tie"]),
        "pending": len(entries) - len(settled),
    }

    #--- margin awards -----------------------------------------------------
    wins = [e for e in settled if e["result"] == "win"]
    losses = [e for e in settled if e["result"] == "loss"]
    awards = {
        "blowout": None, "squeaker": None, "worst_beat": None,
        "lone_wolf": None, "herd": None,
    }
    if wins:
        awards["blowout"] = _pick_card(max(wins, key=lambda e: e["margin"]))
        awards["squeaker"] = _pick_card(min(wins, key=lambda e: e["margin"]))
    if losses:
        awards["worst_beat"] = _pick_card(min(losses, key=lambda e: e["margin"]))

    #--- lone wolf and the herd -------------------------------------------
    by_team = {}
    for entry in entries:
        by_team.setdefault(entry["pick"].team_id, []).append(entry)

    #lone wolf: the only player on a team, and it paid off. if several people
    #went solo we take the one who won by the most, skipping any pick that has
    #already taken a margin award so nobody collects two trophies for the same
    #game.
    solo_wins = [
        group[0] for group in by_team.values()
        if len(group) == 1 and group[0]["result"] == "win"
    ]
    spoken_for = set()
    if wins:
        spoken_for.add(max(wins, key=lambda e: e["margin"])["pick"].id)
        spoken_for.add(min(wins, key=lambda e: e["margin"])["pick"].id)
    fresh = [e for e in solo_wins if e["pick"].id not in spoken_for]
    #prefer someone who hasn't already been named, but if every solo win is
    #spoken for we still show the best one - claiming "nobody" when a lone
    #wolf actually happened would just be wrong
    pool = fresh if fresh else solo_wins
    if pool:
        awards["lone_wolf"] = _pick_card(max(pool, key=lambda e: e["margin"]))

    #the herd: the most popular team of the week, only interesting if more
    #than one person piled in
    crowds = [group for group in by_team.values() if len(group) > 1]
    if crowds:
        crowd = max(crowds, key=len)
        awards["herd"] = {
            "team": TeamSerializer(crowd[0]["pick"].team, many=False).data,
            "count": len(crowd),
            "wins": len([e for e in crowd if e["result"] == "win"]),
            "loss": len([e for e in crowd if e["result"] == "loss"]),
            "ties": len([e for e in crowd if e["result"] == "tie"]),
        }

    #--- standings movement ------------------------------------------------
    after = standings_through(year, week_num, users)
    before = standings_through(year, week_num - 1, users) if week_num > 1 else []
    rank_after = ranks(after)
    rank_before = ranks(before)

    movement = []
    for row in after:
        uid = row["user"].id
        was = rank_before.get(uid)
        now = rank_after.get(uid)
        movement.append({
            "user": UserSerializer(row["user"], many=False).data,
            "rank_before": was,
            "rank_after": now,
            #positive means they climbed
            "delta": (was - now) if (was is not None and now is not None) else 0,
            "record": f"{row['wins']}-{row['loss']}-{row['ties']}",
        })

    return {
        "week": WeekSerializer(week, many=False).data,
        "scoreboard": scoreboard,
        "awards": awards,
        "movement": movement,
    }
