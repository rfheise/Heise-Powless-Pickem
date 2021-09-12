from django.contrib import admin
from .models import HallOfFame, User, Announcements, Vote, Pick, Game, Week, Team
# Register your models here.
admin.site.register(User)
admin.site.register(Announcements)
admin.site.register(Vote)
admin.site.register(HallOfFame)
admin.site.register(Pick)
admin.site.register(Week)
admin.site.register(Team)
@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("home", "away", "week")
    list_filter = ("week__week", "week__year")
    search_fields = ("home__name__icontains","away__name__icontains")