const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");

const adminRoutes = require("./routes/adminRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const internalExaminerRoutes = require("./routes/internalExaminerRoutes");
const examDataRoutes = require("./routes/examDataRoutes");
const subjectAssignmentRoutes = require("./routes/subjectAssignmentRoutes");
const documentRoutes = require("./routes/documentRoutes");
const manageSubjectEntryRoutes = require("./routes/manageSubjectEntryRoutes");

const app = express();

// Connect Database
connectDB();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://sit-labexam-manager.vercel.app",
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Serve static files from uploads directory
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/internal-examiners", internalExaminerRoutes);
app.use("/api/exam-data", examDataRoutes);
app.use("/api/subject-assignments", subjectAssignmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/manage-subject-entry", manageSubjectEntryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
