import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TeacherLabWorks() {
  const [labWorks, setLabWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Форма создания
  const [form, setForm] = useState({
    subject: '',
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100,
    isTeamWork: false,
    theoryMaterials: '',
  });

  const fetchLabWorks = async () => {
    try {
      const { data } = await api.get('/api/teacher/lab-works');
      setLabWorks(data.data);
    } catch (err) {
      console.error('Ошибка загрузки лабораторных:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLabWorks(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const createLabWork = async () => {
    if (!form.subject || !form.title || !form.dueDate) return;
    try {
      await api.post('/api/teacher/lab-works', form);
      setShowCreate(false);
      setForm({ subject: '', title: '', description: '', dueDate: '', maxScore: 100, isTeamWork: false, theoryMaterials: '' });
      await fetchLabWorks();
    } catch (err) {
      console.error('Ошибка создания:', err);
    }
  };

  const deleteLabWork = async (id) => {
    if (!confirm('Удалить лабораторную работу?')) return;
    try {
      await api.delete(`/api/teacher/lab-works/${id}`);
      await fetchLabWorks();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const toggleSubmissions = async (labWorkId) => {
    if (expandedId === labWorkId) {
      setExpandedId(null);
      setSubmissions([]);
      return;
    }
    setExpandedId(labWorkId);
    try {
      const { data } = await api.get(`/api/teacher/lab-works/${labWorkId}/submissions`);
      setSubmissions(data.data);
    } catch (err) {
      console.error('Ошибка загрузки сдач:', err);
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.882.177A10.463 10.463 0 0112 21a10.463 10.463 0 01-6.237-1.714l-.845-.253c-1.67-.496-2.28-2.39-1.044-3.633L5 14.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Лабораторные работы</h1>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Создать
        </button>
      </div>

      {labWorks.length === 0 ? (
        <div className="text-slate-400 text-center py-16">
          <p>Лабораторных работ нет. Создайте первую!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {labWorks.map((lab) => (
            <div key={lab.id} className="card overflow-hidden">
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-slate-900">{lab.title}</h2>
                      {lab.is_team_work && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Командная</span>
                      )}
                      {isOverdue(lab.due_date) && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Дедлайн прошёл</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-medium">{lab.subject}</span>
                      <span>Дедлайн: {new Date(lab.due_date).toLocaleDateString('ru-RU')}</span>
                      <span>Макс: {lab.max_score} баллов</span>
                    </div>
                    {lab.description && (
                      <p className="text-sm text-slate-600 mt-2">{lab.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSubmissions(lab.id)}
                      className="btn-ghost text-sm"
                    >
                      {expandedId === lab.id ? 'Скрыть сдачи' : 'Сдачи'}
                    </button>
                    <button
                      onClick={() => deleteLabWork(lab.id)}
                      className="btn-danger text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>

              {/* Сдачи студентов */}
              {expandedId === lab.id && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Сданные работы</h3>
                  {submissions.length === 0 ? (
                    <p className="text-sm text-slate-400">Пока никто не сдал</p>
                  ) : (
                    <div className="space-y-2">
                      {submissions.map((sub) => (
                        <div key={sub.id} className="bg-white rounded-lg p-3 border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900 text-sm">
                              {sub.student_name}
                              {sub.team_name && <span className="text-purple-500 ml-1">({sub.team_name})</span>}
                            </div>
                            <div className="text-xs text-slate-500">
                              Сдано: {new Date(sub.submitted_at).toLocaleDateString('ru-RU')}
                              {sub.solution_text && <span className="ml-2">• Есть решение</span>}
                              {sub.file_url && <span className="ml-2">• Есть файл</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {sub.score !== null ? (
                              <span className={`text-sm font-bold ${sub.score >= 70 ? 'text-emerald-600' : sub.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                {sub.score}/{lab.max_score}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Не проверено</span>
                            )}
                            <a
                              href={`/teacher/submissions?id=${sub.id}`}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              Проверить
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно создания */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="card p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Новая лабораторная работа</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Предмет *</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="Программирование" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Название *</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Лабораторная работа №1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Описание / ТЗ</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} placeholder="Описание работы и требования" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Дедлайн *</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Макс. балл</label>
                  <input name="maxScore" type="number" value={form.maxScore} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input name="isTeamWork" type="checkbox" checked={form.isTeamWork} onChange={handleChange} className="w-4 h-4 rounded" />
                  Командная работа
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Теоретические материалы</label>
                <textarea name="theoryMaterials" value={form.theoryMaterials} onChange={handleChange} className="input-field" rows={2} placeholder="Ссылки на материалы, литература" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={createLabWork} className="btn-primary flex-1">Создать</button>
                <button onClick={() => setShowCreate(false)} className="btn-ghost flex-1">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
