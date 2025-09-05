import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  try {
    const { exp } = jwtDecode(token);
    if (exp < new Date().getTime() / 1000) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};

export const getRole = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    const { role } = jwtDecode(token);
    return role;
  } catch (e) {
    return null;
  }
};