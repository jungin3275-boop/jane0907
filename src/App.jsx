import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Terminal, 
  Cpu, 
  PlusCircle, 
  Search, 
  Filter, 
  Pin, 
  MessageSquare, 
  Heart, 
  Eye, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Layers,
  Settings,
  Zap,
  Globe,
  Radio
} from 'lucide-react';

import { supabase, isSupabaseConfigured, INITIAL_MOCK_POSTS, INITIAL_MOCK_COMMENTS } from './lib/supabase';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { ConfigModal } from './components/ConfigModal';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';

export function App() {
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  const [comments, setComments] = useState(INITIAL_MOCK_COMMENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular'

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const isConnected = isSupabaseConfigured();

  // Load Posts from Supabase if configured
  useEffect(() => {
    if (isConnected && supabase) {
      fetchSupabasePosts();
      
      // Subscribe to Realtime posts changes
      const channel = supabase
        .channel('public:posts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
          fetchSupabasePosts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isConnected]);

  const fetchSupabasePosts = async () => {
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.warn('Using local fallback mock posts', err);
    }
  };

  const handleCreatePost = async (newPostData) => {
    if (isConnected && supabase) {
      try {
        const { data, error } = await supabase.from('posts').insert([newPostData]).select();
        if (!error && data) {
          setPosts([data[0], ...posts]);
          return;
        }
      } catch (e) {
        console.error('Supabase post insert failed', e);
      }
    }

    // Local state update fallback
    const localPost = {
      id: `local-${Date.now()}`,
      ...newPostData,
      likes_count: 0,
      comments_count: 0,
      views_count: 1,
      is_pinned: false,
      created_at: new Date().toISOString(),
    };
    setPosts([localPost, ...posts]);
  };

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes_count: p.likes_count + 1 };
      }
      return p;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, likes_count: prev.likes_count + 1 }));
    }

    if (isConnected && supabase) {
      const targetPost = posts.find(p => p.id === postId);
      if (targetPost) {
        await supabase.from('posts').update({ likes_count: targetPost.likes_count + 1 }).eq('id', postId);
      }
    }
  };

  const handleAddComment = async (postId, commentData) => {
    const newCommentObj = {
      id: `comm-${Date.now()}`,
      post_id: postId,
      ...commentData,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [...prev, newCommentObj]);
    
    // Update post comment count
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, comments_count: prev.comments_count + 1 }));
    }

    if (isConnected && supabase) {
      try {
        await supabase.from('comments').insert([{
          post_id: postId,
          author_name: commentData.author_name,
          author_avatar: commentData.author_avatar,
          content: commentData.content
        }]);
      } catch (err) {
        console.error('Supabase comment insert failed', err);
      }
    }
  };

  // Filter & Sort Logic
  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      if (sortBy === 'popular') return b.likes_count - a.likes_count;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const categories = ['All', 'Tech & Dev', 'Design & UI', 'AI & Data', 'General'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Glass Navigation Bar */}
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.location.reload()}>
              <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
                <Zap size={22} color="#fff" />
              </div>
              <div>
                <h1 className="gradient-text" style={{ fontSize: '20px', fontWeight: '800', tracking: '-0.02em', lineHeight: 1 }}>
                  Supabase Board
                </h1>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                  Realtime AI Community Platform
                </span>
              </div>
            </div>

            {/* Connection Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: '600',
              background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              color: isConnected ? '#34d399' : '#fbbf24'
            }}>
              <Radio size={12} className={isConnected ? "pulse" : ""} />
              {isConnected ? 'Supabase Live Sync' : 'Demo Mock Engine Active'}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setIsGuideOpen(true)}
              style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.3)', color: 'var(--accent-neon)' }}
            >
              <Terminal size={16} /> Supabase CLI / MCP 가이드
            </button>

            <button className="btn-secondary" onClick={() => setIsConfigOpen(true)}>
              <Settings size={16} /> DB 설정
            </button>

            <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>
              <PlusCircle size={18} /> 새 글 작성
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%' }}>
        
        {/* Hero Banner Section */}
        <section className="glass-card" style={{ padding: '32px', marginBottom: '32px', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: 'var(--primary-gradient)', filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '13px', marginBottom: '14px', color: 'var(--accent-neon)' }}>
              <Sparkles size={14} /> AI-Assisted Supabase Community Platform
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.3' }}>
              사용자들과 자유롭게 소통하고 <br />
              <span className="cyber-text">Supabase CLI & MCP</span>를 통해 실시간으로 성장하는 공간
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Supabase Realtime, CLI 스키마 마이그레이션, 그리고 AI Agent MCP 가이드가 완벽 적용된 커뮤니티 플랫폼입니다. 자유롭게 의견을 나누고 테크 인사이트를 공유해보세요!
            </p>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={16} color="var(--primary)" /> 100% Realtime 동기화
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} color="var(--accent-neon)" /> AI MCP Protocol 호환
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-glass)',
                  background: selectedCategory === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '420px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="제목, 내용, 태그 검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
              <button
                onClick={() => setSortBy('latest')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: sortBy === 'latest' ? 'rgba(255,255,255,0.1)' : 'none',
                  color: sortBy === 'latest' ? '#fff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Clock size={12} /> 최신순
              </button>
              <button
                onClick={() => setSortBy('popular')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: sortBy === 'popular' ? 'rgba(255,255,255,0.1)' : 'none',
                  color: sortBy === 'popular' ? '#fff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <TrendingUp size={12} /> 인기순
              </button>
            </div>
          </div>
        </div>

        {/* Post Grid Feed */}
        {filteredPosts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>검색 결과와 일치하는 게시글이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredPosts.map((post) => {
              const postComments = comments.filter(c => c.post_id === post.id);
              const commentCount = post.comments_count || postComments.length;

              return (
                <div 
                  key={post.id} 
                  className="glass-card"
                  onClick={() => setSelectedPost(post)}
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top Category & Pin Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: '700' }}>
                        {post.category}
                      </span>
                      {post.is_pinned && (
                        <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }}>
                          <Pin size={12} /> Pinned
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4', color: '#f9fafb' }}>
                      {post.title}
                    </h3>

                    {/* Short Preview */}
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.content}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} style={{ fontSize: '11px', color: 'var(--accent-neon)', background: 'rgba(0, 242, 254, 0.08)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                          alt="avatar" 
                          style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{post.author_name}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={14} /> {commentCount}
                        </span>
                        <span 
                          onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#f87171' }}
                        >
                          <Heart size={14} fill="#f87171" /> {post.likes_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', background: 'rgba(0,0,0,0.3)' }}>
        <p>Built with Supabase Realtime DB, Supabase CLI & MCP Protocol Engine</p>
      </footer>

      {/* Modals */}
      <SupabaseGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} onSave={() => setPosts([...posts])} />
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreatePost} />
      <PostDetailModal 
        post={selectedPost} 
        isOpen={Boolean(selectedPost)} 
        onClose={() => setSelectedPost(null)}
        comments={comments.filter(c => c.post_id === selectedPost?.id)}
        onAddComment={handleAddComment}
        onLike={handleLike}
      />
    </div>
  );
}

export default App;
