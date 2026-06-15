import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teacherSchedule } from './data';

const statusStyles = {
  finished: 'bg-slate-100 text-slate-400',
  current: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  upcoming: 'bg-white text-slate-600 border border-slate-200',
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const current = teacherSchedule.find((lesson) => lesson.status === 'current');

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-1">Сегодня, 14 июня</p>
          <h1 className="text-3xl font-bold text-slate-900">Здравствуйте, {user?.fullName || 'преподаватель'}</h1>
          <p className="text-slate-500 mt-1">На сегодня запланировано 4 занятия в трёх группах.</p>
        </div>
        <Link to="/journal" className="btn-primary">Открыть журнал</Link>
      </div>

      {current && (
        <section className="bg-indigo-600 text-white rounded-lg p-5 shadow-lg shadow-indigo-600/15">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">Идёт сейчас · до 12:10</div>
              <h2 className="text-xl font-bold text-white">{current.subject}</h2>
              <p className="text-indigo-100 mt-1">{current.type} · {current.group} · аудитория {current.room}</p>
            </div>
            <Link to="/journal" className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
              Отметить посещаемость
            </Link>
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold text-slate-900">Расписание на сегодня</h2>
            <span className="hidden sm:inline text-sm text-slate-400">Воскресенье</span>
          </div>
          <div className="card overflow-hidden">
            {teacherSchedule.map((lesson, index) => (
              <div key={lesson.id} className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 min-w-0 ${index ? 'border-t border-slate-100' : ''} ${lesson.status === 'finished' ? 'opacity-60' : ''}`}>
                <div className="w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm font-bold text-slate-700">{lesson.time}</div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${lesson.status === 'current' ? 'bg-emerald-500 ring-4 ring-emerald-100' : lesson.status === 'finished' ? 'bg-slate-300' : 'bg-indigo-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 break-words">{lesson.subject}</div>
                  <div className="text-sm text-slate-500">{lesson.type}</div>
                </div>
                <span className={`hidden min-[430px]:inline text-xs font-bold px-2.5 py-1 rounded-md flex-shrink-0 ${statusStyles[lesson.status]}`}>{lesson.group}</span>
                <span className="hidden sm:block text-sm text-slate-500 w-16 text-right flex-shrink-0">ауд. {lesson.room}</span>
              </div>
            ))}
          </div>
        </section>

        <aside>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Требуют внимания</h2>
          <div className="card p-4 space-y-4">
            <Link to="/submissions" className="flex gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">7</div>
              <div>
                <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">Новые работы</div>
                <div className="text-xs text-slate-400">Ожидают проверки</div>
              </div>
            </Link>
            <Link to="/program" className="flex gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">2</div>
              <div>
                <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">Дедлайны на неделе</div>
                <div className="text-xs text-slate-400">18 и 22 июня</div>
              </div>
            </Link>
            <Link to="/journal" className="flex gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">2</div>
              <div>
                <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">Новые студенты</div>
                <div className="text-xs text-slate-400">В группе ИС-31</div>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
