'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const nav = [
  { href: '/dashboard', label: 'Overview', num: '00' },
  { href: '/dashboard/jobs', label: 'Parse JD', num: '01' },
  { href: '/dashboard/resume', label: 'Parse Resume', num: '02' },
  { href: '/dashboard/match', label: 'Match Score', num: '03' },
  { href: '/dashboard/ats', label: 'ATS + Tailor', num: '04' },
  { href: '/dashboard/cover-letter', label: 'Cover Letter', num: '05' },
  { href: '/dashboard/salary', label: 'Salary Estimator', num: '06' },
  { href: '/dashboard/interview', label: 'Interview Prep', num: '07' },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{
      width: '200px', minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '36px 0', position: 'fixed', left: 0, top: 0, zIndex: 10,
    }}>
      <div style={{ padding: '0 24px 36px' }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 600,
          color: 'var(--cream)', letterSpacing: '-0.2px',
        }}>TalentLens</div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px',
          color: 'var(--cream-faint)', letterSpacing: '0.18em',
          textTransform: 'uppercase', marginTop: '5px',
        }}>Intelligence</div>
        <div style={{ width: '20px', height: '1px', background: 'var(--accent)', marginTop: '10px' }} />
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px', gap: '2px' }}>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', borderRadius: '3px', textDecoration: 'none',
              background: active ? 'var(--surface-2)' : 'transparent',
              transition: 'all 0.12s',
            }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{
                fontSize: '12.5px', fontWeight: active ? 500 : 400,
                color: active ? 'var(--cream)' : 'var(--cream-muted)',
              }}>{item.label}</span>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px',
                color: active ? 'var(--accent)' : 'var(--cream-faint)',
              }}>{item.num}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserButton />
        <span style={{ fontSize: '11px', color: 'var(--cream-faint)' }}>Account</span>
      </div>
    </aside>
  );
}