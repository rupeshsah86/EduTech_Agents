import React, { useState } from 'react';
import { Code2, Play, CheckCircle2, Terminal } from 'lucide-react';

export const CodeMentorSandbox: React.FC = () => {
  const [code, setCode] = useState<string>(
`def dijkstra(graph, start):
    # Shortest path algorithm implementation
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current_node = heap_pop(pq)
        for neighbor, weight in graph[current_node].items():
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heap_push(pq, (distance, neighbor))
                
    return distances`
  );

  const [isExecuting, setIsExecuting] = useState(false);
  const [analysis, setAnalysis] = useState<{
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string[];
  } | null>(null);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setAnalysis({
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        suggestions: [
          'Use a Min-Heap priority queue for optimal O(log V) pop operations.',
          'Add a visited set check to avoid processing duplicate nodes.',
          'Verify edge weights are non-negative to prevent infinite loops.'
        ]
      });
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-teal-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            CodeMentor AI Sandbox & Complexity Analyzer
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 border border-teal-500/20">
          v1.2 Active
        </span>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={9}
          className="w-full p-4 rounded-xl font-mono text-xs bg-slate-900 text-teal-300 border border-slate-800 focus:outline-none focus:border-teal-500 leading-relaxed resize-none"
          placeholder="// Type or paste code here..."
        />
        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className="absolute bottom-3 right-3 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          {isExecuting ? 'Analyzing...' : 'Analyze & Run'}
        </button>
      </div>

      {analysis && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-teal-400" /> Big-O Complexity Analysis
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-mono font-bold">Time: {analysis.timeComplexity}</span>
              <span className="text-indigo-400 font-mono font-bold">Space: {analysis.spaceComplexity}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-slate-400 font-semibold text-[11px]">Optimization Suggestions:</p>
            {analysis.suggestions.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
