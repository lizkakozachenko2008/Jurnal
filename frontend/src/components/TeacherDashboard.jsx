import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, scheduleRes] = await Promise.all([
          api.get('/api/teacher/subjects'),
          api.get('/api/teacher/schedule'),
        ]);
        setSubjects(subjectsRes.data.data);
        setSchedule(scheduleRes.data.data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Группируем предметы по группам
  const groupedSubjects = subjects.reduce((acc, s) => {
    const key = `${s.subject} — ${s.group_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  // Расписание на сегодня
  const today = new Date().getDay();
  const todaySchedule = schedule.filter(s => s.day_of_week === today);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Добро пожаловать, {user?.fullName || 'Преподаватель'}!
        </h1>
        <p className="text-slate-500 mt-1">Панель управления преподавателя</p>
      </div>

      {/* Быстрые ссылки */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Link to="/teacher/schedule" className="card card-accent group p-6 hover:-translate-y-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Расписание</h2>
          <p className="text-sm text-slate-500">Ваше расписание занятий</p>
        </Link>

        <Link to="/teacher/lab-works" className="card card-accent group p-6 hover:-translate-y-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.882.177A10.463 10.463 0 0112 21a10.463 10.463 0 01-6.237-1.714l-.845-.253c-1.67-.496-2.28-2.39-1.044-3.633L5 14.5" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Лабораторные</h2>
          <p className="text-sm text-slate-500">Управление лабораторными работами</p>
        </Link>

        <Link to="/teacher/programs" className="card card-accent group p-6 hover:-translate-y-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Программы</h2>
          <p className="text-sm text-slate-500">Программы по предметам</p>
        </Link>

        <Link to="/teacher/submissions" className="card card-accent group p-6 hover:-translate-y-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Сдачи работ</h2>
          <p className="text-sm text-slate-500">Проверка лабораторных работ</p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Расписание на сегодня */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Сегодня
          </h2>
          {todaySchedule.length === 0 ? (
            <p className="text-slate-400 text-sm">Нет занятий на сегодня</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="flex flex-col items-center w-16">
                    <span className="text-sm font-bold text-indigo-600">{s.start_time}</span>
                    <div className="w-px h-2 bg-slate-300 my-0.5" />
                    <span className="text-sm font-bold text-slate-400">{s.end_time}</span>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{s.subject}</div>
                    <div className="text-sm text-slate-500">{s.group_name} • каб. {s.classroom}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Предметы и группы */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            Ваши предметы
          </h2>
          {Object.keys(groupedSubjects).length === 0 ? (
            <p className="text-slate-400 text-sm">Нет назначенных предметов</p>
          ) : (
            <div className="space-y-2">
              {Object.keys(groupedSubjects).map((key) => (
                <Link
                  key={key}
                  to={`/teacher/journal/${encodeURIComponent(groupedSubjects[key][0].subject)}/${encodeURIComponent(groupedSubjects[key][0].group_name)}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <span className="font-medium text-slate-800">{key}</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
