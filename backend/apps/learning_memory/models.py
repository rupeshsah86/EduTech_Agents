import uuid
from django.db import models
from django.contrib.auth.models import User

class Flashcard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcards')
    front = models.TextField()
    back = models.TextField()
    interval_days = models.IntegerField(default=1)
    ease_factor = models.FloatField(default=2.5)
    repetitions = models.IntegerField(default=0)
    next_review = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'flashcards'

class UserMemory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memories')
    memory_type = models.CharField(max_length=100)
    content = models.TextField()
    importance_score = models.FloatField(default=1.0)
    last_recalled = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_memories'
