# 📚 Электронный журнал

Электронный журнал с поддержкой двух ролей: **Студент** и **Преподаватель**.

## 🏗️ Архитектура

```
Jurnal-main/
├── backend-student/     # Бэкенд (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── config/      # Конфигурация БД
│   │   ├── controllers/ # Контроллеры (auth, student, teacher)
│   │   ├── middleware/  # Middleware (auth, validation, errorHandler)
│   │   ├── models/      # Модели (User, Grade, LabWork, Schedule, Journal, LabSubmission, LessonProgram, TeacherSchedule)
│   │   ├── routes/      # Маршруты (auth, student, teacher)
│   │   ├── services/    # Сервисы (auth, student, teacher)
│   │   ├── utils/       # Утилиты (constants, errors)
│   │   └── seed.js      # Тестовые данные
│   └── server.js        # Точка входа
├── frontend/            # Фронтенд (React + Vite + Tailwind CSS)
│   └── src/
│       ├── components/  # Компоненты (студент + преподаватель)
│       ├── context/     # AuthContext
│       └── api/         # Axios instance
└── docker-compose.yml   # Docker Compose
```

## 🚀 Запуск

### 1. База данных (PostgreSQL)

Убедитесь, что PostgreSQL запущен. По умолчанию используется:
- **Host:** localhost
- **Port:** 5432
- **User:** postgres
- **Password:** l02j30S29T17_
- **Database:** student_journal

Создайте базу данных:
```sql
CREATE DATABASE student_journal;
```

### 2. Бэкенд

```bash
cd backend-student
npm install
npm run seed    # Заполнить БД тестовыми данными
npm run dev     # Запуск в режиме разработки (nodemon)
```

Сервер запустится на `http://localhost:5000`

### 3. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Фронтент запустится на `http://localhost:5173`

## 👤 Тестовые аккаунты

### Преподаватели
| Email | Пароль | ФИО |
|-------|--------|-----|
| ivanova@test.com | teacher123 | Иванова Мария Ивановна |
| petrov@test.com | teacher123 | Петров Сергей Викторович |
| sidorova@test.com | teacher123 | Сидорова Анна Константиновна |

### Студенты
| Email | Пароль | ФИО | Группа |
|-------|--------|-----|--------|
| student1@test.com | student123 | Алексеев Дмитрий Павлович | ИС-41 |
| student2@test.com | student123 | Белова Екатерина Андреевна | ИС-41 |
| student3@test.com | student123 | Волков Артём Сергеевич | ИС-41 |
| student4@test.com | student123 | Григорьева Анна Олеговна | ИС-41 |
| student5@test.com | student123 | Дмитриев Иван Александрович | ИС-41 (отчислен) |
| student6@test.com | student123 | Егорова Мария Владимировна | ИС-42 |

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/register` — Регистрация (role: student/teacher)
- `POST /api/auth/login` — Вход
- `GET /api/auth/profile` — Профиль

### Студент
- `GET /api/student/schedule` — Расписание
- `GET /api/student/grades` — Оценки
- `GET /api/student/grades/:subject` — Оценки по предмету
- `GET /api/student/lab-works` — Лабораторные работы
- `GET /api/student/lab-works/:id` — Детали лабораторной

### Преподаватель
- `GET /api/teacher/subjects` — Предметы и группы
- `GET /api/teacher/groups` — Группы
- `GET /api/teacher/journal/:subject/:groupName` — Полный журнал
- `POST /api/teacher/lesson-dates` — Добавить дату занятия
- `DELETE /api/teacher/lesson-dates/:id` — Удалить дату
- `POST /api/teacher/grades` — Выставить оценку
- `PUT /api/teacher/grades/:id` — Обновить оценку
- `DELETE /api/teacher/grades/:id` — Удалить оценку
- `POST /api/teacher/attendance` — Отметить посещаемость
- `POST /api/teacher/attendance/bulk` — Массовое обновление посещаемости
- `GET/POST /api/teacher/lab-works` — Лабораторные работы
- `PUT/DELETE /api/teacher/lab-works/:id` — Обновить/удалить лабораторную
- `GET /api/teacher/lab-works/:labWorkId/submissions` — Сдачи по лабораторной
- `GET /api/teacher/submissions` — Все сдачи
- `PUT /api/teacher/submissions/:id/check` — Проверить работу
- `GET/POST/DELETE /api/teacher/teams` — Управление командами
- `GET/POST /api/teacher/programs` — Программы по предметам
- `PUT/DELETE /api/teacher/programs/:id` — Обновить/удалить занятие
- `GET /api/teacher/schedule` — Расписание преподавателя
- `GET /api/teacher/students` — Все студенты
- `PUT /api/teacher/students/:id/active` — Активировать/деактивировать студента

## 🎯 Функционал журнала преподавателя

- **ЛКМ** по ячейке — выставить оценку (всплывающее окно)
- **СКМ** (средняя кнопка) — отметить опоздание
- **ПКМ** (правая кнопка) — отметить отсутствие
- Подсветка строки, колонки и ячейки при наведении
- Обесцвечивание строки отчисленного студента
- Выделение новых студентов
- Автоматический расчёт среднего балла
