import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TypingBox } from './components/TypingBox';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { KeystrokeReplay } from './components/KeystrokeReplay';
import { LiveAnalyticsGraph } from './components/LiveAnalyticsGraph';
import { AICoachCard } from './components/AICoachCard';
import { GhostRace } from './components/GhostRace';
import { RPGPanel } from './components/RPGPanel';
import { CustomTextModal } from './components/CustomTextModal';
import { Footer } from './components/Footer';

import type {
  TestMode,
  SubMode,
  TimeOption,
  WordOption,
  CodeLanguage,
  TestResult,
  UserProfile,
  Quest,
  TextCategory,
  DifficultyLevel,
} from './types';

import { generateTestText } from './services/textProvider';
import { getUserProfile, saveUserProfile, getQuests, saveTestResult } from './services/storageService';
import { soundEngine } from './services/soundEngine';
import { getTheme } from './services/themeProvider';

import confetti from 'canvas-confetti';
import { Trophy, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

export function App() {
  const [mode, setMode] = useState<TestMode>('time');
  const [subMode, setSubMode] = useState<SubMode>('normal');
  const [category, setCategory] = useState<TextCategory>('general');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [codeLang, setCodeLang] = useState<CodeLanguage>('javascript');
  const [customRawText, setCustomRawText] = useState<string>('');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [quests, setQuests] = useState<Quest[]>(getQuests());

  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [showRpgModal, setShowRpgModal] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const currentTheme = useMemo(() => getTheme(profile.activeTheme), [profile.activeTheme]);

  const targetText = useMemo(() => {
    return generateTestText(mode, subMode, wordOption, codeLang, 'ssc_chsl', category, difficulty, customRawText);
  }, [mode, subMode, wordOption, codeLang, category, difficulty, customRawText]);

  const [textKey, setTextKey] = useState<number>(0);

  const handleResetText = () => {
    setTextKey((k) => k + 1);
    setLastResult(null);
  };

  const handleTestComplete = (result: TestResult) => {
    setLastResult(result);
    const { updatedProfile, leveledUp } = saveTestResult(result);
    setProfile(updatedProfile);
    setQuests(getQuests());

    if (result.accuracy >= 95) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    if (leveledUp) {
      soundEngine.speakMessage(`Congratulations! You achieved Level ${updatedProfile.level}!`);
    }
  };

  const handleStartAdaptivePractice = (practiceText: string) => {
    setCustomRawText(practiceText);
    setMode('custom');
    setLastResult(null);
    setTextKey((k) => k + 1);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} ${currentTheme.textColor} flex flex-col justify-between selection:bg-cyan-500/30 font-sans transition-all duration-300 pb-6`}>
      {/* Top Navigation */}
      <Header
        mode={mode}
        setMode={(m) => {
          setMode(m);
          setCustomRawText('');
          setLastResult(null);
        }}
        subMode={subMode}
        setSubMode={setSubMode}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        timeOption={timeOption}
        setTimeOption={setTimeOption}
        wordOption={wordOption}
        setWordOption={setWordOption}
        codeLang={codeLang}
        setCodeLang={setCodeLang}
        soundEnabled={soundEnabled}
        setSoundEnabled={(s) => {
          setSoundEnabled(s);
          soundEngine.setSoundType(s ? profile.activeSound : 'silent');
        }}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        dyslexicFont={dyslexicFont}
        setDyslexicFont={setDyslexicFont}
        profile={profile}
        onOpenRpg={() => setShowRpgModal(true)}
        onOpenAiCoach={() => {
          if (lastResult) {
            const el = document.getElementById('ai-coach-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenCustomModal={() => setShowCustomModal(true)}
      />

      {/* Main Responsive Grid Layout */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-2">
        {/* Left Column: Primary Typing Engine & Analytics (8 Columns) */}
        <section className="lg:col-span-8 flex flex-col gap-4 sm:gap-6 w-full">
          {/* Ghost Race Bar if in Ghost Mode */}
          {mode === 'ghost' && (
            <GhostRace
              userProgressPct={lastResult ? 100 : 45}
              ghostProgressPct={70}
              userWpm={lastResult ? lastResult.wpm : 0}
              ghostWpm={profile.personalBests['time_30'] || 68}
            />
          )}

          {/* Typing Box */}
          <TypingBox
            key={textKey}
            targetText={targetText}
            mode={mode}
            subMode={subMode}
            category={category}
            timeOption={timeOption}
            wordOption={wordOption}
            soundEnabled={soundEnabled}
            focusMode={focusMode}
            dyslexicFont={dyslexicFont}
            onTestComplete={handleTestComplete}
            onResetText={handleResetText}
          />

          {/* Completed Test Results Overview */}
          {lastResult && (
            <div className="w-full flex flex-col gap-4 sm:gap-6 animate-fadeIn" id="ai-coach-section">
              {/* Quick Results Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 w-full">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">NET SPEED</span>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight">{lastResult.wpm}</span>
                  <span className="text-[9px] sm:text-[10px] text-cyan-500 font-bold">WPM</span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">ACCURACY</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">{lastResult.accuracy}%</span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold">{lastResult.errorCount} Errors</span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">RAW SPEED</span>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono tracking-tight">{lastResult.rawWpm}</span>
                  <span className="text-[9px] sm:text-[10px] text-indigo-500 font-bold">RAW WPM</span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">PEAK BURST</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                    {Math.max(...lastResult.keystrokes.map((k) => k.instantWpm || lastResult.wpm))}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold">PEAK WPM</span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl col-span-2 sm:col-span-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">SKIPPED</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">{lastResult.missingCount || 0}</span>
                  <span className="text-[9px] sm:text-[10px] text-amber-500 font-bold">MISSING</span>
                </div>
              </div>

              {/* Full Width Multi-Metric Graph */}
              <LiveAnalyticsGraph result={lastResult} />

              {/* AI Diagnostics */}
              <AICoachCard result={lastResult} onStartAdaptivePractice={handleStartAdaptivePractice} />

              {/* 3D Keystroke Replay Player */}
              <KeystrokeReplay result={lastResult} />
            </div>
          )}

          {/* Interactive Virtual Keyboard Visualizer */}
          <VirtualKeyboard
            activeKey={undefined}
            heatmapData={lastResult?.heatmap}
            showHeatmap={!!lastResult}
          />
        </section>

        {/* Right Column: Studio Dashboard & Stats Sidebar (4 Columns) */}
        <aside className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 w-full">
          {/* User Profile & Streak Widget */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg">
                  {profile.level}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{profile.username}</h3>
                  <p className="text-[11px] sm:text-xs text-cyan-400 font-mono">{profile.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300">
                <Flame className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 animate-bounce" />
                <span>{profile.streakDays} Day Streak</span>
              </div>
            </div>

            {/* Level XP Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>LEVEL {profile.level} PROGRESS</span>
                <span>{profile.xp}/{profile.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Personal Bests Widget */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
            <h3 className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" />
              <span>Personal Best Records</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-slate-500">15s TIME</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400">{profile.personalBests['time_15'] || 65} WPM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-slate-500">30s TIME</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400">{profile.personalBests['time_30'] || 72} WPM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-slate-500">60s TIME</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400">{profile.personalBests['time_60'] || 68} WPM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-slate-500">CODE MODE</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400">{profile.personalBests['code'] || 55} WPM</span>
              </div>
            </div>
          </div>

          {/* Daily Quests Sidebar Widget */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
            <h3 className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400" />
              <span>Active Daily Quests</span>
            </h3>

            <div className="flex flex-col gap-2">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${
                    q.isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{q.title}</span>
                    {q.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Progress: {q.progress}/{q.target}</span>
                    <span className="text-amber-300">+{q.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* RPG Gamification Drawer */}
      {showRpgModal && (
        <RPGPanel
          profile={profile}
          quests={quests}
          onClose={() => setShowRpgModal(false)}
          onSelectTheme={(themeId) => {
            const updated = { ...profile, activeTheme: themeId };
            setProfile(updated);
            saveUserProfile(updated);
          }}
          onSelectSound={(soundId) => {
            const updated = { ...profile, activeSound: soundId };
            setProfile(updated);
            saveUserProfile(updated);
            soundEngine.setSoundType(soundId);
          }}
        />
      )}

      {/* Custom Text & PDF Modal */}
      {showCustomModal && (
        <CustomTextModal
          onClose={() => setShowCustomModal(false)}
          onSetCustomText={(txt) => {
            setCustomRawText(txt);
            setMode('custom');
            setLastResult(null);
            setTextKey((k) => k + 1);
          }}
        />
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default App;
