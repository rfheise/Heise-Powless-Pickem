from django.urls import path,include
from . import views
urlpatterns = [
    path('darules',views.serve("da-rules.html"),name = "rules"),
    # path("vote",views.vote,name = "vote"),
    path("pick",views.pick,name = "pick"),
    path("mypicks",views.mypicks,name = "my picks"),
    path("login",views.serve("login.html"),name = "login"),
    path("hatetheotherside",views.login_api,name = "login_api"),
    path("logout",views.logouted,name = "logout"),
    path("signup",views.serve("sign-up.html"),name = "signup"),
    path("juicywrld",views.signup,name = "signupapi"),
    path("",views.standings,name = "standings"),
    path("division/<str:dorm>",views.standing,name=  "standings dorm"),
    path("weeklypicks",views.serve("picks.html")),
    path("currentweekpicks",views.pick_api),
    # path("forgot_username",views.serve("chevy.html")),
    path("yellowbrickroad",views.standing_api,name = "standing api"),
    path("forgot_username",views.view_username,name = "forgot username"),
    path("reset_password",views.reseted_password,name = "resetpassword"),
    path("forgot_password",views.reset_password,name = "forgot password"),
    path("userpicks/<str:uuid>",views.user_picks,name ="user picks"),
    path("updateweek",views.updateweek,name = "update week")
]
