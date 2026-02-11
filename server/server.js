const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config");

const adminRoutes = require("./routes/adminRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
