import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import sitLogo from '../../assets/sit.png';

// ── Validation Helper ──────────────────────────────────────
export const validateData = (subjectsData, subjectCount) => {
  const errors = [];
  
  for (let i = 0; i < subjectCount; i++) {
    const d = subjectsData[i] || {};
    const subjectLabel = `Subject #${i + 1}`;
    
    // Check subject details
    if (!d.subjectName || d.subjectName.trim() === "") {
      errors.push(`${subjectLabel}: Subject Name is required`);
    }
    if (!d.subjectCode || d.subjectCode.trim() === "") {
      errors.push(`${subjectLabel}: Subject Code is required`);
    }
    if (!d.semester || d.semester.trim() === "") {
      errors.push(`${subjectLabel}: Semester is required`);
    }
    if (!d.studentsEnrolled || d.studentsEnrolled.trim() === "") {
      errors.push(`${subjectLabel}: Number of Students Enrolled is required`);
    }
    
    // Check internal examiners
    const internals = d.internals || [];
    internals.forEach((internal, idx) => {
      if (!internal.name || internal.name.trim() === "") {
        errors.push(`${subjectLabel} - Internal Examiner #${idx + 1}: Name is required`);
      }
    });
    
    // Check external examiners
    const externals = d.externals || [];
    externals.forEach((external, idx) => {
      if (!external.name || external.name.trim() === "") {
        errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Name is required`);
      }
      if (!external.address || external.address.trim() === "") {
        errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Address is required`);
      }
      if (!external.contact || external.contact.trim() === "") {
        errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Contact Number is required`);
      } else {
        // Validate phone number (must be exactly 10 digits)
        const phoneDigits = external.contact.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Contact Number must be exactly 10 digits`);
        }
      }
      if (!external.email || external.email.trim() === "") {
        errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Email ID is required`);
      } else {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(external.email.trim())) {
          errors.push(`${subjectLabel} - External Examiner #${idx + 1}: Invalid email format`);
        }
      }
    });
  }
  
  return errors;
};

const getSubjectList = (subjectsData, subjectCount) => {
  const list = [];
  for (let i = 0; i < subjectCount; i++) {
    list.push(subjectsData[i] || {});
  }
  return list;
};

