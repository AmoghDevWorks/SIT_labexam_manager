import React, { useState, useCallback } from "react";
import Subject from "./Subject";
import SITLOGO from '../assets/sit.png';
import * as XLSX from 'xlsx';

const App = () => {
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

  // ── Excel Export ──────────────────────────────────────────
  const downloadExcel = () => {
    // Validation: Check if all required fields are filled
    const errors = [];
    
    for (let i = 0; i < subjectCount; i++) {
      const d = subjectsData[i] || {};
      const subjectLabel = `Subject #${i + 1}`;
      
      // Check subject details
      if (!d.subjectName || d.subjectName.trim() === "") {
        errors.push(`${subjectLabel}: Subject Name is required`);
      }
      if (!d.subjectCode || d.subjectCode.trim() === "") {
        errors.push(`${subjectLabel}: Subject Code is required`);
      }
      if (!d.semester || d.semester.trim() === "") {
        errors.push(`${subjectLabel}: Semester is required`);
      }
      if (!d.studentsEnrolled || d.studentsEnrolled.trim() === "") {
        errors.push(`${subjectLabel}: Number of Students Enrolled is required`);
      }
      
      // Check internal examiners
      const internals = d.internals || [];
      internals.forEach((internal, idx) => {
        if (!internal.name || internal.name.trim() === "") {
          errors.push(`${subjectLabel} - Internal Examiner #${idx + 1}: Name is required`);
        }
      });
      
      // Check external examiners
      const externals = d.externals || [];
      externals.forEach((external, idx) => {
        if (!external.name || external.name.trim() === "") {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Name is required`);
        }
        if (!external.address || external.address.trim() === "") {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Address is required`);
        }
        if (!external.contact || external.contact.trim() === "") {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Contact Number is required`);
        }
        if (!external.email || external.email.trim() === "") {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Email ID is required`);
        }
        if (!external.verification || external.verification.trim() === "") {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Verification is required`);
        }
      });
    }
    
    // If there are errors, show alert and stop
    if (errors.length > 0) {
      alert(`Please fill all required fields:\n\n${errors.join('\n')}`);
      return;
    }
    
    const wb = XLSX.utils.book_new();
    const wsData = [];

    // Title row
    wsData.push([
      "Panel of Examiners for ODD Semester (2025-2026) - December 2025 - January 2026",
      "", "", "", "", "", "", "", "", "", ""
    ]);

    // Subtitle row - "External Examiner" should only appear above the external examiner columns
    wsData.push([
      "", "", "", "", "", "",
      "External Examiner",
      "", "", "", ""
    ]);

    // Header row
    wsData.push([
      "Sl No",
      "Subject",
      "Subject Code",
      "Semester",
      "Number of Students",
      "Internal Examiner",
      "Name",
      "Address",
      "Contact Number",
      "Email ID",
      "Permission to use already existing Question Paper with same code (Yes / No)",
    ]);

    let slNo = 1;

    for (let i = 0; i < subjectCount; i++) {
      const d = subjectsData[i] || {};
      const internals = d.internals || [];
      const externals = d.externals || [];

      // Internal examiners: just the name
      const internalText = internals
        .map((ie) => ie.name)
        .filter(Boolean)
        .join("\n") || "";

      const maxRows = Math.max(externals.length, 1);

      for (let r = 0; r < maxRows; r++) {
        const ext = externals[r] || {};
        const isFirstRow = r === 0;

        wsData.push([
          isFirstRow ? slNo : "",
          isFirstRow ? (d.subjectName || "") : "",
          isFirstRow ? (d.subjectCode || "") : "",
          isFirstRow ? (d.semester ? `Semester ${d.semester}` : "") : "",
          isFirstRow ? (d.studentsEnrolled || "") : "",
          isFirstRow ? internalText : "",
          ext.name || "",
          ext.address || "",
          ext.contact || "",
          ext.email || "",
          ext.verification || "",
        ]);
      }

      slNo++;
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws["!cols"] = [
      { wch: 8 },
      { wch: 12 },
      { wch: 14 },
      { wch: 12 },
      { wch: 20 },
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
      { wch: 12 },
      { wch: 38 },
    ];

    // Merge cells array
    const merges = [];
    
    // Merge title row across all 11 columns (A1:K1)
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } });
    
    // Merge "External Examiner" subtitle across columns 6-10 (G2:K2) - Name, Address, Contact, Email, Permission
    merges.push({ s: { r: 1, c: 6 }, e: { r: 1, c: 10 } });

    // Merge cells for each subject (for repeated rows)
    let currentRow = 3; // Start after headers
    for (let i = 0; i < subjectCount; i++) {
      const d = subjectsData[i] || {};
      const externals = d.externals || [];
      const maxRows = Math.max(externals.length, 1);

      if (maxRows > 1) {
        // Merge Sl. No. (column 0)
        merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow + maxRows - 1, c: 0 } });
        // Merge Subject (column 1)
        merges.push({ s: { r: currentRow, c: 1 }, e: { r: currentRow + maxRows - 1, c: 1 } });
        // Merge Sub Code (column 2)
        merges.push({ s: { r: currentRow, c: 2 }, e: { r: currentRow + maxRows - 1, c: 2 } });
        // Merge Semester (column 3)
        merges.push({ s: { r: currentRow, c: 3 }, e: { r: currentRow + maxRows - 1, c: 3 } });
        // Merge No. of Students (column 4)
        merges.push({ s: { r: currentRow, c: 4 }, e: { r: currentRow + maxRows - 1, c: 4 } });
        // Merge Internal Examiners (column 5)
        merges.push({ s: { r: currentRow, c: 5 }, e: { r: currentRow + maxRows - 1, c: 5 } });
      }
      currentRow += maxRows;
    }

    ws["!merges"] = merges;

    // Apply center alignment and borders to all cells
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        
        // Create cell if it doesn't exist
        if (!ws[cellAddress]) {
          ws[cellAddress] = { t: 's', v: '' };
        }

        ws[cellAddress].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          },
          font: R === 0 || R === 1 ? { bold: true, sz: 12 } : R === 2 ? { bold: true } : {}
        };
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Panel of Examiners");
    XLSX.writeFile(wb, "Panel_of_Examiners.xlsx");
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
              Subjects
            </span>
            <input
              type="number"
              min="1"
              value={inputVal}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-[100px] px-4 py-3 text-center text-[22px] font-bold text-[#0f1f3d] bg-sky-50 border-2 border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_4px_rgba(0,201,167,0.15)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-[Syne,sans-serif]"
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

        {/* ── Download Button ── */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={downloadExcel}
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
              <span className="block text-[10px] font-medium text-[#00c9a7]/70 tracking-widest uppercase mt-0.5 font-[DM_Sans,sans-serif]">
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