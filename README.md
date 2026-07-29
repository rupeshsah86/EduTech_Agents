# EduVerse AI 🧠⚡
> **One Intelligent Learning Platform Powered by Multiple AI Neural Agents**

EduVerse AI is a commercial-grade, multi-agent artificial intelligence learning platform designed for computer science students, software engineering practitioners, and competitive examination candidates (GATE, DSA, System Design).

Instead of interacting with disconnected AI tools, users communicate with **One Master AI Assistant**, which dynamically understands intent, routes queries to 9 specialized neural agents, synthesizes responses, and continuously updates a long-term **Personal Knowledge Graph** and **AI Learning Memory**.

---

## 🌟 Key Working Unique Features

Unlike standard LLMs (ChatGPT, Gemini, Claude) that reset context after every chat, EduVerse AI includes persistent, student-focused engines:

1. **⚡ Multi-LLM Provider Switcher (Provider Freedom)**
   - Switch seamlessly between **Google Gemini 1.5**, **Groq LPUs (Llama 3 70B)**, **OpenAI (GPT-4o / GPT-4o-mini)**, **DeepSeek (V3 / R1 Reasoner)**, and **Local Ollama** (100% offline & free).
   - Designed using **SOLID Clean Architecture & Strategy Pattern** (`ILLMProviderStrategy`, `LLMService`).
   - Interactive model switcher pill in top navbar with real-time connection testing, API key management, and hyperparameter tuning (Temperature, Max Tokens).

2. **🧠 Universal Master AI Answering Engine**
   - Responds intelligently to **ANY** student prompt — concepts, code, exams, assignments, career, PDFs, quizzes, or general study doubts.
   - Automatically routes queries through the selected active Multi-LLM provider and 9 specialized neural agents.
   - Automatically detects greetings ("Hi", "Hello") with warm, professional welcomes outlining platform capabilities and 9 agent delegations.
   - Provides clear, structured, student-friendly Markdown answers with active agent tags, code blocks, tables, and next-step recommendations.

2. **📑 Interactive MCQ Quiz Game & Results Page**
   - **Game-like Experience**: Displays one question at a time with smooth Framer Motion transitions.
   - **Instant Option Feedback**: Selecting an option highlights correct (green) or wrong (red) choices immediately with a detailed explanation card.
   - **Comprehensive Results Page**: Score percentage, Total Questions, Correct Answers, Wrong Answers, Grade Badges (*Excellent 🌟*, *Good 👍*, *Needs Improvement 💡*), and detailed wrong question review.
   - **Action Buttons**: 🔄 *Retry Quiz*, 💡 *Review Weak Topics* (auto-queries Master AI), and 🏠 *Back to Dashboard*.

3. **🔍 Modern Enter-Key Search Bar (ChatGPT-style)**
   - Type queries and press **Enter** key to submit instantly (or click the Send button).
   - Automatically clears input upon submission, validates against empty strings, and displays live loading states.
   - Includes global `⌘ + K` / `Ctrl + K` keyboard shortcut for fast focus.

3. **🗺️ Interactive Personal Knowledge Graph (100% Unrestricted)**
   - Live visual topography of mastered concepts, partial knowledge, and weak spots across 5 core CS domains (**DSA**, **Algorithms**, **Operating Systems**, **DBMS**, **System Design**).
   - Topic-level cards displaying: **Last Practiced Date**, **Next Revision Date (SM-2)**, **Related Concepts**, **Concept Strength %**, and **Weekly Insight + Suggested Focus Topics**.

4. **👤 AI Digital Study Twin & 7-Day Plan Generator**
   - Displays **Predicted Exam Mastery %**, **Learning Personality Profile**, and **Best Study Time Recommendation**.
   - Interactive **"Generate 7-Day Personalized Plan"** button creating customized daily active recall targets based on auto-detected knowledge gaps.

5. **⚔️ AI Multi-Agent Debate Arena & Synthesis**
   - Two specialized AI agents debate opposing viewpoints in real-time.
   - Includes post-debate **AI Judgment Verdict**, **Key Takeaways Box**, **"Generate Quiz from Debate"**, and **"Save to Knowledge Graph"**.

6. **⏱️ Real Exam Simulator & Deep Analytics Dashboard**
   - Configure **Subject** and **Difficulty Level** (Beginner, Intermediate, Hard / GATE Level).
   - Timed mock exam environment featuring a live countdown timer and negative marking (`+4 / -1`).
   - Post-exam **Deep Analytics Dashboard**: Accuracy %, Correct/Incorrect counts, Avg Time per Question, and Question-by-Question Explanations.

7. **🚀 AI Project & Hackathon Recommender**
   - Matches real portfolio projects & hackathons dynamically matched to your Personal Knowledge Graph mastery level.
   - Shows **Match %**, **Existing vs Missing Skills**, **Estimated Completion Time**, and **"Why Recommended For You"** highlight box.

9. **🔥 Skill Heatmap & SM-2 Spaced Repetition Engine**
   - 28-day practice consistency matrix and SuperMemo SM-2 flashcard scheduler for long-term memory consolidation.

10. **🎭 Mentor Personality Switching**
    - Switch Master AI mentor personality on the fly between **Socratic Professor**, **Strict Coach**, **Friendly Senior**, **Chill Senior**, and **Industry Mentor**.

11. **🎙️ Master AI Voice (Full Voice Conversation)**
    - Hands-free, two-way voice communication powered by Speech-to-Text (`SpeechRecognition`) and Text-to-Speech (`SpeechSynthesis`). Features live interim transcript preview, voice selection, auto-voice toggle, and per-message answer playback.

