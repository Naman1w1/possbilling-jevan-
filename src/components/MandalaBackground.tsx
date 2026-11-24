import React from 'react';
import crestLogo from '../assets/crest-watermark.png';

export const MandalaBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-[0.035] select-none">
      {/* Center Grand Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={crestLogo}
          alt=""
          className="w-[32rem] sm:w-[42rem] md:w-[50rem] max-w-[85vw] max-h-[85vh] object-contain select-none pointer-events-none"
        />
      </div>

      {/* Top right logo accent (replacing top-right circle pattern) */}
      <img
        src={crestLogo}
        alt=""
        className="absolute -top-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 object-contain select-none pointer-events-none"
      />

      {/* Bottom right logo flourish (replacing bottom-right circle pattern) */}
      <img
        src={crestLogo}
        alt=""
        className="absolute -bottom-24 -right-24 w-96 h-96 sm:w-[30rem] sm:h-[30rem] object-contain select-none pointer-events-none"
      />

      {/* Bottom left subtle logo flourish (replacing bottom-left circle pattern) */}
      <img
        src={crestLogo}
        alt=""
        className="absolute -bottom-16 -left-16 w-72 h-72 sm:w-80 sm:h-80 object-contain select-none pointer-events-none"
      />
    </div>
  );
};

