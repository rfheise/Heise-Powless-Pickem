from .models import Week, Game, Pick

#Shared scoring primitives.
#The recap, burn chart and career pages all need to turn picks plus final
#scores into records, so that logic lives here rather than in any one of them.
#Everything is derived from data already in the database.


def game_map(weeks):
    #maps (week_id, team_id) -> game so we can look up a pick's game without
    #hitting the db once per pick
    games = Game.objects.filter(week__in=weeks).select_related("home", "away", "week")
    lookup = {}
    for game in games:
        lookup[(game.week_id, game.home_id)] = game
        lookup[(game.week_id, game.away_id)] = game
    return lookup


def played(game):
    #a game with no score on either side has not been played yet
    return not (game.home_score == 0 and game.away_score == 0)


def margin(pick, game):
    #signed margin from the perspective of the team that was picked
    #this mirrors Pick.quality_score() but uses the prefetched game
    if pick.team_id == game.home_id:
        return game.home_score - game.away_score
    return game.away_score - game.home_score


def result(value):
    if value > 0:
        return "win"
    elif value < 0:
        return "loss"
    return "tie"


def blank():
    #an empty tally, the shape every record in here accumulates into
    return {"wins": 0, "loss": 0, "ties": 0, "points": 0, "completed": 0, "picks": 0}


def tally(row, outcome, value):
    #fold one pick into a tally. outcome of None means the game has not been
    #played, which counts as no contest - same as Pick.result()
    row["picks"] += 1
    if outcome is None:
        return
    if outcome == "win":
        row["wins"] += 1
    elif outcome == "loss":
        row["loss"] += 1
    else:
        row["ties"] += 1
    row["points"] += value
    row["completed"] += 1


def win_pct(row):
    settled = row["wins"] + row["loss"] + row["ties"]
    if settled == 0:
        return 0.0
    return round(100.0 * row["wins"] / settled, 1)


def avg_margin(row):
    if row["completed"] == 0:
        return 0.0
    return round(row["points"] / row["completed"], 2)


def outcome_of(pick, games):
    #(outcome, margin) for a pick, or (None, 0) if its game has not been played
    game = games.get((pick.week_id, pick.team_id))
    if not game or not played(game):
        return None, 0
    value = margin(pick, game)
    return result(value), value


def standings_through(year, week_num, users):
    #Replays every pick from week 1 through week_num and returns the table as
    #it stood at that point, ordered exactly the way User.getStandings() orders
    #it: -wins, loss, -ties, -avg_margin.
    weeks = Week.objects.filter(year=year, week__lte=week_num)
    if not weeks:
        return []
    games = game_map(weeks)
    picks = Pick.objects.filter(
        week__in=weeks, picker__in=users
    ).select_related("picker", "team", "week")

    #seed every player so someone with no picks still appears
    totals = {u.id: {"user": u, **blank()} for u in users}

    for pick in picks:
        row = totals.get(pick.picker_id)
        if row is None:
            continue
        outcome, value = outcome_of(pick, games)
        tally(row, outcome, value)

    #avg_margin stays unrounded here because ranks() compares it to group ties -
    #rounding would silently merge players who are genuinely separated. Round
    #at the point of display instead.
    table = [{
        "user": row["user"], "wins": row["wins"], "loss": row["loss"],
        "ties": row["ties"],
        "avg_margin": (row["points"] / row["completed"]) if row["completed"] else 0,
        "win_pct": win_pct(row), "picks": row["picks"],
    } for row in totals.values()]
    table.sort(key=lambda r: (-r["wins"], r["loss"], -r["ties"], -r["avg_margin"]))
    return table


def ranks(table):
    #competition ranking - players with an identical line share a place, and
    #the next player skips ahead (1, 1, 3), matching the standings page
    out = {}
    place = 0
    last = None
    for i, row in enumerate(table):
        line = (row["wins"], row["loss"], row["ties"], row["avg_margin"])
        if line != last:
            place = i + 1
            last = line
        out[row["user"].id] = place
    return out
