/** All site copy lives here, typed, sourced from the résumé. */

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export interface Project {
  id: string
  title: string
  kicker: string
  summary: string
  points: string[]
  stack: string[]
  metric?: { value: string; label: string }
  /** Extra search terms so "x-ray" or "latency" find the right work. */
  keywords: string
}

export interface Job {
  role: string
  company: string
  period: string
  points: string[]
}

export const profile = {
  name: 'Gaurav Kumavat',
  firstName: 'Gaurav',
  lastName: 'Kumavat',
  eyebrow: 'Generative AI · Applied ML',
  lede: 'AI engineer building RAG pipelines, LLM-powered applications and the backend APIs that ship them.',
  email: 'gaurav10.kumavat@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gaurav-kumavat-gk1100/',
  github: 'https://github.com/GK1100',
  doi: 'https://doi.org/10.1109/ICSSES64899.2025.11009316',
}

export const heroStats: Stat[] = [
  { value: 97, suffix: '%', label: 'Fracture-detection accuracy with DenseNet-121' },
  { value: 10, suffix: '+', label: 'Open-source TTS models benchmarked' },
  { value: 1, suffix: '', label: 'Co-authored IEEE conference paper' },
]

export const about = {
  heading: 'I turn unstructured data into answers.',
  paragraphs: [
    'B.Tech graduate in Computer Science & Engineering (AI & ML) with hands-on experience in generative AI, machine learning and deep learning. I build RAG pipelines, integrate large language models, write backend APIs with FastAPI and ship them in Docker.',
    "I co-authored an IEEE paper on machine learning for antimicrobial resistance data, and I'm looking for AI Engineer, GenAI and Applied AI roles.",
  ],
  facts: [
    {
      label: 'Education',
      value: 'B.Tech, Computer Science & Engineering (AI & ML)',
      detail: 'Dayananda Sagar University · 2022 – 2026 · CGPA 8.03',
    },
    {
      label: 'Certification',
      value: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
      detail: 'Oracle University',
    },
    {
      label: 'Publication',
      value: 'Machine Learning and Artificial Intelligence for Predictive Modeling in Antimicrobial Resistance Data Sets',
      detail: 'IEEE Conference · 2025',
      href: profile.doi,
    },
  ],
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'AI & GenAI',
    items: [
      'RAG Pipelines',
      'LLM Integration',
      'Vector DBs',
      'Embeddings',
      'Semantic Search',
      'Agentic AI',
      'AI Agents',
      'TTS',
    ],
  },
  {
    title: 'Machine Learning',
    items: ['Deep Learning', 'Model Evaluation', 'Feature Engineering', 'TensorFlow', 'Keras'],
  },
  {
    title: 'Backend & Tools',
    items: [
      'FastAPI',
      'LangChain',
      'Sentence Transformers',
      'Docker',
      'n8n',
      'Streamlit',
      'pandas',
      'BeautifulSoup',
      'Git',
    ],
  },
  { title: 'Languages', items: ['Python', 'SQL'] },
]

/** Curated "nearest neighbours" between skills. Made symmetric at runtime. */
export const skillEdges: Record<string, string[]> = {
  'RAG Pipelines': ['LLM Integration', 'Vector DBs', 'Embeddings', 'Semantic Search', 'LangChain', 'FastAPI'],
  Embeddings: ['Sentence Transformers', 'Vector DBs', 'Semantic Search'],
  'Vector DBs': ['Semantic Search'],
  'LLM Integration': ['LangChain', 'Agentic AI', 'AI Agents'],
  'Agentic AI': ['AI Agents', 'n8n', 'LangChain'],
  'Deep Learning': ['TensorFlow', 'Keras', 'Model Evaluation', 'Feature Engineering', 'TTS'],
  FastAPI: ['Docker', 'Python'],
  Python: ['pandas', 'TensorFlow', 'Streamlit', 'BeautifulSoup', 'SQL'],
  TTS: ['Model Evaluation'],
}

