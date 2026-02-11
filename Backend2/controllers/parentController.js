const Student = require('../models/Student');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getChildByRoll = async (req, res) => {
    try {
        const { identifier } = req.params;
        console.log("🟢 API HIT: Searching for Student:", identifier);

        // 1. Find the student record
        const student = await Student.findOne({ 
            where: { rollNo: String(identifier).trim() }
        });

        if (!student) {
            console.log("❌ Student Not Found in DB");
            return res.status(404).json({ message: "Student record not found." });
        }

        // 2. Fetch Mentor data safely
        let mentorData = null;
        if (student.mentorId) {
            // We fetch the whole object first to avoid "column does not exist" crashes
            mentorData = await User.findByPk(student.mentorId);
        }

        // 3. Return structured JSON
        res.json({
            student: {
                rollNo: student.rollNo,
                fullName: student.fullName,
                subject: student.subject,
                actualAttendance: student.actualAttendance,
                parentName: student.parentName,
                parentId: student.parentId
            },
            mentor: {
                id: mentorData?.id,
                // Use || to provide fallbacks if the database column names differ
                name: mentorData?.username || mentorData?.name || "Not Assigned",
                email: mentorData?.email || "N/A",
                // Check if mobile exists on the object, otherwise return N/A
                mobile: mentorData?.mobile || mentorData?.phone || "N/A"
            }
        });

    } catch (err) {
        // This will now catch any other database issues without crashing the whole server
        console.error("🔥 Controller Error:", err);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message 
        });
    }
};

exports.getParentDashboard = async (req, res) => {
    res.json({ message: "Dashboard data loaded successfully" });
};