const sanitizeFilePart = (value, fallback = 'POE') => {
  const cleaned = String(value || '')
    .replace(/[<>:"/\\|?*]/g, '')
    .trim();
  return cleaned || fallback;
};

const getExportFilename = ({ extension, subjectList, explicitSemester }) => {
  const isSingle = (subjectList || []).length === 1;

  if (isSingle) {
    const subjectCode = sanitizeFilePart(subjectList[0]?.subjectCode, 'Subject');
    return `${subjectCode}-POE.${extension}`;
  }

  const semesterFromData = subjectList?.[0]?.semester;
  const semesterValue = sanitizeFilePart(explicitSemester || semesterFromData, 'X');
  return `Semester-${semesterValue}-POE.${extension}`;
};

const getUniqueSheetName = (baseName, usedNames) => {
  const sanitizedBase = (baseName || 'Subject')
    .replace(/[\\/?*\[\]:]/g, ' ')
    .trim()
    .slice(0, 31) || 'Subject';

  if (!usedNames.has(sanitizedBase)) {
    usedNames.add(sanitizedBase);
    return sanitizedBase;
  }

  let counter = 2;
  while (counter < 1000) {
    const suffix = ` (${counter})`;
    const maxBaseLength = 31 - suffix.length;
    const candidate = `${sanitizedBase.slice(0, maxBaseLength)}${suffix}`;
    if (!usedNames.has(candidate)) {
      usedNames.add(candidate);
      return candidate;
    }
    counter++;
  }

  const fallback = `Subject_${Date.now()}`.slice(0, 31);
  usedNames.add(fallback);
  return fallback;
};

const createSubjectSheet = (subject, title) => {
  const wsData = [];
  const d = subject || {};
  const internals = d.internals || [];
  const externals = d.externals || [];
  const maxRows = Math.max(externals.length, internals.length, 1);

  wsData.push([title, '', '', '', '', '', '', '', '', '', '']);
  wsData.push(['', '', '', '', '', '', 'External Examiner', '', '', '', '']);
  wsData.push([
    'Sl No',
    'Subject',
    'Subject Code',
    'Semester',
    'Number of Students',
    'Internal Examiner',
    'Name',
    'Address',
    'Contact Number',
    'Email ID',
    'Permission to use already existing Question Paper with same code (Yes / No)',
  ]);

  for (let r = 0; r < maxRows; r++) {
    const ext = externals[r] || {};
    const int = internals[r] || {};
    const isFirstRow = r === 0;

    wsData.push([
      isFirstRow ? 1 : '',
      isFirstRow ? (d.subjectName || '') : '',
      isFirstRow ? (d.subjectCode || '') : '',
      isFirstRow ? (d.semester ? `Semester ${d.semester}` : '') : '',
      isFirstRow ? (d.studentsEnrolled || '') : '',
      int.name || '',
      ext.name || '',
      ext.address || '',
      ext.contact || '',
      ext.email || '',
      isFirstRow ? (d.verification || '') : '',
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [
    { wch: 8 },
    { wch: 24 },
    { wch: 16 },
    { wch: 12 },
    { wch: 20 },
    { wch: 28 },
    { wch: 24 },
    { wch: 30 },
    { wch: 18 },
    { wch: 26 },
    { wch: 38 },
  ];

  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } },
  ];

  if (maxRows > 1) {
    merges.push({ s: { r: 3, c: 0 }, e: { r: 3 + maxRows - 1, c: 0 } });
    merges.push({ s: { r: 3, c: 1 }, e: { r: 3 + maxRows - 1, c: 1 } });
    merges.push({ s: { r: 3, c: 2 }, e: { r: 3 + maxRows - 1, c: 2 } });
    merges.push({ s: { r: 3, c: 3 }, e: { r: 3 + maxRows - 1, c: 3 } });
    merges.push({ s: { r: 3, c: 4 }, e: { r: 3 + maxRows - 1, c: 4 } });
    merges.push({ s: { r: 3, c: 10 }, e: { r: 3 + maxRows - 1, c: 10 } });
  }

  ws['!merges'] = merges;

  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '' };
      }

      ws[cellAddress].s = {
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
        font:
          R === 0 || R === 1
            ? { bold: true, sz: 15 }
            : R === 2
              ? { bold: true, sz: 13 }
              : { sz: 12 },
      };
    }
  }

  return ws;
};

