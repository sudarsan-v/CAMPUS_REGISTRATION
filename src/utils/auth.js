// Authentication utility functions

// Get current user from sessionStorage
export const getCurrentUser = () => {
  try {
    const storedUser = sessionStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing user data from sessionStorage:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return user && user.user_id;
};

// Redirect to login if not authenticated
export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/';
    return false;
  }
  return true;
};

// Clear user session and logout
export const logout = () => {
  sessionStorage.removeItem('authUser');
  window.location.href = '/';
};

// Store user data after successful login
export const storeUserData = (userData) => {
  try {
    sessionStorage.setItem('authUser', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

// Get user display name
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  return user ? (user.name || user.username || 'User') : 'User';
};

// Get user ID
export const getUserId = () => {
  const user = getCurrentUser();
  return user ? user.user_id : null;
};

// Get username
export const getUsername = () => {
  const user = getCurrentUser();
  return user ? user.username : null;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role_id : null;
};

// Navigate to dashboard based on user role
export const navigateToDashboard = (navigate) => {
  const role = getUserRole();
  console.log('Navigating based on role:', role);
  
  if (role === 2) {
    // Student role - navigate to student dashboard
    navigate('/dashboard');
  } else if (role === 1) {
    // Admin/Teacher role - navigate to campus selection
    navigate('/campus');
  } else {
    // Default fallback
    navigate('/campus');
  }
};
