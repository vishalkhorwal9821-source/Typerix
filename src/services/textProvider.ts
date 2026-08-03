import type { TestMode, SubMode, CodeLanguage, ExamType, TextCategory, DifficultyLevel } from '../types';

export const LONG_ARTICLES: Record<DifficultyLevel, { title: string; text: string }> = {
  easy: {
    title: "The Importance of Learning Every Day",
    text: `Learning is one of the most valuable activities in life. Every day gives us a new chance to discover something useful, whether it is a new skill, an interesting fact, or a better way to solve a problem. Learning does not only happen in schools or colleges. It also happens at home, in the workplace, while talking with friends, and even during simple daily experiences. People who continue learning throughout their lives become more confident, more creative, and better prepared for the future. A child learns how to speak by listening to family members and practicing words every day. Students learn mathematics, science, history, and languages by attending classes and completing assignments. Adults continue learning through work, books, online courses, and personal experiences. No matter how old someone is, there is always something new to understand. This makes life more exciting and meaningful because every lesson opens the door to new opportunities. Reading is one of the easiest ways to learn. Books contain knowledge collected over many years by writers, researchers, and experts. A good book can teach valuable lessons, improve vocabulary, and encourage creative thinking. Reading for just twenty or thirty minutes each day can make a noticeable difference over time. Newspapers, magazines, and educational websites also provide useful information about current events, science, technology, health, and many other subjects. The habit of reading helps people think clearly and communicate more effectively. Technology has made learning easier than ever before. Today, anyone with an internet connection can access thousands of educational videos, online courses, digital libraries, and interactive lessons. Students can attend virtual classrooms, professionals can improve their skills, and hobby enthusiasts can learn everything from cooking to photography. Technology allows people to learn at their own pace, making education more flexible and accessible. However, it is important to use technology wisely and avoid spending too much time on entertainment instead of productive learning. Learning also develops important life skills. Critical thinking helps people analyze information before making decisions. Communication skills improve relationships at home, in school, and at work. Problem-solving skills allow people to overcome challenges with confidence. Time management teaches individuals how to balance study, work, and personal activities. These skills become valuable in almost every part of life and help people achieve their goals more effectively.`
  },
  medium: {
    title: "The Future of Artificial Intelligence in Everyday Life",
    text: `Artificial Intelligence, commonly known as AI, has become one of the most influential technologies of the modern world. What once seemed like a concept from science fiction is now part of everyday life. People use AI while unlocking their smartphones with facial recognition, receiving movie recommendations on streaming platforms, navigating through traffic with GPS applications, and even chatting with virtual assistants. As technology continues to improve, AI is expected to become even more deeply integrated into our daily routines. Understanding its benefits, challenges, and future possibilities is essential because AI will shape the way people live, work, and communicate. One of the greatest advantages of Artificial Intelligence is its ability to automate repetitive tasks. Many activities that once required significant human effort can now be completed quickly and accurately by intelligent systems. Businesses use AI to organize large amounts of data, answer customer questions through chatbots, detect fraudulent transactions, and improve supply chain management. These systems allow employees to spend less time on routine work and more time solving complex problems that require creativity and critical thinking. Healthcare is another field experiencing remarkable improvements through AI. Modern algorithms can analyze medical images, identify patterns in patient records, and assist doctors in detecting diseases at earlier stages. Early diagnosis often leads to better treatment outcomes and improved patient care. AI-powered wearable devices can monitor heart rate, sleep quality, physical activity, and other health indicators in real time. This information helps individuals maintain healthier lifestyles while enabling medical professionals to respond more quickly when problems arise.`
  },
  hard: {
    title: "The Interconnected Future of Technology, Humanity, and Sustainable Innovation",
    text: `Throughout history, humanity has experienced remarkable transformations driven by innovation, curiosity, and the relentless pursuit of progress. From the invention of the wheel and the printing press to the development of the internet and Artificial Intelligence, each technological breakthrough has fundamentally altered the way societies communicate, produce, and solve problems. Today, the pace of technological advancement is accelerating at an unprecedented rate, creating opportunities that previous generations could scarcely imagine. However, this rapid evolution also introduces complex ethical, environmental, and economic challenges that demand thoughtful consideration. The future will not be defined solely by the technologies humanity invents, but by the wisdom with which those innovations are developed, regulated, and applied. Artificial Intelligence has emerged as one of the most transformative technologies of the twenty-first century. Modern AI systems can analyze vast quantities of information, recognize intricate patterns, generate realistic content, and assist professionals across countless industries. Researchers employ AI to accelerate scientific discoveries, physicians utilize intelligent diagnostic tools to improve patient outcomes, financial institutions detect fraudulent transactions through predictive algorithms, and software developers leverage machine learning to automate repetitive programming tasks. These capabilities demonstrate that AI is no longer confined to research laboratories; instead, it has become an essential component of everyday life and economic development.`
  }
};

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
  'practice', 'engine', 'quantum', 'future', 'cyber', 'network', 'matrix', 'crystal', 'energy', 'spirit',
  'challenge', 'victory', 'horizon', 'dimension', 'freedom', 'inspire', 'courage', 'strength', 'knowledge',
  'wisdom', 'harmony', 'symphony', 'spectrum', 'architect', 'pioneer', 'catalyst', 'momentum', 'synergy'
];

const NUMBERS_POOL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '42', '99', '100', '3.14', '2026', '777', '1337', '9000', '10000'];
const SYMBOLS_POOL = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', ',', '.', '<', '>', '/', '?'];

