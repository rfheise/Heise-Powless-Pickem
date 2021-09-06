from .models import *
from django.utils import timezone

#loads in schedule sheet into db
def loadSheet():
    #loads weeks into db
    loadWeeks()
    #adds teams to db
    loadTeams()
    #loads in games from schedule for 2021 season
    loadSchedule()
def loadWeeks():
    for i in range(1, 19):
        #create weeks 1 - 18 for the 2021 season
        Week.objects.create(week = i, year = 2021, week_type = "Regular Season")
def loadTeams():
    #loop over lines in games csv file
    with open("./web/games.csv","r") as f:
        #loop over all the teams in the file
        for line in f:
            line = line.split(",")
            #first cell is team name, second is team abreviation
            Team.objects.create(abrv = line[1],name = line[0])
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
                week = Week.objects.get(week = i, year = 2021)
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