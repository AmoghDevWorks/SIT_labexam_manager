const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// Admin-only operations
router.post("/", verifyToken, verifyAdmin, createSubject);
router.put("/:id", verifyToken, verifyAdmin, updateSubject);
router.delete("/:id", verifyToken, verifyAdmin, deleteSubject);

// Read operations - accessible by authenticated users
router.get("/", verifyToken, getAllSubjects);
router.get("/:id", verifyToken, getSubjectById);

module.exports = router;
