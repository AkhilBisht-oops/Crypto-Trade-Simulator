import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/format';
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
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <span className="text-lg font-semibold text-white hidden sm:block tracking-tight">CryptoSim</span>
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-dark-900/40">
              <span className="text-xs text-dark-400">Balance</span>
              <span className="text-sm font-semibold font-mono text-emerald-400">
                {formatCurrency(user?.balance || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-sm font-medium text-dark-200">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-dark-200 hidden lg:block">{user?.username}</span>
              <button
                onClick={logout}
                className="p-2 text-dark-400 hover:text-rose-400 transition-colors duration-200"
                title="Logout"
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
