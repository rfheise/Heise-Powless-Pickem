from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from .models import Announcements, HallOfFame, User

class UserSerializer(serializers.ModelSerializer):
    # propic = serializers.ReadOnlyField(source = "propic.image.url")
    class Meta:
        model = User
        fields = ['first_name','last_name','propic','username']

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