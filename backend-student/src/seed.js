const { db } = require('./src/models/User');

console.log('Добавление тестовых данных...');

// Добавляем тестового студента
db.run(`INSERT OR IGNORE INTO users (email, password, full_name, role, group_name) 
        VALUES ('student@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тестовый Студент', 'student', 'ИС-41')`);

// Добавляем расписание
const scheduleData = [
  ['ИС-41', 'Математика', 'Иванова М.И.', 1, '09:00', '10:30', '101'],
  ['ИС-41', 'Программирование', 'Петров С.В.', 1, '10:45', '12:15', '301'],
  ['ИС-41', 'Базы данных', 'Сидорова А.К.', 2, '09:00', '10:30', '205'],
  ['ИС-41', 'Физика', 'Козлов Д.М.', 2, '10:45', '12:15', '203'],
  ['ИС-41', 'Английский язык', 'Смирнова Е.А.', 3, '09:00', '10:30', '402'],
];

scheduleData.forEach(s => {
  db.run(
    'INSERT OR IGNORE INTO schedules (group_name, subject, teacher_name, day_of_week, start_time, end_time, classroom) VALUES (?, ?, ?, ?, ?, ?, ?)',
    s
  );
});

// Добавляем оценки
const gradesData = [
  ['student@test.com', 'Математика', 85, 'exam', '2024-12-01', 'Хорошо'],
  ['student@test.com', 'Программирование', 92, 'lab', '2024-12-02', 'Отлично'],
  ['student@test.com', 'Базы данных', 78, 'test', '2024-12-03', 'Хорошо'],
];

gradesData.forEach(g => {
  db.run(
    'INSERT OR IGNORE INTO grades (student_email, subject, grade, grade_type, date, teacher_comment) VALUES (?, ?, ?, ?, ?, ?)',
    g
  );
});

// Добавляем лабораторные работы
const labWorksData = [
  ['Программирование', 'Лабораторная работа №1', 'Создать простое веб-приложение на Node.js', '2024-12-20', 'Петров С.В.', 100],
  ['Программирование', 'Лабораторная работа №2', 'Работа с базами данных', '2024-12-27', 'Петров С.В.', 100],
  ['Базы данных', 'Лабораторная работа №1', 'Проектирование БД', '2024-12-22', 'Сидорова А.К.', 100],
];

labWorksData.forEach(l => {
  db.run(
    'INSERT OR IGNORE INTO lab_works (subject, title, description, due_date, teacher_name, max_score) VALUES (?, ?, ?, ?, ?, ?)',
    l
  );
});

console.log('✅ Тестовые данные добавлены!');
console.log('📧 Тестовый студент: student@test.com');
console.log('🔑 Пароль: password');