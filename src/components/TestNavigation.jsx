// Test component to verify role-based navigation
// This can be removed after testing

import { getCurrentUser, getUserRole, navigateToDashboard } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const TestNavigation = () => {
  const navigate = useNavigate();
  
  const testNavigation = () => {
    const user = getCurrentUser();
    const role = getUserRole();
    
    console.log('Current user:', user);
    console.log('User role:', role);
    
    navigateToDashboard(navigate);
  };
  
  return (
    <div>
      <button onClick={testNavigation}>Test Role-Based Navigation</button>
    </div>
  );
};

export default TestNavigation;
