const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const errorHandler = require('./middleware/errorHandler');
const { PORT } = require('./utils/constants');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Student Journal API',
    version: '3.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      student: {
        schedule: 'GET /api/student/schedule',
        grades: 'GET /api/student/grades',
        labWorks: 'GET /api/student/lab-works'
      },
      teacher: {
        subjects: 'GET /api/teacher/subjects',
        groups: 'GET /api/teacher/groups',
        journal: 'GET /api/teacher/journal/:subject/:groupName',
        lessonDates: 'POST/DELETE /api/teacher/lesson-dates',
        grades: 'POST/PUT/DELETE /api/teacher/grades',
        attendance: 'POST /api/teacher/attendance',
        labWorks: 'GET/POST/PUT/DELETE /api/teacher/lab-works',
        submissions: 'GET /api/teacher/submissions',
        checkSubmission: 'PUT /api/teacher/submissions/:id/check',
        programs: 'GET/POST/PUT/DELETE /api/teacher/programs',
        schedule: 'GET /api/teacher/schedule',
        students: 'GET /api/teacher/students'
      }
    }
  });
});

// Обработка ошибок
app.use(errorHandler);

module.exports = app;
