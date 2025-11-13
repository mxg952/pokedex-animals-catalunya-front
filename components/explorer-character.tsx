export default function ExplorerCharacter() {
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 200 280" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Explorer character illustration */}
        {/* Head */}
        <ellipse cx="100" cy="60" rx="35" ry="38" fill="#f4d4a8" />

        {/* Hair */}
        <path
          d="M 65 45 Q 65 25 85 25 Q 100 20 115 25 Q 135 25 135 45 Q 135 35 125 35 Q 115 30 100 30 Q 85 30 75 35 Q 65 35 65 45"
          fill="#4a3728"
        />

        {/* Hat */}
        <ellipse cx="100" cy="35" rx="42" ry="12" fill="#8b6f47" />
        <rect x="85" y="20" width="30" height="15" rx="3" fill="#a0826d" />
        <ellipse cx="100" cy="20" rx="20" ry="8" fill="#8b6f47" />

        {/* Eyes */}
        <circle cx="88" cy="60" r="3" fill="#2d1810" />
        <circle cx="112" cy="60" r="3" fill="#2d1810" />

        {/* Smile */}
        <path d="M 90 72 Q 100 77 110 72" stroke="#2d1810" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Body */}
        <rect x="70" y="95" width="60" height="70" rx="8" fill="#6b8e4e" />

        {/* Vest */}
        <path d="M 75 95 L 75 130 L 85 135 L 85 95 Z M 125 95 L 125 130 L 115 135 L 115 95 Z" fill="#8b7355" />

        {/* Pockets */}
        <rect x="78" y="140" width="18" height="15" rx="2" fill="#4a3728" opacity="0.3" />
        <rect x="104" y="140" width="18" height="15" rx="2" fill="#4a3728" opacity="0.3" />

        {/* Arms */}
        <rect x="50" y="100" width="20" height="55" rx="10" fill="#f4d4a8" />
        <rect x="130" y="100" width="20" height="55" rx="10" fill="#f4d4a8" />

        {/* Hands */}
        <circle cx="60" cy="160" r="10" fill="#f4d4a8" />
        <circle cx="140" cy="160" r="10" fill="#f4d4a8" />

        {/* Binoculars in hand */}
        <g transform="translate(130, 150)">
          <rect x="0" y="0" width="12" height="18" rx="2" fill="#2d1810" />
          <rect x="14" y="0" width="12" height="18" rx="2" fill="#2d1810" />
          <rect x="2" y="8" width="8" height="3" fill="#4a7c7e" />
          <rect x="16" y="8" width="8" height="3" fill="#4a7c7e" />
          <line x1="12" y1="9" x2="14" y2="9" stroke="#2d1810" strokeWidth="2" />
        </g>

        {/* Legs */}
        <rect x="78" y="165" width="18" height="60" rx="9" fill="#3d5a3d" />
        <rect x="104" y="165" width="18" height="60" rx="9" fill="#3d5a3d" />

        {/* Boots */}
        <ellipse cx="87" cy="235" rx="13" ry="18" fill="#4a3728" />
        <ellipse cx="113" cy="235" rx="13" ry="18" fill="#4a3728" />

        {/* Backpack */}
        <rect x="125" y="100" width="25" height="45" rx="4" fill="#c75146" />
        <rect x="130" y="105" width="15" height="8" rx="2" fill="#8b3a2f" opacity="0.5" />
        <line x1="137" y1="95" x2="137" y2="100" stroke="#8b3a2f" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
