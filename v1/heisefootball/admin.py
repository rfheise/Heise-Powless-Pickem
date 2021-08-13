from django.contrib import admin
from .models import Teams,Pickers,weeklypicks,matchups,weeknumber,mesa,Year
# Register your models here.
admin.site.register(weeklypicks)
admin.site.register(Teams)
admin.site.register(Pickers)
admin.site.register(matchups)
admin.site.register(weeknumber)
admin.site.register(mesa)
admin.site.register(Year)
