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

  // Студенты для команд
  const [allStudents, setAllStudents] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(null); // lesson id
  const [teams, setTeams] = useState({}); // { teamName: [student] }
  const [newTeamName, setNewTeamName] = useState('');

  const [form, setForm] = useState({
    subject: '',
    lessonNumber: '',
    lessonType: 'lecture',
    topic: '',
    description: '',
    materials: '',
    materialsFile: null,
    isTeamWork: false,
    deadline: '',
    comment: '',
  });

  // Сообщения об ошибках
  const [addError, setAddError] = useState('');
  const [teamError, setTeamError] = useState('');

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

  // Загрузка студентов
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/api/teacher/students');
        setAllStudents(data.data);
      } catch (err) {
        console.error('Ошибка загрузки студентов:', err);
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'materialsFile') {
      setForm(f => ({ ...f, materialsFile: files[0] || null }));
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const addLesson = async () => {
    setAddError('');
    if (!form.topic.trim()) {
      setAddError('Введите тему занятия');
      return;
    }
    if (form.materialsFile && form.materialsFile.size > 10 * 1024 * 1024) {
      setAddError('Файл слишком большой (макс. 10 МБ)');
      return;
    }
    try {
      await api.post('/api/teacher/programs', {
        subject: form.subject,
        lessonNumber: parseInt(form.lessonNumber, 10) || program.length + 1,
        lessonType: form.lessonType,
        topic: form.topic,
        description: form.description || form.comment,
        materials: form.materials,
      });

      // Загрузить PDF если выбран
      if (form.materialsFile) {
        const { data: newProgram } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
        const lastLesson = newProgram.data[newProgram.data.length - 1];
        if (lastLesson) {
          const formData = new FormData();
          formData.append('file', form.materialsFile);
          await api.post(`/api/teacher/programs/${lastLesson.id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      setShowAdd(false);
      resetForm();
      const { data } = await api.get(`/api/teacher/programs/${encodeURIComponent(selectedSubject)}`);
      setProgram(data.data);
    } catch (err) {
      console.error('Ошибка добавления занятия:', err);
    }
  };

  const resetForm = () => {
    setForm(f => ({
      ...f, lessonNumber: '', topic: '', description: '', materials: '',
      materialsFile: null, isTeamWork: false, deadline: '', comment: '',
    }));
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

  // Команды
  const openTeamModal = (lessonId) => {
    setShowTeamModal(lessonId);
    setTeams({});
    setNewTeamName('');
  };

  const addTeam = () => {
    setTeamError('');
    if (!newTeamName.trim()) {
      setTeamError('Введите название команды');
      return;
    }
    if (teams[newTeamName.trim()]) {
      setTeamError('Команда с таким названием уже существует');
      return;
    }
    setTeams(t => ({ ...t, [newTeamName.trim()]: [] }));
    setNewTeamName('');
  };

  const assignStudent = (teamName, student) => {
    setTeamError('');
    if (!student.is_active) {
      setTeamError(`Нельзя добавить отчисленного студента: ${student.full_name}`);
      return;
    }
    setTeams(t => {
      // Удалить студента из других команд
      const updated = {};
      for (const [name, members] of Object.entries(t)) {
        updated[name] = members.filter(m => m.email !== student.email);
      }
      // Добавить в выбранную команду
      updated[teamName] = [...(updated[teamName] || []), student];
      return updated;
    });
  };

  const saveTeams = async () => {
    setTeamError('');
    const activeTeams = Object.entries(teams).filter(([_, members]) => members.length > 0);
    if (activeTeams.length === 0) {
      setTeamError('Создайте хотя бы одну команду с участниками');
      return;
    }
    try {
      for (const [teamName, members] of Object.entries(teams)) {
        for (const student of members) {
          await api.post('/api/teacher/teams', {
            labWorkId: showTeamModal,
            teamName,
            studentEmail: student.email,
            studentName: student.full_name,
          });
        }
      }
      setShowTeamModal(null);
      alert('Команды сохранены!');
    } catch (err) {
      setTeamError('Ошибка сохранения: ' + (err.response?.data?.error || err.message));
    }
  };

  const getLessonTypeLabel = (type) => LESSON_TYPES.find(t => t.value === type)?.label || type;

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
          <h1 className="text-2xl font-bold text-slate-900">Программы по предметам</h1>
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
        <div className="text-slate-400 text-center py-16"><p>Нет назначенных предметов</p></div>
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
                      <select value={lesson.lesson_type} onChange={(e) => updateLesson(lesson.id, { lessonType: e.target.value })} className="input-field text-sm">
                        {LESSON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Тема</label>
                      <input value={lesson.topic} onChange={(e) => updateLesson(lesson.id, { topic: e.target.value })} className="input-field text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Описание / Комментарий</label>
                    <textarea value={lesson.description || ''} onChange={(e) => updateLesson(lesson.id, { description: e.target.value })} className="input-field text-sm" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Материалы</label>
                    <textarea value={lesson.materials || ''} onChange={(e) => updateLesson(lesson.id, { materials: e.target.value })} className="input-field text-sm" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Прикрепить PDF</label>
                    <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => uploadFileToLesson(lesson.id, e.target.files[0])} className="text-sm" />
                  </div>
                  <button onClick={() => setEditingId(null)} className="btn-primary text-sm">Готово</button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">
                      {lesson.lesson_number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{lesson.topic}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLessonTypeColor(lesson.lesson_type)}`}>
                          {getLessonTypeLabel(lesson.lesson_type)}
                        </span>
                      </div>
                      {lesson.description && <p className="text-sm text-slate-600">{lesson.description}</p>}
                      {lesson.materials && <p className="text-xs text-slate-400 mt-1">📎 {lesson.materials}</p>}
                      {lesson.materials_file && (
                        <a
                          href={`http://localhost:5000${lesson.materials_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 mt-1 font-medium"
                        >
                          📄 Прикреплённый файл (PDF)
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setEditingId(lesson.id)} className="btn-ghost text-sm">Изменить</button>
                    <button onClick={() => removeLesson(lesson.id)} className="btn-danger text-sm">Удалить</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowAdd(false); setAddError(''); resetForm(); }}>
          <div className="card p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Добавить занятие</h2>
            {addError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{addError}</div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Номер</label>
                  <input name="lessonNumber" type="number" value={form.lessonNumber} onChange={handleChange} className="input-field" placeholder={String(program.length + 1)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Тип</label>
                  <select name="lessonType" value={form.lessonType} onChange={handleChange} className="input-field">
                    {LESSON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Тема *</label>
                <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="Тема занятия" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Описание / Комментарий</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Дедлайн</label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Прикрепить PDF / ТЗ</label>
                <input name="materialsFile" type="file" accept=".pdf,.doc,.docx,.zip" onChange={handleChange} className="text-sm" />
                {form.materialsFile && <p className="text-xs text-slate-500 mt-1">📎 {form.materialsFile.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Материалы (текст)</label>
                <textarea name="materials" value={form.materials} onChange={handleChange} className="input-field" rows={2} placeholder="Ссылки, литература" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={addLesson} className="btn-primary flex-1 flex items-center justify-center gap-2">Добавить</button>
                <button onClick={() => { setShowAdd(false); resetForm(); }} className="btn-ghost flex-1 flex items-center justify-center gap-2">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно команд */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTeamModal(null)}>
          <div className="card p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Настройка команд</h2>
            {teamError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{teamError}</div>
            )}

            {/* Создание команды */}
            <div className="flex gap-2 mb-4">
              <input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="input-field flex-1"
                placeholder="Название команды"
                onKeyDown={(e) => { if (e.key === 'Enter') addTeam(); }}
              />
              <button onClick={addTeam} className="btn-primary">+ Команда</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Команды */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Команды</h3>
                {Object.keys(teams).length === 0 ? (
                  <p className="text-sm text-slate-400">Создайте команду</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(teams).map(([teamName, members]) => (
                      <div key={teamName} className="bg-slate-50 rounded-lg p-3">
                        <div className="font-medium text-sm text-slate-800 mb-2">{teamName}</div>
                        {members.length === 0 ? (
                          <p className="text-xs text-slate-400">Перетащите студентов сюда</p>
                        ) : (
                          members.map(m => (
                            <div key={m.email} className="text-xs text-slate-600 py-0.5">{m.full_name}</div>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Студенты */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Студенты</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {allStudents.filter(s => s.is_active).map((student) => (
                    <div key={student.id} className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                      <span className="text-sm text-slate-700">{student.full_name}</span>
                      <select
                        className="text-xs border border-slate-200 rounded px-2 py-1"
                        onChange={(e) => {
                          if (e.target.value) assignStudent(e.target.value, student);
                          e.target.value = '';
                        }}
                        value=""
                      >
                        <option value="">В команду...</option>
                        {Object.keys(teams).map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {allStudents.filter(s => !s.is_active).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-400 mb-1">Отчисленные (не могут быть в командах):</p>
                      {allStudents.filter(s => !s.is_active).map((student) => (
                        <div key={student.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-slate-200 opacity-50">
                          <span className="text-sm text-slate-500 line-through">{student.full_name}</span>
                          <span className="text-xs text-red-400">Отчислен</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100">
              <button onClick={saveTeams} className="btn-primary flex-1 flex items-center justify-center gap-2">Сохранить команды</button>
              <button onClick={() => setShowTeamModal(null)} className="btn-ghost flex-1 flex items-center justify-center gap-2">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
