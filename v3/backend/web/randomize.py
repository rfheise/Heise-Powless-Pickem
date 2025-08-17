from .models import *
from random import randint

#just run a very basic test
#if I have more time ill run django test
def test():
    banTeams()
    finishGames()
    makePicks() 

def banTeams():
    teams = Vote.tally()
    #reset ban
    for team in Team.objects.all(): 
        team.banned = False 
        team.save()
    #get teams from votes and ban them
    for team in teams:
        team['team'].banned = True 
        team['team'].save()
def finishGames():
    games = Game.objects.all()
    for game in games:
        game.home_score = randint(1,100)
        game.away_score = randint(1,100)
        game.save()
def makePicks():
    users = User.objects.all()
    #reset picks
    Pick.objects.all().delete()
    #iterate over users
    weeks = Week.objects.filter(year = Week.getCurrentWeek().year).all()
    for user in users:
        #make a pick each week
        for week in weeks:
            available = user.getAvailablePicks() 
            Pick.objects.create(picker = user, week = week,
                team = available[randint(0, len(available) - 1)])
            #update weeks
            week.finished = True 
            week.save()
        #clear weeks for next users
        for week in weeks:
            week.finished = False 
            week.save() 
    #mark finished when done 
    for week in weeks:
        week.finsihed = True 
        week.save() 


