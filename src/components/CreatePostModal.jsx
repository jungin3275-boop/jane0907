import React, { useState } from 'react';
import { PenTool, Tag, Send, X, Sparkles } from 'lucide-react';

export function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech & Dev');
  const [authorName, setAuthorName] = useState('Anonymous Developer');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Supabase', 'React']);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title,
      content,
      category,
      author_name: authorName,
      author_avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      tags,
    });

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PenTool size={20} color="var(--accent-neon)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }} className="gradient-text">새 토론 / 게시글 작성</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>작성자 이름</label>
              <input 
                type="text" 
                className="input-field" 
                value={authorName} 
                onChange={(e) => setAuthorName(e.target.value)} 
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>카테고리</label>
              <select 
                className="input-field" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Tech & Dev" style={{ background: '#121425' }}>Tech & Dev</option>
                <option value="Design & UI" style={{ background: '#121425' }}>Design & UI</option>
                <option value="AI & Data" style={{ background: '#121425' }}>AI & Data</option>
                <option value="General" style={{ background: '#121425' }}>General</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>게시글 제목</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="커뮤니티 사용자들과 나눌 주제를 입력하세요..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>내용 (Markdown 지원)</label>
            <textarea 
              className="input-field" 
              rows={6} 
              placeholder="자유롭게 생각을 적어보세요. 코드 블록과 아이디어 공유를 환영합니다!" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>태그 (엔터 키로 추가)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {tags.map((t) => (
                <span key={t} style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  #{t}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(t)} />
                </span>
              ))}
            </div>
            <input 
              type="text" 
              className="input-field" 
              placeholder="태그 입력 후 Enter..." 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)} 
              onKeyDown={handleAddTag} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary">
              <Send size={16} /> 게시글 공유하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
