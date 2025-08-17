import random
import string
from django.http import HttpResponse
import json
import datetime
from django.utils import timezone
from calendar import monthrange
def generate_str(x=30):
    str =""
    for i in range(x):
        str += string.ascii_letters[random.randint(0,len(string.ascii_letters)-1)]
    return str
def status(leviation):
    return HttpResponse(json.dumps(leviation),content_type = "json")
def nstatus(**kwargs):
    return HttpResponse(json.dumps(kwargs),content_type = "json")

def convert_time(time,pm):
    time = time.split(":")
    time[0] = int(time[0])
    time[1] = int(time[1])
    if(time[0] == 12):
        time[0] -= 12
    if(pm == "P"):
        time[0] += 12
    return time
def convert_weekday(day):
    if day == "SUN":
        return 7
    elif day == "MON":
        return 1
    elif day == "TUE":
        return 2
    elif day == "WED":
        return 3
    elif day == "THU":
        return 4
    elif day == "FRI":
        return 5
    elif day == "SAT":
        return 6
    else:
        return 0
def date(day,hour,minute):
    juice = convert_weekday(day)
    now = timezone.now()
    wrld = now.weekday() + 1
    if(wrld > juice):
        juice += 7
    days = now.day+juice-wrld
    month = now.month
    if (days > monthrange(2020,now.month)[1]):
        days -= monthrange(2020,now.month)[1]
        month += 1

    return datetime.datetime(day = days,hour = hour,minute=minute,year=2020,month=month)
