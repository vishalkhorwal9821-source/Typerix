import React, { useState } from 'react';
import { X, FileText, Upload, Sparkles } from 'lucide-react';

interface CustomTextModalProps {
  onClose: () => void;
  onSetCustomText: (text: string) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({ onClose, onSetCustomText }) => {
  const [pastedText, setPastedText] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedText(content.slice(0, 2000)); // Limit to 2000 chars for smooth typing
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    onSetCustomText(pastedText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Custom Practice / Resume / PDF</h3>
            <p className="text-xs text-slate-400">Practice typing with your own materials or resume skills</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Paste Custom Text or Resume Skills:</label>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste Java interview questions, medical terms, law articles, or resume content here..."
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Document (.txt, .md)</span>
              <input type="file" accept=".txt,.md,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={!pastedText.trim()}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Custom Typing Session</span>
          </button>
        </form>
      </div>
    </div>
  );
};
