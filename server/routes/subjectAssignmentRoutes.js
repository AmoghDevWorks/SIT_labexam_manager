const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {
  assignExaminerToSubject,
  removeAssignment,
  getAssignmentsBySubject,
  getSubjectsByExaminer,
  getUnassignedExaminers,
} = require("../controllers/subjectAssignmentController");

// Admin-only operations
router.post("/", verifyToken, verifyAdmin, assignExaminerToSubject);
router.delete("/:assignmentId", verifyToken, verifyAdmin, removeAssignment);

// Read operations - accessible by authenticated users
router.get("/subject/:subjectId", verifyToken, getAssignmentsBySubject);
router.get("/examiner/:examinerId", verifyToken, getSubjectsByExaminer);
router.get("/unassigned/:subjectId", verifyToken, getUnassignedExaminers);

module.exports = router;
