-- ============================================
-- ПОЛНАЯ ОЧИСТКА И СОЗДАНИЕ БД С НУЛЯ
-- Выполнить целиком в pgAdmin Query Tool
-- ============================================

DROP TABLE IF EXISTS student_teams, lab_submissions, lesson_programs, attendance, lesson_dates, grades, lab_works, schedules, users CASCADE;

-- === ТАБЛИЦЫ ===

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'student',
  group_name VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schedules (
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

CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_email VARCHAR(100),
  student_name VARCHAR(200),
  subject VARCHAR(100),
  grade INTEGER CHECK (grade >= 1 AND grade <= 10),
  grade_type VARCHAR(30) DEFAULT 'lecture',
  date DATE,
  teacher_comment TEXT
);

CREATE TABLE lab_works (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100),
  title VARCHAR(200),
  description TEXT,
  due_date DATE,
  teacher_name VARCHAR(200),
  teacher_email VARCHAR(100),
  max_score INTEGER DEFAULT 10,
  is_team_work BOOLEAN DEFAULT false,
  theory_materials TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_submissions (
  id SERIAL PRIMARY KEY,
  lab_work_id INTEGER REFERENCES lab_works(id),
  student_email VARCHAR(100),
  student_name VARCHAR(200),
  team_name VARCHAR(100),
  file_url TEXT,
  solution_text TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INTEGER CHECK (score IS NULL OR (score >= 1 AND score <= 10)),
  teacher_comment TEXT,
  checked_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'submitted'
);

