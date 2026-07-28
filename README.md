# EduVerse AI 🧠⚡
> **One Intelligent Learning Platform Powered by Multiple AI Neural Agents**

EduVerse AI is a commercial-grade, multi-agent artificial intelligence learning platform designed for computer science students, software engineering practitioners, and competitive examination candidates (GATE, DSA, System Design).

Instead of interacting with disconnected AI tools, users communicate with **One Master AI Assistant**, which dynamically understands intent, routes queries to 9 specialized neural agents, synthesizes responses, and continuously updates a long-term **Personal Knowledge Graph** and **AI Learning Memory**.

---

## 🌟 Key Working Unique Features

Unlike standard LLMs (ChatGPT, Gemini, Claude) that reset context after every chat, EduVerse AI includes persistent, student-focused engines:

1. **🗺️ Interactive Personal Knowledge Graph**
   - Live visual topography of mastered concepts, partial knowledge, and weak spots across 5 core domains (**DSA**, **Algorithms**, **Operating Systems**, **DBMS**, **System Design**).
   - Topic-level breakdown with mastery percentage scores, status tags, last practiced dates, next revision due dates, and interactive deep-dive modals.

2. **⚔️ AI Multi-Agent Debate Arena**
   - Two specialized AI agents debate opposing viewpoints (e.g. *Microservices vs Monolith*, *SQL vs NoSQL*) in real-time to build deep multi-perspective understanding.

3. **⏱️ Real Timed Exam Simulation Mode**
   - Timed mock exam environment featuring a live countdown timer, negative marking rules (`+4 / -1`), question navigator, and instant performance analysis.

4. **👤 AI Digital Study Twin & Auto Gap Detection**
   - Predictive AI model of your learning patterns, memory retention curves, and auto-detected knowledge gaps discovered even if you didn't explicitly ask about them.

5. **🚀 AI Project & Hackathon Recommender**
   - Recommends real portfolio projects & hackathons dynamically matched to your current Personal Knowledge Graph mastery level.

6. **🔥 Skill Heatmap & SM-2 Spaced Repetition Engine**
   - 28-day practice consistency matrix and SuperMemo SM-2 flashcard scheduler for long-term memory consolidation.

7. **🎭 Mentor Personality Switching**
   - Switch Master AI mentor personality on the fly between **Socratic Professor**, **Strict Coach**, **Friendly Senior**, **Chill Senior**, and **Industry Mentor**.

8. **🎙️ Web Speech API Voice Input**
   - Hands-free dictation for chat prompts and header search queries with visual active listening badges.

9. **👤 Interactive User Profile Settings**
   - Edit Full Name / Username, Email Address, and Password with instant local session persistence.

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
