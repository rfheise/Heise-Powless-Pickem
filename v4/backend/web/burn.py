from .models import Team, Week, Pick
from .apiModels import TeamSerializer, UserSerializer
from .stats import game_map, outcome_of

#Team usage ("burn") chart for one player in one season.
#Shows which of the 32 teams they have already spent, which are still
#available, and which are banned this year.


def build(user, year):
    try:
        year = int(year)
    except (TypeError, ValueError):
        return None

    weeks = Week.objects.filter(year=year)
    if not weeks:
        return None

    #the banned flag on Team is a live, current-season value - it says nothing
    #about who was banned in 2019, so only apply it to the season in progress
    current = Week.getCurrentWeek()
    is_current_season = bool(current and current.year == year)

    games = game_map(weeks)
    picks = Pick.objects.filter(
        picker=user, week__in=weeks
    ).select_related("team", "week")

    #team id -> how it was spent
    spent = {}
    for pick in picks:
        outcome, _ = outcome_of(pick, games)
        spent[pick.team_id] = {"week": pick.week.week, "result": outcome}

    rows = []
    for team in Team.objects.all():
        used = spent.get(team.id)
        if used:
            state = "burned"
        elif is_current_season and team.banned:
            state = "banned"
        else:
            state = "available"
        rows.append({
            "team": TeamSerializer(team, many=False).data,
            "state": state,
            "week": used["week"] if used else None,
            "result": used["result"] if used else None,
        })

    #available first, then burned (earliest week first), then banned
    order = {"available": 0, "burned": 1, "banned": 2}
    rows.sort(key=lambda r: (
        order[r["state"]],
        r["week"] if r["week"] is not None else 0,
        r["team"]["name"],
    ))

    counts = {
        "available": len([r for r in rows if r["state"] == "available"]),
        "burned": len([r for r in rows if r["state"] == "burned"]),
        "banned": len([r for r in rows if r["state"] == "banned"]),
    }

    return {
        "user": UserSerializer(user, many=False).data,
        "year": year,
        "current_season": is_current_season,
        "counts": counts,
        "teams": rows,
    }
