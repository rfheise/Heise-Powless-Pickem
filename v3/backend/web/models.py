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
    finished = models.BooleanField(default = False)
    uuid = models.UUIDField(default = uuid4, unique = True)
    #nfl year
    year = models.IntegerField()
    #type of week
    week_type = models.TextField(choices = [
        ("REG", "REG"),
        ("PRE", "PRE"),
        ("OFF","OFF"),
        ("POST","POST")
    ], default = "Regular Season")
    def __str__(self):
        return f"{self.week}-{self.year}"
    def getCurrentWeek():
        #orders weeks decending by year and accending by week
        week = Week.objects.filter(finished = False).order_by("-year","week")
        #grabs first week from most recent year that is not finished
        if not week:
            return Week.objects.last()
        else:
            week = week[0]
        return week
class Game(models.Model):
    #away team
    away = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "away_games")
    #home team
    home = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "home_games")
    #away score
    away_score = models.IntegerField(default = 0)
    #home score
    home_score = models.IntegerField(default = 0)
    #week of game
    week = models.ForeignKey(Week, on_delete = models.CASCADE, related_name = "games")
    #day of game
    date = models.DateTimeField(default = timezone.now, blank = True)
    #qb away
    qb_away = models.TextField(blank = True, default = "")
    #qb home 
    qb_home = models.TextField(blank = True, default = "")
    #coach_home 
    coach_home = models.TextField(blank = True, default = "")
    #coach_away 
    coach_away = models.TextField(blank = True, default = "")
    #espn game id in case I need espn api
    espnId = models.IntegerField(default = 0)
    def strTime(self):
        return timezone.localtime(self.date).strftime("%m/%d/%Y %I:%M %p")
    def getGame(team, week):
        try:
            return Game.objects.get(home=team, week = week)
        except:
            return Game.objects.get(away = team, week = week)
class Pick(models.Model):
    # user who made pick
    picker = models.ForeignKey("User", on_delete = models.CASCADE, related_name = "picks")
    #week of pick
    week = models.ForeignKey(Week, on_delete = models.CASCADE, related_name = "picks")
    #team picked
    team = models.ForeignKey(Team, on_delete = models.CASCADE, related_name = "picks")
    #log date
    date = models.DateTimeField(default = timezone.now())
    def __str__(self):
        return f"{self.week} - {self.picker} - {self.team}"
    def game(self):
        return Game.getGame(self.team, self.week)
    #returns quality score of pick
    #used in calculating avg marg and standings
    def quality_score(self):
        game = self.getGame()
        #calculate relative victory score
        relative_home = None 
        relative_opponent = None
        if self.team == game.home:
            relative_home = game.home_score 
            relative_opponent = game.away_score 
        else:
            relative_home = game.away_score 
            relative_opponent = game.home_score 
        #if negative they lost
        #if post they won
        #if 0 they tied
        relative_score = relative_home - relative_opponent
        return relative_score
    def result(self):
        game = self.getGame()
        relative_score = self.quality_score()
        if game.home_score == 0 and game.away_score == 0:
            return "no contest"
        elif relative_score > 0:
            return "win"
        elif  relative_score < 0: 
            return "loss"
        else:
            return "tie"
    def getGame(self):
        try:
            return Game.objects.get(home = self.team, week = self.week)
        except:
            return Game.objects.get(away = self.team, week = self.week)
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
        return f"{self.first_name} {self.last_name}"
    def create_user(**kwargs):
        kwargs['username'] = kwargs['username'].lower()
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
    def getAvailablePicks(self):
        week = Week.getCurrentWeek()
        picks = self.picks.filter(week__year = week.year).all()
        teams = [*Team.objects.filter(banned = False).exclude(bye = week).order_by("name")]
        for pick in picks:
            try:
                teams.remove(pick.team)
            except:
                pass
        return teams
    #returns array of users sorted by record
    def getStandings():
        # User.calculateStandings()
        print(User.getAllUsers())
        users = User.getAllUsers().order_by("-wins","loss","-ties", "-avg_margin")
        return users
    def getAllUsers():
        users_votes = Vote.objects.values_list("user",flat=True)
        users = User.objects.filter(id__in=set(users_votes)).all()
        return users
    #calcuates standings for all users
    def calculateStandings():
        users = User.getAllUsers()
        #iterate over all users
        for user in users:
            # checks to see if user has voted this year
            if Vote.objects.filter(user=user).exists():
                user.calculateStanding() 
    #returns a rounded average margin
    def roundMargin(self):
        return "{:.5g}".format(self.avg_margin)
    #updates quality_points along the way
    def calculateStanding(self):
        week = Week.getCurrentWeek()
        #get all picks for current year
        picks = Pick.objects.filter(picker = self, week__year = week.year).all()
        #init standings to 0
        self.wins = 0
        self.ties = 0
        self.loss = 0
        #iterate over all picks 
        #calculates quality_points along the way
        quality_points = 0
        #only include finsihed games in avg-margin of victory average
        #i.e. if they have an uncompleted pick don't count it as part of the average
        completed_games = len(picks)
        for pick in picks:
            #gets result from pick
            result = pick.result()
            #based upon the result it updates user standings
            if result == "win":
                self.wins += 1
            elif result == "loss":
                self.loss += 1 
            elif result == "tie":
                self.ties += 1
            else:
                #game was not completed subtract one from picks
                completed_games -= 1
            #if result is undefined do nothing
            quality_points += pick.quality_score()
        if completed_games > 0:
            self.avg_margin = quality_points/completed_games
        else:
            self.avg_margin = 0
        self.save()


class Vote(models.Model):
    team = models.ForeignKey(Team, on_delete = models.CASCADE, related_name="votes")
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name= "votes")
    
    #creates a vote from a user object and team name as string
    def createVote(user, team):
        team = Team.objects.get(name = team)
        return Vote.objects.create(team = team, user = user)
    #return user and what teams they voted for in form
    # {
    #  user: userObj
    #  votes: Vote Str
    # }
    def picks():
        users = User.objects.prefetch_related("votes").all()
        picks = []
        #iterate over all users
        for user in users:
            #get all votes for a user
            votes = user.votes.all() 
            voteStr = ""
            #add votes to a string
            for vote in votes:
                voteStr += f"{vote.team.name} "
            if len(votes) > 0:
                #add user votes to picks if 
                #user has valid picks
                picks.append( {
                    "user":user,
                    "votes":voteStr
                })
        return picks
    #returns array of teams and the number of votes they had
    # i.e {
    # vote: voteCount,
    # team: teamObj
    # }
    def tally():
        votes = Vote.objects.select_related("team").all()
        teams = {}
        #calculate all votes for each team
        for vote in votes:
            #check if team in list
            if str(vote.team.uuid) in teams.keys():
                teams[str(vote.team.uuid)]['votes'] +=  1
            else:
                #if not add them in this format
                teams[str(vote.team.uuid)] = {
                    "team":vote.team,
                    "votes":1
                }
        #sort used to sort votes list
        def sortTallies(obj):
            return (-1 *obj['votes'])
        votes = []
        for team in teams.items():
            votes.append(team[1])
        votes.sort(key=sortTallies)
        return votes[:3]
        

            
    def __str__(self):
        return f"{str(self.team)}-{str(self.user)}"

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