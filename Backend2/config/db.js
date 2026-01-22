const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('attendance_portal', 'admin', 'password123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, // Set to true to see SQL logs in console
});

// config/db.js
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        // CHANGE THIS LINE: From { force: true } to { alter: true }
        await sequelize.sync({ alter: true }); 
        console.log('✅ Database Connected & Synced...');
    } catch (err) {
        console.error('PostgreSQL Connection Error:', err.message);
        process.exit(1);
    }
};
module.exports = { sequelize, connectDB };