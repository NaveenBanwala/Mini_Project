const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // Middleware we fixed earlier
const Student = require('../models/Student');
const User = require('../models/User'); // Used to fetch Mentor/Mentee details

/**
 * @route   GET /api/parent/child/:rollNo
 * @desc    Get student details and their assigned mentor for the parent dashboard
 * @access  Private (Parent only)
 */
router.get('/child/:rollNo', verifyToken, async (req, res) => {
    try {
        const { rollNo } = req.params;

        // 1. Fetch Student from DB using your model's specific fields
        // We use findOne because rollNo is the primary search key from the UI
        const student = await Student.findOne({ 
            where: { rollNo: rollNo } 
        });

        if (!student) {
            return res.status(404).json({ 
                message: `Student with Roll No ${rollNo} not found.` 
            });
        }

        // 2. Fetch Mentor details
        // Assuming your Student model has a 'mentorId' column 
        // linked to the 'id' in your Users table
        let mentorData = null;
        if (student.mentorId) {
            mentorData = await User.findOne({
                where: { id: student.mentorId },
                attributes: ['id', 'name', 'email', 'mobile'] // Only send necessary info
            });
        }

        // 3. Construct response to match ParentDashboard.jsx expectations
        // Note: We map the DB fields to the structure the frontend expects
        res.json({
            student: {
                rollNo: student.rollNo,
                fullName: student.fullName,
                subject: student.subject,
                actualAttendance: student.actualAttendance,
                parentName: student.parentName
            },
            mentor: mentorData || {
                name: "Not Assigned",
                email: "N/A",
                mobile: "N/A"
            }
        });

    } catch (err) {
        console.error("Error in Parent Route:", err.message);
        res.status(500).json({ 
            message: "Server Error", 
            error: err.message 
        });
    }
});

module.exports = router;