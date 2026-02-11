import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../utils/adminContext";
import axios from "axios";

/* ─────────────────────────────────────────────────────────────
   Backend URL from env  →  VITE_BACKEND_URL
   Assumed REST endpoints:
     GET    /api/subjects          → [{ id, name, code }, ...]
     POST   /api/subjects          → { id, name, code }
     PUT    /api/subjects/:id      → { id, name, code }
     DELETE /api/subjects/:id      → { message }
───────────────────────────────────────────────────────────── */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ── Shared input style ── */
const inputCls =
  "w-full px-4 py-3 text-sm text-[#1a2e4a] bg-sky-50 border border-[#00c9a7]/25 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.12)] placeholder:text-[#6b85a3]/60 font-[DM_Sans,sans-serif]";

const CARD_ACCENTS = [
  ["from-[#00c9a7]", "to-[#00a98c]"],
  ["from-[#0f1f3d]", "to-[#162847]"],
  ["from-[#00a98c]", "to-[#007a68]"],
  ["from-[#162847]", "to-[#0f1f3d]"],
  ["from-[#007a68]", "to-[#0f1f3d]"],
  ["from-[#00c9a7]", "to-[#162847]"],
];

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-[DM_Sans,sans-serif]">
      <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
      </svg>
      {msg}
    </p>
  ) : null;

