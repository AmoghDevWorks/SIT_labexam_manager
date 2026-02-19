import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../utils/userContext';
import Hero from './manualUpload/Hero';
import UploadExcel from './excelUpload/UploadExcel';
import UploadDocs from './uploadDocs/UploadDocs';
import SubjectEntry from './subjectEntry/SubjectEntry';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'upload' | 'docs' | 'entry'
  const { userUid, setUserUid, setUserName } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userUid) {
      navigate('/user/login');
    }
  }, [userUid, navigate]);

  const handleLogout = () => {
    setUserUid(null);
    setUserName(null);
    navigate('/');
  };

  if (!userUid) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50">
      {/* Toggle Section */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
            {/* 2x2 grid on small/medium, 1x4 row on large */}
            <div className="grid grid-cols-2 lg:flex lg:flex-row gap-1.5 sm:gap-2 bg-[#1a2e4a]/30 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-[#00c9a7]/20 backdrop-blur-sm w-full lg:w-auto">
              <button
                onClick={() => setActiveTab('hero')}
                className={`relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 font-[Syne,sans-serif] ${
                  activeTab === 'hero'
                    ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white shadow-[0_4px_16px_rgba(0,201,167,0.4)]'
                    : 'text-[#00c9a7]/60 hover:text-[#00c9a7] hover:bg-[#00c9a7]/10'
                }`}
              >
                Create New
              </button>
              {/* <button
                onClick={() => setActiveTab('upload')}
                className={`relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 font-[Syne,sans-serif] ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white shadow-[0_4px_16px_rgba(0,201,167,0.4)]'
                    : 'text-[#00c9a7]/60 hover:text-[#00c9a7] hover:bg-[#00c9a7]/10'
                }`}
              >
                Upload Excel
              </button> */}
              <button
                onClick={() => setActiveTab('docs')}
                className={`relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 font-[Syne,sans-serif] ${
                  activeTab === 'docs'
                    ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white shadow-[0_4px_16px_rgba(0,201,167,0.4)]'
                    : 'text-[#00c9a7]/60 hover:text-[#00c9a7] hover:bg-[#00c9a7]/10'
                }`}
              >
                Upload Documents
              </button>
              <button
                onClick={() => setActiveTab('entry')}
                className={`relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 font-[Syne,sans-serif] ${
                  activeTab === 'entry'
                    ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white shadow-[0_4px_16px_rgba(0,201,167,0.4)]'
                    : 'text-[#00c9a7]/60 hover:text-[#00c9a7] hover:bg-[#00c9a7]/10'
                }`}
              >
                Subject Entry
              </button>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full md:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold text-white bg-rose-500/90 border border-rose-400/30 hover:bg-rose-600 hover:shadow-[0_4px_16px_rgba(244,63,94,0.4)] transition-all duration-300 font-[Syne,sans-serif]"
              title="Logout"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full">
        {activeTab === 'hero' ? <Hero setActiveTab={setActiveTab} /> : activeTab === 'upload' ? <UploadExcel /> : activeTab === 'docs' ? <UploadDocs /> : <SubjectEntry />}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default UserDashboard;