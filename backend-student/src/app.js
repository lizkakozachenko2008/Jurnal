const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Student Journal API',
    version: '2.0.0',
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
      }
    }
  });
});

// Обработка ошибок
app.use(errorHandler);

module.exports = app;