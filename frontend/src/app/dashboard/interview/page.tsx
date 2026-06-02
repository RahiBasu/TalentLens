'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function InterviewPrep() {
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState<'paste' | 'upload'>('paste');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState('');
  const [drag, setDrag] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: finalResumeText, jobText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.interviewData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          }}>06 — Interview Prep</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700,
            color: 'var(--cream)', letterSpacing: '-0.5px', marginBottom: '8px',
          }}>Interview Preparation</h1>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
            Get tailored interview questions based on the job description and your background.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>Your Resume</div>

              <div style={{ display: 'flex', gap: '2px', marginBottom: '14px', background: 'var(--surface-2)', borderRadius: '3px', padding: '3px', width: 'fit-content' }}>
                {(['paste', 'upload'] as const).map(m => (
                  <button key={m} onClick={() => setResumeMode(m)} style={{
                    padding: '5px 14px', borderRadius: '2px', border: 'none',
                    background: resumeMode === m ? 'var(--accent)' : 'transparent',
                    color: resumeMode === m ? 'var(--base)' : 'var(--cream-muted)',
                    fontSize: '11px', fontWeight: resumeMode === m ? 600 : 400,
                    cursor: 'pointer', fontFamily: 'Syne, sans-serif', transition: 'all 0.15s',
                  }}>{m === 'paste' ? 'Paste Text' : 'Upload PDF'}</button>
                ))}
              </div>

              {resumeMode === 'paste' ? (
                <textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText} onChange={e => setResumeText(e.target.value)}
                  rows={10}
                  style={{
                    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '3px', padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
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
                  onClick={() => document.getElementById('interview-resume-input')?.click()}
                  style={{
                    border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '4px', padding: '32px 20px', textAlign: 'center',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                    background: drag ? 'var(--accent-dim)' : 'var(--surface-2)',
                  }}
                >
                  <input id="interview-resume-input" type="file" accept=".pdf"
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
                    <div style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>Drop PDF here or click to browse</div>
                  )}
                </div>
              )}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>Job Description</div>
              <textarea
                placeholder="Paste the job description here..."
                value={jobText} onChange={e => setJobText(e.target.value)}
                rows={8}
                style={{
                  width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '3px', padding: '10px 12px', color: 'var(--cream)', fontSize: '13px',
                  outline: 'none', resize: 'vertical', fontFamily: 'Geist, sans-serif', lineHeight: 1.6,
                }}
              />
            </div>

            {error && (
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--red)', padding: '8px 12px', background: '#c0606015', borderRadius: '3px', border: '1px solid #c0606030' }}>{error}</div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              background: loading ? 'var(--surface-2)' : 'var(--accent)',
              color: loading ? 'var(--cream-muted)' : 'var(--base)',
              border: 'none', borderRadius: '3px', padding: '13px',
              fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Syne, sans-serif', transition: 'all 0.15s',
            }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', border: '2px solid var(--cream-faint)', borderTopColor: 'var(--cream)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Generating...
                </span>
              ) : 'Generate Interview Questions →'}
            </button>
          </div>

          {/* RIGHT */}
          {!result ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '28px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>What you'll get</div>
              {[
                { label: 'Technical Questions', desc: 'Role-specific technical questions based on the JD' },
                { label: 'Behavioural Questions', desc: 'STAR-format questions tailored to your background' },
                { label: 'Culture Fit Questions', desc: 'Questions about values and team fit' },
                { label: 'Suggested Answers', desc: 'Framework answers using your own experience' },
                { label: 'Tips Per Question', desc: 'What the interviewer is really looking for' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--accent)', flexShrink: 0 }}>0{i + 1}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cream)', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cream-muted)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {result.overview && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Overview</div>
                  <p style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>{result.overview}</p>
                </div>
              )}

              {result.questions?.map((q: any, i: number) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    style={{
                      width: '100%', padding: '14px 20px', background: 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cream)', lineHeight: 1.4 }}>{q.question}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{q.type}</div>
                      </div>
                    </div>
                    <span style={{ color: 'var(--cream-faint)', fontSize: '12px', flexShrink: 0, transition: 'transform 0.15s', transform: openIndex === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </button>

                  {openIndex === i && (
                    <div style={{ padding: '0 20px 16px 44px', borderTop: '1px solid var(--border)' }}>
                      {q.answer && (
                        <div style={{ paddingTop: '14px', marginBottom: '12px' }}>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Suggested Answer</div>
                          <p style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>{q.answer}</p>
                        </div>
                      )}
                      {q.tip && (
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Tip</div>
                          <p style={{ fontSize: '11px', color: 'var(--cream-muted)', lineHeight: 1.5 }}>{q.tip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: var(--cream-faint); }
        textarea:focus { border-color: var(--border-hover) !important; }
      `}</style>
    </div>
  );
}