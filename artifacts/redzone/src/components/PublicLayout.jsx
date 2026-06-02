import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';

export default function PublicLayout({ children, hideBetaBar = false }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  function handleContact() {
    setMobileMenuOpen(false);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#contact');
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {!hideBetaBar && (
        <div className="bg-[#1A1A1A] text-white text-sm text-center py-2 px-4">
          Founding Coaching Cohort — July–September 2026. 25 seats. Closes when full.{' '}
          <a href="/cohort" className="text-[#ef9a9a] font-semibold hover:underline whitespace-nowrap">
            Claim Your Seat →
          </a>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="relative flex items-center justify-between px-6 py-3">
          <Link to="/">
            <img src="/logo.png" alt="Red Zone Selling" style={{ height: '64px', width: 'auto' }} />
          </Link>

          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
            <Link to="/services" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Services</Link>
            <Link to="/about" className="text-base text-gray-500 hover:text-gray-900 transition-colors">About</Link>
            <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Blog</Link>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Book</a>
            <button onClick={handleContact} className="text-base text-gray-500 hover:text-gray-900 transition-colors">Contact</button>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="w-px h-4 bg-gray-200" />
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium text-white rounded px-3 py-1 hover:opacity-90 transition-opacity" style={{ background: '#C62828' }}>
                Go to App
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors">
                Login
              </Link>
            )}
          </div>

          <div className="flex sm:hidden items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium text-white rounded px-3 py-1" style={{ background: '#C62828' }}>Go to App</Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1">Login</Link>
            )}
            <button onClick={() => setMobileMenuOpen(v => !v)} className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100" aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 py-1 hover:text-gray-900">Services</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 py-1 hover:text-gray-900">About</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 py-1 hover:text-gray-900">Blog</Link>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 py-1 hover:text-gray-900">Book</a>
            <button onClick={handleContact} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Contact</button>
          </div>
        )}
      </nav>

      {children}

      <PublicFooter user={user} />
    </div>
  );
}

export function PublicFooter({ user }) {
  const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';
  return (
    <footer className="relative px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
      <Link to="/">
        <img src="/logo.png" alt="Red Zone Selling" style={{ height: '36px', width: 'auto' }} />
      </Link>
      <div className="flex flex-wrap gap-4">
        <Link to="/services" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Services</Link>
        <Link to="/about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">About</Link>
        <Link to="/blog" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Blog</Link>
        <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Book</a>
        <Link to="/#contact" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contact</Link>
        <span className="text-xs text-gray-200">|</span>
        <Link to="/what-is-red-zone-selling" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Learn More</Link>
        <Link to="/faq" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">FAQ</Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">2026 Red Zone Selling™</span>
        {user ? (
          <Link to="/dashboard" className="text-xs font-medium text-white rounded px-2.5 py-1 hover:opacity-90" style={{ background: '#C62828' }}>Go to App</Link>
        ) : null}
      </div>
    </footer>
  );
}
