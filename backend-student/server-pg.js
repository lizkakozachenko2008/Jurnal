const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'l02j30S29T17_',  
  database: 'student_journal',
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ PostgreSQL подключен!');
    release();
  }
});

// Создание таблиц
async function init() {
  try {
    await pool.query(`
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
    
    // Добавляем тестовые данные
    await pool.query(`
      INSERT INTO schedules (group_name, subject, teacher_name, day_of_week, start_time, end_time, classroom)
      SELECT 'ИС-41', 'Математика', 'Иванова М.И.', 1, '09:00', '10:30', '101'
      WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE subject='Математика');
      
      INSERT INTO schedules (group_name, subject, teacher_name, day_of_week, start_time, end_time, classroom)
      SELECT 'ИС-41', 'Программирование', 'Петров С.В.', 1, '10:45', '12:15', '301'
      WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE subject='Программирование');
      
      INSERT INTO schedules (group_name, subject, teacher_name, day_of_week, start_time, end_time, classroom)
      SELECT 'ИС-41', 'Базы данных', 'Сидорова А.К.', 2, '09:00', '10:30', '205'
      WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE subject='Базы данных');
    `);
    
    await pool.query(`
      INSERT INTO grades (student_email, subject, grade, date)
      SELECT 'student@test.com', 'Математика', 85, '2024-12-01'
      WHERE NOT EXISTS (SELECT 1 FROM grades WHERE subject='Математика' AND student_email='student@test.com');
      
      INSERT INTO grades (student_email, subject, grade, date)
      SELECT 'student@test.com', 'Программирование', 92, '2024-12-02'
      WHERE NOT EXISTS (SELECT 1 FROM grades WHERE subject='Программирование' AND student_email='student@test.com');
      
      INSERT INTO grades (student_email, subject, grade, date)
      SELECT 'student@test.com', 'Базы данных', 88, '2024-12-03'
      WHERE NOT EXISTS (SELECT 1 FROM grades WHERE subject='Базы данных' AND student_email='student@test.com');
    `);
    
    await pool.query(`
      INSERT INTO lab_works (subject, title, description, due_date, teacher_name)
      SELECT 'Программирование', 'Лабораторная работа №1', 'Создать веб-приложение', '2024-12-20', 'Петров С.В.'
      WHERE NOT EXISTS (SELECT 1 FROM lab_works WHERE title='Лабораторная работа №1');
      
      INSERT INTO lab_works (subject, title, description, due_date, teacher_name)
      SELECT 'Программирование', 'Лабораторная работа №2', 'Работа с базами данных', '2024-12-27', 'Петров С.В.'
      WHERE NOT EXISTS (SELECT 1 FROM lab_works WHERE title='Лабораторная работа №2');
      
      INSERT INTO lab_works (subject, title, description, due_date, teacher_name)
      SELECT 'Базы данных', 'Лабораторная работа №1', 'Проектирование БД', '2024-12-25', 'Сидорова А.К.'
      WHERE NOT EXISTS (SELECT 1 FROM lab_works WHERE subject='Базы данных');
    `);
    
    console.log('✅ Данные добавлены');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
  }
}

// API маршруты
app.get('/api/student/schedule', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedules ORDER BY day_of_week, start_time');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/student/grades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grades ORDER BY date DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/student/grades/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const result = await pool.query('SELECT * FROM grades WHERE subject = $1 ORDER BY date DESC', [subject]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/student/lab-works', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lab_works ORDER BY due_date');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/student/lab-works/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM lab_works WHERE id = $1', [id]);
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/student/lab-works/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { fileUrl, studentEmail } = req.body;
    
    if (!fileUrl || !studentEmail) {
      return res.status(400).json({ success: false, error: 'fileUrl и studentEmail обязательны' });
    }
    
    const result = await pool.query(
      `INSERT INTO lab_submissions (lab_work_id, student_email, file_url, status) 
       VALUES ($1, $2, $3, 'submitted') 
       RETURNING *`,
      [id, studentEmail, fileUrl]
    );
    
    res.json({ success: true, data: result.rows[0], message: 'Лабораторная работа отправлена' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Student Journal API with PostgreSQL',
    version: '1.0.0',
    endpoints: {
      schedule: 'GET /api/student/schedule',
      grades: 'GET /api/student/grades',
      gradesBySubject: 'GET /api/student/grades/:subject',
      labWorks: 'GET /api/student/lab-works',
      labWorkDetails: 'GET /api/student/lab-works/:id',
      submitLab: 'POST /api/student/lab-works/:id/submit',
      health: 'GET /health'
    }
  });
});

// Запуск сервера
init();
app.listen(PORT, () => {
  console.log(`\n✅ СЕРВЕР ЗАПУЩЕН!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n📋 ДОСТУПНЫЕ МАРШРУТЫ:`);
  console.log(`   Расписание:    http://localhost:${PORT}/api/student/schedule`);
  console.log(`   Оценки:        http://localhost:${PORT}/api/student/grades`);
  console.log(`   Лабораторные:  http://localhost:${PORT}/api/student/lab-works`);
  console.log(`   Health:        http://localhost:${PORT}/health\n`);
});