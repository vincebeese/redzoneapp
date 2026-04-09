import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-rzs-charcoal">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="lg:hidden">
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-rzs-red transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
