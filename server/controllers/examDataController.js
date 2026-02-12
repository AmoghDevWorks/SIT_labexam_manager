const ExamData = require('../models/examData');

// Create new exam data
const createExamData = async (req, res) => {
  try {
    const { semester, subjectName, subjectCode, studentsEnrolled, verification, internals, externals } = req.body;

    // Validate required fields
    if (!semester) {
      return res.status(400).json({ message: 'Semester is required' });
    }
    if (!subjectName) {
      return res.status(400).json({ message: 'Subject name is required' });
    }
    if (!subjectCode) {
      return res.status(400).json({ message: 'Subject code is required' });
    }
    if (!studentsEnrolled) {
      return res.status(400).json({ message: 'Students enrolled is required' });
    }

    const examData = new ExamData({
      semester,
      subjectName,
      subjectCode,
      studentsEnrolled,
      verification: verification || 'No',
      internals: internals || [],
      externals: externals || []
    });

    await examData.save();
    res.status(201).json(examData);
  } catch (error) {
    console.error('Error creating exam data:', error);
    res.status(500).json({ message: 'Error creating exam data', error: error.message });
  }
};

// Get all exam data
const getAllExamData = async (req, res) => {
  try {
    const examData = await ExamData.find().sort({ semester: 1, subjectName: 1 });
    res.status(200).json(examData);
  } catch (error) {
    console.error('Error fetching exam data:', error);
    res.status(500).json({ message: 'Error fetching exam data', error: error.message });
  }
};

// Get exam data by ID
const getExamDataById = async (req, res) => {
  try {
    const examData = await ExamData.findById(req.params.id);
    
    if (!examData) {
      return res.status(404).json({ message: 'Exam data not found' });
    }

    res.status(200).json(examData);
  } catch (error) {
    console.error('Error fetching exam data:', error);
    res.status(500).json({ message: 'Error fetching exam data', error: error.message });
  }
};

// Get exam data by semester
const getExamDataBySemester = async (req, res) => {
  try {
    const { semester } = req.params;
    const examData = await ExamData.find({ semester }).sort({ subjectName: 1 });
    res.status(200).json(examData);
  } catch (error) {
    console.error('Error fetching exam data:', error);
    res.status(500).json({ message: 'Error fetching exam data', error: error.message });
  }
};

// Get exam data by semester and subject
const getExamDataBySemesterAndSubject = async (req, res) => {
  try {
    const { semester, subjectName } = req.params;
    const examData = await ExamData.find({ semester, subjectName });
    res.status(200).json(examData);
  } catch (error) {
    console.error('Error fetching exam data:', error);
    res.status(500).json({ message: 'Error fetching exam data', error: error.message });
  }
};

// Update exam data
const updateExamData = async (req, res) => {
  try {
    const { semester, subjectName, subjectCode, studentsEnrolled, verification, internals, externals } = req.body;

    const examData = await ExamData.findById(req.params.id);
    
    if (!examData) {
      return res.status(404).json({ message: 'Exam data not found' });
    }

    if (semester) examData.semester = semester;
    if (subjectName) examData.subjectName = subjectName;
    if (subjectCode) examData.subjectCode = subjectCode;
    if (studentsEnrolled) examData.studentsEnrolled = studentsEnrolled;
    if (verification) examData.verification = verification;
    if (internals) examData.internals = internals;
    if (externals) examData.externals = externals;

    await examData.save();
    res.status(200).json(examData);
  } catch (error) {
    console.error('Error updating exam data:', error);
    res.status(500).json({ message: 'Error updating exam data', error: error.message });
  }
};

// Delete exam data
const deleteExamData = async (req, res) => {
  try {
    const examData = await ExamData.findByIdAndDelete(req.params.id);
    
    if (!examData) {
      return res.status(404).json({ message: 'Exam data not found' });
    }

    res.status(200).json({ message: 'Exam data deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam data:', error);
    res.status(500).json({ message: 'Error deleting exam data', error: error.message });
  }
};

module.exports = {
  createExamData,
  getAllExamData,
  getExamDataById,
  getExamDataBySemester,
  getExamDataBySemesterAndSubject,
  updateExamData,
  deleteExamData
};
