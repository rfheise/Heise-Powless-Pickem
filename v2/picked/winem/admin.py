from django.contrib import admin
from .models import Weeks,Vote,Student,Team,Game,Pick
from django.contrib.auth.models import Permission

admin.site.register(Weeks)
admin.site.register(Vote)
admin.site.register(Student)
admin.site.register(Team)
@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ["week","home","home_score","away","away_score"]
    list_filter = ["week"]
    search_fields = ["home__name", "away__name"]
admin.site.register(Pick)
admin.site.register(Permission)