12. **👤 Interactive User Profile Settings**
    - Edit Full Name / Username, Email Address, and Password with instant local session persistence.

---

## 🎙️ Master AI Voice (Full Voice Conversation)

EduVerse AI includes a production-grade, voice-enabled conversation interface that allows students to communicate with the Master AI Assistant entirely hands-free.

### Key Features:
- **Speech-to-Text (STT)**: Real-time speech recognition with live interim transcript previews while speaking.
- **Text-to-Speech (TTS)**: Automatic natural voice output with customizable voice selection (Samantha, Google US English, etc.).
- **Visual Feedback**: Pulsing glowing mic rings, real-time waveform bar visualizer, and active agent badges.
- **Hands-free Controls**: Toggle **Auto Voice On/Off**, stop speech audio on demand, and trigger quick prompt chips.
- **Keyboard Shortcuts**: Press `⌘ + Shift + V` (Mac) or `Ctrl + Shift + V` (Windows) to toggle the Master AI Voice panel anywhere.

### How to Use:
1. Click **Voice AI** in the top header or the floating bot icon in the bottom right corner (or press `⌘+Shift+V`).
2. Click the large central microphone button and speak your question.
3. Observe live interim speech text on screen. When silence is detected, your prompt is sent to Master AI.
4. Listen to Master AI speak the synthesized response from the 9 specialized neural agents.
5. Click **Speak Answer** on any message to re-listen to any response.

### Browser Support Note:
Uses browser-native Web Speech API (`SpeechRecognition` & `SpeechSynthesis`). Best supported on **Google Chrome**, **Brave**, and **Microsoft Edge**.

---

## 🤖 The 9 Specialized Neural Agents

EduVerse AI orchestrates 9 specialized agents working behind the Master AI Assistant:

1. **ExamAce AI**: Exam roadmap generator, PYQ analyzer, and high-yield scoring strategist.
2. **AssignMate AI**: Academic rewriter, plagiarism-aware paraphraser, and citation builder.
3. **ConceptClear AI**: Socratic problem solver, intuitive breakdown expert, and visual analogy builder.
4. **NoteCraft AI**: Automated markdown summary generator, cheat-sheet compiler, and mind-map creator.
5. **QuizMaster AI**: Adaptive MCQ generator powered by the SM-2 spaced repetition memory algorithm.
6. **StudyFlow AI**: Pomodoro timetable generator, exam countdown timer, and revision planner.
7. **PDFTutor AI**: Multi-document RAG assistant capable of parsing PDFs and answering cross-document queries.
8. **CodeMentor AI**: DSA sandbox, Big-O time & space complexity analyzer, and edge case finder.
9. **CareerPath AI**: ATS resume scanner, tech stack gap finder, and project portfolio builder.

---

## 🎨 Theme & UI/UX Aesthetics

- **Strict Theme System**: 
  - **Light Mode**: Clean white / soft neutral background (`#FFFFFF` / `#FAFAFA`).
  - **Dark Mode**: Deep charcoal / near black (`#0A0A0A` / `#111111`).
- **Typography & Layout**: 8pt spacing grid system, generous whitespace, fixed blur navbar, Linear/Notion grade cards, and Framer Motion micro-interactions.

---

## 🛠️ Technical Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS v4 + Custom Utility System
- **Icons**: Lucide React
- **Icons & Animations**: Framer Motion

### Backend & AI
- **Backend Framework**: Python 3.12 + Django 5 + Django REST Framework (DRF)
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **Database**: PostgreSQL 16 + `pgvector` extension (Vector Embeddings Store)
- **AI LLM Orchestration**: Groq API (`llama-3.3-70b-versatile` / `mixtral-8x7b-32768`) + Fallback Neural Engine
- **Asynchronous Task Queue**: Redis + Celery

---

## 📁 Repository Directory Structure

```text
EduTech_Agents/
├── backend/                        # Django REST Framework Backend
│   ├── apps/                       # Modular Django Apps
│   │   ├── analytics/              # Quiz attempts & Study plans ORM models
│   │   ├── authentication/         # User auth & JWT handlers
│   │   ├── knowledge_graph/        # Concept nodes & edges ORM models
│   │   ├── learning_memory/        # Long-term memory & flashcards ORM models
│   │   └── master_ai/              # Master AI orchestration endpoint
│   ├── config/                     # Django settings & URL routing
│   └── manage.py                   # Django CLI tool
├── database/                       # Database Schemas & Migrations
│   └── schema/
│       └── 01_init_schema.sql      # PostgreSQL + pgvector SQL initialization script
├── deployment/                     # Docker & Infrastructure
│   └── docker/
│       └── docker-compose.yml      # Multi-container stack (Postgres + Redis + Django + Vite)
├── docs/                           # Software Architecture & Design Specs
│   └── DESIGN_SYSTEM_AND_ROADMAP.md
├── frontend/                       # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI & Dashboard Components
│   │   │   ├── dashboard/          # KnowledgeGraph, AIDebate, ExamSimulator, MasterAIChat, etc.
│   │   │   └── landing/            # LearnWise-grade Landing Page components
│   │   ├── context/                # AuthContext & Session management
│   │   └── pages/                  # LandingPage, DashboardPage, LoginPage, SignupPage
│   └── package.json
└── README.md                       # Project Overview & Setup Guide
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- PostgreSQL 15/16 (or Docker)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
API endpoints are served at `http://localhost:8000/api/v1/`.

---

## 📜 License & Author

- **Author**: Rupesh Kumar Sah ([@rupeshsah86](https://github.com/rupeshsah86))
- **Repository**: [https://github.com/rupeshsah86/EduTech_Agents.git](https://github.com/rupeshsah86/EduTech_Agents.git)
