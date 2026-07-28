# EduVerse AI — Database Design & API Contracts

## 1. Database ER Diagram (PostgreSQL)

```mermaid
erDiagram
    users ||--o{ user_memories : "has long-term memory"
    users ||--o{ knowledge_nodes : "owns concept nodes"
    knowledge_nodes ||--o{ knowledge_edges : "connects to"
    users ||--o{ documents : "uploads"
    documents ||--o{ document_chunks : "chunked into"
    users ||--o{ quiz_attempts : "completes"
    users ||--o{ flashcards : "studies"
    users ||--o{ study_plans : "schedules"

    users {
        uuid id PK
        string email UK
        string full_name
        string password_hash
        jsonb learning_profile
        datetime created_at
        datetime updated_at
    }

    user_memories {
        uuid id PK
        uuid user_id FK
        string memory_type
        text content
        vector embedding
        float importance_score
        datetime last_recalled
    }

    knowledge_nodes {
        uuid id PK
        uuid user_id FK
        string concept_name
        string subject
        float mastery_score
        int review_count
        datetime last_reviewed
        datetime next_review_due
    }

    knowledge_edges {
        uuid id PK
        uuid source_node_id FK
        uuid target_node_id FK
        string relationship_type
        float weight
    }

    documents {
        uuid id PK
        uuid user_id FK
        string title
        string file_path
        int page_count
        datetime uploaded_at
    }

    document_chunks {
        uuid id PK
        uuid document_id FK
        int chunk_index
        text chunk_text
        vector embedding
    }

    quiz_attempts {
        uuid id PK
        uuid user_id FK
        string topic
        int score
        int total_questions
        jsonb analytics
        datetime completed_at
    }

    flashcards {
        uuid id PK
        uuid user_id FK
        text front
        text back
        int interval_days
        float ease_factor
        int repetitions
        datetime next_review
    }

    study_plans {
        uuid id PK
        uuid user_id FK
        string title
        jsonb schedule_data
        int total_hours
        datetime start_date
        datetime end_date
    }
```

---

## 2. Core API Endpoints Specification

### Authentication API
- `POST /api/v1/auth/register/` — Register new user
- `POST /api/v1/auth/login/` — Login & receive JWT access + refresh tokens
- `POST /api/v1/auth/token/refresh/` — Refresh access token

### Master AI & Agent Orchestration API
- `POST /api/v1/master-ai/chat/` — Synchronous Master AI request (Payload: prompt, active_agent_override, uploaded_files)
- `GET /api/v1/master-ai/stream/` — WebSocket / SSE endpoint for streaming AI response & step-by-step agent activation state
- `GET /api/v1/master-ai/history/` — Fetch conversation trajectory & multi-agent execution logs

### Personal Knowledge Graph & Memory API
- `GET /api/v1/knowledge-graph/nodes/` — Get user's concept nodes & mastery levels
- `GET /api/v1/knowledge-graph/graph-data/` — Get full node + edge layout JSON for frontend Force-Graph visualizer
- `GET /api/v1/learning-memory/` — List recalled memories & learning style metrics
- `POST /api/v1/learning-memory/reconcile/` — Force update of skill heatmap & weak topic list

### Specialized Features API
- `POST /api/v1/pdf-tutor/upload/` — Upload document for PDFTutor RAG indexing
- `POST /api/v1/quiz/generate/` — Generate adaptive quiz (QuizMaster AI)
- `POST /api/v1/quiz/submit/` — Submit quiz attempt & auto-update SM-2 flashcards
- `POST /api/v1/code-mentor/execute/` — Execute code snippet safely in sandbox backend
- `POST /api/v1/career/resume-ats/` — Analyze PDF resume against target job description (CareerPath AI)
