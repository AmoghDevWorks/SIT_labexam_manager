import React, { useState, useCallback } from "react";
import Subject from "./Subject";
import { downloadExcel, downloadPDF } from "../../utils/downloadUtils";

const Hero = () => {
  const [inputVal, setInputVal] = useState("1");
  const subjectCount = Math.max(1, parseInt(inputVal, 10) || 0);

  // Store all subjects' data keyed by index
  const [subjectsData, setSubjectsData] = useState({});

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw === "" || /^\d+$/.test(raw)) setInputVal(raw);
  };

  const handleBlur = () => {
    if (!inputVal || parseInt(inputVal, 10) < 1) setInputVal("1");
  };

  // Called by each Subject whenever its data changes
  const handleSubjectChange = useCallback((index, data) => {
    setSubjectsData((prev) => ({ ...prev, [index]: data }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50">

      {/* ── Main ── */}
      <main className="flex-1 w-full max-w-[960px] mx-auto px-6 py-12 pb-16">

        {/* Control Card */}
        <div className="flex flex-wrap items-center gap-8 bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl px-9 py-8 mb-12 shadow-[0_8px_32px_rgba(15,31,61,0.12)]">
          <div className="flex-1 min-w-0">
            <h1 className="text-[clamp(22px,4vw,30px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
              Subject Manager
            </h1>
            <p className="text-sm text-[#6b85a3] mt-1 font-light">
              Fill in all subjects, then export the Panel of Examiners sheet
            </p>
          </div>

          <div className="flex items-center gap-4 ml-auto flex-wrap">
            <span className="text-xs font-semibold text-[#6b85a3] uppercase tracking-wider whitespace-nowrap font-[Syne,sans-serif]">
              Total Subjects
            </span>
            <div className="flex items-center border-2 border-[#00c9a7]/25 rounded-xl overflow-hidden bg-sky-50">
              <button
                type="button"
                onClick={() => {
                  const num = Math.max(1, parseInt(inputVal, 10) || 0);
                  setInputVal(String(Math.max(1, num - 1)));
                }}
                className="w-10 h-12 flex items-center justify-center text-[#00c9a7] hover:bg-[#00c9a7]/10 transition-colors text-xl font-bold"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={inputVal}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[60px] px-2 text-center text-[22px] font-bold text-[#0f1f3d] bg-transparent outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-[Syne,sans-serif]"
              />
              <button
                type="button"
                onClick={() => {
                  const num = parseInt(inputVal, 10) || 0;
                  setInputVal(String(num + 1));
                }}
                className="w-10 h-12 flex items-center justify-center text-[#00c9a7] hover:bg-[#00c9a7]/10 transition-colors text-xl font-bold"
              >
                +
              </button>
            </div>
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
                <Subject index={i} onChange={handleSubjectChange} />
              </div>

              {i < subjectCount - 1 && (
                <div className="flex items-center gap-4 py-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00c9a7]/40 to-transparent" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] opacity-60" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00c9a7]/40 to-transparent" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Download Buttons ── */}
        <div className="mt-14 flex justify-center gap-4 flex-wrap">
          {/* Excel Download Button */}
          <button
            onClick={() => downloadExcel(subjectsData, subjectCount)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0f1f3d] to-[#162847] text-white rounded-2xl shadow-[0_8px_32px_rgba(15,31,61,0.25)] hover:shadow-[0_12px_40px_rgba(0,201,167,0.2)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7]/0 via-[#00c9a7]/10 to-[#00c9a7]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            {/* Icon */}
            <span className="relative w-10 h-10 rounded-xl bg-[#00c9a7]/15 border border-[#00c9a7]/30 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00c9a7" strokeWidth="1.5" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="#00c9a7" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 13h8M8 17h5" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 10v4l2-2" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>

            <span className="relative">
              <span className="block text-[15px] font-bold tracking-wide font-[Syne,sans-serif]">
                Download Excel
              </span>
              <span className="block text-[10px] text-[#00c9a7]/70 tracking-widest uppercase mt-0.5 font-[DM_Sans,sans-serif]">
                Panel of Examiners · .xlsx
              </span>
            </span>

            <svg
              className="relative w-4 h-4 text-[#00c9a7] ml-2 group-hover:translate-x-1 transition-transform duration-200"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          {/* PDF Download Button */}
          <button
            onClick={() => downloadPDF(subjectsData, subjectCount)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-2xl shadow-[0_8px_32px_rgba(0,201,167,0.25)] hover:shadow-[0_12px_40px_rgba(0,201,167,0.35)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            {/* Icon */}
            <span className="relative w-10 h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 13h6M9 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>

            <span className="relative">
              <span className="block text-[15px] font-bold tracking-wide font-[Syne,sans-serif]">
                Download PDF
              </span>
              <span className="block text-[10px] text-white/70 tracking-widest uppercase mt-0.5 font-[DM_Sans,sans-serif]">
                Panel of Examiners · .pdf
              </span>
            </span>

            <svg
              className="relative w-4 h-4 text-white ml-2 group-hover:translate-x-1 transition-transform duration-200"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

      </main>

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

export default Hero;