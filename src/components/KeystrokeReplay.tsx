import React, { useState, useEffect } from 'react';
import type { TestResult } from '../types';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface KeystrokeReplayProps {
  result: TestResult;
}

const QWERTY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space'],
];

export const KeystrokeReplay: React.FC<KeystrokeReplayProps> = ({ result }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  const totalSteps = result?.keystrokes?.length || 0;

  // Reset playback whenever a new test result is loaded
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [result.id]);

  const currentKeystroke = totalSteps > 0 && currentIndex < totalSteps ? result.keystrokes[currentIndex] : null;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isPlaying && totalSteps > 0) {
      if (currentIndex >= totalSteps - 1) {
        setIsPlaying(false);
        return;
      }

      const currentKs = result.keystrokes[currentIndex];
      const delay = Math.max(25, Math.min(350, (currentKs?.delayMs || 100) / speedMultiplier));

      timeout = setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next < totalSteps) {
            const nextKs = result.keystrokes[next];
            if (nextKs) {
              soundEngine.playKeyPress(!nextKs.isCorrect, nextKs.char === ' ');
            }
          }
          return next;
        });
      }, delay);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying, currentIndex, totalSteps, speedMultiplier, result]);

  if (totalSteps === 0) {
    return null;
  }

  const handleTogglePlay = () => {
    if (currentIndex >= totalSteps - 1) {
      // If at end, restart from beginning
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const visibleKeystrokes = result.keystrokes.slice(0, currentIndex + 1);
  const activeChar = currentKeystroke?.key?.toLowerCase() || '';

  return (
    <div className="w-full p-4 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-4 sm:gap-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">3D Keystroke Replay</h3>
            <p className="text-[10px] text-cyan-400/70 font-mono">Interactive step-by-step playback with live key lighting</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleTogglePlay}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : currentIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
            title="Restart Replay"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs font-mono border border-slate-800">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] sm:text-xs transition-all ${
                  speedMultiplier === s ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrub Bar & Dynamic Metrics */}
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentIndex(Number(e.target.value));
          }}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span>Step {currentIndex + 1} / {totalSteps}</span>
            <span className="text-cyan-400 font-bold">
              Instant Speed: {currentKeystroke?.instantWpm || result.wpm} WPM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Keystroke Delay: {currentKeystroke?.delayMs || 0}ms</span>
            <span className="text-indigo-300">
              Time: {((currentKeystroke?.timestamp || 0) / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      </div>

      {/* Live Replay Text Display */}
      <div className="p-4 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800/80 font-mono text-lg sm:text-xl leading-relaxed break-words min-h-[100px] max-h-[180px] overflow-y-auto">
        {visibleKeystrokes.map((ks, idx) => (
          <span
            key={idx}
            className={`inline-block transition-all ${
              ks.isCorrect ? 'text-cyan-400 font-bold' : 'text-rose-400 bg-rose-500/20 rounded px-0.5 font-bold'
            } ${idx === currentIndex ? 'scale-125 font-black text-white bg-cyan-500/40 rounded px-1 animate-pulse shadow-[0_0_10px_#22d3ee]' : ''}`}
          >
            {ks.char}
          </span>
        ))}
      </div>

      {/* Synchronized 3D Keyboard Display Lighting Active Key Live */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[620px] md:min-w-0 flex flex-col gap-1 p-2 bg-slate-950/80 border border-slate-800 rounded-2xl">
          {QWERTY_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1">
              {row.map((key) => {
                const isSpace = key === 'Space';
                const isWide = ['Backspace', 'Tab', 'Caps', 'Enter', 'Shift'].includes(key);
                const isActive = activeChar && (activeChar === key.toLowerCase() || (isSpace && activeChar === ' '));
                const isError = isActive && currentKeystroke && !currentKeystroke.isCorrect;

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-center rounded-lg text-[9px] sm:text-[10px] font-mono font-bold transition-all shadow-md select-none border ${
                      isSpace ? 'w-40 sm:w-60 h-7 sm:h-8' : isWide ? 'w-10 sm:w-14 h-7 sm:h-8' : 'w-6 sm:w-8 h-7 sm:h-8'
                    } ${
                      isError
                        ? 'bg-rose-500 text-white border-rose-300 scale-110 shadow-[0_0_12px_#f43f5e] z-20 font-black'
                        : isActive
                        ? 'bg-cyan-400 text-slate-950 border-cyan-200 scale-110 shadow-[0_0_12px_#22d3ee] z-20 font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800/80'
                    }`}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
