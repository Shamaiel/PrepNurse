import React, { useEffect, useState } from 'react';
import { fmtTime } from '../../utils/formatters';
import { Clock } from 'lucide-react';

export default function ExamTimer({ remainingSeconds, onExpire, onTick }) {
  const [remaining, setRemaining] = useState(remainingSeconds);

  useEffect(() => {
    setRemaining(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire, onTick]);

  const isLow = remaining <= 300; // Under 5 minutes

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm transition-all ${
        isLow
          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 animate-pulse border border-rose-300 dark:border-rose-800'
          : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs'
      }`}
      title="Time Remaining"
    >
      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
      <span>{fmtTime(remaining)}</span>
    </div>
  );
}
