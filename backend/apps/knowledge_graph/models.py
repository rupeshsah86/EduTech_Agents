import uuid
from django.db import models
from django.contrib.auth.models import User

class KnowledgeNode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='knowledge_nodes')
    concept_name = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    mastery_score = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)
    last_reviewed = models.DateTimeField(null=True, blank=True)
    next_review_due = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'knowledge_nodes'

    def __str__(self):
        return f"{self.concept_name} ({self.subject}) - {self.mastery_score}%"

class KnowledgeEdge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_node = models.ForeignKey(KnowledgeNode, on_delete=models.CASCADE, related_name='outgoing_edges')
    target_node = models.ForeignKey(KnowledgeNode, on_delete=models.CASCADE, related_name='incoming_edges')
    relationship_type = models.CharField(max_length=100)
    weight = models.FloatField(default=1.0)

    class Meta:
        db_table = 'knowledge_edges'