CREATE TABLE lesson_programs (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100),
  teacher_email VARCHAR(100),
  lesson_number INTEGER,
  lesson_type VARCHAR(30),
  topic VARCHAR(300),
  description TEXT,
  materials TEXT,
  materials_file TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_email VARCHAR(100),
  student_name VARCHAR(200),
  subject VARCHAR(100),
  lesson_date DATE,
  status VARCHAR(20) DEFAULT 'present',
  minutes_late INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lesson_dates (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100),
  group_name VARCHAR(50),
  lesson_date DATE,
  topic VARCHAR(300),
  lesson_type VARCHAR(30) DEFAULT 'lecture',
  teacher_email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_teams (
  id SERIAL PRIMARY KEY,
  lab_work_id INTEGER REFERENCES lab_works(id),
  team_name VARCHAR(100),
  student_email VARCHAR(100),
  student_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === ДАННЫЕ ===

-- Преподаватели (пароль: teacher123)
INSERT INTO users (email, password, full_name, role) VALUES
  ('ivanova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Иванова Мария Ивановна', 'teacher'),
  ('petrov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Петров Сергей Викторович', 'teacher'),
  ('sidorova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Сидорова Анна Константиновна', 'teacher'),
  ('kozlov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Козлов Дмитрий Михайлович', 'teacher'),
  ('smirnova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Смирнова Елена Александровна', 'teacher');

-- Студенты группы ИС-41 (пароль: student123)
INSERT INTO users (email, password, full_name, role, group_name, is_active) VALUES
  ('aleksandrov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Александров Максим Сергеевич', 'student', 'ИС-41', true),
  ('belyaeva@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Беляева Анастасия Дмитриевна', 'student', 'ИС-41', true),
  ('vorontsov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Воронцов Артём Николаевич', 'student', 'ИС-41', true),
  ('grigoreva@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Григорьева Дарья Олеговна', 'student', 'ИС-41', true),
  ('dmitriev@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Дмитриев Кирилл Андреевич', 'student', 'ИС-41', false),
  ('egorova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Егорова Полина Владимировна', 'student', 'ИС-41', true),
  ('zhukov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Жуков Никита Павлович', 'student', 'ИС-41', true),
  ('zakharova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Захарова София Игоревна', 'student', 'ИС-41', true);

-- Студенты группы ИС-42
INSERT INTO users (email, password, full_name, role, group_name, is_active) VALUES
  ('ivanov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Иванов Артём Владимирович', 'student', 'ИС-42', true),
  ('kozlova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Козлова Мария Сергеевна', 'student', 'ИС-42', true),
  ('lebedev@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Лебедев Денис Алексеевич', 'student', 'ИС-42', true),
  ('morozova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Морозова Елизавета Дмитриевна', 'student', 'ИС-42', true),
  ('nikolaev@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Николаев Владислав Игоревич', 'student', 'ИС-42', true),
  ('orlova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Орлова Анна Максимовна', 'student', 'ИС-42', true),
  ('pavlov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Павлов Глеб Романович', 'student', 'ИС-42', true),
  ('sokolova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Соколова Виктория Андреевна', 'student', 'ИС-42', true);

-- Студенты группы ПО-31
INSERT INTO users (email, password, full_name, role, group_name, is_active) VALUES
  ('belov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Белов Александр Петрович', 'student', 'ПО-31', true),
  ('guseva@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ГUSEВА Ксения Валерьевна', 'student', 'ПО-31', true),
  ('efimov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ефимов Тимур Рамилевич', 'student', 'ПО-31', true),
  ('klimova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Климова Алиса Денисовна', 'student', 'ПО-31', true),
  ('mironov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Миронов Марк Богданович', 'student', 'ПО-31', true),
  ('polyakova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Полякова Ульяна Евгеньевна', 'student', 'ПО-31', true),
  ('tarasov@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Тарасов Даниил Кириллович', 'student', 'ПО-31', true),
  ('fedorova@mail.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Фёдорова Софья Артёмовна', 'student', 'ПО-31', true);

-- === РАСПИСАНИЕ ===
INSERT INTO schedules (group_name, subject, teacher_name, teacher_email, day_of_week, start_time, end_time, classroom) VALUES
  ('ИС-41', 'Веб-программирование', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 1, '09:00', '10:30', '301'),
  ('ИС-41', 'Веб-программирование', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 3, '10:45', '12:15', '301'),
  ('ИС-42', 'Веб-программирование', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 2, '09:00', '10:30', '302'),
  ('ИС-41', 'Базы данных', 'Петров Сергей Викторович', 'petrov@mail.ru', 1, '10:45', '12:15', '405'),
  ('ИС-41', 'Базы данных', 'Петров Сергей Викторович', 'petrov@mail.ru', 4, '09:00', '10:30', '405'),
  ('ИС-42', 'Базы данных', 'Петров Сергей Викторович', 'petrov@mail.ru', 2, '10:45', '12:15', '405'),
  ('ПО-31', 'Базы данных', 'Петров Сергей Викторович', 'petrov@mail.ru', 3, '09:00', '10:30', '406'),
  ('ИС-41', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@mail.ru', 2, '09:00', '10:30', '201'),
  ('ИС-41', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@mail.ru', 5, '10:45', '12:15', '201'),
  ('ИС-42', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@mail.ru', 3, '09:00', '10:30', '202'),
  ('ПО-31', 'Математический анализ', 'Сидорова Анна Константиновна', 'sidorova@mail.ru', 1, '10:45', '12:15', '203'),
  ('ИС-41', 'Физика', 'Козлов Дмитрий Михайлович', 'kozlov@mail.ru', 3, '09:00', '10:30', '105'),
  ('ИС-42', 'Физика', 'Козлов Дмитрий Михайлович', 'kozlov@mail.ru', 4, '10:45', '12:15', '105'),
  ('ПО-31', 'Физика', 'Козлов Дмитрий Михайлович', 'kozlov@mail.ru', 5, '09:00', '10:30', '106'),
  ('ИС-41', 'Английский язык', 'Смирнова Елена Александровна', 'smirnova@mail.ru', 4, '10:45', '12:15', '501'),
  ('ИС-42', 'Английский язык', 'Смирнова Елена Александровна', 'smirnova@mail.ru', 5, '09:00', '10:30', '501'),
  ('ПО-31', 'Английский язык', 'Смирнова Елена Александровна', 'smirnova@mail.ru', 2, '10:45', '12:15', '502');

-- === ОЦЕНКИ (10-балльная система) ===
INSERT INTO grades (student_email, student_name, subject, grade, grade_type, date, teacher_comment) VALUES
  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Веб-программирование', 9, 'lab', '2025-09-10', 'Отличная работа'),
  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Веб-программирование', 8, 'practice', '2025-09-17', 'Хорошо'),
  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Веб-программирование', 10, 'test', '2025-10-01', 'Превосходно!'),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Веб-программирование', 8, 'lab', '2025-09-10', 'Хорошая работа'),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Веб-программирование', 7, 'practice', '2025-09-17', 'Хорошо'),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Веб-программирование', 9, 'test', '2025-10-01', 'Отлично'),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Веб-программирование', 6, 'lab', '2025-09-10', 'Нужно доработать'),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Веб-программирование', 5, 'practice', '2025-09-17', 'Удовлетворительно'),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Веб-программирование', 10, 'lab', '2025-09-10', 'Превосходно!'),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Веб-программирование', 9, 'practice', '2025-09-17', 'Отлично'),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Веб-программирование', 10, 'test', '2025-10-01', 'Идеально!'),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Веб-программирование', 9, 'lab', '2025-09-10', 'Отлично'),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Веб-программирование', 8, 'practice', '2025-09-17', 'Очень хорошо'),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Веб-программирование', 7, 'lab', '2025-09-10', 'Хорошо'),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Веб-программирование', 6, 'practice', '2025-09-17', 'Надо стараться'),
  ('zakharova@mail.ru', 'Захарова София Игоревна', 'Веб-программирование', 8, 'lab', '2025-09-10', 'Хорошая работа'),
  ('zakharova@mail.ru', 'Захарова София Игоревна', 'Веб-программирование', 9, 'test', '2025-10-01', 'Отлично'),

  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Базы данных', 8, 'lab', '2025-09-15', 'Хорошо'),
  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Базы данных', 9, 'test', '2025-10-05', 'Отлично'),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Базы данных', 7, 'lab', '2025-09-15', 'Хорошая работа'),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Базы данных', 5, 'lab', '2025-09-15', 'Удовлетворительно'),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Базы данных', 10, 'lab', '2025-09-15', 'Превосходно!'),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Базы данных', 9, 'lab', '2025-09-15', 'Отлично'),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Базы данных', 6, 'lab', '2025-09-15', 'Можно лучше'),

  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Математический анализ', 8, 'quiz', '2025-09-20', 'Хорошо'),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Математический анализ', 9, 'quiz', '2025-09-20', 'Отлично'),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Математический анализ', 4, 'quiz', '2025-09-20', 'Нужно подтянуть'),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Математический анализ', 10, 'quiz', '2025-09-20', 'Идеально!'),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Математический анализ', 9, 'quiz', '2025-09-20', 'Отлично'),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Математический анализ', 5, 'quiz', '2025-09-20', 'Старайся больше'),
  ('zakharova@mail.ru', 'Захарова София Игоревна', 'Математический анализ', 7, 'quiz', '2025-09-20', 'Хорошо');

