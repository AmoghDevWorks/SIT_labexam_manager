import React from 'react'
import SITLOGO from '../assets/sit.png'

const Header = () => {
  return (
    <div>
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 h-[72px] bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
        <img src={SITLOGO} alt="SIT Logo" className="h-12 object-contain" />
        <span className="text-[#00c9a7] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
          Academic Portal
        </span>
      </header>
    </div>
  )
}

export default Header