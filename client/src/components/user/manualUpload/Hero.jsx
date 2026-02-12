import React, { useState, useCallback } from "react";
import Subject from "./Subject";
import { validateData } from "../../utils/downloadUtils";
import { useUser } from "../../utils/userContext";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Hero = () => {
  const { userUid } = useUser(); // Get logged-in examiner ID
  const [inputVal, setInputVal] = useState("1");
  const subjectCount = Math.max(1, parseInt(inputVal, 10) || 0);

  // Store all subjects' data keyed by index
  const [subjectsData, setSubjectsData] = useState({});

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Save exam data to backend
  const handleSaveExamData = async () => {
    // Check if user is logged in
    if (!userUid) {
      alert('❌ Please log in to save exam data');
      return;
    }

    // Validate all data first
    const errors = validateData(subjectsData, subjectCount);
    
    if (errors.length > 0) {
      alert(`Please fill all required fields:\n\n${errors.join('\n')}`);
      return;
    }

    try {
      setSaving(true);
      setSaveSuccess(false);

      // Convert subjectsData object to array
      const subjectsArray = Object.values(subjectsData).slice(0, subjectCount);

      // Save each subject as a separate exam data entry
      const savePromises = subjectsArray.map(subject => {
        const examDataEntry = {
          semester: subject.semester,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          studentsEnrolled: parseInt(subject.studentsEnrolled, 10),
          verification: subject.verification,
          internals: subject.internals,
          externals: subject.externals.map(ext => ({
            ...ext,
            yearsOfExperience: parseInt(ext.yearsOfExperience, 10)
          }))
        };
        
        return axios.post(`${BACKEND_URL}/api/exam-data`, examDataEntry);
      });

      const responses = await Promise.all(savePromises);
      
      console.log('Exam data saved successfully:', responses.map(r => r.data));
      setSaveSuccess(true);
      
      // Show success message
      alert(`✅ Successfully saved ${subjectsArray.length} subject(s) data!`);

      // Reset success state after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving exam data:', error);
      alert(`❌ Error saving exam data: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

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
              Fill in all subjects and save the Panel of Examiners data
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

        {/* ── Save Button ── */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={handleSaveExamData}
            disabled={saving}
            className={`group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-2xl shadow-[0_8px_32px_rgba(0,201,167,0.25)] hover:shadow-[0_12px_40px_rgba(0,201,167,0.35)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            } ${
              saveSuccess ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : ''
            }`}
          >
            {/* Shimmer */}
            {!saving && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}

            {/* Icon */}
            <span className="relative w-12 h-12 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
              {saving ? (
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : saveSuccess ? (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <polyline points="17 21 17 13 7 13 7 21" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <polyline points="7 3 7 8 15 8" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              )}
            </span>

            <span className="relative">
              <span className="block text-[16px] font-bold tracking-wide font-[Syne,sans-serif]">
                {saving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : 'Save Exam Data'}
              </span>
              <span className="block text-[10px] text-white/70 tracking-widest uppercase mt-0.5 font-[DM_Sans,sans-serif]">
                {saving ? 'Please wait' : saveSuccess ? 'Data stored successfully' : 'Store Panel of Examiners'}
              </span>
            </span>

            {!saving && !saveSuccess && (
              <svg
                className="relative w-5 h-5 text-white ml-2 group-hover:translate-x-1 transition-transform duration-200"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
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