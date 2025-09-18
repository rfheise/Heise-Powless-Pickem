import csv
from heisefootball.models import *

with open("picks.csv",'w') as f:
    w = csv.writer(f)
    arr = ["name","year",*range(1,18)]
    w.writerow(arr)
    for picker in Pickers.objects.all():
        picks = []
        picks.append(picker.user.first_name)
        picks.append(2019)
        for i in range(1,18):
            pick = weeklypicks.objects.filter(picker=picker,weeknum__weeknum=i).all()
            if len(pick) == 0:
                picks.append('')
            else:
                picks.append(pick[0].pick.name)
        w.writerow(picks)
        

    