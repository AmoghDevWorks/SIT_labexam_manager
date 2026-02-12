import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../utils/userContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UploadDocs = () => {
  const { userUid } = useUser();
  
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // File states
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [modelQPFile, setModelQPFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ syllabus: null, modelQP: null });
  
  // Existing documents state
  const [existingDocs, setExistingDocs] = useState({ syllabus: null, modelQP: null });

  const semesterLabels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  // Fetch assigned subjects when semester is selected
  useEffect(() => {
    if (!selectedSemester || !userUid) {
      setSubjects([]);
      return;
    }

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/subject-assignments/examiner/${userUid}`);
        const assignedSubjects = response.data.filter(s => s.semester === selectedSemester);
        setSubjects(assignedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedSemester, userUid]);

  // Reset subject when semester changes
  useEffect(() => {
    setSelectedSubject("");
    setSyllabusFile(null);
    setModelQPFile(null);
    setUploadStatus({ syllabus: null, modelQP: null });
  }, [selectedSemester]);

  // Fetch existing documents when subject is selected
  useEffect(() => {
    if (!selectedSubject || !selectedSemester) {
      setExistingDocs({ syllabus: null, modelQP: null });
      return;
    }

    const fetchExistingDocs = async () => {
      try {
        const subject = subjects.find(s => s._id === selectedSubject);
        if (!subject) return;

        const response = await axios.get(
          `${BACKEND_URL}/api/documents/check/${selectedSemester}/${subject.subjectCode}`
        );
        setExistingDocs(response.data);
      } catch (error) {
        console.error("Error fetching existing documents:", error);
        setExistingDocs({ syllabus: null, modelQP: null });
      }
    };

    fetchExistingDocs();
  }, [selectedSubject, selectedSemester, subjects]);

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "syllabus") {
        setSyllabusFile(file);
        setUploadStatus(prev => ({ ...prev, syllabus: null }));
      } else {
        setModelQPFile(file);
        setUploadStatus(prev => ({ ...prev, modelQP: null }));
      }
    }
  };

  const handleUpload = async (type) => {
    if (!selectedSubject) {
      alert("Please select a subject first");
      return;
    }

    const file = type === "syllabus" ? syllabusFile : modelQPFile;
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const subject = subjects.find(s => s._id === selectedSubject);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectCode", subject?.subjectCode);
    formData.append("semester", selectedSemester);
    formData.append("documentType", type);

    setUploading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadStatus(prev => ({
        ...prev,
        [type]: { success: true, message: response.data.message }
      }));

      // Clear file input
      if (type === "syllabus") setSyllabusFile(null);
      else setModelQPFile(null);

      // Reset file input
      const fileInput = document.getElementById(`${type}-input`);
      if (fileInput) fileInput.value = "";

      // Refresh existing documents
      const checkResponse = await axios.get(
        `${BACKEND_URL}/api/documents/check/${selectedSemester}/${subject.subjectCode}`
      );
      setExistingDocs(checkResponse.data);

    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        [type]: { success: false, message: error.response?.data?.message || "Upload failed" }
      }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="min-h-screen font-sans bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50">
        <main className="w-full max-w-[960px] mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
              Upload Documents
            </h1>
            <p className="text-sm text-[#6b85a3] mt-1 font-light">
              Upload syllabus and model question papers for your assigned subjects
            </p>
          </div>

          {/* Selection Card */}
          <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl shadow-[0_8px_32px_rgba(15,31,61,0.12)] overflow-hidden mb-6">
            <div className="h-1 w-full bg-gradient-to-r from-[#00c9a7] via-[#00e5c4] to-[#00a98c]" />
            
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Semester Selection */}
                <div>
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

                {/* Subject Selection */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-2 font-[Syne,sans-serif]">
                    Select Subject <span className="text-[#00c9a7]">*</span>
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedSemester || loading || subjects.length === 0}
                    className="w-full px-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] font-[DM_Sans,sans-serif] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loading ? "Loading subjects..." : subjects.length === 0 ? "No assigned subjects" : "Choose Subject"}
                    </option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subjectName} ({subject.subjectCode})
                      </option>
                    ))}
                  </select>
                  {selectedSemester && !loading && subjects.length === 0 && (
                    <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1 font-[DM_Sans,sans-serif]">
                      ⚠️ No subjects assigned for this semester
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Cards */}
          {selectedSubject && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Syllabus Upload Card */}
              <UploadCard
                title="Syllabus"
                icon="📄"
                file={syllabusFile}
                existingFile={existingDocs.syllabus}
                onFileChange={(e) => handleFileChange("syllabus", e)}
                onUpload={() => handleUpload("syllabus")}
                uploading={uploading}
                status={uploadStatus.syllabus}
                inputId="syllabus-input"
                acceptedFormats=".pdf,.doc,.docx"
              />

              {/* Model QP Upload Card */}
              <UploadCard
                title="Model Question Paper"
                icon="📝"
                file={modelQPFile}
                existingFile={existingDocs.modelQP}
                onFileChange={(e) => handleFileChange("modelQP", e)}
                onUpload={() => handleUpload("modelQP")}
                uploading={uploading}
                status={uploadStatus.modelQP}
                inputId="modelQP-input"
                acceptedFormats=".pdf,.doc,.docx"
              />
            </div>
          )}

          {/* Empty State */}
          {!selectedSubject && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#00c9a7]/10 border border-[#00c9a7]/20 flex items-center justify-center mb-5">
                <svg viewBox="0 0 32 32" className="w-10 h-10" fill="none">
                  <path d="M20 4H8a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V12l-8-8z" stroke="#00c9a7" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M20 4v8h8" stroke="#00c9a7" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M12 18h8M12 22h8M12 14h4" stroke="#00c9a7" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">
                Select Subject to Upload
              </h3>
              <p className="text-[13px] text-[#6b85a3] mt-1 max-w-[280px] font-[DM_Sans,sans-serif]">
                Choose a semester and subject to start uploading documents
              </p>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

/* Upload Card Component */
const UploadCard = ({ title, icon, file, existingFile, onFileChange, onUpload, uploading, status, inputId, acceptedFormats }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-2xl shadow-[0_8px_32px_rgba(15,31,61,0.1)] overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#00c9a7] to-[#00a98c]" />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c9a7] to-[#00a98c] flex items-center justify-center text-white text-xl shadow-[0_4px_10px_rgba(0,201,167,0.3)] shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">{title}</h3>
            <p className="text-[11px] text-[#6b85a3] font-[DM_Sans,sans-serif]">Upload PDF or Word document</p>
          </div>
        </div>

        {/* Existing File Display */}
        {existingFile && (
          <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-emerald-800 truncate font-[Syne,sans-serif]">
                    Current File
                  </p>
                  <p className="text-[10px] text-emerald-600 font-[DM_Sans,sans-serif]">
                    {formatFileSize(existingFile.size)} • {formatDate(existingFile.uploadedAt)}
                  </p>
                </div>
              </div>
              <a
                href={`${BACKEND_URL}${existingFile.downloadUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors font-[Syne,sans-serif] shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>
            <p className="text-[10px] text-emerald-700 italic font-[DM_Sans,sans-serif]">
              Upload a new file to replace this one
            </p>
          </div>
        )}

        {/* File Input */}
        <div className="mb-4">
          <label className="block">
            <input
              id={inputId}
              type="file"
              accept={acceptedFormats}
              onChange={onFileChange}
              className="hidden"
            />
            <div className="w-full px-4 py-6 border-2 border-dashed border-[#00c9a7]/30 rounded-xl bg-sky-50/50 hover:bg-sky-50 transition-all cursor-pointer group">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-[#00c9a7] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-[12px] font-semibold text-[#1a2e4a] font-[Syne,sans-serif]">
                  Click to browse {existingFile ? 'new ' : ''}file
                </p>
                <p className="text-[10px] text-[#6b85a3] mt-1 font-[DM_Sans,sans-serif]">
                  {acceptedFormats.replace(/\./g, "").toUpperCase()}
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Selected File */}
        {file && (
          <div className="mb-4 px-3 py-2 bg-[#00c9a7]/5 border border-[#00c9a7]/20 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00c9a7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[11px] font-medium text-[#1a2e4a] truncate">{file.name}</span>
            <span className="text-[10px] text-[#6b85a3] ml-auto shrink-0 font-[DM_Sans,sans-serif]">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        {/* Status Message */}
        {status && (
          <div className={`mb-4 px-3 py-2 rounded-lg text-[11px] font-medium ${
            status.success 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
            {status.message}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={onUpload}
          disabled={!file || uploading}
          className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-white bg-gradient-to-r from-[#00c9a7] to-[#00a98c] rounded-xl shadow-[0_4px_14px_rgba(0,201,167,0.35)] hover:shadow-[0_6px_20px_rgba(0,201,167,0.45)] hover:-translate-y-0.5 transition-all duration-200 font-[Syne,sans-serif] disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"/>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {existingFile ? 'Re-uploading...' : 'Uploading...'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {existingFile ? `Re-upload ${title}` : `Upload ${title}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadDocs;