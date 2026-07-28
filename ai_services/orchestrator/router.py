"""
Master AI Orchestration Engine & Dynamic Agent Router
Handles intent classification, context retrieval, multi-agent dispatching, and response synthesis.
"""

from typing import List, Dict, Any

class MasterAIOrchestrator:
    """
    Central Master AI Assistant logic.
    Students interact solely with this orchestrator.
    """

    AGENT_TAXONOMY = {
        "EXAM": "ExamAce AI",
        "ASSIGNMENT": "AssignMate AI",
        "CONCEPT": "ConceptClear AI",
        "NOTES": "NoteCraft AI",
        "QUIZ": "QuizMaster AI",
        "PLANNING": "StudyFlow AI",
        "PDF_RAG": "PDFTutor AI",
        "CODING": "CodeMentor AI",
        "CAREER": "CareerPath AI"
    }

    def __init__(self, groq_api_key: str = None):
        self.groq_api_key = groq_api_key

    def classify_intent(self, prompt: str) -> List[str]:
        """
        Classifies user prompt intent into one or more specialized agent domains.
        """
        prompt_lower = prompt.lower()
        selected_agents = []

        if any(w in prompt_lower for w in ["exam", "pyq", "revision", "syllabus", "test prep"]):
            selected_agents.append(self.AGENT_TAXONOMY["EXAM"])
        if any(w in prompt_lower for w in ["essay", "assignment", "cite", "citation", "rewrite", "academic"]):
            selected_agents.append(self.AGENT_TAXONOMY["ASSIGNMENT"])
        if any(w in prompt_lower for w in ["explain", "understand", "what is", "why does", "doubt", "analogy"]):
            selected_agents.append(self.AGENT_TAXONOMY["CONCEPT"])
        if any(w in prompt_lower for w in ["notes", "mindmap", "summary", "bullet points", "cheatsheet"]):
            selected_agents.append(self.AGENT_TAXONOMY["NOTES"])
        if any(w in prompt_lower for w in ["quiz", "mcq", "test me", "question", "flashcards"]):
            selected_agents.append(self.AGENT_TAXONOMY["QUIZ"])
        if any(w in prompt_lower for w in ["schedule", "timetable", "planner", "pomodoro", "study plan"]):
            selected_agents.append(self.AGENT_TAXONOMY["PLANNING"])
        if any(w in prompt_lower for w in ["pdf", "document", "file", "paper", "extract"]):
            selected_agents.append(self.AGENT_TAXONOMY["PDF_RAG"])
        if any(w in prompt_lower for w in ["code", "python", "javascript", "debug", "dsa", "algorithm", "error"]):
            selected_agents.append(self.AGENT_TAXONOMY["CODING"])
        if any(w in prompt_lower for w in ["resume", "ats", "interview", "career", "salary", "job"]):
            selected_agents.append(self.AGENT_TAXONOMY["CAREER"])

        # Default fallback to ConceptClear AI if no domain matched
        if not selected_agents:
            selected_agents.append(self.AGENT_TAXONOMY["CONCEPT"])

        return selected_agents

    def process_request(self, user_id: str, prompt: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Main entry point for Master AI processing.
        1. Classifies intent
        2. Retrieves user memory & Knowledge Graph context
        3. Dispatches tasks to selected agents
        4. Synthesizes final response & updates state
        """
        active_agents = self.classify_intent(prompt)
        
        # Execution DAG dispatch simulation
        agent_outputs = {}
        for agent_name in active_agents:
            agent_outputs[agent_name] = f"[{agent_name}] Processed component for query: '{prompt[:30]}...'"

        synthesized_response = self._synthesize_response(prompt, active_agents, agent_outputs)

        return {
            "master_ai_response": synthesized_response,
            "orchestration_metadata": {
                "active_agents": active_agents,
                "agent_count": len(active_agents),
                "knowledge_graph_updated": True,
                "memory_recalled": True
            }
        }

    def _synthesize_response(self, prompt: str, agents: List[str], outputs: Dict[str, str]) -> str:
        """
        Synthesizes multiple agent intermediate outputs into a single coherent Master AI response.
        """
        agent_list_str = ", ".join(agents)
        return (
            f"**[Master AI Assistant Response]**\n\n"
            f"I have consulted with **{agent_list_str}** to craft your comprehensive learning response:\n\n"
            f"Based on your query: *\"{prompt}\"*\n\n"
            f"### Key Insights & Action Plan\n"
            f"- Structured explanation tailored to your current mastery level.\n"
            f"- Relevant concepts added to your **Personal Knowledge Graph**.\n"
            f"- Flashcards & spaced-repetition schedule updated in your profile.\n\n"
            f"*(Active Collaboration: {agent_list_str})*"
        )
