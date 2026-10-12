import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = localStorage.getItem('SP_URL') || 'https://vadqmzthctvykdgeqqqu.supabase.co';
const SUPABASE_ANON_KEY = localStorage.getItem('SP_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZHFtenRoY3R2eWtkZ2VxcXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODMwNzksImV4cCI6MjEwNzM1OTA3OX0.PN4DUz-SMcYkJ8grxBwk_ejXiYbwERUKx-OltH1pSs0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Default Fallback Data
export const INITIAL_PROFILE = {
  name: 'Arif Shahriar',
  eyebrow: 'CSE Student • Cyber Security Enthusiast • AI & Software Developer',
  hero_sub: 'I am passionate about Cyber Security, AI, software Development, and creating practical solutions with various technologies.',
  currently_exploring: 'Networking Fundamentals & Linux Security',
  profile_image: 'profile.png',
  resume_url: 'resume.txt',
  email: 'arifshahriar85204@gmail.com',
  github_url: 'https://github.com/arif42sh',
  linkedin_url: 'https://www.linkedin.com',
  facebook_url: 'https://facebook.com'
};

export const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'CRpilot',
    badge: 'AI-Driven Scheduling',
    category: 'Full-Stack',
    description: 'Smart room allocation and scheduling platform built to simplify coordination and improve planning.',
    tech_stack: ['Java', 'PHP', 'Android', 'MySQL'],
    bullets: ['Real-time room booking', 'Teacher tracking', 'Smart scheduling logic'],
    image_url: 'ChatGPT Image Mar 16, 2026, 10_47_28 AM.png',
    github_url: 'https://github.com/arif42sh',
    demo_url: '#contact'
  },
  {
    id: 2,
    title: 'HealNest',
    badge: 'Healthcare App',
    category: 'Mobile',
    description: 'A care-centered solution focused on health support, organization, and accessible digital experience.',
    tech_stack: ['Java', 'Android', 'Firebase'],
    bullets: ['Health workflow support', 'Structured digital records', 'Improved care visibility'],
    image_url: '',
    github_url: 'https://github.com/arif42sh',
    demo_url: '#contact'
  },
  {
    id: 3,
    title: 'WiFiSense-Lite',
    badge: 'Networking Tool',
    category: 'Cyber & Networking',
    description: 'A practical networking-oriented project built to understand connectivity, monitoring, and system behavior.',
    tech_stack: ['Python', 'Networking', 'Linux'],
    bullets: ['Network awareness', 'Useful diagnostics', 'Hands-on learning project'],
    image_url: '',
    github_url: 'https://github.com/arif42sh',
    demo_url: '#contact'
  },
  {
    id: 4,
    title: 'Alumni Networking System',
    badge: 'Directory System',
    category: 'Full-Stack',
    description: 'A directory-style platform for alumni connections, profile discovery, and structured communication.',
    tech_stack: ['PHP', 'MySQL', 'Web'],
    bullets: ['Profile-based directory', 'Search and networking support', 'Database-backed structure'],
    image_url: '',
    github_url: 'https://github.com/arif42sh',
    demo_url: '#contact'
  }
];

export const INITIAL_SKILLS = [
  { id: 1, category: 'Languages', name: 'C++' },
  { id: 2, category: 'Languages', name: 'Python' },
  { id: 3, category: 'Languages', name: 'Java' },
  { id: 4, category: 'Languages', name: 'JavaScript' },
  { id: 5, category: 'Frameworks', name: 'React' },
  { id: 6, category: 'Frameworks', name: 'PHP' },
  { id: 7, category: 'Frameworks', name: 'Laravel' },
  { id: 8, category: 'Database', name: 'MySQL' },
  { id: 9, category: 'Database', name: 'Firebase' },
  { id: 10, category: 'Database', name: 'Supabase' },
  { id: 11, category: 'Tools', name: 'Git' },
  { id: 12, category: 'Tools', name: 'GitHub' },
  { id: 13, category: 'Tools', name: 'VS Code' },
  { id: 14, category: 'Machine Learning', name: 'Python' },
  { id: 15, category: 'Machine Learning', name: 'Data Analysis' }
];

export const INITIAL_POSTS = [
  {
    id: 1,
    title: 'National Hackathon 2025: Engineering Smart Scheduling with CRpilot',
    category: 'Hackathons',
    date: 'Nov 2025',
    badge: 'Top 10 Finalist',
    summary: 'Collaborated in a high-intensity 36-hour sprint to build an automated conflict-free scheduling engine for educational institutions.',
    image_url: 'ChatGPT Image Mar 16, 2026, 10_47_28 AM.png',
    images: ['ChatGPT Image Mar 16, 2026, 10_47_28 AM.png', 'profile.png'],
    content: 'Participating in the National Hackathon was an eye-opening experience in rapid problem decomposition and full-stack execution. Our team tackled institutional room conflicts and teacher scheduling bottlenecks. Over 36 hours, we designed an intelligent logic engine backed by Java, PHP, and MySQL, presenting a working prototype to the judging panel and securing a top finalist position. Key lessons included agile task division, real-time database indexing, and defensive error handling under time constraints.',
    tags: ['Hackathon', 'Java', 'Full-Stack', 'Algorithm Design']
  },
  {
    id: 2,
    title: 'Intra-University Programming Contest: Mastering DSA under Pressure',
    category: 'Competitions',
    date: 'Jun 2025',
    badge: 'Top Rank Achiever',
    summary: 'Solved complex algorithmic challenges covering dynamic programming, graph traversal, and greedy paradigms in a competitive timed environment.',
    image_url: '',
    content: 'Competitive programming has consistently honed my ability to analyze edge cases and write performant code with strict time complexity limits. During the annual BAUST contest, our team solved key problems involving dynamic programming and shortest path algorithms in C++, reinforcing core computational thinking. The rigorous preparation taught me deep mathematical rigor and bug triage under intense pressure.',
    tags: ['Competitive Programming', 'C++', 'Data Structures', 'Algorithms']
  },
  {
    id: 3,
    title: 'Architectural Insights: Building Secure Full-Stack Systems with Laravel & React',
    category: 'Articles',
    date: 'Jan 2026',
    badge: 'Technical Insight',
    summary: 'Key architectural takeaways on decoupled systems, JWT token security, and robust database schema design for scalable web applications.',
    image_url: '',
    content: 'When architecting modern applications, maintaining clean separation of concerns between business logic and the presentation layer is critical. In this article, I break down common security pitfalls in RESTful APIs, role-based access control (RBAC), and how Laravel and React form a rock-solid developer synergy. By combining Laravel powerful Eloquent ORM with React reactive component model, teams can deliver high throughput and delightful UX.',
    tags: ['Laravel', 'React', 'System Design', 'Cyber Security']
  }
];

// Helper to compute SHA-256 for password authentication
export async function computeSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
