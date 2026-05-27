const app = require('./src/app');
const { pool } = require('./src/config/database');
const { PORT } = require('./src/utils/constants');

// Инициализация таблиц
const initTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        role VARCHAR(20) DEFAULT 'student',
        group_name VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        group_name VARCHAR(50),
        subject VARCHAR(100),
        teacher_name VARCHAR(200),
        day_of_week INTEGER,
        start_time VARCHAR(10),
        end_time VARCHAR(10),
        classroom VARCHAR(50)
      );
      
      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        student_email VARCHAR(100),
        subject VARCHAR(100),
        grade INTEGER,
        date DATE
      );
      
      CREATE TABLE IF NOT EXISTS lab_works (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(100),
        title VARCHAR(200),
        description TEXT,
        due_date DATE,
        teacher_name VARCHAR(200)
      );
    `);
    console.log('✅ Таблицы созданы');
  } catch (error) {
    console.error('❌ Ошибка создания таблиц:', error.message);
  }
};

// Запуск сервера
const startServer = async () => {
  await initTables();
  
  app.listen(PORT, () => {
    console.log(`\n✅ Сервер запущен на порту ${PORT}`);
    console.log(`📍 http://localhost:${PORT}\n`);
  });
};

startServer();