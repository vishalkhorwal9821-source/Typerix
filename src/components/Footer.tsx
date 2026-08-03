import React from 'react';
import { Heart, Shield, Code, MapPin, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1700px] mx-auto mt-12 mb-4 px-3 sm:px-6 flex flex-col gap-8 border-t border-slate-800/80 pt-8 text-slate-400 font-sans">
      {/* Upper Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Platform Info (5 Cols) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Zap className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              TYPERIX
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 font-bold">
              v1.0.0
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
            Typerix is a modern online typing platform built to help users improve typing speed, accuracy, and consistency through interactive typing tests, personalized practice, coding challenges, and detailed performance analytics.
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Delhi, India</span>
          </div>
        </div>

        {/* Founder & Developer Credit (4 Cols) */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <h4 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer &amp; Founder</span>
          </h4>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-lg">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100">Vishal Khorwal</span>
              <span className="text-[11px] text-cyan-400 font-mono">Founder &amp; Lead Architect</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/vishalkhorwal9821-source"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all shadow-md flex items-center justify-center"
                title="GitHub Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/vishal-khorwal-4637912a0/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/40 transition-all shadow-md flex items-center justify-center"
                title="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges & Features (3 Cols) */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Platform Badges</span>
          </h4>

          <div className="flex flex-col gap-1.5 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>AI Coaching Engine</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>3D Keystroke Replay</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>9 Code Typing Languages</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>600+ Word Essay Practice</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lower Copyright Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-900 pt-5 text-xs text-slate-400 font-mono">
        <div>
          <p>© 2026 Typerix. All Rights Reserved.</p>
        </div>

        <div className="flex items-center gap-1">
          <span>Designed &amp; Developed by</span>
          <a
            href="https://github.com/vishalkhorwal9821-source"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 font-bold hover:underline"
          >
            Vishal Khorwal
          </a>
          <span>. Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse mx-0.5" />
          <span>in India.</span>
        </div>
      </div>
    </footer>
  );
};
