'use client';
import { useEffect, useRef } from 'react';

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(200,133,74,0.07), transparent 60%)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div ref={ref} style={{
      pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 0, transition: 'background 0.15s',
    }} />
  );
}