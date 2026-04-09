import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const PATH_TO_MODE = {
  '/deal': 'deal',
  '/coach': 'coach',
  '/mindset': 'mindset',
  '/resources': 'resources',
};

export default function Layout() {
  const location = useLocation();
  const lastMode = useRef(null);

  useEffect(() => {
    const base = '/' + location.pathname.split('/')[1];
    const mode = PATH_TO_MODE[base];
    if (mode && mode !== lastMode.current) {
      lastMode.current = mode;
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ event_type: 'mode_entered', properties: { mode } }),
      }).catch(() => {});
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0">
        <MobileNav />
      </div>
    </div>
  );
}
