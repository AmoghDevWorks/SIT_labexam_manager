const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  createExamData,
  getAllExamData,
  getExamDataById,
  getExamDataBySemester,
  getExamDataBySemesterAndSubject,
  updateExamData,
  deleteExamData,
  checkExistingExamData,
  checkExternalExaminerDuplicate
} = require('../controllers/examDataController');

// All routes require authentication
// Create new exam data - accessible by authenticated users (internal examiners)
router.post('/', verifyToken, createExamData);

// Check for external examiner duplicate
router.post('/check-external-examiner/duplicate', verifyToken, checkExternalExaminerDuplicate);

// Read operations - accessible by authenticated users
router.get('/', verifyToken, getAllExamData);
router.get('/check/:semester/:subjectCode', verifyToken, checkExistingExamData);
router.get('/:id', verifyToken, getExamDataById);
router.get('/semester/:semester', verifyToken, getExamDataBySemester);
router.get('/semester/:semester/subject/:subjectName', verifyToken, getExamDataBySemesterAndSubject);

// Update and Delete - admin only
router.put('/:id', verifyToken, verifyAdmin, updateExamData);
router.delete('/:id', verifyToken, verifyAdmin, deleteExamData);

module.exports = router;
