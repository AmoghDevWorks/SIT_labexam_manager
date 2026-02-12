import React from 'react'
import SITLOGO from '../assets/sit.png'

const Header = () => {
  return (
    <div>
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 h-[60px] sm:h-[68px] md:h-[72px] bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          <img src={SITLOGO} alt="SIT Logo" className="h-9 sm:h-10 md:h-12 object-contain shrink-0" />
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-wide font-[Syne,sans-serif] leading-tight truncate">
              Siddaganga Institute of Technology
            </span>
            <span className="text-[#00c9a7] text-[9px] sm:text-[10px] md:text-xs font-medium tracking-wide font-[Syne,sans-serif] leading-tight truncate hidden sm:block">
              Department of Computer Science and Engineering
            </span>
            <span className="text-[#00c9a7] text-[9px] font-medium tracking-wide font-[Syne,sans-serif] leading-tight truncate sm:hidden">
              Dept. of Computer Science and Engineering
            </span>
          </div>
        </div>
        <span className="text-[#00c9a7] text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif] ml-2 shrink-0">
          <span className="hidden sm:inline">Academic Portal</span>
          <span className="sm:hidden">Portal</span>
        </span>
      </header>
    </div>
  )
}

export default Header