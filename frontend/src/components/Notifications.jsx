import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Загрузить ID прочитанных уведомлений из localStorage
  const getReadIds = () => {
    try {
      const key = `notif_read_${user?.email}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  };

  const saveReadIds = (ids) => {
    try {
      const key = `notif_read_${user?.email}`;
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {}
  };

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'teacher' ? '/api/teacher/notifications' : '/api/student/notifications';
      const { data } = await api.get(endpoint);
      if (data.success) {
        const readIds = getReadIds();
        const notifs = data.data.map(n => ({ ...n, read: readIds.includes(n.id) }));
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      }
    } catch (err) {
      // silently fail
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    const readIds = getReadIds();
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    saveReadIds([...getReadIds(), ...allIds.filter(id => !getReadIds().includes(id))]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setShowDropdown(!showDropdown); }}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Уведомления</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Прочитать все
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400 text-sm">
                Нет уведомлений
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !notif.read ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      !notif.read ? 'bg-indigo-500' : 'bg-transparent'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(notif.date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
