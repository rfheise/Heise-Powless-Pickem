# Generated by Django 3.1.4 on 2021-09-06 02:40

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0012_week_finished'),
    ]

    operations = [
        migrations.AddField(
            model_name='pick',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2021, 9, 6, 2, 40, 34, 799364, tzinfo=utc)),
        ),
    ]
