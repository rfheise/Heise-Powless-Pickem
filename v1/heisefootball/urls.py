from django.urls import path

from . import views

urlpatterns = [
    path("minecraft.csv",views.spreadsheet,name = "spreadsheet"),
    path("login",views.logined,name = "login"),
    path("logout",views.logouted,name ="logout"),
    path("newpick",views.index, name = "index"),
    path("",views.message, name = "message"),
    path("weeks",views.weeksbruh, name ="weeks"),
    path("weeks/picks/<str:week_id>",views.allpicks,name = "picks"),
    path("standings",views.standings,name= "standings"),
    path("mypicks",views.mypicks,name ="mypicks"),
    path("matches/pick/<int:match_id>",views.matchupsbruh,name ="matchups"),
    path("picker/picks/<int:picker_id>",views.pickeredpicks, name = "picker")
]
