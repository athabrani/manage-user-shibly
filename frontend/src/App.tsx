import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/DashboardPage';
import Users from './pages/UsersPage';
import Members from './pages/MemberPages';
import Layout from './components/Layout'; 
import ProtectedRoute from './components/protectedRoute';
import PublicRoute from './components/publicRoute';
import RegisterMember from './pages/RegisterMember';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />


        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/register" element={<RegisterMember />} />
          <Route path="/members" element={<Members />} />
        </Route>

    
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;