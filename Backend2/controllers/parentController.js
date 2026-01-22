const Student = require('../models/Student');
const User = require('../models/User');

exports.getChildByRoll = async (req, res) => {
    try {
        // We accept either rollNo or parentId from the request
        const { identifier } = req.params; 

        console.log("-----------------------------------------");
        console.log("🔍 PARENT SEARCH TRIGGERED");
        console.log("📥 Received Identifier:", identifier);

        // 1. Find the student where identifier matches EITHER rollNo OR parentId
        const student = await Student.findOne({ 
            where: {
                [require('sequelize').Op.or]: [
                    { rollNo: String(identifier).trim() },
                    { parentId: String(identifier).trim() }
                ]
            }
        });

        if (!student) {
            console.log("❌ NOT FOUND:", identifier);
            return res.status(404).json({ 
                message: "No student found. Please check the ID provided by the Mentor." 
            });
        }

        console.log("✅ FOUND STUDENT:", student.fullName);

        // 2. Fetch Mentor info so parent can contact them
        let mentor = null;
        if (student.mentorId) {
            mentor = await User.findOne({ 
                where: { id: student.mentorId },
                attributes: ['username', 'email'] // Use 'username' since your table has it
            });
        }

        // 3. Return combined data
        res.json({ 
            student, 
            mentor: mentor || { username: "Not Assigned", email: "N/A" } 
        });

    } catch (err) {
        console.error("🔥 Parent Controller Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getParentDashboard = async (req, res) => {
    // This can be used to send general announcements to parents
    res.json({ 
        message: "Welcome to the Parent Portal",
        instructions: "Enter your Parent ID to view your child's live attendance." 
    });
};