from django.core.management.base import BaseCommand, CommandError
from web.models import Week

class Command(BaseCommand):
    help = "Update Standings"

    def handle(self, *args, **kwargs):
        Week.update_current_week()