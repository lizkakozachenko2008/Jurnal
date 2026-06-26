const router = require('express').Router();
const teacherController = require('../controllers/teacherController');
const { authMiddleware, requireTeacher } = require('../middleware/auth');
const { uploadProgram } = require('../middleware/upload');

// Все маршруты требуют авторизации и роль преподавателя
router.use(authMiddleware);
router.use(requireTeacher);

// === ЖУРНАЛ ===
// Получить предметы и группы преподавателя
router.get('/subjects', teacherController.getSubjects);

// Получить группы преподавателя
router.get('/groups', teacherController.getGroups);

// Получить полный журнал по предмету и группе
router.get('/journal/:subject/:groupName', teacherController.getFullJournal);

// Добавить дату занятия
router.post('/lesson-dates', teacherController.addLessonDate);

// Удалить дату занятия
router.delete('/lesson-dates/:id', teacherController.removeLessonDate);

// Выставить оценку
router.post('/grades', teacherController.setGrade);

// Обновить оценку
router.put('/grades/:id', teacherController.updateGrade);

// Удалить оценку
router.delete('/grades/:id', teacherController.removeGrade);

// Отметить посещаемость (одиночная)
router.post('/attendance', teacherController.setAttendance);

// Массовое обновление посещаемости
router.post('/attendance/bulk', teacherController.bulkSetAttendance);

// === ЛАБОРАТОРНЫЕ РАБОТЫ ===
// Получить лабораторные работы преподавателя
router.get('/lab-works', teacherController.getLabWorks);

// Создать лабораторную работу
router.post('/lab-works', teacherController.createLabWork);

// Обновить лабораторную работу
router.put('/lab-works/:id', teacherController.updateLabWork);

// Удалить лабораторную работу
router.delete('/lab-works/:id', teacherController.removeLabWork);

// Получить сдачи по лабораторной
router.get('/lab-works/:labWorkId/submissions', teacherController.getSubmissions);

// Получить все сдачи преподавателя
router.get('/submissions', teacherController.getAllSubmissions);

// Проверить работу
router.put('/submissions/:id/check', teacherController.checkSubmission);

// Команды для лабораторных
router.get('/lab-works/:labWorkId/teams', teacherController.getTeams);
router.post('/teams', teacherController.createTeam);
router.delete('/teams/:labWorkId/:teamName', teacherController.removeTeam);

// === ПРОГРАММА ПРЕДМЕТА ===
// Получить программу по предмету
router.get('/programs/:subject', teacherController.getLessonProgram);

// Добавить занятие в программу
router.post('/programs', teacherController.addLessonToProgram);

// Обновить занятие в программе
router.put('/programs/:id', teacherController.updateLessonInProgram);

// Удалить занятие из программы
router.delete('/programs/:id', teacherController.removeLessonFromProgram);

// Загрузить PDF к занятию
router.post('/programs/:id/upload', uploadProgram, teacherController.uploadProgramFile);

// === РАСПИСАНИЕ ===
// Получить расписание преподавателя
router.get('/schedule', teacherController.getSchedule);

// === СТУДЕНТЫ ===
// Получить всех студентов
router.get('/students', teacherController.getAllStudents);

// Деактивировать/активировать студента
router.put('/students/:id/active', teacherController.setStudentActive);
// Уведомления (новые сдачи)
router.get('/notifications', teacherController.getNotifications);

module.exports = router;
