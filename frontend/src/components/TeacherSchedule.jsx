import { useState, useEffect } from 'react';
import api from '../api/axios';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const DAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await api.get('/api/teacher/schedule');
        setSchedule(data.data);
      } catch (err) {
        setError('Не удалось загрузить расписание');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const scheduleByDay = DAYS.map((day, index) => ({
    day,
    short: DAY_SHORT[index],
    items: schedule.filter((s) => s.day_of_week === index + 1),
  }));

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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Моё расписание</h1>
      </div>

      <div className="space-y-4">
        {scheduleByDay.map(({ day, short, items }) => (
          <div key={day} className="card overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60 flex items-center gap-3">
              <span className="text-sm font-bold text-slate-400 w-8">{short}</span>
              <h2 className="font-semibold text-slate-800">{day}</h2>
              {items.length > 0 && (
                <span className="ml-auto text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {items.length}
                </span>
              )}
            </div>
            {items.length === 0 ? (
              <div className="px-5 py-4 text-slate-400 text-sm">Нет занятий</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col items-center w-20">
                      <span className="text-sm font-bold text-indigo-600">{item.start_time}</span>
                      <div className="w-px h-2 bg-slate-300 my-0.5" />
                      <span className="text-sm font-bold text-slate-400">{item.end_time}</span>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">{item.subject}</div>
                      <div className="text-sm text-slate-500">{item.group_name}</div>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {item.classroom}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
