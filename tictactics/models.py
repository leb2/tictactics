from django.db import models
from django.contrib.auth.models import User

class Model(models.Model):
    num = models.IntegerField(default=0)
    text = models.CharField(max_length=200)