// ── Excel Export ──────────────────────────────────────────
export const downloadExcel = (subjectsData, subjectCount, title = 'Panel of Examiners for ODD Semester (2025-2026) - December 2025 - January 2026') => {
  const errors = validateData(subjectsData, subjectCount);
  
  // If there are errors, show alert and stop
  if (errors.length > 0) {
    alert(`Please fill all required fields:\n\n${errors.join('\n')}`);
    return;
  }
  
  const wb = XLSX.utils.book_new();
  const wsData = [];

  // Title row
  wsData.push([
    title,
    "", "", "", "", "", "", "", "", "", ""
  ]);

  // Subtitle row - "External Examiner" should only appear above the external examiner columns
  wsData.push([
    "", "", "", "", "", "",
    "External Examiner",
    "", "", "", ""
  ]);

  // Header row
  wsData.push([
    "Sl No",
    "Subject",
    "Subject Code",
    "Semester",
    "Number of Students",
    "Internal Examiner",
    "Name",
    "Address",
    "Contact Number",
    "Email ID",
    "Permission to use already existing Question Paper with same code (Yes / No)",
  ]);

  let slNo = 1;

  for (let i = 0; i < subjectCount; i++) {
    const d = subjectsData[i] || {};
    const internals = d.internals || [];
    const externals = d.externals || [];

    const maxRows = Math.max(externals.length, internals.length, 1);

    for (let r = 0; r < maxRows; r++) {
      const ext = externals[r] || {};
      const int = internals[r] || {};
      const isFirstRow = r === 0;

      wsData.push([
        isFirstRow ? slNo : "",
        isFirstRow ? (d.subjectName || "") : "",
        isFirstRow ? (d.subjectCode || "") : "",
        isFirstRow ? (d.semester ? `Semester ${d.semester}` : "") : "",
        isFirstRow ? (d.studentsEnrolled || "") : "",
        int.name || "",
        ext.name || "",
        ext.address || "",
        ext.contact || "",
        ext.email || "",
        isFirstRow ? (d.verification || "") : "",
      ]);
    }

    slNo++;
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = [
    { wch: 8 },
    { wch: 24 },
    { wch: 16 },
    { wch: 12 },
    { wch: 20 },
    { wch: 28 },
    { wch: 24 },
    { wch: 30 },
    { wch: 18 },
    { wch: 26 },
    { wch: 38 },
  ];

  // Merge cells array
  const merges = [];
  
  // Merge title row across all 11 columns (A1:K1)
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } });
  
  // Merge "External Examiner" subtitle across columns 6-10 (G2:K2)
  merges.push({ s: { r: 1, c: 6 }, e: { r: 1, c: 10 } });

  // Merge cells for each subject (for repeated rows)
  let currentRow = 3; // Start after headers
  for (let i = 0; i < subjectCount; i++) {
    const d = subjectsData[i] || {};
    const externals = d.externals || [];
    const internals = d.internals || [];
    const maxRows = Math.max(externals.length, internals.length, 1);

    if (maxRows > 1) {
      // Merge Sl. No. (column 0)
      merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow + maxRows - 1, c: 0 } });
      // Merge Subject (column 1)
      merges.push({ s: { r: currentRow, c: 1 }, e: { r: currentRow + maxRows - 1, c: 1 } });
      // Merge Sub Code (column 2)
      merges.push({ s: { r: currentRow, c: 2 }, e: { r: currentRow + maxRows - 1, c: 2 } });
      // Merge Semester (column 3)
      merges.push({ s: { r: currentRow, c: 3 }, e: { r: currentRow + maxRows - 1, c: 3 } });
      // Merge No. of Students (column 4)
      merges.push({ s: { r: currentRow, c: 4 }, e: { r: currentRow + maxRows - 1, c: 4 } });
      // DO NOT merge Internal Examiners (column 5) - each row has its own internal examiner
    }
    currentRow += maxRows;
  }

  ws["!merges"] = merges;

  // Apply center alignment and borders to all cells
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      
      // Create cell if it doesn't exist
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '' };
      }

      ws[cellAddress].s = {
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        },
        font: R === 0 || R === 1 ? { bold: true, sz: 15 } : R === 2 ? { bold: true, sz: 13 } : { sz: 12 }
      };
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Panel of Examiners");
  const subjectList = getSubjectList(subjectsData, subjectCount);
  const filename = getExportFilename({ extension: 'xlsx', subjectList });
  XLSX.writeFile(wb, filename);
};

