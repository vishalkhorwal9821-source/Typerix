import type { UserProfile, TestResult, Quest } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'typerix_user_profile',
  HISTORY: 'typerix_test_history',
  QUESTS: 'typerix_daily_quests',
};

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
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // LocalStorage quota fallback
  }
}

export function getTestHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
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
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 100)));
  } catch {
    // ignore
  }

  // Calculate XP & Level gains
  const profile = getUserProfile();
  let earnedXp = Math.round(result.wpm * 1.5 + (result.accuracy > 95 ? 30 : 10) + result.characterCount / 5);
  let earnedCoins = Math.round(result.wpm / 10 + (result.accuracy >= 98 ? 15 : 5));

  profile.totalTests += 1;
  profile.totalCharactersTyped += result.characterCount;
  profile.totalTimeTypedSeconds += result.durationSeconds;

  // Personal Best update
  const key = `${result.mode}_${result.durationSeconds || 'def'}`;
  if (!profile.personalBests[key] || result.wpm > profile.personalBests[key]) {
    profile.personalBests[key] = Math.round(result.wpm);
    earnedXp += 50; // Bonus for PB!
    earnedCoins += 25;
  }

  // Level Up Check
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

  // IQ score update
  profile.iqScore = Math.min(180, Math.max(70, Math.round(profile.iqScore * 0.95 + (result.wpm * 0.6 + result.accuracy * 0.4) * 0.05)));

  profile.xp = xp;
  profile.level = level;
  profile.nextLevelXp = nextLevelXp;
  profile.coins += earnedCoins;

  // Update Quests
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
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) return DEFAULT_QUESTS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUESTS;
  }
}

export function saveQuests(quests: Quest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch {
    // ignore
  }
}
