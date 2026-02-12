import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: 'Examiner Login',
      description: 'Access your examiner dashboard to manage lab exams and student assessments',
      icon: UserCircle,
      path: '/user/login',
      gradient: 'from-[#0f1f3d] to-[#162847]',
      hoverGradient: 'hover:from-[#0d1a33] hover:to-[#0f1f3d]',
      accentColor: '#00c9a7',
    },
    {
      title: 'Admin Login',
      description: 'Administrative access to manage system settings and user permissions',
      icon: Shield,
      path: '/loginAdmin',
      gradient: 'from-[#0f1f3d] to-[#162847]',
      hoverGradient: 'hover:from-[#0d1a33] hover:to-[#0f1f3d]',
      accentColor: '#00a98c',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50 px-4 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0f1f3d]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Lab Exam Manager
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Welcome! Please select your login type to continue
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {loginOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(option.path)}
                className={`group cursor-pointer bg-white rounded-2xl shadow-[0_4px_24px_rgba(15,31,61,0.15)] hover:shadow-[0_8px_32px_rgba(15,31,61,0.25)] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100`}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${option.gradient} p-6 md:p-8 ${option.hoverGradient} transition-all duration-300`}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                      <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {option.title}
                  </h2>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 bg-white">
                  <p className="text-gray-600 text-center mb-6 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {option.description}
                  </p>
                  <div className="flex justify-center">
                    <button 
                      className="text-white px-6 py-3 rounded-lg font-semibold shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105" 
                      style={{ 
                        fontFamily: 'DM Sans, sans-serif',
                        background: `linear-gradient(135deg, ${option.accentColor} 0%, ${option.accentColor}dd 100%)`
                      }}
                    >
                      Continue to Login
                      <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12 text-gray-500 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <p>Secure access to your lab examination management system</p>
        </div>
      </div>
    </div>
  );
};

export default Home;