// ── Excel Export with Unfilled Subjects ──────────────────────────────────────────
export const downloadExcelWithUnfilled = (subjectsData, subjectCount, unfilledSubjects, semester, title = 'Panel of Examiners for ODD Semester (2025-2026) - December 2025 - January 2026') => {
  const errors = validateData(subjectsData, subjectCount);
  
  // If there are errors, show alert and stop
  if (errors.length > 0) {
    alert(`Please fill all required fields:\n\n${errors.join('\n')}`);
    return;
  }

  const subjectList = getSubjectList(subjectsData, subjectCount);
  const wb = XLSX.utils.book_new();
  const wsData = [];

  // Title row
  wsData.push([
    title,
    "", "", "", "", "", "", "", "", "", ""
  ]);

  // Subtitle row - "External Examiner" should only appear above the external examiner columns
  wsData.push([
    "", "", "", "", "", "",
    "External Examiner",
    "", "", "", ""
  ]);

  // Header row
  wsData.push([
    "Sl No",
    "Subject",
    "Subject Code",
    "Semester",
    "Number of Students",
    "Internal Examiner",
    "Name",
    "Address",
    "Contact Number",
    "Email ID",
    "Permission to use already existing Question Paper with same code (Yes / No)",
  ]);

  let slNo = 1;

  for (let i = 0; i < subjectCount; i++) {
    const d = subjectsData[i] || {};
    const internals = d.internals || [];
    const externals = d.externals || [];

    const maxRows = Math.max(externals.length, internals.length, 1);

    for (let r = 0; r < maxRows; r++) {
      const ext = externals[r] || {};
      const int = internals[r] || {};
      const isFirstRow = r === 0;

      wsData.push([
        isFirstRow ? slNo : "",
        isFirstRow ? (d.subjectName || "") : "",
        isFirstRow ? (d.subjectCode || "") : "",
        isFirstRow ? (d.semester ? `Semester ${d.semester}` : "") : "",
        isFirstRow ? (d.studentsEnrolled || "") : "",
        int.name || "",
        ext.name || "",
        ext.address || "",
        ext.contact || "",
        ext.email || "",
        isFirstRow ? (d.verification || "") : "",
      ]);
    }

    slNo++;
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = [
    { wch: 8 },
    { wch: 24 },
    { wch: 16 },
    { wch: 12 },
    { wch: 20 },
    { wch: 28 },
    { wch: 24 },
    { wch: 30 },
    { wch: 18 },
    { wch: 26 },
    { wch: 38 },
  ];

  // Merge cells array
  const merges = [];
  
  // Merge title row across all 11 columns (A1:K1)
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } });
  
  // Merge "External Examiner" subtitle across columns 6-10 (G2:K2)
  merges.push({ s: { r: 1, c: 6 }, e: { r: 1, c: 10 } });

  // Merge cells for each subject (for repeated rows)
  let currentRow = 3; // Start after headers
  for (let i = 0; i < subjectCount; i++) {
    const d = subjectsData[i] || {};
    const externals = d.externals || [];
    const internals = d.internals || [];
    const maxRows = Math.max(externals.length, internals.length, 1);

    if (maxRows > 1) {
      // Merge Sl. No. (column 0)
      merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow + maxRows - 1, c: 0 } });
      // Merge Subject (column 1)
      merges.push({ s: { r: currentRow, c: 1 }, e: { r: currentRow + maxRows - 1, c: 1 } });
      // Merge Sub Code (column 2)
      merges.push({ s: { r: currentRow, c: 2 }, e: { r: currentRow + maxRows - 1, c: 2 } });
      // Merge Semester (column 3)
      merges.push({ s: { r: currentRow, c: 3 }, e: { r: currentRow + maxRows - 1, c: 3 } });
      // Merge No. of Students (column 4)
      merges.push({ s: { r: currentRow, c: 4 }, e: { r: currentRow + maxRows - 1, c: 4 } });
      // DO NOT merge Internal Examiners (column 5) - each row has its own internal examiner
    }
    currentRow += maxRows;
  }

  ws["!merges"] = merges;

  // Apply center alignment and borders to all cells
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      
      // Create cell if it doesn't exist
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '' };
      }

      ws[cellAddress].s = {
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        },
        font: R === 0 || R === 1 ? { bold: true, sz: 15 } : R === 2 ? { bold: true, sz: 13 } : { sz: 12 }
      };
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Panel of Examiners");

  // ═══════════════════════════════════════════════════════════
  // SHEET 2: Unfilled Subjects
  // ═══════════════════════════════════════════════════════════
  if (unfilledSubjects && unfilledSubjects.length > 0) {
    const unfilledData = [];
    
    // Title row
    unfilledData.push([
      `Unfilled Subjects - Semester ${semester}`,
      "", ""
    ]);
    
    // Header row
    unfilledData.push([
      "Sl No",
      "Subject Name",
      "Subject Code",
      "Semester"
    ]);
    
    // Data rows
    unfilledSubjects.forEach((subject, index) => {
      unfilledData.push([
        index + 1,
        subject.subjectName || "",
        subject.subjectCode || "",
        subject.semester ? `Semester ${subject.semester}` : ""
      ]);
    });
    
    const wsUnfilled = XLSX.utils.aoa_to_sheet(unfilledData);
    
    // Column widths
    wsUnfilled["!cols"] = [
      { wch: 10 },  // Sl No
      { wch: 40 },  // Subject Name
      { wch: 18 },  // Subject Code
      { wch: 15 }   // Semester
    ];
    
    // Merge title row
    const unfilledMerges = [];
    unfilledMerges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    wsUnfilled["!merges"] = unfilledMerges;
    
    // Apply styling
    const unfilledRange = XLSX.utils.decode_range(wsUnfilled['!ref']);
    for (let R = unfilledRange.s.r; R <= unfilledRange.e.r; ++R) {
      for (let C = unfilledRange.s.c; C <= unfilledRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        
        if (!wsUnfilled[cellAddress]) {
          wsUnfilled[cellAddress] = { t: 's', v: '' };
        }
        
        wsUnfilled[cellAddress].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          },
          font: R === 0 ? { bold: true, sz: 13, color: { rgb: "E11D48" } } : R === 1 ? { bold: true, sz: 12 } : { sz: 11 },
          fill: R === 0 ? { fgColor: { rgb: "FEE2E2" } } : R === 1 ? { fgColor: { rgb: "FECACA" } } : {}
        };
      }
    }
    
    XLSX.utils.book_append_sheet(wb, wsUnfilled, "Unfilled Subjects");
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 3: Verified Subjects (subjects with verification="Yes")
  // ═══════════════════════════════════════════════════════════
  // Filter subjects where verification is "Yes"
  const verifiedSubjects = [];
  for (let i = 0; i < subjectList.length; i++) {
    const d = subjectList[i] || {};
    if (d.verification && d.verification.toLowerCase() === 'yes') {
      verifiedSubjects.push(d);
    }
  }

  if (verifiedSubjects.length > 0) {
    const verifiedData = [];
    
    // Title row
    verifiedData.push([
      `Verified Subjects - Semester ${semester}`,
      "", "", ""
    ]);
    
    // Header row
    verifiedData.push([
      "Sl No",
      "Subject Code",
      "Subject Name",
      "Existing Subject Code (Previous Year)"
    ]);
    
    // Data rows
    verifiedSubjects.forEach((subject, index) => {
      verifiedData.push([
        index + 1,
        subject.subjectCode || "",
        subject.subjectName || "",
        subject.existingSubjectCode && subject.existingSubjectCode.trim() !== "" 
          ? subject.existingSubjectCode 
          : "Not Provided"
      ]);
    });
    
    const wsVerified = XLSX.utils.aoa_to_sheet(verifiedData);
    
    // Column widths
    wsVerified["!cols"] = [
      { wch: 10 },  // Sl No
      { wch: 18 },  // Subject Code
      { wch: 40 },  // Subject Name
      { wch: 35 }   // Existing Subject Code
    ];
    
    // Merge title row
    const verifiedMerges = [];
    verifiedMerges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    wsVerified["!merges"] = verifiedMerges;
    
    // Apply styling
    const verifiedRange = XLSX.utils.decode_range(wsVerified['!ref']);
    for (let R = verifiedRange.s.r; R <= verifiedRange.e.r; ++R) {
      for (let C = verifiedRange.s.c; C <= verifiedRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        
        if (!wsVerified[cellAddress]) {
          wsVerified[cellAddress] = { t: 's', v: '' };
        }
        
        // Check if this is a "Not Provided" cell (only in column 3, row > 1)
        const isNotProvided = R > 1 && C === 3 && wsVerified[cellAddress].v === "Not Provided";
        
        wsVerified[cellAddress].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          },
          font: R === 0 
            ? { bold: true, sz: 13, color: { rgb: "1E40AF" } } 
            : R === 1 
              ? { bold: true, sz: 12 } 
              : isNotProvided 
                ? { italic: true, color: { rgb: "DC2626" } } 
                : { sz: 11 },
          fill: R === 0 
            ? { fgColor: { rgb: "DBEAFE" } } 
            : R === 1 
              ? { fgColor: { rgb: "BFDBFE" } } 
              : isNotProvided 
                ? { fgColor: { rgb: "FEE2E2" } } 
                : {}
        };
      }
    }
    
    XLSX.utils.book_append_sheet(wb, wsVerified, "Verified Subjects");
  }

  const filename = getExportFilename({ extension: 'xlsx', subjectList, explicitSemester: semester });
  XLSX.writeFile(wb, filename);
};

