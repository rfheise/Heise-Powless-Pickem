from .models import *
from django.utils import timezone
import datetime
import csv
import requests
import json
#loads in schedule sheet into db

# current year
year = 2026


def load():
    #loads weeks into db
    loadWeeks()
    # #adds teams to db
    # loadTeams()
    # #loads in games from schedule for 2021 season
    # loadSchedule()
    #load in games from past 20 years and game times for current season
    loadComplete()
    loadBye()

def loadBye():
    teams = Team.objects.all()
    weeks = Week.objects.filter(year=year).all()
    for week in weeks:
        for team in teams:
            try:
                game = Game.getGame(team,week)
            except:
                team.bye = week
                team.save()
                print(f"{team.name} bye week {team.bye.week}")
        

def loadWeeks():
    #load weeks fro current season
    for i in range(1, 19):
        #create weeks 1 - 18 for the 2021 season
        #if week exists don't do anything have to preserver old weeks
        week, created = Week.objects.get_or_create(week = i, year = year)
        week.week_type = "REG"
        week.save()
def loadTeams():
    #loop over lines in games csv file
    with open("./web/games.csv","r") as f:
        #loop over all the teams in the file
        for line in f:
            line = line.split(",")
            #first cell is team name, second is team abreviation
            #if team already exists don't add them
            team, created = Team.objects.get_or_create(abrv = line[1], name = line[0])
def loadSchedule():
    #open the file
    with open("./web/games.csv", "r") as f:
        for line in f:
            #loop over all the lines in the file and split into cells
            #remove endline character
            line = line.strip("\n").split(",")
            team = Team.objects.get(abrv = line[1])
            for i in range(1, 19):
                #get week
                week = Week.objects.get(week = i, year = year)
                date = timezone.now()
                home = team
                away = line[i + 1]
                print(f"Week {week.week}: ", end = "")
                #if bye week add it to team bye week
                if away != "BYE":
                    print(home.name + " " + away)
                    #calculate home and away team for the given week
                    if away[0] == "@":
                        home = away[1:]
                        away = team 
                        home = Team.objects.get(abrv = home)
                    else:
                        away = Team.objects.get(abrv = away)
                    try:
                        #check if game exists
                        Game.objects.get(home = home, away = away,
                    week = week)
                    except:
                        #if not go ahead and create it
                        Game.objects.create(home = home, away = away,
                        week = week, date = date)
                else:
                    print("BYE")
                    team.bye = week
                    team.save()

def formatTeam(team):
    changes = {"STL":"LAR","OAK":"LV","WAS":"WSH","SD":"LAC","LA":"LAR"}
    if team in changes.keys():
        return changes[team]
    return team
#loads all games from game complete       
def loadComplete():
    with open("./web/games.csv", "r") as f:
        games = csv.DictReader(f)
        for game in games:
            #proccess game time
            date = ""
            if game['gameday'] and game['gametime']:
                strTime = game['gameday'] + " " + game['gametime'] 
                date = datetime.datetime.strptime(strTime, "%Y-%m-%d %H:%M")
            # print(date + "date")
            #get or create a week
            week, created = Week.objects.get_or_create(year = game['season'], week = game['week'], week_type = game['game_type'])
            #if scores are empty make them 0
            if week.year == 2026:
                if game['home_score'] == "" or game['away_score'] == "":
                    game['home_score'] = 0
                    game['away_score'] = 0
                #enter all fields for game
                away = Team.objects.get(abrv = formatTeam(game['away_team']))
                home = Team.objects.get(abrv = formatTeam(game['home_team']))
                #create game object and edit fields
                gamer, created = Game.objects.get_or_create(week = week, away = away, home = home)
                gamer.away_score = game['away_score']
                gamer.home_score = game['home_score']
                gamer.qb_home = game['home_qb_name']
                gamer.qb_away = game['away_qb_name']
                gamer.coach_home = game['home_coach']
                gamer.coach_away = game['away_coach']
                if game['espn']:
                    gamer.espnId = game['espn']
                #print out cool game data
                print(f"{gamer.home.abrv} - {gamer.away.abrv} - {week.year}")
                #convert date into timezone aware eastern and then save it
                if date:
                    gamer.date = timezone.make_aware(date) 
                gamer.save()

def process_games(data):
    games = []
    for game in data["events"]:
        game_data = {}
        #get teams
        game_data["home"] = game['competitions'][0]['competitors'][0]['team']['abbreviation']
        game_data["away"] = game['competitions'][0]['competitors'][1]['team']['abbreviation']
        game_data['completed'] = game['status']['type']['completed'] 
        game_data["home_score"] = game['competitions'][0]['competitors'][0]['score']
        game_data["away_score"] = game['competitions'][0]['competitors'][1]['score']
        games.append(game_data)
    return games

def load_games(week, games):
    ret = False
    for game in games:
        if not game['completed']:
            continue
        print(game)
        home = Team.objects.get(abrv = game['home'])
        away = Team.objects.get(abrv = game['away'])
        game_db = Game.objects.get(week = week, home = home, away = away)
        ret = int(game_db.home_score) != int(game['home_score']) or int(game_db.away_score) != int(game['away_score']) or ret
        game_db.home_score = game['home_score']
        game_db.away_score = game['away_score']
        game_db.save()
    return ret

def get_live_scores(week,year):
    db_week = Week.objects.get(week = week, year = year)
    if timezone.now() - db_week.last_updated  < datetime.timedelta(hours = 1) or db_week.allGamesComplete():
        return False
    req = requests.get(f"https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week={db_week.week}&year={db_week.year}")
    data = json.loads(req.text)
    games = process_games(data)
    ret = load_games(db_week, games)
    db_week.last_updated = timezone.now()
    db_week.save()
    return ret

def update_week_scores():
    current_week = Week.getCurrentWeek()
    weeks = [*Week.objects.filter(year = current_week.year, finished = True).all(), current_week]
    ret = False
    for week in weeks:
        ret = get_live_scores(week.week, week.year) or ret
    return ret
    
if __name__ == "__main__":
    get_live_scores(1,2026)