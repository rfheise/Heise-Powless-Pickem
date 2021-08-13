from django.db import models
from uuid import uuid4
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
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
    date = models.DateTimeField(default = timezone.now())

class User(AbstractUser):
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
    

class Pick(models.Model):
    # user who made pick
    picker = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "picks")
    #week of pick
    week = models.ForeignKey(Week, on_delete = models.CASCADE, related_name = "picks")
    #team picked
    team = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "picks")



