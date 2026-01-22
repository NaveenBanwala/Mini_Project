const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers/authController');
const parentController = require('../controllers/parentController');
const menteeController = require('../controllers/menteeController');
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

/** --- Authentication --- **/
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.getMe);

/** --- Parent Routes --- **/
router.get('/parent/child/:rollNo', verifyToken, parentController.getChildByRoll);
router.get('/parent/dashboard', verifyToken, parentController.getParentDashboard);

/** --- Mentee (Mentor) --- **/
router.get('/mentee/stats', verifyToken, menteeController.getStats);
router.get('/mentee/students', verifyToken, menteeController.getAllStudents);
router.post('/mentee/upload', verifyToken, upload.single('file'), menteeController.uploadExcel);

/** --- Chat --- **/
router.get('/chat/contacts', verifyToken, chatController.getContacts);
router.get('/chat/history/:targetUserId', verifyToken, chatController.getHistory);
router.post('/chat/send', verifyToken, chatController.sendMessage);

module.exports = router;