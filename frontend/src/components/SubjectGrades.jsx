import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function SubjectGrades() {
  const { subject } = useParams();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data } = await api.get(`/api/student/grades/${encodeURIComponent(subject)}`);
        setGrades(data.data);
      } catch (err) {
        setError('Не удалось загрузить оценки');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [subject]);

  const avg = grades.length
    ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length)
    : 0;

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'text-emerald-600';
    if (grade >= 7) return 'text-blue-600';
    if (grade >= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGradeBadge = (grade) => {
    if (grade >= 9) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (grade >= 7) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade >= 4) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
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
      <Link to="/grades" className="btn-ghost mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Назад к оценкам
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{subject}</h1>
        <div className="card px-4 py-2.5 flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{avg}<span className="text-sm text-slate-400">/10</span></div>
            <div className="text-xs text-slate-400">средний балл</div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{grades.length}</div>
            <div className="text-xs text-slate-400">оценок</div>
          </div>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="text-slate-400 text-center py-12">Оценок по этому предмету нет</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="w-full bg-slate-100 h-2">
            <div
              className={`h-2 transition-all ${avg >= 9 ? 'bg-emerald-500' : avg >= 7 ? 'bg-blue-500' : avg >= 4 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(avg * 10, 100)}%` }}
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60">
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-slate-500">Дата</th>
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-slate-500">Оценка</th>
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-slate-500">Тип</th>
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-slate-500">Визуализация</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {new Date(grade.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${getGradeBadge(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {grade.grade_type || '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${grade.grade >= 9 ? 'bg-emerald-500' : grade.grade >= 7 ? 'bg-blue-500' : grade.grade >= 4 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(grade.grade * 10, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
