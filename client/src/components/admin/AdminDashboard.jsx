import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../utils/adminContext';

const AdminDashboard = () => {
  const { adminUid } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUid) {
      navigate('/');
    }
  }, [adminUid, navigate]);

  const dashboardCards = [
    {
      id: 1,
      title: 'Manage Subjects',
      description: 'Add, edit, or remove subjects from the system',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      route: '/admin/manageSubjects',
      gradient: 'from-[#00c9a7] to-[#00a98c]',
      bgGradient: 'from-emerald-50/80 to-sky-50/40'
    },
    {
      id: 2,
      title: 'Manage Internal Examiners',
      description: 'Manage internal examiner assignments and details',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      route: '/admin/manageInternalExaminers',
      gradient: 'from-[#162847] to-[#0f1f3d]',
      bgGradient: 'from-blue-50/80 to-sky-50/40'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Show loading or nothing while checking auth
  if (!adminUid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-extrabold text-white font-[Syne,sans-serif]">
              Admin Dashboard
            </h1>
            <p className="text-[11px] text-[#00c9a7]/70 font-[DM_Sans,sans-serif]">
              Siddaganga Institute of Technology
            </p>
          </div>
          <span className="text-[#00c9a7] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
            Admin Panel
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        
        {/* Welcome Section */}
        <div className="mb-12 animate-[fadeSlideIn_0.5s_ease_both]">
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif] mb-3">
            Welcome Back! 👋
          </h2>
          <p className="text-[15px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
            Select an option below to manage your academic data
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {dashboardCards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.route)}
              className="group cursor-pointer animate-[fadeSlideIn_0.5s_ease_both]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`relative bg-gradient-to-br ${card.bgGradient} border border-[#00c9a7]/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(15,31,61,0.1)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,201,167,0.2)] hover:-translate-y-2 overflow-hidden`}>
                
                {/* Animated Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00c9a7] to-transparent rounded-full blur-2xl" />
                </div>

                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

                {/* Icon Circle */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-6 shadow-[0_8px_24px_rgba(0,201,167,0.3)] group-hover:scale-110 group-hover:animate-[float_2s_ease-in-out_infinite] transition-transform duration-300`}>
                  {card.icon}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-[22px] font-bold text-[#1a2e4a] font-[Syne,sans-serif] mb-2 group-hover:text-[#00c9a7] transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-[#6b85a3] font-[DM_Sans,sans-serif] mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Arrow Button */}
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#00c9a7] group-hover:gap-4 transition-all duration-300 font-[Syne,sans-serif]">
                    <span>Manage Now</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Hover Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Section (Optional) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-[fadeSlideIn_0.5s_ease_both]" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-xl p-5 shadow-[0_4px_16px_rgba(15,31,61,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#6b85a3] font-[Syne,sans-serif]">Total Subjects</p>
                <p className="text-[28px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif] mt-1">-</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00c9a7]/10 to-[#00a98c]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00c9a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-xl p-5 shadow-[0_4px_16px_rgba(15,31,61,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#6b85a3] font-[Syne,sans-serif]">Internal Examiners</p>
                <p className="text-[28px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif] mt-1">-</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00c9a7]/10 to-[#00a98c]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00c9a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-xl p-5 shadow-[0_4px_16px_rgba(15,31,61,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#6b85a3] font-[Syne,sans-serif]">Active Semester</p>
                <p className="text-[28px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif] mt-1">ODD</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00c9a7]/10 to-[#00a98c]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00c9a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;