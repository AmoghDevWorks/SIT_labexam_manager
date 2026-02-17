# � SIT Lab Exam Manager - User Guide

**Version 1.0**  
**Siddaganga Institute of Technology**  
**Department of Computer Science and Engineering**

---

## 🚀 Getting Started

### Login

1. Open the website in Chrome or Firefox
2. Click **"User Login"**
3. Enter your **Username** and **Password**
4. Click **"Login"**

**Note:** Contact your administrator for login credentials.

---

## � Features

After logging in, you'll see four options:

1. **Manual Upload** - Enter examiner details one by one
2. **Excel Upload** - Upload multiple examiners using Excel file (Yet to be developed)
3. **Subject Entry** - Assign subjects and enter examiner information
4. **Upload Documents** - Upload exam-related documents

---

## 📝 1. Manual Upload

### Steps:

1. Click **"Manual Upload"**
2. Select **Semester** (I to VIII)
3. Enter **Number of Subjects**
4. Click **"Generate Forms"**
5. For each subject, fill:
   - Subject Name (e.g., "Operating Systems Lab")
   - Subject Code (e.g., "18CSL58")
   - Number of Students Enrolled
   - Verification (Yes/No)
6. Click **"Add Internal Examiner"** and enter name(s)
7. Click **"Add External Examiner"** and fill:
   - Name
   - Years of Experience
   - Address
   - Contact Number (10 digits: 9876543210)
   - Email ID
8. Click **"Submit All"**

**Tip:** You can add multiple internal and external examiners per subject.

---

## 📊 2. Excel Upload

**Status:** Yet to be developed

---

## 📚 3. Subject Entry

### Steps:

1. Click **"Subject Entry"**
2. Select **Semester**
3. View available subjects
4. Click **"Assign to Me"** for the subject you want
5. Fill examiner details:
   - Number of students enrolled
   - Internal examiner names
   - External examiner details
   - Verification option
6. Click **"Submit"**

**Note:** Once assigned, the subject is locked to you. Contact admin to reassign.

---

## 📄 4. Upload Documents

### Steps:

1. Click **"Upload Documents"**
2. Select **Document Type** (Model Question Paper or Syllabus)
3. Select **Semester**
4. Select **Subject**
5. Click **"Choose File"** and select your file
   - Supported: PDF, Word (.doc, .docx), Images (.jpg, .png)
   - Max size: 10MB
6. Click **"Upload"**

---

## 🔧 Common Problems

### Login Failed
- Check CAPS LOCK is off (passwords are case-sensitive)
- Remove extra spaces
- Contact admin if account doesn't exist

### File Upload Failed
- Check file size (max 10MB)
- Use supported formats only (PDF, Word, Images)
- Check internet connection

### Changes Not Saving
- Fill all required fields (marked with *)
- Check for error messages
- Don't press browser back button

---

## ❓ FAQs

**Q: Can I edit my data after submitting?**  
A: No. Contact admin to make changes.

**Q: How long can I stay logged in?**  
A: 1-2 hours of inactivity. Save your work frequently!

**Q: What if the subject I need is not listed?**  
A: Contact admin to add the subject first.

**Q: Phone number format?**  
A: 10 digits only. Example: 9876543210 (No spaces, dashes, or +91)

**Q: Can I see other users' data?**  
A: No. You can only see your own entries.

---

## 📞 Support

**Technical Issues:**
- Email: support@sit.ac.in
- Phone: 0816-xxxx-xxxx
- Timings: Monday-Friday, 9 AM - 5 PM

**Data/Access Issues:**
- Contact: Department HOD
- Email: hod.cse@sit.ac.in

---

## ✅ Best Practices

**DO:**
- Save data frequently
- Download backup copies after entering data
- Use correct file formats
- Log out when done (especially on shared computers)
- Use Google Chrome for best experience

**DON'T:**
- Share your login credentials
- Use special characters in text fields
- Press browser back button while filling forms
- Upload files larger than 10MB
- Keep multiple tabs of the website open

---

**Last Updated:** February 2026
     - **Subject Code**: Code of the subject
     - **Semester**: Write semester number (1, 2, 3, etc.)
     - **Students Enrolled**: Number of students
     - **Internal Examiner**: Name of internal examiner
     - **External Examiner Name**: Name of external examiner
     - **External Examiner Address**: Full address
     - **External Examiner Contact**: 10-digit phone number
     - **External Examiner Email**: Email address
     - **Verification**: Write "Yes" or "No"

