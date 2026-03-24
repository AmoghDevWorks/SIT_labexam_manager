import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useUser } from "../../utils/userContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ─────────────────────────────────────────────
   Tiny reusable primitives
───────────────────────────────────────────── */

const Label = ({ children, required }) => (
  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-1.5 font-[Syne,sans-serif]">
    {children}
    {required && <span className="text-[#00c9a7] ml-0.5">*</span>}
  </label>
);

const inputBase =
  "w-full px-4 py-2.5 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] placeholder:text-[#6b85a3]/60 font-[DM_Sans,sans-serif]";

const Input = (props) => <input className={inputBase} {...props} />;

const guardNumberStep = (e) => {
  if (e.type === "wheel") {
    e.currentTarget.blur();
    return;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
};

const Select = ({ children, ...props }) => (
  <select
    className={`${inputBase} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300c9a7' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center]`}
    {...props}
  >
    {children}
  </select>
);

/* ─────────────────────────────────────────────
   Searchable Dropdown with Filtering
───────────────────────────────────────────── */
const SearchableDropdown = ({ options, value, onChange, placeholder, required, label, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt) => {
    if (disabled) return;
    onChange(opt);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${inputBase} ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : 'cursor-pointer'} flex items-center justify-between ${!value ? "text-[#6b85a3]/60" : ""}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg
          className={`w-3 h-3 text-[#00c9a7] transition-transform shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 12 8"
        >
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#00c9a7]/30 rounded-xl shadow-[0_8px_24px_rgba(15,31,61,0.15)] overflow-hidden">
          <div className="p-2 border-b border-[#00c9a7]/20">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label || 'options'}...`}
              className="w-full px-3 py-1.5 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/20 rounded-lg outline-none focus:border-[#00c9a7] placeholder:text-[#6b85a3]/50"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#6b85a3] text-center">No options found</div>
            ) : (
              filtered.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    opt === value
                      ? "bg-[#00c9a7]/10 text-[#00a98c] font-semibold"
                      : "text-[#1a2e4a] hover:bg-sky-50"
                  }`}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeading = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c9a7] to-[#00a98c] flex items-center justify-center text-white text-sm shadow-[0_4px_10px_rgba(0,201,167,0.3)] shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-[13px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">{title}</h3>
      {subtitle && <p className="text-[11px] text-[#6b85a3] mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const DividerLine = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-[#00c9a7]/30 to-transparent my-5" />
);

/* ─────────────────────────────────────────────
   Verification Radio
───────────────────────────────────────────── */
const VerificationRadio = ({ value, onChange, name, disabled }) => (
  <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-[0_4px_16px_rgba(251,146,60,0.15)] ${disabled ? 'opacity-70' : ''}`}>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[12px] font-bold tracking-[0.08em] uppercase text-amber-900 font-[Syne,sans-serif]">
        Permission to use already existing Question Paper with same code (Yes / No) <br></br> [Enter "YES" if the Subject Code of current year is same as previous year's] <span className="text-rose-500">*</span>
      </span>
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => {
          const isChecked = value === opt;
          return (
            <label
              key={opt}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} border-2 transition-all duration-200 font-[Syne,sans-serif] ${
                isChecked
                  ? opt === "Yes"
                    ? "bg-[#00c9a7]/15 border-[#00c9a7] text-[#00a98c] shadow-md"
                    : "bg-rose-100 border-rose-400 text-rose-600 shadow-md"
                  : "bg-white border-amber-300 text-[#6b85a3] hover:border-amber-400"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={isChecked}
                onChange={() => !disabled && onChange(opt)}
                className="sr-only"
                disabled={disabled}
              />
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                  isChecked
                    ? opt === "Yes"
                      ? "bg-[#00c9a7]"
                      : "bg-rose-500"
                    : "bg-amber-300"
                }`}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Count Stepper
───────────────────────────────────────────── */
const CountStepper = ({ label, value, onChange, min = 0, max, disabled }) => {
  const num = parseInt(value, 10) || min;
  const canDecrease = num > min;
  const canIncrease = max === undefined || num < max;
  
  return (
    <div className={`flex items-center gap-3 ${disabled ? 'opacity-70' : ''}`}>
      <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b85a3] font-[Syne,sans-serif] whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-center border border-[#00c9a7]/25 rounded-xl overflow-hidden bg-sky-50">
        <button
          type="button"
          onClick={() => !disabled && canDecrease && onChange(String(num - 1))}
          className={`w-8 h-8 flex items-center justify-center text-[#00c9a7] ${disabled || !canDecrease ? 'cursor-not-allowed opacity-40' : 'hover:bg-[#00c9a7]/10'} transition-colors text-lg font-bold`}
          disabled={disabled || !canDecrease}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^\d+$/.test(v)) {
              const numVal = parseInt(v, 10);
              if (!disabled && (v === "" || (numVal >= min && (max === undefined || numVal <= max)))) {
                onChange(v);
              }
            }
          }}
          onBlur={() => {
            if (!disabled) {
              let numVal = parseInt(value, 10);
              if (!value || numVal < min) {
                onChange(String(min));
              } else if (max !== undefined && numVal > max) {
                onChange(String(max));
              }
            }
          }}
          className="w-10 text-center text-sm font-bold text-[#1a2e4a] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => !disabled && canIncrease && onChange(String(num + 1))}
          className={`w-8 h-8 flex items-center justify-center text-[#00c9a7] ${disabled || !canIncrease ? 'cursor-not-allowed opacity-40' : 'hover:bg-[#00c9a7]/10'} transition-colors text-lg font-bold`}
          disabled={disabled || !canIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   File Upload Card
───────────────────────────────────────────── */
const UploadFileCard = ({ type, file, uploading, uploadStatus, onFileChange, onFileUpload, disabled, fileInputId }) => {
  const isUploadSuccess = uploadStatus?.success === true;
  const isUploadError = uploadStatus?.success === false;
  
  const typeInfo = {
    syllabus: { icon: '📄', title: 'Syllabus Copy', color: 'from-blue-500 to-blue-600' },
    modelQP: { icon: '❓', title: 'Model Question Paper', color: 'from-purple-500 to-purple-600' }
  };
  
  const info = typeInfo[type];

  return (
    <div className={`bg-gradient-to-br from-sky-50/80 to-emerald-50/40 border-2 rounded-xl p-4 transition-all ${disabled ? 'opacity-70' : ''} ${
      isUploadSuccess
        ? 'border-emerald-400/50 bg-emerald-50/50'
        : isUploadError
        ? 'border-rose-400/50 bg-rose-50/50'
        : 'border-[#00c9a7]/20'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-white text-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)]`}>
            {info.icon}
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">{info.title}</h4>
            <p className="text-[10px] text-[#6b85a3] mt-0.5">Upload PDF or Word document</p>
          </div>
        </div>
        {isUploadSuccess && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-300 font-[Syne,sans-serif]">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            Uploaded
          </span>
        )}
      </div>

      {file && !isUploadSuccess && (
        <div className="mb-3 px-3 py-2 bg-[#00c9a7]/10 border border-[#00c9a7]/30 rounded-lg">
          <p className="text-[11px] font-semibold text-[#00a98c] font-[DM_Sans,sans-serif] truncate">
            {file.name}
          </p>
        </div>
      )}

      {uploadStatus && (
        <div className={`mb-3 px-3 py-2 rounded-lg border text-[10px] font-[DM_Sans,sans-serif] ${
          isUploadSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {uploadStatus.message}
        </div>
      )}

      {!isUploadSuccess && (
        <div className="flex gap-2">
          <label className="flex-1">
            <input
              id={fileInputId}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFileChange(type, e)}
              disabled={disabled || uploading}
              className="hidden"
            />
            <span className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 border border-[#00c9a7]/25 rounded-lg cursor-pointer transition-all hover:border-[#00c9a7]/50 text-[12px] font-semibold text-[#1a2e4a] font-[Syne,sans-serif] ${
              disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Choose File
            </span>
          </label>
          {file && (
            <button
              type="button"
              onClick={() => onFileUpload(type)}
              disabled={disabled || uploading}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00c9a7] to-[#00a98c] rounded-lg text-white font-semibold text-[12px] transition-all shadow-[0_4px_12px_rgba(0,201,167,0.3)] hover:shadow-[0_6px_20px_rgba(0,201,167,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-[Syne,sans-serif] ${
                uploading ? 'animate-pulse' : ''
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Internal Examiner Card
───────────────────────────────────────────── */
const InternalExaminerCard = ({ index, data, onChange, subjectId, internalExaminers, disabled }) => {
  const field = (key) => (val) => !disabled && onChange(index, key, val);
  return (
    <div className={`relative bg-gradient-to-br from-sky-50/80 to-emerald-50/40 border border-[#00c9a7]/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(15,31,61,0.05)] ${disabled ? 'opacity-70' : ''}`}>
      <div className="absolute -top-2.5 left-4">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white px-2.5 py-0.5 rounded-full font-[Syne,sans-serif] shadow-sm">
          Internal #{index + 1}
        </span>
      </div>
      <div className="mt-2">
        <Label required>Name</Label>
        <SearchableDropdown
          options={internalExaminers}
          value={data.name}
          onChange={(val) => field("name")(val)}
          placeholder="Select internal examiner..."
          label="internal examiners"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   External Examiner Card
───────────────────────────────────────────── */
const ExternalExaminerCard = ({ index, data, onChange, subjectId, disabled }) => {
  const field = (key) => (val) => !disabled && onChange(index, key, val);
  return (
    <div className={`relative bg-gradient-to-br from-sky-50/80 to-blue-50/40 border border-[#00c9a7]/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(15,31,61,0.05)] ${disabled ? 'opacity-70' : ''}`}>
      <div className="absolute -top-2.5 left-4">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#162847] to-[#0f1f3d] text-[#00c9a7] px-2.5 py-0.5 rounded-full font-[Syne,sans-serif] shadow-sm border border-[#00c9a7]/30">
          External #{index + 1}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label required>Name</Label>
          <Input 
            placeholder="Dr. Examiner Name" 
            value={data.name} 
            onChange={(e) => field("name")(e.target.value)} 
            required 
            disabled={disabled}
          />
        </div>
        <div>
          <Label required>Years of Experience</Label>
          <Input 
            type="number" 
            min="3"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 10" 
            value={data.yearsOfExperience} 
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                field("yearsOfExperience")(value);
              }
            }}
            onWheel={guardNumberStep}
            onKeyDown={guardNumberStep}
            className={`${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            required 
            disabled={disabled}
          />
        </div>
        <div>
          <Label required>Contact Number</Label>
          <Input 
            type="tel" 
            placeholder="98765 xxxxx" 
            value={data.contact} 
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              if (value.length <= 10) {
                field("contact")(value);
              }
            }}
            maxLength={10}
            required 
            disabled={disabled}
          />
        </div>
        <div>
          <Label required>Email ID</Label>
          <Input 
            type="email" 
            placeholder="examiner@institution.edu" 
            value={data.email} 
            onChange={(e) => field("email")(e.target.value)} 
            required 
            disabled={disabled}
          />
        </div>
        <div className="sm:col-span-2">
          <Label required>Address <span className="text-black">[ Enter full college name, department, street details with pincode ]</span></Label>
          <textarea
            rows={2}
            placeholder="Institution / College Address"
            value={data.address}
            onChange={(e) => field("address")(e.target.value)}
            className={`${inputBase} resize-none leading-relaxed`}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Blank factories & sync helper
───────────────────────────────────────────── */
const blankInternal = () => ({ name: "" });
const blankExternal = () => ({ name: "", address: "", contact: "", email: "", yearsOfExperience: "" });

const syncArray = (arr, count, blank) => {
  const n = parseInt(count, 10) || 0;
  if (n > arr.length) return [...arr, ...Array.from({ length: n - arr.length }, blank)];
  return arr.slice(0, n);
};

let _subjectId = 0;

/* ─────────────────────────────────────────────
   Main Subject Component
───────────────────────────────────────────── */
const Subject = ({ index, onChange }) => {
  const [id] = useState(() => ++_subjectId);
  const { userUid, userName } = useUser(); // Get logged-in examiner ID and name

  console.log('Subject component - userUid:', userUid, 'userName:', userName);

  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState("");
  const [studentsEnrolled, setStudentsEnrolled] = useState("");
  const [verification, setVerification] = useState("No");
  const [existingSubjectCode, setExistingSubjectCode] = useState("");

  const [internalCount, setInternalCount] = useState("1");
  const [externalCount, setExternalCount] = useState("1");
  const [internals, setInternals] = useState([blankInternal()]);
  const [externals, setExternals] = useState([blankExternal()]);

  // API data
  const [subjects, setSubjects] = useState([]);
  const [assignedSubjectIds, setAssignedSubjectIds] = useState([]);
  const [internalExaminers, setInternalExaminers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Existing data check
  const [isDataLocked, setIsDataLocked] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(false);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // File upload states (for when verification is "No")
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [modelQPFile, setModelQPFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ syllabus: null, modelQP: null });
  const [formValidation, setFormValidation] = useState({ isValid: true, errors: [] });

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  // File upload handlers
  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "syllabus") {
        setSyllabusFile(file);
        setUploadStatus(prev => ({ ...prev, syllabus: null }));
      } else if (type === "modelQP") {
        setModelQPFile(file);
        setUploadStatus(prev => ({ ...prev, modelQP: null }));
      }
    }
  };

  const handleFileUpload = async (type) => {
    if (!subjectCode) {
      showToast("Please select a subject code first", 'error');
      return;
    }

    const file = type === "syllabus" ? syllabusFile : modelQPFile;
    if (!file) {
      showToast(`Please select a ${type} file to upload`, 'error');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectCode", subjectCode);
    formData.append("subjectName", subjectName);
    formData.append("semester", semester);
    formData.append("documentType", type);

    setUploading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setUploadStatus(prev => ({
        ...prev,
        [type]: { success: true, message: response.data.message }
      }));

      showToast(response.data.message || 'File uploaded successfully', 'success');

      // Clear file input
      if (type === "syllabus") {
        setSyllabusFile(null);
      } else {
        setModelQPFile(null);
      }

      // Reset file input
      const fileInput = document.getElementById(`${type}-file-input-${id}`);
      if (fileInput) fileInput.value = "";

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Upload failed";
      setUploadStatus(prev => ({
        ...prev,
        [type]: { success: false, message: errorMsg }
      }));
      showToast(errorMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  // Validation function to check if form is valid for submission
  const validateForm = () => {
    const errors = [];
    
    // Check required fields
    if (!subjectCode) errors.push("Subject code is required");
    if (!subjectName) errors.push("Subject name is required");
    if (!semester) errors.push("Semester is required");
    if (!studentsEnrolled) errors.push("Number of students enrolled is required");
    
    // Check examiners
    const allInternalsSelected = internals.every(e => e.name);
    if (!allInternalsSelected) errors.push("All internal examiners must be selected");
    
    const allExternalsValid = externals.every(e => e.name && e.email && e.contact && e.yearsOfExperience && e.address);
    if (!allExternalsValid) errors.push("All external examiner details must be filled");
    
    // Check file uploads when verification is "No"
    if (verification === "No") {
      // Check if files have been successfully uploaded (uploadStatus shows success)
      if (!uploadStatus.syllabus?.success) errors.push("Syllabus copy must be uploaded before submitting");
      if (!uploadStatus.modelQP?.success) errors.push("Model Question Paper must be uploaded before submitting");
    }
    
    // Check existing subject code when verification is "Yes"
    if (verification === "Yes" && !existingSubjectCode) {
      errors.push("Existing subject code is required when using previous year's question paper");
    }
    
    const isValid = errors.length === 0;
    setFormValidation({ isValid, errors });
    return isValid;
  };

  // Expose validation function through window object so parent can call it
  useEffect(() => {
    window[`validateForm_${id}`] = validateForm;
    return () => delete window[`validateForm_${id}`];
  }, [id, subjectCode, subjectName, semester, studentsEnrolled, internals, externals, verification, existingSubjectCode, uploadStatus]);

  // Reset files and form validation when verification changes
  useEffect(() => {
    if (verification === "Yes") {
      // Clear file uploads when switching to "Yes"
      setSyllabusFile(null);
      setModelQPFile(null);
      setUploadStatus({ syllabus: null, modelQP: null });
    }
    setFormValidation({ isValid: true, errors: [] });
  }, [verification]);

  // Check for duplicate external examiner (by name + phone composite key)
  const checkExternalExaminerDuplicate = async (name, contact) => {
    if (!name || !contact || contact.length < 10) {
      return null;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/exam-data/check-external-examiner/duplicate`,
        { 
          name, 
          contact,
          currentSemester: semester,
          currentSubjectCode: subjectCode
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.exists) {
        return {
          exists: true,
          isSameSubject: response.data.isSameSubject,
          examinerDetails: response.data.examinerDetails,
          existingSubject: response.data.existingSubject,
          message: response.data.message
        };
      }
      return { exists: false };
    } catch (error) {
      console.error('Error checking duplicate examiner:', error);
      return null;
    }
  };

  // Duplicate examiner warning modal
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [pendingExternalUpdate, setPendingExternalUpdate] = useState(null);

  // Fetch subjects and internal examiners on mount
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data... userUid:', userUid);
      
      if (!userUid) {
        console.log('No userUid found, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('Making API calls...');
        
        // Fetch all data including assigned subjects for this examiner
        const [subjectsRes, examinersRes, assignedRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/subjects`),
          axios.get(`${BACKEND_URL}/api/internal-examiners`),
          axios.get(`${BACKEND_URL}/api/subject-assignments/examiner/${userUid}`)
        ]);
        
        console.log('Subjects response:', subjectsRes.data);
        console.log('Examiners response:', examinersRes.data);
        console.log('Assignments response:', assignedRes.data);
        
        // The backend returns assignment objects with populated subjectId
        const assignments = assignedRes.data;
        console.log('Assignments from API:', assignments);
        
        // Get assigned subject IDs from the populated subjectId field
        const assignedIds = assignments.map(assignment => assignment.subjectId?._id).filter(Boolean);
        console.log('Assigned subject IDs:', assignedIds);
        setAssignedSubjectIds(assignedIds);
        
        // Filter subjects to only show assigned ones
        const allSubjects = subjectsRes.data.map(s => ({
          id: s._id,
          name: s.subjectName,
          code: s.subjectCode,
          semester: s.semester,
          numberOfExternal: s.numberOfExternal || 1
        }));
        
        console.log('All subjects:', allSubjects);
        
        const assignedSubjects = allSubjects.filter(s => assignedIds.includes(s.id));
        console.log('Filtered assigned subjects:', assignedSubjects);
        setSubjects(assignedSubjects);
        
        // Map internal examiners
        const examinersData = examinersRes.data.map(e => e.name);
        console.log('Internal examiners:', examinersData);
        setInternalExaminers(examinersData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        console.error("Error details:", err.response?.data);
        showToast('Failed to load subjects and examiners', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userUid]);

  // Check for existing exam data when semester and subject are selected
  useEffect(() => {
    const checkExistingData = async () => {
      if (!semester || !subjectCode) {
        setIsDataLocked(false);
        setExistingData(null);
        return;
      }

      setCheckingExisting(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/exam-data/check/${semester}/${subjectCode}`
        );
        
        if (response.data.exists) {
          console.log('Existing exam data found:', response.data.data);
          const data = response.data.data;
          
          // Populate form with existing data
          setStudentsEnrolled(data.studentsEnrolled?.toString() || "");
          setVerification(data.verification || "No");
          setExistingSubjectCode(data.existingSubjectCode || "");
          
          // Set internal examiners
          if (data.internals && data.internals.length > 0) {
            const internalData = data.internals.map(ie => ({
              name: ie.name || ""
            }));
            setInternals(internalData);
            setInternalCount(internalData.length.toString());
          }
          
          // Set external examiners
          if (data.externals && data.externals.length > 0) {
            const externalData = data.externals.map(ee => ({
              name: ee.name || "",
              address: ee.address || "",
              contact: ee.contact || "",
              email: ee.email || "",
              yearsOfExperience: ee.yearsOfExperience?.toString() || ""
            }));
            setExternals(externalData);
            setExternalCount(externalData.length.toString());
          }
          
          setExistingData(data);
          setIsDataLocked(true);
        } else {
          // No existing data, reset to normal state
          setIsDataLocked(false);
          setExistingData(null);
        }
      } catch (err) {
        console.error("Error checking existing data:", err);
        showToast('Error checking existing data', 'error');
        // On error, allow editing
        setIsDataLocked(false);
        setExistingData(null);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingData();
  }, [semester, subjectCode]);

  const handleInternalCount = (val) => {
    setInternalCount(val);
    setInternals((prev) => syncArray(prev, val, blankInternal));
  };

  const handleExternalCount = (val) => {
    setExternalCount(val);
    setExternals((prev) => syncArray(prev, val, blankExternal));
  };

  const updateInternal = useCallback((idx, key, val) =>
    setInternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e))), []);

  const updateExternal = useCallback((idx, key, val) => {
    // When updating external examiner, check for duplicates if name and contact are being set
    if ((key === 'name' || key === 'contact') && val) {
      const currentExternal = externals[idx];
      const nameToCheck = key === 'name' ? val : currentExternal.name;
      const contactToCheck = key === 'contact' ? val : currentExternal.contact;

      // Only check if both name and contact are filled
      if (nameToCheck && contactToCheck && contactToCheck.length === 10) {
        checkExternalExaminerDuplicate(nameToCheck, contactToCheck).then(result => {
          if (result && result.exists) {
            // Show warning modal with existing examiner details
            setDuplicateWarning(result);
            setPendingExternalUpdate({ idx, key, val });
            return; // Don't update yet
          }
        });
      }
    }

    // Update the external examiner
    setExternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e)));
  }, [externals, checkExternalExaminerDuplicate]);

  // When subject code is selected, auto-fill subject name and semester
  const handleSubjectCodeChange = (code) => {
    setSubjectCode(code);
    const subject = subjects.find(s => s.code === code);
    if (subject) {
      setSubjectName(subject.name);
      setSemester(subject.semester);
      // Set external count based on subject's numberOfExternal
      const extCount = subject.numberOfExternal || 1;
      setExternalCount(extCount.toString());
      setExternals(syncArray(externals, extCount.toString(), blankExternal));
    }
  };

  // Filter subjects by selected semester
  const filteredSubjects = selectedSemester
    ? subjects.filter(s => s.semester === selectedSemester)
    : subjects;

  // Reset form data when semester changes
  useEffect(() => {
    // Reset all form fields when semester changes (but not on initial mount)
    if (selectedSemester) {
      setSubjectName("");
      setSubjectCode("");
      setSemester("");
      setStudentsEnrolled("");
      setVerification("No");
      setExistingSubjectCode("");
      setInternalCount("1");
      setExternalCount("1");
      setInternals([blankInternal()]);
      setExternals([blankExternal()]);
      setIsDataLocked(false);
      setExistingData(null);
    }
  }, [selectedSemester]);

  // Reset form data when subject changes (not on initial mount or semester change)
  const prevSubjectRef = useRef("");
  useEffect(() => {
    // Only reset if subject actually changed (not empty -> filled, but filled -> different)
    if (prevSubjectRef.current && subjectCode && prevSubjectRef.current !== subjectCode) {
      setStudentsEnrolled("");
      setVerification("No");
      setExistingSubjectCode("");
      setInternalCount("1");
      setExternalCount("1");
      setInternals([blankInternal()]);
      setExternals([blankExternal()]);
    }
    prevSubjectRef.current = subjectCode;
  }, [subjectCode]);

  // Lift state up to App whenever anything changes
  useEffect(() => {
    if (onChange) {
      onChange(index, { 
        subjectName, 
        subjectCode, 
        semester, 
        studentsEnrolled, 
        verification, 
        existingSubjectCode, 
        internals, 
        externals, 
        isDataLocked,
        uploadStatus,
        isFormValid: formValidation.isValid,
        validateForm
      });
    }
  }, [subjectName, subjectCode, semester, studentsEnrolled, verification, existingSubjectCode, internals, externals, isDataLocked, uploadStatus, formValidation]);

  const semesterLabels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-2xl shadow-[0_8px_32px_rgba(15,31,61,0.1)] overflow-hidden my-2">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00c9a7] via-[#00e5c4] to-[#00a98c]" />

        <div className="p-6 sm:p-8">

          {/* Subject number badge */}
          <div className="flex items-center justify-between mb-5">
            <SectionHeading icon="" title="Subject Details" subtitle="Core information about this subject" />
            <div className="flex items-center gap-2">
              {userUid && (
                <span className="text-[10px] font-semibold tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full font-[Syne,sans-serif]">
                  ✓ Logged in{userName ? `: ${userName}` : ''}
                </span>
              )}
              <span className="text-[11px] font-bold tracking-widest uppercase bg-[#0f1f3d]/8 border border-[#00c9a7]/20 text-[#6b85a3] px-3 py-1 rounded-full font-[Syne,sans-serif]">
                Subject #{index + 1}
              </span>
            </div>
          </div>

          {/* Semester Filter */}
          <div className="mb-5 bg-gradient-to-r from-[#00c9a7]/5 to-emerald-50/50 border border-[#00c9a7]/30 rounded-xl p-4">
            <Label required>Select Semester First</Label>
            {!userUid ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="currentColor">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                </svg>
                Please log in to access subjects
              </div>
            ) : (
              <Select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required>
                <option value="" disabled>Choose Semester</option>
                {semesterLabels.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div>
              <Label required>Subject Code</Label>
              {loading ? (
                <div className="w-full px-4 py-2.5 bg-sky-50 border border-[#00c9a7]/25 rounded-xl animate-pulse">
                  <div className="h-4 bg-[#00c9a7]/20 rounded"></div>
                </div>
              ) : (
                <SearchableDropdown
                  options={filteredSubjects.map(s => s.code)}
                  value={subjectCode}
                  onChange={handleSubjectCodeChange}
                  placeholder={selectedSemester ? "Select or search subject code..." : "Select semester first..."}
                  label="subject codes"
                  required
                  disabled={!selectedSemester}
                />
              )}
              {selectedSemester && filteredSubjects.length === 0 && (
                <p className="text-[11px] text-amber-600 mt-1.5 font-[DM_Sans,sans-serif]">⚠️ No assigned subjects found for Semester {selectedSemester}</p>
              )}
              {!selectedSemester && subjects.length === 0 && !loading && (
                <p className="text-[11px] text-rose-600 mt-1.5 font-[DM_Sans,sans-serif] flex items-center gap-1">
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                  </svg>
                  No subjects assigned to you. Please contact admin.
                </p>
              )}
            </div>
            <div>
              <Label required>Subject Name</Label>
              <Input
                placeholder="Auto-filled from subject code"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className={`${inputBase} ${subjectCode ? 'bg-[#00c9a7]/5 font-semibold text-[#00a98c]' : ''}`}
                required
                readOnly
              />
            </div>
            <div>
              <Label required>Semester</Label>
              <Input
                placeholder="Auto-filled from subject"
                value={semester ? `Semester ${semester}` : ""}
                className={`${inputBase} ${semester ? 'bg-[#00c9a7]/5 font-semibold text-[#00a98c]' : ''}`}
                readOnly
              />
            </div>
            <div>
              <Label required>No. of Students Enrolled</Label>
              <Input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="e.g. 60"
                value={studentsEnrolled}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d+$/.test(v)) setStudentsEnrolled(v);
                }}
                onWheel={guardNumberStep}
                onKeyDown={guardNumberStep}
                className={`${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                required
                disabled={isDataLocked || !selectedSemester || !subjectCode}
              />
            </div>
          </div>

          {/* Locked Data Warning Banner */}
          {isDataLocked && (
            <div className="mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-amber-900 mb-1 font-[Syne,sans-serif]">
                    ⚠️ Data Already Submitted - Read-Only Mode
                  </h4>
                  <p className="text-xs text-amber-800 font-[DM_Sans,sans-serif] leading-relaxed">
                    Exam data for this semester and subject has already been submitted. All fields are locked to prevent accidental changes. 
                    If you need to make updates, please contact the administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DividerLine />

          {/* Examiners Count Control */}
          <div className="mb-5">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <SectionHeading icon="" title="Examiners" subtitle="Configure internal and external examiners" />
              <div className="flex flex-col gap-3">
                <CountStepper 
                  label="Internal" 
                  value={internalCount} 
                  onChange={handleInternalCount} 
                  min={1} 
                  disabled={isDataLocked || !selectedSemester || !subjectCode} 
                />
                <CountStepper 
                  label="External" 
                  value={externalCount} 
                  onChange={handleExternalCount} 
                  min={1} 
                  disabled={isDataLocked || !selectedSemester || !subjectCode} 
                />
              </div>
            </div>

            {/* Internal Examiners */}
            <div className="mb-6">
              <h4 className="text-[12px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]"> Internal Examiners</h4>
              {loading ? (
                <div className="bg-sky-50 border border-[#00c9a7]/25 rounded-xl p-4 animate-pulse">
                  <div className="h-10 bg-[#00c9a7]/20 rounded"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {internals.map((examiner, i) => (
                    <InternalExaminerCard 
                      key={i} 
                      index={i} 
                      data={examiner} 
                      onChange={updateInternal} 
                      subjectId={id}
                      internalExaminers={internalExaminers}
                      disabled={isDataLocked || !selectedSemester || !subjectCode}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* External Examiners */}
            <div className="mb-5">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                <h4 className="text-[12px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">️ External Examiners</h4>
                <span className="text-[11px] font-bold tracking-widest uppercase bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full font-[Syne,sans-serif]">
                  {externalCount} {parseInt(externalCount) === 1 ? 'Examiner' : 'Examiners'}
                </span>
              </div>
              <div className="flex flex-col gap-5">
                {externals.map((examiner, i) => (
                  <ExternalExaminerCard key={i} index={i} data={examiner} onChange={updateExternal} subjectId={id} disabled={isDataLocked || !selectedSemester || !subjectCode} />
                ))}
              </div>
            </div>
          </div>

          <DividerLine />

          {/* Verification Field - At Subject Level */}
          <div className="mb-5">
            <VerificationRadio
              value={verification}
              onChange={setVerification}
              name={`subject-verification-${id}`}
              disabled={isDataLocked || !selectedSemester || !subjectCode}
            />
          </div>

          {/* File Upload Section - Shows when verification is No */}
          {verification === "No" && (
            <div className="mb-5">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c9a7] to-[#00a98c] flex items-center justify-center text-white text-sm shadow-[0_4px_10px_rgba(0,201,167,0.3)] shrink-0">
                    📦
                  </div>
                  <h3 className="text-[13px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">
                    Document Upload Required
                  </h3>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#00c9a7]/10 border border-[#00c9a7]/30 text-[#00a98c] px-2 py-0.5 rounded-full font-[Syne,sans-serif]">
                    Required
                  </span>
                </div>
                <p className="text-[11px] text-[#6b85a3] font-[DM_Sans,sans-serif] mb-3">
                  Since you are not using an existing question paper, please upload both syllabus and model question paper for this subject. Both files will be validated to ensure they contain the correct subject code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadFileCard
                  type="syllabus"
                  file={syllabusFile}
                  uploading={uploading}
                  uploadStatus={uploadStatus.syllabus}
                  onFileChange={handleFileChange}
                  onFileUpload={handleFileUpload}
                  disabled={isDataLocked || !selectedSemester || !subjectCode}
                  fileInputId={`syllabus-file-input-${id}`}
                />
                <UploadFileCard
                  type="modelQP"
                  file={modelQPFile}
                  uploading={uploading}
                  uploadStatus={uploadStatus.modelQP}
                  onFileChange={handleFileChange}
                  onFileUpload={handleFileUpload}
                  disabled={isDataLocked || !selectedSemester || !subjectCode}
                  fileInputId={`modelQP-file-input-${id}`}
                />
              </div>
            </div>
          )}

          {/* Validation Errors Display */}
          {!formValidation.isValid && formValidation.errors.length > 0 && (
            <div className="mb-5 bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 rounded-xl p-4 shadow-[0_4px_16px_rgba(244,63,94,0.15)]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-white text-sm shadow-[0_4px_10px_rgba(244,63,94,0.3)] shrink-0 mt-0.5">
                  ⚠️
                </div>
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold text-rose-900 mb-2 font-[Syne,sans-serif]">
                    Form Validation Errors
                  </h4>
                  <ul className="space-y-1">
                    {formValidation.errors.map((error, idx) => (
                      <li key={idx} className="text-[11px] text-rose-800 font-[DM_Sans,sans-serif] flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Existing Subject Code Field - Shows when verification is Yes */}
          {verification === "Yes" && (
            <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-[0_4px_16px_rgba(59,130,246,0.15)]">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-[0_4px_10px_rgba(59,130,246,0.3)] shrink-0">
                  
                </div>
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold text-blue-900 font-[Syne,sans-serif] mb-1">
                    Enter the Subject Code of the Existing Subject
                  </h4>
                  <p className="text-[10px] text-blue-700 font-[DM_Sans,sans-serif]">
                    Since you selected "Yes" for using existing question paper, please provide the subject code from the previous year.
                  </p>
                </div>
              </div>
              <Input
                placeholder="e.g. 18CSL66 (Previous year subject code)"
                value={existingSubjectCode}
                onChange={(e) => setExistingSubjectCode(e.target.value.toUpperCase())}
                disabled={isDataLocked || !selectedSemester || !subjectCode}
                className="w-full px-3 py-1.5 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/20 rounded-lg outline-none focus:border-[#00c9a7] placeholder:text-[#6b85a3]/50"
              />
            </div>
          )}

        </div>
      </div>

      {/* Duplicate External Examiner Warning Modal */}
      {duplicateWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-md w-full overflow-hidden ${
            duplicateWarning.isSameSubject 
              ? 'border border-amber-200/50' 
              : 'border border-red-200/50'
          }`}>
            {/* Modal Header */}
            <div className={`px-8 py-6 border-b ${
              duplicateWarning.isSameSubject
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500/20'
                : 'bg-gradient-to-r from-red-600 to-red-700 border-red-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      {duplicateWarning.isSameSubject ? (
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M12 9v2m0 4v2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      )}
                    </svg>
                  </div>
                  <h2 className="text-[22px] font-bold text-white font-[Syne,sans-serif]">
                    {duplicateWarning.isSameSubject ? 'Duplicate Examiner' : 'Examiner Assigned'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setDuplicateWarning(null);
                    setPendingExternalUpdate(null);
                  }}
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
              {/* Warning Message */}
              <div className={`mb-6 border rounded-xl p-4 ${
                duplicateWarning.isSameSubject
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 shrink-0 mt-0.5 ${
                    duplicateWarning.isSameSubject
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`} viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="flex-1">
                    <p className={`text-sm font-bold mb-1 font-[Syne,sans-serif] ${
                      duplicateWarning.isSameSubject
                        ? 'text-amber-900'
                        : 'text-red-900'
                    }`}>
                      {duplicateWarning.isSameSubject ? 'Duplicate Found' : 'Already Assigned'}
                    </p>
                    <p className={`text-xs font-[DM_Sans,sans-serif] ${
                      duplicateWarning.isSameSubject
                        ? 'text-amber-800'
                        : 'text-red-800'
                    }`}>
                      {duplicateWarning.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Examiner Details */}
              {duplicateWarning.examinerDetails && (
                <div className="mb-6 bg-sky-50 border border-[#00c9a7]/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-3 font-[Syne,sans-serif]">Examiner Details</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-[#6b85a3] font-[Syne,sans-serif]">Name</p>
                      <p className="text-sm font-semibold text-[#1a2e4a] font-[DM_Sans,sans-serif]">{duplicateWarning.examinerDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-[#6b85a3] font-[Syne,sans-serif]">Phone</p>
                      <p className="text-sm font-semibold text-[#1a2e4a] font-[DM_Sans,sans-serif]">{duplicateWarning.examinerDetails.contact}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-[#6b85a3] font-[Syne,sans-serif]">Email</p>
                      <p className="text-sm font-semibold text-[#1a2e4a] font-[DM_Sans,sans-serif]">{duplicateWarning.examinerDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-[#6b85a3] font-[Syne,sans-serif]">Experience</p>
                      <p className="text-sm font-semibold text-[#1a2e4a] font-[DM_Sans,sans-serif]">{duplicateWarning.examinerDetails.yearsOfExperience} years</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Info */}
              {duplicateWarning.existingSubject && (
                <div className={`mb-6 border rounded-xl p-4 ${
                  duplicateWarning.isSameSubject
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 font-[Syne,sans-serif] ${
                    duplicateWarning.isSameSubject
                      ? 'text-blue-900'
                      : 'text-amber-900'
                  }`}>
                    {duplicateWarning.isSameSubject ? 'Current Subject' : 'Already Used For'}
                  </p>
                  <div className={`space-y-2 text-xs font-[DM_Sans,sans-serif] ${
                    duplicateWarning.isSameSubject
                      ? 'text-blue-800'
                      : 'text-amber-800'
                  }`}>
                    <p><span className="font-semibold">Semester:</span> {duplicateWarning.existingSubject.semester}</p>
                    <p><span className="font-semibold">Code:</span> {duplicateWarning.existingSubject.subjectCode}</p>
                    <p><span className="font-semibold">Subject:</span> {duplicateWarning.existingSubject.subjectName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setDuplicateWarning(null);
                  setPendingExternalUpdate(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-[14px] font-bold font-[Syne,sans-serif] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (pendingExternalUpdate) {
                    const { idx, key, val } = pendingExternalUpdate;
                    setExternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e)));
                  }
                  const toastMessage = duplicateWarning.isSameSubject
                    ? 'Examiner added (duplicate in same subject)'
                    : 'Examiner added (reused from different subject)';
                  showToast(toastMessage, 'success');
                  setDuplicateWarning(null);
                  setPendingExternalUpdate(null);
                }}
                className={`flex-1 group relative flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${
                  duplicateWarning.isSameSubject
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                    : 'bg-gradient-to-r from-red-600 to-red-700'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative text-[14px] font-bold font-[Syne,sans-serif]">Proceed Anyway</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto min-w-[300px] max-w-md px-5 py-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md border transform transition-all duration-300 ease-out animate-[slideInRight_0.3s_ease-out] ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-emerald-500/95 to-emerald-600/95 border-emerald-400/50'
                : 'bg-gradient-to-r from-rose-500/95 to-rose-600/95 border-rose-400/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-[DM_Sans,sans-serif] text-[14px] font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Subject;