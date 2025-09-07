from django.core.management.base import BaseCommand, CommandError
from web.models import * 
from web.game_data import get_live_scores

class Command(BaseCommand):
    help = "Update Scores"

    def handle(self, *args, **kwargs):
        current_week = Week.getCurrentWeek()
        print(current_week)
        get_live_scores(current_week.week, current_week.year)
        User.calculateStandings()