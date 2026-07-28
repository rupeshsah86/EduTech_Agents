# EduVerse AI — UI Design System & 3-Person Team Sprint Roadmap

## 1. UI Design System & Aesthetics Specification

### Design Philosophy
Inspired by **Linear**, **Notion**, **Stripe**, **Apple**, and **OpenAI**:
- Dark Mode / Light Mode seamlessly integrated via Tailwind CSS variables.
- Glassmorphism overlays (`backdrop-blur-md`, subtle border highlights `border-white/10`).
- Vibrant gradients for AI agent indicators (e.g. Master AI = Purple-Cyan gradient, ExamAce = Amber-Red, CodeMentor = Emerald-Teal).
- Fluid animations powered by Framer Motion.

### Color Palette (Tailwind Tokens)
- **Background**: Dark `#0B0F17` / Light `#F8FAFC`
- **Card Surface**: Dark `#131B2E` (`bg-slate-900/60 backdrop-blur-lg`) / Light `#FFFFFF`
- **Border Accent**: Dark `#1E293B` (`border-slate-800`)
- **Primary Brand / Master AI**: `#6366F1` (Indigo 500) to `#A855F7` (Purple 500)
- **Agent Colors**:
  - ExamAce: `#F59E0B` (Amber)
  - AssignMate: `#EC4899` (Pink)
  - ConceptClear: `#3B82F6` (Blue)
  - NoteCraft: `#8B5CF6` (Violet)
  - QuizMaster: `#10B981` (Emerald)
  - StudyFlow: `#06B6D4` (Cyan)
  - PDFTutor: `#EF4444` (Red)
  - CodeMentor: `#14B8A6` (Teal)
  - CareerPath: `#F97316` (Orange)

---

## 2. 3-Person Team Sprint Roadmap

```mermaid
gantt
    title EduVerse AI 3-Person Team Sprint Roadmap
    dateFormat  YYYY-MM-DD
    section Sprint 1: Core Setup & Setup
    Repo & Arch Setup (All 3)           :a1, 2026-08-01, 7d
    Django Auth & DB Models (Mem 2)     :a2, 2026-08-01, 7d
    React UI System & Shell (Mem 3)     :a3, 2026-08-01, 7d
    Groq Orchestrator Core (Mem 1)      :a4, 2026-08-01, 7d

    section Sprint 2: Master AI & Core Agents
    Master AI Intent Router (Mem 1)     :b1, 2026-08-08, 7d
    PDFTutor & ConceptClear AI (Mem 1)   :b2, 2026-08-08, 7d
    Knowledge Graph Backend (Mem 2)     :b3, 2026-08-08, 7d
    Master AI Chat Interface (Mem 3)    :b4, 2026-08-08, 7d

    section Sprint 3: Full Agent Suite & Memory
    ExamAce, QuizMaster, CodeMentor (Mem 1):c1, 2026-08-15, 7d
    StudyFlow, NoteCraft, CareerPath (Mem 2):c2, 2026-08-15, 7d
    Knowledge Graph & Heatmap UI (Mem 3):c3, 2026-08-15, 7d

    section Sprint 4: Integration & Launch
    Multi-Doc RAG & Code Sandbox (Mem 1):d1, 2026-08-22, 7d
    Celery Spaced Repetition (Mem 2)    :d2, 2026-08-22, 7d
    Polishing, Analytics & Docker (Mem 3):d3, 2026-08-22, 7d
```

### Team Responsibilities Matrix

- **Member 1 (AI & Orchestration Specialist)**:
  - Master AI Intent Classification & Execution DAG Builder.
  - Integration of 9 Agent Prompts & Groq API handlers.
  - Vector Database / RAG pipeline for PDFTutor & AssignMate.

- **Member 2 (Backend & Database Engineer)**:
  - Django REST API & JWT Authentication.
  - PostgreSQL schema, `pgvector`, and Knowledge Graph node/edge REST endpoints.
  - Celery async tasks for background PDF parsing & SM-2 flashcard scheduling.

- **Member 3 (Frontend & UI/UX Engineer)**:
  - React + Vite + TypeScript application architecture.
  - Master AI Chat interface with agent execution indicators and stream rendering.
  - Interactive Knowledge Graph Visualizer (React Force Graph / D3), Skill Heatmap, and Code Sandbox UI.
