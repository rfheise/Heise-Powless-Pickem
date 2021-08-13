import csv
from django.http import JsonResponse

def main():
    counter = 1
    jimbo = []
    with open("teams.json","w",newline = '') as file:
        with open("heisefootball/teams.csv") as csvfile:
            ironman = csv.reader(csvfile, delimiter=' ', quotechar='|')
            for row in ironman:
                summer = {"model":"heisefootball.Teams","pk":counter,"fields":{"name":row[0],"byweek":int(row[2]),"code":row[1]}}
                jimbo.append(summer)
                counter += 1
        file.write(str(jimbo))

main()
