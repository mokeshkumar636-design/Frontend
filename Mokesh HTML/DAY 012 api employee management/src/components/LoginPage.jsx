import React, { useState, useEffect } from 'react';
import { Briefcase, Lock, User, AlertCircle, Eye, EyeOff, Shield, Users, TrendingUp, Award } from 'lucide-react';

const BRAND_STATS = [
  { icon: <Users size={18} />, value: '500+', label: 'Employees Managed' },
  { icon: <TrendingUp size={18} />, value: '99.9%', label: 'System Uptime' },
  { icon: <Award size={18} />, value: '8+', label: 'Departments' },
];

export default function LoginPage({ onLogin }) {
  const [loginRole, setLoginRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Animated particles
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 6,
      dur: 6 + Math.random() * 10,
      delay: Math.random() * 5,
      opacity: 0.08 + Math.random() * 0.14,
    }))
  );

  const switchRole = (role) => {
    setLoginRole(role);
    setError('');
    setUsername('');
    setPassword('');
    setAnimKey(k => k + 1);
  };

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
          setError('Invalid admin credentials. Try admin / admin123');
          setLoading(false);
        }
      } else {
        const stored = localStorage.getItem('employees_list');
        const employeeList = stored ? JSON.parse(stored) : [];
        const employee = employeeList.find(emp =>
          emp.id.toLowerCase() === username.trim().toLowerCase() ||
          emp.email.toLowerCase() === username.trim().toLowerCase()
        );
        if (employee && password === 'employee123') {
          onLogin('employee', employee);
        } else {
          setError('Invalid Employee ID/Email or password. Try EMP-1001 / employee123');
          setLoading(false);
        }
      }
    }, 900);
  };

  return (
    <div className="login-split-container">
      {/* ---- Left Branding Panel ---- */}
      <div className="login-brand-panel">
        {/* Animated particles */}
        <svg className="login-particles" viewBox="0 0 100 100" preserveAspectRatio="none">
          {particles.map(p => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.size * 0.3}
              fill="white"
              opacity={p.opacity}
              style={{
                animation: `floatParticle ${p.dur}s ${p.delay}s infinite ease-in-out alternate`
              }}
            />
          ))}
        </svg>

        <div className="login-brand-content">
          <div className="login-brand-logo">
            <div className="logo-icon" style={{ width: 56, height: 56 }}>
              <Briefcase size={26} />
            </div>
          </div>
          <h1 className="login-brand-title">SouthHR Portal</h1>
          <p className="login-brand-desc">
            Your all-in-one enterprise workforce management platform. Manage employees, attendance, payroll, and more from one place.
          </p>

          <div className="login-brand-stats">
            {BRAND_STATS.map((s, i) => (
              <div key={i} className="brand-stat-item">
                <div className="brand-stat-icon">{s.icon}</div>
                <div>
                  <div className="brand-stat-value">{s.value}</div>
                  <div className="brand-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-brand-badge">
            <Shield size={14} />
            <span>Enterprise-grade security & compliance</span>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="brand-deco-circle brand-deco-1" />
        <div className="brand-deco-circle brand-deco-2" />
        <div className="brand-deco-circle brand-deco-3" />
      </div>

      {/* ---- Right Form Panel ---- */}
      <div className="login-form-panel">
        <div className="login-form-card" key={animKey}>
          {/* Role tabs */}
          <div className="login-role-tabs">
            <button
              type="button"
              className={`login-role-tab ${loginRole === 'admin' ? 'active' : ''}`}
              onClick={() => switchRole('admin')}
            >
              <Shield size={15} />
              Admin
            </button>
            <button
              type="button"
              className={`login-role-tab ${loginRole === 'employee' ? 'active' : ''}`}
              onClick={() => switchRole('employee')}
            >
              <User size={15} />
              Employee
            </button>
          </div>

          {/* Header */}
          <div className="login-form-header">
            <h2 className="login-form-title">
              {loginRole === 'admin' ? 'Admin Sign In' : 'Employee Sign In'}
            </h2>
            <p className="login-form-subtitle">
              {loginRole === 'admin'
                ? 'Access the HR management dashboard'
                : 'Access your personal workspace'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form-fields">
            {/* Username */}
            <div className="form-floating-group">
              <div className="login-input-wrapper">
                <User className="input-icon" size={16} />
                <input
                  type="text"
                  id="login-username"
                  className="form-input login-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder={loginRole === 'admin' ? 'Username (admin)' : 'Employee ID or Email'}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-floating-group">
              <div className="login-input-wrapper">
                <Lock className="input-icon" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  className="form-input login-field"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder={loginRole === 'admin' ? 'Password (admin123)' : 'Password (employee123)'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Demo hint */}
            <div className="login-demo-hint">
              <span>Demo: </span>
              <code>{loginRole === 'admin' ? 'admin / admin123' : 'EMP-1001 / employee123'}</code>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="btn btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Authenticating...
                </>
              ) : (
                `Sign In as ${loginRole === 'admin' ? 'Administrator' : 'Employee'}`
              )}
            </button>
          </form>

          <div className="login-form-footer">
            <span>© 2025 SouthHR Portal • HR Management Systems</span>
          </div>
        </div>
      </div>
    </div>
  );
}
