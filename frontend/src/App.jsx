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
import TeacherDashboard from './teacher/TeacherDashboard';
import TeacherJournal from './teacher/TeacherJournal';
import TeacherProgram from './teacher/TeacherProgram';
import TeacherSubmissions from './teacher/TeacherSubmissions';

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
  const isTeacher = user?.role === 'teacher' || user?.role === 'преподаватель';

  const protectedPage = (studentComponent, teacherComponent = null) => (
    <ProtectedRoute>
      <Layout>{isTeacher && teacherComponent ? teacherComponent : studentComponent}</Layout>
    </ProtectedRoute>
  );

  const teacherPage = (component) => (
    <ProtectedRoute>
      {isTeacher ? <Layout>{component}</Layout> : <Navigate to="/" replace />}
    </ProtectedRoute>
  );

  const studentPage = (component) => (
    <ProtectedRoute>
      {!isTeacher ? <Layout>{component}</Layout> : <Navigate to="/" replace />}
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/"
        element={protectedPage(<Dashboard />, <TeacherDashboard />)}
      />
      <Route
        path="/schedule"
        element={studentPage(<Schedule />)}
      />
      <Route
        path="/grades"
        element={studentPage(<Grades />)}
      />
      <Route
        path="/grades/:subject"
        element={studentPage(<SubjectGrades />)}
      />
      <Route
        path="/lab-works"
        element={studentPage(<LabWorks />)}
      />
      <Route path="/journal" element={teacherPage(<TeacherJournal />)} />
      <Route path="/program" element={teacherPage(<TeacherProgram />)} />
      <Route path="/submissions" element={teacherPage(<TeacherSubmissions />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
