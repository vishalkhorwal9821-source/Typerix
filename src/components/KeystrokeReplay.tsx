import React, { useState, useEffect } from 'react';
import type { TestResult } from '../types';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface KeystrokeReplayProps {
  result: TestResult;
}

export const KeystrokeReplay: React.FC<KeystrokeReplayProps> = ({ result }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  const totalSteps = result.keystrokes.length;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isPlaying && currentIndex < totalSteps - 1) {
      const currentKs = result.keystrokes[currentIndex];
      const delay = Math.max(20, Math.min(300, (currentKs.delayMs || 100) / speedMultiplier));

      timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, delay);
    } else if (currentIndex >= totalSteps - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying, currentIndex, totalSteps, speedMultiplier, result]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const visibleKeystrokes = result.keystrokes.slice(0, currentIndex + 1);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-100">3D Keystroke Replay</h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Restart Replay"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs font-mono">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  speedMultiplier === s ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="flex flex-col gap-1.5">
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
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Keystroke {currentIndex + 1} / {totalSteps}</span>
          <span>Timestamp: {((result.keystrokes[currentIndex]?.timestamp || 0) / 1000).toFixed(2)}s</span>
        </div>
      </div>

      {/* Replay Text Display */}
      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800/80 font-mono text-xl leading-relaxed break-words min-h-[120px]">
        {visibleKeystrokes.map((ks, idx) => (
          <span
            key={idx}
            className={`inline-block transition-all ${
              ks.isCorrect ? 'text-cyan-400' : 'text-rose-400 bg-rose-500/20 rounded px-0.5 font-bold'
            } ${idx === currentIndex ? 'scale-125 font-bold text-white shadow-sm' : ''}`}
          >
            {ks.targetChar}
          </span>
        ))}
      </div>
    </div>
  );
};
