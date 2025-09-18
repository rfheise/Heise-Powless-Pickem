from django.shortcuts import render
from .models import Team,Student,Vote,Weeks,Pick,Game,Temp
from .step import login_req
from django.utils import timezone
from django.shortcuts import get_object_or_404,redirect
from django.http import HttpResponse,HttpResponseNotFound, HttpResponseRedirect
import json
from django.contrib.auth import authenticate, login,logout
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password,make_password
from .helper import generate_str,status,nstatus
from datetime import timedelta
from .tasks import test,send_email,message,update_week


# Create your views here.

def view_username(request):
    if request.method == "GET":
        return render(request,"chevy.html",{"type":"Forgot Username"})
    elif request.method == "POST":
        try:
            email = request.POST["email"]
        except:
            return status({"status":False,"message":"Missing Email"})
        user = Student.objects.filter(email =email).all()
        if not user:
            return status({"status":False,"message":"user not found"})
        user = user[0]
        send_email.delay("view username",f"Your username is {user.username}","noreply@email.heisepowlesspickem.com",[user.email],fail_silently = False)
        return status({"status":True,"message":"Email Sent"})
def reset_password(request):
    if request.method == "POST":
        try:
            travis = {"email":request.POST['email'],"username":request.POST['uname']}
        except:
            return status({"status":False,"message":"Missing Required Field"})
        user = Student.objects.filter(**travis).all()
        if not user:
            return status({'status':False,"message":"Error User Not Found"})
        user = user[0]
        #creates a random string and hashes it so it is hard for someone to get access to everyones account if they hacked into the db
        random_str = generate_str()
        temp = Temp.objects.create(key = make_password(random_str),user = user)
        send_email.delay("Reset Password",f"Copy and paste this link in your browser to reset your password it will expire in 15 minutes https://heisepowlesspickem.com/reset_password?travis={temp.uuid}&scott={random_str}",'noreply@email.heisepowlesspickem.com',[user.email],fail_silently=False)
        return nstatus(status=True,message="Email Successfully Sent")
    else:
        return render(request,"chevy.html",{"type":"Forgot Password"})
def user_picks(request,uuid):
    user = Student.objects.get(uuid = uuid)
    picks = Pick.objects.filter(picker= user).all()
    return render(request,"mypicks.html",{"picks":picks,"title":f"{user.first_name}'s Picks"})
def reseted_password(request):
    if request.method == "GET":
        try:
            uuid = request.GET['travis']
            str = request.GET['scott']
        except:
            return error(request,"Missing Required Field",url = "/",title = "Return Home")
        request.session['uuid'] = uuid
        request.session['reset']=str
        temp = Temp.objects.get(uuid = uuid)
        if temp.used or timezone.now() > temp.date + timedelta(minutes=15):
            return error(request,"Link Expired",url = "/",title = "Return Home")
        temp.used = True
        temp.save()
        #return actual html document when you create it
        return render(request,"chevy.html",{"type":"Reset Password"})
    else:
        try:
            pword = request.POST['npword']
            cpword = request.POST['cpword']
        except:
            return status({"status":False,"message":"Missing required field"})
        if pword != cpword:
            return status({"status":False,"message":"Password Do Not Match"})
        if not request.session['uuid'] or not request.session["reset"]:
            return status({"status":False,"message":"Damn Machine Go #$@#$ Error Processing Result"})
        temp = Temp.objects.get(uuid = request.session['uuid'])
        if not check_password(request.session['reset'],temp.key):
            return status({"status":False,"message":"What you doin trying to access this bruh access denied"})
        #links expire in 15 minutes
        if timezone.now() > temp.date + timedelta(minutes=15):
            return status({"status":False,"message":"Yo 🔇Your🔇Link🔇Has 🔇Expired"})
        user = temp.user
        user.set_password(pword)
        user.save()
        return status({"status":True,"message":"Success Password Reset"})
def updateweek(request):
    update_week()
    return HttpResponseRedirect("/pick")
def standing_api(request):
    #calculate stats before load
    Student.calculate()
    try:
        dorm = request.GET['dorm']
    except:
        return status({"status":False,"message":"missing required field"})
    if dorm == "all":
        students = Student.objects.order_by("-win","-score").all()
        title = "All"
    else:
        title = Student.gimmedorms(dorm)
        if not title:
            return HttpResponseNotFound('Dorm Not Found')
        else:
            title = title['name']
        students = Student.objects.filter(dorm = dorm).order_by("-win","-score").all()
    if not students:
        return HttpResponseNotFound('Dorm Not Found')
    st = []
    for student in students:
        st.append({
        "name":f"{student.first_name} {student.last_name}",
        "avgmarg":"{:.2f}".format(student.avgmarg()),
        "dorm":Student.gimmedorms(student.dorm),
        "wins":student.getWins(),
        "image":student.image(),
        "uuid":str(student.uuid)
        })
    return status({"results":{'students':st,"title":title}})
def pick_api(request):
    week = Weeks.objects.order_by("-id").all()[0]
    picks = Pick.objects.filter(week = week).all()
    arr = []
    for pick in picks:
        arr.append({"name":str(pick.picker),"team":str(pick.team),"image":pick.team.image(),"wins":pick.team.wltstr(),"uuid":str(pick.picker.uuid)})
    return status({"results":arr})
def standing(request,dorm):
    return render(request,"standings.html",{"dorm":dorm})
@login_req()
def standings(request):
    #calculates wins
    Student.calculate()
    user = Student.objects.get(username = request.user)
    students = Student.objects.order_by("-score").all()[:3]
    dorm_students = Student.objects.filter(dorm = user.dorm).order_by("-score").all()[:3]
    return render(request,"standings-home.html",{"dorms":dorm_students,"students":students,"user":Student.gimmedorms(user.dorm),"winning":Student.winningDivision()['name']})

