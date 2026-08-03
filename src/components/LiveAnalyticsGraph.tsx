import React, { useRef, useEffect } from 'react';
import type { TestResult } from '../types';

interface LiveAnalyticsGraphProps {
  result: TestResult;
}

export const LiveAnalyticsGraph: React.FC<LiveAnalyticsGraphProps> = ({ result }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Compute rolling 5-second WPM intervals
    const duration = Math.max(5, result.durationSeconds);
    const keystrokes = result.keystrokes;

    const dataPoints: { sec: number; wpm: number; errors: number }[] = [];
    const step = Math.max(1, Math.floor(duration / 20));

    for (let sec = 1; sec <= duration; sec += step) {
      const windowKs = keystrokes.filter(
        (k) => k.timestamp <= sec * 1000 && k.timestamp > Math.max(0, (sec - 5) * 1000)
      );
      const charCount = windowKs.length;
      const windowSec = Math.min(sec, 5);
      const wpm = windowSec > 0 ? Math.round((charCount / 5) / (windowSec / 60)) : 0;
      const errors = windowKs.filter((k) => !k.isCorrect).length;
      dataPoints.push({ sec, wpm, errors });
    }

    if (dataPoints.length === 0) return;

    const maxWpm = Math.max(100, ...dataPoints.map((d) => d.wpm));

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 0; y <= height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw WPM Area Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(40, height - 20);

    dataPoints.forEach((pt, i) => {
      const x = 40 + (i / (dataPoints.length - 1)) * (width - 60);
      const y = height - 20 - (pt.wpm / maxWpm) * (height - 40);
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width - 20, height - 20);
    ctx.closePath();
    ctx.fill();

    // Draw WPM Stroke Line
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();

    dataPoints.forEach((pt, i) => {
      const x = 40 + (i / (dataPoints.length - 1)) * (width - 60);
      const y = height - 20 - (pt.wpm / maxWpm) * (height - 40);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Error Points
    dataPoints.forEach((pt, i) => {
      if (pt.errors > 0) {
        const x = 40 + (i / (dataPoints.length - 1)) * (width - 60);
        const y = height - 20 - (pt.wpm / maxWpm) * (height - 40);
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Y Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`${maxWpm}`, 10, 15);
    ctx.fillText(`${Math.round(maxWpm / 2)}`, 10, height / 2);
    ctx.fillText('0', 10, height - 10);
  }, [result]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="text-sm font-bold text-slate-100">Live Speed & Fatigue Graph</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded-full" />
            <span>WPM Timeline</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
            <span>Errors</span>
          </span>
        </div>
      </div>

      <div className="relative w-full h-[180px] bg-slate-950/80 rounded-2xl border border-slate-800/80 p-2 overflow-hidden">
        <canvas ref={canvasRef} width={800} height={160} className="w-full h-full" />
      </div>
    </div>
  );
};
