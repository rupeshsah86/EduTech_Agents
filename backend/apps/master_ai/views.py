from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ai_services.orchestrator.router import MasterAIOrchestrator

class MasterAIChatView(APIView):
    """
    Main Master AI Chat endpoint.
    Orchestrates intent classification, multi-agent dispatch, and state updates using live LLM API keys.
    """
    permission_classes = []

    def post(self, request):
        prompt = request.data.get('prompt', '')
        api_key = request.data.get('api_key', None)
        provider = request.data.get('provider', None)

        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        orchestrator = MasterAIOrchestrator(api_key=api_key, provider=provider)
        response_data = orchestrator.process_request(
            user_id=str(request.user.id) if request.user.is_authenticated else "anonymous",
            prompt=prompt,
            custom_api_key=api_key,
            provider=provider
        )

        return Response(response_data, status=status.HTTP_200_OK)
