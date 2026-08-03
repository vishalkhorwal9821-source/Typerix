export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'zen' | 'exam' | 'custom' | 'rpg' | 'ghost';
export type SubMode = 'normal' | 'numbers' | 'symbols' | 'mixed' | 'blind';

export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100 | 250;
export type CodeLanguage = 'javascript' | 'python' | 'cpp' | 'java' | 'html' | 'sql';
export type ExamType = 'ssc_chsl' | 'banking_ibps' | 'court_clerk' | 'steno';

export interface Keystroke {
  char: string;
  targetChar: string;
  timestamp: number; // relative to test start ms
  isCorrect: boolean;
  key: string;
  code: string;
  delayMs: number;
}

export interface KeyHeatmapData {
  count: number;
  errors: number;
  totalDelayMs: number;
}

export interface FingerStat {
  finger: string; // 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky'
  count: number;
  errors: number;
  totalTimeMs: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errorCount: number;
  correctedErrors: number;
  uncorrectedErrors: number;
  consistency: number;
  keystrokeCount: number;
  characterCount: number;
  backspaceCount: number;
  durationSeconds: number;
  mode: TestMode;
  subMode: SubMode;
  keystrokes: Keystroke[];
  heatmap: Record<string, KeyHeatmapData>;
  fingerStats: Record<string, FingerStat>;
  text: string;
}

export interface UserProfile {
  username: string;
  title: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  lastActiveDate: string;
  coins: number;
  activeTheme: string;
  unlockedThemes: string[];
  activeSound: string;
  unlockedSounds: string[];
  unlockedBadges: string[];
  personalBests: Record<string, number>; // mode -> WPM
  totalTests: number;
  totalCharactersTyped: number;
  totalTimeTypedSeconds: number;
  iqScore: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface AICoachInsight {
  slowestFinger?: { name: string; pctSlower: number };
  confusedPairs: { expected: string; typed: string; count: number }[];
  fatigueDetected: boolean;
  fatigueTimeSec?: number;
  confidenceScore: number; // 0 - 100
  enduranceScore: number; // 0 - 100
  rhythmScore: number; // 0 - 100
  advice: string[];
  recommendedText: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  cardBg: string;
  textColor: string;
  subColor: string;
  mainColor: string;
  errorColor: string;
  isDark: boolean;
  priceCoins: number;
}

export interface SoundOption {
  id: string;
  name: string;
  type: 'cherry_blue' | 'cherry_red' | 'typewriter' | 'sci_fi' | 'topre' | 'silent';
  priceCoins: number;
}
