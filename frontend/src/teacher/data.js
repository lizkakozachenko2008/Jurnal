export const teacherSchedule = [
  { id: 1, time: '09:00–10:30', subject: 'Веб-программирование', type: 'Лекция', group: 'ИС-31', room: '305', status: 'finished' },
  { id: 2, time: '10:40–12:10', subject: 'Веб-программирование', type: 'Лабораторная', group: 'ИС-31', room: '212', status: 'current' },
  { id: 3, time: '13:00–14:30', subject: 'Базы данных', type: 'Практика', group: 'ПО-22', room: '307', status: 'upcoming' },
  { id: 4, time: '14:40–16:10', subject: 'Проектирование ИС', type: 'Консультация', group: 'ИС-41', room: '210', status: 'upcoming' },
];

export const journalSubjects = [
  { id: 'web-is31', subject: 'Веб-программирование', group: 'ИС-31', students: 24 },
  { id: 'db-po22', subject: 'Базы данных', group: 'ПО-22', students: 19 },
  { id: 'design-is41', subject: 'Проектирование ИС', group: 'ИС-41', students: 21 },
];

export const journalLessons = [
  { id: 1, date: '03.06', short: 'ЛР 4' },
  { id: 2, date: '05.06', short: 'Лекция' },
  { id: 3, date: '10.06', short: 'ЛР 5' },
  { id: 4, date: '12.06', short: 'Практика' },
];

export const journalStudents = [
  { id: 1, name: 'Александров Максим', state: 'regular', marks: { 1: '9', 2: '8', 3: '10', 4: '' } },
  { id: 2, name: 'Беляева Анастасия', state: 'new', marks: { 1: '8', 2: 'н', 3: '9', 4: '' } },
  { id: 3, name: 'Воронцов Артём', state: 'regular', marks: { 1: 'оп', 2: '7', 3: '8', 4: '' } },
  { id: 4, name: 'Григорьева Дарья', state: 'regular', marks: { 1: '10', 2: '9', 3: '10', 4: '' } },
  { id: 5, name: 'Дмитриев Кирилл', state: 'expelled', marks: { 1: '5', 2: 'н', 3: '', 4: '' } },
  { id: 6, name: 'Егорова Полина', state: 'regular', marks: { 1: '9', 2: '10', 3: '9', 4: '' } },
  { id: 7, name: 'Жуков Никита', state: 'regular', marks: { 1: '7', 2: '8', 3: 'оп', 4: '' } },
  { id: 8, name: 'Захарова София', state: 'new', marks: { 1: '', 2: '', 3: '8', 4: '' } },
];

export const programItems = [
  { id: 1, number: 1, title: 'Введение в React. Компонентный подход', type: 'Теория', deadline: '', comment: 'Архитектура SPA и JSX', file: 'lecture-01.pdf', team: false },
  { id: 2, number: 2, title: 'Компоненты, props и состояние', type: 'Практика', deadline: '2026-06-18', comment: 'Разбор интерфейса личного кабинета', file: '', team: false },
  { id: 3, number: 3, title: 'Маршрутизация и защищённые страницы', type: 'Лабораторная', deadline: '2026-06-22', comment: 'Работа выполняется парами', file: 'lab-03-routing.pdf', team: true },
  { id: 4, number: 4, title: 'Работа с REST API', type: 'Лабораторная', deadline: '2026-06-29', comment: '', file: 'lab-04-api.pdf', team: false },
  { id: 5, number: 5, title: 'Контрольная работа по React', type: 'Контрольная', deadline: '2026-07-02', comment: '45 минут, без дополнительных материалов', file: '', team: false },
];

export const submissions = [
  { id: 1, student: 'Григорьева Дарья', group: 'ИС-31', lab: 'ЛР 4 · REST API', submitted: '12 июня, 09:14', timing: 'В срок', file: 'github.com/dasha/rest-client', status: 'review', grade: '', comment: '' },
  { id: 2, student: 'Александров Максим', group: 'ИС-31', lab: 'ЛР 4 · REST API', submitted: '12 июня, 10:03', timing: 'В срок', file: 'lab4-aleksandrov.zip', status: 'review', grade: '', comment: '' },
  { id: 3, student: 'Егорова Полина', group: 'ИС-31', lab: 'ЛР 3 · Routing', submitted: '11 июня, 18:42', timing: 'На 1 день позже', file: 'github.com/polina/router-app', status: 'review', grade: '', comment: '' },
  { id: 4, student: 'Воронцов Артём', group: 'ИС-31', lab: 'ЛР 3 · Routing', submitted: '9 июня, 15:20', timing: 'В срок', file: 'routing-vorontsov.zip', status: 'checked', grade: '8', comment: 'Исправить обработку неизвестного маршрута.' },
  { id: 5, student: 'Беляева Анастасия', group: 'ИС-31', lab: 'ЛР 3 · Routing', submitted: '8 июня, 21:05', timing: 'В срок', file: 'github.com/belyaeva/react-router', status: 'checked', grade: '10', comment: 'Отличная работа.' },
];
