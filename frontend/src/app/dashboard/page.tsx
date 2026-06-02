'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const syncUser = async (clerkId: string, email: string, name: string) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId, email, name }),
    });
  } catch (err) { console.error('sync error:', err); }
};

const features = [
  { href: '/dashboard/jobs', label: 'Parse JD', num: '01', desc: 'Extract skills, requirements, and structure from any job posting.' },
  { href: '/dashboard/resume', label: 'Parse Resume', num: '02', desc: 'Upload your PDF. Get a clean breakdown of your profile.' },
  { href: '/dashboard/match', label: 'Match Score', num: '03', desc: 'Score your resume against a role. See exactly what\'s missing.' },
  { href: '/dashboard/ats', label: 'ATS + Tailor CV', num: '04', desc: 'Optimise for ATS systems. Get rewrite suggestions line by line.' },
  { href: '/dashboard/cover-letter', label: 'Cover Letter', num: '05', desc: 'Generate a tailored cover letter ready to send in minutes.' },
  { href: '/dashboard/interview', label: 'Interview Prep', num: '07', desc: 'AI-generated questions tailored to the JD and your background.' },
];

function Card3D({ children, href, isMobile }: { children: React.ReactNode; href: string; isMobile: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
  };

  const handleLeave = () => {
    if (isMobile) return;
    if (ref.current) ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ textDecoration: 'none', transition: 'transform 0.2s ease', display: 'block' }}
    >
      {children}
    </Link>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function Dashboard() {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (user) syncUser(user.id, user.primaryEmailAddress?.emailAddress || '', user.fullName || '');
    setTimeout(() => setVisible(true), 100);
  }, [user]);

  return (
    <div style={{
      padding: isMobile ? '32px 20px' : '52px 56px',
      maxWidth: '1060px',
      position: 'relative',
    }}>

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
        <div style={{
          marginBottom: isMobile ? '40px' : '64px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isMobile ? '9px' : '10px',
            color: 'var(--cream-faint)', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: '20px',
          }}>
            Good {getTimeOfDay()} — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: isMobile ? '28px' : '40px',
            fontWeight: 700,
            lineHeight: 1.08,
            color: 'var(--cream)',
            letterSpacing: isMobile ? '-0.5px' : '-1.5px',
            marginBottom: '20px',
          }}>
            {user?.firstName ? `${user.firstName}'s` : 'Your'} job search,<br />
            <span style={{ color: 'var(--accent)' }}>intelligently</span> managed.
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--accent)', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--cream-muted)', lineHeight: 1.7 }}>
              From parsing to prep — everything in one quiet place.
            </p>
          </div>
        </div>

        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
            color: 'var(--cream-faint)', letterSpacing: '0.18em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Workspace</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          {features.map((f, i) => (
            <Card3D key={f.href} href={f.href} isMobile={isMobile}>
              <div
                style={{
                  padding: isMobile ? '20px 16px' : '28px 24px',
                  background: 'var(--surface)',
                  height: '100%',
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${0.1 + i * 0.07}s, transform 0.5s ease ${0.1 + i * 0.07}s, background 0.15s`,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isMobile ? '14px' : '20px' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.08em',
                  }}>{f.num}</span>
                  <span style={{ color: 'var(--cream-faint)', fontSize: '14px' }}>↗</span>
                </div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 600, color: 'var(--cream)',
                  marginBottom: '8px', letterSpacing: '-0.1px',
                }}>{f.label}</div>
                {!isMobile && (
                  <div style={{ fontSize: '12px', color: 'var(--cream-muted)', lineHeight: 1.6 }}>
                    {f.desc}
                  </div>
                )}
              </div>
            </Card3D>
          ))}
        </div>

      </div>
    </div>
  );
}