import React from 'react';
import type { UserProfile, Quest } from '../types';
import { THEMES } from '../services/themeProvider';
import { Coins, CheckCircle, Lock, Sparkles, X, Volume2 } from 'lucide-react';

interface RPGPanelProps {
  profile: UserProfile;
  quests: Quest[];
  onClose: () => void;
  onSelectTheme: (themeId: string) => void;
  onSelectSound: (soundId: string) => void;
}

export const RPGPanel: React.FC<RPGPanelProps> = ({
  profile,
  quests,
  onClose,
  onSelectTheme,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Header */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-slate-950 to-indigo-950 p-5 rounded-2xl border border-cyan-500/30">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-black text-2xl shadow-lg">
            {profile.level}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <h2 className="text-xl font-bold text-white">{profile.username}</h2>
              <span className="text-xs font-mono text-cyan-400 font-bold">{profile.title}</span>
            </div>
            {/* XP Progress Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-0.5">
              <span>XP: {profile.xp} / {profile.nextLevelXp}</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {profile.coins} Coins
              </span>
            </div>
          </div>
        </div>

        {/* Daily Quests Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Daily Quests</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quests.map((q) => (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-2 ${
                  q.isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{q.title}</span>
                    {q.isCompleted && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{q.description}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-2 border-t border-slate-800">
                  <span>Progress: {q.progress}/{q.target}</span>
                  <span className="text-amber-300">+{q.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Theme & Sound Shop */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Themes & Sound Customizer</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {THEMES.map((theme) => {
              const isUnlocked = profile.unlockedThemes.includes(theme.id);
              const isActive = profile.activeTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => isUnlocked && onSelectTheme(theme.id)}
                  disabled={!isUnlocked}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md'
                      : isUnlocked
                      ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{theme.name}</span>
                    {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {isActive ? 'ACTIVE THEME' : isUnlocked ? 'UNLOCKED' : `${theme.priceCoins} Coins`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