-- === ЛАБОРАТОРНЫЕ РАБОТЫ ===
INSERT INTO lab_works (subject, title, description, due_date, teacher_name, teacher_email, max_score, is_team_work, theory_materials) VALUES
  ('Веб-программирование', 'ЛР 1: Основы HTML и CSS', 'Создать адаптивную веб-страницу с использованием HTML5 и CSS3. Применить Flexbox/Grid.', '2025-10-05', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 10, false, 'Документация MDN: developer.mozilla.org'),
  ('Веб-программирование', 'ЛР 2: JavaScript и DOM', 'Написать интерактивное веб-приложение на чистом JavaScript. Работа с DOM, событиями.', '2025-10-19', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 10, false, 'Книга: "JavaScript Definitive Guide"'),
  ('Веб-программирование', 'ЛР 3: React приложение', 'Разработать SPA на React с использованием хуков, контекста и React Router.', '2025-11-02', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 10, true, 'Документация React: react.dev'),
  ('Веб-программирование', 'ЛР 4: REST API и fetch', 'Создать клиентское приложение, взаимодействующее с REST API. Обработка ошибок.', '2025-11-16', 'Иванова Мария Ивановна', 'ivanova@mail.ru', 10, false, 'Материалы лекции 7-8'),
  ('Базы данных', 'ЛР 1: Проектирование ER-диаграммы', 'Спроектировать ER-диаграмму для предметной области. Нормализация до 3НФ.', '2025-10-10', 'Петров Сергей Викторович', 'petrov@mail.ru', 10, false, 'Коннолли Т. "Базы данных", глава 1-4'),
  ('Базы данных', 'ЛР 2: SQL запросы', 'Написать SQL запросы: SELECT, JOIN, GROUP BY, подзапросы, представления.', '2025-10-24', 'Петров Сергей Викторович', 'petrov@mail.ru', 10, false, 'Документация PostgreSQL'),
  ('Базы данных', 'ЛР 3: Транзакции и триггеры', 'Реализовать транзакции, триггеры и хранимые процедуры.', '2025-11-07', 'Петров Сергей Викторович', 'petrov@mail.ru', 10, true, 'Лекции 5-6, материалы на Moodle'),
  ('Базы данных', 'ЛР 4: Оптимизация запросов', 'Анализ плана выполнения запросов. Индексы, EXPLAIN ANALYZE.', '2025-11-21', 'Петров Сергей Викторович', 'petrov@mail.ru', 10, false, 'Документация PostgreSQL: EXPLAIN');

