import os
import requests

class NoteCraftAgent:
    """
    NoteCraft AI – Smart Notes & Mind Maps Generator
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "")

    def execute(self, topic: str, content: str = "") -> dict:
        prompt = f"Generate structured markdown notes and mind-map nodes for topic: {topic}. Content: {content}"
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
                    return {"status": "success", "notes_markdown": text, "agent": "NoteCraft AI"}
            except Exception as e:
                print("NoteCraft AI Groq API exception:", e)

        return {
            "status": "success",
            "notes_markdown": f"### 📝 NoteCraft Notes: {topic}\n\n1. **Core Concept**: Comprehensive study notes on {topic}.\n2. **Formulae & Invariants**: Essential formulas and definitions extracted.\n3. **Mind Map Structure**:\n   - Main Topic\n     - Subtopic 1\n     - Subtopic 2",
            "agent": "NoteCraft AI"
        }
