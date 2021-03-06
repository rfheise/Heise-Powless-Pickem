# Generated by Django 2.2.3 on 2019-09-05 23:52

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('heisefootball', '0003_auto_20190905_1850'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teams',
            name='eid',
        ),
        migrations.AddField(
            model_name='matchups',
            name='eid',
            field=models.IntegerField(default='1'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pickers',
            name='verification',
            field=models.IntegerField(default=608776832),
        ),
        migrations.AlterField(
            model_name='weeklypicks',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2019, 9, 5, 18, 52, 29, 856199)),
        ),
    ]
