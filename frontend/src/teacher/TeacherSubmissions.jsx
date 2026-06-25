import { useState } from 'react';
import { submissions as initialSubmissions } from './data';

export default function TeacherSubmissions() {
  const [items, setItems] = useState(initialSubmissions);
  const [filter, setFilter] = useState('review');
  const [review, setReview] = useState(null);
  const visible = items.filter((item) => filter === 'all' || item.status === filter);

  const saveReview = (event) => {
    event.preventDefault();
    if (!/^\d+$/.test(review.grade) || Number(review.grade) < 1 || Number(review.grade) > 10) return;
    setItems((current) => current.map((item) => item.id === review.id ? { ...review, status: 'checked' } : item));
    setReview(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Сдача лабораторных</h1>
        <p className="text-sm text-slate-500 mt-1">Работы студентов, файлы и результаты проверки</p>
      </div>

      <div className="flex gap-2">
        {[['review', 'На проверке'], ['checked', 'Проверенные'], ['all', 'Все работы']].map(([value, label]) => (
          <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === value ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{label}</button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left px-4 py-3 text-xs text-slate-500">Студент</th><th className="text-left px-4 py-3 text-xs text-slate-500">Работа</th><th className="text-left px-4 py-3 text-xs text-slate-500">Отправлено</th><th className="text-left px-4 py-3 text-xs text-slate-500">Файл</th><th className="text-left px-4 py-3 text-xs text-slate-500">Результат</th><th /></tr></thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-b last:border-0 border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-4"><div className="text-sm font-semibold text-slate-900">{item.student}</div><div className="text-xs text-slate-400">{item.group}</div></td>
                <td className="px-4 py-4 text-sm text-slate-700">{item.lab}</td>
                <td className="px-4 py-4"><div className="text-sm text-slate-600">{item.submitted}</div><div className={`text-xs ${item.timing.includes('позже') ? 'text-red-500' : 'text-emerald-600'}`}>{item.timing}</div></td>
                <td className="px-4 py-4"><a href={item.file.startsWith('github') ? `https://${item.file}` : '#'} className="text-sm font-semibold text-indigo-600 hover:underline">{item.file}</a></td>
                <td className="px-4 py-4">{item.status === 'checked' ? <span className="inline-flex w-8 h-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 font-bold">{item.grade}</span> : <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">Ожидает</span>}</td>
                <td className="px-4 py-4 text-right"><button onClick={() => setReview({ ...item })} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">{item.status === 'checked' ? 'Изменить' : 'Проверить'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {review && (
        <div className="modal-backdrop" onMouseDown={() => setReview(null)}>
          <form onSubmit={saveReview} onMouseDown={(event) => event.stopPropagation()} className="modal-panel max-w-lg">
            <h2 className="text-lg font-bold text-slate-900">{review.student}</h2>
            <p className="text-sm text-slate-500 mt-1">{review.lab}</p>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center justify-between"><span className="text-sm text-slate-600">{review.file}</span><a href={review.file.startsWith('github') ? `https://${review.file}` : '#'} className="text-sm font-bold text-indigo-600">Открыть</a></div>
            <label className="block text-sm font-semibold text-slate-700 mt-4 mb-1">Оценка от 1 до 10</label>
            <input inputMode="numeric" className="input-field" value={review.grade} onChange={(event) => setReview({ ...review, grade: event.target.value.replace(/\D/g, '').slice(0, 2) })} />
            <label className="block text-sm font-semibold text-slate-700 mt-3 mb-1">Комментарий преподавателя</label>
            <textarea className="input-field min-h-28" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} placeholder="Что исправить или что выполнено хорошо" />
            <div className="flex justify-end gap-2 mt-5"><button type="button" className="btn-ghost" onClick={() => setReview(null)}>Отмена</button><button className="btn-primary">Сохранить результат</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
