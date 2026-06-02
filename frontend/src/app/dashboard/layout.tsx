import Sidebar from '@/components/Sidebar';
import CursorSpotlight from '@/components/CursorSpotlight';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--base)' }}>
      <CursorSpotlight />
      <Sidebar />
      <main
        style={{
          marginLeft: '220px',
          flex: 1,
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}