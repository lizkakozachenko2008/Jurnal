import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function GradeCharts() {
  const { subject, groupName } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const { data } = await api.get(`/api/teacher/journal/${encodeURIComponent(subject)}/${encodeURIComponent(groupName)}`);
        setJournal(data.data);
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, [subject, groupName]);

  // Экспорт в CSV
  const exportCSV = () => {
    if (!journal) return;
    const { students, grades, lessonDates } = journal;

    // Заголовок
    let csv = 'Студент,' + lessonDates.map(ld => {
      const d = new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      return `"${d} (${ld.topic || ld.lesson_type})"`;
    }).join(',') + ',Средний\n';

    // Данные
    students.forEach(student => {
      const row = [student.full_name];
      lessonDates.forEach(ld => {
        const grade = grades.find(g => g.student_email === student.email && g.date === ld.lesson_date);
        row.push(grade ? grade.grade : '');
      });
      const studentGrades = grades.filter(g => g.student_email === student.email);
      const avg = studentGrades.length ? (studentGrades.reduce((s, g) => s + g.grade, 0) / studentGrades.length).toFixed(1) : '';
      row.push(avg);
      csv += row.join(',') + '\n';
    });

    // Скачать
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Журнал_${subject}_${groupName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Экспорт в Word (таблица HTML)
  const exportWord = () => {
    if (!journal) return;
    const { students, grades, lessonDates } = journal;

    let html = `<html><head><meta charset="utf-8"><style>
      table { border-collapse: collapse; width: 100%; font-family: Arial; }
      th, td { border: 1px solid #333; padding: 6px 10px; text-align: center; font-size: 11px; }
      th { background: #4f46e5; color: white; }
      tr:nth-child(even) { background: #f8fafc; }
      .name { text-align: left; font-weight: bold; }
    </style></head><body>
    <h2>Журнал: ${subject} — группа ${groupName}</h2>
    <table>
      <tr><th>Ст</th>`;

    lessonDates.forEach(ld => {
      const d = new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      html += `<th>${d}<br><small>${ld.topic || ld.lesson_type}</small></th>`;
    });
    html += '<th>Средний</th></tr>';

    students.forEach(student => {
      html += `<tr><td class="name">${student.full_name}</td>`;
      lessonDates.forEach(ld => {
        const grade = grades.find(g => g.student_email === student.email && g.date === ld.lesson_date);
        html += `<td>${grade ? grade.grade : '—'}</td>`;
      });
      const studentGrades = grades.filter(g => g.student_email === student.email);
      const avg = studentGrades.length ? (studentGrades.reduce((s, g) => s + g.grade, 0) / studentGrades.length).toFixed(1) : '—';
      html += `<td><strong>${avg}</strong></td></tr>`;
    });

    html += '</table></body></html>';

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Журнал_${subject}_${groupName}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>;
  }

  if (!journal) return null;

  const { students, grades, lessonDates } = journal;

  // Расчёт данных для графика
  const studentAverages = students.map(student => {
    const sg = grades.filter(g => g.student_email === student.email);
    const avg = sg.length ? sg.reduce((s, g) => s + g.grade, 0) / sg.length : 0;
    return { name: student.full_name, avg: avg.toFixed(1), is_active: student.is_active };
  }).sort((a, b) => b.avg - a.avg);

  const maxAvg = Math.max(...studentAverages.map(s => parseFloat(s.avg)), 10);

  // Динамика среднего балла по датам
  const dateAverages = lessonDates.map(ld => {
    const dateGrades = grades.filter(g => g.date === ld.lesson_date);
    const avg = dateGrades.length ? dateGrades.reduce((s, g) => s + g.grade, 0) / dateGrades.length : 0;
    return { date: new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }), avg: avg.toFixed(1) };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <Link to={`/teacher/journal/${encodeURIComponent(subject)}/${encodeURIComponent(groupName)}`} className="btn-ghost mb-2 text-sm">
            ← Назад к журналу
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Графики: {subject}</h1>
          <p className="text-slate-500">Группа: {groupName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-ghost flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Экспорт CSV
          </button>
          <button onClick={exportWord} className="btn-ghost flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Экспорт Word
          </button>
        </div>
      </div>

      {/* График: Средний балл по студентам */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Средний балл студентов</h2>
        <div className="space-y-3">
          {studentAverages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 text-sm text-slate-700 truncate flex-shrink-0" title={s.name}>
                {s.name} {!s.is_active && <span className="text-red-400 text-xs">(отч.</span>}
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all flex items-center justify-end pr-2 ${
                    s.avg >= 9 ? 'bg-emerald-500' : s.avg >= 7 ? 'bg-blue-500' : s.avg >= 4 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max((s.avg / maxAvg) * 100, 5)}%` }}
                >
                  <span className="text-white text-xs font-bold">{s.avg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* График: Динамика по датам */}
      {dateAverages.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Динамика среднего балла по занятиям</h2>
          <div className="flex items-end gap-2 h-48 border-b border-l border-slate-200 p-2">
            {dateAverages.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs text-slate-600 mb-1">{d.avg}</span>
                <div
                  className="w-full bg-indigo-500 rounded-t-md transition-all"
                  style={{ height: `${Math.max((d.avg / 10) * 100, 5)}%` }}
                />
                <span className="text-[10px] text-slate-400 mt-1 text-center">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-indigo-600">{students.filter(s => s.is_active).length}</div>
          <div className="text-sm text-slate-500 mt-1">Активных студентов</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-emerald-600">
            {studentAverages.length > 0 ? studentAverages[0].avg : '—'}
          </div>
          <div className="text-sm text-slate-500 mt-1">Лучший средний балл</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-amber-600">
            {studentAverages.filter(s => parseFloat(s.avg) < 4).length}
          </div>
          <div className="text-sm text-slate-500 mt-1">С баллом ниже 4</div>
        </div>
      </div>
    </div>
  );
}
