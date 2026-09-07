import { createClient } from '@supabase/supabase-js';

// Prefer a complete environment-variable pair, then a complete user override.
// The final pair is the project's public client configuration so the deployed
// app connects without requiring every visitor to configure their browser.
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const storedUrl = localStorage.getItem('SUPABASE_URL') || '';
const storedKey = localStorage.getItem('SUPABASE_ANON_KEY') || '';

const defaultUrl = 'https://kuguvmycecaahgjgxstz.supabase.co';
const defaultPublishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z3V2bXljZWNhYWhnamd4c3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzAyMjUsImV4cCI6MjEwMzM0NjIyNX0.8ADvg27HZOKgnSYJuUrnltxylijE8Rya2SIVlMH2Vv8';

const [supabaseUrl, supabaseAnonKey] = envUrl && envKey
  ? [envUrl, envKey]
  : storedUrl && storedKey
    ? [storedUrl, storedKey]
    : [defaultUrl, defaultPublishableKey];

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co'));
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Data for instant awe-inspiring experience
export const INITIAL_MOCK_POSTS = [
  {
    id: 'mock-1',
    title: '🚀 Supabase CLI & MCP로 10분 만에 실시간 게시판 구축하기',
    content: `Supabase CLI와 MCP(Model Context Protocol)를 활용하면 AI 코딩 에이전트와 데이터베이스 스키마를 직접 연결할 수 있습니다.

### 핵심 포인트:
1. \`supabase init\`으로 프로젝트 스키마 관리
2. \`supabase db push\`로 마이그레이션 자동 적용
3. MCP Server 연결로 AI가 쿼리를 작성 및 직접 실행

이 커뮤니티는 Supabase Realtime과 결합되어 댓글과 좋아요가 실시간 동기화됩니다!`,
    category: 'Tech & Dev',
    tags: ['Supabase', 'CLI', 'MCP', 'React'],
    author_name: 'Alex Developer',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    likes_count: 42,
    comments_count: 3,
    views_count: 380,
    is_pinned: true,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'mock-2',
    title: '✨ Cyberpunk Glassmorphic Design System 가이드',
    content: `미래지향적인 UI/UX를 구현하기 위한 CSS 글래스모피즘 테크닉입니다.
- \`backdrop-filter: blur(16px)\`
- 네온 그라데이션 보더 효과
- Micro-interactions & Smooth Transitions

사용자 경험을 극대화하는 UI 노하우를 공유합니다. 자유롭게 댓글로 의견을 나눠주세요!`,
    category: 'Design & UI',
    tags: ['UI/UX', 'Glassmorphic', 'CSS', 'Aesthetics'],
    author_name: 'Elena Rostova',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    likes_count: 89,
    comments_count: 5,
    views_count: 940,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'mock-3',
    title: '💡 AI 에이전트 개발 시 Supabase Vector DB 활용 노하우',
    content: `pgvector 확장 기능을 활용해 차세대 AI 임베딩 검색 엔진을 구축해본 후기입니다.
PostgreSQL 기반이라 기존 게시판 데이터와 결합하기 매우 직관적입니다.`,
    category: 'AI & Data',
    tags: ['AI', 'VectorDB', 'PostgreSQL'],
    author_name: 'Min-jun Kim',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    likes_count: 27,
    comments_count: 2,
    views_count: 215,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export const INITIAL_MOCK_COMMENTS = [
  {
    id: 'comm-1',
    post_id: 'mock-1',
    author_name: 'Sarah Connor',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'CLI 타입 자동 생성 기능(`npx supabase gen types`) 덕분에 TypeScript 개발 생산성이 200% 향상되었습니다!',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'comm-2',
    post_id: 'mock-1',
    author_name: 'David Tech',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'MCP 연동 부분이 매우 인상적이네요. AI가 DB 스키마를 직접 이해하니까 개발 속도가 미쳤습니다 🔥',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];
