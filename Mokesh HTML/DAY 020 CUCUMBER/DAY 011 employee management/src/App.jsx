import React, { useState } from 'react';
import EmployeeDashboard from './components/EmployeeDashboard';
import LoginPage from './components/LoginPage';
function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('portal_role') || null;
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('portal_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (selectedRole, user) => {
    setRole(selectedRole);
    setCurrentUser(user);
    localStorage.setItem('portal_role', selectedRole);
    if (user) {
      localStorage.setItem('portal_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('portal_current_user');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.removeItem('portal_role');
    localStorage.removeItem('portal_current_user');
  };

  return (
    role ? (
      <EmployeeDashboard role={role} currentUser={currentUser} onLogout={handleLogout} />
    ) : (
      <LoginPage onLogin={handleLogin} />
    )
  );
}

export default App;
