from django.core.management.base import BaseCommand, CommandError
from web.models import * 
from web.game_data import get_live_scores, update_week_scores

class Command(BaseCommand):
    help = "Update Scores"

    def handle(self, *args, **kwargs):
        update_week_scores()
        User.calculateStandings()