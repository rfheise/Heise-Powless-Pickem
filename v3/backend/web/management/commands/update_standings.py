from django.core.management.base import BaseCommand, CommandError
from web.models import User 

class Command(BaseCommand):
    help = "Update Standings"

    def handle(self, *args, **kwargs):
        User.calculateStandings()