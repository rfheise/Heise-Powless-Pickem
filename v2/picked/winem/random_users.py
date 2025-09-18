from .models import *
from random import *
import datetime

names = []
dorms = [{"name": "Cary Quadrangle", "abbr": "CARY"}, {"name": "Earhart Hall", "abbr": "ERHT"}, {"name": "First Street Towers", "abbr": "FST"}, {"name": "Harrison Hall", "abbr": "HARR"}, {"name": "Hawkins Hall", "abbr": "HAWK"}, {"name": "Hillenbrand Hall", "abbr": "HILL"}, {"name": "Hilltop Apartments", "abbr": "HLTP"}, {"name": "Honors College and Residences", "abbr": "HCR"}, {"name": "McCutcheon Hall", "abbr": "MCUT"}, {"name": "Meredith Hall", "abbr": "MRDH"}, {"name": "Meredith South", "abbr": "OWEN"}, {"name": "Owen Hall", "abbr": "PVIL"}, {"name": "Purdue Village", "abbr": "SHRV"}, {"name": "Shreve Hall", "abbr": "TARK"}, {"name": "Tarkington Hall", "abbr": "TSS"}, {"name": "Wiley Hall", "abbr": "WILY"}, {"name": "Windsor Halls", "abbr": "WRH"}]
with open("./winem/names.txt","r") as f:
    for line in f:
        line.strip("\n")
        bruh = line.split(" ")
        names.append(bruh[1])
def random(list):
    return list[randint(0,len(list)-1)]
def randname():
    return random(names)
def randdorms():
    return random(dorms)['abbr']
def bogo(list):
    for i in range(len(list)-1):
        bruh = randint(i,len(list)-1)
        temp = list[i]
        list[i] = list[bruh]
        list[bruh] = temp
    return list
def updateScores():
    users = Student.objects.all()
    for user in users:
        user.calculateWins()
        user.calculateScore()
def random_users(num):
    users = Student.objects.exclude(username = "rfheise").all()
    for user in users:
        user.delete()
    for i in range(num):
        user = {}
        user["first_name"] = randname().strip(" ")
        user["last_name"] = randname().strip(" ")
        user["username"] = f"{user['first_name'][0]}{user['last_name']}{randint(0,10**9)}"
        user["email"] = f"{user['username']}@purduepickem.com"
        user['password'] = randint(0,10**7)
        user['dorm'] = randdorms()
        student = Student.objects.create(**user)
        student.calculateWins()
def random_votes():
    votes = Vote.objects.all()
    for vote in votes:
        vote.delete()
    users = Student.objects.all()
    nfc = Team.objects.filter(nfc = True).all()
    afc = Team.objects.filter(nfc = False).all()
    for user in users:
        Vote.objects.create(vote = random(nfc),user=user)
        Vote.objects.create(vote = random(afc),user=user)
    Vote.banned()
def random_picks():
    users = Student.objects.all()
    for user in users:
        picks = Pick.objects.filter(picker = user).all()
        for pick in picks:
            pick.delete()
    for user in users:
        for i in range(17):
            teams = Team.objects.filter(banned =False).exclude(by = i+1).all()
            week = Weeks.objects.get(week = i+1)
            picks = Pick.objects.filter(picker =user).all()
            for pick in picks:
                teams = teams.exclude(uuid = pick.team.uuid)
            team = random(teams)
            try:
                game = Game.objects.get(week = week,home = team )
            except:
                game = Game.objects.get(week = week,away = team )
            Pick.objects.create(week =week,picker= user,team = team,home = team == game.home)
        user.calculateWins()
        user.calculateScore()
def random_season(num):
    random_games()
    random_users(num)
    random_votes()
    random_picks()
    updateScores()
def random_games():
    weeks = Weeks.objects.all()
    for week in weeks:
        week.delete()
    for i in range(17):
        week = Weeks.objects.create(year = "2020",week = i+1)
        teams = Team.objects.exclude(by = i+1).all()
        teams = [*teams]
        teams = bogo(teams)
        for i in range(int(len(teams)/2)):
            Game.objects.create(home = teams[i*2],away = teams[(i*2)+1],home_score = randint(0,40),away_score = randint(0,40),
            week = week,time = timezone.now()+ datetime.timedelta(days = (25+(i*7)))
            )