4. **Fill Multiple Rows**
   - Each row represents one subject
   - If a subject has multiple examiners, create multiple rows with the same subject
   - Example:
     ```
     Row 1: Subject A, Examiner 1
     Row 2: Subject A, Examiner 2
     Row 3: Subject B, Examiner 1
     ```

5. **Save the Excel File**
   - After filling, save the file on your computer
   - Remember where you saved it

6. **Upload the File**
   - Back on the website, click **"Choose File"** or **"Browse"** button
   - Find and select your Excel file
   - Click **"Upload & Process"** button

7. **Review the Data**
   - The website will show you a preview of the data
   - Check if everything looks correct
   - If wrong, click **"Cancel"** and fix your Excel file
   - If correct, click **"Confirm & Submit"**

8. **Success!**
   - You'll see a success message
   - Data is now saved in the system -->

---

### Feature 3: Subject Entry

**What is it?**  
This lets you assign subjects to yourself and enter examiner details for those subjects.

**How to use it:**

1. **Click "Subject Entry"** from the dashboard

2. **Select Semester**
   - Choose the semester from the dropdown

3. **View Available Subjects**
   - You'll see a list of all subjects for that semester
   - Each subject shows:
     - Subject Name
     - Subject Code
     - Current status (Filled/Unfilled)

4. **Assign Subject to Yourself**
   - Find the subject you want to work on
   - Click **"Assign to Me"** button next to that subject
   - The subject is now assigned to you

5. **Fill Examiner Details**
   - After assigning, you'll see a form
   - Fill in:
     - Number of students enrolled
     - Internal examiner names
     - External examiner details (name, address, contact, email)
     - Verification option

6. **Submit the Entry**
   - Click **"Submit"** button
   - Data will be saved

7. **View Your Assignments**
   - You can see all subjects assigned to you
   - You can edit them later if needed

---

### Feature 4: Upload Documents

**What is it?**  
This allows you to upload exam-related documents (like question papers, answer sheets, reports) to the system.

**How to use it:**

1. **Click "Upload Documents"** from the dashboard

2. **Select Document Type**
   - Choose what type of document you're uploading:
     - Model Question Paper
     - Syllabus

3. **Select Semester**
   - Choose the semester this document belongs to

4. **Select Subject**
   - After selecting semester, you'll see a list of subjects
   - Choose the subject

5. **Choose File**
   - Click **"Choose File"** or **"Browse"**
   - Select the file from your computer
   - Supported formats: PDF, Word (.doc, .docx), Images (.jpg, .png)
   - Maximum file size: Usually 10MB

6. **Upload**
   - Click **"Upload"** button
   - Wait for the upload to complete
   - You'll see a progress bar
   - When done, you'll see a success message

7. **View Uploaded Documents**
   - You can see all your uploaded documents
   - You can download them
   - You can delete them if needed

---

## 👨‍💼 Admin Portal Guide

### How to Login as Admin

1. Click the **"Admin Login"** button on the home page
2. Enter your **Admin Username**
3. Enter your **Admin Password**
4. Click **"Login"**

---

### Admin Dashboard

After logging in, you will see the **Admin Dashboard** with more options than regular users:

#### Admin Features:

1. **Manage Subjects** - Add, edit, or delete subjects
2. **Manage Internal Examiners** - Add or remove internal examiners
3. **Manage Subject Entry** - View and manage subject assignments
4. **Manage Exam Data** - View, edit, and download all exam data
5. **All User Features** - Admins can also do everything users can do

---

### Admin Feature 1: Manage Subjects

**What is it?**  
Add new subjects to the system or edit/delete existing ones.

**How to use it:**

1. **Click "Manage Subjects"** from admin dashboard

2. **View Existing Subjects**
   - You'll see a list of all subjects in the system
   - Each subject shows:
     - Subject Name
     - Subject Code
     - Semester
     - Edit and Delete buttons

3. **Add a New Subject**
   - Click **"Add New Subject"** button
   - Fill in:
     - **Subject Name**: Example: "Data Structures Lab"
     - **Subject Code**: Example: "18CSL46"
     - **Semester**: Select from dropdown (I to VIII)
   - Click **"Save"** button

4. **Edit a Subject**
   - Click the **"Edit"** button (pencil icon 📝) next to any subject
   - Change the details you want to update
   - Click **"Update"** to save changes

