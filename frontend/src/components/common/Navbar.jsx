import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PrepNurseLogo from './PrepNurseLogo';
import { Moon, Sun, Menu, X, Shield, BookOpen, BarChart2, History, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide regular navbar during active exam for distraction-free test taking
  const isExamRoute = location.pathname.startsWith('/exam/');
  if (isExamRoute) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Banner Community Bar */}
      <div className="bg-gradient-to-r from-navy-900 via-purple-900 to-teal-900 text-white text-xs md:text-sm py-2 px-4 text-center flex items-center justify-center gap-2.5 flex-wrap shadow-sm">
        <span className="font-medium tracking-wide">
          <span className="inline-block mr-1">🏥</span> Join <b>PrepNurse Community</b> for daily high-yield clinical MCQs, rationales & NORCET updates
        </span>
        <a
          href="https://chat.whatsapp.com/GCymmczgn6W1FBPhxc3cux?s=cl&p=a&mlu=4&ilr=4"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white font-semibold px-3 py-0.5 rounded-full text-xs transition-all border border-teal-400/30 backdrop-blur-xs flex items-center gap-1"
        >
          <span>Join Free WhatsApp Group</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center group">
            <PrepNurseLogo size="md" showTagline={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <Link
              to="/tests"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/tests')
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Available Tests</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/attempts"
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/attempts')
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>My Attempts</span>
                </Link>
                <Link
                  to="/performance"
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/performance')
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`ml-2 px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-semibold border ${
                  isActive('/admin') || location.pathname.startsWith('/admin')
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{user.name}</span>
                  {isAdmin && <span className="text-purple-600 dark:text-purple-400 text-[11px] font-bold bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded">Admin</span>}
                </div>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900/50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 rounded-xl transition-all shadow-sm shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Free</span>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 animate-slide-up shadow-xl">
            <Link
              to="/tests"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800"
            >
              📚 Available Tests
            </Link>
            {user && (
              <>
                <Link
                  to="/attempts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800"
                >
                  ⏱️ My Attempts
                </Link>
                <Link
                  to="/performance"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800"
                >
                  📊 Performance Analytics
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800"
              >
                🛡️ Admin Dashboard
              </Link>
            )}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-rose-600 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout ({user.name})</span>
                </button>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-xl shadow-sm"
                  >
                    Register Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
