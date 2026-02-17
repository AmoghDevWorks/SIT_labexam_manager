# 👨‍💼 SIT Lab Exam Manager - Admin Guide

**Version 1.0**  
**Siddaganga Institute of Technology**  
**Department of Computer Science and Engineering**

---

## 🚀 Getting Started

### Login

1. Open the website in Chrome or Firefox
2. Click **"Admin Login"**
3. Enter your **Admin Username** and **Password**
4. Click **"Login"**

---

## 📋 Admin Features

After logging in, you have access to:

1. **Manage Subjects** - Add, edit, or delete subjects
2. **Manage Internal Examiners** - Add or remove internal examiners
3. **Manage Subject Entry** - View and manage subject assignments
4. **Manage Exam Data** - View, edit, and download all exam data
5. **All User Features** - Can also do everything regular users can do

---

## 📚 1. Manage Subjects

### Add New Subject

1. Click **"Manage Subjects"**
2. Click **"Add New Subject"**
3. Fill in:
   - Subject Name (e.g., "Data Structures Lab")
   - Subject Code (e.g., "18CSL46")
   - Semester (I to VIII)
4. Click **"Save"**

### Edit Subject

1. Click **Edit** button (pencil icon 📝) next to subject
2. Update details
3. Click **"Update"**

### Delete Subject

1. Click **Delete** button (trash icon 🗑️)
2. Confirm deletion
3. **Warning:** All related data will be deleted!

---

## 👥 2. Manage Internal Examiners

### Add Examiner

1. Click **"Manage Internal Examiners"**
2. Click **"Add New Examiner"**
3. Fill in:
   - Full Name
   - Department
   - Email (optional)
   - Phone (optional)
4. Click **"Save"**

### Remove Examiner

1. Click **Delete** button next to examiner
2. Confirm deletion

---

## 📊 3. Manage Subject Entry

View who has been assigned which subjects:

1. Click **"Manage Subject Entry"**
2. Select **Semester**
3. View table showing:
   - Subject Name
   - Subject Code
   - Assigned To (username)
   - Status (Completed/Pending)
   - Submission Date

### Reassign Subject

1. Find the subject
2. Click **"Reassign"** button
3. Subject becomes available for other users

---

## 💼 4. Manage Exam Data

This is the most powerful admin feature.

### View Data

1. Click **"Manage Exam Data"**
2. Select **Semester**
3. View all subjects as cards with status:
   - **Green "Filled"**: Data entered
   - **Red "Unfilled"**: No data yet

### View Details

1. Click on any **Filled** subject card
2. Popup shows:
   - Subject details
   - Internal examiners
   - External examiners with full details
   - Verification status

### Edit Data

1. In subject details popup, click **"Edit"**
2. Modify:
   - Number of students
   - Add/remove internal examiners
   - Add/remove external examiners
   - Change external examiner details
   - Change verification status
3. Click **"Save Changes"**

### Download Single Subject

In subject details popup:
- Click **"Download Excel"** for Excel format
- Click **"Download PDF"** for PDF format

### Download Entire Semester (Bulk Download)

1. Select semester
2. Click **"Download Sem Exam Data"**
3. Edit document title in text box
4. Choose format:
   - **Download as Excel**: Creates two sheets (filled subjects + unfilled list)
   - **Download as PDF**: Formatted PDF with institutional header, logo, and signature sections

### Delete Semester Data

1. Click **"Clear Exam Data"** (red button)
2. Type "DELETE" to confirm (case-sensitive)
3. Click **"Confirm Delete"**
4. **WARNING:** This cannot be undone!

---

## 🎯 Quick Workflows

### Scenario 1: HOD Needs Semester Report

```
1. Login as Admin
2. Manage Exam Data → Select Semester
3. Download Sem Exam Data
4. Edit title (e.g., "Panel of Examiners for 6th Semester - Jan 2026")
5. Download as PDF or Excel
6. Email to HOD
```

### Scenario 2: Fix Wrong Data

```
1. Login as Admin
2. Manage Exam Data → Select Semester
3. Find subject → Click card
4. Click Edit
5. Correct the wrong information
6. Save Changes
```

### Scenario 3: Add New Semester Subjects

```
1. Login as Admin
2. Manage Subjects
3. For each subject:
   - Click Add New Subject
   - Fill: Name, Code, Semester
   - Save
```

---

## 🔧 Common Admin Tasks

### Q: How do I reset a user's assignment?

A: Go to Manage Subject Entry → Find subject → Click "Reassign"

### Q: How do I export all data for backup?

A: For each semester, use bulk download in Manage Exam Data

### Q: Can I edit a user's submitted data?

A: Yes. Use "Edit" button in Manage Exam Data

### Q: How do I delete incorrect subjects?

A: Manage Subjects → Click Delete (warning: removes all related data)

### Q: What if bulk download doesn't include all subjects?

A: Only "Filled" subjects appear in download. Check for unfilled subjects in Sheet 2 (Excel)

---

## ⚠️ Important Notes

**DO:**
- Always download backups before deleting data
- Verify edited data after saving
- Use descriptive titles when downloading reports
- Check unfilled subjects regularly

**DON'T:**
- Delete subjects without checking dependencies
- Clear semester data without confirmation
- Share admin credentials
- Edit data without verifying the source

---

## 📞 Support

**For Admin Issues:**
- Contact: IT Department
- Email: support@sit.ac.in
- Phone: 0816-xxxx-xxxx

---

**Last Updated:** February 2026
