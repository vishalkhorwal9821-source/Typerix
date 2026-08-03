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
  Layers,
} from 'lucide-react';
import type { TestMode, TimeOption, WordOption, SubMode, CodeLanguage, UserProfile, TextCategory, DifficultyLevel } from '../types';

interface HeaderProps {
  mode: TestMode;
  setMode: (m: TestMode) => void;
  subMode: SubMode;
  setSubMode: (sm: SubMode) => void;
  category: TextCategory;
  setCategory: (c: TextCategory) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (d: DifficultyLevel) => void;
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
  difficulty,
  setDifficulty,
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
    <header className="w-full max-w-[1700px] mx-auto pt-2 sm:pt-4 pb-2 px-2.5 sm:px-6 flex flex-col gap-2">
      {/* Top Navbar */}
      <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => setMode('time')}>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              TYPERIX
            </h1>
            <p className="text-[9px] text-cyan-400/60 font-mono tracking-widest hidden md:block">WORLD'S BEST AI TYPING PLATFORM</p>
          </div>
        </div>

        {/* Action Controls & RPG Profile Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Settings Toggles */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Key Sounds'}
              className={`p-1.5 rounded-lg transition-all ${
                soundEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setFocusMode(!focusMode)}
              title={focusMode ? 'Disable Eye Focus Mode' : 'Enable Eye Focus Mode'}
              className={`p-1.5 rounded-lg transition-all ${
                focusMode ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              title={dyslexicFont ? 'Disable Dyslexic Font' : 'Enable Dyslexic Friendly Font'}
              className={`p-1.5 rounded-lg transition-all ${
                dyslexicFont ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenAiCoach}
              className="px-2 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 text-[10px] sm:text-xs font-semibold shadow-sm"
            >
              <Bot className="w-3 h-3 text-cyan-400" />
              <span className="hidden xs:inline">AI Coach</span>
            </button>
          </div>

          {/* User RPG Level Badge */}
          <div
            onClick={onOpenRpg}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-xl px-2 py-1 cursor-pointer shadow-lg"
          >
            <span className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[9px] sm:text-[10px] flex items-center justify-center border border-cyan-400/40">
              {profile.level}
            </span>
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-1 py-0.5 rounded-lg">
              <Coins className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-400" />
              <span className="text-[10px] sm:text-xs font-bold text-amber-300">{profile.coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode & Category Toolbar - Responsive Scrollable Bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-1 backdrop-blur-md overflow-x-auto whitespace-nowrap">
        {/* Main Test Modes */}
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setMode('time')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'time' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Time</span>
          </button>

          <button
            onClick={() => setMode('words')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'words' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Words</span>
          </button>

          <button
            onClick={() => setMode('article')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'article' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Articles</span>
          </button>

          <button
            onClick={() => setMode('category')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'category' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setMode('quote')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'quote' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QuoteIcon className="w-3 h-3" />
            <span>Quote</span>
          </button>

          <button
            onClick={() => setMode('code')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'code' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setMode('ghost')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'ghost' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ghost className="w-3 h-3" />
            <span>Ghost</span>
          </button>

          <button
            onClick={() => setMode('exam')}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'exam' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Exams</span>
          </button>

          <button
            onClick={onOpenCustomModal}
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'custom' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>PDF</span>
          </button>
        </div>

        {/* Sub Option Selectors */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl text-[10px] sm:text-[11px] font-mono min-w-max">
          {mode === 'article' && (
            <>
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-0.5 rounded-lg uppercase transition-all ${
                    difficulty === d ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </>
          )}

          {mode === 'category' && (
            <>
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
            </>
          )}

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

          {(mode === 'time' || mode === 'words') && (
            <div className="flex items-center gap-1 border-l border-slate-800 ml-1 pl-1">
              {(['normal', 'numbers', 'symbols', 'mixed', 'blind'] as SubMode[]).map((sm) => (
                <button
                  key={sm}
                  onClick={() => setSubMode(sm)}
                  className={`px-1.5 py-0.5 rounded-lg capitalize text-[10px] transition-all ${
                    subMode === sm ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sm}
                </button>
              ))}
            </div>
          )}

          {mode === 'code' && (
            <>
              {(['javascript', 'typescript', 'python', 'cpp', 'java', 'html', 'sql', 'rust', 'go'] as CodeLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  className={`px-1.5 py-0.5 rounded-lg uppercase text-[10px] transition-all ${
                    codeLang === lang ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
