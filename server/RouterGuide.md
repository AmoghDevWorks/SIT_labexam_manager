# API Routes

## Root

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check if the server is running |

---

## Admin Routes — `/api/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/signup` | Create a new admin account with hashed password. Username must be unique, only one admin allowed |
| POST | `/api/admin/login` | Authenticate an admin using username and password verified via bcrypt |

---

## Subject Routes — `/api/subjects`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subjects` | Create a new subject. `subjectCode` must be unique and is auto-converted to uppercase |
| GET | `/api/subjects` | Retrieve all subjects sorted by newest first |
| GET | `/api/subjects/:id` | Retrieve a single subject by its MongoDB ID |
| PUT | `/api/subjects/:id` | Update a subject's name and/or code by its MongoDB ID |
| DELETE | `/api/subjects/:id` | Delete a subject by its MongoDB ID |

---

## Internal Examiner Routes — `/api/internal-examiners`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/internal-examiners` | Create a new internal examiner. `name` must be unique |
| GET | `/api/internal-examiners` | Retrieve all internal examiners sorted by newest first |
| PUT | `/api/internal-examiners/:id` | Update an internal examiner's name by its MongoDB ID. Prevents duplicate names |
| DELETE | `/api/internal-examiners/:id` | Delete an internal examiner by its MongoDB ID |

---

## Exam Data Routes — `/api/exam-data`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/exam-data` | Create new exam data for a single subject. Requires `semester`, `subjectName`, `subjectCode`, `studentsEnrolled`, `verification`, `internals`, and `externals` fields |
| GET | `/api/exam-data` | Retrieve all exam data entries sorted by semester and subject name |
| GET | `/api/exam-data/:id` | Retrieve a single exam data entry by its MongoDB ID |
| GET | `/api/exam-data/semester/:semester` | Retrieve all exam data entries for a specific semester, sorted by subject name |
| GET | `/api/exam-data/semester/:semester/subject/:subjectName` | Retrieve exam data entries for a specific semester and subject combination |
| PUT | `/api/exam-data/:id` | Update an exam data entry by its MongoDB ID. Can update semester, subject details, examiners, etc. |
| DELETE | `/api/exam-data/:id` | Delete an exam data entry by its MongoDB ID |

---

## Subject Assignment Routes — `/api/subject-assignments`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subject-assignments` | Assign an internal examiner to a subject. Requires `subjectId` and `internalExaminerId`. Creates unique subject-examiner relationship |
| DELETE | `/api/subject-assignments/:assignmentId` | Remove a subject-examiner assignment by its MongoDB ID |
| GET | `/api/subject-assignments/subject/:subjectId` | Get all internal examiners assigned to a specific subject with examiner details populated |
| GET | `/api/subject-assignments/examiner/:examinerId` | Get all subjects assigned to a specific internal examiner with subject details populated |
| GET | `/api/subject-assignments/unassigned/:subjectId` | Get all internal examiners NOT assigned to a specific subject (available for assignment) |