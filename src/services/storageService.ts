import type { UserProfile, TestResult, Quest } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'typerix_user_profile',
  HISTORY: 'typerix_test_history',
  QUESTS: 'typerix_daily_quests',
};

// Cookie persistence helpers
function setCookie(name: string, value: string, days: number = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
  } catch {
    // Cookie fallback
  }
}

function getCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

const DEFAULT_PROFILE: UserProfile = {
  username: 'Typing Wizard',
  title: 'Novice Finger-Smith',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  coins: 150,
  activeTheme: 'cyberpunk',
  unlockedThemes: ['cyberpunk', 'dark_velvet', 'oled_black'],
  activeSound: 'cherry_blue',
  unlockedSounds: ['cherry_blue', 'cherry_red', 'typewriter', 'sci_fi', 'topre'],
  unlockedBadges: ['first_test', 'welcome_typer'],
  personalBests: {
    'time_15': 65,
    'time_30': 72,
    'time_60': 68,
    'code': 55,
    'quote': 70,
  },
  totalTests: 0,
  totalCharactersTyped: 0,
  totalTimeTypedSeconds: 0,
  iqScore: 110,
};

const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'q_daily_3tests',
    title: 'Warm-up Mastery',
    description: 'Complete 3 typing tests of any mode',
    xpReward: 50,
    coinReward: 30,
    progress: 0,
    target: 3,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'q_acc_98',
    title: 'Precision Strike',
    description: 'Achieve 98% accuracy in a 30s or longer test',
    xpReward: 80,
    coinReward: 50,
    progress: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'q_code_mode',
    title: 'Code Ninja',
    description: 'Complete 1 Code Typing session',
    xpReward: 100,
    coinReward: 60,
    progress: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
  },
];

export function getUserProfile(): UserProfile {
  try {
    // 1. Try LocalStorage
    let raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    // 2. Try SessionStorage
    if (!raw) raw = sessionStorage.getItem(STORAGE_KEYS.PROFILE);
    // 3. Try Cookies
    if (!raw) raw = getCookie(STORAGE_KEYS.PROFILE);

    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);

    // Update streak date logic
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        parsed.streakDays += 1;
      } else if (diffDays > 1) {
        parsed.streakDays = 1;
      }
      parsed.lastActiveDate = today;
      saveUserProfile(parsed);
    }

    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const jsonStr = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, jsonStr);
    sessionStorage.setItem(STORAGE_KEYS.PROFILE, jsonStr);
    setCookie(STORAGE_KEYS.PROFILE, jsonStr, 365);
  } catch {
    // Storage quota fallback
  }
}

export function getTestHistory(): TestResult[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) raw = sessionStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) raw = getCookie(STORAGE_KEYS.HISTORY);

    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult): { updatedProfile: UserProfile; leveledUp: boolean; earnedXp: number; earnedCoins: number } {
  const history = getTestHistory();
  history.unshift(result);
  try {
    const jsonStr = JSON.stringify(history.slice(0, 100));
    localStorage.setItem(STORAGE_KEYS.HISTORY, jsonStr);
    sessionStorage.setItem(STORAGE_KEYS.HISTORY, jsonStr);
    setCookie(STORAGE_KEYS.HISTORY, jsonStr, 365);
  } catch {
    // ignore
  }

  const profile = getUserProfile();
  let earnedXp = Math.round(result.wpm * 1.5 + (result.accuracy > 95 ? 30 : 10) + result.characterCount / 5);
  let earnedCoins = Math.round(result.wpm / 10 + (result.accuracy >= 98 ? 15 : 5));

  profile.totalTests += 1;
  profile.totalCharactersTyped += result.characterCount;
  profile.totalTimeTypedSeconds += result.durationSeconds;

  const key = `${result.mode}_${result.durationSeconds || 'def'}`;
  if (!profile.personalBests[key] || result.wpm > profile.personalBests[key]) {
    profile.personalBests[key] = Math.round(result.wpm);
    earnedXp += 50;
    earnedCoins += 25;
  }

  let xp = profile.xp + earnedXp;
  let level = profile.level;
  let nextLevelXp = profile.nextLevelXp;
  let leveledUp = false;

  while (xp >= nextLevelXp) {
    xp -= nextLevelXp;
    level += 1;
    nextLevelXp = Math.round(nextLevelXp * 1.3);
    leveledUp = true;
    earnedCoins += 100;
  }

  profile.iqScore = Math.min(180, Math.max(70, Math.round(profile.iqScore * 0.95 + (result.wpm * 0.6 + result.accuracy * 0.4) * 0.05)));

  profile.xp = xp;
  profile.level = level;
  profile.nextLevelXp = nextLevelXp;
  profile.coins += earnedCoins;

  const quests = getQuests();
  quests.forEach((q) => {
    if (q.id === 'q_daily_3tests') q.progress = Math.min(q.target, q.progress + 1);
    if (q.id === 'q_acc_98' && result.accuracy >= 98 && result.durationSeconds >= 30) q.progress = 1;
    if (q.id === 'q_code_mode' && result.mode === 'code') q.progress = 1;

    if (q.progress >= q.target) q.isCompleted = true;
  });
  saveQuests(quests);

  saveUserProfile(profile);

  return { updatedProfile: profile, leveledUp, earnedXp, earnedCoins };
}

export function getQuests(): Quest[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) raw = sessionStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) raw = getCookie(STORAGE_KEYS.QUESTS);

    if (!raw) return DEFAULT_QUESTS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUESTS;
  }
}

export function saveQuests(quests: Quest[]): void {
  try {
    const jsonStr = JSON.stringify(quests);
    localStorage.setItem(STORAGE_KEYS.QUESTS, jsonStr);
    sessionStorage.setItem(STORAGE_KEYS.QUESTS, jsonStr);
    setCookie(STORAGE_KEYS.QUESTS, jsonStr, 365);
  } catch {
    // ignore
  }
}