5. **Delete a Subject**
   - Click the **"Delete"** button (trash icon 🗑️) next to any subject
   - Confirm deletion when asked
   - **Warning:** This will delete all data related to this subject!

---

### Admin Feature 2: Manage Internal Examiners

**What is it?**  
Add or remove faculty members who can be internal examiners.

**How to use it:**

1. **Click "Manage Internal Examiners"**

2. **View Existing Examiners**
   - See a list of all internal examiners
   - Each shows:
     - Name
     - Department
     - Delete button

3. **Add New Examiner**
   - Click **"Add New Examiner"** button
   - Fill in:
     - **Full Name**: Example: "Dr. Rajesh Kumar"
     - **Department**: Example: "Computer Science"
     - **Email** (Optional)
     - **Phone** (Optional)
   - Click **"Save"**

4. **Remove Examiner**
   - Click **"Delete"** button next to examiner's name
   - Confirm deletion

---

### Admin Feature 3: Manage Subject Entry

**What is it?**  
View who has been assigned which subjects and their submission status.

**How to use it:**

1. **Click "Manage Subject Entry"**

2. **Select Semester**
   - Choose the semester you want to view

3. **View Assignments**
   - You'll see a table showing:
     - Subject Name
     - Subject Code
     - Assigned To (username)
     - Status (Completed/Pending)
     - Submission Date

4. **View Details**
   - Click on any assignment to see full details
   - View who filled what information

5. **Reassign Subject** (if needed)
   - Click **"Reassign"** button
   - The subject becomes available again
   - Another user can then assign it to themselves

---

### Admin Feature 4: Manage Exam Data

**What is it?**  
This is the most powerful feature. It lets you view, edit, and download ALL exam data from ALL semesters.

**How to use it:**

1. **Click "Manage Exam Data"**

2. **Select Semester**
   - Choose which semester's data you want to see
   - The system will load all subjects for that semester

3. **View Subject Status**
   - You'll see all subjects displayed as cards
   - Each card shows:
     - Subject Name
     - Subject Code
     - Status Badge:
       - **Green "Filled"**: Data has been entered
       - **Red "Unfilled"**: No data yet

4. **View Exam Data Details**
   - Click on any subject card with **"Filled"** status
   - A popup window will appear showing:
     - Subject details
     - All internal examiners
     - All external examiners with full details
     - Verification status

5. **Edit Exam Data**
   - In the popup window, click **"Edit"** button
   - You can now modify:
     - Number of students
     - Add/remove internal examiners
     - Add/remove external examiners
     - Change external examiner details
     - Change verification status
   - Click **"Save Changes"** when done

6. **Download Single Subject Data**
   - In the subject details popup, you'll see:
     - **"Download Excel"** button - Downloads this subject's data as Excel
     - **"Download PDF"** button - Downloads this subject's data as PDF

7. **Download Entire Semester Data (BULK DOWNLOAD)**
   - After selecting a semester, click **"Download Sem Exam Data"** button
   - A new window will appear
   - **Edit the Document Title**:
     - You'll see a text box with default title
     - Change it to whatever you want
     - Example: "Panel of Examiners for Even Semester 2025-2026"
   - Choose format:
     - **"Download as Excel"**: 
       - Creates TWO sheets:
       - Sheet 1: All filled subjects with examiner details
       - Sheet 2: List of unfilled subjects
     - **"Download as PDF"**:
       - Creates a formatted PDF with institutional header
       - Shows logo and department details
       - Includes all examiners in a neat table
       - Has signature sections at bottom

8. **Delete Semester Data**
   - Click **"Clear Exam Data"** button (red button)
   - A warning will appear
   - Type "DELETE" to confirm (case-sensitive)
   - Click **"Confirm Delete"**
   - **WARNING:** This deletes ALL exam data for that semester! This cannot be undone!

---

## 📖 Step-by-Step Tutorials

### Tutorial 1: How to Enter Your First Subject Data (User)

**Scenario:** You're a faculty member and need to enter examiner details for one subject.

**Steps:**

1. Open the website and login as **User**
2. Click **"Manual Upload"**
3. Select **"Semester VI"** (or your semester)
4. Type **"1"** in "Number of Subjects"
5. Click **"Generate Forms"**
6. Fill in the form:
   ```
   Subject Name: Operating Systems Lab
   Subject Code: 18CSL66
   Students Enrolled: 45
   Verification: Yes
   ```
