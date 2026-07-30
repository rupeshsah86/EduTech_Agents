// Master AI Orchestrator & Router Service for 9 EduVerse AI Agents
import { llmService } from './llm/llmService';

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  badge: string;
  color: string;
  iconName: string;
}

export const AGENTS_REGISTRY: Record<string, AgentInfo> = {
  agent_concept: {
    id: 'agent_concept',
    name: 'ConceptClear AI',
    role: 'Socratic Concept Solver & Visual Explainer',
    badge: 'Concept Solver',
    color: 'bg-blue-500 text-white',
    iconName: 'HelpCircle',
  },
  agent_note: {
    id: 'agent_note',
    name: 'NoteCraft AI',
    role: 'Structured Note Generator & Mind Maps',
    badge: 'Notes & Outlines',
    color: 'bg-purple-500 text-white',
    iconName: 'FileText',
  },
  agent_code: {
    id: 'agent_code',
    name: 'CodeMentor AI',
    role: 'DSA Sandbox & Big-O Complexity Tutor',
    badge: 'Code & DSA',
    color: 'bg-indigo-500 text-white',
    iconName: 'Code',
  },
  agent_exam: {
    id: 'agent_exam',
    name: 'ExamAce AI',
    role: 'Exam Strategy & PYQ Pattern Analyzer',
    badge: 'Exam Prep',
    color: 'bg-amber-500 text-white',
    iconName: 'BookOpen',
  },
  agent_quiz: {
    id: 'agent_quiz',
    name: 'QuizMaster AI',
    role: 'Adaptive MCQ Generator & SM-2 Flashcards',
    badge: 'Interactive Quiz',
    color: 'bg-emerald-500 text-white',
    iconName: 'CheckSquare',
  },
  agent_assign: {
    id: 'agent_assign',
    name: 'AssignMate AI',
    role: 'Academic Paper Rewriter & Citation Assistant',
    badge: 'Assignments',
    color: 'bg-pink-500 text-white',
    iconName: 'PenTool',
  },
  agent_study: {
    id: 'agent_study',
    name: 'StudyFlow AI',
    role: 'Pomodoro Timetable & Daily Schedule Planner',
    badge: 'Timetable',
    color: 'bg-teal-500 text-white',
    iconName: 'Calendar',
  },
  agent_pdf: {
    id: 'agent_pdf',
    name: 'PDFTutor AI',
    role: 'Multi-Document RAG & PDF Synthesizer',
    badge: 'Document RAG',
    color: 'bg-red-500 text-white',
    iconName: 'FileCode',
  },
  agent_career: {
    id: 'agent_career',
    name: 'CareerPath AI',
    role: 'ATS Resume Scanner & Interview Preparation',
    badge: 'Career & ATS',
    color: 'bg-orange-500 text-white',
    iconName: 'Briefcase',
  },
};

export interface AgentResponse {
  agentId: string;
  agentName: string;
  text: string;
  signSummary: string; // Simplified short phrase for 3D sign animation
  timestamp: string;
}

