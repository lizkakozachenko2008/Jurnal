import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Grades from './components/Grades';
import SubjectGrades from './components/SubjectGrades';
import LabWorks from './components/LabWorks';
import ProtectedRoute from './components/ProtectedRoute';
// Teacher components
import TeacherDashboard from './components/TeacherDashboard';
import TeacherSchedule from './components/TeacherSchedule';
import TeacherJournal from './components/TeacherJournal';
import TeacherLabWorks from './components/TeacherLabWorks';
import TeacherPrograms from './components/TeacherPrograms';
import TeacherSubmissions from './components/TeacherSubmissions';

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  return (
    <Routes>
      {/* Авторизация */}
      <Route
        path="/login"
        element={user ? <Navigate to={isTeacher ? '/teacher' : '/'} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={isTeacher ? '/teacher' : '/'} replace /> : <Register />}
      />

      {/* === МАРШРУТЫ ПРЕПОДАВАТЕЛЯ === */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout><TeacherDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/schedule"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout><TeacherSchedule /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/journal/:subject/:groupName"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout><TeacherJournal /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/lab-works"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout><TeacherLabWorks /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/programs"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout><TeacherPrograms /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout><TeacherSubmissions /></Layout>
          </ProtectedRoute>
        }
      />

      {/* === МАРШРУТЫ СТУДЕНТА === */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><Schedule /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><Grades /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades/:subject"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><SubjectGrades /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab-works"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><LabWorks /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Редирект */}
      <Route path="*" element={<Navigate to={isTeacher ? '/teacher' : '/'} replace />} />
    </Routes>
  );
}
