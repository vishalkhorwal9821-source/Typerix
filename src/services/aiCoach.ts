import type { TestResult, AICoachInsight } from '../types';

export function getFingerForKey(char: string): string {
  const c = char.toLowerCase();
  if (['1', 'q', 'a', 'z', '!'].includes(c)) return 'left-pinky';
  if (['2', 'w', 's', 'x', '@'].includes(c)) return 'left-ring';
  if (['3', 'e', 'd', 'c', '#'].includes(c)) return 'left-middle';
  if (['4', '5', 'r', 't', 'f', 'g', 'v', 'b', '$', '%'].includes(c)) return 'left-index';
  if ([' '].includes(c)) return 'thumb';
  if (['6', '7', 'y', 'u', 'h', 'j', 'n', 'm', '^', '&'].includes(c)) return 'right-index';
  if (['8', 'i', 'k', ',', '*'].includes(c)) return 'right-middle';
  if (['9', 'o', 'l', '.', '('].includes(c)) return 'right-ring';
  if (['0', 'p', ';', '/', '-', '=', '[', ']', "'", ')', '_', '+', '?', '{', '}'].includes(c)) return 'right-pinky';
  return 'right-index';
}

export function analyzeTestWithAI(result: TestResult): AICoachInsight {
  const { keystrokes, durationSeconds } = result;

  // 1. Calculate Finger Speeds & Errors
  const fingerTimes: Record<string, { totalMs: number; count: number; errors: number }> = {};
  const confusionMap: Record<string, number> = {};

  keystrokes.forEach((ks) => {
    const finger = getFingerForKey(ks.targetChar);
    if (!fingerTimes[finger]) {
      fingerTimes[finger] = { totalMs: 0, count: 0, errors: 0 };
    }
    fingerTimes[finger].count += 1;
    fingerTimes[finger].totalMs += ks.delayMs;
    if (!ks.isCorrect) {
      fingerTimes[finger].errors += 1;
      const pairKey = `${ks.targetChar.toUpperCase()} ➔ ${ks.char.toUpperCase()}`;
      confusionMap[pairKey] = (confusionMap[pairKey] || 0) + 1;
    }
  });

  // Find slowest finger compared to average
  let slowestFinger: { name: string; pctSlower: number } | undefined;
  let maxAvgMs = 0;
  let overallAvgMs = 0;
  let validFingerCount = 0;

  Object.entries(fingerTimes).forEach(([finger, data]) => {
    if (data.count > 3) {
      const avg = data.totalMs / data.count;
      overallAvgMs += avg;
      validFingerCount += 1;
      if (avg > maxAvgMs) {
        maxAvgMs = avg;
        slowestFinger = { name: finger, pctSlower: 0 };
      }
    }
  });

  if (validFingerCount > 0 && slowestFinger) {
    const meanAvg = overallAvgMs / validFingerCount;
    if (meanAvg > 0) {
      const pct = Math.round(((maxAvgMs - meanAvg) / meanAvg) * 100);
      if (pct > 15) {
        slowestFinger.pctSlower = pct;
      } else {
        slowestFinger = undefined;
      }
    }
  }

  // 2. Confused Pairs
  const confusedPairs = Object.entries(confusionMap)
    .map(([pairStr, count]) => {
      const [expected, typed] = pairStr.split(' ➔ ');
      return { expected, typed, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // 3. Fatigue Detection
  let fatigueDetected = false;
  let fatigueTimeSec: number | undefined;

  if (keystrokes.length > 20 && durationSeconds >= 30) {
    const midIndex = Math.floor(keystrokes.length / 2);
    const firstHalf = keystrokes.slice(0, midIndex);
    const secondHalf = keystrokes.slice(midIndex);

    const avgDelay1 = firstHalf.reduce((acc, k) => acc + k.delayMs, 0) / firstHalf.length;
    const avgDelay2 = secondHalf.reduce((acc, k) => acc + k.delayMs, 0) / secondHalf.length;

    const errCount1 = firstHalf.filter((k) => !k.isCorrect).length;
    const errCount2 = secondHalf.filter((k) => !k.isCorrect).length;

    if (avgDelay2 > avgDelay1 * 1.35 || errCount2 > errCount1 * 1.8 + 2) {
      fatigueDetected = true;
      fatigueTimeSec = Math.round(durationSeconds * 0.6);
    }
  }

  // 4. Score Metrics (Rhythm, Endurance, Confidence)
  const rhythmScore = Math.min(100, Math.max(10, Math.round(result.consistency)));

  const errorPct = result.keystrokeCount > 0 ? (result.errorCount / result.keystrokeCount) * 100 : 0;
  const confidenceScore = Math.min(100, Math.max(10, Math.round(100 - errorPct * 4)));

  const enduranceScore = fatigueDetected ? 62 : Math.min(100, Math.round(75 + (result.wpm / 150) * 25));

  // 5. Advice formulation
  const advice: string[] = [];

  if (slowestFinger && slowestFinger.pctSlower > 0) {
    const formattedName = slowestFinger.name.replace('-', ' ').toUpperCase();
    advice.push(`Your ${formattedName} is ${slowestFinger.pctSlower}% slower than your average finger pace.`);
  }

  if (confusedPairs.length > 0) {
    const topPair = confusedPairs[0];
    advice.push(`You frequently confuse '${topPair.expected}' with '${topPair.typed}'. Focus on key position muscle memory.`);
  }

  if (fatigueDetected && fatigueTimeSec) {
    advice.push(`Your speed drops noticeably after ~${fatigueTimeSec} seconds. Take a 2-minute wrist stretch break!`);
  }

  if (result.accuracy < 94) {
    advice.push(`Accuracy is currently ${result.accuracy}%. Slow down slightly to target >98% accuracy for faster muscle memory gains.`);
  } else if (result.wpm > 80 && result.accuracy >= 97) {
    advice.push(`Outstanding speed and precision! You're operating in high-flow typing zone.`);
  }

  if (advice.length === 0) {
    advice.push('Solid session! Practice weak keys and maintain rhythmic keystroke timing.');
  }

  // 6. Generate Targeted Adaptive Practice Text
  const weakKeysSet = new Set<string>();
  confusedPairs.forEach((p) => {
    weakKeysSet.add(p.expected.toLowerCase());
    weakKeysSet.add(p.typed.toLowerCase());
  });

  if (slowestFinger) {
    if (slowestFinger.name.includes('ring')) ['w', 's', 'x', 'o', 'l', '.'].forEach((k) => weakKeysSet.add(k));
    if (slowestFinger.name.includes('pinky')) ['q', 'a', 'z', 'p', ';', '/'].forEach((k) => weakKeysSet.add(k));
  }

  const weakKeys = Array.from(weakKeysSet);
  let recommendedText = '';
  if (weakKeys.length > 0) {
    const wordsList = [
      'people', 'system', 'process', 'require', 'quality', 'express', 'project',
      'request', 'develop', 'problem', 'support', 'special', 'surface', 'practice',
      'pattern', 'perform', 'produce', 'program', 'provide', 'prepare', 'purpose'
    ];

    const filtered = wordsList.filter((w) => weakKeys.some((k) => w.includes(k)));
    recommendedText = (filtered.length >= 4 ? filtered : wordsList).slice(0, 15).join(' ');
  } else {
    recommendedText = 'the quick brown fox jumps over the lazy dog rhythm accuracy precision speed flow confidence mastery champion';
  }

  return {
    slowestFinger,
    confusedPairs,
    fatigueDetected,
    fatigueTimeSec,
    confidenceScore,
    enduranceScore,
    rhythmScore,
    advice,
    recommendedText,
  };
}

export function answerAICoachQuestion(question: string, userStats: { wpm: number; accuracy: number }): string {
  const q = question.toLowerCase();

  if (q.includes('stuck') || q.includes('plateau') || q.includes('increase speed') || q.includes('faster')) {
    return `To break past ${userStats.wpm || 70} WPM, focus 100% on ACCURACY first. Slow down to achieve 98%+ accuracy for 3 days straight. Speed is a byproduct of effortless accuracy. Also use our Weak Keys mode to eliminate finger friction!`;
  }
  if (q.includes('finger') || q.includes('pinky') || q.includes('ring') || q.includes('technique')) {
    return `Ensure your wrists are elevated slightly off the desk. Never rest your palms while typing fast. Keep your pinky and ring fingers relaxed—over-straining them causes early fatigue!`;
  }
  if (q.includes('fatigue') || q.includes('wrist') || q.includes('pain') || q.includes('tired')) {
    return `If your hands feel tired after 45-60 seconds, take a 2-minute break. Perform gentle wrist rolls and finger stretches. Never type through joint discomfort!`;
  }
  if (q.includes('code') || q.includes('programming') || q.includes('syntax')) {
    return `Code typing requires mastery of special symbols like {}, [], (), => and ;. Practice our Coding Interview Mode daily to train muscle memory for brackets and camelCase variables!`;
  }
  return `Keep a steady rhythm! Try to make every keystroke interval identical rather than bursting fast and pausing. Rhythm and accuracy create world-class typing speed!`;
}
