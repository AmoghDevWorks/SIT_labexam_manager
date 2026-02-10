import React, { useState } from "react";
import Subject from "./Subject";
import SITLOGO from '../assets/sit.png';

const App = () => {
  // Store as string so backspace/clearing works naturally
  const [inputVal, setInputVal] = useState("1");

  const subjectCount = Math.max(1, parseInt(inputVal, 10) || 0);

  const handleChange = (e) => {
    const raw = e.target.value;
    // Allow empty string (so backspace clears the field)
    if (raw === "" || /^\d+$/.test(raw)) {
      setInputVal(raw);
    }
  };

  const handleBlur = () => {
    // Snap back to at least "1" if the field is empty or 0 on blur
    if (!inputVal || parseInt(inputVal, 10) < 1) {
      setInputVal("1");
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 h-[72px] bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
        <img src={SITLOGO} alt="SIT Logo" className="h-12 object-contain" />
        <span className="text-[#00c9a7] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
          Academic Portal
        </span>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-12 pb-16">

        {/* Control Card */}
        <div className="flex flex-wrap items-center gap-8 bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl px-9 py-8 mb-12 shadow-[0_8px_32px_rgba(15,31,61,0.12)]">
          <div className="flex-1 min-w-0">
            <h1 className="text-[clamp(22px,4vw,30px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
              Subject Manager
            </h1>
            <p className="text-sm text-[#6b85a3] mt-1 font-light">
              Set the number of subjects to display below
            </p>
          </div>

          <div className="flex items-center gap-4 ml-auto flex-wrap">
            <span className="text-xs font-semibold text-[#6b85a3] uppercase tracking-wider whitespace-nowrap font-[Syne,sans-serif]">
              Subjects
            </span>
            <input
              type="number"
              min="1"
              value={inputVal}
              onChange={handleChange}
              onBlur={handleBlur}
              className="
                w-[100px] px-4 py-3 text-center text-[22px] font-bold text-[#0f1f3d]
                bg-sky-50 border-2 border-[#00c9a7]/25 rounded-xl outline-none
                transition-all duration-200
                focus:border-[#00c9a7] focus:shadow-[0_0_0_4px_rgba(0,201,167,0.15)]
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                font-[Syne,sans-serif]
              "
            />
          </div>
        </div>

        {/* Subjects List */}
        <div className="flex flex-col">
          {Array.from({ length: subjectCount }, (_, i) => (
            <React.Fragment key={i}>
              <div
                className="animate-[fadeSlideIn_0.35s_ease_both]"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <Subject />
              </div>

              {i < subjectCount - 1 && (
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00c9a7]/40 to-transparent" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] opacity-60" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00c9a7]/40 to-transparent" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="flex flex-wrap items-center justify-between gap-2 px-10 py-5 bg-gradient-to-r from-[#0f1f3d] to-[#162847]">
        <span className="text-[13px] text-white/50">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#00c9a7] font-semibold">SIT</span> — All rights reserved.
        </span>
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/25 font-[Syne,sans-serif]">
          Siddaganga Institute of Technology
        </span>
      </footer>

      {/* Keyframe for fadeSlideIn — Tailwind can't generate arbitrary @keyframes, so we inject it once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;