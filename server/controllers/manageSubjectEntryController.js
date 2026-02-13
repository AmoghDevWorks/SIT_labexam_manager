const ManageSubjectEntry = require("../models/manageSubjectEntry");

// =======================
// CREATE SUBJECT ENTRY
// =======================
exports.createSubjectEntry = async (req, res) => {
  try {
    const { allowSubjectEntry } = req.body;

    // Check if entry already exists (only one document should exist)
    const existing = await ManageSubjectEntry.findOne();

    if (existing) {
      return res.status(400).json({ message: "Subject entry configuration already exists" });
    }

    const entry = await ManageSubjectEntry.create({ 
      allowSubjectEntry: allowSubjectEntry !== undefined ? allowSubjectEntry : false 
    });

    res.status(201).json({
      message: "Subject entry configuration created successfully",
      data: entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET SUBJECT ENTRY STATUS
// =======================
exports.getSubjectEntryStatus = async (req, res) => {
  try {
    const entry = await ManageSubjectEntry.findOne();

    if (!entry) {
      return res.status(404).json({ message: "Subject entry configuration not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// TOGGLE SUBJECT ENTRY (Switch between true and false)
// =======================
exports.toggleSubjectEntry = async (req, res) => {
  try {
    const entry = await ManageSubjectEntry.findOne();

    if (!entry) {
      return res.status(404).json({ message: "Subject entry configuration not found" });
    }

    // Toggle the boolean value
    entry.allowSubjectEntry = !entry.allowSubjectEntry;
    await entry.save();

    res.status(200).json({
      message: `Subject entry ${entry.allowSubjectEntry ? 'enabled' : 'disabled'} successfully`,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE SUBJECT ENTRY (Set specific value)
// =======================
exports.updateSubjectEntry = async (req, res) => {
  try {
    const { allowSubjectEntry } = req.body;

    if (allowSubjectEntry === undefined) {
      return res.status(400).json({ message: "allowSubjectEntry field is required" });
    }

    const entry = await ManageSubjectEntry.findOne();

    if (!entry) {
      return res.status(404).json({ message: "Subject entry configuration not found" });
    }

    entry.allowSubjectEntry = allowSubjectEntry;
    await entry.save();

    res.status(200).json({
      message: "Subject entry configuration updated successfully",
      data: entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// DELETE SUBJECT ENTRY
// =======================
exports.deleteSubjectEntry = async (req, res) => {
  try {
    const entry = await ManageSubjectEntry.findOneAndDelete();

    if (!entry) {
      return res.status(404).json({ message: "Subject entry configuration not found" });
    }

    res.status(200).json({
      message: "Subject entry configuration deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
