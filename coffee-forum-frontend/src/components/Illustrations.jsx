// Hand-drawn SVG illustrations in the site's toon style (thick ink
// outlines, warm palette, flat fills) so pages don't depend on external
// image assets.

function Bean({ x, y, scale = 1, rotate = 0, fill = "#6f4e37" }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="9" ry="13" fill={fill} stroke="#2b2118" strokeWidth="2" />
      <path d="M0 -11 Q 3 0 0 11" fill="none" stroke="#2b2118" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

export function CupSteamIllustration({ className }) {
  return (
    <svg viewBox="0 0 260 220" className={className} aria-hidden="true">
      <ellipse cx="130" cy="188" rx="90" ry="14" fill="#f0e6d8" stroke="#2b2118" strokeWidth="3" />
      <path
        d="M55 110 h150 l-10 55 a20 20 0 0 1 -20 18 h-90 a20 20 0 0 1 -20 -18 Z"
        fill="#6f4e37"
        stroke="#2b2118"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M62 116 h136 l-2 12 h-132 Z" fill="#2b2118" opacity="0.35" />
      <path
        d="M205 122 q28 -4 28 20 q0 24 -30 24"
        fill="none"
        stroke="#2b2118"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M95 60 q-10 20 5 32 q-12 10 0 26" fill="none" stroke="#e07b39" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <path d="M130 50 q-10 20 5 32 q-12 10 0 26" fill="none" stroke="#e07b39" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M165 60 q-10 20 5 32 q-12 10 0 26" fill="none" stroke="#e07b39" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <Bean x="35" y="175" scale="1.1" rotate="-20" />
      <Bean x="228" y="180" scale="0.9" rotate="15" fill="#8a6a5a" />
      <Bean x="20" y="150" scale="0.7" rotate="40" fill="#8a6a5a" />
    </svg>
  );
}

export function BrewMethodsIcon({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M25 30 h50 l-20 34 v10 h-10 v-10 Z" fill="#f0e6d8" stroke="#2b2118" strokeWidth="3" strokeLinejoin="round" />
      <rect x="30" y="20" width="40" height="10" rx="3" fill="#6f4e37" stroke="#2b2118" strokeWidth="3" />
      <path d="M38 74 h24 l4 14 a4 4 0 0 1 -4 5 h-24 a4 4 0 0 1 -4 -5 Z" fill="#faf7f2" stroke="#2b2118" strokeWidth="3" strokeLinejoin="round" />
      <path d="M46 46 q4 6 0 10" fill="none" stroke="#e07b39" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 46 q4 6 0 10" fill="none" stroke="#e07b39" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BeanBagIcon({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M30 40 q-4 -18 20 -18 q24 0 20 18 l6 40 a10 10 0 0 1 -10 12 h-32 a10 10 0 0 1 -10 -12 Z"
        fill="#8a6a5a"
        stroke="#2b2118"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M38 40 q12 -10 24 0" fill="none" stroke="#2b2118" strokeWidth="2.5" strokeLinecap="round" />
      <Bean x="50" y="65" scale="1.4" fill="#4a2c2a" />
    </svg>
  );
}

export function GrinderIcon({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M35 24 h30 l6 20 h-42 Z" fill="#f0e6d8" stroke="#2b2118" strokeWidth="3" strokeLinejoin="round" />
      <rect x="28" y="44" width="44" height="38" rx="6" fill="#6f4e37" stroke="#2b2118" strokeWidth="3" />
      <circle cx="50" cy="63" r="9" fill="#faf7f2" stroke="#2b2118" strokeWidth="2.5" />
      <path d="M50 63 h16" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />
      <circle cx="68" cy="63" r="4" fill="#e07b39" stroke="#2b2118" strokeWidth="2" />
    </svg>
  );
}

export function GoatOriginIllustration({ className }) {
  return (
    <svg viewBox="0 0 240 190" className={className} aria-hidden="true">
      <ellipse cx="90" cy="170" rx="95" ry="12" fill="#e9dcc4" opacity="0.6" />
      <path d="M45 95 q-15 -10 -6 -24 q10 -10 20 4" fill="#e5d5bc" stroke="#2b2118" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="70" cy="120" rx="46" ry="32" fill="#e5d5bc" stroke="#2b2118" strokeWidth="3" />
      <circle cx="112" cy="92" r="22" fill="#e5d5bc" stroke="#2b2118" strokeWidth="3" />
      <path d="M100 76 q-4 -14 8 -16 q4 8 -2 16" fill="#cbb89a" stroke="#2b2118" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M120 76 q4 -14 -8 -16 q-4 8 2 16" fill="#cbb89a" stroke="#2b2118" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="120" cy="90" r="2.5" fill="#2b2118" />
      <path d="M30 130 l-6 26 M50 138 l-4 26 M92 138 l4 26 M108 132 l6 26" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />
      <path d="M150 60 q6 -30 30 -40" fill="none" stroke="#7fa876" strokeWidth="4" strokeLinecap="round" />
      <path d="M164 40 q10 -6 8 -16" fill="none" stroke="#7fa876" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M178 26 q10 -4 10 -14" fill="none" stroke="#7fa876" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="171" cy="26" rx="8" ry="10" fill="#7fa876" stroke="#2b2118" strokeWidth="2" transform="rotate(-30 171 26)" />
      <ellipse cx="188" cy="14" rx="8" ry="10" fill="#7fa876" stroke="#2b2118" strokeWidth="2" transform="rotate(-20 188 14)" />
      <Bean x="160" y="46" scale="0.8" rotate="10" fill="#b0402f" />
      <Bean x="176" y="34" scale="0.7" rotate="-15" fill="#b0402f" />
      <Bean x="190" y="24" scale="0.8" rotate="20" fill="#b0402f" />
    </svg>
  );
}

export function SunDryingIllustration({ className }) {
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden="true">
      <circle cx="190" cy="40" r="22" fill="#e07b39" stroke="#2b2118" strokeWidth="3" />
      <g stroke="#e07b39" strokeWidth="4" strokeLinecap="round">
        <path d="M190 8 v-12" />
        <path d="M218 18 l8 -8" />
        <path d="M228 40 h12" />
        <path d="M218 62 l8 8" />
      </g>
      <rect x="20" y="110" width="170" height="14" rx="4" fill="#8a6a5a" stroke="#2b2118" strokeWidth="3" />
      <path d="M30 124 l-8 30 M180 124 l8 30" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 124 l-6 30 M170 124 l6 30" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />
      {[35, 58, 81, 104, 127, 150, 173].map((cx, i) => (
        <circle key={cx} cx={cx} cy={102 - (i % 2 === 0 ? 4 : 0)} r="8" fill="#b0402f" stroke="#2b2118" strokeWidth="2.5" />
      ))}
    </svg>
  );
}
