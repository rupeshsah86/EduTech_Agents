# 🔄 EduVerse AI — Complete System Flow & Visual Diagrams

This document contains the dedicated visual flow diagrams and architectural execution pipelines for **EduVerse AI**.

---

## 1. 🌐 Master Platform User Journey & Navigation Flow

```mermaid
graph TD
    A["🌐 Landing Page (Ultra-Clean SaaS UI)"] -->|Click Start Learning Free| B["👤 Authentication (Login / Signup JWT)"]
    B --> C["⚡ Main Dashboard (Good morning Student 👋)"]
    
    C -->|ChatGPT-Style Search Bar| D["🧠 Master AI Orchestrator"]
    D -->|Query Classification| E["🤖 9 Neural Agents Router"]
    E -->|Select Agent| E1["ExamAce AI"]
    E -->|Select Agent| E2["AssignMate AI"]
    E -->|Select Agent| E3["ConceptClear AI"]
    E -->|Select Agent| E4["NoteCraft AI"]
    E -->|Select Agent| E5["QuizMaster AI"]
    E -->|Select Agent| E6["StudyFlow AI"]
    E -->|Select Agent| E7["PDFTutor AI"]
    E -->|Select Agent| E8["CodeMentor AI"]
    E -->|Select Agent| E9["CareerPath AI"]

    E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8 & E9 --> F["💬 Multi-LLM Provider Engine"]
    F -->|Return Response| C

    C -->|Sidebar Navigation| G["📌 Specialized Feature Modules"]
    G --> G1["🗺️ Knowledge Graph (Spaced Repetition Topography)"]
    G --> G2["👤 AI Study Twin (7-Day Plan Generator)"]
    G --> G3["⚔️ AI Debate Arena (2-Agent Debate & AI Verdict)"]
    G --> G4["⏱️ Real Exam Simulator (Groq AI Question Generator & Timer)"]
    G --> G5["🚀 Project Recommender (Portfolio Projects Matched to Mastery)"]
    G --> G6["🖐️ Sign Language AI Tutor (MediaPipe 21-Landmark & 3D Michelle Avatar)"]
    G --> G7["🔥 Skill Heatmap & SM-2 Memory Tracker"]
    G --> G8["📊 Learning Analytics Dashboard"]
    G --> G9["👤 Edit Profile & Study History Tracker (Streak Counter)"]
```

---

## 2. 🧠 Master AI Intent Routing & 9 Neural Agents Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as 🎓 Student
    participant UI as 📱 React Frontend
    participant Router as 🧠 Master AI Router
    participant Agent as 🤖 Neural Agent (1 of 9)
    participant LLM as ⚡ Groq LPU Engine
    participant DB as 💾 PostgreSQL (Knowledge Graph & Memory)

    User->>UI: Submit Question / Doubt / Code
    UI->>Router: POST /api/v1/master-ai/chat/
    Router->>Router: Analyze Intent (Exam, Code, Quiz, Note, Sign, Doubt)
    Router->>Agent: Delegate to Specialized Neural Agent
    Agent->>DB: Fetch Student Knowledge Graph & Memory Context
    Agent->>LLM: Formulate System Prompt & Query Groq LPUs (llama-3.3-70b-versatile)
    LLM-->>Agent: Sub-second AI Response Stream (500+ tokens/sec)
    Agent->>DB: Log Activity, Update Daily Streak & Search History
    Agent-->>UI: Return Structured Markdown Answer + Active Agent Badges
    UI-->>User: Render Interactive Answer + Voice Playback + Action Chips
```

---

## 3. ⚡ Multi-LLM Provider Strategy & Zero-Downtime Fallback Flow

```mermaid
graph TD
    A["💬 Student Prompt Received"] --> B{"Selected LLM Provider Strategy"}
    
    B -->|Provider: Groq| C["⚡ Groq LPU Engine (llama-3.3-70b-versatile)"]
    B -->|Provider: Gemini| D["✨ Google Gemini 1.5 Flash"]
    B -->|Provider: OpenAI| E["🤖 OpenAI (GPT-4o / GPT-4o-mini)"]
    B -->|Provider: DeepSeek| F["🧠 DeepSeek (V3 / R1 Reasoner)"]
    B -->|Provider: Local Ollama| G["💻 Local Offline Ollama"]

    C & D & E & F & G -->|Check Connection & Quota Status| H{"API Success?"}
    H -->|Yes| I["✅ Return Sub-second Response"]
    H -->|No / Network Error / Limit Over| J["🛡️ Zero-Downtime Dynamic Fallback Engine"]
    J --> K["⚡ Auto-Route to Dynamic Solvers (Zero Demo Interruption)"]
    K --> I
```

---

## 4. 🖐️ Sign Language AI Tutor (Vision & 3D WebGL Pipeline)

```mermaid
graph LR
    A["🎥 Live Webcam Feed"] --> B["🖐️ MediaPipe Hands API"]
    B -->|Extract 21 Hand Landmarks| C["📐 Landmark Coordinate Normalizer"]
    C -->|Classify Gesture (A-Z)| D["🔤 ASL Gesture Classifier"]
    D -->|Detected Letter| E["📝 Sentence Buffer Builder"]
    E -->|Click Send to Master AI| F["🧠 Master AI Orchestrator"]
    F -->|Synthesize Response| G["💃 Three.js WebGL 3D Avatar (Michelle.glb)"]
    G -->|Play 3D Sign Animations| H["📺 3D Viewport Animation + Speech Voice"]
```

---

## 5. 🧠 SuperMemo-2 (SM-2) Spaced Repetition Memory Engine

```mermaid
graph TD
    A["🎴 Student Reviews Flashcard"] --> B{"Select Recall Quality Rating"}
    
    B -->|Rating 0-2 (Hard)| C["❌ Incorrect / Low Recall"]
    B -->|Rating 3 (Good)| D["👍 Good Recall"]
    B -->|Rating 4-5 (Easy)| E["🌟 Easy / Perfect Recall"]

    C --> C1["Set Interval I(1) = 1 Day"]
    C --> C2["Decrease Ease Factor EF' = EF - 0.2"]

    D --> D1["Set Interval I(n) = I(n-1) * EF"]

    E --> E1["Set Interval I(n) = I(n-1) * EF * 1.3"]
    E --> E2["Increase Ease Factor EF' = EF + 0.1"]

    C1 & D1 & E1 --> F["💾 Save Next Review Date in Knowledge Graph"]
    F --> G["📈 Update Student Forgetting Curve & Productivity Index"]
```

---

## 6. ⏱️ Real Exam Simulator & Groq AI Question Generator Flow

```mermaid
graph TD
    A["⏱️ Select Exam Subject & Difficulty"] --> B["⚡ Click Generate New AI Questions"]
    B --> C["🚀 Groq LPU Engine Prompting"]
    C --> D["📋 Synthesize 5 Fresh High-Yield MCQs with Explanations"]
    D --> E["🎮 Timed Exam Session (Countdown Timer & +4/-1 Marking)"]
    E --> F["📊 Submit Exam & Render Deep Analytics Dashboard"]
    F --> F1["Accuracy % & Grade Badges"]
    F --> F2["Correct vs Incorrect Breakdown"]
    F --> F3["Question-by-Question Detailed AI Review"]
```
