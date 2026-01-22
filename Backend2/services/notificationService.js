const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// SMTP Config (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use Google App Password
    }
});

// WhatsApp Config (Twilio)
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendLowAttendanceAlert = async (student) => {
    const message = `Attendance Alert: ${student.fullName}'s attendance in ${student.subject} is ${student.actualAttendance}%. A minimum of 75% is required.`;

    // 1. Send Email via SMTP
    try {
        await transporter.sendMail({
            from: `"University Mentor" <${process.env.EMAIL_USER}>`,
            to: student.parentEmail,
            subject: `Urgent: Attendance Warning - ${student.fullName}`,
            text: message
        });
        console.log(`Email sent to: ${student.parentEmail}`);
    } catch (err) { console.error("Email Error:", err.message); }

    // 2. Send WhatsApp via Twilio
    try {
        await twilioClient.messages.create({
            from: 'whatsapp:+14155238886', // Twilio Sandbox Number
            to: `whatsapp:${student.parentPhone}`,
            body: message
        });
        console.log(`WhatsApp sent to: ${student.parentPhone}`);
    } catch (err) { console.error("WhatsApp Error:", err.message); }
};

module.exports = { sendLowAttendanceAlert };