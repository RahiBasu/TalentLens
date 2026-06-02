'use client';

import { useEffect, useState } from 'react';

export default function ParseJob() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

  const handleSubmit = async () => {
    if (!description) { setError('Job description is required'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.job);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parsed = result?.parsedData;

  return (
    <div style={{ padding: '48px 56px', maxWidth: '1100px', position: 'relative' }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            color: 'var(--cream-faint)', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: '12px',
          }}>01 — Parse JD</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700,
            color: 'var(--cream)', letterSpacing: '-0.5px', marginBottom: '8px',
          }}>Extract Job Intelligence</h1>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
            Paste any job description. Get skills, requirements, and structure — instantly.
          </p>
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT — Input Form */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '28px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'var(--cream-faint)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', display: 'block', marginBottom: '6px',
                }}>Job Title</label>
                <input
                  type="text" placeholder="e.g. Senior Product Manager"
                  value={title} onChange={e => setTitle(e.target.value)}
                  style={{
                    width: '100%', background: 'var(--surface-2)',
                    border: '1px solid var(--border)', borderRadius: '3px',
                    padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
                    outline: 'none', fontFamily: 'Geist, sans-serif',
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'var(--cream-faint)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', display: 'block', marginBottom: '6px',
                }}>Company</label>
                <input
                  type="text" placeholder="e.g. Google"
                  value={company} onChange={e => setCompany(e.target.value)}
                  style={{
                    width: '100%', background: 'var(--surface-2)',
                    border: '1px solid var(--border)', borderRadius: '3px',
                    padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
                    outline: 'none', fontFamily: 'Geist, sans-serif',
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'var(--cream-faint)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', display: 'block', marginBottom: '6px',
                }}>Job Description *</label>
                <textarea
                  placeholder="Paste the full job description here..."
                  value={description} onChange={e => setDescription(e.target.value)}
                  rows={14}
                  style={{
                    width: '100%', background: 'var(--surface-2)',
                    border: '1px solid var(--border)', borderRadius: '3px',
                    padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
                    outline: 'none', resize: 'vertical', fontFamily: 'Geist, sans-serif',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {error && (
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  color: 'var(--red)', padding: '8px 12px',
                  background: '#c0606015', borderRadius: '3px',
                  border: '1px solid #c0606030',
                }}>{error}</div>
              )}

              <button
                onClick={handleSubmit} disabled={loading}
                style={{
                  background: loading ? 'var(--surface-2)' : 'var(--accent)',
                  color: loading ? 'var(--cream-muted)' : 'var(--base)',
                  border: 'none', borderRadius: '3px', padding: '12px',
                  fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Syne, sans-serif', letterSpacing: '0.02em',
                  transition: 'all 0.15s',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '12px', height: '12px', border: '2px solid var(--cream-faint)',
                      borderTopColor: 'var(--cream)', borderRadius: '50%',
                      display: 'inline-block', animation: 'spin 0.7s linear infinite',
                    }} />
                    Parsing...
                  </span>
                ) : 'Extract Intelligence →'}
              </button>

            </div>
          </div>

          {/* RIGHT — Empty state or Results */}
          {!parsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '20px',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'var(--cream-faint)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', marginBottom: '16px',
                }}>What you'll get</div>
                {[
                  { label: 'Required Skills', desc: 'Technical and soft skills the role demands' },
                  { label: 'Preferred Skills', desc: 'Nice-to-have qualifications' },
                  { label: 'Responsibilities', desc: 'Day-to-day duties broken down clearly' },
                  { label: 'Experience & Education', desc: 'Minimum requirements extracted' },
                  { label: 'Job Type & Location', desc: 'Remote, hybrid, on-site, salary range' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', padding: '10px 0',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                      color: 'var(--accent)', flexShrink: 0, marginTop: '1px',
                    }}>0{i + 1}</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cream)', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--cream-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '20px',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'var(--cream-faint)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', marginBottom: '12px',
                }}>Tip</div>
                <p style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
                  Paste the full JD including responsibilities and requirements for the most accurate extraction. The more context, the better the output.
                </p>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '16px 20px',
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
              }}>
                {[
                  { label: 'Job Type', value: parsed.jobType },
                  { label: 'Location', value: parsed.location },
                  { label: 'Salary', value: parsed.salary },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                      color: 'var(--cream-faint)', letterSpacing: '0.15em',
                      textTransform: 'uppercase', marginBottom: '4px',
                    }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: item.value ? 'var(--cream)' : 'var(--cream-faint)' }}>
                      {item.value || '—'}
                    </div>
                  </div>
                ))}
              </div>

              <ResultSection title="Required Skills">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {parsed.requiredSkills?.map((s: string) => <Chip key={s} label={s} color="accent" />)}
                </div>
              </ResultSection>

              {parsed.preferredSkills?.length > 0 && (
                <ResultSection title="Preferred Skills">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {parsed.preferredSkills?.map((s: string) => <Chip key={s} label={s} color="muted" />)}
                  </div>
                </ResultSection>
              )}

              {parsed.responsibilities?.length > 0 && (
                <ResultSection title="Responsibilities">
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {parsed.responsibilities?.map((r: string, i: number) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--accent)', flexShrink: 0 }}>›</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </ResultSection>
              )}

              <ResultSection title="Requirements">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {parsed.experience && (
                    <div style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--cream-faint)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>EXP </span>
                      {parsed.experience}
                    </div>
                  )}
                  {parsed.education && (
                    <div style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--cream-faint)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>EDU </span>
                      {parsed.education}
                    </div>
                  )}
                </div>
              </ResultSection>

            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: var(--cream-faint); }
        input:focus, textarea:focus { border-color: var(--border-hover) !important; }
      `}</style>
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '4px', padding: '16px 20px',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
        color: 'var(--cream-faint)', letterSpacing: '0.15em',
        textTransform: 'uppercase', marginBottom: '12px',
      }}>{title}</div>
      {children}
    </div>
  );
}

function Chip({ label, color }: { label: string; color: 'accent' | 'muted' }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '2px', fontSize: '11px',
      fontFamily: 'JetBrains Mono, monospace',
      background: color === 'accent' ? 'var(--accent-dim)' : 'var(--surface-2)',
      color: color === 'accent' ? 'var(--accent)' : 'var(--cream-muted)',
      border: `1px solid ${color === 'accent' ? '#c8854a30' : 'var(--border)'}`,
    }}>{label}</span>
  );
}