import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: 'Расписание',
      description: 'Просмотр расписания занятий по дням недели',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      link: '/schedule',
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
    },
    {
      title: 'Оценки',
      description: 'Ваши оценки по всем предметам',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      link: '/grades',
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
    },
    {
      title: 'Лабораторные',
      description: 'Список лабораторных работ и дедлайны',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.882.177A10.463 10.463 0 0112 21a10.463 10.463 0 01-6.237-1.714l-.845-.253c-1.67-.496-2.28-2.39-1.044-3.633L5 14.5" />
        </svg>
      ),
      link: '/lab-works',
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/20',
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Добро пожаловать, {user?.fullName || 'Студент'}!
        </h1>
        <p className="text-slate-500 mt-1">
          Группа: {user?.groupName || 'не указана'}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.link}
            to={card.link}
            className="card card-accent group p-6 hover:-translate-y-1"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} ${card.shadow} shadow-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {card.title}
            </h2>
            <p className="text-sm text-slate-500">{card.description}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Открыть
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
