const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { validateDocumentSubjectCode } = require("../services/modelQpValidationService");

// Configure multer storage - upload to temp directory first
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Upload to temp directory first (req.body not available yet)
    const tempPath = path.join(__dirname, "..", "uploads", "temp");
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }
    
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    // Use timestamp + random number for temp filename
    const tempFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, tempFilename);
  }
});

const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const removeTempFile = (filePath) => {
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// File filter to accept only PDF and Word documents.
const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowedExtension = allowedExtensions.has(extension);
  const isAllowedMime = allowedMimeTypes.has(file.mimetype);
  
  if (isAllowedExtension && isAllowedMime) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF and Word files are allowed"));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
}).single("file");

// Upload document controller
exports.uploadDocument = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { semester, subjectCode, subjectName, documentType } = req.body;

    if (!semester || !subjectCode || !subjectName || !documentType) {
      // Delete temp file if validation fails
      removeTempFile(req.file.path);
      return res.status(400).json({ message: "Missing required fields: semester, subjectCode, subjectName, or documentType" });
    }

    if (!["syllabus", "modelQP"].includes(documentType)) {
      removeTempFile(req.file.path);
      return res.status(400).json({ message: "Invalid document type. Use 'syllabus' or 'modelQP'." });
    }

    // Enforce OCR/text verification of subject code for both syllabus and model QP uploads.
    try {
      const validation = await validateDocumentSubjectCode({
        filePath: req.file.path,
        subjectCode,
        documentType,
      });

      if (!validation.isValid) {
        removeTempFile(req.file.path);
        return res.status(400).json({ message: validation.message });
      }
    } catch (validationError) {
      console.error("Document validation failed:", validationError.message);
      removeTempFile(req.file.path);
      return res.status(500).json({ message: "Failed to validate uploaded document content" });
    }

    // Create final directory structure: uploads/semester_X/subjectCode/
    const finalDir = path.join(__dirname, "..", "uploads", `semester_${semester}`, subjectCode);
    
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // Create final filename: subjectCode-subjectName_documentType.extension
    const extension = path.extname(req.file.originalname);
    // Remove spaces and special characters from subject name for filename
    const sanitizedSubjectName = subjectName.replace(/[^a-zA-Z0-9]/g, '');
    const finalFilename = `${subjectCode}-${sanitizedSubjectName}_${documentType}${extension}`;
    const finalPath = path.join(finalDir, finalFilename);

    // Move file from temp to final location (this overwrites if exists)
    fs.rename(req.file.path, finalPath, (moveErr) => {
      if (moveErr) {
        // If move fails, try copy + delete
        fs.copyFile(req.file.path, finalPath, (copyErr) => {
          if (copyErr) {
            return res.status(500).json({ message: "Failed to save document" });
          }
          // Delete temp file after copying
          removeTempFile(req.file.path);
          
          res.status(200).json({
            message: `${documentType === 'syllabus' ? 'Syllabus' : 'Model Question Paper'} uploaded successfully`,
            file: {
              filename: finalFilename,
              path: finalPath,
              size: req.file.size,
              semester,
              subjectCode,
              subjectName,
              documentType
            }
          });
        });
      } else {
        // Move successful
        res.status(200).json({
          message: `${documentType === 'syllabus' ? 'Syllabus' : 'Model Question Paper'} uploaded successfully`,
          file: {
            filename: finalFilename,
            path: finalPath,
            size: req.file.size,
            semester,
            subjectCode,
            subjectName,
            documentType
          }
        });
      }
    });
  });
};

// Get document (for downloading)
exports.getDocument = (req, res) => {
  const { semester, subjectCode, documentType } = req.params;
  
  const uploadPath = path.join(__dirname, "..", "uploads", `semester_${semester}`, subjectCode);
  
  // Find file with matching pattern
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Match pattern: subjectCode-subjectName_documentType
    const file = files.find(f => f.startsWith(`${subjectCode}-`) && f.includes(`_${documentType}`));
    
    if (!file) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.join(uploadPath, file);
    res.download(filePath);
  });
};

// Delete document
exports.deleteDocument = (req, res) => {
  const { semester, subjectCode, documentType } = req.params;
  
  const uploadPath = path.join(__dirname, "..", "uploads", `semester_${semester}`, subjectCode);
  
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Match pattern: subjectCode-subjectName_documentType
    const file = files.find(f => f.startsWith(`${subjectCode}-`) && f.includes(`_${documentType}`));
    
    if (!file) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.join(uploadPath, file);
    
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete document" });
      }

      // Remove subject folder if no documents remain.
      fs.readdir(uploadPath, (readErr, remainingFiles) => {
        if (!readErr && remainingFiles.length === 0) {
          fs.rmdir(uploadPath, () => {
            // Best effort cleanup; ignore rmdir errors.
          });
        }
      });

      res.status(200).json({ message: "Document deleted successfully" });
    });
  });
};

// Check existing documents for a subject
exports.checkDocuments = (req, res) => {
  const { semester, subjectCode } = req.params;
  
  const uploadPath = path.join(__dirname, "..", "uploads", `semester_${semester}`, subjectCode);
  
  // Check if directory exists
  if (!fs.existsSync(uploadPath)) {
    return res.status(200).json({
      syllabus: null,
      modelQP: null
    });
  }

  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(200).json({
        syllabus: null,
        modelQP: null
      });
    }

    // Match pattern: subjectCode-subjectName_documentType
    const syllabusFile = files.find(f => f.startsWith(`${subjectCode}-`) && f.includes('_syllabus'));
    const modelQPFile = files.find(f => f.startsWith(`${subjectCode}-`) && f.includes('_modelQP'));

    // Get file stats for size and date
    const getFileInfo = (filename) => {
      if (!filename) return null;
      const filePath = path.join(uploadPath, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        uploadedAt: stats.mtime,
        downloadUrl: `/api/documents/${semester}/${subjectCode}/${filename.includes('syllabus') ? 'syllabus' : 'modelQP'}`
      };
    };

    res.status(200).json({
      syllabus: getFileInfo(syllabusFile),
      modelQP: getFileInfo(modelQPFile)
    });
  });
};
