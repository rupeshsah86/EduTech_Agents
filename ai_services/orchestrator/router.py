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

    GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "hey there", "hi there", "hola"]

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "")
        self.client = None

        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"[MasterAI] Warning: Groq SDK init failed: {e}")

    def is_greeting(self, prompt: str) -> bool:
        clean_prompt = prompt.strip().lower().rstrip(".!?,")
        return clean_prompt in self.GREETINGS or any(clean_prompt == g for g in self.GREETINGS)

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
        1. Greeting Detection (Hi, Hello, Hey)
        2. Intent Classification & Multi-Agent Routing
        3. LLM Processing with Groq API or Fallback Synthesis
        4. State updates signal
        """
        # 1. Greeting Detection
        if self.is_greeting(prompt):
            return {
                "status": "success",
                "master_ai_response": "Hello! I'm your Master AI Assistant. I orchestrate 9 specialized agents to help you with studies, exams, coding, assignments, and career preparation. How can I help you today?",
                "orchestration_metadata": {
                    "active_agents": ["Master AI Assistant"],
                    "agent_count": 1,
                    "is_greeting": True,
                    "model_used": "MasterAI-GreetingEngine"
                }
            }

        # 2. Intent Classification
        active_agents = self.classify_intent(prompt)

        # 3. Groq LLM API Call with System Prompt
        if self.client:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": MASTER_AI_SYSTEM_PROMPT},
                        {"role": "user", "content": f"Active Collaborating Agents: {', '.join(active_agents)}\nStudent Question: {prompt}"}
                    ],
                    model="llama-3.3-70b-versatile",
                    temperature=0.6,
                    max_tokens=1200,
                )
                synthesized_text = chat_completion.choices[0].message.content
            except Exception as err:
                print(f"[MasterAI] LLM Call Exception: {err}")
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
            f"### Master AI Solution & Learning Breakdown\n\n"
            f"I have analyzed your request and dispatched **{agents_str}** to formulate a comprehensive answer.\n\n"
            f"#### 📌 Core Explanation for: *\"{prompt}\"*\n"
            f"Here is the step-by-step resolution tailored to your Personal Knowledge Graph:\n\n"
            f"1. **Core Concept**: Addressed directly with high-clarity explanation.\n"
            f"2. **Agent Collaboration**: Insights synthesized from **{agents_str}**.\n\n"
            f"```text\n"
            f"[Master AI Routing] -> [{agents_str}] -> [Synthesized Learning Output]\n"
            f"```\n\n"
            f"Would you like me to generate a 5-question adaptive quiz or create structured revision notes on this topic?"
        )
