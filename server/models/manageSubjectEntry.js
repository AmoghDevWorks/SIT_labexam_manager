const mongoose = require("mongoose");

const manageSubjectEntrySchema = new mongoose.Schema(
  {
    allowSubjectEntry: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManageSubjectEntry", manageSubjectEntrySchema);
