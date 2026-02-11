const Message = require("../models/message");
const User = require('../models/User');
const Student = require('../models/Student');
const { Op } = require('sequelize');

const isUUID = (str) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
};

// Get Conversation History (Limited to Last 5)
exports.getHistory = async (req, res) => {
    try {
        let { targetUserId } = req.params;
        const myId = req.user.id;

        if (!isUUID(targetUserId)) {
            const targetUser = await User.findOne({ where: { rollNo: targetUserId } });
            if (!targetUser) return res.json([]); 
            targetUserId = targetUser.id;
        }

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: myId, recipientId: targetUserId },
                    { senderId: targetUserId, recipientId: myId }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.json(messages.reverse());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        let { recipientId, text } = req.body;
        const senderId = req.user.id; 

        console.log(`📩 Attempting to send message from ${senderId} to ${recipientId}`);

      if (!isUUID(recipientId)) {
    const targetUser = await User.findOne({ where: { rollNo: recipientId } });
    if (!targetUser) {
        return res.status(404).json({ error: "Recipient user account not found." });
    }
    recipientId = targetUser.id;
}

        const newMessage = await Message.create({ senderId, recipientId, text });
        res.status(201).json(newMessage);
    } catch (err) {
        console.error("🔥 Chat Send Error:", err);
        res.status(500).json({ error: err.message });
    }
};
// Get Contacts
exports.getContacts = async (req, res) => {
    try {
        const myId = req.user.id;
        const myRole = req.user.role;

        if (myRole === 'parent') {
            const student = await Student.findOne({ where: { rollNo: req.user.rollNo } });
            if (!student || !student.mentorId) return res.json([]);
            const mentor = await User.findByPk(student.mentorId, { attributes: ['id', 'username', 'role'] });
            return res.json(mentor ? [mentor] : []);
        } else {
            const assignedStudents = await Student.findAll({ where: { mentorId: myId } });
            const parentRollNos = assignedStudents.map(s => s.rollNo);
            const parentUsers = await User.findAll({
                where: { rollNo: { [Op.in]: parentRollNos } },
                attributes: ['id', 'username', 'rollNo']
            });
            res.json(parentUsers.map(p => ({ id: p.id, username: p.username, role: 'parent' })));
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};