const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const documentController = require("../controllers/documentController");

// All routes require authentication
router.post("/upload", verifyToken, documentController.uploadDocument);
router.get("/check/:semester/:subjectCode", verifyToken, documentController.checkDocuments);
router.get("/:semester/:subjectCode/:documentType", verifyToken, documentController.getDocument);
router.delete("/:semester/:subjectCode/:documentType", verifyToken, verifyAdmin, documentController.deleteDocument);

module.exports = router;