-- === СДАЧИ ЛАБОРАТОРНЫХ ===
INSERT INTO lab_submissions (lab_work_id, student_email, student_name, solution_text, submitted_at, score, status) VALUES
  (1, 'aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Выполнил адаптивную страницу с Grid Layout. Все требования выполнены.', '2025-10-04 14:30:00', 9, 'checked'),
  (1, 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Страница с Flexbox, медиа-запросы для мобильных устройств.', '2025-10-05 10:00:00', 8, 'checked'),
  (1, 'vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Базовая вёрстка, без адаптивности.', '2025-10-06 09:00:00', 5, 'checked'),
  (1, 'grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Полная адаптивная вёрстка с анимациями и переходами.', '2025-10-03 16:00:00', 10, 'checked'),
  (1, 'egorova@mail.ru', 'Егорова Полина Владимировна', 'Адаптивная страница на Grid, семантическая вёрстка.', '2025-10-05 11:00:00', 9, 'checked'),
  (1, 'zhukov@mail.ru', 'Жуков Никита Павлович', 'Страница на Flexbox, базовая адаптивность.', '2025-10-05 15:00:00', 7, 'checked'),
  (2, 'aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Интерактивное приложение с обработкой событий, валидацией форм.', '2025-10-18 11:00:00', 9, 'checked'),
  (2, 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Приложение с DOM-манипуляциями, делегированием событий.', '2025-10-19 08:00:00', 8, 'checked'),
  (2, 'grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Полноценное SPA на JS, роутинг, localStorage.', '2025-10-17 14:00:00', 10, 'checked'),
  (5, 'aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'ER-диаграмма для интернет-магазина, 8 сущностей, нормализация до 3НФ.', '2025-10-09 14:30:00', 8, 'checked'),
  (5, 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'ER-диаграмма библиотеки, нормализация, описание связей.', '2025-10-10 10:00:00', 7, 'checked'),
  (5, 'grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Полное проектирование БД с описанием всех ограничений и индексов.', '2025-10-08 16:00:00', 10, 'checked'),
  (5, 'egorova@mail.ru', 'Егорова Полина Владимировна', 'ER-диаграмма и нормализация, подробное описание.', '2025-10-10 12:00:00', 9, 'checked'),
  (3, 'aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'React SPA с хуками, контекстом, роутингом.', '2025-12-01 11:00:00', NULL, 'submitted'),
  (3, 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'React приложение с компонентами и состоянием.', '2025-12-01 08:00:00', NULL, 'submitted'),
  (6, 'aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'SQL скрипт с 15 запросами разной сложности.', '2025-11-01 11:00:00', NULL, 'submitted'),
  (6, 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Все запросы реализованы, включая подзапросы и представления.', '2025-11-01 08:00:00', NULL, 'submitted');

-- === ДАТЫ ЗАНЯТИЙ ===
INSERT INTO lesson_dates (subject, group_name, lesson_date, topic, lesson_type, teacher_email) VALUES
  ('Веб-программирование', 'ИС-41', '2025-09-08', 'Введение в веб-разработку, HTML5', 'lecture', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-09-10', 'CSS3, Flexbox, Grid Layout', 'practice', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-09-15', 'JavaScript: основы, типы данных', 'lecture', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-09-17', 'JavaScript: DOM и события', 'practice', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-09-22', 'JavaScript: асинхронность', 'lecture', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-10-01', 'Контрольная работа №1', 'test', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-10-06', 'React: компоненты и JSX', 'lecture', 'ivanova@mail.ru'),
  ('Веб-программирование', 'ИС-41', '2025-10-08', 'React: хуки useState, useEffect', 'practice', 'ivanova@mail.ru'),
  ('Базы данных', 'ИС-41', '2025-09-08', 'Введение в БД, реляционная модель', 'lecture', 'petrov@mail.ru'),
  ('Базы данных', 'ИС-41', '2025-09-15', 'Нормализация, функциональные зависимости', 'practice', 'petrov@mail.ru'),
  ('Базы данных', 'ИС-41', '2025-09-22', 'SQL: SELECT, WHERE, JOIN', 'lecture', 'petrov@mail.ru'),
  ('Базы данных', 'ИС-41', '2025-10-05', 'Контрольная работа №1', 'test', 'petrov@mail.ru'),
  ('Базы данных', 'ИС-41', '2025-10-06', 'GROUP BY, агрегатные функции', 'lecture', 'petrov@mail.ru'),
  ('Базы данных', 'ИС-41', '2025-10-13', 'Подзапросы и представления', 'practice', 'petrov@mail.ru'),
  ('Математический анализ', 'ИС-41', '2025-09-09', 'Пределы функций, непрерывность', 'lecture', 'sidorova@mail.ru'),
  ('Математический анализ', 'ИС-41', '2025-09-16', 'Производные, правила дифференцирования', 'practice', 'sidorova@mail.ru'),
  ('Математический анализ', 'ИС-41', '2025-09-20', 'Устный опрос', 'quiz', 'sidorova@mail.ru'),
  ('Математический анализ', 'ИС-41', '2025-09-23', 'Применение производных', 'lecture', 'sidorova@mail.ru'),
  ('Математический анализ', 'ИС-41', '2025-09-30', 'Исследование функций', 'practice', 'sidorova@mail.ru');

-- === ПОСЕЩАЕМОСТЬ ===
INSERT INTO attendance (student_email, student_name, subject, lesson_date, status, minutes_late) VALUES
  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Веб-программирование', '2025-09-08', 'present', 0),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Веб-программирование', '2025-09-08', 'present', 0),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Веб-программирование', '2025-09-08', 'late', 10),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Веб-программирование', '2025-09-08', 'present', 0),
  ('dmitriev@mail.ru', 'Дмитриев Кирилл Андреевич', 'Веб-программирование', '2025-09-08', 'absent', 0),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Веб-программирование', '2025-09-08', 'present', 0),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Веб-программирование', '2025-09-08', 'late', 5),
  ('zakharova@mail.ru', 'Захарова София Игоревна', 'Веб-программирование', '2025-09-08', 'present', 0),

  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Веб-программирование', '2025-09-10', 'present', 0),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Веб-программирование', '2025-09-10', 'late', 15),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Веб-программирование', '2025-09-10', 'present', 0),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Веб-программирование', '2025-09-10', 'present', 0),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Веб-программирование', '2025-09-10', 'absent', 0),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Веб-программирование', '2025-09-10', 'present', 0),
  ('zakharova@mail.ru', 'Захарова София Игоревна', 'Веб-программирование', '2025-09-10', 'present', 0),

  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Базы данных', '2025-09-08', 'present', 0),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Базы данных', '2025-09-08', 'present', 0),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Базы данных', '2025-09-08', 'absent', 0),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Базы данных', '2025-09-08', 'present', 0),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Базы данных', '2025-09-08', 'late', 5),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Базы данных', '2025-09-08', 'present', 0),

  ('aleksandrov@mail.ru', 'Александров Максим Сергеевич', 'Математический анализ', '2025-09-09', 'present', 0),
  ('belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна', 'Математический анализ', '2025-09-09', 'present', 0),
  ('vorontsov@mail.ru', 'Воронцов Артём Николаевич', 'Математический анализ', '2025-09-09', 'late', 20),
  ('grigoreva@mail.ru', 'Григорьева Дарья Олеговна', 'Математический анализ', '2025-09-09', 'present', 0),
  ('egorova@mail.ru', 'Егорова Полина Владимировна', 'Математический анализ', '2025-09-09', 'present', 0),
  ('zhukov@mail.ru', 'Жуков Никита Павлович', 'Математический анализ', '2025-09-09', 'absent', 0);

