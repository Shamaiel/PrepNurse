import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserCheck, Shield, AlertCircle } from 'lucide-react';
import PrepNurseLogo from '../../components/common/PrepNurseLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 sm:p-9 shadow-xl shadow-purple-500/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <PrepNurseLogo size="lg" showTagline={false} />
          </div>
          <h2 className="font-bold text-2xl text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your NORCET mock test preparation
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@norcet.in"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Logins for easy evaluation */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block text-center uppercase tracking-wider">
            Quick 1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('candidate@norcet.in', 'Candidate@123')}
              className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@norcet.in', 'Admin@123')}
              className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
}
