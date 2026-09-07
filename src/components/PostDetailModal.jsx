import React, { useState } from 'react';
import { Heart, MessageSquare, Eye, Pin, Calendar, User, Send, CornerDownRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function PostDetailModal({ post, isOpen, onClose, comments, onAddComment, onLike }) {
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Dev Enthusiast');

  if (!isOpen || !post) return null;

  const handleLikeClick = () => {
    onLike(post.id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(post.id, {
      content: newComment,
      author_name: commentAuthor,
      author_avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`,
    });

    setNewComment('');
  };

  const formattedDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--accent-neon)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '600' }}>
              {post.category}
            </span>
            {post.is_pinned && (
              <span style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Pin size={12} /> Pinned
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '14px', lineHeight: '1.4' }}>
            {post.title}
          </h2>

          {/* Author info & Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                alt="author" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary)' }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{post.author_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {formattedDate}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={16} /> {post.views_count}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={16} /> {comments.length}</span>
              <button 
                onClick={handleLikeClick} 
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', transition: 'all 0.2s' }}
              >
                <Heart size={16} fill="#f87171" /> {post.likes_count}
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#e5e7eb', whitespace: 'pre-line', marginBottom: '24px' }}>
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {post.tags.map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--accent-neon)" /> 실시간 댓글 ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="댓글 작성자 닉네임" 
                value={commentAuthor} 
                onChange={(e) => setCommentAuthor(e.target.value)}
                style={{ width: '200px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="다정하고 따뜻한 댓글을 남겨주세요..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary">
                  <Send size={16} /> 작성
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '12px' }}>
                    <img src={c.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{c.author_name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {new Date(c.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#d1d5db', lineHeight: '1.5' }}>{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
