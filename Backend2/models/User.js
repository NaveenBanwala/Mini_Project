const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true }
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: { 
        type: DataTypes.ENUM('mentor', 'parent'), 
        allowNull: false
    },
    // --- NEW FIELDS ---
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: true, // Set to false if you want it mandatory for everyone
        unique: true
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: true, // Required logic handled in controller or via custom validation
        comment: 'Mainly for Mentors (e.g., 2024-25)'
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Applicable for Mentors'
    },
    // --- PARENT SPECIFIC ---
    rollNo: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
}, {
    timestamps: true // Ensures createdAt and updatedAt are tracked
});

module.exports = User;

// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/db');

// const User = sequelize.define('User', {
//     id: { 
//         type: DataTypes.UUID, 
//         defaultValue: DataTypes.UUIDV4, 
//         primaryKey: true 
//     },
//     name: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     username: { 
//         type: DataTypes.STRING, 
//         allowNull: false, 
//         unique: true 
//     },
//     email: { 
//         type: DataTypes.STRING, 
//         allowNull: false, 
//         unique: true 
//     },
//     password: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     role: { 
//         type: DataTypes.ENUM('mentor', 'parent'), 
//         allowNull: false
//     },
//     rollNo: { 
//         type: DataTypes.STRING, 
//         allowNull: true // Only required for parents
//     }
// });

// module.exports = User;