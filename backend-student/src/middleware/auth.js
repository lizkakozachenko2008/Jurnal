const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Доступ запрещен. Требуется авторизация'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Неверный или просроченный токен'
    });
  }
};

const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      error: 'Доступ только для студентов'
    });
  }
  next();
};

const requireTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      error: 'Доступ только для преподавателей'
    });
  }
  next();
};

module.exports = { authMiddleware, requireStudent, requireTeacher };
