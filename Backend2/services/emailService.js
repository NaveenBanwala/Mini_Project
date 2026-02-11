const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

exports.sendAttendanceAlert = async (parentEmail, studentName, attendance) => {
    const mailOptions = {
        from: `"Mentor Connect" <${process.env.EMAIL_USER}>`,
        to: parentEmail,
        subject: `Attendance Warning: ${studentName}`,
        html: `
            <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #d9534f;">Attendance Alert</h2>
                <p>Dear Parent,</p>
                <p>This is an automated notification regarding <b>${studentName}</b>.</p>
                <p>The current recorded attendance is <b>${attendance}%</b>, which is below the mandatory 75% threshold.</p>
                <p>Please take the necessary steps to ensure regular attendance.</p>
                <br>
                <p>Regards,<br>Mentorship Department</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};