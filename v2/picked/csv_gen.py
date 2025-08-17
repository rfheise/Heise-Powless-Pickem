from winem.models import *
import csv 

with open("picks.csv","w") as f:

    w = csv.writer(f)

    for picker in Student.objects.order_by("first_name"):
        
        name = picker.first_name 
        year = 2020 
        picks = [name, year]
        for i in range(1,14):

            week = Weeks.objects.get(week=i,year=year)
            pick = Pick.objects.filter(week = i, picker=picker).all()
            if len(pick) == 0:
                picks.append("")
            else:
                picks.append(pick[0].team.name)
        w.writerow(picks)

        
        