const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");

const adminRoutes = require("./routes/adminRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const internalExaminerRoutes = require("./routes/internalExaminerRoutes");

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

// Root Route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/internal-examiners", internalExaminerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
