import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/token'; // Get the token

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