-- === ПРОГРАММА ПРЕДМЕТОВ ===
INSERT INTO lesson_programs (subject, teacher_email, lesson_number, lesson_type, topic, description, materials) VALUES
  ('Веб-программирование', 'ivanova@mail.ru', 1, 'lecture', 'Введение в веб-разработку', 'Архитектура веб-приложений, HTTP, клиент-сервер', 'MDN Web Docs'),
  ('Веб-программирование', 'ivanova@mail.ru', 2, 'lecture', 'HTML5 и семантическая вёрстка', 'Семантические теги, формы, доступность', 'Документация HTML5'),
  ('Веб-программирование', 'ivanova@mail.ru', 3, 'practice', 'CSS3: Flexbox и Grid', 'Макеты, адаптивная вёрстка, медиа-запросы', 'CSS Tricks: Flexbox Guide'),
  ('Веб-программирование', 'ivanova@mail.ru', 4, 'lecture', 'JavaScript: основы', 'Типы данных, функции, замыкания', 'Eloquent JavaScript'),
  ('Веб-программирование', 'ivanova@mail.ru', 5, 'practice', 'DOM и события', 'Манипуляции с DOM, делегирование событий', 'MDN: DOM'),
  ('Веб-программирование', 'ivanova@mail.ru', 6, 'test', 'Контрольная работа №1', 'HTML, CSS, JavaScript', 'Билеты на Moodle'),
  ('Веб-программирование', 'ivanova@mail.ru', 7, 'lecture', 'React: основы', 'Компоненты, JSX, props, state', 'react.dev/learn'),
  ('Веб-программирование', 'ivanova@mail.ru', 8, 'practice', 'React: хуки', 'useState, useEffect, useContext', 'Документация React'),
  ('Веб-программирование', 'ivanova@mail.ru', 9, 'lab', 'React приложение (командная)', 'SPA с роутингом и API', 'Задание на Moodle'),
  ('Веб-программирование', 'ivanova@mail.ru', 10, 'lab', 'REST API и fetch', 'Работа с внешним API, обработка ошибок', 'Задание на Moodle'),

  ('Базы данных', 'petrov@mail.ru', 1, 'lecture', 'Введение в СУБД', 'Реляционная модель, ключи, связи', 'Коннолли "Базы данных"'),
  ('Базы данных', 'petrov@mail.ru', 2, 'lecture', 'Проектирование БД', 'ER-диаграммы, нормализация', 'Лекция 2'),
  ('Базы данных', 'petrov@mail.ru', 3, 'practice', 'Нормализация', '1НФ, 2НФ, 3НФ, БКНФ', 'Практикум'),
  ('Базы данных', 'petrov@mail.ru', 4, 'lecture', 'SQL: DDL и DML', 'CREATE, INSERT, UPDATE, DELETE', 'PostgreSQL docs'),
  ('Базы данных', 'petrov@mail.ru', 5, 'practice', 'SQL: SELECT', 'WHERE, JOIN, GROUP BY, подзапросы', 'Задание к ЛР 2'),
  ('Базы данных', 'petrov@mail.ru', 6, 'test', 'Контрольная работа №1', 'Теория и практика', 'Билеты на Moodle'),
  ('Базы данных', 'petrov@mail.ru', 7, 'lecture', 'Транзакции', 'ACID, уровни изоляции', 'Лекция 7'),
  ('Базы данных', 'petrov@mail.ru', 8, 'lab', 'Триггеры и процедуры (командная)', 'PL/pgSQL, триггеры', 'Задание к ЛР 3');