7. Click **"Add Internal Examiner"**
8. Type the name: **"Dr. Prakash M"**
9. Click **"Add External Examiner"**
10. Fill external examiner details:
    ```
    Name: abc
    Address: xyz College of Engineering, Bangalore
    Contact: 123456895
    Email: abc@xyz.edu.in
    ```
11. Click **"Submit All"**
12. Wait for success message
13. Click **"Download as PDF"** to save a copy
14. Done! ✅

---

### Tutorial 2: How to Upload Multiple Subjects Using Excel (User)

**Scenario:** You have 10 subjects to enter. Manual entry would take too long.

**Steps:**

1. Login as **User**
2. Click **"Excel Upload"**
3. Click **"Download Excel Template"**
4. Open the downloaded file in Excel
5. Fill in your data row by row:
   ```
   Row 1: Subject A, Code, Semester, Students, Internal Name, External Name, Address, Phone, Email, Yes
   Row 2: Subject B, Code, Semester, Students, Internal Name, External Name, Address, Phone, Email, No
   ...and so on
   ```
6. Save the Excel file as **"my_exam_data.xlsx"**
7. Back on website, click **"Choose File"**
8. Select your saved Excel file
9. Click **"Upload & Process"**
10. Review the preview shown
11. If correct, click **"Confirm & Submit"**
12. Done! All 10 subjects uploaded at once! ✅

---

### Tutorial 3: How to Download All Semester Data (Admin)

**Scenario:** The HOD wants a complete report of all 6th semester examiners.

**Steps:**

1. Login as **Admin**
2. Click **"Manage Exam Data"**
3. Select **"Semester VI"** from dropdown
4. Wait for subjects to load
5. Click **"Download Sem Exam Data"** button
6. In the popup:
   - Edit the title to: **"Panel of Examiners for 6th Semester - January 2026"**
7. Click **"Download as Excel"** if HOD wants Excel
8. OR click **"Download as PDF"** if HOD wants PDF
9. The file will download to your computer
10. Open it and verify it looks good
11. Email it to the HOD
12. Done! ✅

---

### Tutorial 4: How to Fix a Mistake in Entered Data (Admin)

**Scenario:** Someone entered wrong phone number for an external examiner.

**Steps:**

1. Login as **Admin**
2. Click **"Manage Exam Data"**
3. Select the semester where mistake happened
4. Find the subject card
5. Click on it to open details
6. Click **"Edit"** button
7. Scroll to the external examiner section
8. Find the examiner with wrong phone number
9. Click on the phone number field
10. Delete the wrong number
11. Type the correct 10-digit number
12. Click **"Save Changes"**
13. Verify the change by viewing the details again
14. Done! ✅

---

## 🔧 Common Problems & Solutions

### Problem 1: "Login Failed" Error

**Possible Reasons:**
- Wrong username or password
- CAPS LOCK is ON (passwords are case-sensitive)
- Extra spaces in username or password
- Your account hasn't been created yet

**Solutions:**
1. Check if CAPS LOCK is off
2. Type username and password carefully
3. Copy-paste credentials if you have them in a note
4. Contact admin to verify your account exists
5. Ask admin to reset your password

---

### Problem 2: "File Upload Failed"

**Possible Reasons:**
- File is too large (more than 10MB)
- Wrong file format
- No internet connection
- Server is busy

**Solutions:**
1. Check file size (right-click file → Properties)
2. If too large, compress it or use a smaller file
3. Make sure file is PDF, Word, or Excel format
4. Check your internet connection
5. Try again after a few minutes
6. Try using a different browser (Chrome, Firefox)

---

### Problem 3: Excel Upload Shows Errors

**Possible Reasons:**
- Excel columns don't match template
- Missing required fields
- Wrong data format (example: text in phone number field)
- Special characters in data

**Solutions:**
1. Download fresh template from website
2. Copy your data to new template
3. Check each column has correct data:
   - Phone numbers: Only 10 digits, no spaces or dashes
   - Email: Must have @ and .com or .edu.in
   - Semester: Just numbers (1,2,3...)
4. Don't add extra columns
5. Don't change column names
6. Save as .xlsx format (not .xls or .csv)

---

### Problem 4: PDF/Excel Download Not Starting

**Possible Reasons:**
- Pop-up blocker is blocking download
- No data available to download
- Browser settings blocking downloads
- Full storage on computer

