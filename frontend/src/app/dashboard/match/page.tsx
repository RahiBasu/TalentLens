'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function MatchScore() {
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState<'paste' | 'upload'>('paste');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState('');
  const [drag, setDrag] = useState(false);
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
    if (!jobText) { setError('Job description is required'); return; }
    if (resumeMode === 'paste' && !resumeText) { setError('Resume text is required'); return; }
    if (resumeMode === 'upload' && !resumeFile) { setError('Please upload a PDF'); return; }

    setLoading(true); setError(''); setResult(null);

    try {
      let finalResumeText = resumeText;

      // If PDF uploaded, send to parse endpoint first to extract text
      if (resumeMode === 'upload' && resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('clerkId', user?.id || '');
        const parseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/parse`, {
          method: 'POST', body: formData,
        });
        const parseData = await parseRes.json();
        if (!parseRes.ok) throw new Error(parseData.error || 'Failed to parse PDF');
        finalResumeText = parseData.resume?.content || '';
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: finalResumeText, jobText, clerkId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.matchData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const score = result?.matchScore || 0;
  const scoreColor = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--accent)' : 'var(--red)';

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
          }}>03 — Match Score</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700,
            color: 'var(--cream)', letterSpacing: '-0.5px', marginBottom: '8px',
          }}>How Well Do You Match?</h1>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
            Upload or paste your resume, add a job description, and get your match score instantly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT — Resume + JD inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Resume input card */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '24px',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                color: 'var(--cream-faint)', letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '14px',
              }}>Your Resume</div>

              {/* Tab toggle */}
              <div style={{
                display: 'flex', gap: '2px', marginBottom: '14px',
                background: 'var(--surface-2)', borderRadius: '3px',
                padding: '3px', width: 'fit-content',
              }}>
                {(['paste', 'upload'] as const).map(m => (
                  <button key={m} onClick={() => setResumeMode(m)} style={{
                    padding: '5px 14px', borderRadius: '2px', border: 'none',
                    background: resumeMode === m ? 'var(--accent)' : 'transparent',
                    color: resumeMode === m ? 'var(--base)' : 'var(--cream-muted)',
                    fontSize: '11px', fontWeight: resumeMode === m ? 600 : 400,
                    cursor: 'pointer', fontFamily: 'Syne, sans-serif', transition: 'all 0.15s',
                  }}>
                    {m === 'paste' ? 'Paste Text' : 'Upload PDF'}
                  </button>
                ))}
              </div>

              {resumeMode === 'paste' ? (
                <textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText} onChange={e => setResumeText(e.target.value)}
                  rows={10}
                  style={{
                    width: '100%', background: 'var(--surface-2)',
                    border: '1px solid var(--border)', borderRadius: '3px',
                    padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
                    outline: 'none', resize: 'vertical', fontFamily: 'Geist, sans-serif', lineHeight: 1.6,
                  }}
                />
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => {
                    e.preventDefault(); setDrag(false);
                    const f = e.dataTransfer.files[0];
                    if (f?.type === 'application/pdf') setResumeFile(f);
                  }}
                  onClick={() => document.getElementById('match-resume-input')?.click()}
                  style={{
                    border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '4px', padding: '32px 20px', textAlign: 'center',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                    background: drag ? 'var(--accent-dim)' : 'var(--surface-2)',
                  }}
                >
                  <input
                    id="match-resume-input" type="file" accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={e => setResumeFile(e.target.files?.[0] || null)}
                  />
                  <div style={{ fontSize: '20px', color: 'var(--cream-faint)', marginBottom: '8px' }}>↑</div>
                  {resumeFile ? (
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: 500 }}>{resumeFile.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--cream-muted)', marginTop: '2px' }}>{(resumeFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>Drop PDF here or click to browse</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* JD input card */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '24px',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                color: 'var(--cream-faint)', letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '14px',
              }}>Job Description</div>
              <textarea
                placeholder="Paste the job description here..."
                value={jobText} onChange={e => setJobText(e.target.value)}
                rows={8}
                style={{
                  width: '100%', background: 'var(--surface-2)',
                  border: '1px solid var(--border)', borderRadius: '3px',
                  padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
                  outline: 'none', resize: 'vertical', fontFamily: 'Geist, sans-serif', lineHeight: 1.6,
                }}
              />
            </div>

            {error && (
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                color: 'var(--red)', padding: '8px 12px',
                background: '#c0606015', borderRadius: '3px', border: '1px solid #c0606030',
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit} disabled={loading}
              style={{
                background: loading ? 'var(--surface-2)' : 'var(--accent)',
                color: loading ? 'var(--cream-muted)' : 'var(--base)',
                border: 'none', borderRadius: '3px', padding: '13px',
                fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
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
                  Matching...
                </span>
              ) : 'Get Match Score →'}
            </button>
          </div>

          {/* RIGHT — Results or empty */}
          {!result ? (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '48px 28px', textAlign: 'center',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                border: '3px solid var(--border)', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--cream-faint)' }}>?</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.7 }}>
                Add your resume and a job description,<br />then hit Match to see your score.
              </div>
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Match Score /100', 'Matched Skills', 'Missing Skills', 'Recommendation'].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', background: 'var(--surface-2)',
                    borderRadius: '3px', opacity: 0.5,
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--cream-faint)' }}>0{i + 1}</span>
                    <span style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Score gauge */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '28px', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'var(--cream-faint)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', marginBottom: '16px',
                }}>Match Score</div>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 700, color: scoreColor }}>{score}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)' }}>/100</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>
                  {score >= 70 ? 'Strong match — apply with confidence' : score >= 40 ? 'Moderate match — some gaps to address' : 'Weak match — significant gaps exist'}
                </div>
              </div>

              {result.matchedSkills?.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--green)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>✓ Matched Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.matchedSkills.map((s: string) => (
                      <span key={s} style={{ padding: '3px 10px', borderRadius: '2px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', background: '#3d6b4f20', color: 'var(--green)', border: '1px solid #3d6b4f40' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.missingSkills?.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--red)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>✗ Missing Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.missingSkills.map((s: string) => (
                      <span key={s} style={{ padding: '3px 10px', borderRadius: '2px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', background: '#c0606015', color: 'var(--red)', border: '1px solid #c0606030' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendation && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Recommendation</div>
                  <p style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>{result.recommendation}</p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder, input::placeholder { color: var(--cream-faint); }
        textarea:focus, input:focus { border-color: var(--border-hover) !important; }
      `}</style>
    </div>
  );
}