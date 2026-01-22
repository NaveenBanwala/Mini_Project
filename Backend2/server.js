const express = require('express');
const cors = require('cors'); // Use the official package
const { connectDB } = require('./config/db');
require('dotenv').config();

const app = express();

// 1. USE THE OFFICIAL CORS PACKAGE (Configured for total access)
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) or localhost
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. DEBUGGER - This is critical now
app.use((req, res, next) => {
    console.log(`📡 Incoming: ${req.method} ${req.url}`);
    next();
});

// 3. DATABASE & ROUTES
connectDB();
app.use('/api', require('./routes/api'));

// 4. ERROR HANDLER (This prevents CORS headers from disappearing on crash)
app.use((err, req, res, next) => {
    console.error("❌ SERVER CRASH:", err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});