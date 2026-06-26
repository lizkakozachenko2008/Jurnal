import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const GRADE_TYPES = [
  { value: 'lecture', label: 'Лекция' },
  { value: 'practice', label: 'Практика' },
  { value: 'lab', label: 'Лабораторная' },
  { value: 'test', label: 'Контрольная' },
  { value: 'exam', label: 'Экзамен' },
  { value: 'quiz', label: 'Опрос' },
];

export default function TeacherJournal() {
  const { subject, groupName } = useParams();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [lessonDates, setLessonDates] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Состояние для редактирования
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editComment, setEditComment] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [currentGradeTarget, setCurrentGradeTarget] = useState(null);

  // Контекстное меню для ячейки
  const [contextMenu, setContextMenu] = useState(null); // { x, y, student, date }
  const contextMenuRef = useRef(null);

  // Добавление даты занятия
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newLessonType, setNewLessonType] = useState('lecture');
  const [dateError, setDateError] = useState('');

  const fetchJournal = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/teacher/journal/${encodeURIComponent(subject)}/${encodeURIComponent(groupName)}`);
      setStudents(data.data.students || []);
      setGrades(data.data.grades || []);
      setLessonDates(data.data.lessonDates || []);
      setAttendance(data.data.attendance || []);
    } catch (err) {
      setError('Не удалось загрузить журнал');
    } finally {
      setLoading(false);
    }
  }, [subject, groupName]);

  useEffect(() => {
    fetchJournal();
  }, [fetchJournal]);

  // Закрытие контекстного меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Получить оценку студента на дату
  const getGrade = (studentEmail, date) => {
    return grades.find(g => g.student_email === studentEmail && g.date === date);
  };

  // Получить посещаемость студента на дату
  const getAttendance = (studentEmail, date) => {
    return attendance.find(a => a.student_email === studentEmail && a.lesson_date === date);
  };

  // Проверка на воскресенье
  const isSunday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getDay() === 0;
  };

  // Обработка клика по ячейке (левая кнопка — оценка)
  const handleCellClick = (student, date, e) => {
    if (e.button !== 0) return;
    setContextMenu(null);
    const existing = getGrade(student.email, date);
    setCurrentGradeTarget({ student, date, existing });
    setEditValue(existing ? String(existing.grade) : '');
    setEditComment(existing ? existing.teacher_comment || '' : '');
    setShowGradeModal(true);
  };

  // Обработка правой кнопки мыши — контекстное меню
  const handleCellRightClick = (student, date, e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      student,
      date,
    });
  };

  // Отметить отсутствие через контекстное меню
  const markAbsent = async (student, date) => {
    const existing = getAttendance(student.email, date);
    const newStatus = existing?.status === 'absent' ? 'present' : 'absent';
    try {
      await api.post('/api/teacher/attendance', {
        studentEmail: student.email,
        studentName: student.full_name,
        subject,
        lessonDate: date,
        status: newStatus,
        minutesLate: 0,
      });
      await fetchJournal();
    } catch (err) {
      console.error('Ошибка отметки отсутствия:', err);
    }
    setContextMenu(null);
  };

  // Отметить опоздание через контекстное меню
  const markLate = async (student, date, minutes = 15) => {
    const existing = getAttendance(student.email, date);
    const newStatus = existing?.status === 'late' ? 'present' : 'late';
    const minutesLate = newStatus === 'late' ? minutes : 0;
    try {
      await api.post('/api/teacher/attendance', {
        studentEmail: student.email,
        studentName: student.full_name,
        subject,
        lessonDate: date,
        status: newStatus,
        minutesLate,
      });
      await fetchJournal();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
      console.error('Ошибка отметки опоздания:', err);
    }
    setContextMenu(null);
  };

  // Сохранить оценку (10-балльная система)
  const saveGrade = async () => {
    if (!editValue || isNaN(editValue)) {
      alert('Введите оценку от 1 до 10');
      return;
    }
    const numGrade = parseInt(editValue, 10);
    if (numGrade < 1 || numGrade > 10) {
      alert('Оценка должна быть от 1 до 10');
      return;
    }

    try {
      if (currentGradeTarget?.existing) {
        await api.put(`/api/teacher/grades/${currentGradeTarget.existing.id}`, {
          grade: numGrade,
          teacherComment: editComment,
        });
      } else {
        await api.post('/api/teacher/grades', {
          studentEmail: currentGradeTarget.student.email,
          studentName: currentGradeTarget.student.full_name,
          subject,
          grade: numGrade,
          gradeType: 'lecture',
          date: currentGradeTarget.date,
          teacherComment: editComment,
        });
      }
      setShowGradeModal(false);
      await fetchJournal();
    } catch (err) {
      alert('Ошибка сохранения: ' + (err.response?.data?.error || err.message));
      console.error('Ошибка сохранения оценки:', err);
    }
  };

  // Удалить оценку
  const deleteGrade = async () => {
    if (!currentGradeTarget?.existing) return;
    try {
      await api.delete(`/api/teacher/grades/${currentGradeTarget.existing.id}`);
      setShowGradeModal(false);
      await fetchJournal();
    } catch (err) {
      console.error('Ошибка удаления оценки:', err);
    }
  };

  // Быстрое добавление урока — состояние модалки
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickDay, setQuickDay] = useState(1);
  const [quickTopic, setQuickTopic] = useState('');
  const [quickType, setQuickType] = useState('lecture');

  const DAYS = [
    { value: 1, label: 'Понедельник' },
    { value: 2, label: 'Вторник' },
    { value: 3, label: 'Среда' },
    { value: 4, label: 'Четверг' },
    { value: 5, label: 'Пятница' },
    { value: 6, label: 'Суббота' },
  ];

  const addQuickLesson = async () => {
    if (!quickTopic.trim()) {
      alert('Введите тему занятия');
      return;
    }
    // Найти ближайшую дату на выбранный день недели
    const today = new Date();
    const currentDay = today.getDay() === 0 ? 7 : today.getDay();
    let daysUntil = quickDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntil);
    const dateStr = targetDate.toISOString().split('T')[0];

    try {
      await api.post('/api/teacher/lesson-dates', {
        subject,
        groupName,
        lessonDate: dateStr,
        topic: quickTopic,
        lessonType: quickType,
      });
      await fetchJournal();
      setShowQuickAdd(false);
      setQuickTopic('');
      setQuickDay(1);
      setQuickType('lecture');
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  // Добавить дату занятия
  const addLessonDate = async () => {
    if (!newDate) return;
    if (isSunday(newDate)) {
      setDateError('Нельзя добавить занятие на воскресенье');
      return;
    }
    setDateError('');
    try {
      await api.post('/api/teacher/lesson-dates', {
        subject,
        groupName,
        lessonDate: newDate,
        topic: newTopic,
        lessonType: newLessonType,
      });
      setShowAddDate(false);
      setNewDate('');
      setNewTopic('');
      setNewLessonType('lecture');
      await fetchJournal();
    } catch (err) {
      console.error('Ошибка добавления даты:', err);
    }
  };

  // Удалить дату занятия
  const removeLessonDate = async (id) => {
    try {
      await api.delete(`/api/teacher/lesson-dates/${id}`);
      await fetchJournal();
    } catch (err) {
      console.error('Ошибка удаления даты:', err);
    }
  };

  // Подсветка при наведении
  const getCellClass = (studentEmail, date) => {
    const isHovered = hoveredCell?.studentId === studentEmail && hoveredCell?.date === date;
    const isRowHovered = hoveredRow === studentEmail;
    const isColHovered = hoveredCol === date;
    const grade = getGrade(studentEmail, date);
    const attend = getAttendance(studentEmail, date);

    let cls = 'relative transition-colors cursor-pointer ';

    if (isHovered) cls += 'bg-indigo-100 ring-2 ring-inset ring-indigo-300 ';
    else if (isRowHovered || isColHovered) cls += 'bg-indigo-50/50 ';

    if (attend?.status === 'absent') cls += 'bg-red-50 ';
    else if (attend?.status === 'late') cls += 'bg-amber-50 ';

    if (grade) {
      if (grade.grade >= 9) cls += 'text-emerald-700 font-bold ';
      else if (grade.grade >= 7) cls += 'text-blue-700 font-bold ';
      else if (grade.grade >= 4) cls += 'text-amber-700 font-bold ';
      else cls += 'text-red-700 font-bold ';
    }

    return cls;
  };

  const getStudentRowClass = (student) => {
    let cls = 'transition-colors ';
    if (!student.is_active) cls += 'opacity-40 bg-gray-50 ';
    return cls;
  };

  // Определяем, новый ли студент (зарегистрирован менее 7 дней назад)
  const isNewStudent = (student) => {
    if (!student.created_at || !student.is_active) return false;
    return new Date(student.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>
    );
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <Link to="/" className="btn-ghost mb-2 text-sm">
            ← Назад
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{subject}</h1>
          <p className="text-slate-500">Группа: {groupName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddDate(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Добавить занятие
          </button>
          <button onClick={addQuickLesson} className="btn-ghost flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Быстрое добавление
          </button>
        </div>
      </div>

      {/* Подсказки */}
      <div className="card p-4 mb-4 bg-indigo-50 border-indigo-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-200 border border-indigo-400" />
            ЛКМ — оценка
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-200 border border-red-400" />
            ПКМ — отсутствие / опоздание
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400" />
            10-балльная система
          </span>
        </div>
      </div>

      {/* Таблица журнала */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-600 border-b border-r border-slate-200 min-w-[200px]">
                  Студент
                </th>
                {lessonDates.map((ld) => (
                  <th
                    key={ld.id}
                    className={`px-2 py-3 text-center text-sm font-semibold border-b border-slate-200 min-w-[80px] group/th transition-colors ${
                      hoveredCol === ld.lesson_date ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                    }`}
                    onMouseEnter={() => setHoveredCol(ld.lesson_date)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs text-slate-400">
                        {new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                      </span>
                      <span className="text-xs">{ld.topic || ld.lesson_type}</span>
                      <button
                        onClick={() => removeLessonDate(ld.id)}
                        className="opacity-0 group-hover/th:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                        title="Удалить дату"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600 border-b border-slate-200 min-w-[80px]">
                  Средний
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentGrades = grades.filter(g => g.student_email === student.email);
                const avg = studentGrades.length
                  ? (studentGrades.reduce((s, g) => s + g.grade, 0) / studentGrades.length).toFixed(1)
                  : null;

                return (
                  <tr
                    key={student.id}
                    className={`group/row ${getStudentRowClass(student)}`}
                    onMouseEnter={() => setHoveredRow(student.email)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className={`sticky left-0 z-10 px-4 py-2.5 text-sm border-b border-r border-slate-200 transition-colors ${
                      !student.is_active ? 'bg-gray-50' : (hoveredRow === student.email ? 'bg-indigo-50/30' : 'bg-white')
                    }`}>
                      <div className="font-medium text-slate-900">{student.full_name}</div>
                      {!student.is_active ? (
                        <span className="text-xs text-red-500 font-medium">Отчислен</span>
                      ) : isNewStudent(student) ? (
                        <span className="text-xs text-emerald-500 font-medium">Новый</span>
                      ) : null}
                    </td>
                    {lessonDates.map((ld) => {
                      const grade = getGrade(student.email, ld.lesson_date);
                      const attend = getAttendance(student.email, ld.lesson_date);
                      return (
                        <td
                          key={ld.id}
                          className={`px-2 py-2.5 text-center text-sm border-b border-slate-100 ${getCellClass(student.email, ld.lesson_date)}`}
                          onMouseEnter={() => setHoveredCell({ studentId: student.email, date: ld.lesson_date })}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={(e) => handleCellClick(student, ld.lesson_date, e)}
                          onContextMenu={(e) => handleCellRightClick(student, ld.lesson_date, e)}
                        >
                          {grade ? (
                            <span>{grade.grade}</span>
                          ) : attend?.status === 'absent' ? (
                            <span className="text-red-500 font-bold">Н</span>
                          ) : attend?.status === 'late' ? (
                            <span className="text-amber-500 font-bold" title={`Опоздание на ${attend.minutes_late} мин`}>О{attend.minutes_late > 0 ? attend.minutes_late : ''}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5 text-center text-sm border-b border-slate-100">
                      {avg !== null ? (
                        <span className={`font-bold ${avg >= 9 ? 'text-emerald-600' : avg >= 7 ? 'text-blue-600' : avg >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                          {avg}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Контекстное меню для ячейки (ПКМ) */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[200px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => markAbsent(contextMenu.student, contextMenu.date)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-slate-700 hover:text-red-700 flex items-center gap-2 transition-colors"
          >
            <span className="w-4 h-4 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">Н</span>
            Отсутствие
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => markLate(contextMenu.student, contextMenu.date, 5)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center gap-2 transition-colors"
          >
            <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">О</span>
            Опоздание (5 мин)
          </button>
          <button
            onClick={() => markLate(contextMenu.student, contextMenu.date, 10)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center gap-2 transition-colors"
          >
            <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">О</span>
            Опоздание (10 мин)
          </button>
          <button
            onClick={() => markLate(contextMenu.student, contextMenu.date, 15)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center gap-2 transition-colors"
          >
            <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">О</span>
            Опоздание (15 мин)
          </button>
          <button
            onClick={() => markLate(contextMenu.student, contextMenu.date, 30)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center gap-2 transition-colors"
          >
            <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">О</span>
            Опоздание (30 мин)
          </button>
        </div>
      )}

      {/* Модальное окно добавления даты */}
      {showAddDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowAddDate(false); setDateError(''); }}>
          <div className="card p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Добавить занятие</h2>
            {dateError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{dateError}</div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Дата</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => { setNewDate(e.target.value); setDateError(''); }}
                  className="input-field"
                />
                {isSunday(newDate) && (
                  <p className="text-xs text-red-500 mt-1">Занятия в воскресенье не проводятся</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Тема</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="input-field"
                  placeholder="Тема занятия"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Тип</label>
                <select
                  value={newLessonType}
                  onChange={(e) => setNewLessonType(e.target.value)}
                  className="input-field"
                >
                  {GRADE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={addLessonDate} className="btn-primary flex-1 flex items-center justify-center gap-2">Добавить</button>
                <button onClick={() => { setShowAddDate(false); setDateError(''); }} className="btn-ghost flex-1 flex items-center justify-center gap-2">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно оценки (10-балльная) */}
      {showGradeModal && currentGradeTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGradeModal(false)}>
          <div className="card p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {currentGradeTarget.student.full_name}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {new Date(currentGradeTarget.date).toLocaleDateString('ru-RU')}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Оценка (1–10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="input-field text-center text-2xl font-bold"
                  placeholder="—"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') saveGrade(); }}
                />
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>1 — неудовл.</span>
                  <span>10 — отлично</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Комментарий</label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="input-field"
                  rows={2}
                  placeholder="Комментарий преподавателя"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveGrade} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {currentGradeTarget.existing ? 'Сохранить' : 'Выставить'}
                </button>
                {currentGradeTarget.existing && (
                  <button onClick={deleteGrade} className="btn-danger flex items-center justify-center gap-2">
                    Удалить
                  </button>
                )}
                <button onClick={() => setShowGradeModal(false)} className="btn-ghost flex items-center justify-center gap-2">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно быстрого добавления урока на день недели */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQuickAdd(false)}>
          <div className="card p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Быстрое добавление урока</h2>
            <p className="text-sm text-slate-500 mb-4">Урок будет добавлен на ближайший выбранный день недели</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">День недели</label>
                <div className="grid grid-cols-3 gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day.value}
                      onClick={() => setQuickDay(day.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        quickDay === day.value
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {day.label.slice(0, 2)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Тема занятия</label>
                <input
                  type="text"
                  value={quickTopic}
                  onChange={(e) => setQuickTopic(e.target.value)}
                  className="input-field"
                  placeholder="Введите тему"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') addQuickLesson(); }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Тип</label>
                <select value={quickType} onChange={(e) => setQuickType(e.target.value)} className="input-field">
                  <option value="lecture">Лекция</option>
                  <option value="practice">Практика</option>
                  <option value="lab">Лабораторная</option>
                  <option value="test">Контрольная</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={addQuickLesson} className="btn-primary flex-1 flex items-center justify-center gap-2">Добавить</button>
                <button onClick={() => setShowQuickAdd(false)} className="btn-ghost flex-1 flex items-center justify-center gap-2">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
