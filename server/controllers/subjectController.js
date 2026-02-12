const Subject = require("../models/subject");

// =======================
// CREATE SUBJECT
// =======================
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, semester } = req.body;

    if (!subjectName || !subjectCode || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingSubject = await Subject.findOne({ subjectCode });

    if (existingSubject) {
      return res.status(400).json({ message: "Subject code already exists" });
    }

    const subject = await Subject.create({
      subjectName,
      subjectCode,
      semester,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET ALL SUBJECTS
// =======================
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET SINGLE SUBJECT
// =======================
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE SUBJECT
// =======================
exports.updateSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, semester } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, subjectCode, semester },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// DELETE SUBJECT
// =======================
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
