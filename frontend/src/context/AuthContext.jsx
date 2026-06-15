import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

function mapUser(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    email: raw.email,
    fullName: raw.full_name || raw.fullName || '',
    role: raw.role || 'student',
    groupName: raw.group_name || raw.groupName || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    const { token, user: rawUser } = data.data;
    const mapped = mapUser(rawUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mapped));
    setUser(mapped);
    return data;
  };

  const register = async (email, password, fullName, groupName) => {
    const { data } = await api.post('/api/auth/register', {
      email,
      password,
      fullName,
      groupName,
    });
    const { token, user: rawUser } = data.data;
    const mapped = mapUser(rawUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mapped));
    setUser(mapped);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const loginAsTeacher = () => {
    const teacher = {
      id: 'teacher-demo',
      email: 'teacher@demo.local',
      fullName: 'Анна Сергеевна',
      role: 'teacher',
      groupName: '',
    };

    localStorage.setItem('token', 'teacher-demo-token');
    localStorage.setItem('user', JSON.stringify(teacher));
    setUser(teacher);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsTeacher, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
