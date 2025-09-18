from rest_framework.response import Response
from rest_framework import authentication
from .models import User
from django.contrib.auth import login, authenticate

class Payload():
    #initializes payload
    def __init__(self, success, payload):
        self.success = success 
        self.payload = payload 
    #converts object to json
    def toJson(self):
        return {
            "success":self.success,
            "payload":self.payload
        }
    def apiQuery(self):
        json = self.toJson()
        #returns rendered json
        return Response(json)

def UnknownError(func):
    def wrapper(request, *args, **kwargs):
        try:
            return func(request, *args, **kwargs)
        except:
            return Payload(False, "Unknown Error Occured").apiQuery()
    return wrapper

#parses request of a particular method
def parse(request,method):
    #get req object
    req = getattr(request,method)
    #create empty dict and populate it with keys from req
    post = {}
    for key in req.keys():
        post[key] = req[key]
    for key in request.FILES.keys():
        post[key] = request.FILES[key]
    return post
    
#wrapper for parse
def parsePost(request):
    return parse(request, "POST")

class Auth(authentication.BaseAuthentication):
    def authenticate(self, request):
        username = request.POST['username']
        password = request.POST['password']
        if not username or not password:
            return None
        user = authenticate(request, username = username, password= password)
        if user:
            print("here bruh")
            return (user, None)
        else:
            return None