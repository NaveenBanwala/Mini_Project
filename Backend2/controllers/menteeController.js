const Student = require('../models/Student');
const { Op } = require('sequelize');
const xlsx = require('xlsx'); // Make sure to npm install xlsx



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
                // Set parentId to Roll Number so parents can login using the Roll No
                parentId: roll.toString().trim(), 
                mentorId: mentorId 
            };
        }).filter(r => r !== null);

        await Student.bulkCreate(studentRecords, {
            updateOnDuplicate: [
                'fullName', 'subject', 'actualAttendance', 
                'parentName', 'parentPhone', 'parentEmail', 'parentId', 'mentorId'
            ]
        });

        res.json({ message: `Successfully synced ${studentRecords.length} students to your mentor account.` });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const mentorId = req.user.id; // Only count students assigned to THIS mentor

        const total = await Student.count({ 
            where: { mentorId: mentorId } 
        });

        const alerts = await Student.count({ 
            where: { 
                mentorId: mentorId,
                actualAttendance: { [Op.lt]: 75 } 
            } 
        });

        res.json({ total, alerts });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const mentorId = req.user.id;

        // Fetch ONLY students belonging to the logged-in mentor
        const students = await Student.findAll({
            where: { mentorId: mentorId },
            order: [['fullName', 'ASC']]
        });
        
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const student = await Student.findOne({
            where: { 
                rollNo: req.params.id, 
                mentorId: mentorId // Security: Mentor can only view their own student
            }
        });

        if (!student) return res.status(404).json({ message: "Student not found in your mentee list" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const mentorId = req.user.id;
        
        const [updated] = await Student.update(req.body, { 
            where: { 
                rollNo: req.params.rollNo,
                mentorId: mentorId // Ensure mentor is authorized to update this student
            } 
        });

        if (updated === 0) return res.status(404).json({ message: "Student not found or unauthorized" });
        
        res.json({ message: "Attendance updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendManualAlert = async (req, res) => {
    try {
        // Here you would find student email/parent mobile from DB first
        res.json({ message: "Manual alert triggered for " + req.params.rollNo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};