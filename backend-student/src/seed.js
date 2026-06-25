const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('🌱 Заполнение базы тестовыми данными...\n');

    // === ПРЕПОДАВАТЕЛИ ===
    const teacherPassword = await bcrypt.hash('teacher123', 10);

    await pool.query(`
      INSERT INTO users (email, password, full_name, role)
      VALUES
        ('ivanova@test.com', $1, 'Иванова Мария Ивановна', 'teacher'),
        ('petrov@test.com', $1, 'Петров Сергей Викторович', 'teacher'),
        ('sidorova@test.com', $1, 'Сидорова Анна Константиновна', 'teacher')
      ON CONFLICT (email) DO NOTHING
    `, [teacherPassword]);
    console.log('✅ Преподаватели созданы');

    // === СТУДЕНТЫ ===
    const studentPassword = await bcrypt.hash('student123', 10);

    await pool.query(`
      INSERT INTO users (email, password, full_name, role, group_name, is_active)
      VALUES
        ('student1@test.com', $1, 'Алексеев Дмитрий Павлович', 'student', 'ИС-41', true),
        ('student2@test.com', $1, 'Белова Екатерина Андреевна', 'student', 'ИС-41', true),
        ('student3@test.com', $1, 'Волков Артём Сергеевич', 'student', 'ИС-41', true),
        ('student4@test.com', $1, 'Григорьева Анна Олеговна', 'student', 'ИС-41', true),
        ('student5@test.com', $1, 'Дмитриев Иван Александрович', 'student', 'ИС-41', false),
        ('student6@test.com', $1, 'Егорова Мария Владимировна', 'student', 'ИС-42', true),
        ('student7@test.com', $1, 'Жуков Алексей Николаевич', 'student', 'ИС-42', true),
        ('student8@test.com', $1, 'Зайцева Ольга Дмитриевна', 'student', 'ИС-42', true)
      ON CONFLICT (email) DO NOTHING
    `, [studentPassword]);
    console.log('✅ Студенты созданы');

    // === РАСПИСАНИЕ ===
    await pool.query(`
      INSERT INTO schedules (group_name, subject, teacher_name, teacher_email, day_of_week, start_time, end_time, classroom)
      VALUES
        ('ИС-41', 'Базы данных', 'Иванова Мария Ивановна', 'ivanova@test.com', 1, '09:00', '10:30', '301'),
        ('ИС-41', 'Базы данных', 'Иванова Мария Ивановна', 'ivanova@test.com', 3, '10:45', '12:15', '301'),
        ('ИС-42', 'Базы данных', 'Иванова Мария Ивановна', 'ivanova@test.com', 2, '09:00', '10:30', '302'),
        ('ИС-41', 'Программирование', 'Петров Сергей Викторович', 'petrov@test.com', 1, '10:45', '12:15', '405'),
        ('ИС-41', 'Программирование', 'Петров Сергей Викторович', 'petrov@test.com', 4, '09:00', '10:30', '405'),
        ('ИС-42', 'Программирование', 'Петров Сергей Викторович', 'petrov@test.com', 2, '10:45', '12:15', '405'),
        ('ИС-41', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@test.com', 2, '09:00', '10:30', '201'),
        ('ИС-41', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@test.com', 5, '10:45', '12:15', '201'),
        ('ИС-42', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@test.com', 3, '09:00', '10:30', '202')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Расписание создано');

    // === ОЦЕНКИ ===
    await pool.query(`
      INSERT INTO grades (student_email, student_name, subject, grade, grade_type, date, teacher_comment)
      VALUES
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Базы данных', 85, 'lab', '2025-09-15', 'Хорошая работа'),
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Базы данных', 92, 'test', '2025-10-01', 'Отлично'),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Базы данных', 78, 'lab', '2025-09-15', 'Хорошо'),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Базы данных', 88, 'test', '2025-10-01', 'Очень хорошо'),
        ('student3@test.com', 'Волков Артём Сергеевич', 'Базы данных', 65, 'lab', '2025-09-15', 'Удовлетворительно'),
        ('student4@test.com', 'Григорьева Анна Олеговна', 'Базы данных', 95, 'lab', '2025-09-15', 'Превосходно!'),
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Программирование', 90, 'lab', '2025-09-20', 'Отлично'),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Программирование', 82, 'lab', '2025-09-20', 'Хорошо'),
        ('student3@test.com', 'Волков Артём Сергеевич', 'Программирование', 70, 'lab', '2025-09-20', 'Нужно доработать'),
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Математический анализ', 88, 'quiz', '2025-09-25', 'Хорошо'),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Математический анализ', 91, 'quiz', '2025-09-25', 'Отлично'),
        ('student3@test.com', 'Волков Артём Сергеевич', 'Математический анализ', 55, 'quiz', '2025-09-25', 'Неудовлетворительно')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Оценки созданы');

    // === ЛАБОРАТОРНЫЕ РАБОТЫ ===
    await pool.query(`
      INSERT INTO lab_works (subject, title, description, due_date, teacher_name, teacher_email, max_score, is_team_work, theory_materials)
      VALUES
        ('Базы данных', 'ЛР 1: Проектирование реляционной БД', 'Спроектировать базу данных для интернет-магазина. Создать ER-диаграмму, нормализовать таблицы.', '2025-10-15', 'Иванова Мария Ивановна', 'ivanova@test.com', 100, false, 'Книга: "Базы данных" Коннолли, глава 1-4'),
        ('Базы данных', 'ЛР 2: SQL запросы', 'Написать SQL запросы для созданной БД: SELECT, JOIN, GROUP BY, подзапросы.', '2025-11-01', 'Иванова Мария Ивановна', 'ivanova@test.com', 100, false, 'Документация PostgreSQL: postgresql.org/docs'),
        ('Базы данных', 'ЛР 3: Транзакции и триггеры', 'Реализовать транзакции и триггеры для бизнес-логики интернет-магазина.', '2025-11-20', 'Иванова Мария Ивановна', 'ivanova@test.com', 100, true, 'Лекции 5-6, материалы на Moodle'),
        ('Программирование', 'ЛР 1: Основы Node.js', 'Создать REST API сервер на Node.js с Express. CRUD операции.', '2025-10-10', 'Петров Сергей Викторович', 'petrov@test.com', 100, false, 'Документация Express: expressjs.com'),
        ('Программирование', 'ЛР 2: React приложение', 'Разработать SPA на React с использованием хуков и контекста.', '2025-11-05', 'Петров Сергей Викторович', 'petrov@test.com', 100, false, 'Документация React: react.dev')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Лабораторные работы созданы');

    // === СДАЧИ ЛАБОРАТОРНЫХ ===
    await pool.query(`
      INSERT INTO lab_submissions (lab_work_id, student_email, student_name, solution_text, submitted_at, score, status)
      VALUES
        (1, 'student1@test.com', 'Алексеев Дмитрий Павлович', 'Выполнил проектирование БД для интернет-магазина. Создал ER-диаграмму с 8 таблицами.', '2025-10-14 14:30:00', 85, 'checked'),
        (1, 'student2@test.com', 'Белова Екатерина Андреевна', 'ER-диаграмма и нормализация до 3NF. Подробное описание связей.', '2025-10-15 10:00:00', 78, 'checked'),
        (1, 'student3@test.com', 'Волков Артём Сергеевич', 'Базовое проектирование, 6 таблиц.', '2025-10-16 09:00:00', 65, 'checked'),
        (1, 'student4@test.com', 'Григорьева Анна Олеговна', 'Полное проектирование с описанием всех ограничений и индексов.', '2025-10-13 16:00:00', 95, 'checked'),
        (2, 'student1@test.com', 'Алексеев Дмитрий Павлович', 'SQL скрипт с 15 запросами разной сложности.', '2025-10-30 11:00:00', NULL, 'submitted'),
        (2, 'student2@test.com', 'Белова Екатерина Андреевна', 'Все запросы реализованы, включая подзапросы.', '2025-11-01 08:00:00', NULL, 'submitted'),
        (4, 'student1@test.com', 'Алексеев Дмитрий Павлович', 'REST API с 5 эндпоинтами, валидация данных.', '2025-10-09 15:00:00', 90, 'checked'),
        (4, 'student2@test.com', 'Белова Екатерина Андреевна', 'API сервер с middleware и обработкой ошибок.', '2025-10-10 12:00:00', 82, 'checked')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Сдачи лабораторных созданы');

    // === ДАТЫ ЗАНЯТИЙ ===
    await pool.query(`
      INSERT INTO lesson_dates (subject, group_name, lesson_date, topic, lesson_type, teacher_email)
      VALUES
        ('Базы данных', 'ИС-41', '2025-09-08', 'Введение в БД, реляционная модель', 'lecture', 'ivanova@test.com'),
        ('Базы данных', 'ИС-41', '2025-09-15', 'Нормализация', 'practice', 'ivanova@test.com'),
        ('Базы данных', 'ИС-41', '2025-09-22', 'SQL: SELECT, WHERE, JOIN', 'lecture', 'ivanova@test.com'),
        ('Базы данных', 'ИС-41', '2025-10-01', 'Контрольная работа №1', 'test', 'ivanova@test.com'),
        ('Базы данных', 'ИС-41', '2025-10-06', 'GROUP BY, агрегатные функции', 'lecture', 'ivanova@test.com'),
        ('Базы данных', 'ИС-41', '2025-10-13', 'Подзапросы и представления', 'practice', 'ivanova@test.com'),
        ('Программирование', 'ИС-41', '2025-09-08', 'Node.js: основы, npm, Express', 'lecture', 'petrov@test.com'),
        ('Программирование', 'ИС-41', '2025-09-15', 'REST API, маршрутизация', 'practice', 'petrov@test.com'),
        ('Программирование', 'ИС-41', '2025-09-22', 'Middleware, валидация', 'lecture', 'petrov@test.com'),
        ('Математический анализ', 'ИС-41', '2025-09-09', 'Пределы функций', 'lecture', 'sidorova@test.com'),
        ('Математический анализ', 'ИС-41', '2025-09-16', 'Производные', 'practice', 'sidorova@test.com'),
        ('Математический анализ', 'ИС-41', '2025-09-25', 'Устный опрос', 'quiz', 'sidorova@test.com')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Даты занятий созданы');

    // === ПОСЕЩАЕМОСТЬ ===
    await pool.query(`
      INSERT INTO attendance (student_email, student_name, subject, lesson_date, status, minutes_late)
      VALUES
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Базы данных', '2025-09-08', 'present', 0),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Базы данных', '2025-09-08', 'present', 0),
        ('student3@test.com', 'Волков Артём Сергеевич', 'Базы данных', '2025-09-08', 'late', 10),
        ('student4@test.com', 'Григорьева Анна Олеговна', 'Базы данных', '2025-09-08', 'present', 0),
        ('student5@test.com', 'Дмитриев Иван Александрович', 'Базы данных', '2025-09-08', 'absent', 0),
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Базы данных', '2025-09-15', 'present', 0),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Базы данных', '2025-09-15', 'late', 5),
        ('student3@test.com', 'Волков Артём Сергеевич', 'Базы данных', '2025-09-15', 'present', 0),
        ('student4@test.com', 'Григорьева Анна Олеговна', 'Базы данных', '2025-09-15', 'present', 0),
        ('student1@test.com', 'Алексеев Дмитрий Павлович', 'Программирование', '2025-09-08', 'present', 0),
        ('student2@test.com', 'Белова Екатерина Андреевна', 'Программирование', '2025-09-08', 'absent', 0),
        ('student3@test.com', 'Волков Артём Сергеевич', 'Программирование', '2025-09-08', 'present', 0)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Посещаемость создана');

    // === ПРОГРАММА ПРЕДМЕТОВ ===
    await pool.query(`
      INSERT INTO lesson_programs (subject, teacher_email, lesson_number, lesson_type, topic, description, materials)
      VALUES
        ('Базы данных', 'ivanova@test.com', 1, 'lecture', 'Введение в базы данных', 'Основные понятия, реляционная модель, ключи', 'Коннолли Т., Бегг К. "Базы данных"'),
        ('Базы данных', 'ivanova@test.com', 2, 'lecture', 'Нормализация', '1НФ, 2НФ, 3НФ, нормальная форма Бойса-Кодда', 'Лекция 2, слайды'),
        ('Базы данных', 'ivanova@test.com', 3, 'practice', 'Проектирование БД', 'Практическое проектирование ER-диаграммы', 'Задание к ЛР 1'),
        ('Базы данных', 'ivanova@test.com', 4, 'lecture', 'SQL: DDL и DML', 'CREATE TABLE, INSERT, UPDATE, DELETE', 'Документация PostgreSQL'),
        ('Базы данных', 'ivanova@test.com', 5, 'practice', 'SQL запросы', 'SELECT, JOIN, GROUP BY, подзапросы', 'Задание к ЛР 2'),
        ('Базы данных', 'ivanova@test.com', 6, 'test', 'Контрольная работа №1', 'Теория и практика по темам 1-5', 'Билеты на Moodle'),
        ('Программирование', 'petrov@test.com', 1, 'lecture', 'Введение в Node.js', 'Среда Node.js, npm, модули', 'nodejs.org documentation'),
        ('Программирование', 'petrov@test.com', 2, 'lecture', 'Express.js', 'Маршрутизация, middleware, обработка запросов', 'expressjs.com guide'),
        ('Программирование', 'petrov@test.com', 3, 'practice', 'Создание REST API', 'CRUD операции, валидация, обработка ошибок', 'Задание к ЛР 1'),
        ('Программирование', 'petrov@test.com', 4, 'lecture', 'React: основы', 'Компоненты, JSX, props, state', 'react.dev/learn'),
        ('Программирование', 'petrov@test.com', 5, 'practice', 'React: хуки', 'useState, useEffect, useContext', 'Задание к ЛР 2')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Программы предметов созданы');

    // === КОМАНДЫ ===
    await pool.query(`
      INSERT INTO student_teams (lab_work_id, team_name, student_email, student_name)
      VALUES
        (3, 'Команда Альфа', 'student1@test.com', 'Алексеев Дмитрий Павлович'),
        (3, 'Команда Альфа', 'student2@test.com', 'Белова Екатерина Андреевна'),
        (3, 'Команда Бета', 'student3@test.com', 'Волков Артём Сергеевич'),
        (3, 'Команда Бета', 'student4@test.com', 'Григорьева Анна Олеговна')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Команды созданы');

    console.log('\n🎉 Все тестовые данные успешно добавлены!');
    console.log('\n📋 Тестовые аккаунты:');
    console.log('  Преподаватели:');
    console.log('    ivanova@test.com / teacher123 (Иванова М.И.)');
    console.log('    petrov@test.com / teacher123 (Петров С.В.)');
    console.log('    sidorova@test.com / teacher123 (Сидорова А.К.)');
    console.log('  Студенты:');
    console.log('    student1@test.com / student123 (Алексеев Д.П., ИС-41)');
    console.log('    student2@test.com / student123 (Белова Е.А., ИС-41)');
    console.log('    student3@test.com / student123 (Волков А.С., ИС-41)');
    console.log('    student4@test.com / student123 (Григорьева А.О., ИС-41)');
    console.log('    student5@test.com / student123 (Дмитриев И.А., ИС-41, отчислен)');
    console.log('    student6@test.com / student123 (Егорова М.В., ИС-42)');
    console.log('    student7@test.com / student123 (Жуков А.Н., ИС-42)');
    console.log('    student8@test.com / student123 (Зайцева О.Д., ИС-42)');

  } catch (error) {
    console.error('❌ Ошибка заполнения базы:', error.message);
  } finally {
    await pool.end();
  }
};

seed();
