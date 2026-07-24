import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSub?: boolean;
}

export default function Logo({ className = '', size = 'md', showSub = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-20 w-auto',
    lg: 'h-32 w-auto',
    xl: 'h-48 w-auto'
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* SVG Monogram & Diamond */}
      <svg
        className={`${sizeClasses[size]} filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.15)]`}
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Gradient Definition */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA6B" />
            <stop offset="25%" stopColor="#C5A059" />
            <stop offset="50%" stopColor="#F9E4B7" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>

          {/* Platinum / Extra-Shine Gradient */}
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F9E4B7" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A640F" />
          </linearGradient>

          {/* Soft Shadow Filter for Elegance */}
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Diamond on top */}
        <g id="diamond-top">
          {/* Outer diamond outline */}
          <path
            d="M100 20 L118 35 L100 50 L82 35 Z"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Facet lines */}
          <path
            d="M82 35 L118 35"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          <path
            d="M100 20 L100 50"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          <path
            d="M91 27.5 L100 35 L109 27.5"
            stroke="url(#goldGradient)"
            strokeWidth="1.2"
          />
          <path
            d="M91 42.5 L100 35 L109 42.5"
            stroke="url(#goldGradient)"
            strokeWidth="1.2"
          />

          {/* Sparkle glint on top-right of diamond */}
          <path
            d="M118 25 L121 35 L131 38 L121 41 L118 51 L115 41 L105 38 L115 35 Z"
            fill="url(#shineGradient)"
            opacity="0.9"
            className="animate-pulse"
          />
          {/* Center core glow for sparkle */}
          <circle cx="118" cy="38" r="2" fill="#FFFFFF" />
        </g>

        {/* Stylized Monogram "BJ" */}
        <g id="monogram-bj" transform="translate(10, 20)">
          {/* Letter B */}
          <path
            d="M75 40 H105 C118 40, 122 55, 110 65 C125 73, 118 95, 95 95 H75 V40 Z"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M75 66 H95"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
          />
          <line
            x1="75"
            y1="40"
            x2="75"
            y2="95"
            stroke="url(#goldGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Intertwined Script Letter J */}
          <path
            d="M90 35 V85 C90 102, 60 110, 48 95 C42 88, 52 82, 58 88 C68 98, 82 92, 82 85 V35"
            stroke="url(#shineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sleek top crossbar for J */}
          <path
            d="M80 35 H100"
            stroke="url(#shineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Typography Section "BODIN JÓIAS" */}
      {showSub && (
        <div className="mt-2 flex flex-col items-center">
          <h1
            className="text-2xl md:text-3xl font-serif tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-[#DFBA6B] via-[#F9E4B7] to-[#AA7C11] font-medium uppercase"
            style={{ fontFamily: "Playfair Display, Cormorant Garamond, Georgia, serif" }}
          >
            Bodin
          </h1>
          
          <div className="flex items-center gap-3 mt-1.5 w-full max-w-[200px]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-light text-[#E5D2A4]">
              Jóias
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {/* Lower flourish ornament */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="w-5 h-[0.5px] bg-[#D4AF37]/40" />
            <svg className="w-2.5 h-2.5 text-[#DFBA6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 L12 L10 10 Z"
                fill="currentColor"
              />
            </svg>
            <div className="w-5 h-[0.5px] bg-[#D4AF37]/40" />
          </div>
        </div>
      )}
    </div>
  );
}
