import React, { useState } from 'react';
import { Terminal, Cpu, Database, Check, Copy, ExternalLink, Zap, Shield, Sparkles } from 'lucide-react';

export function SupabaseGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('cli');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cliCommands = [
    {
      id: 'install',
      title: '1. Supabase CLI 설치',
      description: '프로젝트 개발 환경에 Supabase CLI를 설치합니다.',
      code: 'npm install supabase --save-dev'
    },
    {
      id: 'login',
      title: '2. Supabase 로그인',
      description: 'Supabase 계정에 인증하고 Access Token을 가져옵니다.',
      code: 'npx supabase login'
    },
    {
      id: 'link',
      title: '3. 원격 Supabase 프로젝트 연동',
      description: '대시보드의 Project Reference ID를 사용해 원격 DB와 로컬을 바인딩합니다.',
      code: 'npx supabase link --project-ref <your-project-ref>'
    },
    {
      id: 'gen-types',
      title: '4. TypeScript 타입 자동 생성 (강력 추천)',
      description: 'DB 스키마 기반의 타입을 즉시 생성하여 에이전트와 완벽한 자동완성을 지원합니다.',
      code: 'npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts'
    },
    {
      id: 'db-push',
      title: '5. 로컬 스키마 원격 반영',
      description: '작성한 SQL 마이그레이션을 원격 데이터베이스에 적용합니다.',
      code: 'npx supabase db push'
    }
  ];

  const mcpConfigExample = `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref", "<YOUR_PROJECT_REF>",
        "--api-key", "<YOUR_SUPABASE_SERVICE_ROLE_KEY>"
      ]
    }
  }
}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-[#000]',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap style={{ color: 'var(--accent-neon)' }} size={24} />
              <h2 className="gradient-text" style={{ fontSize: '20px', fontWeight: '800' }}>
                Supabase CLI & MCP 가이드
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              CLI 명령어 설치부터 AI MCP(Model Context Protocol) 실시간 DB 연동법까지
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
          <button
            onClick={() => setActiveTab('cli')}
            style={{
              flex: 1,
              padding: '14px',
              background: activeTab === 'cli' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: 'none',
              borderBottom: activeTab === 'cli' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'cli' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <Terminal size={18} /> Supabase CLI 가이드
          </button>

          <button
            onClick={() => setActiveTab('mcp')}
            style={{
              flex: 1,
              padding: '14px',
              background: activeTab === 'mcp' ? 'rgba(0, 242, 254, 0.15)' : 'none',
              border: 'none',
              borderBottom: activeTab === 'mcp' ? '2px solid var(--accent-neon)' : '2px solid transparent',
              color: activeTab === 'mcp' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <Cpu size={18} /> Supabase MCP 연동
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            style={{
              flex: 1,
              padding: '14px',
              background: activeTab === 'schema' ? 'rgba(217, 70, 239, 0.15)' : 'none',
              border: 'none',
              borderBottom: activeTab === 'schema' ? '2px solid #d946ef' : '2px solid transparent',
              color: activeTab === 'schema' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <Database size={18} /> DB SQL 스키마
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'cli' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '13px', color: '#c7d2fe', lineHeight: '1.6' }}>
                  <strong>⚡ Supabase CLI</strong>를 사용하면 터미널에서 로컬 Supabase 에뮬레이터를 실행하거나, 원격 DB 마이그레이션 및 타입 자동 생성을 손쉽게 처리할 수 있습니다.
                </p>
              </div>

              {cliCommands.map((item) => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: '#f3f4f6' }}>{item.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.description}</span>
                  </div>
                  <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code>{item.code}</code>
                    <button 
                      onClick={() => copyToClipboard(item.code, item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      title="복사"
                    >
                      {copiedId === item.id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'mcp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles color="var(--accent-neon)" size={18} />
                  <strong style={{ color: 'var(--accent-neon)', fontSize: '14px' }}>Supabase MCP (Model Context Protocol) 이란?</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#a5f3fc', lineHeight: '1.6' }}>
                  MCP를 사용하면 Antigravity, Claude Desktop, Cursor 등 AI 코딩 에이전트가 사용자의 Supabase DB 스키마 조회가 가능하고, SQL 쿼리 검증 및 실시간 테이블생성을 AI가 직접 자동 수행하도록 허용할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#f3f4f6' }}>AI 에이전트 MCP Config (`mcp_config.json`) 설정 예시:</h4>
                <div className="code-block" style={{ position: 'relative' }}>
                  <button 
                    onClick={() => copyToClipboard(mcpConfigExample, 'mcp')}
                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {copiedId === 'mcp' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  </button>
                  <pre style={{ margin: 0 }}>{mcpConfigExample}</pre>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <div style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <Shield size={20} color="#818cf8" style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>실시간 스키마 인지</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI가 DB 구조를 파악해 100% 오류 없는 Supabase JS 쿼리를 작성합니다.</div>
                </div>
                <div style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <Zap size={20} color="var(--accent-neon)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>자동 마이그레이션 생성</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>자연어 요청만으로 게시판 추가 테이블 및 SQL 쿼리를 즉시 생성합니다.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Supabase Dashboard의 <strong>SQL Editor</strong>에 아래 SQL을 붙여넣고 실행하면 게시판용 테이블(`posts`, `comments`, `likes`, `profiles`)과 RLS 보안 정책이 즉시 자동 구축됩니다.
              </p>
              <div className="code-block" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <pre style={{ margin: 0, fontSize: '12px', color: '#93c5fd' }}>
{`-- Supabase SQL Editor에서 실행
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_bytes() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_bytes() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Public Read Posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow Anon Insert Posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Read Comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow Anon Insert Comments" ON public.comments FOR INSERT WITH CHECK (true);`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
