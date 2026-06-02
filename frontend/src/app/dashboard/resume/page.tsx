'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ParseResume() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

  const handleSubmit = async () => {
    if (!file) { setError('Please select a PDF file'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('clerkId', user?.id || '');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/parse`, {
        method: 'POST', body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parsed = result?.parsedData;

  return (
    <div style={{ padding: '48px 56px', maxWidth: '1100px', position: 'relative' }}>

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
          }}>02 — Parse Resume</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700,
            color: 'var(--cream)', letterSpacing: '-0.5px', marginBottom: '8px',
          }}>Analyse Your Profile</h1>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
            Upload your PDF resume. Get a structured breakdown of your skills, experience, and education.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT — Upload */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px',
          }}>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false);
                const f = e.dataTransfer.files[0];
                if (f?.type === 'application/pdf') setFile(f);
              }}
              onClick={() => document.getElementById('resume-input')?.click()}
              style={{
                border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '4px', padding: '40px 24px', textAlign: 'center',
                cursor: 'pointer', transition: 'border-color 0.15s',
                background: drag ? 'var(--accent-dim)' : 'var(--surface-2)',
              }}
            >
              <input
                id="resume-input" type="file" accept=".pdf"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '24px',
                color: 'var(--cream-faint)', marginBottom: '12px',
              }}>↑</div>
              {file ? (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: 500, marginBottom: '4px' }}>{file.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--cream-muted)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--cream-muted)', marginBottom: '4px' }}>Drop your PDF here or click to browse</div>
                  <div style={{ fontSize: '11px', color: 'var(--cream-faint)' }}>PDF files only</div>
                </div>
              )}
            </div>

            {error && (
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                color: 'var(--red)', padding: '8px 12px',
                background: '#c0606015', borderRadius: '3px', border: '1px solid #c0606030',
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit} disabled={loading || !file}
              style={{
                background: loading || !file ? 'var(--surface-2)' : 'var(--accent)',
                color: loading || !file ? 'var(--cream-muted)' : 'var(--base)',
                border: 'none', borderRadius: '3px', padding: '12px',
                fontSize: '13px', fontWeight: 600,
                cursor: loading || !file ? 'not-allowed' : 'pointer',
                fontFamily: 'Syne, sans-serif', transition: 'all 0.15s',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '12px', height: '12px', border: '2px solid var(--cream-faint)',
                    borderTopColor: 'var(--cream)', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.7s linear infinite',
                  }} />
                  Analysing...
                </span>
              ) : 'Analyse Resume →'}
            </button>

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
                }}>What gets extracted</div>
                {[
                  { label: 'Contact Info', desc: 'Name, email, phone number' },
                  { label: 'Skills', desc: 'Technical and soft skills listed' },
                  { label: 'Work Experience', desc: 'Companies, roles, durations' },
                  { label: 'Education', desc: 'Degrees, institutions, years' },
                  { label: 'Summary', desc: 'Professional summary or objective' },
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
                  Use a clean, text-based PDF for best results. Scanned image PDFs may not extract well.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Name + Contact */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '20px',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700,
                  color: 'var(--cream)', marginBottom: '8px',
                }}>{parsed.name || 'Unknown'}</div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {parsed.email && <span style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>{parsed.email}</span>}
                  {parsed.phone && <span style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>{parsed.phone}</span>}
                </div>
                {parsed.summary && (
                  <p style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6, marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    {parsed.summary}
                  </p>
                )}
              </div>

              {/* Skills */}
              {parsed.skills?.length > 0 && (
                <Section title="Skills">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {parsed.skills.map((s: string) => (
                      <span key={s} style={{
                        padding: '3px 10px', borderRadius: '2px', fontSize: '11px',
                        fontFamily: 'JetBrains Mono, monospace',
                        background: 'var(--accent-dim)', color: 'var(--accent)',
                        border: '1px solid #c8854a30',
                      }}>{s}</span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Experience */}
              {parsed.experience?.length > 0 && (
                <Section title="Experience">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {parsed.experience.map((e: any, i: number) => (
                      <div key={i} style={{ paddingBottom: i < parsed.experience.length - 1 ? '12px' : 0, borderBottom: i < parsed.experience.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--cream)' }}>{e.role}</div>
                        <div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '4px' }}>{e.company} · {e.duration}</div>
                        {e.description && <div style={{ fontSize: '11px', color: 'var(--cream-muted)', lineHeight: 1.5 }}>{e.description}</div>}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Education */}
              {parsed.education?.length > 0 && (
                <Section title="Education">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {parsed.education.map((e: any, i: number) => (
                      <div key={i}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--cream)' }}>{e.degree}</div>
                        <div style={{ fontSize: '11px', color: 'var(--cream-muted)' }}>{e.institution} · {e.year}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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