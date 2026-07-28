import os
import requests

class StudyFlowAgent:
    """
    StudyFlow AI – Intelligent Study Planner & Pomodoro Scheduler
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "")

    def execute(self, goal: str, days: int = 7) -> dict:
        prompt = f"Create a structured {days}-day study timetable and Pomodoro scheduler for goal: {goal}"
        if self.api_key:
            try:
                res = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3
                    },
                    timeout=10
                )
                if res.status_code == 200:
                    text = res.json()["choices"][0]["message"]["content"]
                    return {"status": "success", "study_plan": text, "agent": "StudyFlow AI"}
            except Exception as e:
                print("StudyFlow AI Groq API exception:", e)

        return {
            "status": "success",
            "study_plan": f"### 📅 StudyFlow {days}-Day Revision Schedule: {goal}\n\n- **Day 1-2**: High-yield core concepts & doubt resolution\n- **Day 3-4**: Active recall & QuizMaster practice\n- **Day 5-6**: Past Year Question (PYQ) mock simulation\n- **Day 7**: Formula review & final assessment",
            "agent": "StudyFlow AI"
        }
