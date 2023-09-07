from web.models import *
import csv

for y in range(2016,2017):
    with open(f"./historical_data/picks-{y}.csv","r") as f:
        
        r = csv.reader(f)
        for row in r:
            name = row[0]
            print(name)
            user = User.objects.get(first_name__iexact = name)
            year = row[1]
            for i in range(2, len(row)):
                week = i - 1
                w = Week.objects.get(week=week,year=year)
                if row[i] != "":
                    if row[i] == "Redskins":
                        row[i] = "Washington"
                    team = Team.objects.get(name__iexact=row[i])
                    print(year, team)
                    Pick.objects.create(picker=user,team=team,week=w)
        