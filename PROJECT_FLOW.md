# 🏗️ EduVerse AI — System Architecture & Flow Diagrams

```mermaid
graph TB
    %% ── USER & CLIENT INTERFACE LAYER ──────────────────────────────────
    subgraph CLIENT_LAYER ["🎨 PRESENTATION & FRONTEND LAYER (React 18 + Vite + TS)"]
        UI["🖥️ EduVerse AI SaaS Dashboard UI"]
        Webcam["🎥 MediaPipe Hands API (21 Hand Landmarks)"]
        Avatar3D["💃 Three.js WebGL 3D Avatar (Michelle.glb)"]
        VoiceEngine["🎙️ Web Speech API (STT & TTS Engine)"]
    end

    %% ── MASTER AI & MULTI-AGENT ORCHESTRATION LAYER ────────────────────
    subgraph ORCHESTRATION_LAYER ["🧠 MASTER AI & 9 NEURAL AGENTS ORCHESTRATOR"]
        MasterAI["⚡ Universal Master AI Answering Engine"]
        
        subgraph AGENTS ["🤖 9 SPECIALIZED NEURAL TUTORS"]
            A1["📚 ExamAce AI"]
            A2["📝 AssignMate AI"]
            A3["💡 ConceptClear AI"]
            A4["📄 NoteCraft AI"]
            A5["🎯 QuizMaster AI"]
            A6["⏱️ StudyFlow AI"]
            A7["📑 PDFTutor AI"]
            A8["💻 CodeMentor AI"]
            A9["🚀 CareerPath AI"]
        end
    end

    %% ── MULTI-LLM PROVIDER STRATEGY ENGINE ─────────────────────────────
    subgraph LLM_LAYER ["💬 MULTI-LLM PROVIDER STRATEGY ENGINE"]
        Groq["⚡ Groq LPU Engine (llama-3.3-70b @ 500+ tok/s)"]
        Gemini["✨ Google Gemini 1.5 Flash"]
        OpenAI["🤖 OpenAI (GPT-4o / GPT-4o-mini)"]
        DeepSeek["🧠 DeepSeek (V3 / R1 Reasoner)"]
        Ollama["💻 Local Offline Ollama Engine"]
        Fallback["🛡️ Zero-Downtime Dynamic Fallback Solver"]
    end

    %% ── BACKEND SERVICES & APIS ────────────────────────────────────────
    subgraph BACKEND_LAYER ["🐍 BACKEND & REST API LAYER (Django 5 + DRF)"]
        AuthService["🔒 SimpleJWT Authentication Handler"]
        MasterService["🧠 Master AI Endpoint Controller"]
        AnalyticsService["📊 User Activity & Daily Streak Tracker"]
        MemoryService["🧠 SM-2 Spaced Repetition Engine"]
        GraphService["🗺️ Personal Knowledge Graph Engine"]
    end

    %% ── DATA BASE & STORAGE LAYER ──────────────────────────────────────
    subgraph DATA_LAYER ["💾 PERSISTENCE & STORAGE LAYER"]
        Postgres["🐘 PostgreSQL 16 + pgvector (Vector Embeddings)"]
        RedisCache["⚡ Redis 7 (Session Cache & Task Queue)"]
        CeleryWorker["⚙️ Celery Async RAG Workers"]
    end

    %% ── CONNECTIONS & DATA FLOW PIPELINES ──────────────────────────────
    UI -->|HTTP / JWT| AuthService
    UI -->|Submit Prompt| MasterAI
    Webcam -->|Hand Landmark Coords| UI
    Avatar3D <--|GLTF Animations| UI
    VoiceEngine <--|Audio Telemetry| UI

    MasterAI -->|Intent Classification| AGENTS
    AGENTS -->|Strategy Context| LLM_LAYER

    Groq & Gemini & OpenAI & DeepSeek & Ollama -->|Execute LLM Strategy| Fallback
    Fallback -->|Structured Response| MasterAI

    MasterAI -->|API Sync| MasterService
    AnalyticsService & MemoryService & GraphService -->|ORM Queries| Postgres
    Backend_LAYER -->|Async Tasks| RedisCache
    RedisCache --> CeleryWorker
    CeleryWorker --> Postgres
```

---

## 🔄 End-to-End System Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Student as 🎓 Student / User
    participant Client as 🖥️ React Frontend
    participant Vision as 🎥 MediaPipe 21-Landmark
    participant Master as 🧠 Master AI Router
    participant LLM as ⚡ Groq LPU Strategy
    participant DB as 🐘 PostgreSQL + pgvector

    Student->>Client: Submit Prompt / Gesture / Voice
    opt Gesture Mode (Sign AI)
        Client->>Vision: Track Hand Landmarks (21 points)
        Vision-->>Client: Classify ASL Sign (A-Z)
    end
    Client->>Master: POST /api/v1/master-ai/chat/
    Master->>DB: Fetch Knowledge Graph & SM-2 Memory
    Master->>LLM: Query Groq LPU (llama-3.3-70b-versatile)
    alt Groq Available
        LLM-->>Master: Sub-second Stream (500+ tokens/sec)
    else API Quota / Limit Exceeded
        LLM->>LLM: Fallback to Dynamic Offline Solver Engine
        LLM-->>Master: Return Solved Response
    end
    Master->>DB: Log Activity, Daily Streak & History
    Master-->>Client: Render Answer + 3D Avatar Animation + Voice Audio
    Client-->>Student: Display Response & Update Knowledge Graph
```

---

## 🗺️ Feature Module Architecture Grid

```mermaid
graph LR
    subgraph MODULES ["📌 9 SPECIALIZED FEATURE MODULES"]
        M1["🗺️ Knowledge Graph"] --> M1_1["SM-2 Revision Scheduler & Topic Strength %"]
        M2["👤 AI Study Twin"] --> M2_1["7-Day Personalized Active Recall Plan"]
        M3["⚔️ AI Debate Arena"] --> M3_1["2-Agent Real-time Debate & AI Verdict"]
        M4["⏱️ Exam Simulator"] --> M4_1["Subject Filter & Groq AI Question Generator"]
        M5["🚀 Project Recommender"] --> M5_1["Portfolio Projects Matched to Mastery Level"]
        M6["🖐️ Sign Language AI"] --> M6_1["Full ASL 26 Alphabet & Text-to-Sign 3D Avatar"]
        M7["🔥 Skill Heatmap"] --> M7_1["28-Day Consistency Matrix & Flashcard Deck"]
        M8["📊 Learning Analytics"] --> M8_1["Productivity Index & Memory Retention Curve"]
        M9["👤 User Profile"] --> M9_1["Daily Streak Counter & Search History Log"]
    end
```
