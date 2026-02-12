const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

// Upload document (syllabus or model QP)
router.post("/upload", documentController.uploadDocument);

// Check existing documents for a subject
router.get("/check/:semester/:subjectCode", documentController.checkDocuments);

// Get/download document
router.get("/:semester/:subjectCode/:documentType", documentController.getDocument);

// Delete document
router.delete("/:semester/:subjectCode/:documentType", documentController.deleteDocument);

module.exports = router;
