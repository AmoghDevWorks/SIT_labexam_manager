import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { downloadExcel, downloadPDF } from '../utils/downloadUtils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ManageExamData = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedExamData, setSelectedExamData] = useState(null);

  const semesterLabels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  // Fetch subjects and exam data when semester changes
  useEffect(() => {
    if (selectedSemester) {
      fetchData();
    } else {
      setSubjects([]);
      setExamData([]);
    }
  }, [selectedSemester]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectsRes, examDataRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/subjects`),
        axios.get(`${BACKEND_URL}/api/exam-data/semester/${selectedSemester}`)
      ]);

      // Filter subjects by semester
      const filteredSubjects = subjectsRes.data.filter(s => s.semester === selectedSemester);
      setSubjects(filteredSubjects);
      setExamData(examDataRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Check if exam data exists for a subject
  const getExamDataForSubject = (subjectName) => {
    return examData.find(ed => ed.subjectName === subjectName);
  };

  // Open modal with exam data
  const handleViewExamData = (subject) => {
    const data = getExamDataForSubject(subject.subjectName);
    if (data) {
      setSelectedExamData(data);
      setShowModal(true);
    }
  };

  // Download Excel for single subject
  const handleDownloadExcel = () => {
    if (!selectedExamData) return;

    // Convert single exam data to the format expected by downloadExcel
    const subjectsData = {
      0: {
        subjectName: selectedExamData.subjectName,
        subjectCode: selectedExamData.subjectCode,
        semester: selectedExamData.semester,
        studentsEnrolled: selectedExamData.studentsEnrolled.toString(),
        verification: selectedExamData.verification,
        internals: selectedExamData.internals,
        externals: selectedExamData.externals
      }
    };

    downloadExcel(subjectsData, 1);
  };

  // Download PDF for single subject
  const handleDownloadPDF = () => {
    if (!selectedExamData) return;

    // Convert single exam data to the format expected by downloadPDF
    const subjectsData = {
      0: {
        subjectName: selectedExamData.subjectName,
        subjectCode: selectedExamData.subjectCode,
        semester: selectedExamData.semester,
        studentsEnrolled: selectedExamData.studentsEnrolled.toString(),
        verification: selectedExamData.verification,
        internals: selectedExamData.internals,
        externals: selectedExamData.externals
      }
    };

    downloadPDF(subjectsData, 1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        
        .semester-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300c9a7' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        
        @keyframes pageIn {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50 font-[DM_Sans,sans-serif]">
        
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-[68px] bg-gradient-to-r from-[#0f1f3d] to-[#162847] shadow-[0_4px_24px_rgba(15,31,61,0.25)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b85a3] hover:text-[#00c9a7] hover:bg-white/5 transition-all duration-150"
            >
              <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
                <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <div className="w-8 h-8 rounded-lg bg-[#00c9a7]/15 border border-[#00c9a7]/30 flex items-center justify-center">
              <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
                <path d="M4 4h10M4 9h10M4 14h6" stroke="#00c9a7" strokeWidth="1.4" strokeLinecap="round"/>
                <rect x="2" y="2" width="14" height="14" rx="2" stroke="#00c9a7" strokeWidth="1.4" fill="none"/>
              </svg>
            </div>
            <span className="text-white text-[14px] font-bold tracking-wide font-[Syne,sans-serif]">
              Exam Data
            </span>
          </div>
          <span className="text-[#00c9a7] text-[11px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
            Admin Portal
          </span>
        </header>

        {/* Body */}
        <main
          className="w-full max-w-6xl mx-auto px-6 py-10"
          style={{ animation: "pageIn 0.3s ease both" }}
        >
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
              Manage Exam Data
            </h1>
            <p className="text-sm text-[#6b85a3] mt-1 font-light">
              View and download exam data by semester
            </p>
          </div>

          {/* Semester Filter Card */}
          <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl px-9 py-8 mb-8 shadow-[0_8px_32px_rgba(15,31,61,0.12)]">

            {/* Semester Selector */}
            <div className="max-w-md">
              <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                Select Semester <span className="text-[#00c9a7]">*</span>
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="semester-select w-full px-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] font-[DM_Sans,sans-serif] cursor-pointer appearance-none"
              >
                <option value="">Choose Semester</option>
                {semesterLabels.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#00c9a7]/30 border-t-[#00c9a7] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#6b85a3] font-[DM_Sans,sans-serif]">Loading subjects...</p>
              </div>
            </div>
          )}

          {/* Subjects List */}
          {!loading && selectedSemester && subjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const examDataExists = getExamDataForSubject(subject.subjectName);
                
                return (
                  <div
                    key={subject._id}
                    className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-xl p-5 shadow-[0_4px_16px_rgba(15,31,61,0.08)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.15)] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="text-[15px] font-bold text-[#1a2e4a] mb-1 font-[Syne,sans-serif] truncate">
                          {subject.subjectName}
                        </h3>
                        <p className="text-[12px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
                          Code: <span className="font-semibold text-[#00a98c]">{subject.subjectCode}</span>
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      {examDataExists ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider shrink-0">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 border border-amber-300 rounded-full text-[10px] font-bold text-amber-700 uppercase tracking-wider shrink-0">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          No Data
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => examDataExists ? handleViewExamData(subject) : null}
                      disabled={!examDataExists}
                      className={`w-full mt-3 px-4 py-2.5 rounded-lg text-[13px] font-bold tracking-wide transition-all duration-200 font-[Syne,sans-serif] ${
                        examDataExists
                          ? 'bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white hover:shadow-[0_4px_16px_rgba(0,201,167,0.3)] hover:-translate-y-0.5'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {examDataExists ? 'View Details' : 'No Data Available'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Subjects Message */}
          {!loading && selectedSemester && subjects.length === 0 && (
            <div className="bg-white/85 backdrop-blur-md border border-amber-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-[#6b85a3] font-[DM_Sans,sans-serif]">
                No subjects found for Semester {selectedSemester}
              </p>
            </div>
          )}

          {/* No Semester Selected */}
          {!loading && !selectedSemester && (
            <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-xl p-12 text-center">
              <div className="w-20 h-20 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[#00c9a7]" viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a2e4a] mb-2 font-[Syne,sans-serif]">
                Select a Semester
              </h3>
              <p className="text-[#6b85a3] font-[DM_Sans,sans-serif]">
                Choose a semester from the dropdown above to view exam data
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && selectedExamData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0f1f3d] to-[#162847] px-8 py-6 border-b border-[#00c9a7]/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[22px] font-bold text-white font-[Syne,sans-serif]">
                    {selectedExamData.subjectName}
                  </h2>
                  <p className="text-[#00c9a7] text-sm mt-1 font-[DM_Sans,sans-serif]">
                    {selectedExamData.subjectCode} • Semester {selectedExamData.semester}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Subject Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-sky-50 border border-[#00c9a7]/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-1 font-[Syne,sans-serif]">Students Enrolled</p>
                  <p className="text-[20px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">{selectedExamData.studentsEnrolled}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1 font-[Syne,sans-serif]">Question Paper Permission</p>
                  <p className={`text-[20px] font-bold font-[Syne,sans-serif] ${selectedExamData.verification === 'Yes' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedExamData.verification}
                  </p>
                </div>
              </div>

              {/* Internal Examiners */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]">🎓 Internal Examiners</h3>
                <div className="space-y-2">
                  {selectedExamData.internals.map((internal, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-sky-50/80 to-emerald-50/40 border border-[#00c9a7]/20 rounded-lg p-3">
                      <p className="text-sm font-semibold text-[#1a2e4a] font-[DM_Sans,sans-serif]">{internal.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Examiners */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]">🏛️ External Examiners</h3>
                <div className="space-y-3">
                  {selectedExamData.externals.map((external, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-sky-50/80 to-blue-50/40 border border-[#00c9a7]/20 rounded-lg p-4">
                      <p className="text-sm font-bold text-[#1a2e4a] mb-2 font-[Syne,sans-serif]">{external.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#6b85a3] font-[DM_Sans,sans-serif]">
                        <p><span className="font-semibold">Email:</span> {external.email}</p>
                        <p><span className="font-semibold">Contact:</span> {external.contact}</p>
                        <p><span className="font-semibold">Experience:</span> {external.yearsOfExperience} years</p>
                        <p className="col-span-2"><span className="font-semibold">Address:</span> {external.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Download Buttons */}
            <div className="bg-sky-50 border-t border-[#00c9a7]/20 px-8 py-5 flex gap-3">
              <button
                onClick={handleDownloadExcel}
                className="flex-1 group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f1f3d] to-[#162847] text-white rounded-xl shadow-[0_4px_16px_rgba(15,31,61,0.2)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.2)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7]/0 via-[#00c9a7]/10 to-[#00c9a7]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00c9a7" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="#00c9a7" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 13h8M8 17h5" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Download Excel</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="flex-1 group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-xl shadow-[0_4px_16px_rgba(0,201,167,0.2)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 13h6M9 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageExamData;