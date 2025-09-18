from __future__ import absolute_import
from celery import shared_task,Celery
from .models import Student,Pick,Weeks,Game,Team
from django.core.mail import send_mail
from time import sleep
from twilio.rest import Client
from celery.schedules import crontab
import requests
from django.utils import timezone
from . import helper
# app = Celery()



account_sid = 'ACbfc52299bb0bb081dd7cfbcc81e68728'
auth_token = '7f7f2fd20ddbf8d08cf073277b121883'


# @app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#      'add-every-monday-morning': {
#         'task': 'tasks.add',
#         'schedule': crontab(hour=7, minute=30, day_of_week=1),
#         'args': (16, 16),
#     },

# app.conf.beat_schedule = {
#     'add-every-30-seconds': {
#         'task': '.message',
#         'schedule': 2.0,
#         'args': ("wow grape","+15742073299")
#     },
# }
@shared_task
def update_week():
    req = requests.get("https://nflcdns.nfl.com/liveupdate/scorestrip/ss.json")
    if req.status_code == 200:
        req = req.json()
    else:
        return
    current_week = Weeks.objects.filter(year=2020).order_by("-id").all()[0]
    if current_week.week == req['w']:
        return
    week = Weeks.objects.create(year=2020,week=req['w'])
    for r in req['gms']:
        bruh = {'home_score':r['hs'],"away_score":r['vs'],"week":week}
        bruh['home'] = Team.objects.get(abbr = r['h'])
        bruh['away'] = Team.objects.get(abbr = r['v'])
        bruh['time'] = helper.date(r['d'].upper(),*helper.convert_time(r['t'],r['q']))
        Game.objects.create(**bruh)

@shared_task
def update_scores():
    current_week = Weeks.objects.filter(year=2020).order_by("-id").all()[0]
    req = requests.get("https://nflcdns.nfl.com/liveupdate/scorestrip/ss.json")
    if req.status_code == 200:
        req = req.json()
    else:
        return
    for r in req['gms']:
        print(r['h'])
        game = Game.objects.get(week=current_week,home__abbr=r['h'])
        game.home_score = r['hs']
        game.away_score = r['vs']
        game.save()
    Student.calculate()





@shared_task
def test(email):
    user = Student.objects.get(email=email)
    sleep(50)
    send_mail("TEST EMAIL Please",f"No","noreply@email.heisepowlesspickem.com",[user.email],fail_silently = False)
    send_mail("TEST EMAIL Please",f"Fucking","noreply@email.heisepowlesspickem.com",[user.email],fail_silently = False)
    send_mail("TEST EMAIL Please",f"Cap","noreply@email.heisepowlesspickem.com",[user.email],fail_silently = False)

@shared_task
def send_email(sub,message,send_email,useremails,**kwargs):
    send_mail(sub,message,send_email,useremails,**kwargs)

@shared_task
def message(body="Good Job You Did It 🥳",to="+15742073299",from_="+19085214850"):
    client = Client(account_sid, auth_token)
    client.messages.create(body=body,from_=from_,to=to)

@shared_task
def messages(from_="+19085214850"):
    users = Student.objects.all()
    client = Client(account_sid, auth_token)
    body = "We are missing your pick you got an hour 🤯😳🥶🏈"
    picks = set()
    picked = Pick.objects.filter(week=Weeks.objects.order_by("-id").first()).all()
    for picke in picked:
        picks.add(picke.picker)
    for user in users:
        if user not in picks:
            client.messages.create(body=body,from_=from_,to=user.phone)

@shared_task
def let_games_begin(from_="+19085214850"):
    users = Student.objects.all()
    client = Client(account_sid, auth_token)
    body = "Let The Games Begin 🏈😅😎"
    for user in users:
        client.messages.create(body=body,from_=from_,to=user.phone)
