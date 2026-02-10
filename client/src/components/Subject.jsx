import React, { useState } from "react";

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

const SectionHeading = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c9a7] to-[#00a98c] flex items-center justify-center text-white text-sm shadow-[0_4px_10px_rgba(0,201,167,0.3)] shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-[13px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">{title}</h3>
      {subtitle && <p className="text-[11px] text-[#6b85a3] mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 backdrop-blur-sm border border-[#00c9a7]/15 rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,31,61,0.07)] ${className}`}
  >
    {children}
  </div>
);

const DividerLine = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-[#00c9a7]/30 to-transparent my-5" />
);

/* ─────────────────────────────────────────────
   Verification Radio
───────────────────────────────────────────── */
const VerificationRadio = ({ value, onChange, name }) => (
  <div className="flex items-center gap-2">
    <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b85a3] font-[Syne,sans-serif]">
      Verification
    </span>
    <div className="flex gap-2 ml-1">
      {["Yes", "No"].map((opt) => {
        const isChecked = value === opt;
        return (
          <label
            key={opt}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer border transition-all duration-200 font-[Syne,sans-serif] ${
              isChecked
                ? opt === "Yes"
                  ? "bg-[#00c9a7]/15 border-[#00c9a7] text-[#00a98c]"
                  : "bg-rose-50 border-rose-300 text-rose-500"
                : "bg-sky-50 border-[#00c9a7]/20 text-[#6b85a3] hover:border-[#00c9a7]/50"
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
              className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                isChecked
                  ? opt === "Yes"
                    ? "bg-[#00c9a7]"
                    : "bg-rose-400"
                  : "bg-[#6b85a3]/30"
              }`}
            />
            {opt}
          </label>
        );
      })}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Examiner count stepper
───────────────────────────────────────────── */
const CountStepper = ({ label, value, onChange }) => {
  const raw = value;
  const num = parseInt(raw, 10) || 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b85a3] font-[Syne,sans-serif] whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-center gap-0 border border-[#00c9a7]/25 rounded-xl overflow-hidden bg-sky-50">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(0, num - 1)))}
          className="w-8 h-8 flex items-center justify-center text-[#00c9a7] hover:bg-[#00c9a7]/10 transition-colors text-lg font-bold"
        >
          −
        </button>
        <input
          type="number"
          min="0"
          value={raw}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^\d+$/.test(v)) onChange(v);
          }}
          onBlur={() => {
            if (!raw || parseInt(raw, 10) < 0) onChange("0");
          }}
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
const InternalExaminerCard = ({ index, data, onChange, subjectId }) => {
  const field = (key) => (val) => onChange(index, key, val);
  const radioName = `internal-${subjectId}-${index}-verification`;

  return (
    <div className="relative bg-gradient-to-br from-sky-50/80 to-emerald-50/40 border border-[#00c9a7]/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(15,31,61,0.05)]">
      {/* Badge */}
      <div className="absolute -top-2.5 left-4">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#00c9a7] to-[#00a98c] text-white px-2.5 py-0.5 rounded-full font-[Syne,sans-serif] shadow-sm">
          Internal #{index + 1}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label required>Name</Label>
          <Input
            placeholder="Dr. Examiner Name"
            value={data.name}
            onChange={(e) => field("name")(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <VerificationRadio
            value={data.verification}
            onChange={field("verification")}
            name={radioName}
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   External Examiner Card
───────────────────────────────────────────── */
const ExternalExaminerCard = ({ index, data, onChange, subjectId }) => {
  const field = (key) => (val) => onChange(index, key, val);
  const radioName = `external-${subjectId}-${index}-verification`;

  return (
    <div className="relative bg-gradient-to-br from-sky-50/80 to-blue-50/40 border border-[#00c9a7]/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(15,31,61,0.05)]">
      {/* Badge */}
      <div className="absolute -top-2.5 left-4">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#162847] to-[#0f1f3d] text-[#00c9a7] px-2.5 py-0.5 rounded-full font-[Syne,sans-serif] shadow-sm border border-[#00c9a7]/30">
          External #{index + 1}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div>
          <Label required>Name</Label>
          <Input
            placeholder="Dr. Examiner Name"
            value={data.name}
            onChange={(e) => field("name")(e.target.value)}
          />
        </div>

        {/* Contact */}
        <div>
          <Label>Contact Number</Label>
          <Input
            type="tel"
            placeholder="+91 98765 43210"
            value={data.contact}
            onChange={(e) => field("contact")(e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <Label>Address</Label>
          <textarea
            rows={2}
            placeholder="Institution / College Address"
            value={data.address}
            onChange={(e) => field("address")(e.target.value)}
            className={`${inputBase} resize-none leading-relaxed`}
          />
        </div>

        {/* Email */}
        <div>
          <Label>Email ID</Label>
          <Input
            type="email"
            placeholder="examiner@institution.edu"
            value={data.email}
            onChange={(e) => field("email")(e.target.value)}
          />
        </div>

        {/* Verification */}
        <div className="flex items-center">
          <VerificationRadio
            value={data.verification}
            onChange={field("verification")}
            name={radioName}
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Blank examiner factories
───────────────────────────────────────────── */
const blankInternal = () => ({ name: "", verification: "" });
const blankExternal = () => ({ name: "", address: "", contact: "", email: "", verification: "" });

const syncArray = (arr, count, blank) => {
  const n = parseInt(count, 10) || 0;
  if (n > arr.length) return [...arr, ...Array.from({ length: n - arr.length }, blank)];
  return arr.slice(0, n);
};

/* ─────────────────────────────────────────────
   Main Subject Component
───────────────────────────────────────────── */
let _subjectId = 0;

const Subject = () => {
  const [id] = useState(() => ++_subjectId);

  /* Basic fields */
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState("");
  const [studentsEnrolled, setStudentsEnrolled] = useState("");

  /* Examiner counts (string for backspace-safe input) */
  const [internalCount, setInternalCount] = useState("0");
  const [externalCount, setExternalCount] = useState("0");

  /* Examiner arrays */
  const [internals, setInternals] = useState([]);
  const [externals, setExternals] = useState([]);

  /* Sync arrays when counts change */
  const handleInternalCount = (val) => {
    setInternalCount(val);
    setInternals((prev) => syncArray(prev, val, blankInternal));
  };

  const handleExternalCount = (val) => {
    setExternalCount(val);
    setExternals((prev) => syncArray(prev, val, blankExternal));
  };

  const updateInternal = (idx, key, val) =>
    setInternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e)));

  const updateExternal = (idx, key, val) =>
    setExternals((prev) => prev.map((e, i) => (i === idx ? { ...e, [key]: val } : e)));

  const semesterLabels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="bg-white/85 backdrop-blur-md border border-[#00c9a7]/20 rounded-2xl shadow-[0_8px_32px_rgba(15,31,61,0.1)] overflow-hidden my-2">

        {/* ── Top accent bar ── */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00c9a7] via-[#00e5c4] to-[#00a98c]" />

        <div className="p-6 sm:p-8">

          {/* ══ SECTION 1 — Subject Details ══ */}
          <SectionHeading icon="📚" title="Subject Details" subtitle="Core information about this subject" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            {/* Subject Name */}
            <div>
              <Label required>Subject Name</Label>
              <Input
                placeholder="e.g. Data Structures & Algorithms"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>

            {/* Subject Code */}
            <div>
              <Label required>Subject Code</Label>
              <Input
                placeholder="e.g. CS301"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
              />
            </div>

            {/* Semester */}
            <div>
              <Label required>Semester</Label>
              <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="" disabled>Select Semester</option>
                {semesterLabels.map((s, i) => (
                  <option key={i} value={s}>Semester {s}</option>
                ))}
              </Select>
            </div>

            {/* Students Enrolled */}
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
                onBlur={() => {
                  if (!studentsEnrolled) setStudentsEnrolled("");
                }}
                className={`${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
          </div>

          <DividerLine />

          {/* ══ SECTION 2 — Internal Examiners ══ */}
          <div className="mb-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <SectionHeading
                icon="🎓"
                title="Internal Examiners"
                subtitle="Faculty members conducting internal evaluation"
              />
              <CountStepper
                label="Count"
                value={internalCount}
                onChange={handleInternalCount}
              />
            </div>

            {internals.length === 0 ? (
              <div className="text-center py-6 text-[#6b85a3]/60 text-xs font-medium font-[DM_Sans,sans-serif] border border-dashed border-[#00c9a7]/20 rounded-xl bg-sky-50/40">
                No internal examiners added yet — use the stepper above
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
                  />
                ))}
              </div>
            )}
          </div>

          <DividerLine />

          {/* ══ SECTION 3 — External Examiners ══ */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <SectionHeading
                icon="🏛️"
                title="External Examiners"
                subtitle="Guest evaluators from other institutions"
              />
              <CountStepper
                label="Count"
                value={externalCount}
                onChange={handleExternalCount}
              />
            </div>

            {externals.length === 0 ? (
              <div className="text-center py-6 text-[#6b85a3]/60 text-xs font-medium font-[DM_Sans,sans-serif] border border-dashed border-[#00c9a7]/20 rounded-xl bg-sky-50/40">
                No external examiners added yet — use the stepper above
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {externals.map((examiner, i) => (
                  <ExternalExaminerCard
                    key={i}
                    index={i}
                    data={examiner}
                    onChange={updateExternal}
                    subjectId={id}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Subject;