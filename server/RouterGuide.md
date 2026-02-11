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