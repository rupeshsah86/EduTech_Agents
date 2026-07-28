import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, Search, Sparkles } from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  pages: number;
  status: 'Indexed' | 'Parsing';
}

export const PDFTutorUploader: React.FC = () => {
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    { id: '1', name: 'Operating_Systems_Concepts_10th_Ed.pdf', size: '14.2 MB', pages: 840, status: 'Indexed' },
    { id: '2', name: 'DSA_Exam_Prep_Lecture_Notes.pdf', size: '3.8 MB', pages: 120, status: 'Indexed' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: UploadedDoc = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 50) + 10,
        status: 'Indexed'
      };
      setDocuments((prev) => [...prev, newDoc]);
    }
  };

  const handleQuery = () => {
    if (!searchQuery.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setQueryResult(
        `### PDFTutor Multi-Document Reasoning Output\n\nCross-referenced **${documents.length} indexed documents** for query: *"${searchQuery}"*\n\n` +
        `#### 📌 Key Citations & Page References:\n` +
        `- **${documents[0]?.name || 'Operating Systems.pdf'} (Page 245)**: "Paging divides logical memory into fixed-size blocks called pages, avoiding external fragmentation."\n` +
        `- **${documents[1]?.name || 'Lecture Notes.pdf'} (Page 18)**: "TLB cache hit ratio directly impacts Effective Memory Access Time (EMAT)."\n\n` +
        `#### 💡 Synthesized Key Formula:\n` +
        `$$\\text{EMAT} = h \\times (t_{tlb} + t_{mem}) + (1 - h) \\times (t_{tlb} + 2 \\times t_{mem})$$`
      );
      setIsQuerying(false);
    }, 1000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            PDFTutor AI Multi-Document RAG Engine
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
          Vector Index Ready
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors relative">
        <input
          type="file"
          accept=".pdf"
          onChange={handleSimulatedUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          Drop PDF Textbooks or Lecture Notes Here
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Upload multiple PDF files for instant vector chunking and cross-document QA
        </p>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Active Index Vector Store ({documents.length} Files)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-red-500 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-400">{doc.size} • {doc.pages} pages</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-PDF Query Search Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask a question across all uploaded PDFs (e.g. 'Compare page replacement algorithms')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-red-500 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <button
            onClick={handleQuery}
            disabled={!searchQuery.trim() || isQuerying}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
          >
            {isQuerying ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Query PDFs</span>
          </button>
        </div>

        {/* RAG Output Result */}
        {queryResult && (
          <div className="p-4 rounded-xl glass-panel border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
            {queryResult}
          </div>
        )}
      </div>
    </div>
  );
};
