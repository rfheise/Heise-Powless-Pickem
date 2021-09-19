from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .api import Payload,UnknownError,parsePost
from .Exceptions import AuthenticationException
from django.contrib.auth import login, authenticate
from .models import User, Announcements, Vote, HallOfFame, Game, Week, Team, Pick
from django.utils import timezone
from .apiModels import AnnouncementSerializer, \
    HallOfFameSerializer, TeamSerializer, UserSerializer, GameSerializer, PickSerializer, WeekSerializer
from rest_framework.authtoken.models import Token
# Create your views here.

#user login
@api_view(["POST"])
# @UnknownError
def login(request):
    username = request.POST['username'].lower()
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    payload = Payload(False, "Username or Password Invalid")
    if not user:
        return payload.apiQuery()
    Token.objects.filter(user=user).all().delete()
    token = Token.objects.create(user=user)
    if token:
        payload = Payload(True, {"token":str(token)})
    return payload.apiQuery()

#user sign-up
@api_view(["POST"])
# @UnknownError
def signup(request):
    try:
        post = parsePost(request)
        user = User.create_user(**post)
        user = authenticate(request, username=post["username"].lower(), password=post["password"])
        payload = Payload(False, "Username or Password Invalid")
        Token.objects.filter(user=user).all().delete()
        token = Token.objects.create(user=user)
        if token:
            payload = Payload(True, {"token":str(token)})
        return payload.apiQuery()
    except AuthenticationException as e:
        return Payload(False, e.message).apiQuery()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@UnknownError
def loggedin(request):
    payload = Payload(True, True)
    return payload.apiQuery()

#clears login token
@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    payload = Payload(True, True)
    return payload.apiQuery()
#announcement query api
#returns list of announcement objects
@api_view(["GET"])
def announcements(request):
    #gets all announcements
    announcements = AnnouncementSerializer(
        Announcements.objects.order_by("-timestamp"), many = True
    )
    payload = Payload(True, announcements.data)
    #returns announcement api data
    return payload.apiQuery()

#returns hall of fame data
@api_view(["GET"])
def hof(request):
    hofs = HallOfFameSerializer(
        HallOfFame.objects.order_by("-year"), many = True
    )
    payload = Payload(True, hofs.data)
    return payload.apiQuery()
@api_view(["GET"])
#api end-point for querying the current week
def get_current_week(request):
    currentWeek = Week.getCurrentWeek()
    serializedWeek = WeekSerializer(currentWeek, many = False)
    payload = Payload(True, serializedWeek.data)
    return payload.apiQuery()
@api_view(["POST"])
@permission_classes([IsAuthenticated])
# @UnknownError
def vote(request):
    user = request.user
    post = parsePost(request)
    if (Vote.objects.filter(user=user).count() > 0):
        payload = Payload(False, "Already Voted")
        return payload.apiQuery()
    if post['vote1'] == post['vote2'] or post['vote2'] == post['vote3'] or post['vote1'] == post['vote3']:
        return Payload(False, "Error Duplicate Team").apiQuery()
    Vote.createVote(user, post['vote1'])
    Vote.createVote(user, post['vote2'])
    Vote.createVote(user, post['vote3'])
    return Payload(True, "Vote Recorded").apiQuery()
@api_view(["GET"])
@permission_classes([IsAuthenticated])
#returns valid teams for player
#returns games for most recent week 
def get_picks(request):
    user = request.user 
    teams = user.getAvailablePicks()
    week = Week.getCurrentWeek()
    games = Game.objects.filter(week = week).all()
    data = {
        "games": GameSerializer(games, many = True).data,
        "teams": TeamSerializer(teams, many = True).data
    }
    payload = Payload(True, data)
    return payload.apiQuery()
@api_view(["GET"])
#gets picks for a user id and returns them
def get_user_picks(request, user_id):
    user = get_object_or_404(User, uuid = user_id)
    week = Week.getCurrentWeek()
    picks = Pick.objects.filter(picker = user, week__year = week.year).order_by("-week__week")
    return Payload(True, PickSerializer(picks, many = True).data).apiQuery()

@api_view(['GET'])
#gets current standings
def get_standings(request):
    #gets standings
    standings = User.getStandings()
    #serializes standings
    standings = UserSerializer(standings, many = True)
    payload = Payload(True, standings.data)
    return payload.apiQuery()

@api_view(["GET"])
def update_standings(request):
    User.calculateStandings()
    return Payload(True, "Success").apiQuery()
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pick(request):
    user = request.user
    #parse post and make sure team is in passed in args
    post = parsePost(request)
    if "team" not in post.keys():
        return Payload(False, "Missing Field").apiQuery()
    #get most recent game from team passed in
    try:
        team = Team.objects.get(name = post['team'])
    except:
        return Payload(False, "Team Not Found").apiQuery()
    if team not in user.getAvailablePicks():
        return Payload(False, "Team Already Picked/Banned").apiQuery()
    week = Week.getCurrentWeek()
    game = Game.getGame(team, week)
    #make sure game is valid
    if game.date < timezone.now():
        return Payload(False, "Game Already Started").apiQuery()
    try:
        pick = Pick.objects.get(week = week, picker = user)
        game = pick.getGame()
        if game.date < timezone.now():
            return Payload(False, "Picked Game Already Started").apiQuery()
        pick.team = team 
        pick.date = timezone.now()
        pick.save()
    except:
        Pick.objects.create(picker = user, team = team, week = week)
    return Payload(True, "Success").apiQuery()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_picks(request):
    user = request.user
    week = Week.getCurrentWeek()
    picks = Pick.objects.filter(picker=user, week__year = week.year).select_related("picker", "week", "team").order_by("-week__week")
    serializedPicks = PickSerializer(picks, many = True)
    return Payload(True, serializedPicks.data).apiQuery()
@api_view(["GET"])
def weekly_picks(request, week_num):
    curr_week = Week.getCurrentWeek()
    picks = Pick.objects.filter(week__year = curr_week.year, week__week = week_num).select_related("picker", "week", "team").all()
    return Payload(True, PickSerializer(picks, many = True).data).apiQuery()
@api_view(["GET"])
#tallies votes and returns who voted what
def votes(request):
    votes = Vote.tally()
    picks = Vote.picks()
    #turn votes into json object
    serializedVotes = []
    serializedPicks = []
    for vote in votes:
        serializedVotes.append(TeamSerializer(vote['team'], many = False).data)
    #turn picks into json object
    for pick in picks:
        serializedPicks.append(
            {"votes":pick['votes'],
            "user":UserSerializer(pick['user'], many = False).data}
        )
    payload = Payload(True, {
        "teams": serializedVotes,
        "picks":serializedPicks
    })
    return payload.apiQuery()