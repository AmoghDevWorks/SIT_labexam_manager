import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../utils/adminContext';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ManageSubjectEntry = () => {
  const { adminUid } = useAdmin();
  const navigate = useNavigate();
  const [allowSubjectEntry, setAllowSubjectEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    if (!adminUid) navigate('/');
  }, [adminUid, navigate]);

  // Fetch current status
  useEffect(() => {
    if (!adminUid) return;
    fetchStatus();
  }, [adminUid]);

  const fetchStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/manage-subject-entry`);
      setAllowSubjectEntry(response.data.allowSubjectEntry);
    } catch (err) {
      if (err.response?.status === 404) {
        // Configuration doesn't exist, create it with default false
        try {
          const createResponse = await axios.post(`${BACKEND_URL}/api/manage-subject-entry`, {
            allowSubjectEntry: false
          });
          setAllowSubjectEntry(createResponse.data.data.allowSubjectEntry);
        } catch (createErr) {
          setError('Failed to initialize configuration');
        }
      } else {
        setError(err.response?.data?.message || 'Failed to load configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const response = await axios.patch(`${BACKEND_URL}/api/manage-subject-entry/toggle`);
      setAllowSubjectEntry(response.data.data.allowSubjectEntry);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle entry status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setToggling(false);
    }
  };

  if (!adminUid) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pageIn {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50 font-[DM_Sans,sans-serif]">
        
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 md:px-8 h-[60px] sm:h-[68px] md:h-[72px] bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#6b85a3] hover:text-[#00c9a7] hover:bg-white/5 transition-all duration-150"
            >
              <svg viewBox="0 0 18 18" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="w-px h-4 sm:h-5 bg-white/10" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00c9a7]/15 border border-[#00c9a7]/30 flex items-center justify-center">
              <svg viewBox="0 0 18 18" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                <path d="M9 2v14M2 9h14" stroke="#00c9a7" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="9" cy="9" r="7" stroke="#00c9a7" strokeWidth="1.4"/>
              </svg>
            </div>
            <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-wide leading-tight font-[Syne,sans-serif]">
              Subject Entry Control
            </span>
          </div>
          <span className="text-[#00c9a7] text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
            <span className="hidden sm:inline">Admin Portal</span>
            <span className="sm:hidden">Portal</span>
          </span>
        </header>

        {/* Body */}
        <main
          className="w-full max-w-3xl mx-auto px-6 py-10"
          style={{ animation: "pageIn 0.3s ease both" }}
        >
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
              Subject Entry Control
            </h1>
            <p className="text-sm text-[#6b85a3] mt-1 font-light">
              Enable or disable subject data entry for internal examiners
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-rose-700 font-[DM_Sans,sans-serif]">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#00c9a7]/30 border-t-[#00c9a7] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#6b85a3] font-[DM_Sans,sans-serif]">Loading configuration...</p>
            </div>
          ) : (
            /* Simple Control Panel */
            <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl p-8 shadow-[0_8px_32px_rgba(15,31,61,0.12)]">
              
              {/* Toggle Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-[18px] font-bold text-[#1a2e4a] mb-1 font-[Syne,sans-serif]">
                    Allow Subject Entry
                  </h2>
                  <p className="text-[13px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
                    {allowSubjectEntry 
                      ? 'Internal examiners can submit subject data'
                      : 'Internal examiners cannot submit subject data'}
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00c9a7] ${
                    toggling 
                      ? 'opacity-50 cursor-not-allowed' 
                      : allowSubjectEntry 
                      ? 'bg-[#00c9a7]' 
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                      allowSubjectEntry ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Status Message */}
              <div className={`rounded-xl p-4 border ${
                allowSubjectEntry 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  {allowSubjectEntry ? (
                    <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                  <p className={`text-[13px] leading-relaxed font-[DM_Sans,sans-serif] ${
                    allowSubjectEntry ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {allowSubjectEntry 
                      ? 'Subject entry is currently enabled. Internal examiners can access the data entry forms and submit examination information.'
                      : 'Subject entry is currently disabled. Internal examiners will not be able to access or submit any subject data until this is enabled.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ManageSubjectEntry;