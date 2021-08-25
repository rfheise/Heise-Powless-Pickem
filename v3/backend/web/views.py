from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .api import Payload,UnknownError,parsePost
from .Exceptions import AuthenticationException
from django.contrib.auth import login, authenticate
from .models import User
# Create your views here.

#user login
@api_view(["POST"])
@UnknownError
def login(request):
    username = request.POST['uname']
    password = request.POST['pword']
    user = authenticate(request, username=username, password=password)
    payload = Payload(False, "Username or Password Invalid")
    if user:
        payload = Payload(True, "Successfully Logged In")
        login(request._request, user)
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
        if user:
            payload = Payload(True, "Successfully Logged In")
            login(request._request, user)
        return payload.apiQuery()
    except AuthenticationException as e:
        return Payload(False, e.message).apiQuery()
