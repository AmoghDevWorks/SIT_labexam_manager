import React, { useState, useEffect } from 'react';
import { useUser } from '../../utils/userContext';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SubjectEntry = () => {
  const { userUid } = useUser();
  const [allowEntry, setAllowEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [allSubjects, setAllSubjects] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // { type: 'register' | 'delete', subject }
  const [processing, setProcessing] = useState(false);

  const semesterLabels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  // Check if entry is allowed
  useEffect(() => {
    const checkEntryStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/manage-subject-entry`);
        setAllowEntry(response.data.allowSubjectEntry);
      } catch (error) {
        console.error('Error checking entry status:', error);
        setAllowEntry(false);
      } finally {
        setLoading(false);
      }
    };

    checkEntryStatus();
  }, []);

  // Fetch subjects and assignments when semester is selected
  useEffect(() => {
    if (selectedSemester && allowEntry && userUid) {
      fetchData();
    }
  }, [selectedSemester, allowEntry, userUid]);

  const fetchData = async () => {
    setLoadingSubjects(true);
    try {
      const [subjectsRes, assignmentsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/subjects`),
        axios.get(`${BACKEND_URL}/api/subject-assignments/examiner/${userUid}`)
      ]);

      setAllSubjects(subjectsRes.data.filter(s => s.semester === selectedSemester));
      setMyAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleRegister = async () => {
    if (!modalAction || modalAction.type !== 'register') return;

    setProcessing(true);
    try {
      await axios.post(`${BACKEND_URL}/api/subject-assignments`, {
        subjectId: modalAction.subject._id,
        internalExaminerId: userUid
      });

      alert('✅ Successfully registered to subject!');
      setShowModal(false);
      setModalAction(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error registering:', error);
      alert(`❌ ${error.response?.data?.message || 'Failed to register'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!modalAction || modalAction.type !== 'delete') return;

    setProcessing(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/subject-assignments/${modalAction.assignment._id}`);

      alert('✅ Successfully unregistered from subject!');
      setShowModal(false);
      setModalAction(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting:', error);
      alert(`❌ ${error.response?.data?.message || 'Failed to unregister'}`);
    } finally {
      setProcessing(false);
    }
  };

  const openRegisterModal = (subject) => {
    setModalAction({ type: 'register', subject });
    setShowModal(true);
  };

  const openDeleteModal = (assignment) => {
    setModalAction({ type: 'delete', assignment });
    setShowModal(true);
  };

  // Get registered subject IDs for current semester
  const registeredSubjectIds = myAssignments
    .filter(a => a.subjectId?.semester === selectedSemester)
    .map(a => a.subjectId?._id);

  // Separate subjects into registered and available
  const registeredSubjects = allSubjects.filter(s => registeredSubjectIds.includes(s._id));
  const availableSubjects = allSubjects.filter(s => !registeredSubjectIds.includes(s._id));

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00c9a7]/30 border-t-[#00c9a7] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b85a3] font-[DM_Sans,sans-serif]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!allowEntry) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/85 backdrop-blur-md border border-rose-200 rounded-2xl p-8 text-center shadow-[0_8px_32px_rgba(244,63,94,0.15)]">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-[#1a2e4a] mb-2 font-[Syne,sans-serif]">
            Entry Not Allowed
          </h2>
          <p className="text-[14px] text-[#6b85a3] leading-relaxed font-[DM_Sans,sans-serif]">
            Subject entry is currently disabled by the administrator. Please contact the admin to enable subject registration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="max-w-[960px] mx-auto px-6 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
            Subject Registration
          </h1>
          <p className="text-sm text-[#6b85a3] mt-1 font-light">
            Register for subjects you want to examine
          </p>
        </div>

        {/* Semester Selector */}
        <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl px-8 py-6 mb-8 shadow-[0_8px_32px_rgba(15,31,61,0.12)]">
          <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
            Select Semester <span className="text-[#00c9a7]">*</span>
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] font-[DM_Sans,sans-serif] cursor-pointer"
          >
            <option value="">Choose Semester</option>
            {semesterLabels.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loadingSubjects && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#00c9a7]/30 border-t-[#00c9a7] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#6b85a3] font-[DM_Sans,sans-serif]">Loading subjects...</p>
          </div>
        )}

        {/* Content */}
        {!loadingSubjects && selectedSemester && (
          <>
            {allSubjects.length === 0 ? (
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
            ) : (
              <>
                {/* Registered Subjects */}
                {registeredSubjects.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-[18px] font-bold text-[#1a2e4a] mb-4 font-[Syne,sans-serif]">
                      My Registered Subjects ({registeredSubjects.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registeredSubjects.map((subject) => {
                        const assignment = myAssignments.find(a => a.subjectId?._id === subject._id);
                        return (
                          <div key={subject._id} className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border border-emerald-300 rounded-xl p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-[15px] font-bold text-emerald-800 mb-1 font-[Syne,sans-serif]">
                                  {subject.subjectName}
                                </h3>
                                <p className="text-[12px] text-emerald-600 font-[DM_Sans,sans-serif]">
                                  Code: <span className="font-semibold">{subject.subjectCode}</span>
                                </p>
                              </div>
                              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-200 rounded-full text-[10px] font-bold text-emerald-700 uppercase">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Registered
                              </span>
                            </div>
                            <button
                              onClick={() => openDeleteModal(assignment)}
                              className="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[13px] font-bold transition-colors font-[Syne,sans-serif]"
                            >
                              Unregister
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Subjects */}
                {availableSubjects.length > 0 ? (
                  <div>
                    <h2 className="text-[18px] font-bold text-[#1a2e4a] mb-4 font-[Syne,sans-serif]">
                      Available Subjects ({availableSubjects.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableSubjects.map((subject) => (
                        <div key={subject._id} className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="mb-3">
                            <h3 className="text-[15px] font-bold text-[#1a2e4a] mb-1 font-[Syne,sans-serif]">
                              {subject.subjectName}
                            </h3>
                            <p className="text-[12px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
                              Code: <span className="font-semibold text-[#00a98c]">{subject.subjectCode}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => openRegisterModal(subject)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-[#00a98c] to-[#00c9a7] text-white rounded-lg text-[13px] font-bold hover:shadow-[0_4px_16px_rgba(0,201,167,0.3)] transition-all font-[Syne,sans-serif]"
                          >
                            Register
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : registeredSubjects.length > 0 ? (
                  <div className="bg-sky-50 border border-[#00c9a7]/20 rounded-xl p-6 text-center">
                    <p className="text-[14px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
                      ✅ You are registered for all subjects in this semester
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && modalAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-md w-full overflow-hidden">
            <div className={`px-6 py-5 border-b ${
              modalAction.type === 'register' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                : 'bg-gradient-to-r from-rose-500 to-rose-600'
            }`}>
              <h3 className="text-[18px] font-bold text-white font-[Syne,sans-serif]">
                {modalAction.type === 'register' ? 'Confirm Registration' : 'Confirm Unregistration'}
              </h3>
            </div>

            <div className="p-6">
              <p className="text-[14px] text-[#6b85a3] mb-2 font-[DM_Sans,sans-serif]">
                {modalAction.type === 'register' 
                  ? 'Are you sure you want to register for this subject?' 
                  : 'Are you sure you want to unregister from this subject?'}
              </p>
              <div className="bg-sky-50 border border-[#00c9a7]/20 rounded-lg p-3 mb-6">
                <p className="text-[15px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">
                  {modalAction.type === 'register' 
                    ? modalAction.subject.subjectName 
                    : modalAction.assignment.subjectId?.subjectName}
                </p>
                <p className="text-[12px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
                  Code: {modalAction.type === 'register' 
                    ? modalAction.subject.subjectCode 
                    : modalAction.assignment.subjectId?.subjectCode}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setModalAction(null);
                  }}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[14px] font-bold transition-colors font-[Syne,sans-serif] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={modalAction.type === 'register' ? handleRegister : handleDelete}
                  disabled={processing}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg text-[14px] font-bold transition-all font-[Syne,sans-serif] disabled:opacity-50 ${
                    modalAction.type === 'register'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                      : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:shadow-[0_4px_16px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    modalAction.type === 'register' ? 'Register' : 'Unregister'
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

export default SubjectEntry;