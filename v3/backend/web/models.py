from django.db import models
from uuid import uuid4
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .Exceptions import InvalidKeyException, AuthenticationException
import re
# Create your models here.
class Team(models.Model):
    #boolean to represent whether team is banned or not
    banned = models.BooleanField(default = False)
    #team name
    name = models.CharField(max_length=256)
    #team abreviation
    abrv = models.CharField(max_length=5)
    #team uuid
    uuid = models.UUIDField(default = uuid4, unique = True)
    #bye week
    bye = models.ForeignKey("Week", on_delete = models.PROTECT,null = True, default = None)
    #logo
    logo = models.ImageField(upload_to = "logos",blank = True, default = "")

    def __str__(self):
        return self.name
class Week(models.Model):
    #week number
    week = models.IntegerField()
    uuid = models.UUIDField(default = uuid4, unique = True)
    #nfl year
    year = models.IntegerField()
    #type of week
    week_type = models.TextField(choices = [
        ("Regular Season", "Regular Season"),
        ("Preseason", "Preseason"),
        ("Offseason","Offseason"),
        ("Postseason","Postseason")
    ], default = "Regular Season")
class Game(models.Model):
    #home team
    home = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "home_games")
    #away team
    away = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "away_games")
    #away score
    away_score = models.IntegerField(default = 0)
    #home score
    home_score = models.IntegerField(default = 0)
    #week of game
    week = models.ForeignKey(Week, on_delete = models.CASCADE, related_name = "games")
    #day of game
    date = models.DateTimeField(default = timezone.now)

class User(AbstractUser):
    #required creation fields
    #constant
    required = ["propic","username","password","email","first_name","last_name",
        "cpassword"]
    #user profile picture
    propic = models.ImageField(upload_to = "propics")
    #user uuid
    uuid = models.UUIDField(default = uuid4, unique = True)
    #wins
    wins = models.IntegerField(default = 0)
    #losses
    loss = models.IntegerField(default = 0)
    #ties
    ties = models.IntegerField(default = 0)
    #avg_margin of victory
    avg_margin = models.FloatField(default = 0)
    def __str__(self):
        return f"{self.first_name}"
    def create_user(**kwargs):
        #make sure password exists
        keys = kwargs.keys()
        #make sure required fields exist
        for key in User.required:
            if key not in keys or kwargs[key] == None or kwargs[key] == "":
                raise AuthenticationException(f"Missing Required Field {key}")
        if "password" not in keys:
            raise InvalidKeyException()
        #don't even store the unhashed password in user object
        #for security reasons
        password = kwargs['password']
        cpassword = kwargs['cpassword']
        #validation check
        #make sure passwords match
        if (password != cpassword):
            raise AuthenticationException("Passwords do not match")
        #make sure password is at least a characters long
        if (len(password) < 8):
            raise AuthenticationException("Password must be at least 8 characters long")
        #make sure it has a number, and an upper and lowercase character
        if (not (re.search(".*[0-9].*",password) 
            and re.search(".*[a-z].*",password) 
            and re.search(".*[A-Z].*",password))):
            raise AuthenticationException("Password must have a lowercase letter, an uppercase letter, and a number")
        #make sure username and email are unique
        if User.objects.filter(username = kwargs['username']).exists() or User.objects.filter(email = kwargs['email']).exists():
            raise AuthenticationException("User already exists")
        kwargs.pop("password", None)
        kwargs.pop("cpassword",None)
        #save user object
        user = User(**kwargs)
        user.set_password(password)
        user.save()
        return user

class Vote(models.Model):
    team = models.ForeignKey(Team, on_delete = models.CASCADE, related_name="votes")
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name= "votes")
    
    #creates a vote from a user object and team name as string
    def createVote(user, team):
        team = Team.objects.get(name = team)
        return Vote.objects.create(team = team, user = user)
    def __str__(self):
        return f"{str(self.team)}-{str(self.user)}"
class Pick(models.Model):
    # user who made pick
    picker = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "picks")
    #week of pick
    week = models.ForeignKey(Week, on_delete = models.CASCADE, related_name = "picks")
    #team picked
    team = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "picks")

class HallOfFame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "dubs")
    year = models.IntegerField()
    record = models.TextField()
    def __str__(self):
        return f"{str(self.user)}-{self.year}"
class Announcements(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "announcements")
    timestamp = models.DateTimeField(default= timezone.now)
    announcement = models.TextField()
    
    def __str__(self):
        return self.announcement
    def strTime(self):
        return timezone.localtime(self.timestamp).strftime("%m/%d/%Y %I:%M %p")