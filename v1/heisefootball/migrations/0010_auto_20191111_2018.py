# Generated by Django 2.2.3 on 2019-11-12 02:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('heisefootball', '0009_auto_20191111_2017'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mesa',
            name='mesag',
            field=models.TextField(default='hi'),
        ),
        migrations.AlterField(
            model_name='pickers',
            name='verification',
            field=models.IntegerField(default=369040196),
        ),
        migrations.AlterField(
            model_name='weeklypicks',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2019, 11, 11, 20, 18, 22, 620555)),
        ),
    ]
