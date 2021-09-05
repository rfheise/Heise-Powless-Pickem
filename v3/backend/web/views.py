from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .api import Payload,UnknownError,parsePost
from .Exceptions import AuthenticationException
from django.contrib.auth import login, authenticate
from .models import User, Announcements, Vote, HallOfFame
from django.utils import timezone
from .apiModels import AnnouncementSerializer, HallOfFameSerializer
from rest_framework.authtoken.models import Token
# Create your views here.

#user login
@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
# @UnknownError
def login(request):
    username = request.POST['username']
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
        user = authenticate(request, username=post["username"], password=post["password"])
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
@authentication_classes([])
@permission_classes([])
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