**Solutions:**
1. Check if you have data filled in
2. Allow pop-ups for this website
3. Check browser download settings
4. Free up space on computer (delete old files)
5. Try different browser
6. Check Downloads folder - file might already be there

---

### Problem 5: "Route Not Found" or Blank Page

**Possible Reasons:**
- Incorrect URL typed
- Website is under maintenance
- Your session expired (you were logged in too long)
- Network connection issue

**Solutions:**
1. Check URL is correct
2. Clear browser cache (Ctrl + Shift + Delete, select cache, clear)
3. Close browser completely and open again
4. Log out and log in again
5. Contact administrator if problem continues

---

### Problem 6: Changes Not Saving

**Possible Reasons:**
- Clicking outside the form before saving
- Internet connection dropped
- Form validation errors not visible
- Browser cookies disabled

**Solutions:**
1. Scroll up/down to see if there are error messages in red
2. Make sure all required fields are filled (marked with red *)
3. Check internet connection is stable
4. Enable cookies in browser settings
5. Don't press browser back button - use website's navigation buttons
6. Try refreshing page and re-entering data

---

### Problem 7: Can't See Uploaded Documents

**Possible Reasons:**
- Documents in different semester/subject
- Uploaded but still processing
- Browser cache showing old data
- You don't have permission to view

**Solutions:**
1. Make sure you selected correct semester and subject
2. Wait 30 seconds and refresh page
3. Clear browser cache
4. If admin, check if user uploaded in different category
5. Contact admin to verify upload was successful

---

## ❓ Frequently Asked Questions

### Q1: What browsers work best with this website?

