from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("api/login", views.login),
    path("api/signup",views.signup),
    path("api/announcements", views.announcements),
    path("api/loggedin",views.loggedin),
    path("api/logout", views.logout),
    path("api/vote", views.vote),
    path("api/hof",views.hof)
]
