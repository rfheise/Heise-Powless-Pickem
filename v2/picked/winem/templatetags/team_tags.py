from django import template
from ..models import Student

register = template.Library()

@register.filter(name="moon")
def moon(user):
    user = Student.objects.get(username = user)
    return user.image()