-- === КОМАНДЫ ===
INSERT INTO student_teams (lab_work_id, team_name, student_email, student_name) VALUES
  (3, 'React Team Alpha', 'aleksandrov@mail.ru', 'Александров Максим Сергеевич'),
  (3, 'React Team Alpha', 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна'),
  (3, 'React Team Beta', 'grigoreva@mail.ru', 'Григорьева Дарья Олеговна'),
  (3, 'React Team Beta', 'egorova@mail.ru', 'Егорова Полина Владимировна'),
  (7, 'DB Team Alpha', 'aleksandrov@mail.ru', 'Александров Максим Сергеевич'),
  (7, 'DB Team Alpha', 'grigoreva@mail.ru', 'Григорьева Дарья Олеговна'),
  (7, 'DB Team Beta', 'belyaeva@mail.ru', 'Беляева Анастасия Дмитриевна'),
  (7, 'DB Team Beta', 'egorova@mail.ru', 'Егорова Полина Владимировна');

-- ============================================
-- ГОТОВО! Проверка данных
-- ============================================
SELECT 'Пользователи: ' || COUNT(*)::text FROM users;
SELECT 'Расписание: ' || COUNT(*)::text FROM schedules;
SELECT 'Оценки: ' || COUNT(*)::text FROM grades;
SELECT 'Лабораторные: ' || COUNT(*)::text FROM lab_works;
SELECT 'Сдачи: ' || COUNT(*)::text FROM lab_submissions;
SELECT 'Посещаемость: ' || COUNT(*)::text FROM attendance;
SELECT 'Программы: ' || COUNT(*)::text FROM lesson_programs;
SELECT 'Команды: ' || COUNT(*)::text FROM student_teams;
```

Файл сохранён как [backend-student/setup.sql](backend-student/setup.sql). Скопируйте весь код и выполните в pgAdmin Query Tool (F5).

**После выполнения:**
- 5 преподавателей (пароль: `password`)
- 24 студента в 3 группах (пароль: `password`)
- Все оценки в 10-балльной системе
- max_score = 10 для всех лаб
- Реальные ФИО, предметы, даты