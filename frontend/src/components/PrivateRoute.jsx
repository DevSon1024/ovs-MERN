import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

const PrivateRoute = ({ children, role }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (role && getRole() !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;