export const projects: Project[] = [
  {
    id: 'nexus-ai',
    title: 'Nexus-AI',
    kicker: 'Multimodal RAG system',
    summary: 'End-to-end retrieval-augmented generation for document ingestion and contextual querying.',
    points: [
      'FastAPI backend for file upload, embedding generation and semantic search.',
      'Containerized with Docker for scalable deployment.',
    ],
    stack: ['FastAPI', 'LangChain', 'Vector DB', 'Docker'],
    keywords: 'rag retrieval augmented generation embeddings semantic search documents llm api backend multimodal containers',
  },
  {
    id: 'bone-fracture',
    title: 'Bone Fracture Detection',
    kicker: 'Multi-model deep learning',
    summary: 'Compared four CNN architectures for classifying fractures in X-ray images.',
    points: [
      'Trained and compared VGG-16, VGG-19, ResNet-50 and DenseNet-121.',
      'DenseNet-121 reached 97% accuracy, benefiting from strong feature reuse and generalization.',
    ],
    stack: ['Python', 'TensorFlow', 'Keras'],
    metric: { value: '97%', label: 'accuracy · DenseNet-121' },
    keywords: 'x-ray xray image classification cnn medical healthcare diagnostics deep learning accuracy vgg resnet densenet',
  },
  {
    id: 'linkedin-rag',
    title: 'LinkedIn Profile RAG',
    kicker: 'Automated retrieval workflow',
    summary: 'Automated RAG system that extracts, processes and searches LinkedIn profile data.',
    points: [
      'Data extraction, processing and semantic search for efficient profile retrieval.',
      'Workflow integrations automated with n8n.',
    ],
    stack: ['RAG', 'n8n', 'Semantic Search'],
    keywords: 'linkedin profile scraping extraction automation workflow n8n retrieval internship champion infometrics',
  },
  {
    id: 'tts-benchmark',
    title: 'TTS Model Benchmark',
    kicker: 'Speech model evaluation',
    summary: 'Benchmarked 10+ open-source text-to-speech models for a production decision.',
    points: [
      'Compared Bhashini, CosyVoice 3, Qwen3-Omni and XTTS v2, among others.',
      'Scored clarity, expressiveness, latency and license compliance.',
    ],
    stack: ['TTS', 'Evaluation'],
    metric: { value: '10+', label: 'models compared' },
    keywords: 'speech audio voice text to speech tts latency clarity expressiveness license benchmark evaluation vidarka',
  },
  {
    id: 'media-quality',
    title: 'Media Quality Pipeline',
    kicker: 'Compression & measurement',
    summary: 'Image and video compression pipelines with objective quality measurement.',
    points: [
      'Compression pipelines built with FFmpeg.',
      'Audio and video quality scored with PSNR, SSIM and VMAF.',
    ],
    stack: ['FFmpeg', 'PSNR', 'SSIM', 'VMAF'],
    keywords: 'ffmpeg video image compression codec psnr ssim vmaf quality metrics multimedia vidarka',
  },
]

export const jobs: Job[] = [
  {
    role: 'Product Developer Intern',
    company: 'Champion InfoMetrics',
    period: 'Oct 2025 – Dec 2025',
    points: [
      'Developed an automated LinkedIn RAG system on top of the open-source Linked-Profile-RAG project.',
      'Integrated data extraction, processing and semantic search for efficient retrieval of profile information.',
      'Built and automated workflow integrations with n8n.',
    ],
  },
  {
    role: 'AI and Multimedia Intern',
    company: 'Vidarka Technologies Private Limited',
    period: 'Mar 2025 – Oct 2025',
    points: [
      'Implemented image and video compression pipelines with FFmpeg.',
      'Evaluated audio and video quality using PSNR, SSIM and VMAF.',
      'Benchmarked 10+ open-source TTS models on clarity, expressiveness, latency and license compliance.',
    ],
  },
]
