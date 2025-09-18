from django.contrib.auth.decorators import login_required

def login_req():
    return (lambda request:login_required(request,login_url = "/login"))
