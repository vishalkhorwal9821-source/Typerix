import React, { useRef, useEffect, useState } from 'react';
import type { TestResult } from '../types';

interface LiveAnalyticsGraphProps {
  result: TestResult;
}

export const LiveAnalyticsGraph: React.FC<LiveAnalyticsGraphProps> = ({ result }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showSpeed, setShowSpeed] = useState<boolean>(true);
  const [showRaw, setShowRaw] = useState<boolean>(true);
  const [showBurst, setShowBurst] = useState<boolean>(true);
  const [showErrors, setShowErrors] = useState<boolean>(true);
  const [showMissing, setShowMissing] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas Resizing
    const width = container.clientWidth || 900;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const duration = Math.max(5, result.durationSeconds);
    const keystrokes = result.keystrokes;

    // Generate second-by-second data points
    const dataPoints: { sec: number; wpm: number; rawWpm: number; burstWpm: number; errors: number; missing: number }[] = [];
    const step = Math.max(1, Math.floor(duration / 30));

    for (let sec = 1; sec <= duration; sec += step) {
      const windowKs = keystrokes.filter(
        (k) => k.timestamp <= sec * 1000 && k.timestamp > Math.max(0, (sec - 5) * 1000)
      );

      const charCount = windowKs.length;
      const windowSec = Math.min(sec, 5);
      const wpm = windowSec > 0 ? Math.round((charCount / 5) / (windowSec / 60)) : 0;

      const cumKs = keystrokes.filter((k) => k.timestamp <= sec * 1000);
      const rawWpm = Math.round((cumKs.length / 5) / (sec / 60));

      let burstWpm = wpm;
      if (windowKs.length > 0) {
        const lastKs = windowKs[windowKs.length - 1];
        if (lastKs.delayMs > 0) {
          burstWpm = Math.min(180, Math.round((60000 / lastKs.delayMs) / 5));
        }
      }

      const errors = windowKs.filter((k) => !k.isCorrect).length;
      const missing = windowKs.filter((k) => k.isMissing).length;

      dataPoints.push({ sec, wpm, rawWpm, burstWpm, errors, missing });
    }

    if (dataPoints.length === 0) return;

    const maxVal = Math.max(100, ...dataPoints.map((d) => Math.max(d.wpm, d.rawWpm, d.burstWpm)));

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.lineWidth = 1;
    for (let y = 0; y <= height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 25, y);
      ctx.stroke();
    }

    // 1. Draw Speed (WPM) Area & Line
    if (showSpeed) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(50, height - 25);

      dataPoints.forEach((pt, i) => {
        const x = 50 + (i / (dataPoints.length - 1)) * (width - 75);
        const y = height - 25 - (pt.wpm / maxVal) * (height - 50);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(width - 25, height - 25);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.beginPath();
      dataPoints.forEach((pt, i) => {
        const x = 50 + (i / (dataPoints.length - 1)) * (width - 75);
        const y = height - 25 - (pt.wpm / maxVal) * (height - 50);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // 2. Draw Raw WPM Line
    if (showRaw) {
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      dataPoints.forEach((pt, i) => {
        const x = 50 + (i / (dataPoints.length - 1)) * (width - 75);
        const y = height - 25 - (pt.rawWpm / maxVal) * (height - 50);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Draw Burst WPM Line
    if (showBurst) {
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      dataPoints.forEach((pt, i) => {
        const x = 50 + (i / (dataPoints.length - 1)) * (width - 75);
        const y = height - 25 - (pt.burstWpm / maxVal) * (height - 50);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // 4. Draw Errors
    if (showErrors) {
      dataPoints.forEach((pt, i) => {
        if (pt.errors > 0) {
          const x = 50 + (i / (dataPoints.length - 1)) * (width - 75);
          const y = height - 25 - (pt.wpm / maxVal) * (height - 50);
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // 5. Draw Missing / Skipped Marks
    if (showMissing) {
      dataPoints.forEach((pt, i) => {
        if (pt.missing > 0 || pt.errors > 1) {
          const x = 50 + (i / (dataPoints.length - 1)) * (width - 75);
          const y = height - 25 - (pt.wpm / maxVal) * (height - 50) - 10;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x - 4, y + 4);
          ctx.lineTo(x + 4, y + 4);
          ctx.closePath();
          ctx.fill();
        }
      });
    }

    // Y Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`${maxVal}`, 10, 18);
    ctx.fillText(`${Math.round(maxVal / 2)}`, 10, height / 2);
    ctx.fillText('0', 10, height - 10);
  }, [result, showSpeed, showRaw, showBurst, showErrors, showMissing]);

  return (
    <div className="w-full p-6 bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-4">
      {/* Title & Interactive Legend Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3">
        <span className="text-base font-bold text-slate-100">Live Multi-Metric Graph (Speed, Raw, Burst, Error, Missing)</span>

        {/* Legend Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <button
            onClick={() => setShowSpeed(!showSpeed)}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              showSpeed ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2.5 h-1 bg-cyan-400 rounded-full" />
            <span>Speed (Net WPM)</span>
          </button>

          <button
            onClick={() => setShowRaw(!showRaw)}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              showRaw ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2.5 h-1 bg-indigo-400 rounded-full" />
            <span>Raw WPM</span>
          </button>

          <button
            onClick={() => setShowBurst(!showBurst)}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              showBurst ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2.5 h-1 bg-emerald-400 rounded-full" />
            <span>Peak Burst</span>
          </button>

          <button
            onClick={() => setShowErrors(!showErrors)}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              showErrors ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 bg-rose-500 rounded-full" />
            <span>Errors ({result.errorCount})</span>
          </button>

          <button
            onClick={() => setShowMissing(!showMissing)}
            className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              showMissing ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 bg-amber-400 rotate-45 rounded-xs" />
            <span>Missing ({result.missingCount || 0})</span>
          </button>
        </div>
      </div>

      {/* Responsive Full Width Canvas Container */}
      <div ref={containerRef} className="relative w-full h-[240px] bg-slate-950/90 rounded-2xl border border-slate-800/80 p-2 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};