**Answer:** The website works best with:
- Google Chrome (Recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari (Mac users)

Avoid using Internet Explorer - it's outdated and may not work properly.

---

### Q2: Can I use this website on my phone or tablet?

**Answer:** Yes! The website is mobile-friendly. However, for better experience, especially when filling forms or uploading data, we recommend using a computer or laptop.

---

### Q3: How do I get login credentials?

**Answer:** 
- **For Users:** Contact your department administrator or HOD
- **For Admins:** Contact the IT department or system administrator

---

### Q4: Can multiple users work on the same subject?

**Answer:** No. Once a subject is assigned to a user in "Subject Entry", that subject is locked to that user. If you need to reassign, contact an admin.

---

### Q5: What happens if I enter wrong data?

**Answer:** 
- **Users:** Contact admin to fix it. Admins can edit any data.
- **Admins:** You can edit data directly in "Manage Exam Data"

---

### Q6: Can I delete my uploaded data?

**Answer:**
- **Users:** No, you cannot delete. Contact admin.
- **Admins:** Yes, you can delete data using "Manage Exam Data" or "Clear Exam Data" button.

---

### Q7: Is my data backed up?

**Answer:** The system stores data in a database. However, it's recommended to:
1. Download Excel/PDF copies regularly
2. Keep backups on your computer
3. Contact admin about server backup policies

---

### Q8: How many examiners can I add per subject?

**Answer:** There's no fixed limit. You can add:
- Multiple internal examiners (usually 2-3)
- Multiple external examiners (usually 1-2)

Add as many as needed for your subject.

---

### Q9: What format should phone numbers be in?

**Answer:** Phone numbers must be:
- Exactly 10 digits
- No spaces
- No dashes (-)
- No country code (+91)
- Example: **9876543210** ✅
- Wrong: **+91 98765-43210** ❌

---

### Q10: Can I edit data after downloading PDF?

**Answer:** 
- No, PDF is just for viewing/printing
- To edit, you must do it on the website
- After editing, download new PDF

---

### Q11: What if the subject I need is not in the list?

**Answer:** Contact admin. They need to add the subject in "Manage Subjects" before you can use it.

---

### Q12: How long can I stay logged in?

**Answer:** Your session typically lasts:
- 1-2 hours of inactivity
- After that, you'll need to login again
- If working on long forms, save frequently!

---

### Q13: Can I see other users' data?

**Answer:**
- **Users:** No, you can only see your own entries
- **Admins:** Yes, admins can see all data

---

### Q14: What's the difference between Excel Upload and Manual Upload?

**Answer:**

| Feature | Manual Upload | Excel Upload |
|---------|--------------|--------------|
| Speed | Slower | Faster |
| Best For | 1-5 subjects | 5+ subjects |
| Requires Excel Skills | No | Yes |
| Can fix errors easily | Yes | Only before upload |
| Preview before save | No | Yes |

---

### Q15: What's the maximum file size for document upload?

**Answer:** Usually **10MB** per file. If your file is larger:
- Compress it using ZIP
- Reduce image quality if it's PDF with images
- Split into multiple smaller files

---

## 📞 Contact & Support

### Technical Support

**For Technical Issues:**
- Email: support@sit.ac.in
- Phone: 0816-xxxx-xxxx (IT Helpdesk)
- Timings: Monday-Friday, 9:00 AM - 5:00 PM

### Administrative Support

**For Data/Access Issues:**
- Contact: Department HOD
- Email: hod.cse@sit.ac.in
- Office: Department of Computer Science and Engineering

### In Case of Emergency

If the website is down or not working:
1. Check your internet connection first
2. Try accessing from different device
3. Contact IT department immediately
4. Call: Emergency IT Support Number

---

## 📝 Important Notes

### DO's ✅

1. ✅ Save data frequently while filling forms
2. ✅ Download backup copies (Excel/PDF) after entering data
3. ✅ Use correct file formats when uploading
4. ✅ Verify data before final submission
5. ✅ Log out when done, especially on shared computers
6. ✅ Keep your password secure and don't share it
7. ✅ Use Google Chrome for best experience
8. ✅ Have your data ready before starting entry

### DON'Ts ❌

1. ❌ Don't share your login credentials with others
2. ❌ Don't use special characters (~!@#$%^&*) in text fields
3. ❌ Don't press browser Back button while filling forms
4. ❌ Don't upload files larger than 10MB
5. ❌ Don't keep multiple tabs of the website open
6. ❌ Don't delete data without confirmation
7. ❌ Don't ignore error messages - read and fix them
8. ❌ Don't forget to click "Submit" or "Save" buttons!

---

## 🎓 Quick Reference Card

### User Login Quick Steps
```
1. Open website
2. Click "User Login"
3. Enter username & password
4. Click "Login"
5. Choose any option from dashboard
```

### Admin Login Quick Steps
```
1. Open website
2. Click "Admin Login"
3. Enter admin credentials
4. Click "Login"
5. Choose management option
```

### Manual Entry Quick Steps
```
1. Manual Upload → Select Semester → Number of Subjects
2. Generate Forms → Fill All Details
3. Add Internal Examiners → Add External Examiners
4. Submit All → Download PDF/Excel (if needed)
```

### Excel Upload Quick Steps
```
1. Excel Upload → Download Template
2. Fill Template → Save File
3. Choose File → Upload & Process
4. Review → Confirm & Submit
```

### Bulk Download Quick Steps (Admin)
```
1. Manage Exam Data → Select Semester
2. Download Sem Exam Data
3. Edit Title → Choose Excel or PDF
4. Download Complete!
```

---

## 📌 Keyboard Shortcuts

- **Tab**: Move to next field
- **Shift + Tab**: Move to previous field
- **Enter**: Submit form (when button is focused)
- **Ctrl + S**: Save (where applicable)
- **Esc**: Close popup/modal
- **Ctrl + F**: Find text on page

---

## 🔄 Version History

- **Version 1.0** (February 2026): Initial release
- Features included: User Portal, Admin Portal, Excel Upload, PDF/Excel Download with custom titles

---

## 📜 Terms of Use

1. This system is for official SIT use only
2. Data entered is subject to verification by authorities  
3. Users are responsible for accuracy of entered data
4. Misuse of system may result in access being revoked
5. All activities are logged for security purposes

---

## 🎯 Summary

This website helps you manage lab exam examiner data efficiently. Remember:

- **Users** can enter data and upload documents
- **Admins** can manage everything and download reports
- Always **save your work** frequently
- Download **backup copies** of important data
- Contact **support** if you face any issues

---

## 📥 How to Download This Guide

**To save this guide:**

1. **As PDF:**
   - Press `Ctrl + P` (Windows) or `Cmd + P` (Mac)
   - Select "Save as PDF"
   - Choose location and click "Save"

2. **As Text File:**
   - Copy all content
   - Open Notepad or Word
   - Paste and save

3. **Print Physical Copy:**
   - Press `Ctrl + P`
   - Select your printer
   - Click "Print"

---

**End of User Guide**

*For latest updates to this guide, check the documentation folder on the website or contact your administrator.*

---

**Document prepared by:** SIT IT Department  
**Last reviewed:** February 2026  
**Next review date:** August 2026

---
