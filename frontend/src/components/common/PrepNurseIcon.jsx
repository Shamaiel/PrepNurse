import React from 'react';

export default function PrepNurseIcon({ className = 'w-8 h-8', size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pn-icon-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#172554" />
          <stop offset="50%" stopColor="#6D4AFF" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="pn-cross-grad" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0FDFA" />
        </linearGradient>
        <linearGradient id="pn-teal-acc" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      {/* Rounded Modern Squircle Badge */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#pn-icon-bg)" />
      
      {/* Subtle Inner Glow Border */}
      <rect x="3" y="3" width="42" height="42" rx="11" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />

      {/* Modern Medical Cross + Education Book Silhouette */}
      <path
        d="M21 13C21 11.8954 21.8954 11 23 11H25C26.1046 11 27 11.8954 27 13V20H34C35.1046 20 36 20.8954 36 22V24C36 25.1046 35.1046 26 34 26H27V33C27 34.1046 26.1046 35 25 35H23C21.8954 35 21 34.1046 21 33V26H14C12.8954 26 12 25.1046 12 24V22C12 20.8954 12.8954 20 14 20H21V13Z"
        fill="url(#pn-cross-grad)"
      />

      {/* Dynamic Success Checkmark / Stethoscope Arc Accent */}
      <path
        d="M17 25.5L22.5 31L33 18.5"
        stroke="#14B8A6"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
