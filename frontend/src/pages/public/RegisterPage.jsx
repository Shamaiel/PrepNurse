import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';
import PrepNurseLogo from '../../components/common/PrepNurseLogo';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password, role, adminSecret });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 sm:p-9 shadow-xl shadow-purple-500/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <PrepNurseLogo size="lg" showTagline={false} />
          </div>
          <h2 className="font-bold text-2xl text-slate-900 dark:text-white">Create Aspirant Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join thousands of nursing officers preparing for AIIMS NORCET
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Candidate Name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password (Min 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm transition-all"
            />
          </div>

          <div className="pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  role === 'candidate'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                Nursing Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {role === 'admin' && (
            <div className="animate-fade-in space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter NORCET_ADMIN_2026"
                className="w-full px-4 py-3 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
              <span className="text-[11px] text-slate-500">
                Default key: <code className="font-mono font-bold text-teal-700 dark:text-teal-300">NORCET_ADMIN_2026</code>
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
