// Authentication utility functions for React frontend

export const getCurrentUser = () => {
  try {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const requireAuth = (navigate) => {
  const user = getCurrentUser();
  if (!user) {
    navigate('/login');
    return false;
  }
  return true;
};

export const getUserId = () => {
  const user = getCurrentUser();
  return user ? user.user_id : null;
};

export const getUserDisplayName = () => {
  const user = getCurrentUser();
  return user ? (user.name || user.username) : 'User';
};

export const getUsername = () => {
  const user = getCurrentUser();
  return user ? user.username : null;
};

export const storeUserData = (userData) => {
  try {
    sessionStorage.setItem('userData', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

export const logout = () => {
  try {
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

export const navigateToDashboard = (navigate) => {
  const user = getCurrentUser();
  if (user) {
    if (user.role_id === 1) {
      navigate('/admin-dashboard');
    } else if (user.role_id === 2) {
      navigate('/student-dashboard');
    } else {
      navigate('/dashboard');
    }
  } else {
    navigate('/login');
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const hasRole = (roleId) => {
  const user = getCurrentUser();
  return user && user.role_id === roleId;
};