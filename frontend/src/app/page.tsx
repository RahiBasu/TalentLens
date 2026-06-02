'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const ROTATING_WORDS = ['Resumes.', 'Job Descriptions.', 'Salary Data.', 'Skill Gaps.', 'Career Paths.'];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--base, #0e0e0e)',
      color: 'var(--cream, #f0ece4)',
      fontFamily: 'Geist, sans-serif',
    }}>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(var(--grid-line, #ffffff08) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line, #ffffff08) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderBottom: '1px solid var(--border, #ffffff12)',
      }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: 800,
          color: 'var(--cream, #f0ece4)',
          letterSpacing: '0.01em',
        }}>
          TalentLens
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/sign-in" style={{
            padding: isMobile ? '6px 10px' : '7px 16px',
            fontSize: '13px',
            color: 'var(--cream-muted, #a09a8e)',
            textDecoration: 'none',
            fontFamily: 'Geist, sans-serif',
          }}>
            Sign In
          </Link>
          <Link href="/sign-up" style={{
            padding: isMobile ? '6px 12px' : '7px 18px',
            fontSize: '13px', fontWeight: 600,
            color: 'var(--base, #0e0e0e)',
            background: 'var(--accent, #c8956c)',
            borderRadius: '3px', textDecoration: 'none',
            fontFamily: 'Syne, sans-serif',
          }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: 'calc(100vh - 61px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '60px 20px 80px' : '0 24px',
        borderBottom: '1px solid var(--border, #ffffff12)',
      }}>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isMobile ? '9px' : '10px',
          color: 'var(--accent, #c8956c)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>
          Job Market Intelligence
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: isMobile ? '38px' : 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: isMobile ? '-1px' : '-2px',
          color: 'var(--cream, #f0ece4)',
          marginBottom: '16px',
          maxWidth: '800px',
        }}>
          AI that understands<br />
          <span style={{
            color: 'var(--accent, #c8956c)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            display: 'inline-block',
          }}>
            {ROTATING_WORDS[wordIndex]}
          </span>
        </h1>

        <p style={{
          fontSize: isMobile ? '14px' : '15px',
          color: 'var(--cream-muted, #a09a8e)',
          lineHeight: 1.7,
          maxWidth: '460px',
          marginBottom: '40px',
          padding: isMobile ? '0 8px' : '0',
        }}>
          Stop applying blind. TalentLens gives you precise match scores, salary benchmarks, and gap analysis — before you hit send.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '64px',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '320px' : 'none',
        }}>
          <Link href="/sign-up" style={{
            padding: '12px 32px',
            background: 'var(--accent, #c8956c)',
            color: 'var(--base, #0e0e0e)',
            borderRadius: '3px', fontSize: '13px', fontWeight: 700,
            textDecoration: 'none', fontFamily: 'Syne, sans-serif',
            letterSpacing: '0.02em',
            width: isMobile ? '100%' : 'auto',
            textAlign: 'center',
            display: 'block',
          }}>
            Start for free →
          </Link>
          <Link href="/sign-in" style={{
            padding: '12px 20px',
            border: '1px solid var(--border, #ffffff18)',
            color: 'var(--cream-muted, #a09a8e)',
            borderRadius: '3px', fontSize: '13px',
            textDecoration: 'none',
            width: isMobile ? '100%' : 'auto',
            textAlign: 'center',
            display: 'block',
          }}>
            Already have an account?
          </Link>
        </div>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isMobile ? '9px' : '10px',
          color: 'var(--cream-faint, #6b6560)',
          letterSpacing: '0.1em',
          textAlign: 'center',
          padding: isMobile ? '0 12px' : '0',
        }}>
          No credit card · Free to start · Built for serious candidates
        </div>

        {/* Scroll indicator — hide on mobile */}
        {!isMobile && (
          <div style={{
            position: 'absolute', bottom: '32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
              color: 'var(--cream-faint, #6b6560)', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>scroll</div>
            <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, var(--accent, #c8956c), transparent)' }} />
          </div>
        )}
      </section>

      {/* Value props */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: isMobile ? '48px 20px' : '80px 48px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--border, #ffffff12)',
        }}>
          {[
            {
              num: '01',
              title: 'Know before you apply.',
              body: "Paste a JD and get a precise match score against your resume. See exactly what's missing — skills, keywords, seniority signals.",
            },
            {
              num: '02',
              title: 'Negotiate with data.',
              body: "Market-calibrated salary ranges for your exact role and location. Walk into every offer conversation knowing what you're worth.",
            },
            {
              num: '03',
              title: 'Track everything.',
              body: 'A kanban board built for job hunters. Applications, follow-ups, interview stages — all in one place with automated reminders.',
            },
          ].map((item) => (
            <div
              key={item.num}
              style={{
                background: 'var(--base, #0e0e0e)',
                padding: isMobile ? '28px 24px' : '40px 36px',
                transition: 'background 0.15s', cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface, #161616)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--base, #0e0e0e)')}
            >
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--accent, #c8956c)', marginBottom: '20px' }}>{item.num}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 700, color: 'var(--cream, #f0ece4)', marginBottom: '12px', lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--cream-faint, #6b6560)', lineHeight: 1.75 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The problem + What's inside */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: isMobile ? '0 20px 48px' : '0 48px 80px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1px',
          background: 'var(--border, #ffffff12)',
        }}>
          <div style={{ background: 'var(--surface, #161616)', padding: isMobile ? '32px 24px' : '56px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
              color: 'var(--cream-faint, #6b6560)', textTransform: 'uppercase',
              letterSpacing: '0.15em', marginBottom: '24px',
            }}>
              The problem
            </div>
            <p style={{
              fontSize: isMobile ? '18px' : '22px',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              color: 'var(--cream, #f0ece4)', lineHeight: 1.4, marginBottom: '20px',
            }}>
              Recruiters already know what they want. Most candidates are guessing.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--cream-muted, #a09a8e)', lineHeight: 1.75 }}>
              TalentLens gives you the same information edge — parsing JDs the same way ATS systems do, benchmarking salaries against real market data, and showing you exactly where your profile falls short before you apply.
            </p>
          </div>

          <div style={{ background: 'var(--surface, #161616)', padding: isMobile ? '32px 24px' : '56px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
              color: 'var(--cream-faint, #6b6560)', textTransform: 'uppercase',
              letterSpacing: '0.15em', marginBottom: '24px',
            }}>
              What's inside
            </div>
            {[
              'Resume parsing & skill extraction',
              'JD analysis & red flag detection',
              'AI match scoring with gap report',
              'Market salary benchmarking',
              'Application tracker with reminders',
              'AI cover letter generator',
              'Interview question bank',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '9px 0',
                borderBottom: i < 6 ? '1px solid var(--border, #ffffff08)' : 'none',
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent, #c8956c)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--cream-muted, #a09a8e)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: isMobile ? '0 20px 60px' : '0 48px 80px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{
          borderTop: '1px solid var(--border, #ffffff12)',
          paddingTop: isMobile ? '60px' : '80px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
            color: 'var(--cream-faint, #6b6560)', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: '20px',
          }}>
            Ready?
          </div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: isMobile ? '28px' : 'clamp(28px, 4vw, 48px)',
            fontWeight: 800, letterSpacing: isMobile ? '-0.5px' : '-1px',
            color: 'var(--cream, #f0ece4)', marginBottom: '16px', lineHeight: 1.1,
          }}>
            Your next role is<br />a match score away.
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted, #a09a8e)', marginBottom: '36px' }}>
            Free to start. No card required.
          </p>
          <Link href="/sign-up" style={{
            padding: isMobile ? '13px 32px' : '14px 40px',
            background: 'var(--accent, #c8956c)',
            color: 'var(--base, #0e0e0e)',
            borderRadius: '3px', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none', fontFamily: 'Syne, sans-serif',
            letterSpacing: '0.02em',
          }}>
            Get Started →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderTop: '1px solid var(--border, #ffffff12)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: isMobile ? '6px' : '0',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--cream-faint, #6b6560)' }}>
          TalentLens © 2025
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--cream-faint, #6b6560)' }}>
          Built for serious candidates.
        </div>
      </footer>

    </main>
  );
}