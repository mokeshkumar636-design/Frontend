import React, { useState } from 'react';
import { Briefcase, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [loginRole, setLoginRole] = useState('admin'); // 'admin' or 'employee'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (loginRole === 'admin') {
        if (username.trim() === 'admin' && password === 'admin123') {
          onLogin('admin', null);
        } else {
          setError('Invalid admin credentials');
          setLoading(false);
        }
      } else {
        // Employee Login
        const stored = localStorage.getItem('employees_list');
        const employeeList = stored ? JSON.parse(stored) : [];
        
        // Find employee by ID or Email
        const employee = employeeList.find(emp => 
          emp.id.toLowerCase() === username.trim().toLowerCase() ||
          emp.email.toLowerCase() === username.trim().toLowerCase()
        );

        if (employee && password === 'employee123') {
          onLogin('employee', employee);
        } else {
          setError('Invalid Employee ID/Email or password');
          setLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="login-container">
      {/* Background Glow effects */}
      <div className="bg-glow-effect bg-glow-top-right" style={{ opacity: 0.15 }}></div>
      <div className="bg-glow-effect bg-glow-bottom-left" style={{ opacity: 0.15 }}></div>

      <div className="login-card">
        <div className="login-logo-container">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #e53e3e, #3182ce)' }}>
            <Briefcase size={22} />
          </div>
          <span className="login-logo-text" style={{ fontWeight: '800' }}>CR7 Sports Portal</span>
        </div>

        {/* Dual Role Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)', 
          marginTop: '0.5rem',
          marginBottom: '0.75rem' 
        }}>
          <button 
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: loginRole === 'admin' ? 'var(--accent-primary)' : 'var(--text-muted)',
              borderBottom: loginRole === 'admin' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => { setLoginRole('admin'); setError(''); setUsername(''); setPassword(''); }}
          >
            Admin Sign-in
          </button>
          <button 
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: loginRole === 'employee' ? 'var(--accent-primary)' : 'var(--text-muted)',
              borderBottom: loginRole === 'employee' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => { setLoginRole('employee'); setError(''); setUsername(''); setPassword(''); }}
          >
            Employee Sign-in
          </button>
        </div>

        <div className="login-header" style={{ marginBottom: '0.5rem' }}>
          <h2>{loginRole === 'admin' ? 'Admin Portal' : 'Employee Portal'}</h2>
          <p>
            {loginRole === 'admin' 
              ? 'Enter administrative system credentials' 
              : 'Enter Employee ID or email to access your workspace'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="username">
              {loginRole === 'admin' ? 'Admin Username' : 'Employee ID / Email'}
            </label>
            <div className="login-input-wrapper">
              <User className="input-icon" size={16} />
              <input
                type="text"
                id="username"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={loginRole === 'admin' ? 'e.g. admin' : 'e.g. EMP-1001 or name@company.com'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                type="password"
                id="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={loginRole === 'admin' ? 'Enter admin123' : 'Enter employee123'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            style={{ width: '100%', justifyContent: 'center', height: '42px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <span>CR7 Sports HR Management Systems</span>
        </div>
      </div>
    </div>
  );
}
