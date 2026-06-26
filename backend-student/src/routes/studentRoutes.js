const router = require('express').Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, requireStudent } = require('../middleware/auth');
const { uploadLab } = require('../middleware/upload');

router.use(authMiddleware);
router.use(requireStudent);

router.get('/schedule', studentController.getSchedule);
router.get('/grades', studentController.getGrades);
router.get('/grades/:subject', studentController.getSubjectGrades);
router.get('/lab-works', studentController.getLabWorks);
router.get('/lab-works/:id', studentController.getLabWorkDetails);
router.post('/lab-works/:id/submit', uploadLab, studentController.submitLabWork);

module.exports = router;