import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unchecked, checked
  const [checkingId, setCheckingId] = useState(null);
  const [checkScore, setCheckScore] = useState('');
  const [checkComment, setCheckComment] = useState('');

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get('/api/teacher/submissions');
      setSubmissions(data.data);
    } catch (err) {
      console.error('Ошибка загрузки сдач:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const filtered = submissions.filter(s => {
    if (filter === 'unchecked') return s.status !== 'checked';
    if (filter === 'checked') return s.status === 'checked';
    return true;
  });

  const startCheck = (sub) => {
    setCheckingId(sub.id);
    setCheckScore(sub.score !== null ? String(sub.score) : '');
    setCheckComment(sub.teacher_comment || '');
  };

  const saveCheck = async (id, maxScore) => {
    const score = checkScore !== '' ? parseInt(checkScore, 10) : null;
    if (score !== null && (score < 0 || score > maxScore)) {
      alert(`Оценка должна быть от 0 до ${maxScore}`);
      return;
    }
    try {
      await api.put(`/api/teacher/submissions/${id}/check`, {
        score,
        teacherComment: checkComment,
      });
      setCheckingId(null);
      await fetchSubmissions();
    } catch (err) {
      console.error('Ошибка проверки:', err);
    }
  };

  const getStatusBadge = (sub) => {
    if (sub.status === 'checked') {
      return <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Проверено</span>;
    }
    return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Ожидает проверки</span>;
  };

  const isOverdue = (submittedAt, dueDate) => {
    if (!dueDate) return false;
    return new Date(submittedAt) > new Date(dueDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Сдачи лабораторных</h1>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: 'Все' },
          { value: 'unchecked', label: 'Ожидают проверки' },
          { value: 'checked', label: 'Проверенные' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-slate-400 text-center py-16">
          <p>Нет сданных работ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <div key={sub.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{sub.student_name}</h3>
                    {sub.team_name && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Команда: {sub.team_name}
                      </span>
                    )}
                    {getStatusBadge(sub)}
                    {isOverdue(sub.submitted_at, sub.due_date) && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Поздняя сдача</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-3 flex-wrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-medium">{sub.subject}</span>
                    <span>{sub.lab_title}</span>
                    <span>•</span>
                    <span>Сдано: {new Date(sub.submitted_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                  {sub.solution_text && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                      <strong>Решение:</strong> {sub.solution_text}
                    </div>
                  )}
                  {sub.file_url && (
                    <div className="mt-2">
                      <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        📎 Прикреплённый файл
                      </a>
                    </div>
                  )}
                  {sub.status === 'checked' && sub.teacher_comment && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700">
                      <strong>Комментарий:</strong> {sub.teacher_comment}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {sub.status === 'checked' && sub.score !== null ? (
                    <span className={`text-lg font-bold ${sub.score >= 70 ? 'text-emerald-600' : sub.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sub.score}/{sub.max_score}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—/{sub.max_score}</span>
                  )}
                  {sub.status !== 'checked' && (
                    <button
                      onClick={() => startCheck(sub)}
                      className="btn-primary text-sm"
                    >
                      Проверить
                    </button>
                  )}
                </div>
              </div>

              {/* Форма проверки */}
              {checkingId === sub.id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Оценка (макс. {sub.max_score})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={sub.max_score}
                        value={checkScore}
                        onChange={(e) => setCheckScore(e.target.value)}
                        className="input-field text-center text-xl font-bold"
                        placeholder="—"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Комментарий</label>
                      <textarea
                        value={checkComment}
                        onChange={(e) => setCheckComment(e.target.value)}
                        className="input-field"
                        rows={2}
                        placeholder="Комментарий к работе"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => saveCheck(sub.id, sub.max_score)}
                      className="btn-primary"
                    >
                      Сохранить оценку
                    </button>
                    <button
                      onClick={() => setCheckingId(null)}
                      className="btn-ghost"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
