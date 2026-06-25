const router = require('express').Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, requireStudent } = require('../middleware/auth');

router.use(authMiddleware);
router.use(requireStudent);

router.get('/schedule', studentController.getSchedule);
router.get('/grades', studentController.getGrades);
router.get('/grades/:subject', studentController.getSubjectGrades);
router.get('/lab-works', studentController.getLabWorks);
router.get('/lab-works/:id', studentController.getLabWorkDetails);

module.exports = router;