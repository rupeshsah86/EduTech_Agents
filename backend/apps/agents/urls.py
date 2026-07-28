from django.urls import path
from .views import CodeMentorSandboxView, QuizGeneratorView, PDFTutorRAGView

urlpatterns = [
    path('code-mentor/execute/', CodeMentorSandboxView.as_view(), name='code_mentor_sandbox'),
    path('quiz/generate/', QuizGeneratorView.as_view(), name='quiz_generator'),
    path('pdf-tutor/upload/', PDFTutorRAGView.as_view(), name='pdf_tutor_rag'),
]
