from .models import User, Week, Team, Pick, HallOfFame
from .apiModels import TeamSerializer, UserSerializer
from .stats import (game_map, outcome_of, standings_through, ranks,
                    blank, tally, win_pct, avg_margin)

#All time career history for every player.
#Season finishes come from the same replay the weekly recap uses, so the two
#features can never disagree about where somebody finished.


def _season_years():
    years = Pick.objects.values_list("week__year", flat=True).distinct()
    return sorted(set(y for y in years if y is not None))


def _everyone_who_played():
    #Deliberately NOT User.getAllUsers(). That defines the league as "whoever
    #has voted", which is a live, current-season notion - it drops family
    #members who have left, including past champions. For an all time page the
    #right population is everyone who has ever made a pick.
    ids = set(Pick.objects.values_list("picker", flat=True).distinct())
    return list(User.objects.filter(id__in=ids))


def build():
    users = _everyone_who_played()
    if not users:
        return {"players": []}
    years = _season_years()

    #--- one pass over every pick anyone has ever made ---------------------
    weeks = Week.objects.filter(year__in=years) if years else Week.objects.none()
    games = game_map(weeks)
    picks = Pick.objects.filter(
        picker__in=users, week__in=weeks
    ).select_related("picker", "team", "week").order_by("week__year", "week__week")

    career = {u.id: blank() for u in users}
    by_team = {u.id: {} for u in users}
    #chronological result stream per player, for streaks
    stream = {u.id: [] for u in users}

    for pick in picks:
        uid = pick.picker_id
        if uid not in career:
            continue
        outcome, value = outcome_of(pick, games)

        tally(career[uid], outcome, value)

        team = by_team[uid].setdefault(pick.team_id, {"team": pick.team, **blank()})
        tally(team, outcome, value)

        stream[uid].append({
            "year": pick.week.year, "week": pick.week.week, "result": outcome,
        })

    #--- per season records and finishes -----------------------------------
    #The replay already produces each season's record, so read it from there
    #rather than tallying seasons a second time - that also guarantees a career
    #page and the standings can never disagree. Week 99 means "the whole season".
    finishes = {}
    season_rows = {}
    for year in years:
        table = standings_through(year, 99, users)
        finishes[year] = ranks(table)
        season_rows[year] = {row["user"].id: row for row in table}

    #--- championships -----------------------------------------------------
    titles = {u.id: [] for u in users}
    champions = {}
    for hof in HallOfFame.objects.select_related("user").all():
        champions.setdefault(hof.year, set()).add(hof.user_id)
        if hof.user_id in titles:
            titles[hof.user_id].append(hof.year)

    #The replay is only as good as the picks in the database. Where a season's
    #derived winner disagrees with the champion actually recorded in the Hall
    #of Fame, the derived order is not trustworthy for that season - either
    #picks are missing (2020 has 12 of 17 weeks) or the season was settled by a
    #tiebreak this replay does not know about (2015 and 2019 are exact record
    #ties). Drop the finishes for those seasons rather than print a placing
    #that contradicts recorded history. Records and margins still stand.
    for year, placings in finishes.items():
        recorded = champions.get(year)
        if not recorded:
            #no champion on file yet - an in progress season, nothing to check
            continue
        derived_first = set(uid for uid, place in placings.items() if place == 1)
        if not (derived_first & recorded):
            finishes[year] = {}

    #serialize the 32 teams once rather than once per player
    team_json = {t.id: TeamSerializer(t, many=False).data
                 for t in Team.objects.all()}

    players = []
    for user in users:
        row = career[user.id]
        #only seasons they actually played in
        seasons = []
        for year in sorted(years, reverse=True):
            s = season_rows.get(year, {}).get(user.id)
            if not s or s["picks"] == 0:
                continue
            seasons.append({
                "year": year,
                "wins": s["wins"], "loss": s["loss"], "ties": s["ties"],
                "avg_margin": round(s["avg_margin"], 2),
                "win_pct": s["win_pct"],
                "finish": finishes.get(year, {}).get(user.id),
                "champion": year in titles[user.id],
            })

        #teams, most picked first
        teams = sorted(by_team[user.id].values(),
                       key=lambda t: (-t["picks"], t["team"].name))
        most = [{
            "team": team_json[t["team"].id],
            "count": t["picks"], "wins": t["wins"], "loss": t["loss"],
            "ties": t["ties"],
        } for t in teams[:5]]

        #the team that has let them down most - needs a couple of goes to
        #count as a grudge rather than one bad Sunday
        repeats = [t for t in teams if t["picks"] >= 2 and t["completed"] > 0]
        unlucky = None
        if repeats:
            worst = min(repeats, key=lambda t: (win_pct(t), -t["loss"]))
            if worst["loss"] > 0:
                unlucky = {
                    "team": team_json[worst["team"].id],
                    "count": worst["picks"], "wins": worst["wins"],
                    "loss": worst["loss"], "ties": worst["ties"],
                }

        used = set(by_team[user.id].keys())
        never = [data for tid, data in team_json.items() if tid not in used]

        #best and worst season by win rate
        played_seasons = [s for s in seasons if (s["wins"] + s["loss"] + s["ties"]) > 0]
        best = worst = None
        if played_seasons:
            #win rate first, but break ties on wins so a full championship
            #season beats a six game cameo at the same percentage
            best = max(played_seasons,
                       key=lambda s: (s["win_pct"], s["wins"], s["avg_margin"]))
            worst = min(played_seasons,
                        key=lambda s: (s["win_pct"], -s["wins"], s["avg_margin"]))
            if best["year"] == worst["year"]:
                worst = None

        #longest run of winning picks, running across seasons
        streak = {"length": 0, "start": None, "end": None}
        run = 0
        start = None
        for entry in stream[user.id]:
            if entry["result"] == "win":
                run += 1
                if start is None:
                    start = entry
                if run > streak["length"]:
                    streak = {
                        "length": run,
                        "start": f"{start['year']} W{start['week']}",
                        "end": f"{entry['year']} W{entry['week']}",
                    }
            elif entry["result"] is None:
                #game not played yet - does not extend or break anything
                continue
            else:
                run = 0
                start = None

        players.append({
            "user": UserSerializer(user, many=False).data,
            "wins": row["wins"], "loss": row["loss"], "ties": row["ties"],
            "win_pct": win_pct(row),
            "avg_margin": avg_margin(row),
            "picks": row["picks"],
            "seasons_played": len(seasons),
            "titles": sorted(titles[user.id], reverse=True),
            "seasons": seasons,
            "teams": {"most": most, "unluckiest": unlucky, "never": never},
            "extremes": {"best": best, "worst": worst, "streak": streak},
        })

    #all time table: win rate first, then raw wins to break ties
    players.sort(key=lambda p: (-p["win_pct"], -p["wins"]))
    return {"players": players}
