# 🛠️ SIT Lab Exam Manager - Developer Documentation

**Version 1.0**  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Frontend Components](#frontend-components)
7. [Key Features Implementation](#key-features-implementation)
8. [Common Development Tasks](#common-development-tasks)

---

## 📁 Project Structure

```
SIT_labexam_manager/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── admin/         # Admin components
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── ManageSubject.jsx
│   │   │   │   ├── ManageInternalExaminer.jsx
│   │   │   │   ├── ManageSubjectEntry.jsx
│   │   │   │   └── ManageExamData.jsx
│   │   │   ├── user/          # User components
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   ├── UserLogin.jsx
│   │   │   │   ├── manualUpload/
│   │   │   │   ├── excelUpload/
│   │   │   │   ├── subjectEntry/
│   │   │   │   └── uploadDocs/
│   │   │   └── utils/         # Utilities
│   │   │       ├── adminContext.jsx
│   │   │       ├── userContext.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       └── downloadUtils.js
│   │   ├── assets/            # Images, logo
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Node.js backend
│   ├── controllers/           # Route handlers
│   │   ├── adminController.js
│   │   ├── subjectController.js
│   │   ├── internalExaminerController.js
│   │   ├── examDataController.js
│   │   ├── subjectAssignmentController.js
│   │   ├── documentController.js
│   │   └── manageSubjectEntryController.js
│   ├── models/                # MongoDB schemas
│   │   ├── admin.js
│   │   ├── subject.js
│   │   ├── internalExaminer.js
│   │   ├── examData.js
│   │   ├── subjectAssignment.js
│   │   └── manageSubjectEntry.js
│   ├── routes/                # API routes
│   │   ├── adminRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── internalExaminerRoutes.js
│   │   ├── examDataRoutes.js
│   │   ├── subjectAssignmentRoutes.js
│   │   ├── documentRoutes.js
│   │   └── manageSubjectEntryRoutes.js
│   ├── db/
│   │   └── config.js          # MongoDB connection
│   ├── uploads/               # File storage
│   ├── package.json
│   ├── server.js              # Entry point
│   └── RouterGuide.md
│
├── USER_GUIDE.md              # End-user documentation
├── ADMIN_GUIDE.md             # Admin documentation
└── README.md                  # This file
```

---

## 🧰 Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **axios** for API calls
- **jsPDF** + **jspdf-autotable** for PDF generation
- **XLSX** (SheetJS) for Excel generation
- **React Router** for navigation
- **React Context API** for state management

### Backend
- **Node.js** with **Express 5.2.1**
- **MongoDB** with **Mongoose**
- **bcrypt** for password hashing
- **multer** for file uploads
- **helmet** for security headers
- **express-mongo-sanitize** for NoSQL injection prevention
- **cors** for cross-origin requests
- **dotenv** for environment variables

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIT_labexam_manager
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**

   Create `server/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/sit_lab_exam
   PORT=5000
   ```

5. **Run Development Servers**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm start
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Access Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🔌 API Endpoints

### Admin Routes (`/api/admin`)
```
POST   /register          # Register new admin
POST   /login             # Admin login
```

### Subject Routes (`/api/subjects`)
```
GET    /                  # Get all subjects
GET    /:id               # Get subject by ID
POST   /                  # Create subject
PUT    /:id               # Update subject
DELETE /:id               # Delete subject
GET    /semester/:semester # Get subjects by semester
```

### Internal Examiner Routes (`/api/internal-examiners`)
```
GET    /                  # Get all examiners
POST   /                  # Create examiner
DELETE /:id               # Delete examiner
```

### Exam Data Routes (`/api/exam-data`)
```
GET    / semester/:semester # Get exam data by semester
POST   /                  # Create exam data
PUT    /:id               # Update exam data
DELETE /semester/:semester # Delete all data for semester
```

### Subject Assignment Routes (`/api/subject-assignments`)
```
POST   /assign-bulk       # Bulk assign subjects (manual upload)
```

### Document Routes (`/api/documents`)
```
POST   /upload            # Upload document
GET    /                  # Get all documents
DELETE /:id               # Delete document
```

### Manage Subject Entry Routes (`/api/manage-subject-entry`)
```
GET    /semester/:semester # Get available subjects
POST   /assign            # Assign subject to user
POST   /submit            # Submit subject data
```

---

## 🗄️ Database Schema

### Admin
```javascript
{
  username: String (required, unique),
  password: String (required, hashed)
}
```

### Subject
```javascript
{
  subjectName: String (required),
  subjectCode: String (required, unique),
  semester: String (required, enum: I-VIII)
}
```

### Internal Examiner
```javascript
{
  name: String (required)
}
```

### Exam Data
```javascript
{
  semester: String (required),
  subjectId: ObjectId (ref: Subject),
  numberOfStudents: Number,
  internalExaminers: [
    { name: String }
  ],
  externalExaminers: [
    {
      name: String,
      yearsOfExperience: Number,
      address: String,
      contactNumber: String,
      emailId: String,
      permission: String
    }
  ],
  verification: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Assignment
```javascript
{
  userId: String,
  subjectId: ObjectId (ref: Subject),
  semester: String,
  status: String (enum: pending, completed),
  assignedDate: Date
}
```

---

## 🧩 Frontend Components

### Key Utilities

#### `downloadUtils.js`
Contains three main functions:

1. **`downloadExcel(subjectsData, subjectCount, title)`**
   - Exports single semester data to Excel
   - Uses XLSX library
   - Applies cell styling (bold, borders, alignment)

2. **`downloadExcelWithUnfilled(subjectsData, subjectCount, unfilledSubjects, semester, title)`**
   - Creates two Excel sheets
   - Sheet 1: Filled subjects with examiner details
   - Sheet 2: Unfilled subjects list

3. **`downloadPDF(subjectsData, subjectCount, title)`**
   - Generates PDF with jsPDF
   - Custom header with logo and institutional details
   - Auto-table for examiner data
   - Footer with signatures and date

### Context API

#### `adminContext.jsx`
```javascript
- adminLogin(username, password)
- adminLogout()
- State: isAuthenticated, admin
```

#### `userContext.jsx`
```javascript
- userLogin(credentials)
- userLogout()
- State: isAuthenticated, user
```

---

## 🔑 Key Features Implementation

### 1. Dynamic PDF/Excel Title

**File:** `ManageExamData.jsx`

```javascript
const [documentTitle, setDocumentTitle] = useState('Panel of Examiners...');

// Pass title to download functions
downloadPDF(subjectsData, 1, documentTitle);
downloadExcel(subjectsData, 1, documentTitle);
```

**File:** `downloadUtils.js`

Functions accept `title` parameter with default fallback.

### 2. PDF Header with Logo

**File:** `downloadUtils.js` → `downloadPDF()`

- Logo positioned at left (28mm width)
- Vertical divider separates logo and text
- Institutional text centered on right side
- Border around entire header

### 3. PDF Footer Signatures

Three sections:
- Left: "Co-ordinator\nBOE"
- Center: Current date
- Right: "Head of the Department\nDept. of CSE"

### 4. Security Middleware

**File:** `server.js`

```javascript
app.use(helmet());  // HTTP security headers
app.use(mongoSanitize({ replaceWith: "_" }));  // NoSQL injection prevention
```

---

## 🛠️ Common Development Tasks

### Add New API Endpoint

1. Create/update controller in `server/controllers/`
2. Add route in `server/routes/`
3. Register route in `server/server.js`
4. Test with Postman/Thunder Client

### Add New Frontend Page

1. Create component in `client/src/components/`
2. Add route in `App.jsx` with React Router
3. Update navigation (Header, Dashboard)

### Modify Database Schema

1. Update model in `server/models/`
2. Update controller logic
3. Test API endpoints
4. Update frontend to match new schema

### Change PDF/Excel Format

1. Edit functions in `client/src/components/utils/downloadUtils.js`
2. Test with sample data
3. Verify header, body, footer formatting

### Add New Security Feature

1. Install package: `npm install <package-name>`
2. Import in `server/server.js`
3. Configure middleware
4. Test for compatibility with existing routes

---

## 🐛 Debugging Tips

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check MongoDB is running
mongod --version

# Verify connection string in .env
MONGO_URI=mongodb://localhost:27017/sit_lab_exam
```

**Port Already in Use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

### Frontend Issues

**API Call Fails:**
- Check backend is running
- Verify axios baseURL
- Check CORS configuration in server.js
- Check browser console for errors

**PDF/Excel Download Not Working:**
- Check browser pop-up blocker
- Verify data format passed to download functions
- Check console for jsPDF/XLSX errors

---

## 📦 Dependencies

### Frontend (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "jspdf": "^2.x",
    "jspdf-autotable": "^3.x",
    "xlsx": "^0.18.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "tailwindcss": "^3.x"
  }
}
```

### Backend (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^8.x",
    "bcrypt": "^5.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "multer": "^1.x",
    "helmet": "^8.0.0",
    "express-mongo-sanitize": "^2.2.0"
  }
}
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build production bundle:
   ```bash
   cd client
   npm run build
   ```

2. Deploy `dist` folder

3. Set environment variables in hosting platform

### Backend (Heroku/Railway/Render)

1. Set environment variables:
   ```
   MONGO_URI=<production-mongodb-uri>
   PORT=<port-number>
   ```

2. Deploy with Git or CLI

3. Verify `/api` routes are accessible

---

## 📝 Code Style

- Use ES6+ features (arrow functions, destructuring, async/await)
- Use functional components with hooks (React)
- Follow REST API conventions
- Use meaningful variable/function names
- Add comments for complex logic
- Handle errors with try-catch
- Validate input on both frontend and backend

---

## 🔄 Version Control

- Branch naming: `feature/<feature-name>`, `fix/<bug-name>`
- Commit messages: Clear and descriptive
- Pull requests: Required for main branch
- Code reviews: Before merging

---

## 📞 Support

**For Development Issues:**
- Check `server/RouterGuide.md` for API documentation
- Review console logs for errors
- Check MongoDB logs
- Contact: development@sit.ac.in

---

**Last Updated:** February 2026  
**Maintainer:** SIT IT Department
