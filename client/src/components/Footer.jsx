import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="flex flex-wrap items-center justify-between gap-2 px-10 py-5 bg-gradient-to-r from-[#0f1f3d] to-[#162847]">
        <span className="text-[13px] text-white/50">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#00c9a7] font-semibold">SIT</span> — All rights reserved.
        </span>
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/25 font-[Syne,sans-serif]">
          Siddaganga Institute of Technology
        </span>
      </footer>
    </div>
  )
}

export default Footer