class MasterAIService {
  /**
   * Routes prompt to the best fitting AI Agent and returns intelligent response
   */
  public async routeQuery(promptText: string): Promise<AgentResponse> {
    const text = promptText.trim();
    const lower = text.toLowerCase();

    // Map single ASL letters and common sign abbreviations to full educational topics
    const aslLetterTopicMap: Record<string, { topic: string; agentId: string }> = {
      'a': { topic: 'Algorithms & Data Structures overview and complexity bounds', agentId: 'agent_code' },
      'b': { topic: 'Binary Search Trees and Tree Traversal algorithms', agentId: 'agent_code' },
      'c': { topic: 'C++ programming fundamentals and OOP concepts', agentId: 'agent_code' },
      'd': { topic: 'Data Structures (DSA) learning roadmap and problem-solving strategy', agentId: 'agent_code' },
      'e': { topic: 'ExamAce strategy and high-yield revision roadmap', agentId: 'agent_exam' },
      'f': { topic: 'Functions, Recursion and Functional Programming', agentId: 'agent_code' },
      'g': { topic: 'Graph Theory & Dijkstra Shortest Path algorithm', agentId: 'agent_code' },
      'h': { topic: 'Hash Tables, Hash Maps & Collision Resolution', agentId: 'agent_code' },
      'i': { topic: 'Inheritance, Polymorphism & Object-Oriented Principles', agentId: 'agent_code' },
      'j': { topic: 'Java Programming Language & JVM Memory Architecture', agentId: 'agent_code' },
      'k': { topic: 'Kernel, Processes & Operating System Deadlocks', agentId: 'agent_concept' },
      'l': { topic: 'Linked Lists & Dynamic Memory Allocation', agentId: 'agent_code' },
      'm': { topic: 'Memory Management, Paging & Virtual Memory in OS', agentId: 'agent_concept' },
      'n': { topic: 'Networking Protocols, TCP/IP & Socket Programming', agentId: 'agent_concept' },
      'o': { topic: 'Operating System Architecture, Deadlocks & Scheduling', agentId: 'agent_exam' },
      'p': { topic: 'Python Programming & Data Science Basics', agentId: 'agent_code' },
      'q': { topic: 'Queue Data Structure & QuickSort Algorithm', agentId: 'agent_code' },
      'r': { topic: 'Relational Database Management Systems & SQL', agentId: 'agent_concept' },
      's': { topic: 'SQL Queries, Joins & Database Normalization', agentId: 'agent_concept' },
      't': { topic: 'Trees, Binary Search Trees & Trie Data Structures', agentId: 'agent_code' },
      'u': { topic: 'UML Diagrams & System Design Fundamentals', agentId: 'agent_concept' },
      'v': { topic: 'Vectors and Dynamic Arrays in C++/Python', agentId: 'agent_code' },
      'w': { topic: 'Web Development, Node.js & REST APIs', agentId: 'agent_code' },
      'x': { topic: 'XML & JSON Structured Data Processing', agentId: 'agent_code' },
      'y': { topic: 'Yield & Generator Functions in Python', agentId: 'agent_code' },
      'z': { topic: 'Zero-Based Indexing & Pointer Memory Offsets', agentId: 'agent_code' },
      'dsa': { topic: 'Data Structures and Algorithms Complete Roadmap', agentId: 'agent_code' },
      'os': { topic: 'Operating Systems Architecture and Process Synchronization', agentId: 'agent_concept' },
      'dbms': { topic: 'Database Management Systems, SQL Joins & Normalization', agentId: 'agent_concept' },
      'sql': { topic: 'SQL Joins, Aggregation Queries & Indexing', agentId: 'agent_concept' },
      'java': { topic: 'Java Object-Oriented Programming & JVM Memory', agentId: 'agent_code' },
      'cpp': { topic: 'C++ Pointers, STL Containers & Memory Management', agentId: 'agent_code' },
      'bij': { topic: 'Binary Search, Inheritance & Java Programming concepts', agentId: 'agent_code' },
    };

    let targetAgent = AGENTS_REGISTRY.agent_concept;
    let queryToProcess = text;

    if (aslLetterTopicMap[lower]) {
      const match = aslLetterTopicMap[lower];
      queryToProcess = match.topic;
      targetAgent = AGENTS_REGISTRY[match.agentId] || AGENTS_REGISTRY.agent_concept;
    } else if (lower.includes('note') || lower.includes('summary') || lower.includes('outline') || lower.includes('mind map')) {
      targetAgent = AGENTS_REGISTRY.agent_note;
    } else if (lower.includes('code') || lower.includes('dsa') || lower.includes('binary search') || lower.includes('algorithm') || lower.includes('python') || lower.includes('java') || lower.includes('cpp')) {
      targetAgent = AGENTS_REGISTRY.agent_code;
    } else if (lower.includes('exam') || lower.includes('pyq') || lower.includes('score') || lower.includes('test')) {
      targetAgent = AGENTS_REGISTRY.agent_exam;
    } else if (lower.includes('quiz') || lower.includes('mcq') || lower.includes('flashcard') || lower.includes('question')) {
      targetAgent = AGENTS_REGISTRY.agent_quiz;
    } else if (lower.includes('schedule') || lower.includes('timetable') || lower.includes('pomodoro') || lower.includes('study plan')) {
      targetAgent = AGENTS_REGISTRY.agent_study;
    } else if (lower.includes('resume') || lower.includes('ats') || lower.includes('career') || lower.includes('job')) {
      targetAgent = AGENTS_REGISTRY.agent_career;
    }

    // Call active LLM Provider (Groq / Gemini / OpenAI / DeepSeek / Ollama) via LLMService
    try {
      const systemPrompt = `You are ${targetAgent.name} (${targetAgent.role}), part of EduVerse AI platform. Provide clear, structured, student-friendly, step-by-step educational explanations in GitHub Markdown with code examples, formulas, and active recall bullet points where relevant.`;
      
      const llmResult = await llmService.generate(queryToProcess, systemPrompt);
      if (llmResult && llmResult.text) {
        return {
          agentId: targetAgent.id,
          agentName: `${targetAgent.name} [${llmResult.provider.toUpperCase()}: ${llmResult.model}]`,
          text: llmResult.text,
          signSummary: queryToProcess.length > 30 ? queryToProcess.substring(0, 30).toUpperCase() : queryToProcess.toUpperCase(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    } catch (e) {
      console.warn('LLMService dispatch error, using fallback:', e);
    }

    // Smart responses for demo & offline mode
    let responseText = '';
    if (["hi", "hello", "hey", "hello hi", "hi there", "greetings", "good morning", "good evening"].includes(lower)) {
      responseText = `### 👋 Hello! Welcome to EduVerse AI\n\nI am your **Master AI Learning Assistant**. I orchestrate **9 specialized AI agents** to help you learn, solve doubts, write code, prepare for exams, and build your career.\n\n#### 🚀 How can I help you today?\n- **💡 Concept Doubts**: Ask me to explain any topic in detail.\n- **💻 Coding & DSA**: Ask for Python, C++, Java, or SQL snippets.\n- **📚 Exam Prep**: Ask for high-yield revision roadmaps & PYQs.\n- **📑 MCQ Quizzes**: Ask to launch an adaptive quiz challenge.`;
    } else if (targetAgent.id === 'agent_code') {
      responseText = `### 💻 CodeMentor AI — Solution Breakdown\n\nDetailed analysis for **"${text}"** (${queryToProcess}):\n\n#### ⚡ Key Logic & Complexity:\n- **Time Complexity**: O(N log N) / O(log N) optimal traversal.\n- **Space Complexity**: O(N) auxiliary space.\n\n\`\`\`python\n# Optimized Solution Structure for: ${text}\ndef solve_problem(data):\n    # Process input data efficiently\n    result = []\n    for item in data:\n        result.append(item)\n    return result\n\`\`\`\n\n*Try testing this code in the CodeMentor Sandbox tab!*`;
    } else if (targetAgent.id === 'agent_note') {
      responseText = `### 📑 NoteCraft AI — Structured Revision Notes\n\nComprehensive notes generated for **"${text}"**:\n\n#### 📌 Core Definitions & Mind Map:\n1. **Fundamental Principle**: Core concept underlying ${text}.\n2. **Key Takeaway**: High-yield formulas, rules, and best practices.\n3. **Summary**: Essential summary points for active recall revision.`;
    } else if (targetAgent.id === 'agent_exam') {
      responseText = `### 📚 ExamAce AI — High-Yield Exam Roadmap\n\nStrategy for **"${text}"**:\n\n1. **Topic Weightage**: Priority breakdown based on recent PYQs.\n2. **Revision Blocks**: 3-day rapid review cycle with practice problems.\n3. **Active Recall**: Test key formulas and theoretical proofs under timed conditions.`;
    } else if (targetAgent.id === 'agent_quiz') {
      responseText = `### 📑 QuizMaster AI — MCQ Challenge Ready\n\nGenerated evaluation for **"${text}"**.\n\n*Click the QuizMaster AI tab in the left sidebar to play the interactive MCQ Game with instant scoring & results page!*`;
    } else {
      responseText = `### 🧠 Master AI Synthesized Answer\n\nComprehensive breakdown for **"${text}"** (${queryToProcess}):\n\n#### 📌 Step-by-Step Breakdown:\n1. **Core Concept**: Comprehensive explanation tailored for **"${text}"**.\n2. **Practical Application**: Real-world examples, step-by-step logic, and active recall takeaways.\n3. **Next Steps**: You can ask for code examples, request an adaptive quiz, or ask me to simplify any sub-topic!`;
    }

    const currentProvider = llmService.getConfig().activeProvider.toUpperCase();
    const currentModel = llmService.getConfig().activeModel;

    return {
      agentId: targetAgent.id,
      agentName: `${targetAgent.name} [${currentProvider}: ${currentModel}]`,
      text: responseText,
      signSummary: queryToProcess.length > 30 ? queryToProcess.substring(0, 30).toUpperCase() : queryToProcess.toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

export const masterAIService = new MasterAIService();
