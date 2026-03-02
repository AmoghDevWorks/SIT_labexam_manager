const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {
  createSubjectEntry,
  getSubjectEntryStatus,
  toggleSubjectEntry,
  updateSubjectEntry,
  deleteSubjectEntry,
} = require("../controllers/manageSubjectEntryController");

// All routes require authentication and admin privileges
router.post("/", verifyToken, verifyAdmin, createSubjectEntry);
router.get("/", verifyToken, getSubjectEntryStatus);
router.patch("/toggle", verifyToken, verifyAdmin, toggleSubjectEntry);
router.put("/", verifyToken, verifyAdmin, updateSubjectEntry);
router.delete("/", verifyToken, verifyAdmin, deleteSubjectEntry);

module.exports = router;
