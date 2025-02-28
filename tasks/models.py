from django.db import models

# Create your models here.
class Task(models.Model):
    category = models.CharField(max_length=20)
    description = models.TextField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()

    def __str__(self):
        return self.description