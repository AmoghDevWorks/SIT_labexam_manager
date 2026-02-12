const express = require("express");
const router = express.Router();
const {
  assignExaminerToSubject,
  removeAssignment,
  getAssignmentsBySubject,
  getSubjectsByExaminer,
  getUnassignedExaminers,
} = require("../controllers/subjectAssignmentController");

// POST /api/subject-assignments - Assign examiner to subject
router.post("/", assignExaminerToSubject);

// DELETE /api/subject-assignments/:assignmentId - Remove assignment
router.delete("/:assignmentId", removeAssignment);

// GET /api/subject-assignments/subject/:subjectId - Get all assignments for a subject
router.get("/subject/:subjectId", getAssignmentsBySubject);

// GET /api/subject-assignments/examiner/:examinerId - Get all subjects for an examiner
router.get("/examiner/:examinerId", getSubjectsByExaminer);

// GET /api/subject-assignments/unassigned/:subjectId - Get unassigned examiners for subject
router.get("/unassigned/:subjectId", getUnassignedExaminers);

module.exports = router;
