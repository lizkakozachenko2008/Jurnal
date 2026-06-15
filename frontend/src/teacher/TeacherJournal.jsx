import { useMemo, useState } from 'react';
import { journalLessons as initialLessons, journalStudents as initialStudents, journalSubjects } from './data';

export default function TeacherJournal() {
  const [selected, setSelected] = useState(journalSubjects[0].id);
  const [lessons, setLessons] = useState(initialLessons);
  const [students, setStudents] = useState(initialStudents);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState('');
  const [showLesson, setShowLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({ date: '2026-06-14', short: 'Лабораторная' });
  const subject = journalSubjects.find((item) => item.id === selected);

  const average = useMemo(() => {
    const values = students.flatMap((student) => Object.values(student.marks)).map(Number).filter(Number.isFinite);
    return values.length ? (values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(1) : '—';
  }, [students]);

  const setMark = (studentId, lessonId, mark) => {
    setStudents((current) => current.map((student) => (
      student.id === studentId ? { ...student, marks: { ...student.marks, [lessonId]: mark } } : student
    )));
  };

  const openGrade = (studentId, lessonId) => {
    const current = students.find((student) => student.id === studentId)?.marks[lessonId] || '';
    setValue(/^\d+$/.test(current) ? current : '');
    setEditing({ studentId, lessonId });
  };

  const saveGrade = (event) => {
    event.preventDefault();
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 10) return;
    setMark(editing.studentId, editing.lessonId, value);
    setEditing(null);
  };

  const handlePointerMark = (event, studentId, lessonId) => {
    if (event.button === 1) {
      event.preventDefault();
      setMark(studentId, lessonId, 'оп');
    }
    if (event.button === 2) {
      event.preventDefault();
      setMark(studentId, lessonId, 'н');
    }
  };

  const addLesson = (event) => {
    event.preventDefault();
    const date = new Date(lessonForm.date);
    setLessons((current) => [...current, {
      id: Math.max(...current.map((item) => item.id)) + 1,
      date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      short: lessonForm.short,
    }]);
    setShowLesson(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Журнал</h1>
          <p className="text-sm text-slate-500 mt-1">Оценки и посещаемость по группам</p>
        </div>
        <button onClick={() => setShowLesson(true)} className="btn-primary">+ Добавить занятие</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {journalSubjects.map((item) => (
          <button key={item.id} onClick={() => setSelected(item.id)} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${selected === item.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
            {item.subject} · {item.group}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xl">
        <div className="card p-3"><div className="text-xs text-slate-400">Студентов</div><div className="text-xl font-bold text-slate-900">{subject.students}</div></div>
        <div className="card p-3"><div className="text-xs text-slate-400">Занятий</div><div className="text-xl font-bold text-slate-900">{lessons.length}</div></div>
        <div className="card p-3"><div className="text-xs text-slate-400">Средний балл</div><div className="text-xl font-bold text-slate-900">{average}</div></div>
      </div>

      <div className="card overflow-x-auto">
        <table className="teacher-journal min-w-[780px] w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-slate-50 text-left px-4 py-3 text-xs font-bold text-slate-500 min-w-56">Студент</th>
              {lessons.map((lesson) => (
                <th key={lesson.id} className="journal-column px-2 py-3 min-w-24 text-center">
                  <div className="text-xs font-bold text-slate-700">{lesson.date}</div>
                  <div className="text-[11px] font-medium text-slate-400">{lesson.short}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className={`journal-row border-t border-slate-100 ${student.state === 'expelled' ? 'opacity-40 grayscale' : ''}`}>
                <td className="sticky left-0 z-10 bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{student.name}</span>
                    {student.state === 'new' && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">НОВЫЙ</span>}
                    {student.state === 'expelled' && <span className="text-[10px] text-slate-500">отчислен</span>}
                  </div>
                </td>
                {lessons.map((lesson) => {
                  const mark = student.marks[lesson.id] || '';
                  return (
                    <td key={lesson.id} className="journal-cell p-1.5 text-center" onMouseDown={(event) => handlePointerMark(event, student.id, lesson.id)} onContextMenu={(event) => event.preventDefault()}>
                      <button onClick={() => openGrade(student.id, lesson.id)} className={`w-11 h-9 rounded-md text-sm font-bold transition-colors ${mark === 'н' ? 'bg-red-50 text-red-600' : mark === 'оп' ? 'bg-amber-50 text-amber-700' : mark ? 'bg-emerald-50 text-emerald-700' : 'text-slate-300 hover:bg-indigo-50 hover:text-indigo-500'}`}>
                        {mark || '·'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
        <span>Левая кнопка — оценка</span><span>Средняя — опоздание</span><span>Правая — отсутствие</span>
      </div>

      {editing && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form onSubmit={saveGrade} onMouseDown={(event) => event.stopPropagation()} className="modal-panel">
            <h2 className="text-lg font-bold text-slate-900">Выставить оценку</h2>
            <p className="text-sm text-slate-500 mt-1">Введите число от 1 до 10</p>
            <input autoFocus inputMode="numeric" value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, '').slice(0, 2))} className="input-field mt-4 text-center text-xl font-bold" placeholder="10" />
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Отмена</button>
              <button className="btn-primary" disabled={!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 10}>Сохранить</button>
            </div>
          </form>
        </div>
      )}

      {showLesson && (
        <div className="modal-backdrop" onMouseDown={() => setShowLesson(false)}>
          <form onSubmit={addLesson} onMouseDown={(event) => event.stopPropagation()} className="modal-panel">
            <h2 className="text-lg font-bold text-slate-900">Новое занятие</h2>
            <label className="block text-sm font-semibold text-slate-700 mt-4 mb-1">Дата</label>
            <input type="date" required className="input-field" value={lessonForm.date} onChange={(event) => setLessonForm({ ...lessonForm, date: event.target.value })} />
            <label className="block text-sm font-semibold text-slate-700 mt-3 mb-1">Тип занятия</label>
            <select className="input-field" value={lessonForm.short} onChange={(event) => setLessonForm({ ...lessonForm, short: event.target.value })}>
              <option>Лабораторная</option><option>Лекция</option><option>Практика</option><option>Контрольная</option>
            </select>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" className="btn-ghost" onClick={() => setShowLesson(false)}>Отмена</button>
              <button className="btn-primary">Добавить</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
