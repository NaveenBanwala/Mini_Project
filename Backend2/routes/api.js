const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers/authController');
const parentController = require('../controllers/parentController');
const menteeController = require('../controllers/menteeController');
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

// Debugging line (Delete this after the server starts)
console.log("DEBUG: chatController methods:", Object.keys(chatController));

/** --- Auth --- **/
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.getMe);


router.put('/auth/profile', verifyToken, authController.updateProfile);

/** --- Parent --- **/
router.get('/parent/child/:identifier', verifyToken, parentController.getChildByRoll);
router.get('/parent/dashboard', verifyToken, parentController.getParentDashboard);

/** --- Mentee --- **/
router.get('/mentee/stats', verifyToken, menteeController.getStats);
router.get('/mentee/students', verifyToken, menteeController.getAllStudents);
router.post('/mentee/upload', verifyToken, upload.single('file'), menteeController.uploadExcel);

// Add this in the Mentee section
router.post('/mentee/send-alerts', verifyToken, menteeController.sendBulkAlerts);

// Mentee Profile Route
router.get('/mentee/profile', verifyToken, menteeController.getProfile);


/** --- Chat --- **/
router.get('/chat/history/:targetUserId', verifyToken, chatController.getHistory);
router.post('/chat/send', verifyToken, chatController.sendMessage);
router.get('/chat/contacts', verifyToken, chatController.getContacts);
router.put('/chat/read/:senderId', verifyToken, (req, res) => res.json({ message: "Read" }));



module.exports = router;