import type { ThemeOption } from '../types';

export const THEMES: ThemeOption[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    bg: 'from-slate-950 via-slate-900 to-cyan-950',
    cardBg: 'bg-slate-900/80 border-cyan-500/30 backdrop-blur-md',
    textColor: 'text-cyan-100',
    subColor: 'text-cyan-400/60',
    mainColor: 'text-cyan-400',
    errorColor: 'text-rose-500 bg-rose-500/20',
    isDark: true,
    priceCoins: 0,
  },
  {
    id: 'dark_velvet',
    name: 'Dark Velvet',
    bg: 'from-zinc-950 via-purple-950 to-zinc-950',
    cardBg: 'bg-purple-950/40 border-purple-500/25 backdrop-blur-md',
    textColor: 'text-purple-100',
    subColor: 'text-purple-300/50',
    mainColor: 'text-purple-400',
    errorColor: 'text-pink-500 bg-pink-500/20',
    isDark: true,
    priceCoins: 0,
  },
  {
    id: 'oled_black',
    name: 'OLED Pitch Black',
    bg: 'from-black via-zinc-950 to-black',
    cardBg: 'bg-zinc-900/90 border-zinc-800 backdrop-blur-sm',
    textColor: 'text-zinc-100',
    subColor: 'text-zinc-500',
    mainColor: 'text-emerald-400',
    errorColor: 'text-red-500 bg-red-950/40',
    isDark: true,
    priceCoins: 0,
  },
  {
    id: 'retro_crt',
    name: 'Retro CRT Terminal',
    bg: 'from-neutral-950 via-neutral-900 to-neutral-950',
    cardBg: 'bg-black/80 border-green-500/40',
    textColor: 'text-green-400 font-mono',
    subColor: 'text-green-700',
    mainColor: 'text-green-300',
    errorColor: 'text-amber-500 bg-amber-950/40',
    isDark: true,
    priceCoins: 100,
  },
  {
    id: 'glass_frost',
    name: 'Glass Frost',
    bg: 'from-blue-950 via-indigo-950 to-slate-900',
    cardBg: 'bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl',
    textColor: 'text-white',
    subColor: 'text-blue-200/60',
    mainColor: 'text-blue-400',
    errorColor: 'text-rose-400 bg-rose-500/30',
    isDark: true,
    priceCoins: 150,
  },
];

export function getTheme(id: string): ThemeOption {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
