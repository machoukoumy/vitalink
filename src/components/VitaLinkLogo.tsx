"use client";

export function VitaLinkIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blood drop */}
      <path d="M24 4C24 4 10 20 10 30C10 37.7 16.3 44 24 44C31.7 44 38 37.7 38 30C38 20 24 4 24 4Z" fill="#E30613"/>
      {/* Heart inside */}
      <path d="M24 34C24 34 16 28.5 16 24.5C16 22.5 17.5 21 19.5 21C21 21 22.3 21.8 23 23C23.3 21.8 24.5 21 26 21C28 21 29.5 22.5 29.5 24.5C29.5 28.5 24 34 24 34Z" fill="white"/>
      {/* Cross */}
      <rect x="22" y="6" width="4" height="10" rx="1.5" fill="white" opacity="0.9"/>
      <rect x="19" y="9" width="10" height="4" rx="1.5" fill="white" opacity="0.9"/>
      {/* Blue link arc */}
      <path d="M32 28C35 25 38 28 36 32C34 36 28 38 24 38" stroke="#003DA5" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function VitaLinkLogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <VitaLinkIcon size={36} />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-0">
          <span className="font-extrabold text-[17px] tracking-tight text-[#E30613]">Vita</span>
          <span className="font-extrabold text-[17px] tracking-tight text-[#003DA5]">Link</span>
        </div>
        <span className="text-[9px] text-[#6B7280] font-medium leading-tight -mt-0.5">Connecter les donneurs. Sauver des vies.</span>
      </div>
    </div>
  );
}

export function VitaLinkLogoCompact() {
  return (
    <div className="flex items-center gap-2">
      <VitaLinkIcon size={30} />
      <div>
        <div className="flex items-baseline">
          <span className="font-extrabold text-[15px] tracking-tight text-[#E30613]">Vita</span>
          <span className="font-extrabold text-[15px] tracking-tight text-[#003DA5]">Link</span>
        </div>
      </div>
    </div>
  );
}
