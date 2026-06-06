import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../App';
import { formatCurrency } from '../utils/format';
import { Sun, Moon, Coins } from 'lucide-react';
import { HiOutlineViewGrid as GridIcon, HiOutlineBriefcase as BriefcaseIcon, HiOutlineClock as ClockIcon, HiOutlineLogout as LogoutIcon, HiOutlineStar as StarIcon } from 'react-icons/hi';
import { HiOutlineTrophy as TrophyIcon } from 'react-icons/hi2';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: GridIcon },
  { path: '/portfolio', label: 'Portfolio', icon: BriefcaseIcon },
  { path: '/history', label: 'History', icon: ClockIcon },
  { path: '/watchlist', label: 'Watchlist', icon: StarIcon },
  { path: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg transition-colors duration-200"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(9, 9, 11, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Coins size={20} style={{ color: 'var(--accent)' }} />
            <span
              className="text-lg font-semibold hidden sm:block tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              CryptoSim
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive ? 'nav-link-active' : 'nav-link'}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label="Toggle visual theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-sub)',
                border: '1px solid var(--border)',
              }}
            >
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Balance</span>
              <span className="text-sm font-semibold font-mono" style={{ color: 'var(--success)' }}>
                {formatCurrency(user?.balance || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: 'var(--bg-sub)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span
                className="text-sm hidden lg:block"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="p-2 transition-colors duration-200"
                style={{ color: 'var(--text-muted)' }}
                title="Logout"
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <LogoutIcon className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive ? 'nav-link-active' : 'nav-link'} whitespace-nowrap text-sm`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
