import React, { useState } from 'react';
import type { KeyHeatmapData } from '../types';

interface VirtualKeyboardProps {
  activeKey?: string;
  heatmapData?: Record<string, KeyHeatmapData>;
  showHeatmap?: boolean;
}

const QWERTY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space'],
];

const FINGER_COLORS: Record<string, string> = {
  q: 'border-pink-500/40 text-pink-300',
  a: 'border-pink-500/40 text-pink-300',
  z: 'border-pink-500/40 text-pink-300',
  w: 'border-purple-500/40 text-purple-300',
  s: 'border-purple-500/40 text-purple-300',
  x: 'border-purple-500/40 text-purple-300',
  e: 'border-blue-500/40 text-blue-300',
  d: 'border-blue-500/40 text-blue-300',
  c: 'border-blue-500/40 text-blue-300',
  r: 'border-cyan-500/40 text-cyan-300',
  f: 'border-cyan-500/40 text-cyan-300',
  v: 'border-cyan-500/40 text-cyan-300',
  t: 'border-cyan-500/40 text-cyan-300',
  g: 'border-cyan-500/40 text-cyan-300',
  b: 'border-cyan-500/40 text-cyan-300',
  Space: 'border-emerald-500/40 text-emerald-300',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  heatmapData = {},
  showHeatmap = false,
}) => {
  const [layout, setLayout] = useState<'QWERTY' | 'Dvorak' | 'Colemak'>('QWERTY');

  const getKeyHeatmapColor = (key: string) => {
    if (!showHeatmap) return '';
    const k = key.toLowerCase();
    const data = heatmapData[k];
    if (!data || data.count === 0) return 'bg-slate-900/60 text-slate-600';

    const errRatio = data.errors / data.count;
    if (errRatio > 0.25) return 'bg-rose-500/40 border-rose-500 text-rose-200 font-bold';
    if (data.count > 15) return 'bg-emerald-500/40 border-emerald-500 text-emerald-200 font-bold';
    return 'bg-cyan-500/30 border-cyan-500 text-cyan-200';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-slate-950/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-3">
      {/* Keyboard Header Controls */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">LAYOUT:</span>
          {(['QWERTY', 'Dvorak', 'Colemak'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                layout === l ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Active Key</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>High Errors</span>
          </span>
        </div>
      </div>

      {/* Keyboard Key Grid */}
      <div className="flex flex-col gap-1.5 p-2 bg-slate-900/70 border border-slate-800/80 rounded-2xl">
        {QWERTY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const isSpace = key === 'Space';
              const isWide = ['Backspace', 'Tab', 'Caps', 'Enter', 'Shift'].includes(key);
              const isActive = activeKey && activeKey.toLowerCase() === key.toLowerCase();
              const heatmapStyle = getKeyHeatmapColor(key);

              return (
                <div
                  key={key}
                  className={`relative flex items-center justify-center rounded-xl text-xs font-mono font-bold transition-all shadow-md select-none border ${
                    isSpace
                      ? 'w-72 h-11'
                      : isWide
                      ? 'w-16 h-11'
                      : 'w-10 h-11'
                  } ${
                    isActive
                      ? 'bg-gradient-to-t from-cyan-500 to-indigo-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_#22d3ee] scale-105 z-10'
                      : heatmapStyle || FINGER_COLORS[key.toLowerCase()] || 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {key}
                  {showHeatmap && heatmapData[key.toLowerCase()] && (
                    <span className="absolute bottom-0.5 right-1 text-[8px] opacity-70">
                      {heatmapData[key.toLowerCase()].count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
