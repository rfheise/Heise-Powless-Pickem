from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
import random
from datetime import datetime
from functools import reduce
from django.db.models import Q
# Create your models here.

class mesa(models.Model):
    mesag = models.TextField(default = "hi")

class Year(models.Model):
    id = models.UUIDField(primary_key=True,default = uuid4,editable=False)
    year = models.IntegerField(default = 19)
    finished = models.BooleanField(default = False)

    def __str__(self):
        return f"Year:20{self.year}"

class weeknumber(models.Model):
    id = models.UUIDField(primary_key=True,default = uuid4,editable=False)
    weeknum = models.IntegerField(primary_key=False)
    year = models.ForeignKey(Year,on_delete = models.CASCADE,related_name = "years",null = True)
    finished = models.BooleanField(default = True)

    def __str__(self):
        return f"Week: {self.weeknum}"


class Teams(models.Model):
    name = models.CharField(max_length=255)
    banned = models.BooleanField(default = False)
    byweek =  models.IntegerField()
    code = models.CharField(max_length = 3)
    def __str__(self):
        return f"{self.name}"

class matchups(models.Model):
    home = models.ForeignKey(Teams,on_delete = models.PROTECT,related_name = "home_games")
    away =  models.ForeignKey(Teams,on_delete = models.PROTECT,related_name = "away_games")
    weeknum = models.ForeignKey(weeknumber,on_delete= models.CASCADE,related_name = "games")
    score_home =  models.IntegerField(default = 0)
    score_away = models.IntegerField(default = 0)
    eid = models.IntegerField()
    def __str__(self):
        return f"{self.home}-{self.away}"
    def real(self):
         return self.score_away != 0 and self.score_home != 0
class Pickers(models.Model):
    verification =  models.IntegerField(default = random.randint(100000000,999999999))
    user = models.ForeignKey(User,on_delete =  models.CASCADE,related_name ="picker")
    wins = models.IntegerField(null = True,default = 0)
    losses = models.IntegerField(null = True,default = 0)
    ties =  models.IntegerField(null = True,default = 0)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    def avgmarg(self):
        avgmargin = 0
        #this is not scalable and is inefficient but whatevs
        year = Year.objects.latest("year")
        weeklypic = weeklypicks.objects.filter(picker = self)
        for weeklypi in weeklypic:
            if weeklypi.weeknum.year == year:
                if weeklypi.win() == "Win":
                    try:
                        match = matchups.objects.get(home = weeklypi.pick,weeknum = weeklypi.weeknum)
                        avgmargin += match.score_home - match.score_away
                    except:
                        match = matchups.objects.get(away = weeklypi.pick,weeknum = weeklypi.weeknum)
                        avgmargin += match.score_away - match.score_home
        return avgmargin/self.wins
    def avgformat(self):
        return f"{'{0:2f}'.format(self.avgmarg())}"

class weeklypicks(models.Model):
    picker = models.ForeignKey(Pickers,on_delete=models.CASCADE,related_name ="weeklypicks")
    pick = models.ForeignKey(Teams,on_delete = models.PROTECT,related_name = "team")
    weeknum = models.ForeignKey(weeknumber,on_delete = models.PROTECT,related_name = "week")
    date = models.DateTimeField(default = datetime.now())

    def __str__(self):
        return f"{self.picker} - {self.weeknum}"
    def match(self):
        try:
            matchup = matchups.objects.get(weeknum = self.weeknum, home = self.pick)
        except:
            matchup = matchups.objects.get(weeknum = self.weeknum, away = self.pick)
        return matchup
    def win(self):
        try:
            matchup = matchups.objects.get(weeknum = self.weeknum, home = self.pick)
            if matchup.score_home > matchup.score_away:
                return "Win"
            elif matchup.score_home < matchup.score_away:
                return "Loss"
            elif matchup.score_home == 0 and matchup.score_away == 0:
                return "No Data"
            elif matchup.score_home == matchup.score_away:
                return "Tie"
            else:
                return "ERROR"

        except:
            matchup = matchups.objects.get(weeknum = self.weeknum, away = self.pick)
            if matchup.score_home < matchup.score_away:
                return "Win"
            elif matchup.score_home > matchup.score_away:
                return "Loss"
            elif matchup.score_home == 0 and matchup.score_away == 0:
                return "No Data"
            elif matchup.score_home == matchup.score_away:
                return "Tie"
            else:
                return "ERROR"
