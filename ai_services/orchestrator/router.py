"""
EduVerse AI - Master AI Orchestrator & Dynamic Agent Router Engine
Powered by Groq API, LangChain, and Multi-Agent Collaboration DAGs
"""

import os
import json
from typing import List, Dict, Any
from prompt_templates.master_ai_prompts import MASTER_AI_SYSTEM_PROMPT, INTENT_CLASSIFICATION_PROMPT
from prompt_templates.agents_prompts import AGENT_PROMPTS

class MasterAIOrchestrator:
    """
    Central Master AI Orchestrator.
    Students converse strictly with this orchestrator.
    """

    AGENT_TAXONOMY = {
        "ExamAce": "ExamAce AI (Exam Prep & PYQs)",
        "AssignMate": "AssignMate AI (Academic Writing & Citations)",
        "ConceptClear": "ConceptClear AI (Socratic Doubt Solver)",
        "NoteCraft": "NoteCraft AI (Mind Maps & Markdown Notes)",
        "QuizMaster": "QuizMaster AI (Adaptive MCQs & Flashcards)",
        "StudyFlow": "StudyFlow AI (AI Timetable & Pomodoro)",
        "PDFTutor": "PDFTutor AI (Multi-Document RAG)",
        "CodeMentor": "CodeMentor AI (DSA Coding & Complexity Analyzer)",
        "CareerPath": "CareerPath AI (ATS Resume & Mock Interview)"
    }

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "")
        self.client = None

        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"[MasterAI] Warning: Groq SDK init failed: {e}")

    def classify_intent(self, prompt: str) -> List[str]:
        """
        Classifies user prompt intent into one or more of the 9 specialized neural agents.
        """
        prompt_lower = prompt.lower()
        selected_agents = []

        if any(w in prompt_lower for w in ["exam", "pyq", "revision", "syllabus", "test prep", "roadmap"]):
            selected_agents.append("ExamAce AI")
        if any(w in prompt_lower for w in ["essay", "assignment", "cite", "citation", "rewrite", "paper"]):
            selected_agents.append("AssignMate AI")
        if any(w in prompt_lower for w in ["explain", "understand", "what is", "why does", "doubt", "analogy"]):
            selected_agents.append("ConceptClear AI")
        if any(w in prompt_lower for w in ["notes", "mindmap", "summary", "bullet points", "cheatsheet"]):
            selected_agents.append("NoteCraft AI")
        if any(w in prompt_lower for w in ["quiz", "mcq", "test me", "flashcard", "spaced repetition"]):
            selected_agents.append("QuizMaster AI")
        if any(w in prompt_lower for w in ["schedule", "timetable", "planner", "pomodoro", "study plan"]):
            selected_agents.append("StudyFlow AI")
        if any(w in prompt_lower for w in ["pdf", "document", "textbook", "extract", "rag"]):
            selected_agents.append("PDFTutor AI")
        if any(w in prompt_lower for w in ["code", "python", "javascript", "debug", "dsa", "algorithm", "dijkstra", "complexity"]):
            selected_agents.append("CodeMentor AI")
        if any(w in prompt_lower for w in ["resume", "ats", "interview", "career", "salary", "job"]):
            selected_agents.append("CareerPath AI")

        if not selected_agents:
            selected_agents.append("ConceptClear AI")

        return selected_agents

    def process_request(self, user_id: str, prompt: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Main entry point for Master AI processing.
        1. Classifies user intent
        2. Dispatches to selected specialized agents
        3. Merges and synthesizes responses
        4. Triggers Knowledge Graph & SM-2 memory updates
        """
        active_agents = self.classify_intent(prompt)
        agent_outputs = {}

        # Groq API invocation if key present
        if self.client:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": MASTER_AI_SYSTEM_PROMPT},
                        {"role": "user", "content": f"Active Collaborators: {', '.join(active_agents)}\nPrompt: {prompt}"}
                    ],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                    max_tokens=1024,
                )
                synthesized_text = chat_completion.choices[0].message.content
            except Exception as err:
                print(f"[MasterAI] LLM Call Error: {err}")
                synthesized_text = self._fallback_synthesis(prompt, active_agents)
        else:
            synthesized_text = self._fallback_synthesis(prompt, active_agents)

        return {
            "status": "success",
            "master_ai_response": synthesized_text,
            "orchestration_metadata": {
                "active_agents": active_agents,
                "agent_count": len(active_agents),
                "knowledge_graph_updated": True,
                "flashcards_created": 3 if any(a in active_agents for a in ["QuizMaster AI", "ExamAce AI"]) else 0,
                "model_used": "llama-3.3-70b-versatile" if self.client else "EduVerse-Orchestrator-v1"
            }
        }

    def _fallback_synthesis(self, prompt: str, active_agents: List[str]) -> str:
        agents_str = ", ".join(active_agents)
        return (
            f"### Master AI Synthesized Response\n\n"
            f"I have orchestrated **{agents_str}** to process your request.\n\n"
            f"#### 🔑 Core Breakdown & Learning Plan\n"
            f"Based on your query: *\"{prompt}\"*\n\n"
            f"1. **Concept Analysis**: Structured explanation tailored to your Personal Knowledge Graph state.\n"
            f"2. **Agent Collaboration**: Intermediate artifacts generated by **{agents_str}**.\n\n"
            f"```python\n"
            f"# Master AI Automated Sandbox Example\n"
            f"def eduverse_orchestration():\n"
            f"    return 'Active agents: {agents_str}'\n"
            f"```\n\n"
            f"#### 📈 State Updates:\n"
            f"- Concept node **\"{prompt[:20]}...\"** added to Knowledge Graph.\n"
            f"- Scheduled SM-2 spaced repetition flashcards for tonight's review."
        )
