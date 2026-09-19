import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PrepNurseLogo from './PrepNurseLogo';

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith('/exam/')) return null;

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <PrepNurseLogo size="md" showTagline={true} />
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              India's premier AIIMS & NORCET mock examination platform. Designed for nursing officers to achieve clinical mastery through data-driven practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link to="/tests" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Mock Tests
            </Link>
            <Link to="/attempts" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Attempt History
            </Link>
            <Link to="/performance" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Analytics
            </Link>
            <a
              href="https://chat.whatsapp.com/GCymmczgn6W1FBPhxc3cux?s=cl&p=a&mlu=4&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              WhatsApp Community
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} PrepNurse. All rights reserved. Practice. Prepare. Succeed.</p>
          <p>Curated for NORCET, AIIMS, ESIC, DSSSB & State Nursing Officer Exams.</p>
        </div>
      </div>
    </footer>
  );
}
