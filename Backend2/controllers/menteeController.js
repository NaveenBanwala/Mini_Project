const Student = require('../models/Student');
const User = require("../models/User");
const { Op } = require('sequelize');
const xlsx = require('xlsx');

const emailService = require('../services/emailService');

const whatsappService = require('../services/whatsappService'); 


exports.getProfile = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const mentor = await User.findByPk(mentorId, {
            attributes: ['username', 'email', 'department', 'academicYear', 'mobileNo']
        });

        if (!mentor) {
            return res.status(404).json({ error: "Mentor profile not found" });
        }

        res.json(mentor);
    } catch (err) {
        res.status(500).json({ error: "Server error fetching profile: " + err.message });
    }
};

exports.sendBulkAlerts = async (req, res) => {
    try {
        const mentorId = req.user.id;

        // 1. Find at-risk students
        const lowAttendanceStudents = await Student.findAll({
            where: {
                mentorId: mentorId,
                actualAttendance: { [Op.lt]: 75 }
            }
        });

        if (lowAttendanceStudents.length === 0) {
            return res.status(404).json({ message: "No students found with low attendance." });
        }

        // 2. Create a list of all notification tasks (Email + WhatsApp)
        const alertPromises = [];

        lowAttendanceStudents.forEach(student => {
            const message = `Alert: Your ward ${student.fullName}'s attendance is ${student.actualAttendance}%, which is below the required 75%. Please ensure regular attendance.`;

            // Add Email task if email exists
            if (student.parentEmail) {
                alertPromises.push(
                    emailService.sendAttendanceAlert(
                        student.parentEmail,
                        student.fullName,
                        student.actualAttendance
                    )
                );
            }

            // Add WhatsApp task if phone number exists
            if (student.parentPhone) {
                alertPromises.push(
                    whatsappService.sendWhatsAppMessage(
                        student.parentPhone, 
                        message
                    )
                );
            }
        });

        // 3. Execute all tasks at once
        await Promise.all(alertPromises);

        res.json({ 
            message: `Successfully sent Email & WhatsApp alerts to ${lowAttendanceStudents.length} parents.` 
        });

    } catch (err) {
        console.error("Bulk Alert Error:", err);
        res.status(500).json({ error: "Failed to send bulk alerts: " + err.message });
    }
};

// exports.sendBulkAlerts = async (req, res) => {
//     try {
//         const mentorId = req.user.id;

//         // 1. Find all students belonging to this mentor with attendance < 75
//         const lowAttendanceStudents = await Student.findAll({
//             where: {
//                 mentorId: mentorId,
//                 actualAttendance: { [Op.lt]: 75 }
//             }
//         });

//         if (lowAttendanceStudents.length === 0) {
//             return res.status(404).json({ message: "No students found with low attendance." });
//         }

//         // 2. Send emails in parallel
//         const emailPromises = lowAttendanceStudents.map(student => {
//             if (student.parentEmail) {
//                 return emailService.sendAttendanceAlert(
//                     student.parentEmail,
//                     student.fullName,
//                     student.actualAttendance
//                 );
//             }
//         });

//         await Promise.all(emailPromises);

//         res.json({ message: `Successfully sent alerts to ${lowAttendanceStudents.length} parents.` });
//     } catch (err) {
//         console.error("Bulk Email Error:", err);
//         res.status(500).json({ error: "Failed to send bulk alerts: " + err.message });
//     }
// };

