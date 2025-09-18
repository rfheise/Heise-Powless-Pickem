import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')
os.environ.setdefault("DJANGO_SETTINGS_MODULE","pickem.settings")




app = Celery('pickem',
             broker='amqp://rfheise:35134rfh@161.35.124.49:5672/vhost',
             backend='amqp://rfheise:35134rfh@161.35.124.49:5672/vhost',
             include=['winem.tasks'])
app.conf.timezone = 'America/New_York'
app.conf.beat_schedule = {
    'make_deadline': {
        'task': 'winem.tasks.messages',
        'schedule': crontab(minute="0",hour="12",day_of_week="sun"),
    },
    'games_start': {
        'task': 'winem.tasks.let_games_begin',
        'schedule': crontab(minute="0",hour="13",day_of_week="sun"),
    },
    'update_scores':{
        'task': 'winem.tasks.update_scores',
        'schedule': crontab(minute="0",hour="3",day_of_week="tue")
    },
    'update_week':{
        'task': 'winem.tasks.update_week',
        'schedule':crontab(minute="0",hour="10",day_of_week="thu")
    },
}


# Optional configuration, see the application user guide.
app.conf.update(
    result_expires=3600,
)
app.config_from_object('django.conf:settings', namespace='CELERY')
#gets all tasks from all the other apps installed under django settings
app.autodiscover_tasks()
if __name__ == '__main__':
    app.start()


#used to tell you when a task is running
@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
