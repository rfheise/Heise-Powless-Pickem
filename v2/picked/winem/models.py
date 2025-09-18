from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from django.utils import timezone
import math
import string
import random
# Create your models here.
class Weeks(models.Model):
    week = models.IntegerField()
    year = models.IntegerField()
    uuid = models.UUIDField(default = uuid4)
    def __str__(self):
        return f"Year:{self.year},Week:{self.week}"

class Vote(models.Model):
    vote = models.ForeignKey('Team',on_delete = models.CASCADE)
    user = models.ForeignKey(User,on_delete = models.CASCADE)
    def __str__(self):
        return f"{self.user},{self.vote}"
    def banned():
        votes = Vote.objects.all()
        arr = [0]*32
        for vote in votes:
            arr[vote.vote.id] += 1
        nfc = 0
        afc = 0
        for i in range(len(arr)):
            team = Team.objects.get(id = i)
            if team.nfc and arr[nfc] < arr[i]:
                nfc = team.id
            elif not team.nfc and arr[afc] < arr[i]:
                afc = team.id
        for team in Team.objects.all():
            team.banned = False
            team.save()
        a = Team.objects.get(id = afc)
        a.banned =True
        a.save()
        a = Team.objects.get(id = nfc)
        a.banned =True
        a.save()

def fourmore(obj):
    bruh = obj.avgmarg()
    return obj.win + (bruh/1000)

class Student(User):
    win = models.IntegerField(default = 0)
    loss = models.IntegerField(default = 0)
    tie = models.IntegerField(default= 0)
    score = models.IntegerField(default = 0)
    dorm = models.CharField(max_length=10,blank = True,default = "")
    uuid = models.UUIDField(default = uuid4)
    fav_team = models.ForeignKey('Team',on_delete = models.PROTECT,name = "users")
    phone = models.TextField()
    stop = models.BooleanField(default= False)
    def calculate():
        students = Student.objects.all()
        for student in students:
            student.calculateWins()
            student.calculateScore()
    def winningDivision():
        dorms = Student.gimmedorms()
        for dorm in dorms:
            students = Student.objects.filter(dorm = dorm['abbr'])
            win = 0
            score = 0
            for student in students:
                win += student.win
                score += student.score
            win/= len(students)
            score /= len(students)
            dorm['win'] = win
            dorm['score'] = score
        #selection sort
        for i in range(len(dorms)-1):
            switch = i
            for j in range(len(dorms) - i-1):
                if dorms[j]['win'] < dorms[j+1]['win']:
                    switch = j + 1
                elif dorms[j]['win'] == dorms[j+1]['win']:
                    if dorms[j]['score'] < dorms[j+1]['score']:
                        switch = j + 1
            if i != switch:
                temp = dorms[i]
                dorms[i] = dorms[switch]
                dorms[switch] = temp
        return dorms[0]

    def image(self):
        return self.users.image()
    def gimmedorms(bruh = None):
        dorms = [{"name":"Heise","abbr":"HEI"},{"name":"Powless","abbr":"POW"}]
        if not bruh:
            return dorms
        else:
            for dom in dorms:
                if dom['abbr'] == bruh:
                    return dom
            return False
            # return Student.search(bruh,dorms,len(dorms)//2)
    def search(target,list,index):
        # for dorm in dorms:
        #     if dorm['abbr'] == dom:
        #         return dorm
        # return False
        log = int(math.log(len(list),2))
        counter = 0
        while counter < log + 1:
            counter += 1
            if(target == list[index]['abbr']):
                return list[index]
            if(target > list[index]['abbr']):
                index = int(2**(log - counter))+index
            else:
                index = index-int(2**(log-counter))
        return False
    def checkdorms(dom):
        dorms = Student.gimmedorms()
        for dorm in dorms:
            if dorm['abbr'] == dom:
                return True
        return False
    def __str__(self):
        return f"{self.last_name},{self.first_name}"
    def standings(arg):
        if arg == "all":
            students = Student.objects.order_by("-win").prefetch_related("picks__team__home").prefetch_related("picks__team__away").all()
        else:
            students = Student.objects.filter(dorm = arg).order_by('-win').all()
        students = [*students]
        students.sort(key = fourmore)
        return students
    def calculateWins(self):
        win = 0
        loss = 0
        tie = 0
        picks = Pick.objects.filter(picker = self).all()
        for pick in picks:
            stat = pick.status()
            if stat != "nocontest":
                if stat == "win":
                    win += 1
                elif stat == "tie":
                    tie += 1
                else:
                    loss +=1
        self.win = win
        self.loss = loss
        self.tie = tie
        self.save()
    def getWins(self):
        return f"{self.win}-{self.loss}-{self.tie}"
    def calculateScore(self):
        picks = Pick.objects.filter(picker = self).all()
        score = 0
        for pick in picks:
            game = pick.game()
            score += game.home_score - game.away_score if pick.home else game.away_score - game.home_score
        self.score = score
        self.save()
    def avgmarg(self):
        picks = Pick.objects.filter(picker = self,).all()
        dream = 0
        picks_to_count = 0
        for pick in picks:
            game = pick.game()
            if game.winlosstie(pick.team) != "nocontest":
                picks_to_count += 1
                dream += game.home_score - game.away_score if pick.home else game.away_score - game.home_score
        return 0 if len(picks) == 0 else dream/picks_to_count


