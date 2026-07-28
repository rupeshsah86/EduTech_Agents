from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ai_services.agents.code_mentor.agent import CodeMentorAgent
from ai_services.agents.quiz_master.agent import QuizMasterAgent
from ai_services.agents.pdf_tutor.agent import PDFTutorAgent

class CodeMentorSandboxView(APIView):
    """
    CodeMentor AI DSA Code Sandbox Execution & Big-O Analyzer endpoint.
    """
    permission_classes = []

    def post(self, request):
        prompt = request.data.get('prompt', '')
        agent = CodeMentorAgent()
        result = agent.execute(prompt=prompt)
        return Response(result, status=status.HTTP_200_OK)

class QuizGeneratorView(APIView):
    """
    QuizMaster AI Adaptive Quiz & SM-2 Flashcard Generator endpoint.
    """
    permission_classes = []

    def post(self, request):
        topic = request.data.get('topic', 'Data Structures')
        count = request.data.get('count', 5)
        agent = QuizMasterAgent()
        result = agent.execute(topic=topic, count=count)
        return Response(result, status=status.HTTP_200_OK)

class PDFTutorRAGView(APIView):
    """
    PDFTutor AI Multi-Document RAG & PDF reasoning endpoint.
    """
    permission_classes = []

    def post(self, request):
        query = request.data.get('query', '')
        doc_ids = request.data.get('document_ids', ['doc_1', 'doc_2'])
        agent = PDFTutorAgent()
        result = agent.execute(document_ids=doc_ids, query=query)
        return Response(result, status=status.HTTP_200_OK)
