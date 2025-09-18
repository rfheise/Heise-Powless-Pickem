from .models import Teams,weeknumber,matchups,weeklypicks,Pickers,mesa
import requests
def converter(date):
    if date == "Mon":
        return 0
    if date == "Tues":
        return 1
    if date == "Wed":
        return 2
    if date == "Thu":
        return 3
    if date == "Fri":
        return 4
    if date == "Sat":
        return 5
    if date == "Sun":
        return 6
def corvette(picker):
    return -1 * picker.avgmarg()

def pickupdate(previous_week):
    ms = matchups.objects.filter(weeknum = previous_week).all()
    for m in ms:
        req = requests.get(f"http://www.nfl.com/liveupdate/game-center/{m.eid}/{m.eid}_gtd.json")
        if req.status_code == 200:
            req = req.json()
            print(int(req[f"{m.eid}"]["home"]["score"]["T"]))
            m.score_home = int(req[f"{m.eid}"]["home"]["score"]["T"])
            m.score_away = int(req[f"{m.eid}"]["away"]["score"]["T"])
            m.save()
    pickweeks = weeklypicks.objects.filter(weeknum = previous_week)
    for pickweek in pickweeks:
        try:
            game = matchups.objects.get(home = pickweek.pick,weeknum = pickweek.weeknum)
            if game.score_home > game.score_away:
                pickweek.picker.wins += 1
            elif game.score_away > game.score_home:
                pickweek.picker.losses += 1
            else:
                pickweek.picker.ties += 1
            pickweek.picker.save()
        except:
            game = matchups.objects.get(away = pickweek.pick,weeknum = pickweek.weeknum)
            if game.score_away > game.score_home:
                pickweek.picker.wins += 1
            elif game.score_home > game.score_away:
                pickweek.picker.losses += 1
            else:
                pickweek.picker.ties += 1
            pickweek.picker.save()
