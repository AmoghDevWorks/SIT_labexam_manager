import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { downloadExcel, downloadPDF, downloadExcelWithUnfilled } from '../utils/downloadUtils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ManageExamData = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedExamData, setSelectedExamData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showBulkDownloadModal, setShowBulkDownloadModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('Panel of Examiners for ODD Semester (2025-2026) - December 2025 - January 2026');

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
  const getExamDataForSubject = (subjectCode) => {
    return examData.find(ed => ed.subjectCode === subjectCode);
  };

  // Open modal with exam data
  const handleViewExamData = (subject) => {
    const data = getExamDataForSubject(subject.subjectCode);
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

    downloadExcel(subjectsData, 1, documentTitle);
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

    downloadPDF(subjectsData, 1, documentTitle);
  };

  // Download Excel for all subjects in semester
  const handleBulkDownloadExcel = () => {
    if (examData.length === 0) {
      alert('No exam data available for this semester');
      return;
    }

    // Convert all exam data to the format expected by downloadExcel
    const subjectsData = {};
    examData.forEach((data, index) => {
      subjectsData[index] = {
        subjectName: data.subjectName,
        subjectCode: data.subjectCode,
        semester: data.semester,
        studentsEnrolled: data.studentsEnrolled.toString(),
        verification: data.verification,
        internals: data.internals,
        externals: data.externals
      };
    });

    // Find unfilled subjects (subjects that don't have exam data)
    const filledSubjectCodes = new Set(examData.map(ed => ed.subjectCode));
    const unfilledSubjects = subjects.filter(subject => !filledSubjectCodes.has(subject.subjectCode));

    downloadExcelWithUnfilled(subjectsData, examData.length, unfilledSubjects, selectedSemester, documentTitle);
    setShowBulkDownloadModal(false);
  };

  // Download PDF for all subjects in semester
  const handleBulkDownloadPDF = () => {
    if (examData.length === 0) {
      alert('No exam data available for this semester');
      return;
    }

    // Convert all exam data to the format expected by downloadPDF
    const subjectsData = {};
    examData.forEach((data, index) => {
      subjectsData[index] = {
        subjectName: data.subjectName,
        subjectCode: data.subjectCode,
        semester: data.semester,
        studentsEnrolled: data.studentsEnrolled.toString(),
        verification: data.verification,
        internals: data.internals,
        externals: data.externals
      };
    });

    downloadPDF(subjectsData, examData.length, documentTitle);
    setShowBulkDownloadModal(false);
  };

  // Open edit modal
  const handleEditClick = () => {
    setEditFormData({
      ...selectedExamData,
      studentsEnrolled: selectedExamData.studentsEnrolled.toString()
    });
    setShowModal(false);
    setShowEditModal(true);
  };

  // Update form field
  const updateEditField = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update internal examiner
  const updateInternalExaminer = (index, value) => {
    setEditFormData(prev => ({
      ...prev,
      internals: prev.internals.map((item, idx) => 
        idx === index ? { ...item, name: value } : item
      )
    }));
  };

  // Update external examiner
  const updateExternalExaminer = (index, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      externals: prev.externals.map((item, idx) => 
        idx === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const updateData = {
        semester: editFormData.semester,
        subjectName: editFormData.subjectName,
        subjectCode: editFormData.subjectCode,
        studentsEnrolled: parseInt(editFormData.studentsEnrolled, 10),
        verification: editFormData.verification,
        internals: editFormData.internals,
        externals: editFormData.externals.map(ext => ({
          ...ext,
          yearsOfExperience: parseInt(ext.yearsOfExperience, 10)
        }))
      };

      await axios.put(`${BACKEND_URL}/api/exam-data/${editFormData._id}`, updateData);
      
      alert('✅ Exam data updated successfully!');
      setShowEditModal(false);
      setEditFormData(null);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating exam data:', error);
      alert(`❌ Error updating exam data: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete all exam data for semester
  const handleDeleteSemesterData = async () => {
    try {
      setDeleting(true);

      // Delete all exam data for the semester
      await Promise.all(
        examData.map(data => 
          axios.delete(`${BACKEND_URL}/api/exam-data/${data._id}`)
        )
      );
      
      alert(`✅ All exam data for Semester ${selectedSemester} deleted successfully!`);
      setShowDeleteConfirmModal(false);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error deleting exam data:', error);
      alert(`❌ Error deleting exam data: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeleting(false);
    }
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
                <path d="M4 4h10M4 9h10M4 14h6" stroke="#00c9a7" strokeWidth="1.4" strokeLinecap="round"/>
                <rect x="2" y="2" width="14" height="14" rx="2" stroke="#00c9a7" strokeWidth="1.4" fill="none"/>
              </svg>
            </div>
            <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-wide leading-tight font-[Syne,sans-serif]">
              Exam Data
            </span>
          </div>
          <span className="text-[#00c9a7] text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
            <span>Admin Portal</span>
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

            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
              {/* Semester Selector */}
              <div className="flex-1 max-w-md">
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

              {/* Action Buttons */}
              {selectedSemester && examData.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowBulkDownloadModal(true)}
                    className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-xl shadow-[0_4px_16px_rgba(0,201,167,0.2)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="relative text-[14px] font-bold font-[Syne,sans-serif] whitespace-nowrap">Download Sem Exam Data</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl shadow-[0_4px_16px_rgba(225,29,72,0.2)] hover:shadow-[0_6px_24px_rgba(225,29,72,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="relative text-[14px] font-bold font-[Syne,sans-serif] whitespace-nowrap">Clear Exam Data</span>
                  </button>
                </div>
              )}
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
                const examDataExists = getExamDataForSubject(subject.subjectCode);
                
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

              {/* Tracking Information */}
              <div className="mb-6 bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none">
                      <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 font-[Syne,sans-serif]">Submitted By</p>
                    <p className="text-[15px] font-bold text-[#1a2e4a] mb-2 font-[Syne,sans-serif]">
                      {selectedExamData.filledBy || 'Unknown'}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {selectedExamData.filledAt 
                        ? new Date(selectedExamData.filledAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })
                        : 'Date not available'}
                    </div>
                  </div>
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

            {/* Modal Footer - Action Buttons */}
            <div className="bg-sky-50 border-t border-[#00c9a7]/20 px-8 py-5">
              {/* Stacked layout for sm, row layout for md+ */}
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={handleEditClick}
                  className="w-full md:w-auto group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Edit Data</span>
                </button>
                
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
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 border-b border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[22px] font-bold text-white font-[Syne,sans-serif]">
                    Edit Exam Data
                  </h2>
                  <p className="text-blue-200 text-sm mt-1 font-[DM_Sans,sans-serif]">
                    {editFormData.subjectCode} • Semester {editFormData.semester}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditFormData(null);
                  }}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - Form */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              
              {/* Subject Info (Read-only) */}
              <div className="mb-6 bg-sky-50 border border-[#00c9a7]/20 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-2 font-[Syne,sans-serif]">Subject</p>
                <p className="text-lg font-bold text-[#1a2e4a] font-[Syne,sans-serif]">{editFormData.subjectName}</p>
              </div>

              {/* Students Enrolled */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                  Students Enrolled <span className="text-[#00c9a7]">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.studentsEnrolled}
                  onChange={(e) => updateEditField('studentsEnrolled', e.target.value)}
                  className="w-full px-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] font-[DM_Sans,sans-serif]"
                />
              </div>

              {/* Verification */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                  Permission to use existing Question Paper <span className="text-[#00c9a7]">*</span>
                </label>
                <div className="flex gap-3">
                  {['Yes', 'No'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer border-2 transition-all duration-200 font-[Syne,sans-serif] ${
                        editFormData.verification === option
                          ? option === 'Yes'
                            ? 'bg-[#00c9a7]/15 border-[#00c9a7] text-[#00a98c]'
                            : 'bg-rose-100 border-rose-400 text-rose-600'
                          : 'bg-white border-gray-300 text-[#6b85a3] hover:border-[#00c9a7]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="verification"
                        value={option}
                        checked={editFormData.verification === option}
                        onChange={(e) => updateEditField('verification', e.target.value)}
                        className="sr-only"
                      />
                      <span className={`w-3 h-3 rounded-full ${
                        editFormData.verification === option
                          ? option === 'Yes' ? 'bg-[#00c9a7]' : 'bg-rose-500'
                          : 'bg-gray-300'
                      }`} />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Internal Examiners */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]">🎓 Internal Examiners</h3>
                <div className="space-y-3">
                  {editFormData.internals.map((internal, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-sky-50/80 to-emerald-50/40 border border-[#00c9a7]/20 rounded-xl p-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                        Internal Examiner #{idx + 1}
                      </label>
                      <input
                        type="text"
                        value={internal.name}
                        onChange={(e) => updateInternalExaminer(idx, e.target.value)}
                        className="w-full px-4 py-2.5 text-sm text-[#1a2e4a] bg-white border border-[#00c9a7]/25 rounded-lg outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] font-[DM_Sans,sans-serif]"
                        placeholder="Examiner name"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* External Examiners */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]">🏛️ External Examiners</h3>
                <div className="space-y-4">
                  {editFormData.externals.map((external, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-sky-50/80 to-blue-50/40 border border-[#00c9a7]/20 rounded-xl p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-3 font-[Syne,sans-serif]">
                        External Examiner #{idx + 1}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-1 font-[Syne,sans-serif]">Name</label>
                          <input
                            type="text"
                            value={external.name}
                            onChange={(e) => updateExternalExaminer(idx, 'name', e.target.value)}
                            className="w-full px-3 py-2 text-sm text-[#1a2e4a] bg-white border border-[#00c9a7]/25 rounded-lg outline-none focus:border-[#00c9a7] font-[DM_Sans,sans-serif]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-1 font-[Syne,sans-serif]">Experience (years)</label>
                          <input
                            type="number"
                            min="0"
                            value={external.yearsOfExperience}
                            onChange={(e) => updateExternalExaminer(idx, 'yearsOfExperience', e.target.value)}
                            className="w-full px-3 py-2 text-sm text-[#1a2e4a] bg-white border border-[#00c9a7]/25 rounded-lg outline-none focus:border-[#00c9a7] font-[DM_Sans,sans-serif]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-1 font-[Syne,sans-serif]">Email</label>
                          <input
                            type="email"
                            value={external.email}
                            onChange={(e) => updateExternalExaminer(idx, 'email', e.target.value)}
                            className="w-full px-3 py-2 text-sm text-[#1a2e4a] bg-white border border-[#00c9a7]/25 rounded-lg outline-none focus:border-[#00c9a7] font-[DM_Sans,sans-serif]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-1 font-[Syne,sans-serif]">Contact</label>
                          <input
                            type="tel"
                            value={external.contact}
                            onChange={(e) => updateExternalExaminer(idx, 'contact', e.target.value)}
                            className="w-full px-3 py-2 text-sm text-[#1a2e4a] bg-white border border-[#00c9a7]/25 rounded-lg outline-none focus:border-[#00c9a7] font-[DM_Sans,sans-serif]"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-1 font-[Syne,sans-serif]">Address</label>
                          <textarea
                            rows={2}
                            value={external.address}
                            onChange={(e) => updateExternalExaminer(idx, 'address', e.target.value)}
                            className="w-full px-3 py-2 text-sm text-[#1a2e4a] bg-white border border-[#00c9a7]/25 rounded-lg outline-none focus:border-[#00c9a7] resize-none font-[DM_Sans,sans-serif]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Save Button */}
            <div className="bg-sky-50 border-t border-[#00c9a7]/20 px-8 py-5 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData(null);
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-[14px] font-bold font-[Syne,sans-serif] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className={`flex-1 group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-xl shadow-[0_4px_16px_rgba(0,201,167,0.2)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${
                  saving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                      <polyline points="17 21 17 13 7 13 7 21" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                      <polyline points="7 3 7 8 15 8" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                    <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Download Modal */}
      {showBulkDownloadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#00a98c] to-[#00c9a7] px-8 py-6 border-b border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[22px] font-bold text-white font-[Syne,sans-serif]">
                    Download Semester Data
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1 font-[DM_Sans,sans-serif]">
                    Semester {selectedSemester} • {examData.length} Subject{examData.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkDownloadModal(false)}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Title Input */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                  Document Title <span className="text-[#00c9a7]">*</span>
                </label>
                <textarea
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] font-[DM_Sans,sans-serif] resize-none"
                  placeholder="Enter the document title..."
                />
                <p className="text-xs text-[#6b85a3] mt-1.5 font-[DM_Sans,sans-serif]">
                  This title will appear at the top of the generated document
                </p>
              </div>

              <p className="text-[#6b85a3] text-sm mb-6 font-[DM_Sans,sans-serif]">
                Choose a format to download all exam data for Semester {selectedSemester}:
              </p>

              {/* Download Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBulkDownloadExcel}
                  className="w-full group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0f1f3d] to-[#162847] text-white rounded-xl shadow-[0_4px_16px_rgba(15,31,61,0.2)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.2)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7]/0 via-[#00c9a7]/10 to-[#00c9a7]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative w-12 h-12 bg-[#00c9a7]/15 border border-[#00c9a7]/30 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00c9a7" strokeWidth="1.5" strokeLinejoin="round"/>
                      <polyline points="14 2 14 8 20 8" stroke="#00c9a7" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M8 13h8M8 17h5" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="relative text-left flex-1">
                    <p className="text-[15px] font-bold font-[Syne,sans-serif]">Download as Excel</p>
                    <p className="text-xs text-[#00c9a7] mt-0.5 font-[DM_Sans,sans-serif]">XLSX format • Filled data + Unfilled subjects list</p>
                  </div>
                  <svg className="relative w-5 h-5 text-[#00c9a7]" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={handleBulkDownloadPDF}
                  className="w-full group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-xl shadow-[0_4px_16px_rgba(0,201,167,0.2)] hover:shadow-[0_6px_24px_rgba(0,201,167,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative w-12 h-12 bg-white/15 border border-white/30 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M9 13h6M9 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="relative text-left flex-1">
                    <p className="text-[15px] font-bold font-[Syne,sans-serif]">Download as PDF</p>
                    <p className="text-xs text-white/80 mt-0.5 font-[DM_Sans,sans-serif]">PDF format • All subjects included</p>
                  </div>
                  <svg className="relative w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-sky-50 border-t border-[#00c9a7]/20 px-8 py-4 flex justify-end">
              <button
                onClick={() => setShowBulkDownloadModal(false)}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[13px] font-bold font-[Syne,sans-serif] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-8 py-6 border-b border-rose-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="text-[22px] font-bold text-white font-[Syne,sans-serif]">
                    Confirm Delete
                  </h2>
                </div>
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  disabled={deleting}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="mb-6">
                <p className="text-[#1a2e4a] text-base font-semibold mb-3 font-[Syne,sans-serif]">
                  Are you sure you want to delete all exam data for Semester {selectedSemester}?
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <p className="text-sm font-bold text-amber-900 mb-1 font-[Syne,sans-serif]">Warning</p>
                      <p className="text-xs text-amber-800 font-[DM_Sans,sans-serif]">
                        This will permanently delete exam data for {examData.length} subject{examData.length !== 1 ? 's' : ''}. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-[14px] font-bold font-[Syne,sans-serif] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSemesterData}
                  disabled={deleting}
                  className="flex-1 group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl shadow-[0_4px_16px_rgba(225,29,72,0.2)] hover:shadow-[0_6px_24px_rgba(225,29,72,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {deleting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Delete All</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageExamData;