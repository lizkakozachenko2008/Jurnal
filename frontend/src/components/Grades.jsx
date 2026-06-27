import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null); // раскрытый предмет
  const PAGE_SIZE = 7;

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data } = await api.get('/api/student/grades');
        setGrades(data.data);
      } catch (err) {
        setError('Не удалось загрузить оценки');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const groupedBySubject = grades.reduce((acc, grade) => {
    const subject = grade.subject;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(grade);
    return acc;
  }, {});

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (grade >= 7) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (grade >= 4) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getProgressColor = (grade) => {
    if (grade >= 9) return 'bg-emerald-500';
    if (grade >= 7) return 'bg-blue-500';
    if (grade >= 4) return 'bg-amber-500';
    return 'bg-red-500';
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
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Оценки</h1>
      </div>

      {Object.keys(groupedBySubject).length === 0 ? (
        <div className="text-slate-400 text-center py-16">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p>Оценок пока нет</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedBySubject).map(([subject, subjectGrades]) => {
            const avg = Math.round(
              subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length
            );
            return (
              <Link
                key={subject}
                to={`/grades/${encodeURIComponent(subject)}`}
                className="card group p-5 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-bold text-slate-900 text-lg">{subject}</h2>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${getGradeColor(avg)}`}>
                    {avg}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(avg)}`}
                    style={{ width: `${Math.min(avg * 10, 100)}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {(expandedSubject === subject ? subjectGrades : subjectGrades.slice(0, PAGE_SIZE)).map((grade) => (
                    <div key={grade.id} className="flex justify-between text-sm items-center">
                      <span className="text-slate-500">
                        {new Date(grade.date).toLocaleDateString('ru-RU')}
                      </span>
                      <span className={`font-semibold px-2 py-0.5 rounded-md text-xs border ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </div>
                  ))}
                </div>

                {subjectGrades.length > PAGE_SIZE && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setExpandedSubject(expandedSubject === subject ? null : subject);
                    }}
                    className="mt-3 w-full text-center text-xs text-indigo-600 hover:text-indigo-700 font-medium py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    {expandedSubject === subject
                      ? 'Свернуть'
                      : `Показать все (${subjectGrades.length})`
                    }
                  </button>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {subjectGrades.length} {subjectGrades.length === 1 ? 'оценка' : 'оценок'}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Подробнее
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
