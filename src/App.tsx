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
} from './types';

import { generateTestText } from './services/textProvider';
import { getUserProfile, saveUserProfile, getQuests, saveTestResult } from './services/storageService';
import { soundEngine } from './services/soundEngine';
import { getTheme } from './services/themeProvider';

import confetti from 'canvas-confetti';

export function App() {
  const [mode, setMode] = useState<TestMode>('time');
  const [subMode, setSubMode] = useState<SubMode>('normal');
  const [category, setCategory] = useState<TextCategory>('general');
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

  // Generate test prompt text
  const targetText = useMemo(() => {
    return generateTestText(mode, subMode, wordOption, codeLang, 'ssc_chsl', category, customRawText);
  }, [mode, subMode, wordOption, codeLang, category, customRawText]);

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

    // Trigger celebratory confetti if accuracy >= 95%
    if (result.accuracy >= 95) {
      confetti({
        particleCount: 80,
        spread: 70,
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
      {/* Header */}
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

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-start gap-4">
        {/* Ghost Race Bar if in Ghost Mode */}
        {mode === 'ghost' && (
          <GhostRace
            userProgressPct={lastResult ? 100 : 45}
            ghostProgressPct={70}
            userWpm={lastResult ? lastResult.wpm : 0}
            ghostWpm={profile.personalBests['time_30'] || 68}
          />
        )}

        {/* Typing Engine */}
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
          <div className="w-full flex flex-col gap-6 animate-fadeIn" id="ai-coach-section">
            {/* Quick Results Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto w-full">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">NET SPEED</span>
                <span className="text-3xl font-black text-cyan-400 font-mono tracking-tight">{lastResult.wpm}</span>
                <span className="text-[10px] text-cyan-500 font-bold">WPM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">ACCURACY</span>
                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{lastResult.accuracy}%</span>
                <span className="text-[10px] text-emerald-500 font-bold">{lastResult.errorCount} Errors</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">RAW SPEED</span>
                <span className="text-3xl font-black text-indigo-400 font-mono tracking-tight">{lastResult.rawWpm}</span>
                <span className="text-[10px] text-indigo-500 font-bold">RAW WPM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">BURST SPEED</span>
                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {Math.max(...lastResult.keystrokes.map((k) => k.instantWpm || lastResult.wpm))}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold">PEAK WPM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center gap-0.5 shadow-xl">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">MISSING</span>
                <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">{lastResult.missingCount || 0}</span>
                <span className="text-[10px] text-amber-500 font-bold">SKIPPED</span>
              </div>
            </div>

            {/* 4-Series Analytics Graph (Speed, Raw, Burst, Errors, Missing) */}
            <LiveAnalyticsGraph result={lastResult} />

            {/* AI Diagnostics & Recommendations */}
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

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 font-mono border-t border-slate-900 mt-6">
        <p>TYPERIX PLATFORM — READY FOR VERCEL DEPLOYMENT</p>
      </footer>
    </div>
  );
}

export default App;
