import type { TestMode, SubMode, CodeLanguage, ExamType } from '../types';

const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with',
  'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one',
  'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out',
  'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new',
  'year', 'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any',
  'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day', 'also', 'after',
  'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should',
  'well', 'people', 'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how',
  'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell',
  'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop',
  'system', 'program', 'process', 'keyboard', 'rhythm', 'focus', 'speed', 'accuracy', 'mastery', 'flow',
  'practice', 'engine', 'quantum', 'future', 'cyber', 'network', 'matrix', 'crystal', 'energy', 'spirit'
];

const NUMBERS_POOL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '42', '99', '100', '3.14', '2026', '777', '1337'];

const SYMBOLS_POOL = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', ',', '.', '<', '>', '/', '?'];

const QUOTES = [
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "In the middle of difficulty lies opportunity. Keep typing with steady focus.", author: "Albert Einstein" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" }
];

const CODE_SNIPPETS: Record<CodeLanguage, string[]> = {
  javascript: [
    "const fetchUserData = async (userId) => {\n  const response = await fetch(`/api/user/${userId}`);\n  return response.json();\n};",
    "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2).filter(n => n > 4);",
    "class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  on(name, listener) {\n    (this.events[name] = this.events[name] || []).push(listener);\n  }\n}",
  ],
  python: [
    "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)",
    "class TypingTracker:\n    def __init__(self, username):\n        self.username = username\n        self.wpm_history = []\n\n    def add_score(self, score):\n        self.wpm_history.append(score)",
  ],
  cpp: [
    "template <typename T>\nclass Vector3 {\npublic:\n    T x, y, z;\n    Vector3(T x, T y, T z) : x(x), y(y), z(z) {}\n    T magnitude() const { return std::sqrt(x*x + y*y + z*z); }\n};",
    "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {4, 2, 5, 1, 3};\n    std::sort(v.begin(), v.end());\n    return 0;\n}",
  ],
  java: [
    "public class BinaryTree {\n    static class Node {\n        int data;\n        Node left, right;\n        Node(int item) {\n            data = item;\n            left = right = null;\n        }\n    }\n}",
    "public static void main(String[] args) {\n    System.out.println(\"Welcome to Typerix Platform\");\n}",
  ],
  html: [
    "<div class=\"flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg\">\n  <h1 class=\"text-2xl font-bold\">Typerix Arena</h1>\n  <button class=\"px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-all\">Start Test</button>\n</div>",
  ],
  sql: [
    "SELECT users.id, users.username, MAX(tests.wpm) AS top_wpm\nFROM users\nINNER JOIN tests ON users.id = tests.user_id\nWHERE tests.created_at >= NOW() - INTERVAL '30 days'\nGROUP BY users.id, users.username\nORDER BY top_wpm DESC\nLIMIT 10;",
  ],
};

const EXAM_SNIPPETS: Record<ExamType, string> = {
  ssc_chsl: "The Staff Selection Commission will hold a competitive examination for recruitment to the posts of Lower Divisional Clerk, Junior Secretariat Assistant, and Data Entry Operator. Candidates must demonstrate typing speed of 35 words per minute in English on computer.",
  banking_ibps: "The Banking Personnel Selection Institute conducts online computer typing tests for customer service associates. Accuracy and adherence to capital letters, punctuation marks, and formatting is heavily evaluated during the final selection process.",
  court_clerk: "In the High Court of Judicature, judicial assistants must transcribe dictation notes rapidly. Errors in legal terminology or missing commas lead to immediate point deductions.",
  steno: "Stenographer Grade C and D examination requires precise shorthand transcription. Type each word cleanly without looking down at the keyboard layout.",
};

export function generateTestText(
  mode: TestMode,
  subMode: SubMode,
  wordCount: number = 30,
  codeLang: CodeLanguage = 'javascript',
  examType: ExamType = 'ssc_chsl',
  customRawText?: string
): string {
  if (customRawText && customRawText.trim().length > 0) {
    return customRawText.trim();
  }

  if (mode === 'quote') {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return `${q.text} — ${q.author}`;
  }

  if (mode === 'code') {
    const pool = CODE_SNIPPETS[codeLang] || CODE_SNIPPETS.javascript;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (mode === 'exam') {
    return EXAM_SNIPPETS[examType] || EXAM_SNIPPETS.ssc_chsl;
  }

  // Word pool generation
  let pool = [...COMMON_WORDS];
  if (subMode === 'numbers') {
    pool = [...NUMBERS_POOL];
  } else if (subMode === 'symbols') {
    pool = [...SYMBOLS_POOL];
  } else if (subMode === 'mixed') {
    pool = [...COMMON_WORDS, ...NUMBERS_POOL, ...SYMBOLS_POOL];
  }

  const resultWords: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const word = pool[Math.floor(Math.random() * pool.length)];
    resultWords.push(word);
  }

  return resultWords.join(' ');
}
