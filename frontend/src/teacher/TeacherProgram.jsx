import { useState } from 'react';
import { programItems as initialItems } from './data';

const typeStyles = {
  Теория: 'bg-blue-50 text-blue-700',
  Практика: 'bg-emerald-50 text-emerald-700',
  Лабораторная: 'bg-purple-50 text-purple-700',
  Контрольная: 'bg-red-50 text-red-700',
};

export default function TeacherProgram() {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState(null);

  const save = (event) => {
    event.preventDefault();
    setItems((current) => current.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Программа по предмету</h1>
          <p className="text-sm text-slate-500 mt-1">Веб-программирование · ИС-31 · весенний семестр</p>
        </div>
        <button className="btn-primary" onClick={() => setItems((current) => [...current, { id: Date.now(), number: current.length + 1, title: 'Новое занятие', type: 'Практика', deadline: '', comment: '', file: '', team: false }])}>+ Добавить тему</button>
      </div>

      <div className="flex gap-5 text-sm text-slate-500 border-b border-slate-200 pb-3">
        <span><b className="text-slate-900">{items.length}</b> занятий</span>
        <span><b className="text-slate-900">{items.filter((item) => item.deadline).length}</b> дедлайна</span>
        <span><b className="text-slate-900">{items.filter((item) => item.team).length}</b> командная работа</span>
      </div>

      <div className="card overflow-hidden">
        {items.map((item, index) => (
          <div key={item.id} className={`grid md:grid-cols-[48px_1fr_150px_120px_44px] gap-3 items-center px-4 py-4 ${index ? 'border-t border-slate-100' : ''}`}>
            <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold">{item.number}</div>
            <div>
              <div className="font-semibold text-slate-900">{item.title}</div>
              <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-slate-400">
                {item.comment && <span>{item.comment}</span>}
                {item.file && <span className="text-indigo-600 font-medium">Файл: {item.file}</span>}
                {item.team && <span className="text-amber-700 bg-amber-50 px-1.5 rounded">Команда: 2 человека</span>}
              </div>
            </div>
            <span className={`justify-self-start text-xs font-bold px-2.5 py-1 rounded-md ${typeStyles[item.type]}`}>{item.type}</span>
            <div className="text-sm text-slate-500">{item.deadline ? new Date(item.deadline).toLocaleDateString('ru-RU') : 'Без срока'}</div>
            <button title="Редактировать" onClick={() => setEditing({ ...item })} className="w-9 h-9 rounded-md text-slate-400 hover:bg-slate-100 hover:text-indigo-600">✎</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className="modal-panel max-w-lg">
            <h2 className="text-lg font-bold text-slate-900">Настройка занятия</h2>
            <label className="block text-sm font-semibold text-slate-700 mt-4 mb-1">Название</label>
            <input className="input-field" value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Тип</label><select className="input-field" value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value })}><option>Теория</option><option>Практика</option><option>Лабораторная</option><option>Контрольная</option></select></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Дедлайн</label><input type="date" className="input-field" value={editing.deadline} onChange={(event) => setEditing({ ...editing, deadline: event.target.value })} /></div>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mt-3 mb-1">Комментарий</label>
            <textarea className="input-field min-h-20" value={editing.comment} onChange={(event) => setEditing({ ...editing, comment: event.target.value })} />
            <label className="block text-sm font-semibold text-slate-700 mt-3 mb-1">Файл задания</label>
            <input className="input-field" value={editing.file} onChange={(event) => setEditing({ ...editing, file: event.target.value })} placeholder="Название файла или ссылка" />
            <label className="flex items-center gap-2 mt-4 text-sm font-medium text-slate-700"><input type="checkbox" checked={editing.team} onChange={(event) => setEditing({ ...editing, team: event.target.checked })} /> Командная работа</label>
            <div className="flex justify-end gap-2 mt-5"><button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Отмена</button><button className="btn-primary">Сохранить</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