// ── PDF Export ──────────────────────────────────────────
export const downloadPDF = (subjectsData, subjectCount, title = 'Panel of Examiners for ODD Semester (2025-2026) - December 2025 - January 2026') => {
  try {
    const errors = validateData(subjectsData, subjectCount);
    
    // If there are errors, show alert and stop
    if (errors.length > 0) {
      alert(`Please fill all required fields:\n\n${errors.join('\n')}`);
      return;
    }

    const subjectList = getSubjectList(subjectsData, subjectCount);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // A4 landscape dimensions: 297mm x 210mm
    const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
    
    // Header content (will be drawn on each page)
    const drawHeader = () => {
      // Header dimensions
      const headerStartY = 6;
      const headerHeight = 22;
      const headerEndY = headerStartY + headerHeight;
      const leftMargin = 6;
      const rightMargin = 6;
      const logoSectionWidth = 28;
      const dividerX = leftMargin + logoSectionWidth;
      
      // Draw outer border for entire header
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.rect(leftMargin, headerStartY, pageWidth - leftMargin - rightMargin, headerHeight);
      
      // Draw vertical divider between logo and titles
      doc.setLineWidth(0.3);
      doc.line(dividerX, headerStartY, dividerX, headerEndY);
      
      // Add logo on left side
      try {
        // Logo dimensions and position (centered in left section)
        const logoWidth = 20;
        const logoHeight = 20;
        const logoX = leftMargin + (logoSectionWidth - logoWidth) / 2;
        const logoY = headerStartY + (headerHeight - logoHeight) / 2;
        
        // Add the SIT logo
        doc.addImage(sitLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.log('Logo loading error:', error);
      }
      
      // Calculate center position for text section (right of divider)
      const textSectionCenterX = dividerX + (pageWidth - rightMargin - dividerX) / 2;
      
      // Siddaganga Institute of Technology (centered)
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('Siddaganga Institute of Technology', textSectionCenterX, 13, { align: 'center' });
      
      // Department of Computer Science and Engineering (centered)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Department of Computer Science and Engineering', textSectionCenterX, 19, { align: 'center' });
      
      // Title (centered)
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title, textSectionCenterX, 25, { align: 'center' });
    };
    
    const drawFooter = () => {
      const footerY = pageHeight - 20;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('___________________', 15, footerY);
      doc.setFontSize(8);
      doc.text('Co-ordinator', 15, footerY + 4);
      doc.text('BOE', 15, footerY + 8);

      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
      doc.setFontSize(9);
      doc.text(`Date: ${dateStr}`, pageWidth / 2, footerY + 2, { align: 'center' });

      doc.setFontSize(9);
      doc.text('___________________', pageWidth - 50, footerY);
      doc.setFontSize(8);
      doc.text('Head of the Department', pageWidth - 50, footerY + 4);
      doc.text('Dept. of CSE', pageWidth - 50, footerY + 8);

      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    };

    subjectList.forEach((d, subjectIndex) => {
      if (subjectIndex > 0) {
        doc.addPage();
      }

      const internals = d.internals || [];
      const externals = d.externals || [];
      const maxRows = Math.max(externals.length, internals.length, 1);
      const tableData = [];

      for (let r = 0; r < maxRows; r++) {
        const ext = externals[r] || {};
        const int = internals[r] || {};
        const isFirstRow = r === 0;

        if (isFirstRow) {
          tableData.push([
            { content: '1', rowSpan: maxRows, styles: { valign: 'middle', halign: 'center' } },
            { content: d.subjectName || '', rowSpan: maxRows, styles: { valign: 'middle', halign: 'left' } },
            { content: d.subjectCode || '', rowSpan: maxRows, styles: { valign: 'middle', halign: 'center' } },
            { content: d.semester ? `Sem ${d.semester}` : '', rowSpan: maxRows, styles: { valign: 'middle', halign: 'center' } },
            { content: String(d.studentsEnrolled || ''), rowSpan: maxRows, styles: { valign: 'middle', halign: 'center' } },
            { content: int.name || '', styles: { halign: 'left' } },
            { content: ext.name || '', styles: { halign: 'left' } },
            { content: ext.address || '', styles: { halign: 'left' } },
            { content: ext.contact || '', styles: { halign: 'center' } },
            { content: ext.email || '', styles: { halign: 'left' } },
            { content: d.verification || '', rowSpan: maxRows, styles: { valign: 'middle', halign: 'center' } },
          ]);
        } else {
          tableData.push([
            { content: int.name || '', styles: { halign: 'left' } },
            { content: ext.name || '', styles: { halign: 'left' } },
            { content: ext.address || '', styles: { halign: 'left' } },
            { content: ext.contact || '', styles: { halign: 'center' } },
            { content: ext.email || '', styles: { halign: 'left' } },
          ]);
        }
      }

      autoTable(doc, {
        head: [
          [
            { content: '', colSpan: 6, styles: { halign: 'center', fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 } },
            { content: 'External Examiner', colSpan: 4, styles: { halign: 'center', fillColor: [220, 230, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 } },
            { content: '', colSpan: 1, styles: { halign: 'center', fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 } }
          ],
          [
            { content: 'Sl No', styles: { halign: 'center' } },
            { content: 'Subject', styles: { halign: 'center' } },
            { content: 'Subject Code', styles: { halign: 'center' } },
            { content: 'Sem', styles: { halign: 'center' } },
            { content: 'No. of Students', styles: { halign: 'center' } },
            { content: 'Internal Examiner', styles: { halign: 'center' } },
            { content: 'Name', styles: { halign: 'center' } },
            { content: 'Address', styles: { halign: 'center' } },
            { content: 'Contact No.', styles: { halign: 'center' } },
            { content: 'Email ID', styles: { halign: 'center' } },
            { content: 'Permission to use already existing Question Paper with same code (Yes / No)', styles: { halign: 'center' } }
          ]
        ],
        body: tableData,
        startY: 32,
        theme: 'grid',
        styles: {
          fontSize: 8.4,
          cellPadding: 1.4,
          halign: 'center',
          valign: 'middle',
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [15, 31, 61],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 8.8,
          cellPadding: 1.6,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 28, halign: 'left' },
          2: { cellWidth: 18, halign: 'center' },
          3: { cellWidth: 12, halign: 'center' },
          4: { cellWidth: 16, halign: 'center' },
          5: { cellWidth: 32, halign: 'left' },
          6: { cellWidth: 28, halign: 'left' },
          7: { cellWidth: 40, halign: 'left' },
          8: { cellWidth: 20, halign: 'center' },
          9: { cellWidth: 34, halign: 'left' },
          10: { cellWidth: 25, halign: 'center' },
        },
        margin: { top: 30, left: 6, right: 6, bottom: 30 },
        didDrawPage: () => {
          drawHeader();
          drawFooter();
        },
      });
    });

    const filename = getExportFilename({ extension: 'pdf', subjectList });
    doc.save(filename);
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF: ' + error.message);
  }
};
