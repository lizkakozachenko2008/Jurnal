import { useState, useEffect } from 'react';
import api from '../api/axios';

const LESSON_TYPES = [
  { value: 'lecture', label: 'Лекция' },
  { value: 'practice', label: 'Практика' },
  { value: 'lab', label: 'Лабораторная' },
  { value: 'test', label: 'Контрольная' },
  { value: 'exam', label: 'Экзамен' },
  { value: 'quiz', label: 'Опрос' },
];

export default function TeacherPrograms() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    subject: '',
    lessonNumber: '',
    lessonType: 'lecture',
    topic: '',
    description: '',
    materials: '',
  });

  // Загрузка предметов преподавателя
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get('/api/teacher/subjects');
        const uniqueSubjects = [...new Set(data.data.map(s => s.subject))];
        setSubjects(uniqueSubjects);
        if (uniqueSubjects.length > 0) {
          setSelectedSubject(uniqueSubjects[0]);
          setForm(f => ({ ...f, subject: uniqueSubjects[0] }));
        }
      } catch (err) {
        console.error('Ошибка загрузки предметов:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Загрузка программы по выбранному предмету
  useEffect(() => {
    if (!selectedSubject) return;
    const fetchProgram = async () => {
      try {
        const { data } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
        setProgram(data.data);
      } catch (err) {
        console.error('Ошибка загрузки программы:', err);
      }
    };
    fetchProgram();
  }, [selectedSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const addLesson = async () => {
    if (!form.topic) return;
    try {
      await api.post('/api/teacher/programs', {
        ...form,
        lessonNumber: parseInt(form.lessonNumber, 10) || program.length + 1,
      });
      setShowAdd(false);
      setForm(f => ({ ...f, lessonNumber: '', topic: '', description: '', materials: '' }));
      // Перезагрузить программу
      const { data } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
      setProgram(data.data);
    } catch (err) {
      console.error('Ошибка добавления занятия:', err);
    }
  };

  const updateLesson = async (id, updates) => {
    try {
      await api.put(`/api/teacher/programs/${id}`, updates);
      const { data } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
      setProgram(data.data);
      setEditingId(null);
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const removeLesson = async (id) => {
    if (!confirm('Удалить занятие из программы?')) return;
    try {
      await api.delete(`/api/teacher/programs/${id}`);
      const { data } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
      setProgram(data.data);
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  // Загрузить PDF к существующему занятию
  const uploadFileToLesson = async (lessonId, file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/api/teacher/programs/${lessonId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { data } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
      setProgram(data.data);
    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
    }
  };

  const getLessonTypeLabel = (type) => {
    return LESSON_TYPES.find(t => t.value === type)?.label || type;
  };

  const getLessonTypeColor = (type) => {
    const colors = {
      lecture: 'bg-blue-100 text-blue-700',
      practice: 'bg-emerald-100 text-emerald-700',
      lab: 'bg-purple-100 text-purple-700',
      test: 'bg-red-100 text-red-700',
      exam: 'bg-orange-100 text-orange-700',
      quiz: 'bg-amber-100 text-amber-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Программы по предметам</h1>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary" disabled={!selectedSubject}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Добавить занятие
        </button>
      </div>

      {/* Выбор предмета */}
      {subjects.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="text-slate-400 text-center py-16">
          <p>Нет назначенных предметов</p>
        </div>
      ) : program.length === 0 ? (
        <div className="text-slate-400 text-center py-16">
          <p>Программа по предмету «{selectedSubject}» пуста. Добавьте занятия!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {program.map((lesson) => (
            <div key={lesson.id} className="card p-5">
              {editingId === lesson.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Тип</label>
                      <select
                        value={lesson.lesson_type}
                        onChange={(e) => updateLesson(lesson.id, { lessonType: e.target.value })}
                        className="input-field text-sm"
                      >
                        {LESSON_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Тема</label>
                      <input
                        value={lesson.topic}
                        onChange={(e) => updateLesson(lesson.id, { topic: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Описание</label>
                    <textarea
                      value={lesson.description || ''}
                      onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                      className="input-field text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Материалы</label>
                    <textarea
                      value={lesson.materials || ''}
                      onChange={(e) => updateLesson(lesson.id, { materials: e.target.value })}
                      className="input-field text-sm"
                      rows={2}
                    />
                  </div>
                  <button onClick={() => setEditingId(null)} className="btn-primary text-sm">Готово</button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">
                      {lesson.lesson_number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{lesson.topic}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLessonTypeColor(lesson.lesson_type)}`}>
                          {getLessonTypeLabel(lesson.lesson_type)}
                        </span>
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-slate-600">{lesson.description}</p>
                      )}
                      {lesson.materials && (
                        <p className="text-xs text-slate-400 mt-1">📎 {lesson.materials}</p>
                      )}
                      {/* Кнопка загрузки файла */}
                      <div className="mt-2">
                        <label className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                uploadFileToLesson(lesson.id, e.target.files[0]);
                              }
                              e.target.value = '';
                            }}
                          />
                          📎 Загрузить материалы
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingId(lesson.id)}
                      className="btn-ghost text-sm"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => removeLesson(lesson.id)}
                      className="btn-danger text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Добавить занятие</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Номер</label>
                  <input name="lessonNumber" type="number" value={form.lessonNumber} onChange={handleChange} className="input-field" placeholder={String(program.length + 1)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Тип</label>
                  <select name="lessonType" value={form.lessonType} onChange={handleChange} className="input-field">
                    {LESSON_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Тема *</label>
                <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="Тема занятия" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Описание</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Материалы</label>
                <textarea name="materials" value={form.materials} onChange={handleChange} className="input-field" rows={2} placeholder="Ссылки, литература" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={addLesson} className="btn-primary flex-1">Добавить</button>
                <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}