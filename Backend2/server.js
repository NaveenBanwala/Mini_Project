const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');
const Message = require('./models/message');

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// --- DEFINE ASSOCIATIONS (Must match Controller Aliases) ---

// 1. Mentorship
User.hasMany(Student, { foreignKey: 'mentorId', as: 'mentees' });
Student.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

// 2. Parent Account Link (Matches menteeController include)
Student.belongsTo(User, { foreignKey: 'rollNo', targetKey: 'rollNo', as: 'parentAccount' });
User.hasOne(Student, { foreignKey: 'rollNo', sourceKey: 'rollNo' });

// 3. Message Links
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Recipient', foreignKey: 'recipientId' });

// --- STARTUP ---
// connectDB().then(() => {
//     sequelize.sync({ alter: false });
//     console.log("🛠️  Database & Associations Ready");
// });

// --- STARTUP ---
connectDB().then(() => {
    // Change 'false' to 'true' to apply model changes to Postgres
    sequelize.sync({ alter: true }).then(() => {
        console.log("🛠️  Database & Associations Ready (Schema Updated)");
    });
});

app.use('/api', require('./routes/api'));

app.use((err, req, res, next) => {
    console.error("❌ SERVER CRASH:", err.stack);
    res.status(500).json({ error: err.message });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));