const User = require('./User');
const Student = require('./Student');
const Message = require('./message'); // Ensure case matches your filename

const setupAssociations = () => {
    // 1. Mentorship Link
    // A Mentor (User) has many Students
    User.hasMany(Student, { foreignKey: 'mentorId', as: 'mentees' });
    Student.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

    // 2. Parent-Student Link (via rollNo)
    // A Parent (User) has one Student record
    User.hasOne(Student, { foreignKey: 'rollNo', sourceKey: 'rollNo' });
    Student.belongsTo(User, { foreignKey: 'rollNo', targetKey: 'rollNo' });

    // 3. Chat Links
    Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
    Message.belongsTo(User, { as: 'Recipient', foreignKey: 'recipientId' });

    console.log("🛠️  Model Associations Synchronized");
};

module.exports = setupAssociations;