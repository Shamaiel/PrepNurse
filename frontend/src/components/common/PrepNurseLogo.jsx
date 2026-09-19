import React from 'react';
import PrepNurseIcon from './PrepNurseIcon';

export default function PrepNurseLogo({
  size = 'md',
  showTagline = false,
  className = '',
  iconOnly = false
}) {
  const iconSizes = {
    sm: { size: 26, cls: 'w-6 h-6' },
    md: { size: 34, cls: 'w-8 h-8' },
    lg: { size: 44, cls: 'w-11 h-11' },
    xl: { size: 54, cls: 'w-14 h-14' }
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs'
  };

  const currentIcon = iconSizes[size] || iconSizes.md;

  if (iconOnly) {
    return <PrepNurseIcon size={currentIcon.size} className={`${currentIcon.cls} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <PrepNurseIcon size={currentIcon.size} className={`${currentIcon.cls} shadow-sm shadow-purple-500/20`} />
      <div className="flex flex-col leading-none">
        <div className={`font-bold font-heading tracking-tight ${textSizes[size] || 'text-xl'}`}>
          <span className="text-slate-900 dark:text-white transition-colors duration-200">Prep</span>
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Nurse</span>
        </div>
        {showTagline && (
          <span className={`font-medium tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-0.5 ${taglineSizes[size] || 'text-[10px]'}`}>
            Practice • Prepare • Succeed
          </span>
        )}
      </div>
    </div>
  );
}
