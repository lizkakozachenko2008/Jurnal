import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function LabWorks() {
  const [labWorks, setLabWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchLabWorks = async () => {
      try {
        const { data } = await api.get('/api/student/lab-works');
        setLabWorks(data.data);
      } catch (err) {
        setError('Не удалось загрузить лабораторные работы');
      } finally {
        setLoading(false);
      }
    };
    fetchLabWorks();
  }, []);

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.882.177A10.463 10.463 0 0112 21a10.463 10.463 0 01-6.237-1.714l-.845-.253c-1.67-.496-2.28-2.39-1.044-3.633L5 14.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Лабораторные работы</h1>
      </div>

      {labWorks.length === 0 ? (
        <div className="text-slate-400 text-center py-16">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.882.177A10.463 10.463 0 0112 21a10.463 10.463 0 01-6.237-1.714l-.845-.253c-1.67-.496-2.28-2.39-1.044-3.633L5 14.5" />
          </svg>
          <p>Лабораторных работ нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {labWorks.map((lab) => {
            const overdue = isOverdue(lab.due_date);
            return (
              <div
                key={lab.id}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === lab.id ? null : lab.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    overdue
                      ? 'bg-red-50 text-red-500'
                      : 'bg-purple-50 text-purple-500'
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.882.177A10.463 10.463 0 0112 21a10.463 10.463 0 01-6.237-1.714l-.845-.253c-1.67-.496-2.28-2.39-1.044-3.633L5 14.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900">{lab.title}</h2>
                    <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-medium">{lab.subject}</span>
                      <span>{lab.teacher_name}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-semibold ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                      {new Date(lab.due_date).toLocaleDateString('ru-RU')}
                    </div>
                    {overdue && (
                      <div className="text-xs text-red-500 font-medium mt-0.5">Просрочено</div>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${expandedId === lab.id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedId === lab.id && lab.description && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mt-4 leading-relaxed">{lab.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        Макс. балл: {lab.max_score || 100}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
