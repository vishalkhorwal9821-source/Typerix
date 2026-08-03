import type { TestMode, SubMode, CodeLanguage, ExamType, TextCategory } from '../types';

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

const NUMBERS_POOL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '42', '99', '100', '3.14', '2026', '777', '1337', '9000', '10000'];

const SYMBOLS_POOL = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', ',', '.', '<', '>', '/', '?'];

const CATEGORY_TEXTS: Record<TextCategory, string[]> = {
  general: [
    "Mastery in typing is built on consistent daily practice, flawless accuracy, and relaxed hand posture rather than forced speed.",
    "The rapid growth of modern web applications requires developers to type code efficiently while keeping mental focus intact.",
    "Building high performance user interfaces demands clean software architecture, component modularity, and smooth micro animations."
  ],

  science: [
    "Quantum computing uses qubits capable of superposition and entanglement, solving complex cryptographic problems exponentially faster than classical computers.",
    "Artificial neural networks mimic biological brains through layers of interconnected nodes, optimizing weights via gradient descent backpropagation.",
    "CRISPR Cas9 gene editing enables targeted modifications of DNA sequences with unprecedented precision across biological organisms.",
    "Astrophysicists observe supermassive black holes through event horizon radiation patterns and gravitational wave interferometry."
  ],

  history: [
    "The Renaissance ignited a profound cultural rebirth in Europe, driving revolutionary advances in art, science, philosophy, and humanism.",
    "The Industrial Revolution transformed global economies from agrarian craftsmanship to mechanization, steam engines, and mass production factories.",
    "Ancient Roman aqueducts and architectural concrete structures demonstrated extraordinary civil engineering feats that endured for millennia."
  ],

  exams: [
    "UPSC Civil Services Examination tests comprehensive knowledge of constitutional law, economic development, Indian history, and global geopolitics.",
    "GATE computer science syllabus includes data structures, algorithms, compiler design, database management systems, and operating system kernels.",
    "SSC CHSL candidates must execute fast computer typing with high accuracy, adhering strictly to official capitalization and punctuation guidelines."
  ],

  medical: [
    "Myocardial infarction occurs when blood flow to a coronary artery section is blocked, leading to ischemia and cardiac tissue necrosis.",
    "Pharmacokinetics analyzes drug absorption, distribution, metabolism by hepatic enzymes, and renal excretion over time.",
    "Neurological synapses transmit neurotransmitters across synaptic clefts, activating postsynaptic receptors to propagate action potentials."
  ],

  anime: [
    "A lesson without pain is meaningless. You cannot gain something without sacrificing something else in return.",
    "Power isn't determined by your size, but by the size of your heart and dreams. Stand tall and keep pushing beyond your limits!",
    "If you don't take risks, you can't create a future. Believe in the version of yourself that believes in your own strength."
  ],

  quotes: [
    "Do not go where the path may lead, go instead where there is no path and leave a trail. — Ralph Waldo Emerson",
    "The only limit to our realization of tomorrow will be our doubts of today. — Franklin D. Roosevelt",
    "Simplicity is prerequisite for reliability. — Edsger W. Dijkstra",
    "First, solve the problem. Then, write the code. — John Johnson"
  ],

  code: [
    "const calculateWpm = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));",
    "function binarySearch(arr, target) { let l = 0, r = arr.length - 1; while (l <= r) { const mid = Math.floor((l + r) / 2); if (arr[mid] === target) return mid; if (arr[mid] < target) l = mid + 1; else r = mid - 1; } return -1; }"
  ]
};

const CODE_SNIPPETS: Record<CodeLanguage, string[]> = {
  javascript: [
    "const fetchUserData = async (userId) => {\n  const response = await fetch(`/api/user/${userId}`);\n  return response.json();\n};",
    "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2).filter(n => n > 4);",
    "class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  on(name, listener) {\n    (this.events[name] = this.events[name] || []).push(listener);\n  }\n}",
  ],
  typescript: [
    "interface UserProfile {\n  id: string;\n  username: string;\n  wpm: number;\n  accuracy: number;\n}\nconst updateProfile = (profile: UserProfile): void => {\n  console.log(profile.username);\n};",
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
  rust: [
    "fn main() {\n    let numbers = vec![1, 2, 3, 4, 5];\n    let sum: i32 = numbers.iter().sum();\n    println!(\"Sum is: {}\", sum);\n}",
  ],
  go: [
    "package main\nimport \"fmt\"\nfunc main() {\n    ch := make(chan string)\n    go func() { ch <- \"Typerix Go Engine\" }()\n    fmt.Println(<-ch)\n}",
  ]
};

const EXAM_SNIPPETS: Record<ExamType, string> = {
  ssc_chsl: "The Staff Selection Commission will hold a competitive examination for recruitment to Lower Divisional Clerk, Junior Secretariat Assistant, and Data Entry Operator posts. Candidates must demonstrate English typing speed of 35 words per minute on computer.",
  banking_ibps: "The Banking Personnel Selection Institute conducts online typing examinations for customer relationship associates. Strict adherence to proper capitalization, spacing, and legal accuracy is mandatory.",
  court_clerk: "In the High Court of Judicature, judicial assistants transcribe oral court dictation rapidly. Missing punctuation or misspelled legal terms results in instant candidate disqualifications.",
  steno: "Stenographer Grade C and D examinations test continuous shorthand transcription. Maintain clean finger rhythm without looking down at the keyboard keys.",
  upsc: "Union Public Service Commission demands clear prose articulation and precise speed during main written exam dictation sessions.",
  gate: "Graduate Aptitude Test in Engineering assesses core algorithms, OS thread scheduling, computer networks, and discrete mathematics."
};

export function generateTestText(
  mode: TestMode,
  subMode: SubMode,
  wordCount: number = 30,
  codeLang: CodeLanguage = 'javascript',
  examType: ExamType = 'ssc_chsl',
  category: TextCategory = 'general',
  customRawText?: string
): string {
  if (customRawText && customRawText.trim().length > 0) {
    return customRawText.trim();
  }

  if (mode === 'category') {
    const list = CATEGORY_TEXTS[category] || CATEGORY_TEXTS.general;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (mode === 'quote') {
    const list = CATEGORY_TEXTS.quotes;
    return list[Math.floor(Math.random() * list.length)];
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
