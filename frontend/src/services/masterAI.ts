// Master AI Orchestrator & Router Service for 9 EduVerse AI Agents

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

    let targetAgent = AGENTS_REGISTRY.agent_concept;

    if (lower.includes('note') || lower.includes('summary') || lower.includes('outline') || lower.includes('mind map')) {
      targetAgent = AGENTS_REGISTRY.agent_note;
    } else if (lower.includes('code') || lower.includes('dsa') || lower.includes('binary search') || lower.includes('algorithm') || lower.includes('python') || lower.includes('java')) {
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

    // Try backend call if available, fallback to high quality offline router
    try {
      const response = await fetch('/api/master-ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, agent_id: targetAgent.id }),
      });
      if (response.ok) {
        const data = await response.json();
        return {
          agentId: data.agent_id || targetAgent.id,
          agentName: data.agent_name || targetAgent.name,
          text: data.response || data.message || text,
          signSummary: data.sign_summary || text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    } catch {
      // Graceful fallback to smart client-side agent logic
    }

    // Smart responses for demo & offline mode
    let responseText = '';
    if (targetAgent.id === 'agent_code') {
      if (lower.includes('binary search')) {
        responseText = 'Binary Search is an efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half. Time complexity is O(log N).';
      } else {
        responseText = `CodeMentor AI analyzed your request "${text}". Here is the optimized algorithm breakdown and time complexity analysis.`;
      }
    } else if (targetAgent.id === 'agent_note') {
      responseText = `NoteCraft AI generated structured notes for "${text}": Key Concepts, Definitions, and Mind Map breakdown ready.`;
    } else if (targetAgent.id === 'agent_concept') {
      if (lower.includes('hello') || lower.includes('hi')) {
        responseText = 'Hello! I am Master AI with 9 specialized AI agents ready to assist you in Sign Language!';
      } else {
        responseText = `ConceptClear AI simplified response for "${text}": Core principles explained step-by-step with visual intuition.`;
      }
    } else {
      responseText = `${targetAgent.name} response for: "${text}". Ready for review and sign playback.`;
    }

    return {
      agentId: targetAgent.id,
      agentName: targetAgent.name,
      text: responseText,
      signSummary: text.length > 30 ? text.substring(0, 30) : text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

export const masterAIService = new MasterAIService();
