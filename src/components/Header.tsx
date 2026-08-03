import React from 'react';
import {
  Zap,
  Clock,
  FileText,
  Quote as QuoteIcon,
  Code,
  Award,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Coins,
  Sparkles,
  Bot,
  Ghost,
  BookOpen,
} from 'lucide-react';
import type { TestMode, TimeOption, WordOption, SubMode, CodeLanguage, UserProfile, TextCategory } from '../types';

interface HeaderProps {
  mode: TestMode;
  setMode: (m: TestMode) => void;
  subMode: SubMode;
  setSubMode: (sm: SubMode) => void;
  category: TextCategory;
  setCategory: (c: TextCategory) => void;
  timeOption: TimeOption;
  setTimeOption: (t: TimeOption) => void;
  wordOption: WordOption;
  setWordOption: (w: WordOption) => void;
  codeLang: CodeLanguage;
  setCodeLang: (l: CodeLanguage) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  focusMode: boolean;
  setFocusMode: (f: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (d: boolean) => void;
  profile: UserProfile;
  onOpenRpg: () => void;
  onOpenAiCoach: () => void;
  onOpenCustomModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  subMode,
  setSubMode,
  category,
  setCategory,
  timeOption,
  setTimeOption,
  wordOption,
  setWordOption,
  codeLang,
  setCodeLang,
  soundEnabled,
  setSoundEnabled,
  focusMode,
  setFocusMode,
  dyslexicFont,
  setDyslexicFont,
  profile,
  onOpenRpg,
  onOpenAiCoach,
  onOpenCustomModal,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto pt-4 pb-2 px-4 flex flex-col gap-3">
      {/* Top Navbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setMode('time')}>
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <Zap className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              TYPERIX
            </h1>
            <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest">WORLD'S BEST AI TYPING PLATFORM</p>
          </div>
        </div>

        {/* Action Controls & RPG Profile Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Settings Toggles */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Mechanical Key Sounds'}
              className={`p-1.5 rounded-lg transition-all ${
                soundEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setFocusMode(!focusMode)}
              title={focusMode ? 'Disable Eye Focus Mode' : 'Enable Eye Focus Mode'}
              className={`p-1.5 rounded-lg transition-all ${
                focusMode ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              title={dyslexicFont ? 'Disable Dyslexic Font' : 'Enable Dyslexic Friendly Font'}
              className={`p-1.5 rounded-lg transition-all ${
                dyslexicFont ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAiCoach}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 flex items-center gap-1.5 text-xs font-semibold transition-all shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Coach</span>
            </button>
          </div>

          {/* User RPG Level Badge */}
          <div
            onClick={onOpenRpg}
            className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-xl px-3 py-1 cursor-pointer hover:border-cyan-400 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center border border-cyan-400/40">
                {profile.level}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  Lvl {profile.level}
                </span>
                <span className="text-[9px] text-cyan-400/70 font-mono">
                  {profile.xp}/{profile.nextLevelXp} XP
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-lg">
              <Coins className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">{profile.coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode & Category Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-1.5 backdrop-blur-md">
        {/* Main Test Modes */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            onClick={() => setMode('time')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'time' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            onClick={() => setMode('words')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'words' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            onClick={() => setMode('category')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'category' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setMode('quote')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'quote' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QuoteIcon className="w-3.5 h-3.5" />
            <span>Quote</span>
          </button>

          <button
            onClick={() => setMode('code')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'code' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setMode('ghost')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'ghost' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ghost className="w-3.5 h-3.5" />
            <span>Ghost Race</span>
          </button>

          <button
            onClick={() => setMode('exam')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'exam' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>

          <button
            onClick={onOpenCustomModal}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'custom' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>PDF/Resume</span>
          </button>
        </div>

        {/* Category Pills if Category mode */}
        {mode === 'category' && (
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl text-[11px] font-mono">
            {(['general', 'science', 'history', 'exams', 'medical', 'anime'] as TextCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
                  category === cat ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Sub-Option Selector depending on mode */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl text-xs font-mono">
          {mode === 'time' && (
            <>
              {[15, 30, 60, 120].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeOption(t as TimeOption)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    timeOption === t ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </>
          )}

          {mode === 'words' && (
            <>
              {[10, 25, 50, 100, 250].map((w) => (
                <button
                  key={w}
                  onClick={() => setWordOption(w as WordOption)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    wordOption === w ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {w}
                </button>
              ))}
            </>
          )}

          {mode === 'code' && (
            <>
              {(['javascript', 'typescript', 'python', 'cpp', 'java', 'html', 'sql', 'rust', 'go'] as CodeLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  className={`px-1.5 py-0.5 rounded-lg uppercase text-[11px] transition-all ${
                    codeLang === lang ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </>
          )}

          {(mode === 'time' || mode === 'words') && (
            <div className="flex items-center gap-1 border-l border-slate-800 ml-1 pl-1">
              {(['normal', 'numbers', 'symbols', 'mixed', 'blind'] as SubMode[]).map((sm) => (
                <button
                  key={sm}
                  onClick={() => setSubMode(sm)}
                  className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
                    subMode === sm ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sm}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
