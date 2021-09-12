from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("api/login", views.login),
    # path("api/signup",views.signup),
    path("api/announcements", views.announcements),
    path("api/loggedin",views.loggedin),
    path("api/logout", views.logout),
    path("api/vote", views.vote),
    path("api/hof",views.hof),
    path("api/votes",views.votes),
    path("api/get_picks", views.get_picks),
    path("api/pick",views.pick),
    path("api/mypicks",views.my_picks),
    path("api/picks/<str:user_id>",views.get_user_picks),
    path("api/weekly_picks/week/<str:week_num>", views.weekly_picks),
    path("api/standings",views.get_standings),
    path("api/update_standings", views.update_standings)
]
