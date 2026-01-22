const express = require('express');
const router = express.Router();
const multer = require('multer');
const menteeController = require('../controllers/menteeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// Security: All routes below require login and 'mentor' role
router.use(protect);
router.use(authorize('mentor')); 

// --- ROUTES ---

// 1. Upload Excel: Assigns students to req.user.id automatically
router.post('/upload', upload.single('file'), menteeController.uploadExcel);

// 2. Stats: Calculates total/alerts for the logged-in mentor ONLY
router.get('/stats', menteeController.getStats);

// 3. Get Students: Calls getAllStudents which filters by mentorId
router.get('/students', menteeController.getAllStudents);

// 4. Get Single Student: Ensure mentor owns the student before showing details
router.get('/students/:id', menteeController.getStudentById);

// 5. Update: Only allows updating if student.mentorId === req.user.id
router.put('/students/:rollNo', menteeController.updateAttendance);

// 6. Alerts: Trigger manual notifications
router.post('/students/:rollNo/send-alert', menteeController.sendManualAlert);

module.exports = router;