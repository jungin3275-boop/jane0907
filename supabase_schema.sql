-- 0. pgcrypto extension 활성화 (또는 gen_random_uuid 사용)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 게시글(posts) 테이블 생성
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 댓글(comments) 테이블 생성
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS 보안 권한 공개 설정
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Read Posts" ON public.posts;
DROP POLICY IF EXISTS "Allow Anon Insert Posts" ON public.posts;
DROP POLICY IF EXISTS "Allow Anon Update Posts" ON public.posts;
DROP POLICY IF EXISTS "Allow Public Read Comments" ON public.comments;
DROP POLICY IF EXISTS "Allow Anon Insert Comments" ON public.comments;

CREATE POLICY "Allow Public Read Posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow Anon Insert Posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Anon Update Posts" ON public.posts FOR UPDATE USING (true);

CREATE POLICY "Allow Public Read Comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow Anon Insert Comments" ON public.comments FOR INSERT WITH CHECK (true);

-- 4. 실시간(Realtime) 구독 연결
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