/* Spinner */
const Spinner = ({ sm }) => (
  <svg
    className={`animate-spin ${sm ? "w-4 h-4" : "w-5 h-5"} text-[#00c9a7]`}
    viewBox="0 0 24 24" fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ════════════════════════════════════════════
   SUBJECT MODAL  (Add + Edit unified)
════════════════════════════════════════════ */
const SubjectModal = ({ mode, initial, onClose, onSave, existingCodes, loading }) => {
  const isEdit = mode === "edit";
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Subject name is required";
    if (!code.trim()) {
      errs.code = "Subject code is required";
    } else if (!/^[A-Za-z0-9]+$/.test(code.trim())) {
      errs.code = "Only letters and numbers allowed";
    } else {
      const upper = code.trim().toUpperCase();
      const isDuplicate = isEdit
        ? existingCodes.filter((c) => c !== initial.code).includes(upper)
        : existingCodes.includes(upper);
      if (isDuplicate) errs.code = "This subject code already exists";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ name: name.trim(), code: code.trim().toUpperCase() });
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f3d]/55 backdrop-blur-sm"
      style={{ animation: "overlayFadeIn 0.18s ease both" }}
    >
      <div
        className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-[0_28px_80px_rgba(15,31,61,0.28)] overflow-hidden"
        style={{ animation: "modalPopIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Accent bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${isEdit ? "from-[#162847] via-[#00c9a7] to-[#00a98c]" : "from-[#00c9a7] via-[#00e5c4] to-[#00a98c]"}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,201,167,0.3)] ${isEdit ? "bg-gradient-to-br from-[#162847] to-[#0f1f3d]" : "bg-gradient-to-br from-[#00c9a7] to-[#00a98c]"}`}>
              {isEdit ? (
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
                  <path d="M3 12.5V15h2.5l7.4-7.4-2.5-2.5L3 12.5z" stroke="#00c9a7" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M13.2 3.8a1.2 1.2 0 0 1 1.7 1.7l-.9.9-1.7-1.7.9-.9z" stroke="#00c9a7" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
                  <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif] leading-tight">
                {isEdit ? "Edit Subject" : "Add New Subject"}
              </h2>
              <p className="text-[11px] text-[#6b85a3] mt-0.5 font-[DM_Sans,sans-serif]">
                {isEdit ? "Update the subject details below" : "Enter the subject details below"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6b85a3] hover:bg-sky-100 hover:text-[#1a2e4a] transition-all duration-150"
          >
            <svg viewBox="0 0 18 18" className="w-3.5 h-3.5" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#00c9a7]/20 to-transparent mx-7 mb-1" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-5 flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-1.5 font-[Syne,sans-serif]">
              Subject Name <span className="text-[#00c9a7]">*</span>
            </label>
            <input
              ref={nameRef}
              className={`${inputCls} ${errors.name ? "!border-rose-300 focus:!shadow-[0_0_0_3px_rgba(244,63,94,0.1)]" : ""}`}
              placeholder="e.g. Data Structures & Algorithms"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            />
            <FieldError msg={errors.name} />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b85a3] mb-1.5 font-[Syne,sans-serif]">
              Subject Code <span className="text-[#00c9a7]">*</span>
            </label>
            <input
              className={`${inputCls} uppercase tracking-widest font-bold ${errors.code ? "!border-rose-300 focus:!shadow-[0_0_0_3px_rgba(244,63,94,0.1)]" : ""}`}
              placeholder="e.g. CS301"
              value={code}
              maxLength={10}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setErrors((p) => ({ ...p, code: "" })); }}
            />
            <FieldError msg={errors.code} />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 text-[13px] font-semibold text-[#6b85a3] bg-sky-50 border border-[#00c9a7]/20 rounded-xl hover:bg-sky-100 hover:text-[#1a2e4a] transition-all duration-150 font-[Syne,sans-serif] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#00c9a7] to-[#00a98c] rounded-xl shadow-[0_4px_14px_rgba(0,201,167,0.35)] hover:shadow-[0_6px_20px_rgba(0,201,167,0.45)] hover:-translate-y-0.5 transition-all duration-200 font-[Syne,sans-serif] disabled:opacity-70 disabled:translate-y-0"
            >
              {loading && <Spinner sm />}
              {isEdit ? "Save Changes" : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   DELETE CONFIRM MODAL
════════════════════════════════════════════ */
const DeleteModal = ({ subject, onClose, onConfirm, loading }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f3d]/55 backdrop-blur-sm"
      style={{ animation: "overlayFadeIn 0.18s ease both" }}
    >
      <div
        className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-[0_28px_80px_rgba(15,31,61,0.28)] overflow-hidden"
        style={{ animation: "modalPopIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400" />

        <div className="px-7 py-6 flex flex-col items-center text-center gap-4">
          {/* Warning icon */}
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-rose-500" fill="none">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div>
            <h3 className="text-[16px] font-extrabold text-[#1a2e4a] font-[Syne,sans-serif]">Delete Subject?</h3>
            <p className="text-[13px] text-[#6b85a3] mt-1.5 font-[DM_Sans,sans-serif] leading-relaxed">
              <span className="font-semibold text-[#1a2e4a]">{subject.name}</span>
              <br />
              <span className="text-[11px]">Code: <span className="text-[#00a98c] font-bold tracking-widest">{subject.code}</span></span>
            </p>
            <p className="text-[12px] text-rose-400 mt-2 font-[DM_Sans,sans-serif]">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 w-full pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 text-[13px] font-semibold text-[#6b85a3] bg-sky-50 border border-[#00c9a7]/20 rounded-xl hover:bg-sky-100 transition-all font-[Syne,sans-serif] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 transition-all duration-200 font-[Syne,sans-serif] disabled:opacity-70 disabled:translate-y-0"
            >
              {loading && <Spinner sm />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   SUBJECT CARD
════════════════════════════════════════════ */
const SubjectCard = ({ subject, index, onEdit, onDelete }) => {
  const [from, to] = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const initials = (subject?.name ?? "")
  .split(/\s+/)
  .slice(0, 2)
  .map((w) => w[0] ?? "")
  .join("")
  .toUpperCase();


  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm border border-[#00c9a7]/15 rounded-2xl shadow-[0_4px_18px_rgba(15,31,61,0.07)] hover:shadow-[0_8px_32px_rgba(15,31,61,0.13)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
      style={{ animation: "cardSlideIn 0.35s ease both", animationDelay: `${index * 0.05}s` }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${from} ${to}`} />

      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center text-white text-[13px] font-extrabold shrink-0 shadow-[0_4px_10px_rgba(0,201,167,0.22)] font-[Syne,sans-serif]`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <div className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-0.5 font-[Syne,sans-serif]">Subject</p>
              <h3
                className="text-[13.5px] font-bold text-[#1a2e4a] leading-snug font-[Syne,sans-serif] truncate"
                title={subject.name}
              >
                {subject.name}
              </h3>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b85a3] mb-0.5 font-[Syne,sans-serif]">Code</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00c9a7]/10 border border-[#00c9a7]/25 text-[#00a98c] text-[11px] font-bold tracking-widest uppercase font-[Syne,sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] shrink-0" />
                {subject.code}
              </span>
            </div>
          </div>
        </div>

        {/* Action row — slides in on hover */}
        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-[#00c9a7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(subject)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-[#00a98c] bg-[#00c9a7]/10 border border-[#00c9a7]/20 rounded-lg hover:bg-[#00c9a7]/20 transition-all font-[Syne,sans-serif]"
          >
            <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
              <path d="M2 9.5V12h2.5l5.8-5.8-2.5-2.5L2 9.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M9.5 2.5a1 1 0 0 1 1.4 1.4l-.6.6-1.4-1.4.6-.6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(subject)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-200/60 rounded-lg hover:bg-rose-100 transition-all font-[Syne,sans-serif]"
          >
            <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
              <path d="M2 3.5h10M5.5 3.5V2h3v1.5M3.5 3.5l.7 8h5.6l.7-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   TOAST NOTIFICATION
════════════════════════════════════════════ */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-[0_8px_32px_rgba(15,31,61,0.2)] font-[DM_Sans,sans-serif] text-sm font-medium transition-all duration-300 ${
        isError
          ? "bg-rose-500 text-white"
          : "bg-gradient-to-r from-[#0f1f3d] to-[#162847] text-white border border-[#00c9a7]/20"
      }`}
      style={{ animation: "toastIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both" }}
    >
      {isError ? (
        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z"/>
        </svg>
      ) : (
        <span className="w-5 h-5 rounded-full bg-[#00c9a7]/20 border border-[#00c9a7]/40 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-[#00c9a7]" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
      {toast.message}
    </div>
  );
};

/* ════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════ */
const EmptyState = ({ hasSearch, onAdd }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#00c9a7]/10 border border-[#00c9a7]/20 flex items-center justify-center mb-5">
      {hasSearch ? (
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
          <circle cx="14" cy="14" r="8" stroke="#00c9a7" strokeWidth="1.8"/>
          <path d="M20 20l6 6" stroke="#00c9a7" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
          <rect x="5" y="6" width="22" height="20" rx="3" stroke="#00c9a7" strokeWidth="1.6"/>
          <path d="M10 13h12M10 18h8" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="5" fill="#00c9a7" opacity="0.12" stroke="#00c9a7" strokeWidth="1.5"/>
          <path d="M24 21v6M21 24h6" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </div>
    <h3 className="text-[15px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">
      {hasSearch ? "No matching subjects" : "No subjects yet"}
    </h3>
    <p className="text-[13px] text-[#6b85a3] mt-1 mb-6 max-w-[240px] font-[DM_Sans,sans-serif]">
      {hasSearch ? "Try a different name or code" : "Add your first subject to get started"}
    </p>
    {!hasSearch && (
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#00c9a7] to-[#00a98c] rounded-xl shadow-[0_4px_14px_rgba(0,201,167,0.35)] hover:shadow-[0_6px_20px_rgba(0,201,167,0.45)] hover:-translate-y-0.5 transition-all duration-200 font-[Syne,sans-serif]"
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
          <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        Add First Subject
      </button>
    )}
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const ManageSubject = () => {
  const { adminUid } = useAdmin();
  const navigate = useNavigate();

  /* Auth guard */
  useEffect(() => {
    if (!adminUid) navigate("/");
  }, [adminUid, navigate]);

  /* State */
  const [subjects, setSubjects] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [activeSubject, setActiveSubject] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  /* ── Toast helper ── */
  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── Fetch all subjects on mount ── */
  useEffect(() => {
    if (!adminUid) return;
    const fetchSubjects = async () => {
      setFetchLoading(true);
      setFetchError("");
      try {
        const response = await axios.get(`${BACKEND_URL}/api/subjects`);
        console.log(response)
        // Map API response to frontend format
        const mappedSubjects = response.data.map(subject => ({
          id: subject._id,
          name: subject.subjectName,
          code: subject.subjectCode
        }));
        setSubjects(mappedSubjects);
      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to load subjects. Please try again."
        );
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSubjects();
  }, [adminUid]);

  /* ── ADD subject ── */
  const handleAdd = async ({ name, code }) => {
    setModalLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/subjects`, { 
        subjectName: name, 
        subjectCode: code 
      });
      // Map API response to frontend format
      const newSubject = {
        id: response.data._id,
        name: response.data.subjectName,
        code: response.data.subjectCode
      };
      setSubjects((prev) => [...prev, newSubject]);
      showToast(`"${name}" added successfully`);
      setModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add subject", "error");
    } finally {
      setModalLoading(false);
    }
  };

  /* ── EDIT subject ── */
  const handleEdit = async ({ name, code }) => {
    setModalLoading(true);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/subjects/${activeSubject.id}`,
        { subjectName: name, subjectCode: code }
      );
      // Map API response to frontend format
      const updatedSubject = {
        id: response.data._id,
        name: response.data.subjectName,
        code: response.data.subjectCode
      };
      setSubjects((prev) =>
        prev.map((s) => (s.id === activeSubject.id ? updatedSubject : s))
      );
      showToast(`"${name}" updated successfully`);
      setModal(null);
      setActiveSubject(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update subject", "error");
    } finally {
      setModalLoading(false);
    }
  };

  /* ── DELETE subject ── */
  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/subjects/${activeSubject.id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== activeSubject.id));
      showToast(`"${activeSubject.name}" deleted`);
      setModal(null);
      setActiveSubject(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete subject", "error");
    } finally {
      setModalLoading(false);
    }
  };

  /* ── Derived ── */
  const existingCodes = subjects.map((s) => s.code ?? "");

  const filtered = subjects.filter((s) => {
    const name = s?.name ?? "";
    const code = s?.code ?? "";
    const searchValue = search ?? "";

    return (
      name.toLowerCase().includes(searchValue.toLowerCase()) ||
      code.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  if (!adminUid) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes overlayFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalPopIn {
          from{opacity:0;transform:scale(0.9) translateY(20px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }
        @keyframes cardSlideIn {
          from{opacity:0;transform:translateY(14px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes pageIn {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes toastIn {
          from{opacity:0;transform:translateY(16px) scale(0.95)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes spin { to{transform:rotate(360deg)} }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-50 font-[DM_Sans,sans-serif]">

        {/* ── Header ── */}
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
                <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#00c9a7" strokeWidth="1.4"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#00c9a7" strokeWidth="1.4"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#00c9a7" strokeWidth="1.4"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#00c9a7" strokeWidth="1.4"/>
              </svg>
            </div>
            <span className="text-white text-[14px] font-bold tracking-wide font-[Syne,sans-serif]">
              Manage Subjects
            </span>
          </div>
          <span className="text-[#00c9a7] text-[11px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 font-[Syne,sans-serif]">
            Academic Portal
          </span>
        </header>

        {/* ── Body ── */}
        <main
          className="w-full max-w-[960px] mx-auto px-6 py-10"
          style={{ animation: "pageIn 0.3s ease both" }}
        >
          {/* Title row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold text-[#1a2e4a] leading-tight tracking-tight font-[Syne,sans-serif]">
                Subject Directory
              </h1>
              <p className="text-sm text-[#6b85a3] mt-1 font-light">
                {fetchLoading
                  ? "Loading subjects…"
                  : subjects.length === 0
                  ? "No subjects registered yet"
                  : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} registered`}
              </p>
            </div>

            <button
              onClick={() => setModal("add")}
              className="group relative flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-[#0f1f3d] to-[#162847] text-white rounded-xl shadow-[0_6px_24px_rgba(15,31,61,0.2)] hover:shadow-[0_8px_32px_rgba(0,201,167,0.2)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7]/0 via-[#00c9a7]/10 to-[#00c9a7]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative w-6 h-6 rounded-lg bg-[#00c9a7]/20 border border-[#00c9a7]/30 flex items-center justify-center">
                <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="#00c9a7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="relative text-[13px] font-bold tracking-wide font-[Syne,sans-serif]">Add Subject</span>
            </button>
          </div>

          {/* Search */}
          {subjects.length > 0 && (
            <div className="relative mb-6">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b85a3]/60 pointer-events-none" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.5 12.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name or code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm text-[#1a2e4a] bg-white/80 backdrop-blur-sm border border-[#00c9a7]/20 rounded-xl outline-none transition-all duration-200 focus:border-[#00c9a7] focus:shadow-[0_0_0_3px_rgba(0,201,167,0.1)] placeholder:text-[#6b85a3]/50 font-[DM_Sans,sans-serif] shadow-[0_2px_12px_rgba(15,31,61,0.06)]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-[#6b85a3]/60 hover:text-[#1a2e4a] hover:bg-sky-100 transition-all">
                  <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Stats pill */}
          {subjects.length > 0 && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#00c9a7]/20 text-[11px] font-semibold text-[#6b85a3] font-[Syne,sans-serif] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#00c9a7]" />
                {filtered.length} of {subjects.length} showing
              </span>
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00c9a7]/10 border border-[#00c9a7]/25 text-[11px] font-semibold text-[#00a98c] font-[Syne,sans-serif]">
                  Filter: "{search}"
                </span>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {fetchLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/60 rounded-2xl h-28 animate-pulse border border-[#00c9a7]/10" style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
          ) : fetchError ? (
            /* Fetch error state */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-rose-400" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a2e4a] font-[Syne,sans-serif]">Failed to load</h3>
              <p className="text-[13px] text-[#6b85a3] mt-1 mb-5 font-[DM_Sans,sans-serif]">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#00c9a7] to-[#00a98c] rounded-xl shadow-[0_4px_14px_rgba(0,201,167,0.3)] hover:-translate-y-0.5 transition-all font-[Syne,sans-serif]"
              >
                Retry
              </button>
            </div>
          ) : (
            /* Cards grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 ? (
                <EmptyState hasSearch={!!search} onAdd={() => setModal("add")} />
              ) : (
                filtered.map((subject, i) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    index={i}
                    onEdit={(s) => { setActiveSubject(s); setModal("edit"); }}
                    onDelete={(s) => { setActiveSubject(s); setModal("delete"); }}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Add Modal ── */}
      {modal === "add" && (
        <SubjectModal
          mode="add"
          onClose={() => setModal(null)}
          onSave={handleAdd}
          existingCodes={existingCodes}
          loading={modalLoading}
        />
      )}

      {/* ── Edit Modal ── */}
      {modal === "edit" && activeSubject && (
        <SubjectModal
          mode="edit"
          initial={activeSubject}
          onClose={() => { setModal(null); setActiveSubject(null); }}
          onSave={handleEdit}
          existingCodes={existingCodes}
          loading={modalLoading}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {modal === "delete" && activeSubject && (
        <DeleteModal
          subject={activeSubject}
          onClose={() => { setModal(null); setActiveSubject(null); }}
          onConfirm={handleDelete}
          loading={modalLoading}
        />
      )}

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </>
  );
};

export default ManageSubject;