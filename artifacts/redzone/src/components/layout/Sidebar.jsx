import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STATIC_SLUGS = { deal: '/deals', coach: '/coach', mindset: '/mindset' };

function modeToPath(mode) {
  return STATIC_SLUGS[mode.slug] ?? `/mode/${mode.slug}`;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [modes, setModes] = useState([]);

  useEffect(() => {
    fetch('/api/modes', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setModes(Array.isArray(data) ? data : []))
      .catch(() => setModes([]));
  }, [user?.id]);

  async function handleSignOut() {
    await logout();
    navigate('/login');
  }

  const initial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="flex flex-col h-full bg-rzs-charcoal text-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-lg font-bold text-rzs-red">Red Zone Selling</h1>
        <p className="text-xs text-gray-400 mt-1">Coach™</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive && location.pathname === '/'
                ? 'bg-rzs-red text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <span className="mr-3">🏠</span>
          Dashboard
        </NavLink>

        {modes.length > 0 && (
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Coaching Modes
            </p>
            {modes.map((mode) => {
              const path = modeToPath(mode);
              return (
                <NavLink
                  key={mode.slug}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-rzs-red text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="mr-3">{mode.icon || '💬'}</span>
                  {mode.display_name}
                  {mode.visibility === 'beta' && (
                    <span className="ml-auto text-[10px] font-semibold bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded">BETA</span>
                  )}
                  {mode.visibility === 'admin' && (
                    <span className="ml-auto text-[10px] font-semibold bg-orange-400 text-orange-900 px-1.5 py-0.5 rounded">ADMIN</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tools
          </p>
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-rzs-red text-white' : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <span className="mr-3">📚</span>
            Resources
          </NavLink>
        </div>
      </nav>

      {/* Admin section */}
      {user?.is_admin && (
        <div className="px-4 pt-4">
          <p className="px-0 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Admin
          </p>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-rzs-red text-white' : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <span className="mr-3">⚙️</span>
            Super Admin
          </NavLink>
        </div>
      )}

      {/* User section */}
      <div className="p-4 border-t border-gray-700 space-y-1">
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-rzs-red text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <div className="w-7 h-7 rounded-full bg-rzs-red flex items-center justify-center text-white text-xs font-semibold mr-3 flex-shrink-0">
            {initial}
          </div>
          <span className="truncate text-sm">{user?.email || 'Account'}</span>
        </NavLink>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm"
        >
          <span className="mr-3">↩</span>
          Sign Out
        </button>
      </div>

      <div className="p-4 text-center text-xs text-gray-500">REDZONESELLING.CO</div>
    </div>
  );
}
