'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const STATUSES = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'var(--cream-faint)',
  APPLIED: 'var(--accent)',
  INTERVIEW: '#7aad7a',
  OFFER: '#5a9a7a',
  REJECTED: 'var(--red)',
};

export default function Tracker() {
  const { user } = useUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${user?.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApplications(data.applications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchApplications();
    } catch (err) { console.error(err); }
  };

  const deleteApplication = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}`, { method: 'DELETE' });
      fetchApplications();
    } catch (err) { console.error(err); }
  };

  const getByStatus = (status: string) => applications.filter(a => a.status === status);

  return (
    <div style={{ padding: '48px 56px', position: 'relative' }}>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '36px' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            color: 'var(--cream-faint)', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: '12px',
          }}>05 — Job Tracker</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700,
            color: 'var(--cream)', letterSpacing: '-0.5px', marginBottom: '8px',
          }}>Application Tracker</h1>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
            Track every application from saved to offer. Applications appear here after matching.
          </p>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cream-muted)', fontSize: '13px' }}>
            <span style={{ width: '12px', height: '12px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            Loading...
          </div>
        )}

        {error && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--red)', padding: '8px 12px', background: '#c0606015', borderRadius: '3px', border: '1px solid #c0606030', marginBottom: '16px' }}>{error}</div>
        )}

        {!loading && (
          <>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
              {STATUSES.map(status => (
                <div key={status} style={{ flex: 1, padding: '12px 16px', background: 'var(--surface)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: STATUS_COLORS[status] }}>{getByStatus(status).length}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>{status}</div>
                </div>
              ))}
            </div>

            {/* Kanban */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {STATUSES.map(status => (
                <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: '3px',
                    borderLeft: `3px solid ${STATUS_COLORS[status]}`,
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: STATUS_COLORS[status], letterSpacing: '0.12em', textTransform: 'uppercase' }}>{status}</span>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, color: 'var(--cream-muted)' }}>{getByStatus(status).length}</span>
                  </div>

                  {getByStatus(status).map(app => (
                    <div key={app.id} style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '3px', padding: '12px', transition: 'border-color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cream)', marginBottom: '2px', lineHeight: 1.3 }}>{app.job?.title || 'Untitled'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '8px' }}>{app.job?.company || 'Unknown'}</div>

                      {app.matchScore && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <div style={{ flex: 1, height: '2px', background: 'var(--border)', borderRadius: '1px' }}>
                            <div style={{ width: `${app.matchScore}%`, height: '100%', background: app.matchScore >= 70 ? 'var(--green)' : app.matchScore >= 40 ? 'var(--accent)' : 'var(--red)', borderRadius: '1px' }} />
                          </div>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)' }}>{app.matchScore}%</span>
                        </div>
                      )}

                      <select
                        value={app.status}
                        onChange={e => updateStatus(app.id, e.target.value)}
                        style={{
                          width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
                          borderRadius: '2px', padding: '4px 8px', color: 'var(--cream-muted)',
                          fontSize: '10px', outline: 'none', fontFamily: 'Geist, sans-serif',
                          cursor: 'pointer', marginBottom: '6px',
                        }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>

                      <button
                        onClick={() => deleteApplication(app.id)}
                        style={{ fontSize: '10px', color: 'var(--cream-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Geist, sans-serif' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--red)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--cream-faint)'}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {getByStatus(status).length === 0 && (
                    <div style={{ border: '1px dashed var(--border)', borderRadius: '3px', padding: '20px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--cream-faint)', fontFamily: 'JetBrains Mono, monospace' }}>Empty</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #1c1916; }
      `}</style>
    </div>
  );
}