const CATEGORY_TEXTS: Record<TextCategory, string[]> = {
  general: [
    "Mastery in typing is built on consistent daily practice, flawless accuracy, and relaxed hand posture rather than forced speed. The rapid growth of modern web applications requires developers to type code efficiently while keeping mental focus intact. Building high performance user interfaces demands clean software architecture, component modularity, and smooth micro animations."
  ],
  science: [
    "Quantum computing uses qubits capable of superposition and entanglement, solving complex cryptographic problems exponentially faster than classical computers. Artificial neural networks mimic biological brains through layers of interconnected nodes, optimizing weights via gradient descent backpropagation."
  ],
  history: [
    "The Renaissance ignited a profound cultural rebirth in Europe, driving revolutionary advances in art, science, philosophy, and humanism. The Industrial Revolution transformed global economies from agrarian craftsmanship to mechanization, steam engines, and mass production factories."
  ],
  exams: [
    "UPSC Civil Services Examination tests comprehensive knowledge of constitutional law, economic development, Indian history, and global geopolitics. GATE computer science syllabus includes data structures, algorithms, compiler design, database management systems, and operating system kernels."
  ],
  medical: [
    "Myocardial infarction occurs when blood flow to a coronary artery section is blocked, leading to ischemia and cardiac tissue necrosis. Pharmacokinetics analyzes drug absorption, distribution, metabolism by hepatic enzymes, and renal excretion over time."
  ],
  anime: [
    "A lesson without pain is meaningless. You cannot gain something without sacrificing something else in return. Power isn't determined by your size, but by the size of your heart and dreams. Stand tall and keep pushing beyond your limits!"
  ],
  quotes: [
    "Do not go where the path may lead, go instead where there is no path and leave a trail. — Ralph Waldo Emerson"
  ],
  code: [
    "const calculateWpm = (chars, seconds) => Math.round((chars / 5) / (seconds / 60)); function binarySearch(arr, target) { let l = 0, r = arr.length - 1; while (l <= r) { const mid = Math.floor((l + r) / 2); if (arr[mid] === target) return mid; if (arr[mid] < target) l = mid + 1; else r = mid - 1; } return -1; }"
  ]
};

const CODE_SNIPPETS: Record<CodeLanguage, string[]> = {
  javascript: ["const fetchUserData = async (userId) => {\n  const response = await fetch(`/api/user/${userId}`);\n  return response.json();\n};"],
  typescript: ["interface UserProfile {\n  id: string;\n  wpm: number;\n}\nconst update = (u: UserProfile): void => console.log(u);"],
  python: ["def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    return quicksort([x for x in arr if x < pivot]) + [x for x in arr if x == pivot] + quicksort([x for x in arr if x > pivot])"],
  cpp: ["#include <iostream>\nint main() { std::cout << \"Hello Typrix\"; return 0; }"],
  java: ["public class Main { public static void main(String[] args) { System.out.println(\"Java Code\"); } }"],
  html: ["<div className=\"flex items-center justify-between p-4 bg-slate-900\"><h1>Typrix</h1></div>"],
  sql: ["SELECT users.id, MAX(tests.wpm) FROM users INNER JOIN tests ON users.id = tests.user_id GROUP BY users.id;"],
  rust: ["fn main() { println!(\"Typrix Rust Engine\"); }"],
  go: ["package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"Go\") }"]
};

const EXAM_SNIPPETS: Record<ExamType, string> = {
  ssc_chsl: "The Staff Selection Commission will hold a competitive examination for recruitment to Lower Divisional Clerk posts. Candidates must demonstrate 35 WPM.",
  banking_ibps: "The Banking Personnel Selection Institute conducts online typing examinations for customer relationship associates.",
  court_clerk: "In the High Court of Judicature, judicial assistants transcribe oral court dictation rapidly.",
  steno: "Stenographer Grade C and D examinations test continuous shorthand transcription.",
  upsc: "Union Public Service Commission demands clear prose articulation and precise speed.",
  gate: "Graduate Aptitude Test in Engineering assesses algorithms, operating systems, and networks."
};

export function generateTestText(
  mode: TestMode,
  subMode: SubMode,
  wordCount: number = 30,
  codeLang: CodeLanguage = 'javascript',
  examType: ExamType = 'ssc_chsl',
  category: TextCategory = 'general',
  difficulty: DifficultyLevel = 'easy',
  customRawText?: string
): string {
  if (customRawText && customRawText.trim().length > 0) {
    return customRawText.trim();
  }

  if (mode === 'article') {
    return LONG_ARTICLES[difficulty]?.text || LONG_ARTICLES.easy.text;
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

  // In TIME mode, generate 450 words so paragraph NEVER ends until the timer expires!
  let targetWordCount = wordCount;
  if (mode === 'time') {
    targetWordCount = 450;
  }

  let pool = [...COMMON_WORDS];
  if (subMode === 'numbers') {
    pool = [...NUMBERS_POOL];
  } else if (subMode === 'symbols') {
    pool = [...SYMBOLS_POOL];
  } else if (subMode === 'mixed') {
    pool = [...COMMON_WORDS, ...NUMBERS_POOL, ...SYMBOLS_POOL];
  }

  const resultWords: string[] = [];
  for (let i = 0; i < targetWordCount; i++) {
    const word = pool[Math.floor(Math.random() * pool.length)];
    resultWords.push(word);
  }

  return resultWords.join(' ');
}
