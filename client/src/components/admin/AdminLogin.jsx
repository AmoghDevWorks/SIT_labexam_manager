import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from "../utils/adminContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { setAdminUid,adminUid  } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        username,
        password
      });

      const adminId = response.data.admin.id
      setAdminUid(adminId)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminUid) {
      navigate("/admin/dashboard");
    }
  }, [adminUid]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50 px-4 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* Login Card */}
      <div className="w-full max-w-[460px]">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 mb-4 px-4 py-2.5 text-[13px] font-semibold text-[#1a2e4a] bg-white/60 backdrop-blur-sm border border-[#00c9a7]/20 rounded-xl hover:bg-white/80 hover:border-[#00c9a7]/40 transition-all duration-200 shadow-sm hover:shadow-md font-[DM_Sans,sans-serif]"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#00a98c] group-hover:-translate-x-0.5 transition-transform duration-200" fill="none">
            <path d="M15 10H5M5 10l4-4M5 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
        
        <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl shadow-[0_8px_32px_rgba(15,31,61,0.12)] overflow-hidden">
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#00c9a7] via-[#00e5c4] to-[#00a98c]" />
          
          <div className="p-8">
            {/* Heading */}
            <h1 className="text-[28px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif] mb-6 text-center">
              LOGIN
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Message */}
              {error && (
                <div className="bg-rose-50 border border-rose-300 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium animate-[fadeIn_0.3s_ease]">
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                  Username
                  <span className="text-[#00c9a7] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#6b85a3]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] placeholder:text-[#6b85a3]/60 font-[DM_Sans,sans-serif]"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                  Password
                  <span className="text-[#00c9a7] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#6b85a3]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] placeholder:text-[#6b85a3]/60 font-[DM_Sans,sans-serif]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6b85a3] hover:text-[#00c9a7] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#0f1f3d] to-[#162847] text-white rounded-xl shadow-[0_8px_32px_rgba(15,31,61,0.25)] hover:shadow-[0_12px_40px_rgba(0,201,167,0.2)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {/* Shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7]/0 via-[#00c9a7]/10 to-[#00c9a7]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-[#00c9a7]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-[15px] font-bold tracking-wide font-[Syne,sans-serif]">
                      Logging in...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[15px] font-bold tracking-wide font-[Syne,sans-serif]">
                      Login
                    </span>
                    <svg
                      className="w-5 h-5 text-[#00c9a7] group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;