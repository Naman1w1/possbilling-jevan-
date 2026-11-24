import React from 'react';

export const MandalaBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-[0.035] select-none">
      {/* Top right mandala accent */}
      <svg
        className="absolute -top-32 -right-32 w-96 h-96 text-maroon-900"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d="M100,100 C105,75 115,55 100,40 C85,55 95,75 100,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
      </svg>

      {/* Bottom right decorative flourish matching the original screenshot */}
      <svg
        className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] text-maroon-900"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="5 3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        {Array.from({ length: 24 }).map((_, i) => (
          <path
            key={i}
            d="M100,100 C110,65 125,50 100,25 C75,50 90,65 100,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
      </svg>

      {/* Bottom left subtle flourish */}
      <svg
        className="absolute -bottom-20 -left-20 w-80 h-80 text-maroon-900"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M100,100 C108,70 120,60 100,35 C80,60 92,70 100,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
      </svg>
    </div>
  );
};