class Team(models.Model):
    name = models.TextField()
    nfc = models.BooleanField(default = False)
    uuid = models.UUIDField(default = uuid4)
    by = models.IntegerField()
    banned = models.BooleanField(default = False)
    abbr = models.CharField(max_length=3)
    def __str__(self):
        return f"{self.name}-{self.division()} WLT: {self.wltstr()}"
    def division(self):
        return "NFC" if self.nfc else "AFC"
    def image(self):
        return f"/static/logos/{self.name}.png"
    def wlt(self):
        games = [*self.home_games.all(),*self.away_games.all()]
        dict = {"win":0,"loss":0,"tie":0}
        for game in games:
            key = game.winlosstie(self)
            if key != "nocontest":
                dict[key] += 1
        return dict
    def wltstr(self):
        wlt = self.wlt()
        return f"{wlt['win']}-{wlt['loss']}-{wlt['tie']}"


class Temp(models.Model):
    uuid = models.UUIDField(default = uuid4,unique = True)
    key = models.TextField(unique = True)
    user = models.ForeignKey(Student,on_delete = models.CASCADE,related_name = "temp")
    date = models.DateTimeField(default = timezone.now)
    used = models.BooleanField(default = False)

class Game(models.Model):
    home = models.ForeignKey(Team,on_delete = models.CASCADE,related_name = "home_games")
    away = models.ForeignKey(Team,on_delete = models.CASCADE,related_name = "away_games")
    home_score = models.IntegerField()
    away_score = models.IntegerField()
    uuid = models.UUIDField(default =uuid4)
    week = models.ForeignKey(Weeks,on_delete = models.CASCADE,related_name = "games")
    time = models.DateTimeField(default = timezone.now)
    def __str__(self):
        return f"Home:{self.home}-{self.home_score},Away:{self.away}-{self.away_score},{self.week}"
    def givemegame(team,week):
        game = Game.objects.filter(home= team,week = week).all()
        if game:
            return {'game':game[0],'home':True}
        else:
            return {'game':Game.objects.filter(away= team,week = week).all()[0],'home':False}
    def winlosstie(self,team):
        if self.home_score == self.away_score:
            if self.home_score == 0:
                return "nocontest"
            return "tie"
        elif (team == self.home and self.home_score > self.away_score) or (team != self.home and self.home_score < self.away_score):
            return "win"
        else:
            return "loss"

class Pick(models.Model):
    picker = models.ForeignKey(Student,on_delete = models.CASCADE,related_name = "picks")
    team = models.ForeignKey(Team,on_delete = models.CASCADE,related_name = "picks",null = True,default =None)
    home = models.BooleanField()
    week = models.ForeignKey(Weeks,on_delete = models.CASCADE,related_name = "picks",null = True,default =None)
    def __str__(self):
        return f"{self.picker},{self.game()}"
    def game(self):
        attr = "home" if self.home else "away"
        game = Game.objects.get(week = self.week, **{attr:self.team})
        return game
    def oppose(self):
        game = self.game()
        return game.away if self.home else game.home
    def status(self):
        game = self.game()
        return game.winlosstie(self.team)
    def color(self):
        yes = self.game().winlosstie(self.team)
        if yes == "tie" or yes == "nocontest":
            return "gray"
        elif yes == "win":
            return "#1aff00"
        else:
            return "red"
    def score(self):
        game = self.game()
        if self.home:
            return f"{game.home_score}-{game.away_score}"
        else:
            return f"{game.away_score}-{game.home_score}"
