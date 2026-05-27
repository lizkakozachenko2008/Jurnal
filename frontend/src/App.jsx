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
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Layout><Schedule /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <ProtectedRoute>
            <Layout><Grades /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades/:subject"
        element={
          <ProtectedRoute>
            <Layout><SubjectGrades /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab-works"
        element={
          <ProtectedRoute>
            <Layout><LabWorks /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
