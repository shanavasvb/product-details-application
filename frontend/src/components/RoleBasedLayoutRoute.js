// components/RoleBasedLayoutRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import EmployeeLayoutWithHover from './EmployeeLayout';

const RoleBasedLayoutRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const Layout = user.is_admin ? AdminLayout : EmployeeLayoutWithHover;

  return <Layout>{children}</Layout>;
};

export default RoleBasedLayoutRoute;
