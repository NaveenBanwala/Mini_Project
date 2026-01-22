import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Unauthorized from './pages/Unauthorized';
import MenteeDashboard from './Pages/mentee/MenteeDashboard';
import ParentDashboard from './Pages/parent/ParentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role: Mentee (Admin/Mentor) */}
         <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
  <Route path="/mentee/dashboard" element={<MenteeDashboard />} />
</Route>

          {/* Role: Parent */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;