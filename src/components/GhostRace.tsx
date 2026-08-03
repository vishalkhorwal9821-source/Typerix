import React from 'react';
import { Ghost, Trophy, Zap } from 'lucide-react';

interface GhostRaceProps {
  userProgressPct: number; // 0 - 100
  ghostProgressPct: number; // 0 - 100
  userWpm: number;
  ghostWpm: number;
}

export const GhostRace: React.FC<GhostRaceProps> = ({
  userProgressPct,
  ghostProgressPct,
  userWpm,
  ghostWpm,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
        <div className="flex items-center gap-2">
          <Ghost className="w-5 h-5 text-indigo-400 animate-bounce" />
          <span>GHOST RACE ARENA: Race Against Your Personal Best</span>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span className="text-cyan-400">YOU: {userWpm} WPM</span>
          <span className="text-purple-400">GHOST: {ghostWpm} WPM</span>
        </div>
      </div>

      {/* Race Track Canvas Container */}
      <div className="flex flex-col gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
        {/* User Track Line */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono text-cyan-300 font-bold">
            <span>YOU (RACER 1)</span>
            <span>{Math.round(userProgressPct)}%</span>
          </div>
          <div className="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-xl transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(5, userProgressPct)}%` }}
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Ghost Track Line */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono text-purple-300 font-bold">
            <span>GHOST (PERSONAL BEST RECORD)</span>
            <span>{Math.round(ghostProgressPct)}%</span>
          </div>
          <div className="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl transition-all duration-300 flex items-center justify-end pr-2 opacity-80"
              style={{ width: `${Math.max(5, ghostProgressPct)}%` }}
            >
              <Ghost className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Finish Line Flag */}
        <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
