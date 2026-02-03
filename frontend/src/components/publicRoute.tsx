import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function PublicRoute({ children }: { children?: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);

  // Jika user SUDAH login tapi mencoba akses halaman login,
  // lempar mereka masuk ke dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}