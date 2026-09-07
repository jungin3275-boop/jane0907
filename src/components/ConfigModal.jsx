import React, { useState } from 'react';
import { Database, Check, Key, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function ConfigModal({ isOpen, onClose, onSave }) {
  const [url, setUrl] = useState(localStorage.getItem('SUPABASE_URL') || '');
  const [anonKey, setAnonKey] = useState(localStorage.getItem('SUPABASE_ANON_KEY') || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('SUPABASE_URL', url.trim());
    localStorage.setItem('SUPABASE_ANON_KEY', anonKey.trim());
    onSave();
    onClose();
  };

  const handleReset = () => {
    localStorage.removeItem('SUPABASE_URL');
    localStorage.removeItem('SUPABASE_ANON_KEY');
    setUrl('');
    setAnonKey('');
    onSave();
    onClose();
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Supabase 프로젝트 연동 설정</h3>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Supabase Project URL
            </label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Supabase Anon / Public Key
            </label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
            />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontSize: '12px', color: 'var(--text-muted)' }}>
            ℹ️ 값을 입력하지 않아도 프리미엄 Mock 모드로 실시간 소통 기능을 바로 경험하실 수 있습니다.
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Check size={16} /> 연결 저장
            </button>
            {isConfigured && (
              <button type="button" className="btn-secondary" onClick={handleReset} style={{ color: '#ef4444' }}>
                <RefreshCw size={16} /> 초기화
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
