import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../utils/userContext';
import Hero from './manualUpload/Hero';
import UploadExcel from './excelUpload/UploadExcel';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' or 'upload'
  const { userUid } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userUid) {
      navigate('/user/login');
    }
  }, [userUid, navigate]);

  if (!userUid) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50">
      {/* Toggle Section */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
        <div className="max-w-[960px] mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-2 bg-[#1a2e4a]/30 p-1.5 rounded-xl border border-[#00c9a7]/20 backdrop-blur-sm w-fit mx-auto">           <button
              onClick={() => setActiveTab('hero')}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 font-[Syne,sans-serif] ${
                activeTab === 'hero'
                  ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white shadow-[0_4px_16px_rgba(0,201,167,0.4)]'
                  : 'text-[#00c9a7]/60 hover:text-[#00c9a7] hover:bg-[#00c9a7]/10'
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 font-[Syne,sans-serif] ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white shadow-[0_4px_16px_rgba(0,201,167,0.4)]'
                  : 'text-[#00c9a7]/60 hover:text-[#00c9a7] hover:bg-[#00c9a7]/10'
              }`}
            >
              Upload Excel
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full">
        {activeTab === 'hero' ? <Hero /> : <UploadExcel />}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default UserDashboard;