// 1. Get All Students (with Parent UUID join)
exports.getAllStudents = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const students = await Student.findAll({
            where: { mentorId: mentorId },
            order: [['fullName', 'ASC']],
            include: [{
                model: User,
                as: 'parentAccount',
                attributes: ['id']
            }]
        });

        const formattedStudents = students.map(s => {
            const studentData = s.toJSON();
            return {
                ...studentData,
                parentUserId: studentData.parentAccount ? studentData.parentAccount.id : null
            };
        });

        res.json(formattedStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.uploadExcel = async (req, res) => {
    try {
        const mentorId = req.user.id; 
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const studentRecords = data.map(row => {
            const roll = row['Roll Number'] || row['rollNo'];
            if (!roll) return null;
            return {
                rollNo: roll.toString().trim(),
                fullName: row['Full Name'] || row['fullName'],
                subject: row['Subject'] || row['subject'],
                actualAttendance: parseFloat(row['Actual Attnd%'] || row['actualAttendance'] || 0),
                parentName: row['P_ NAME'] || row['parentName'],
                parentPhone: row['NUMBER'] || row['parentPhone'],
                parentEmail: row['EMAIL'] || row['parentEmail'],
                parentId: roll.toString().trim(), 
                mentorId: mentorId 
            };
        }).filter(r => r !== null);

        // --- THE FIX ---
        // 1. Delete all existing students for THIS mentor only
        await Student.destroy({ where: { mentorId: mentorId } });

        // 2. Insert the fresh data from the Excel
        await Student.bulkCreate(studentRecords);

        res.json({ message: `Database synced. ${studentRecords.length} students updated.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// // 2. Upload Excel Data
// exports.uploadExcel = async (req, res) => {
//     try {
//         const mentorId = req.user.id; 
//         if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//         const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//         const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

//         const studentRecords = data.map(row => {
//             const roll = row['Roll Number'] || row['rollNo'];
//             if (!roll) return null;
//             return {
//                 rollNo: roll.toString().trim(),
//                 fullName: row['Full Name'] || row['fullName'],
//                 subject: row['Subject'] || row['subject'],
//                 actualAttendance: parseFloat(row['Actual Attnd%'] || row['actualAttendance'] || 0),
//                 parentName: row['P_ NAME'] || row['parentName'],
//                 parentPhone: row['NUMBER'] || row['parentPhone'],
//                 parentEmail: row['EMAIL'] || row['parentEmail'],
//                 parentId: roll.toString().trim(), 
//                 mentorId: mentorId 
//             };
//         }).filter(r => r !== null);

//         await Student.bulkCreate(studentRecords, {
//             updateOnDuplicate: ['fullName', 'subject', 'actualAttendance', 'parentName', 'parentPhone', 'parentEmail', 'parentId', 'mentorId']
//         });

//         res.json({ message: `Successfully synced ${studentRecords.length} students.` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// 3. Get Stats (Total and Alerts)
exports.getStats = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const total = await Student.count({ where: { mentorId } });
        const alerts = await Student.count({ 
            where: { 
                mentorId, 
                actualAttendance: { [Op.lt]: 75 } 
            } 
        });
        res.json({ total, alerts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get Single Student by Roll Number
exports.getStudentById = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const student = await Student.findOne({
            where: { rollNo: req.params.id, mentorId }
        });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send alert to a specific student's parent

// const Student = require('../models/Student');
// const User = require("../models/User")
// const { Op } = require('sequelize');
// const xlsx = require('xlsx'); // Make sure to npm install xlsx

// exports.getAllStudents = async (req, res) => {
//     try {
//         const mentorId = req.user.id;

//         const students = await Student.findAll({
//             where: { mentorId: mentorId },
//             order: [['fullName', 'ASC']],
//             // We join with the User table where User.rollNo matches Student.rollNo
//             include: [{
//                 model: User,
//                 as: 'parentAccount', 
//                 attributes: ['id'] // This gets the UUID from the User table
//             }]
//         });
        
//         // Flatten the data so 'parentUserId' is easy for the frontend to find
//         const formattedStudents = students.map(s => {
//             const studentData = s.toJSON();
//             return {
//                 ...studentData,
//                 parentUserId: studentData.parentAccount ? studentData.parentAccount.id : null
//             };
//         });

//         res.json(formattedStudents);
//     } catch (err) {
//         console.error("Error fetching students:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.uploadExcel = async (req, res) => {
//     try {
//         const mentorId = req.user.id; 
//         if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//         const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//         const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

//         const studentRecords = data.map(row => {
//             const roll = row['Roll Number'] || row['rollNo'];
//             if (!roll) return null;

//             return {
//                 rollNo: roll.toString().trim(),
//                 fullName: row['Full Name'] || row['fullName'],
//                 subject: row['Subject'] || row['subject'],
//                 actualAttendance: parseFloat(row['Actual Attnd%'] || row['actualAttendance'] || 0),
//                 parentName: row['P_ NAME'] || row['parentName'],
//                 parentPhone: row['NUMBER'] || row['parentPhone'],
//                 parentEmail: row['EMAIL'] || row['parentEmail'],
//                 // Set parentId to Roll Number so parents can login using the Roll No
//                 parentId: roll.toString().trim(), 
//                 mentorId: mentorId 
//             };
//         }).filter(r => r !== null);

//         await Student.bulkCreate(studentRecords, {
//             updateOnDuplicate: [
//                 'fullName', 'subject', 'actualAttendance', 
//                 'parentName', 'parentPhone', 'parentEmail', 'parentId', 'mentorId'
//             ]
//         });

//         res.json({ message: `Successfully synced ${studentRecords.length} students to your mentor account.` });
//     } catch (err) {
//         console.error("Upload Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.getStats = async (req, res) => {
//     try {
//         const mentorId = req.user.id; // Only count students assigned to THIS mentor

//         const total = await Student.count({ 
//             where: { mentorId: mentorId } 
//         });

//         const alerts = await Student.count({ 
//             where: { 
//                 mentorId: mentorId,
//                 actualAttendance: { [Op.lt]: 75 } 
//             } 
//         });

//         res.json({ total, alerts });
//     } catch (err) { 
//         res.status(500).json({ error: err.message }); 
//     }
// };

// // exports.getAllStudents = async (req, res) => {
// //     try {
// //         const mentorId = req.user.id;

// //         // Fetch ONLY students belonging to the logged-in mentor
// //         const students = await Student.findAll({
// //             where: { mentorId: mentorId },
// //             order: [['fullName', 'ASC']]
// //         });
        
// //         res.json(students);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // };

// exports.getStudentById = async (req, res) => {
//     try {
//         const mentorId = req.user.id;
//         const student = await Student.findOne({
//             where: { 
//                 rollNo: req.params.id, 
//                 mentorId: mentorId // Security: Mentor can only view their own student
//             }
//         });

//         if (!student) return res.status(404).json({ message: "Student not found in your mentee list" });
//         res.json(student);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.updateAttendance = async (req, res) => {
//     try {
//         const mentorId = req.user.id;
        
//         const [updated] = await Student.update(req.body, { 
//             where: { 
//                 rollNo: req.params.rollNo,
//                 mentorId: mentorId // Ensure mentor is authorized to update this student
//             } 
//         });

//         if (updated === 0) return res.status(404).json({ message: "Student not found or unauthorized" });
        
//         res.json({ message: "Attendance updated successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.sendManualAlert = async (req, res) => {
//     try {
//         // Here you would find student email/parent mobile from DB first
//         res.json({ message: "Manual alert triggered for " + req.params.rollNo });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };