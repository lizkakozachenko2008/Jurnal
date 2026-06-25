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
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        group_name VARCHAR(50),
        subject VARCHAR(100),
        teacher_name VARCHAR(200),
        teacher_email VARCHAR(100),
        day_of_week INTEGER,
        start_time VARCHAR(10),
        end_time VARCHAR(10),
        classroom VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        student_email VARCHAR(100),
        student_name VARCHAR(200),
        subject VARCHAR(100),
        grade INTEGER,
        grade_type VARCHAR(30) DEFAULT 'lecture',
        date DATE,
        teacher_comment TEXT
      );

      CREATE TABLE IF NOT EXISTS lab_works (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(100),
        title VARCHAR(200),
        description TEXT,
        due_date DATE,
        teacher_name VARCHAR(200),
        teacher_email VARCHAR(100),
        max_score INTEGER DEFAULT 100,
        is_team_work BOOLEAN DEFAULT false,
        theory_materials TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lab_submissions (
        id SERIAL PRIMARY KEY,
        lab_work_id INTEGER REFERENCES lab_works(id),
        student_email VARCHAR(100),
        student_name VARCHAR(200),
        team_name VARCHAR(100),
        file_url TEXT,
        solution_text TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        score INTEGER,
        teacher_comment TEXT,
        checked_at TIMESTAMP,
        status VARCHAR(20) DEFAULT 'submitted'
      );

      CREATE TABLE IF NOT EXISTS lesson_programs (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(100),
        teacher_email VARCHAR(100),
        lesson_number INTEGER,
        lesson_type VARCHAR(30),
        topic VARCHAR(300),
        description TEXT,
        materials TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_email VARCHAR(100),
        student_name VARCHAR(200),
        subject VARCHAR(100),
        lesson_date DATE,
        status VARCHAR(20) DEFAULT 'present',
        minutes_late INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lesson_dates (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(100),
        group_name VARCHAR(50),
        lesson_date DATE,
        topic VARCHAR(300),
        lesson_type VARCHAR(30) DEFAULT 'lecture',
        teacher_email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_teams (
        id SERIAL PRIMARY KEY,
        lab_work_id INTEGER REFERENCES lab_works(id),
        team_name VARCHAR(100),
        student_email VARCHAR(100),
        student_name VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
