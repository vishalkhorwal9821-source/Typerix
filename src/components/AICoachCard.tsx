import React, { useState } from 'react';
import type { TestResult } from '../types';
import { analyzeTestWithAI, answerAICoachQuestion } from '../services/aiCoach';
import { Bot, Sparkles, AlertCircle, Award, Send, Cpu, CheckCircle } from 'lucide-react';

interface AICoachCardProps {
  result: TestResult;
  onStartAdaptivePractice: (text: string) => void;
}

export const AICoachCard: React.FC<AICoachCardProps> = ({ result, onStartAdaptivePractice }) => {
  const insight = analyzeTestWithAI(result);

  const [chatQuestion, setChatQuestion] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `Hello! I analyzed your ${result.wpm} WPM run (${result.accuracy}% accuracy). ${insight.advice[0] || 'What would you like to improve on?'}`,
    },
  ]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const q = chatQuestion;
    setChatQuestion('');

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: q }];
    setChatMessages(newMsgs);

    setTimeout(() => {
      const answer = answerAICoachQuestion(q, { wpm: result.wpm, accuracy: result.accuracy });
      setChatMessages((prev) => [...prev, { sender: 'ai', text: answer }]);
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              AI Personal Typing Coach Diagnostic
            </h3>
            <p className="text-xs text-cyan-400/70 font-mono">NEURAL KEISTROKE HEURISTICS</p>
          </div>
        </div>

        {/* Confidence & Endurance Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Confidence: {insight.confidenceScore}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-300">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Rhythm: {insight.rhythmScore}%</span>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Advice Bullet List */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Performance Observations</span>
          </h4>

          <ul className="flex flex-col gap-2.5">
            {insight.advice.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onStartAdaptivePractice(insight.recommendedText)}
            className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Adaptive Weak Keys Drill</span>
          </button>
        </div>

        {/* Confused Pairs & Fatigue Box */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Error Pairs & Finger Imbalance</span>
          </h4>

          {insight.confusedPairs.length > 0 ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400">Target ➔ Typed Confusion:</span>
              <div className="flex flex-wrap gap-2">
                {insight.confusedPairs.map((pair, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold"
                  >
                    {pair.expected} ➔ {pair.typed} ({pair.count}x)
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Zero letter pair confusion detected in this run!</p>
          )}

          {insight.slowestFinger && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              Finger Lag: <strong>{insight.slowestFinger.name.toUpperCase()}</strong> is {insight.slowestFinger.pctSlower}% slower than your average finger pace.
            </div>
          )}

          {insight.fatigueDetected && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200">
              Fatigue Notice: Speed drop detected after ~{insight.fatigueTimeSec}s. Take a 2-min wrist stretch break!
            </div>
          )}
        </div>
      </div>

      {/* Interactive AI Coach Chat Drawer */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
        <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
          <Bot className="w-4 h-4" />
          <span>Ask Your AI Mentor</span>
        </h4>

        <div className="max-h-36 overflow-y-auto flex flex-col gap-2 p-2 bg-slate-900/60 rounded-xl">
          {chatMessages.map((m, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                m.sender === 'user'
                  ? 'self-end bg-cyan-500/20 border border-cyan-500/30 text-cyan-200'
                  : 'self-start bg-slate-800 border border-slate-700 text-slate-200'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder="Ask AI Coach e.g. 'Why am I stuck at 70 WPM?'..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
