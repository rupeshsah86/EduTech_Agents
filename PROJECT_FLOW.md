# 🔄 EduVerse AI — Complete System Process Flowchart Diagram

Below is the complete, end-to-end operational process flowchart for the **EduVerse AI** platform, featuring decision logic, multi-modal input processing, agent routing, Groq LPU execution, zero-downtime fallbacks, and 3D sign avatar synthesis.

---

```mermaid
graph TD
    %% ── Flowchart Node Style Definitions ───────────────────
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,rx:8px,ry:8px;
    classDef decision fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef output fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#15803d,rx:8px,ry:8px;
    classDef startend fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8,rx:12px,ry:12px;

    %% ── 1. USER AUTHENTICATION & ENTRY ────────────────────
    Start(["🚀 Start: User Enters EduVerse AI Platform"]):::startend --> AuthCheck{"Is User Authenticated?"}:::decision
    
    AuthCheck -->|No| Register["👤 User Login / Signup (JWT Token Issued)"]:::process
    Register --> Dashboard["⚡ Access Main AI Dashboard"]:::process
    AuthCheck -->|Yes| Dashboard

    %% ── 2. INPUT MODE & FEATURE SELECTION ─────────────────
    Dashboard --> ActionType{"Select Input Mode / Action"}:::decision

    %% Path A: Sign AI Gesture Mode
    ActionType -->|Sign Gesture Mode| CameraCheck{"Is Webcam Available?"}:::decision
    CameraCheck -->|No| FallbackText["⌨️ Fallback to Keyboard Text Input"]:::process
    CameraCheck -->|Yes| MediaPipe["🖐️ Track 21 Hand Landmarks via MediaPipe"]:::process
    MediaPipe --> ClassifySign["🔤 Classify ASL Sign (A-Z) & Build Sentence"]:::process
    ClassifySign --> SendPrompt["🧠 Send Prompt to Master AI Engine"]:::process
    FallbackText --> SendPrompt

    %% Path B: Voice Input Mode
    ActionType -->|Voice Conversation| STT["🎙️ Capture Speech via Web Speech API (STT)"]:::process
    STT --> SendPrompt

    %% Path C: Text / Search Bar Mode
    ActionType -->|Search Input Bar| TypeQuery["💬 Type Concept / Code / Exam Query"]:::process
    TypeQuery --> SendPrompt

    %% Path D: Sidebar Feature Modules
    ActionType -->|Sidebar Module| ModuleSelect{"Select Feature Module"}:::decision
    ModuleSelect -->|Knowledge Graph| KG["🗺️ View Topic Strengths & SM-2 Flashcards"]:::process
    ModuleSelect -->|Exam Simulator| Exam["⏱️ Select Subject & Generate AI MCQs via Groq"]:::process
    ModuleSelect -->|AI Debate Arena| Debate["⚔️ Trigger 2-Agent Debate & AI Verdict"]:::process
    ModuleSelect -->|AI Study Twin| Twin["👤 Generate 7-Day Active Recall Plan"]:::process
    
    KG & Exam & Debate & Twin --> NextAction{"Continue Learning?"}:::decision

    %% ── 3. INTENT ROUTING & AGENT DELEGATION ───────────────
    SendPrompt --> IntentRouter["🧠 Master AI Intent Classifier"]:::process
    IntentRouter --> DelegateAgent["🤖 Delegate to 1 of 9 Neural Agents (ExamAce, CodeMentor, etc.)"]:::process

    %% ── 4. MULTI-LLM STRATEGY & FALLBACK ENGINE ────────────
    DelegateAgent --> LLMCheck{"Check Groq LPU Provider Status"}:::decision
    LLMCheck -->|Groq Available| GroqEngine["⚡ Query Groq LPUs (llama-3.3-70b @ 500+ tok/s)"]:::process
    LLMCheck -->|Quota Limit / Network Error| FallbackEngine["🛡️ Activate Zero-Downtime Dynamic Fallback Solver"]:::process

    GroqEngine --> Synthesize["📝 Synthesize Structured Markdown Response"]:::process
    FallbackEngine --> Synthesize

    %% ── 5. PERSISTENCE & MULTI-MODAL OUTPUT SYNTHESIS ──────
    Synthesize --> DBUpdate["💾 Log Activity, Update SM-2 Memory & Daily Streak Counter"]:::process
    DBUpdate --> UIOutput["✨ Render Answer + 3D Michelle Avatar Sign + Voice Playback"]:::output

    UIOutput --> NextAction
    NextAction -->|Yes| Dashboard
    NextAction -->|No| EndSession(["🏁 End Session: Data Saved to Student Profile"]):::startend
```
