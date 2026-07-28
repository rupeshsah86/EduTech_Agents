from django.urls import path
from .views import MasterAIChatView

urlpatterns = [
    path('chat/', MasterAIChatView.as_view(), name='master_ai_chat'),
]
