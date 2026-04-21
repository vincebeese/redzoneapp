import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Deals', path: '/deals', icon: '📊' },
  { name: 'Coach', path: '/coach', icon: '🎯' },
  { name: 'Mindset', path: '/mindset', icon: '🧠' },
  { name: 'Learning', path: '/learning', icon: '🎓' },
  { name: 'Resources', path: '/resources', icon: '📚' },
];

export default function MobileNav() {
  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-rzs-red'
                  : 'text-gray-500 hover:text-rzs-charcoal'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
