from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from .models import Announcements, HallOfFame, User, Team, Week, Game, Pick

class WeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = Week 
        fields = ['week','year','week_type','uuid']

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['abrv','banned','name','uuid','bye','logo']

class UserSerializer(serializers.ModelSerializer):
    win = serializers.ReadOnlyField(source = "wins")
    tie = serializers.ReadOnlyField(source = "ties")
    avg_margin = serializers.ReadOnlyField(source = "roundMargin")
    class Meta:
        model = User
        fields = ['first_name','last_name','propic','username','uuid',
            'win', 'tie','loss','avg_margin']

class AnnouncementSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True, many = False)
    timestamp = serializers.ReadOnlyField(source = "strTime")
    class Meta:
        model = Announcements 
        fields = ['user','announcement','timestamp']

class HallOfFameSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True, many = False)
    class Meta:
        model = HallOfFame
        fields = ['user', 'year', 'record']
class PickSerializer(serializers.ModelSerializer):
    week = WeekSerializer(read_only = True, many = False)
    picker = UserSerializer(read_only = True, many = False)
    team = TeamSerializer(read_only = True, many = False)
    class Meta:
        model = Pick 
        fields = ['week','picker','team','result']

class GameSerializer(serializers.ModelSerializer):
    date = serializers.ReadOnlyField(source = "strTime")
    home = TeamSerializer(read_only = True, many = False)
    away = TeamSerializer(read_only = True, many = False)
    week = WeekSerializer(read_only =  True, many = False)
    class Meta:
        model = Game 
        fields = ['home','away','home_score','away_score','week','date']