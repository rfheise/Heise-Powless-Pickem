from rest_framework.decorators import api_view
from rest_framework.response import Response



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