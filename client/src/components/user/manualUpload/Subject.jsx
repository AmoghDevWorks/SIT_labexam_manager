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
const SearchableDropdown = ({ options, value, onChange, placeholder, required, label }) => {
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
    onChange(opt);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputBase} cursor-pointer flex items-center justify-between ${!value ? "text-[#6b85a3]/60" : ""}`}
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

      {isOpen && (
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
const VerificationRadio = ({ value, onChange, name }) => (
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-[0_4px_16px_rgba(251,146,60,0.15)]">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[12px] font-bold tracking-[0.08em] uppercase text-amber-900 font-[Syne,sans-serif]">
        Permission to use already existing Question Paper with same code (Yes / No) <span className="text-rose-500">*</span>
      </span>
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => {
          const isChecked = value === opt;
          return (
            <label
              key={opt}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border-2 transition-all duration-200 font-[Syne,sans-serif] ${
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
                onChange={() => onChange(opt)}
                className="sr-only"
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
const CountStepper = ({ label, value, onChange, min = 0 }) => {
  const num = parseInt(value, 10) || min;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b85a3] font-[Syne,sans-serif] whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-center border border-[#00c9a7]/25 rounded-xl overflow-hidden bg-sky-50">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(min, num - 1)))}
          className="w-8 h-8 flex items-center justify-center text-[#00c9a7] hover:bg-[#00c9a7]/10 transition-colors text-lg font-bold"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^\d+$/.test(v)) onChange(v);
          }}
          onBlur={() => { if (!value || parseInt(value, 10) < min) onChange(String(min)); }}
          className="w-10 text-center text-sm font-bold text-[#1a2e4a] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(String(num + 1))}
          className="w-8 h-8 flex items-center justify-center text-[#00c9a7] hover:bg-[#00c9a7]/10 transition-colors text-lg font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Internal Examiner Card
───────────────────────────────────────────── */
const InternalExaminerCard = ({ index, data, onChange, subjectId, internalExaminers }) => {
  const field = (key) => (val) => onChange(index, key, val);
  return (
    <div className="relative bg-gradient-to-br from-sky-50/80 to-emerald-50/40 border border-[#00c9a7]/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(15,31,61,0.05)]">
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
          onChange={field("name")}
          placeholder="Select or search examiner..."
          label="examiners"
          required
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   External Examiner Card
───────────────────────────────────────────── */
const ExternalExaminerCard = ({ index, data, onChange, subjectId }) => {
  const field = (key) => (val) => onChange(index, key, val);
  return (
    <div className="relative bg-gradient-to-br from-sky-50/80 to-blue-50/40 border border-[#00c9a7]/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(15,31,61,0.05)]">
      <div className="absolute -top-2.5 left-4">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#162847] to-[#0f1f3d] text-[#00c9a7] px-2.5 py-0.5 rounded-full font-[Syne,sans-serif] shadow-sm border border-[#00c9a7]/30">
          External #{index + 1}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label required>Name</Label>
          <Input placeholder="Dr. Examiner Name" value={data.name} onChange={(e) => field("name")(e.target.value)} required />
        </div>
        <div>
          <Label required>Years of Experience</Label>
          <Input 
            type="number" 
            min="0"
            placeholder="e.g. 10" 
            value={data.yearsOfExperience} 
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                field("yearsOfExperience")(value);
              }
            }}
            className={`${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            required 
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
          />
        </div>
        <div>
          <Label required>Email ID</Label>
          <Input type="email" placeholder="examiner@institution.edu" value={data.email} onChange={(e) => field("email")(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <Label required>Address</Label>
          <textarea
            rows={2}
            placeholder="Institution / College Address"
            value={data.address}
            onChange={(e) => field("address")(e.target.value)}
            className={`${inputBase} resize-none leading-relaxed`}
            required
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

  const [examinerCount, setExaminerCount] = useState("1");
  const [internals, setInternals] = useState([blankInternal()]);
  const [externals, setExternals] = useState([blankExternal()]);

  // API data
  const [subjects, setSubjects] = useState([]);
  const [assignedSubjectIds, setAssignedSubjectIds] = useState([]);
  const [internalExaminers, setInternalExaminers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        // The backend returns subjects directly, not assignments
        // So assignedRes.data is already an array of subject objects
        const assignedSubjectsFromAPI = assignedRes.data;
        console.log('Assigned subjects from API:', assignedSubjectsFromAPI);
        
        // Get assigned subject IDs
        const assignedIds = assignedSubjectsFromAPI.map(subject => subject._id);
        console.log('Assigned subject IDs:', assignedIds);
        setAssignedSubjectIds(assignedIds);
        
        // Filter subjects to only show assigned ones
        const allSubjects = subjectsRes.data.map(s => ({
          id: s._id,
          name: s.subjectName,
          code: s.subjectCode,
          semester: s.semester
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userUid]);

  const handleExaminerCount = (val) => {
    setExaminerCount(val);
    setInternals((prev) => syncArray(prev, val, blankInternal));
    setExternals((prev) => syncArray(prev, val, blankExternal));
  };

  const updateInternal = useCallback((idx, key, val) =>
    setInternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e))), []);

  const updateExternal = useCallback((idx, key, val) =>
    setExternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e))), []);

  // When subject name is selected, auto-fill subject code and semester
  const handleSubjectNameChange = (name) => {
    setSubjectName(name);
    const subject = subjects.find(s => s.name === name);
    if (subject) {
      setSubjectCode(subject.code);
      setSemester(subject.semester);
    }
  };

  // Filter subjects by selected semester
  const filteredSubjects = selectedSemester
    ? subjects.filter(s => s.semester === selectedSemester)
    : subjects;

  // Lift state up to App whenever anything changes
  useEffect(() => {
    if (onChange) {
      onChange(index, { subjectName, subjectCode, semester, studentsEnrolled, verification, internals, externals });
    }
  }, [subjectName, subjectCode, semester, studentsEnrolled, verification, internals, externals]);

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
            <SectionHeading icon="📚" title="Subject Details" subtitle="Core information about this subject" />
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
              <Label required>Subject Name</Label>
              {loading ? (
                <div className="w-full px-4 py-2.5 bg-sky-50 border border-[#00c9a7]/25 rounded-xl animate-pulse">
                  <div className="h-4 bg-[#00c9a7]/20 rounded"></div>
                </div>
              ) : (
                <SearchableDropdown
                  options={filteredSubjects.map(s => s.name)}
                  value={subjectName}
                  onChange={handleSubjectNameChange}
                  placeholder={selectedSemester ? "Select or search subject..." : "Select semester first..."}
                  label="subjects"
                  required
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
              <Label required>Subject Code</Label>
              <Input
                placeholder="Auto-filled from subject"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className={`${inputBase} ${subjectName ? 'bg-[#00c9a7]/5 font-semibold text-[#00a98c]' : ''}`}
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
                placeholder="e.g. 60"
                value={studentsEnrolled}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d+$/.test(v)) setStudentsEnrolled(v);
                }}
                className={`${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                required
              />
            </div>
          </div>

          <DividerLine />

          {/* Verification Field - At Subject Level */}
          <div className="mb-5">
            <VerificationRadio
              value={verification}
              onChange={setVerification}
              name={`subject-verification-${id}`}
            />
          </div>

          <DividerLine />

          {/* Examiners Count Control */}
          <div className="mb-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <SectionHeading icon="👥" title="Examiners" subtitle="Internal and External examiners (equal count)" />
              <CountStepper label="Count" value={examinerCount} onChange={handleExaminerCount} min={1} />
            </div>

            {/* Internal Examiners */}
            <div className="mb-6">
              <h4 className="text-[12px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]">🎓 Internal Examiners</h4>
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
                    />
                  ))}
                </div>
              )}
            </div>

            {/* External Examiners */}
            <div>
              <h4 className="text-[12px] font-bold text-[#1a2e4a] mb-3 font-[Syne,sans-serif]">🏛️ External Examiners</h4>
              <div className="flex flex-col gap-5">
                {externals.map((examiner, i) => (
                  <ExternalExaminerCard key={i} index={i} data={examiner} onChange={updateExternal} subjectId={id} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Subject;