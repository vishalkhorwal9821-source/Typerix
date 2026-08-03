import React, { useState, useEffect, useRef } from 'react';
import type { Keystroke, TestResult, TestMode, SubMode, KeyHeatmapData, FingerStat, TextCategory } from '../types';
import { soundEngine } from '../services/soundEngine';
import { getFingerForKey } from '../services/aiCoach';
import { Play, RotateCcw } from 'lucide-react';

interface TypingBoxProps {
  targetText: string;
  mode: TestMode;
  subMode: SubMode;
  category: TextCategory;
  timeOption: number;
  wordOption: number;
  soundEnabled: boolean;
  focusMode: boolean;
  dyslexicFont: boolean;
  onTestComplete: (result: TestResult) => void;
  onResetText: () => void;
}

export const TypingBox: React.FC<TypingBoxProps> = ({
  targetText,
  mode,
  subMode,
  category,
  timeOption,
  wordOption,
  soundEnabled,
  focusMode,
  dyslexicFont,
  onTestComplete,
  onResetText,
}) => {
  const [typedInput, setTypedInput] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(timeOption);
  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [missingCount, setMissingCount] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCaretRef = useRef<HTMLSpanElement>(null);
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    resetState();
  }, [targetText, mode, subMode, category, timeOption, wordOption]);

  const resetState = () => {
    setTypedInput('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setTimeLeft(timeOption);
    setKeystrokes([]);
    setErrorCount(0);
    setMissingCount(0);
    setBackspaceCount(0);
    setLiveWpm(0);
    setLiveAccuracy(100);
    lastKeyTimeRef.current = 0;
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Instant precise container scrollTop tracking on every keystroke
  useEffect(() => {
    if (activeCaretRef.current && containerRef.current) {
      const container = containerRef.current;
      const caret = activeCaretRef.current;
      const caretTop = caret.offsetTop;
      const containerHeight = container.clientHeight;

      // Keep active caret line centered inside the container instantly without animation locks
      const targetScroll = Math.max(0, caretTop - containerHeight / 3);
      container.scrollTop = targetScroll;
    }
  }, [typedInput.length]);

  // Timer countdown hook for time mode
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isStarted && !isFinished && mode === 'time') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStarted, isFinished, mode]);

  // Precise Live WPM & Accuracy calculation hook
  useEffect(() => {
    if (!isStarted || !startTime || typedInput.length === 0) return;

    const now = Date.now();
    const elapsedMinutes = Math.max(0.01, (now - startTime) / 60000);

    let correctChars = 0;
    for (let i = 0; i < typedInput.length; i++) {
      if (typedInput[i] === targetText[i]) {
        correctChars += 1;
      }
    }

    const netWpm = Math.max(0, Math.round(((correctChars / 5) - (errorCount * 0.2)) / elapsedMinutes));

    setLiveWpm(netWpm);

    const totalTyped = typedInput.length;
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errorCount) / totalTyped) * 100) : 100;
    setLiveAccuracy(Math.max(0, accuracy));
  }, [typedInput, errorCount, isStarted, startTime, targetText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      resetState();
      onResetText();
      return;
    }

    if (e.key === 'Backspace') {
      setBackspaceCount((b) => b + 1);
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const val = e.target.value;
    const now = Date.now();

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(now);
      lastKeyTimeRef.current = now;
    }

    const prevLength = typedInput.length;
    const isAddition = val.length > prevLength;

    if (isAddition) {
      const addedChar = val[val.length - 1];
      const targetChar = targetText[val.length - 1] || ' ';
      const isCorrect = addedChar === targetChar;
      const delayMs = lastKeyTimeRef.current > 0 ? now - lastKeyTimeRef.current : 0;
      lastKeyTimeRef.current = now;

      const instantWpm = delayMs > 0 ? Math.round((60000 / delayMs) / 5) : liveWpm;

      if (soundEnabled) {
        soundEngine.playKeyPress(!isCorrect, addedChar === ' ');
      }

      let isMissingChar = false;
      if (!isCorrect) {
        setErrorCount((err) => err + 1);
        if (addedChar === ' ' && targetChar !== ' ') {
          isMissingChar = true;
          setMissingCount((m) => m + 1);
        }
      }

      const ks: Keystroke = {
        char: addedChar,
        targetChar,
        timestamp: startTime ? now - startTime : 0,
        isCorrect,
        key: addedChar,
        code: addedChar,
        delayMs,
        instantWpm,
        isMissing: isMissingChar,
      };

      setKeystrokes((prev) => [...prev, ks]);
    }

    setTypedInput(val);

    if (val.length >= targetText.length) {
      finishTest(val);
    }
  };

  const finishTest = (finalTyped: string = typedInput) => {
    if (isFinished) return;
    setIsFinished(true);

    const now = Date.now();
    const start = startTime || now;
    const durationSeconds = Math.max(1, (now - start) / 1000);
    const durationMinutes = durationSeconds / 60;

    let correctChars = 0;
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] === targetText[i]) {
        correctChars += 1;
      }
    }

    const rawWpm = Math.round((finalTyped.length / 5) / durationMinutes);
    const netWpm = Math.max(0, Math.round(((correctChars / 5) - (errorCount * 0.2)) / durationMinutes));

    const totalTypedWithErr = finalTyped.length;
    const finalAccuracy = totalTypedWithErr > 0 ? Math.round(((correctChars) / totalTypedWithErr) * 100) : 100;

    const heatmap: Record<string, KeyHeatmapData> = {};
    const fingerStats: Record<string, FingerStat> = {};

    keystrokes.forEach((ks) => {
      const k = ks.targetChar.toLowerCase();
      if (!heatmap[k]) {
        heatmap[k] = { count: 0, errors: 0, totalDelayMs: 0 };
      }
      heatmap[k].count += 1;
      heatmap[k].totalDelayMs += ks.delayMs;
      if (!ks.isCorrect) heatmap[k].errors += 1;

      const finger = getFingerForKey(ks.targetChar);
      if (!fingerStats[finger]) {
        fingerStats[finger] = { finger, count: 0, errors: 0, totalTimeMs: 0 };
      }
      fingerStats[finger].count += 1;
      fingerStats[finger].totalTimeMs += ks.delayMs;
      if (!ks.isCorrect) fingerStats[finger].errors += 1;
    });

    let consistency = 85;
    if (keystrokes.length > 5) {
      const avgDelay = keystrokes.reduce((a, b) => a + b.delayMs, 0) / keystrokes.length;
      const variance = keystrokes.reduce((a, b) => a + Math.pow(b.delayMs - avgDelay, 2), 0) / keystrokes.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.min(100, Math.max(30, Math.round(100 - stdDev * 0.15)));
    }

    const result: TestResult = {
      id: `tr_${Date.now()}`,
      timestamp: now,
      wpm: netWpm,
      rawWpm,
      accuracy: Math.max(0, finalAccuracy),
      errorCount,
      missingCount,
      correctedErrors: backspaceCount,
      uncorrectedErrors: Math.max(0, errorCount - backspaceCount),
      consistency,
      keystrokeCount: keystrokes.length,
      characterCount: finalTyped.length,
      backspaceCount,
      durationSeconds: Math.round(durationSeconds),
      mode,
      subMode,
      category,
      difficulty: 'easy',
      keystrokes,
      heatmap,
      fingerStats,
      graphData: [],
      text: targetText,
    };

    onTestComplete(result);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 my-1 relative">
      {/* Responsive Live Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl gap-2">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">NET WPM</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight">{liveWpm}</span>
              <span className="text-[10px] sm:text-xs font-bold text-cyan-500/80">WPM</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">ACCURACY</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">{liveAccuracy}%</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">
              {mode === 'time' ? 'REMAINING' : 'PROGRESS'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono tracking-tight">
                {mode === 'time' ? `${timeLeft}s` : `${typedInput.length}/${targetText.length}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col hidden xs:flex">
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">ERRORS</span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-lg sm:text-xl font-bold text-rose-400">{errorCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetState();
              onResetText();
            }}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all shadow-md active:scale-95"
            title="Restart Test (Tab)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Container-Scoped Text Typing View Box */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className={`w-full h-[220px] sm:h-[280px] overflow-y-auto p-4 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl relative cursor-text select-none backdrop-blur-xl transition-all ${
          dyslexicFont ? 'font-sans text-lg sm:text-xl leading-relaxed tracking-wide' : 'font-mono text-lg sm:text-2xl leading-relaxed tracking-normal'
        }`}
      >
        {/* Eye Focus Mode Blur Mask */}
        {focusMode && isStarted && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none transition-all" />
        )}

        {/* Real-time Rendered Character Spans */}
        <div className="relative z-10 break-words whitespace-pre-wrap">
          {targetText.split('').map((char, index) => {
            const isTyped = index < typedInput.length;
            const typedChar = typedInput[index];
            const isCorrect = isTyped && typedChar === char;
            const isCurrent = index === typedInput.length;

            let charStyle = 'text-slate-600'; // Untyped
            if (isTyped) {
              if (subMode === 'blind') {
                charStyle = 'opacity-0'; // Blind typing mode
              } else if (isCorrect) {
                charStyle = 'text-cyan-400 font-bold';
              } else {
                charStyle = 'text-rose-400 bg-rose-500/20 rounded px-0.5 underline font-bold';
              }
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCaretRef : null}
                className={`relative ${charStyle}`}
              >
                {/* Active Caret Cursor */}
                {isCurrent && (
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                )}
                {char}
              </span>
            );
          })}
        </div>

        {/* Click to focus hint overlay */}
        {!isStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs rounded-3xl pointer-events-none p-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-lg animate-bounce text-center">
              <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 shrink-0" />
              <span>Click or start typing to begin</span>
            </div>
          </div>
        )}

        {/* Hidden Input field capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={typedInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 opacity-0 cursor-default"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
