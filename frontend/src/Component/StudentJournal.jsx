import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function StudentJournal() {
  const [journal, setJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const { data } = await api.get('/api/student/journal');
        if (data.success) {
          setJournal(data.data);
        }
      } catch (err) {
        setError('Не удалось загрузить журнал');
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, []);

  const normDate = (d) => {
    if (!d) return '';
    return typeof d === 'string' ? d.split('T')[0] : new Date(d).toISOString().split('T')[0];
  };

  const getGradeForDate = (grades, date) => {
    return grades.find(g => normDate(g.date) === normDate(date));
  };

  const getAttendanceForDate = (attendance, date) => {
    return attendance.find(a => normDate(a.lesson_date) === normDate(date));
  };

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (grade >= 7) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (grade >= 4) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Электронный журнал</h1>
      </div>

      {journal.length === 0 ? (
        <div className="text-slate-400 text-center py-16">Нет данных</div>
      ) : (
        <div className="space-y-8">
          {journal.map((item, idx) => (
            <div key={idx} className="card overflow-hidden">
              <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                <h2 className="font-bold text-slate-900 text-lg">{item.subject}</h2>
              </div>

              {/* Таблица оценок и посещаемости */}
              {item.lessonDates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-2.5 text-left text-sm font-semibold text-slate-600 border-b border-slate-200 sticky left-0 bg-slate-50 min-w-[150px]">
                          Дата
                        </th>
                        <th className="px-4 py-2.5 text-left text-sm font-semibold text-slate-600 border-b border-slate-200 min-w-[200px]">
                          Тема
                        </th>
                        <th className="px-4 py-2.5 text-center text-sm font-semibold text-slate-600 border-b border-slate-200 min-w-[80px]">
                          Оценка
                        </th>
                        <th className="px-4 py-2.5 text-center text-sm font-semibold text-slate-600 border-b border-slate-200 min-w-[100px]">
                          Посещаемость
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {item.lessonDates.map((ld) => {
                        const grade = getGradeForDate(item.grades, ld.lesson_date);
                        const attend = getAttendanceForDate(item.attendance, ld.lesson_date);
                        return (
                          <tr key={ld.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-2.5 text-sm text-slate-600 sticky left-0 bg-white">
                              {new Date(ld.lesson_date).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="px-4 py-2.5 text-sm text-slate-700">{ld.topic || ld.lesson_type || '—'}</td>
                            <td className="px-4 py-2.5 text-center">
                              {grade ? (
                                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${getGradeColor(grade.grade)}`}>
                                  {grade.grade}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {attend ? (
                                attend.status === 'absent' ? (
                                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-red-100 text-red-700">Н</span>
                                ) : attend.status === 'late' ? (
                                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-700">
                                    Опоздание ({attend.minutes_late} мин)
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400">—</span>
                                )
                              ) : (
                                <span className="text-xs text-slate-300">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-4 text-slate-400 text-sm">Нет занятий по этому предмету</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
