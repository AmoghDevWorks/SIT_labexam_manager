const SubjectAssignment = require("../models/subjectAssignment");
const Subject = require("../models/subject");
const InternalExaminer = require("../models/internalExaminer");

// Assign internal examiner to subject
exports.assignExaminerToSubject = async (req, res) => {
  try {
    const { subjectId, internalExaminerId } = req.body;

    if (!subjectId || !internalExaminerId) {
      return res.status(400).json({ message: "Subject ID and Internal Examiner ID are required" });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Check if internal examiner exists
    const examiner = await InternalExaminer.findById(internalExaminerId);
    if (!examiner) {
      return res.status(404).json({ message: "Internal Examiner not found" });
    }

    // Check if assignment already exists
    const existingAssignment = await SubjectAssignment.findOne({ subjectId, internalExaminerId });
    if (existingAssignment) {
      return res.status(400).json({ message: "This examiner is already assigned to this subject" });
    }

    // Create new assignment
    const assignment = new SubjectAssignment({ subjectId, internalExaminerId });
    await assignment.save();

    res.status(201).json({
      message: "Internal examiner assigned successfully",
      assignment,
    });
  } catch (error) {
    console.error("Error assigning examiner:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove assignment
exports.removeAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await SubjectAssignment.findByIdAndDelete(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment removed successfully" });
  } catch (error) {
    console.error("Error removing assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all assignments for a subject (with examiner details)
exports.getAssignmentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const assignments = await SubjectAssignment.find({ subjectId })
      .populate("internalExaminerId", "username name")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all subjects for an internal examiner (for user view)
exports.getSubjectsByExaminer = async (req, res) => {
  try {
    const { examinerId } = req.params;

    const assignments = await SubjectAssignment.find({ internalExaminerId: examinerId })
      .populate("subjectId")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching examiner subjects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get unassigned examiners for a subject
exports.getUnassignedExaminers = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Get all assigned examiner IDs for this subject
    const assignments = await SubjectAssignment.find({ subjectId }).select("internalExaminerId");
    const assignedExaminerIds = assignments.map(a => a.internalExaminerId.toString());

    // Get all examiners not in the assigned list
    const unassignedExaminers = await InternalExaminer.find({
      _id: { $nin: assignedExaminerIds }
    }).select("username name").sort({ name: 1 });

    res.json(unassignedExaminers);
  } catch (error) {
    console.error("Error fetching unassigned examiners:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
