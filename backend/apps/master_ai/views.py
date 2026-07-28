import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ai_services.orchestrator.router import MasterAIOrchestrator

class MasterAIChatView(APIView):
    """
    Main Master AI Chat endpoint.
    Orchestrates intent classification, multi-agent dispatch, and state updates.
    Integrates live Groq API key (llama-3.3-70b-versatile).
    """
    permission_classes = []

    def post(self, request):
        prompt = request.data.get('prompt', '')
        groq_api_key = request.data.get('groq_api_key') or os.environ.get('GROQ_API_KEY', '')

        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        orchestrator = MasterAIOrchestrator(api_key=groq_api_key)
        response_data = orchestrator.process_request(
            user_id=str(request.user.id) if request.user.is_authenticated else "anonymous",
            prompt=prompt
        )

        return Response(response_data, status=status.HTTP_200_OK)
