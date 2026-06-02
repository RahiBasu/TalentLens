'use client';

import { useEffect, useState } from 'react';

export default function SalaryEstimator() {
  const [jobText, setJobText] = useState('');
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
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
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/salary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.data);
      setDetectedLocation(data.data.location ?? null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (num: number) => {
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
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
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--cream-faint)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>08 — Salary</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700, color: 'var(--cream)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Salary Estimator</h1>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
            Paste a job description and get a realistic salary estimate with negotiation tips.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>Job Description</div>
              <textarea placeholder="Paste the full job description here..." value={jobText} onChange={e => setJobText(e.target.value)} rows={14}
                style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '3px', padding: '10px 12px', color: 'var(--cream)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'Geist, sans-serif', lineHeight: 1.6 }}
              />
            </div>

            {detectedLocation && (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Detected Location</div>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', padding: '3px 10px', borderRadius: '2px', border: '1px solid var(--accent)', background: 'var(--accent-dim)' }}>
      {detectedLocation}
    </div>
  </div>
)}

            {error && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--red)', padding: '8px 12px', background: '#c0606015', borderRadius: '3px', border: '1px solid #c0606030' }}>{error}</div>}

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
                  Estimating...
                </span>
              ) : 'Estimate Salary →'}
            </button>
          </div>

          {/* RIGHT */}
          {!result ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '28px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>What you'll get</div>
              {[
                { label: 'Salary Range', desc: 'Min, median, and max for the role and location' },
                { label: 'Role & Level', desc: 'Seniority assessment based on JD requirements' },
                { label: 'Salary Factors', desc: 'What\'s driving the compensation up or down' },
                { label: 'Market Insights', desc: 'Current demand and trends for this role' },
                { label: 'Negotiation Tips', desc: 'Specific tactics to get a better offer' },
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

              {/* Salary range */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--cream)' }}>{result.role}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--accent)', marginTop: '4px' }}>{result.level} · {result.location}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--cream-faint)', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '2px' }}>{result.period}</div>
                </div>

                {/* Salary bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', textTransform: 'uppercase', marginBottom: '4px' }}>Min</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--cream-muted)' }}>{result.currencySymbol || '₹'}{formatSalary(result.salaryMin)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '4px' }}>Median</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>{result.currencySymbol || '₹'}{formatSalary(result.salaryMedian)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', textTransform: 'uppercase', marginBottom: '4px' }}>Max</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--cream-muted)' }}>{result.currencySymbol || '₹'}{formatSalary(result.salaryMax)}</div>
                    </div>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: '0', right: '0', height: '100%',
                      background: `linear-gradient(90deg, var(--border) 0%, var(--accent) 50%, var(--border) 100%)`,
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>
              </div>

              {/* Factors */}
              {result.factors?.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Salary Factors</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.factors.map((f: string) => (
                      <span key={f} style={{ padding: '3px 10px', borderRadius: '2px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', background: 'var(--surface-2)', color: 'var(--cream-muted)', border: '1px solid var(--border)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Market insights */}
              {result.marketInsights && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Market Insights</div>
                  <p style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>{result.marketInsights}</p>
                </div>
              )}

              {/* Negotiation tips */}
              {result.negotiationTips?.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--cream-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Negotiation Tips</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.negotiationTips.map((tip: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--accent)', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>0{i + 1}</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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