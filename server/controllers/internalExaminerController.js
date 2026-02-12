const InternalExaminer = require("../models/internalExaminer");
const bcrypt = require("bcrypt");

// =======================
// CREATE INTERNAL EXAMINER
// =======================
exports.createInternalExaminer = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existing = await InternalExaminer.findOne({ name });

    if (existing) {
      return res.status(400).json({ message: "Examiner already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const examiner = await InternalExaminer.create({ name, password: hashedPassword });

    res.status(201).json({
      message: "Internal Examiner created successfully",
      examiner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET ALL INTERNAL EXAMINERS
// =======================
exports.getAllInternalExaminers = async (req, res) => {
  try {
    const examiners = await InternalExaminer.find().sort({ createdAt: -1 });

    res.status(200).json(examiners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE INTERNAL EXAMINER
// =======================
exports.updateInternalExaminer = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existing = await InternalExaminer.findOne({ name });

    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Examiner name already exists" });
    }

    const updatedExaminer = await InternalExaminer.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedExaminer) {
      return res.status(404).json({ message: "Examiner not found" });
    }

    res.status(200).json({
      message: "Internal Examiner updated successfully",
      examiner: updatedExaminer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// DELETE INTERNAL EXAMINER
// =======================
exports.deleteInternalExaminer = async (req, res) => {
  try {
    const examiner = await InternalExaminer.findByIdAndDelete(req.params.id);

    if (!examiner) {
      return res.status(404).json({ message: "Examiner not found" });
    }

    res.status(200).json({
      message: "Internal Examiner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// LOGIN INTERNAL EXAMINER
// =======================
exports.loginInternalExaminer = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }

    const examiner = await InternalExaminer.findOne({ name });

    if (!examiner) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, examiner.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      examiner: {
        id: examiner._id,
        name: examiner.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
