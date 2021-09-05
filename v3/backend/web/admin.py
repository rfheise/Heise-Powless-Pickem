from django.contrib import admin
from .models import HallOfFame, User, Announcements, Vote
# Register your models here.
admin.site.register(User)
admin.site.register(Announcements)
admin.site.register(Vote)
admin.site.register(HallOfFame)