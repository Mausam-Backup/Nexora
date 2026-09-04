import React from 'react';

/**
 * Custom SVG Fillet Corners that create seamless smooth concave curves
 * connecting the dark section and the white card in the split-panel design.
 */
interface SvgCornerProps {
  className?: string;
  fillColor?: string;
}

export const SvgConcaveTop: React.FC<SvgCornerProps> = ({ 
  className = "", 
  fillColor = "#FFFFFF" 
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Concave fillet transitioning from top flat edge into the vertical curve */}
      <path
        d="M48 0C21.4903 0 0 21.4903 0 48V0H48Z"
        fill={fillColor}
      />
    </svg>
  );
};

export const SvgConcaveBottom: React.FC<SvgCornerProps> = ({ 
  className = "", 
  fillColor = "#FFFFFF" 
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Concave fillet transitioning from bottom flat edge into the vertical curve */}
      <path
        d="M48 48C21.4903 48 0 26.5097 0 0V48H48Z"
        fill={fillColor}
      />
    </svg>
  );
};

export const SvgConcentricRings: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 600 600"
      className={`pointer-events-none select-none opacity-25 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="300" cy="300" r="100" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      <circle cx="300" cy="300" r="160" stroke="#FFFFFF" strokeWidth="1" opacity="0.25" />
      <circle cx="300" cy="300" r="230" stroke="#FFFFFF" strokeWidth="1" opacity="0.18" />
      <circle cx="300" cy="300" r="290" stroke="#FFFFFF" strokeWidth="1" opacity="0.1" />
    </svg>
  );
};

export const PayoneerRingLogo: React.FC<{ className?: string; size?: number }> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
    >
      <circle
        cx="16"
        cy="16"
        r="11.5"
        stroke="url(#nexora_brand_ring_gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="nexora_brand_ring_gradient"
          x1="4"
          y1="5"
          x2="28"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7A00" />
          <stop offset="0.35" stopColor="#FF2D55" />
          <stop offset="0.7" stopColor="#AF52DE" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