def error(request,value,**kwargs):
    keys = kwargs.keys()
    return render(request,"error.html",{"message":value,"url":"/" if 'url' not in kwargs.keys() else kwargs['url'],"title": "Return Home" if 'title' not in kwargs.keys() else kwargs['title']})
def serve(html):
    def pilot(request):
        return render(request,html)
    return pilot
@login_req()
def logouted(request):
    logout(request)
    return redirect('/login')
@login_req()
def standings_home(request):
    student = Student.objects.get(username = request.user)
    dorm = student.dorm
@login_req()
def vote(request):
    if request.method == "GET":
        nfc = Team.objects.filter(nfc = True).all()
        afc = Team.objects.filter(nfc =False).all()
        return render(request,"vote.html",{"nfc":nfc,"afc":afc})
    else:
        try:
            nfc = request.POST['nfc']
            afc = request.POST['afc']
        except:
            return error(request,"Missing Required Field",url = "/vote",title = "Go Back")
        user = Student.objects.get(username = request.user)
        if Vote.objects.filter(user = user).exists():
            return error(request,"Already Voted")
        nfc = Team.objects.filter(nfc = True,uuid = nfc).all()
        afc = Team.objects.filter(nfc = False,uuid=afc).all()
        if not afc or not nfc:
            return error(request,"Wrong Division",url = "/vote",title = "Go Back")
        Vote.objects.create(user = user,vote = nfc[0])
        Vote.objects.create(user = user,vote = afc[0])
        return error(request,"Successfully Voted")
@login_req()
def mypicks(request):
    user = Student.objects.get(username = request.user)
    picks = Pick.objects.filter(picker= user).all()
    return render(request,"mypicks.html",{"picks":picks,"title":"My Picks"})

def login_api(request):
    try:
        username = request.POST['username'].lower()
        password = request.POST['password']
    except:
        return nstatus(status=False,message="Missing Required Field")
        # return status({"status":False,"message":"Missing Requried Field"})
    user = authenticate(request,username = username,password = password)
    if user is not None:
        login(request,user)
        return status({"status":True})
    else:
        return nstatus(status=False,message="Incorrect Username or Password")
        # return status({"status":False,"message":"Incorrect Username Or Password"})
def check(obj,**kwargs):
    users = obj.objects.filter(**kwargs).all()
    return True if users else False
def signup(request):
    # try:
    cpword = request.POST['cpword']
    bruh = {"first_name":request.POST['fname'],"last_name":request.POST['lname'],"email":request.POST['email'],
    "username":request.POST['uname'].lower(),"password":request.POST['pword'],"dorm":request.POST['dorm'],"users":Team.objects.get(name = request.POST['team'])
    }

    # except:
    #     return status({"status":False,"message":"Missing Required Field"})
    if bruh['password'] != cpword:
        return status({"status":False,"message":"Passwords Do Not Match"})
    if check(Student,email = bruh['email']):
        return status({"status":False,"message":"Email Already In Use"})
    if check(Student,username = bruh['username']):
        return status({"status":False,"message":"Username Already In Use"})
    if not Student.checkdorms(bruh['dorm']):
        return status({"status":False,"message":"Dorm Does not exist"})
    student = Student.objects.create_user(**bruh)
    user = authenticate(request,username = bruh['username'],password = bruh['password'])
    if user is not None:
        login(request,user)
        return status({"status":True})
    else:
        return status({"status":False,"message":"Error Creating Account"})



@login_req()
def pick(request):
    if request.method == "GET":
        week = Weeks.objects.filter(year = "2020").order_by("-id").all()[0]
        games = Game.objects.filter(week = week).all()
        teams = Team.objects.filter(banned =False).exclude(by = week.week).all()
        student = Student.objects.get(username = request.user)
        picks = Pick.objects.filter(picker = student).order_by("-week__id").all()
        for pick in picks:
            teams = teams.exclude(uuid = pick.team.uuid)
        current = None
        if picks and picks[0].week == week:
            current = picks[0].team
        return render(request,"make-a-pick.html",{"games":games,"teams":teams,"current":current,"week":week})
    else:
        try:
            team = request.POST['team']
        except:
            return error(request,"Missing Required Field",url = "/pick",title = "Go Back")
        user = Student.objects.get(username = request.user)
        week = Weeks.objects.filter(year = "2020").order_by("-id").all()[0]
        pick = Pick.objects.filter(picker = user,team__name=team).exclude(week = week).all()
        if pick:
            return error(request,"You Have Already Picked This Team",url = "/pick",title = "Go Back")
        team = Team.objects.get(uuid = team)
        game = Game.givemegame(team,week)
        print(week)
        #checks to make sure picked game hasn
        pick = Pick.objects.filter(week = week,picker = user).all()
        if pick:
            pick = pick[0]
            if pick.game().time < timezone.now():
                return error(request,"Picked Game Already Started",url = "/pick",title = "Go Back")
        if game['game'].time < timezone.now():
            return error(request,"Game Already Started",url ="/pick",title ="Go Back")
        if team.banned:
            return error(request,"Team Banned",url ="/pick",title ="Go Back")
        try:
            damn = Pick.objects.get(picker = user,week=week)
            damn.home = game['home']
            damn.team = team
            damn.save()
        except:
            damn = Pick.objects.create(picker = user,team = team,home = game['home'],week = week)
        return error(request,f"Successfully Picked {damn.team.name}")
