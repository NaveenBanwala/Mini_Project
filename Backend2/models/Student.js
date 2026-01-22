const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Student = sequelize.define('Student', {
    rollNo: { 
        type: DataTypes.STRING, 
        allowNull: false,
        primaryKey: true 
    },
    fullName: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING },
    actualAttendance: { type: DataTypes.FLOAT },
    
    // This is the unique ID from Excel parents use to log in
    parentId: { 
        type: DataTypes.STRING,
        unique: true,
        allowNull: true 
    },
    
    parentName: { type: DataTypes.STRING },
    parentPhone: { type: DataTypes.STRING },
    parentEmail: { type: DataTypes.STRING },
    
    mentorId: { 
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, { 
    timestamps: true 
});

module.exports = Student;