from django.shortcuts import render
import csv
from .models import Teams,weeknumber,matchups,weeklypicks,Pickers,mesa,Year
import requests
import json
import os
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseForbidden,JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.static import serve
import django.utils.timezone
import datetime
import pytz
from .helper import converter,corvette,pickupdate

# Create your views here.
def message(request):
    return render(request,"message.html")

def index(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            try:
                res = requests.get("http://www.nfl.com/liveupdate/scorestrip/ss.json")
                if res.status_code == 200:
                    res = res.json()
                    week = res["w"]
                else:
                    return render(request,"error.html",{"message":"error loading stats"})
            except:
                try:
                    year = Year.objects.latest('year')
                    try:
                        if year.finished == True:
                            current_week = weeknumber.objects.latest("year","weeknum")
                            if current_week.finished == False:
                                pickupdate(current_week)
                                current_week.finished = True
                                current_week.save()
                            return render(request,"error.html",{"message":"Thanks for Playing Come Back Next Year"})
                    except:
                        return render(request,"error.html",{"message":"error loading year"})
                except:
                    return render(request,"error.html",{"message":"error year not found"})
                return render(request,"error.html",{"message":"error nfl api not working"})
            try:
                year = Year.objects.latest('year')
                try:
                    if year.finished == True:
                        current_week = weeknumber.objects.latest("year","weeknum")
                        if current_week.finished == False:
                            pickupdate(current_week)
                            current_week.finished = True
                            current_week.save()
                        return render(request,"error.html",{"message":"Thanks for Playing Come Back Next Year"})
                except:
                    return render(request,"error.html",{"message":"error loading year"})
            except:
                return render(request,"error.html",{"message":"error year not found"})
            try:
                current_week = weeknumber.objects.get(weeknum = week,year = year)
            except:
                current_week = weeknumber.objects.create(weeknum = week,year = year,finished = False)
                previous_week = weeknumber.objects.filter(weeknum = current_week.weeknum - 1, year = year ).all()
                if previous_week:
                    previous_week = previous_week[0]
                    previous_week.finished = True
                    previous_week.save()
                    pickupdate(previous_week)
            m = matchups.objects.filter(weeknum = current_week).first()
            if not m:
                for game in res["gms"]:
                    home = Teams.objects.get(code = game["h"])
                    away = Teams.objects.get(code =game["v"])
                    m = matchups.objects.create(home=home,away=away,weeknum =current_week,eid = game["eid"])
            user = User.objects.get(username = request.user)
            picker = Pickers.objects.get(user=user)
            weeklypick = weeklypicks.objects.filter(picker =picker).all()
            user_teams = Teams.objects.all().exclude(banned =True)
            user_teams = user_teams.exclude(byweek=current_week.weeknum)
            for weeklypic in weeklypick:
                user_teams =  user_teams.exclude(id = weeklypic.pick.id)
            games = matchups.objects.filter(weeknum = current_week).all()
            try:
                weeklypic = weeklypicks.objects.get(picker = picker,weeknum =current_week)
                return render(request,"index.html",{"teams":user_teams,"games":games,"week":current_week,"pick":weeklypic.pick})
            except:
                return render(request,"index.html",{"teams":user_teams,"games":games,"week":current_week,"pick":""})
        else:
            return render(request,"error.html")
    else:
        timed =  django.utils.timezone.now()
        timed = timed.astimezone(pytz.timezone('US/Eastern'))
        if timed.weekday() == 6:
            if timed.hour >= 13:
                return render(request,"error.html",{"message":"no longer accepting picks at this time"})
        if timed.weekday() == 0:
            return render(request,"error.html",{"message":"no longer accepting picks at this time"})
        #nfl db didn't roll over yet fix this before turning the site back on
        if timed.weekday() == 1:
            return render(request,"error.html",{"message":"no longer accepting picks at this time"})
        if timed.weekday() == 2:
            if timed.hour < 9:
                return render(request,"error.html",{"message":"no longer accepting picks at this time"})
        res = requests.get("http://www.nfl.com/liveupdate/scorestrip/ss.json")
        if res.status_code == 200:
            res = res.json()
            week = res["w"]
        try:
            teamd =  request.POST["team"]
        except:
            return render(request,"error.html",{"message":"Must Select A Team"})
        team = Teams.objects.get(code = teamd)
        picker = Pickers.objects.get(user = User.objects.get(username = request.user))
        thurtimes = res["gms"]
        for thurtime in thurtimes:
            if (teamd == thurtime["h"]) or (teamd == thurtime["v"]):
                if (timed.weekday() >= converter(thurtime["d"]) and converter(thurtime["d"]) != 0):
                    if timed.weekday() == converter(thurtime["d"]):
                        if timed.hour > (int(thurtime["t"][0]) + 12):
                                return render(request,"error.html",{"message":"Game Already Started/Over"})
                        if (timed.minute >= int(thurtime["t"][2:])) and (timed.hour == int(int(thurtime["t"][0]) + 12)):
                            return render(request,"error.html",{"message":"Game Already Started/Over"})
                    else:
                        return render(request,"error.html",{"message":"Game Already Started/Over"})
        currentpick = weeklypicks.objects.filter(picker = picker,weeknum = weeknumber.objects.get(weeknum = week,year = Year.objects.latest('year'))).all()
        if currentpick:
            currentpick = currentpick[0].pick
            for thurtime in thurtimes:
                if (currentpick.code == thurtime["h"]) or (currentpick.code == thurtime["v"]):
                    if (timed.weekday() >= converter(thurtime["d"]) and converter(thurtime["d"]) != 0):
                        if timed.weekday() == converter(thurtime["d"]):
                            if timed.hour > (int(thurtime["t"][0]) + 12):
                                return render(request,"error.html",{"message":"Picked Game Already Started/Over"})
                            if (timed.minute >= int(thurtime["t"][2:])) and (timed.hour == int(int(thurtime["t"][0]) + 12)):
                                return render(request,"error.html",{"message":"Picked Game Already Stared/Over"})
                        else:
                            return render(request,"error.html",{"message":"Picked Game Already Stared/Over"})
        try:
            weekpick = weeklypicks.objects.get(weeknum = weeknumber.objects.get(weeknum = week,year = Year.objects.latest('year')),picker = picker)
            weekpick.pick = team
            weekpick.date = django.utils.timezone.now()
            weekpick.save()
        except:
            weekpick = weeklypicks.objects.create(weeknum = weeknumber.objects.get(weeknum = week,year = Year.objects.latest('year')),picker = picker, pick = team,date = django.utils.timezone.now())
        return render(request,"error.html",{"message":"success"})

def register(request):
    if request.method == "POST":
        try:
            #gathers all necessary information
            fname = request.POST["fname"]
            lname = request.POST["lname"]
            email = request.POST["email"]
            username = request.POST["uname"]
            password = request.POST["pword"]
            cpassword = request.POST["cpword"]
        except:
            return render(request,"error.html",{"message":"error missing required field"})
        #creates user and buisness fields
        try:
            user = User.objects.create_user(first_name = fname,last_name = lname,username = username,password = password)
        except:
            return render(request,"error.html",{"message":"error username taken"})
        Picker = Pickers(user = user)
        Picker.save()
        user.save()
        #saves the user to the db and logs them in
        try:
            cherry = authenticate(request,username = username, password = password)
        except:
            return render(request,"error.html",{"message":"error failed to login"})
        if cherry:
            login(request, user)
            return HttpResponseRedirect(reverse("message"))
        else:
            return render(request,"error.html",{"message":"error failed to login user"})
        #loads register page
    elif request.method == "GET":
        carelesswhisper = {"dodgers":True}
        return render(request,"register.html",carelesswhisper)
    else:
        return HttpResponseForbidden("Error 403 - Method Forbidden")
def logined(request):
    if request.method == "POST":
        try:
            username = request.POST["uname"]
            password = request.POST["pword"]
        except:
            return render(request,"error.html",{"message":"missing required field"})
        user = authenticate(request,username = username, password = password)
        if user:
            login(request,user)
            return HttpResponseRedirect(reverse("message"))
        else:
            return render(request,"error.html",{"message":"username or password incorrect"})
    elif request.method == "GET":
        carelesswhisper = {"dodgers":False}
        return render(request,"register.html",carelesswhisper)
    else:
        return HttpResposeForbidden("Error 403 - Method Forbidden")

def logouted(request):
    logout(request)
    request.session.clear()
    return HttpResponseRedirect(reverse("message"))

def matchupsbruh(request,match_id):
    try:
        m = matchups.objects.filter(id = match_id).first()
        return render(request,"matchup.html",{"m":m})
    except:
        return render(request,"error.html",{"message":"Idk Some Error Occured"})

def pickeredpicks(request,picker_id):
    pickerd = Pickers.objects.get(id = picker_id)
    picks = weeklypicks.objects.filter(picker = pickerd).all()
    return render(request,"picker.html",{"picks":picks,"picker":pickerd})




def weeksbruh(request):
    weeks = weeknumber.objects.filter(year=Year.objects.latest('year')).all()
    return render(request,"weeks.html",{"weeks":weeks})
def allpicks(request,week_id):
    week = weeknumber.objects.get(id=week_id)
    pics = weeklypicks.objects.filter(weeknum = week).all()
    picks = []
    for pick in pics:
        try:
            picks.append({"pick":pick,"matchup":matchups.objects.get(weeknum = week,home = pick.pick)})
        except:
            picks.append({"pick":pick,"matchup":matchups.objects.get(weeknum = week,away = pick.pick)})
    return render(request,"picks.html",{"picks":picks,"week":week})


def standings(request):
    pickers = []
    week = int(weeknumber.objects.filter(year = Year.objects.latest('year')).order_by("-weeknum")[0].weeknum)
    for i in range(week + 1):
        try:
            dove= []
            people = Pickers.objects.filter(wins = (week - i)).all()
            for peop in people:
                dove.append(peop)
            dove.sort(key=corvette)
            for dov in dove:
                pickers.append(dov)
        except:
            stringh = "haha"
    return render(request,"standings.html",{"pickers":pickers})


def mypicks(request):
    user =  User.objects.get(username = request.user)
    picker = Pickers.objects.get(user = user)
    weeklypick = weeklypicks.objects.filter(picker = picker).all()
    return render(request,"mypicks.html",{"weeklypicks":weeklypick,"picker":picker})


def spreadsheet(request):
    with open("heisefootball/static/pickem.csv","w",newline = '')as csvfile:
        ironman = csv.writer(csvfile, delimiter=',',quotechar=' ', quoting=csv.QUOTE_MINIMAL)
        pickers = Pickers.objects.all()
        pickers = pickers.order_by("id")
        circle = []
        circle.append("Name")
        jimbos = []
        for picker in pickers:
            jimbos.append(picker)
            circle.append(str(picker))
        ironman.writerow(circle)
        weeks = weeknumber.objects.filter(year = Year.objects.latest('year')).all()
        for week in weeks:
            picks = weeklypicks.objects.filter(weeknum = week).all()
            picks = picks.order_by("picker_id")
            circle = []
            circle.append(f"Week:{week.weeknum}")
            counter = 0
            if picks:
                for jimbo in jimbos:
                    if len(picks) > counter:
                        if picks[counter].picker == jimbo:
                            circle.append(str(picks[counter].pick))
                            counter += 1
                        else:
                            circle.append(" ")
            ironman.writerow(circle)
        circle = []
        circle.append("standings")
        for picker in pickers:
            circle.append(f"{picker.wins}-{picker.losses}-{picker.ties}")
        ironman.writerow(circle)
    filepath = 'heisefootball/static/pickem.csv'
    return serve(request, os.path.basename(filepath), os.path.dirname(filepath))
