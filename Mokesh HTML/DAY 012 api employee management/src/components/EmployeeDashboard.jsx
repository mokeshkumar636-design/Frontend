import axios from "axios";
import React, { useState, useEffect, useCallback } from 'react';

const MOCK_EMPLOYEES = [
  { id:'EMP-1001', name:'Ramesh Krishnan',      role:'Senior Software Engineer', department:'Engineering',     email:'ramesh.k@company.com',     phone:'+91 98401 23456', salary:1800000, dateOfJoining:'2021-03-15', status:'Active' },
  { id:'EMP-1002', name:'Priya Swaminathan',    role:'Lead UI/UX Designer',      department:'Design',          email:'priya.s@company.com',       phone:'+91 98402 34567', salary:1500000, dateOfJoining:'2022-05-10', status:'Active' },
  { id:'EMP-1003', name:'Venkatesh Prasad',     role:'Product Manager',          department:'Product',         email:'venkatesh.p@company.com',   phone:'+91 98403 45678', salary:2000000, dateOfJoining:'2020-11-01', status:'Active' },
  { id:'EMP-1004', name:'Lakshmi Narayanan',    role:'HR Director',              department:'Human Resources', email:'lakshmi.n@company.com',     phone:'+91 98404 56789', salary:1600000, dateOfJoining:'2019-08-20', status:'Active' },
  { id:'EMP-1005', name:'Sandeep Naidu',        role:'DevOps Engineer',          department:'Engineering',     email:'sandeep.n@company.com',     phone:'+91 98405 67890', salary:1400000, dateOfJoining:'2023-01-15', status:'On Leave' },
  { id:'EMP-1006', name:'Meera Hegde',          role:'QA Specialist',            department:'QA',              email:'meera.h@company.com',       phone:'+91 98406 78901', salary:950000,  dateOfJoining:'2023-06-25', status:'Active' },
  { id:'EMP-1007', name:'Karthik Subramanian',  role:'Frontend Developer',       department:'Engineering',     email:'karthik.s@company.com',     phone:'+91 98407 89012', salary:1100000, dateOfJoining:'2024-02-18', status:'Active' },
  { id:'EMP-1008', name:'Divya Reddy',          role:'Marketing Specialist',     department:'Marketing',       email:'divya.r@company.com',       phone:'+91 98408 90123', salary:850000,  dateOfJoining:'2023-09-05', status:'Inactive' },
  { id:'EMP-1009', name:'Vignesh Rajan',        role:'Backend Engineer',         department:'Engineering',     email:'vignesh.r@company.com',     phone:'+91 98409 01234', salary:1300000, dateOfJoining:'2022-10-12', status:'Active' },
  { id:'EMP-1010', name:'Ananth Ramaswamy',     role:'Financial Analyst',        department:'Finance',         email:'ananth.r@company.com',      phone:'+91 98410 12345', salary:1250000, dateOfJoining:'2021-07-30', status:'Active' },
  { id:'EMP-1011', name:'Srinivasan Ramanujam', role:'Principal Architect',      department:'Engineering',     email:'srinivasan.r@company.com',  phone:'+91 98411 23456', salary:2400000, dateOfJoining:'2018-04-10', status:'Active' },
  { id:'EMP-1012', name:'Deepa Selvam',         role:'Content Lead',             department:'Marketing',       email:'deepa.s@company.com',       phone:'+91 98412 34567', salary:900000,  dateOfJoining:'2023-11-15', status:'Active' },
  { id:'EMP-1013', name:'Harish Kalyan',        role:'Business Analyst',         department:'Finance',         email:'harish.k@company.com',      phone:'+91 98413 45678', salary:1150000, dateOfJoining:'2022-02-28', status:'Active' },
  { id:'EMP-1014', name:'Kavitha Murugan',      role:'HR Specialist',            department:'Human Resources', email:'kavitha.m@company.com',     phone:'+91 98414 56789', salary:800000,  dateOfJoining:'2024-01-10', status:'Active' },
  { id:'EMP-1015', name:'Rajesh Sekhar',        role:'Support Engineer',         department:'Operations',      email:'rajesh.s@company.com',      phone:'+91 98415 67890', salary:700000,  dateOfJoining:'2024-05-01', status:'On Leave' },
];
import {
  Users, Briefcase, Search, Plus, Sun, Moon, Settings,
  LayoutDashboard, UserCheck, LogOut, FileSpreadsheet,
  DollarSign, X, Bell, ChevronDown
} from 'lucide-react';
import StatsSection from './StatsSection';
import EmployeeTable from './EmployeeTable';
import EmployeeFormModal from './EmployeeFormModal';
import ExcelImportModal from './ExcelImportModal';
import SalarySlipModal from './SalarySlipModal';
import ChartsSection from './ChartsSection';
import ConfirmDialog from './ConfirmDialog';
import EmployeeProfileModal from './EmployeeProfileModal';
import { useToast } from './NotificationToast';

// ---- Greeting based on time ----
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ---- Real-time clock ----
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function formatClockTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}
function formatClockDate(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EmployeeDashboard({ role, currentUser, onLogout }) {
  const toast = useToast();
  const time = useClock();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedPayrollEmp, setSelectedPayrollEmp] = useState(null);
  const [profileEmployee, setProfileEmployee] = useState(null);

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({ open: false, id: null, isBulk: false, ids: null });

  // Attendance
  const [attendance, setAttendance] = useState(() => {
    const s = localStorage.getItem('employees_attendance');
    return s ? JSON.parse(s) : {};
  });

  // Activity log
  const [activityLog, setActivityLog] = useState(() => {
    const s = localStorage.getItem('activity_log');
    return s ? JSON.parse(s) : [];
  });

  const addActivity = useCallback((msg, type = 'info') => {
    const entry = { msg, type, ts: new Date().toISOString() };
    setActivityLog(prev => {
      const next = [entry, ...prev].slice(0, 20);
      localStorage.setItem('activity_log', JSON.stringify(next));
      return next;
    });
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/employees", { timeout: 5000 });
      const data = Array.isArray(res.data) && res.data.length > 0 ? res.data : MOCK_EMPLOYEES;
      setEmployees(data);
      localStorage.setItem('employees_list', JSON.stringify(data));
      setError(null);
    } catch (err) {
      // Fallback to mock data so the UI is always explorable
      console.warn("API unavailable — using mock data:", err.message);
      setEmployees(MOCK_EMPLOYEES);
      localStorage.setItem('employees_list', JSON.stringify(MOCK_EMPLOYEES));
      setError(null); // Don't block UI; show banner instead
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);
  useEffect(() => { localStorage.setItem('employees_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  const handleOpenAddModal = () => { setEditingEmployee(null); setIsModalOpen(true); };
  const handleOpenEditModal = (emp) => { setEditingEmployee(emp); setIsModalOpen(true); };

  // Delete with confirm dialog
  const handleDeleteEmployee = (id) => {
    setConfirmState({ open: true, id, isBulk: false, ids: null });
  };

  const handleBulkDeleteTrigger = (ids) => {
    // ids is a Set here - but we handle from EmployeeTable onDelete cycling
    // This won't be called directly; EmployeeTable calls onDelete per-id
    setConfirmState({ open: true, id: ids, isBulk: false, ids: null });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmState;
    setConfirmState({ open: false, id: null, isBulk: false, ids: null });
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(prev => prev.filter(e => e.id !== id));
      const name = employees.find(e => e.id === id)?.name || id;
      toast.success(`Employee "${name}" has been removed.`);
      addActivity(`Deleted employee: ${name}`, 'danger');
    } catch (err) {
      toast.error("Failed to delete employee: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelDelete = () => setConfirmState({ open: false, id: null, isBulk: false, ids: null });

  const handleSaveEmployee = async (formData) => {
    try {
      if (editingEmployee) {
        const res = await axios.put(`http://localhost:5000/api/employees/${editingEmployee.id}`, formData);
        setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? res.data.employee : e));
        toast.success(`Employee "${formData.name}" updated successfully!`);
        addActivity(`Updated employee: ${formData.name}`, 'success');
      } else {
        const res = await axios.post("http://localhost:5000/api/employees", formData);
        setEmployees(prev => [res.data.employee, ...prev]);
        toast.success(`Employee "${formData.name}" added successfully!`);
        addActivity(`Added new employee: ${formData.name}`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Error saving employee: " + (err.response?.data?.message || err.message));
    }
  };

  const handleImportEmployees = async (newEmployees) => {
    try {
      setLoading(true);
      for (const emp of newEmployees) {
        await axios.post("http://localhost:5000/api/employees", emp);
      }
      await fetchEmployees();
      toast.success(`${newEmployees.length} employee(s) imported successfully!`);
      addActivity(`Bulk imported ${newEmployees.length} employees`, 'info');
    } catch (err) {
      toast.error("Import failed. Please check logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/employees/reset");
      setEmployees(res.data.employees);
      toast.success("Database reset to original mock entries!");
      addActivity("Reset database to defaults", 'warning');
    } catch (err) {
      toast.error("Error resetting database. Check if database is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetAttendance = (empId, status) => {
    setAttendance(prev => ({ ...prev, [empId]: status }));
  };

  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || emp.name?.toLowerCase().includes(q) || emp.role?.toLowerCase().includes(q)
      || emp.email?.toLowerCase().includes(q) || emp.id?.toLowerCase().includes(q);
    const matchDept   = !deptFilter   || emp.department === deptFilter;
    const matchStatus = !statusFilter || emp.status     === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const adminName = role === 'admin' ? 'Administrator' : (currentUser?.name || 'Employee');
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Loading state
  if (loading && employees.length === 0) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="loading-ring" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connecting to SouthHR Portal...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="stat-card" style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>Database Connection Error</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchEmployees}>Retry Connection</button>
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard',  label: 'Dashboard',        icon: <LayoutDashboard size={18} /> },
    { id: 'employees',  label: 'Employees',         icon: <Users size={18} /> },
    { id: 'attendance', label: 'Attendance',        icon: <UserCheck size={18} /> },
    { id: 'payroll',    label: 'Payroll Slips',     icon: <DollarSign size={18} /> },
    { id: 'settings',   label: 'Portal Settings',   icon: <Settings size={18} /> },
  ];

  return (
    <div className="app-container">
      <div className="bg-glow-effect bg-glow-top-right" />
      <div className="bg-glow-effect bg-glow-bottom-left" />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="logo-container">
          <div className="logo-icon"><Briefcase size={20} /></div>
          {!sidebarCollapsed && <span className="logo-text">SouthHR</span>}
        </div>

        <nav className="nav-links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={sidebarCollapsed ? item.label : ''}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="user-profile-preview">
              <div className="avatar">{adminInitials}</div>
              <div className="user-info">
                <span className="user-name">{adminName}</span>
                <span className="user-role">{role === 'admin' ? 'HR Administrator' : 'Employee'}</span>
              </div>
            </div>
          )}
          <button
            className="nav-item"
            onClick={onLogout}
            style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 550 }}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>

        {/* Header */}
        <header className="header-bar">
          <div className="page-title-container">
            <h1 className="page-title">
              {activeTab === 'dashboard'  && `${getGreeting()}, ${role === 'admin' ? 'Admin' : currentUser?.name?.split(' ')[0] || 'User'}! 👋`}
              {activeTab === 'employees'  && 'Employee Directory'}
              {activeTab === 'attendance' && 'Attendance Tracking'}
              {activeTab === 'payroll'    && 'Payroll Workspace'}
              {activeTab === 'settings'   && 'System Configurations'}
            </h1>
            <span className="page-subtitle">
              {activeTab === 'dashboard'  && `${formatClockDate(time)} • ${formatClockTime(time)}`}
              {activeTab === 'employees'  && `Database of staff members (${filteredEmployees.length} records shown)`}
              {activeTab === 'attendance' && 'Monitor and update daily status for staff.'}
              {activeTab === 'payroll'    && 'Manage employee monthly CTC packages and salary slips.'}
              {activeTab === 'settings'   && 'Adjust portal styling and configurations.'}
            </span>
          </div>

          <div className="header-actions">
            <button className="theme-toggle-btn" onClick={handleToggleTheme} title="Toggle Theme" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {role === 'admin' && (activeTab === 'employees' || activeTab === 'dashboard') && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <FileSpreadsheet size={16} /> Bulk Import
                </button>
                <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Plus size={16} /> Add Employee
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ---- Dashboard Tab ---- */}
        {activeTab === 'dashboard' && (
          <>
            <StatsSection employees={employees} />
            <ChartsSection employees={employees} />

            {/* Recent Activity + Quick Preview */}
            <div className="dashboard-bottom-grid">
              {/* Quick Actions */}
              <div className="dashboard-quick-actions">
                <h2 className="section-heading">Quick Actions</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {role === 'admin' && (
                    <>
                      <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Plus size={16} /> Add Employee
                      </button>
                      <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <FileSpreadsheet size={16} /> Bulk Import
                      </button>
                    </>
                  )}
                  <button className="btn btn-secondary" onClick={() => setActiveTab('employees')}>
                    Manage Employees
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('attendance')}>
                    View Attendance
                  </button>
                </div>

                {/* Recent employees table */}
                <h3 style={{ marginTop: '1.5rem', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
                  Recent Staff
                </h3>
                <EmployeeTable
                  employees={employees.slice(0, 5)}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteEmployee}
                  onView={emp => setProfileEmployee(emp)}
                  role={role}
                />
              </div>

              {/* Activity Log */}
              <div className="activity-log-panel">
                <h2 className="section-heading">Recent Activity</h2>
                {activityLog.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                    No activity yet. Actions will be logged here.
                  </div>
                ) : (
                  <div className="activity-list">
                    {activityLog.map((entry, i) => (
                      <div key={i} className={`activity-item activity-${entry.type}`}>
                        <div className="activity-dot" />
                        <div className="activity-content">
                          <span className="activity-msg">{entry.msg}</span>
                          <span className="activity-time">
                            {new Date(entry.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---- Employees Tab ---- */}
        {activeTab === 'employees' && (
          <>
            <div className="toolbar-card">
              <div className="search-filter-group">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search by ID, name, role or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <select className="select-field" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="">All Departments</option>
                  {['Engineering','Design','Product','Human Resources','QA','Marketing','Finance','Operations'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select className="select-field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setDeptFilter(''); setStatusFilter(''); }}>
                Clear Filters
              </button>
            </div>
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteEmployee}
              onView={emp => setProfileEmployee(emp)}
              role={role}
            />
          </>
        )}

        {/* ---- Attendance Tab ---- */}
        {activeTab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {[
                { label: 'Total Staff',    value: employees.length,                                                  icon: <Users size={22} />,     cls: 'info' },
                { label: 'Present Today',  value: employees.filter(e => (attendance[e.id]||'Present') === 'Present').length, icon: <UserCheck size={22} />, cls: 'success' },
                { label: 'Absent Today',   value: employees.filter(e => (attendance[e.id]||'Present') === 'Absent').length,  icon: <X size={22} />,        cls: 'danger' },
                { label: 'On Leave',       value: employees.filter(e => (attendance[e.id]||'Present') === 'On Leave').length, icon: <Sun size={22} />,      cls: 'warning' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">{s.label}</span>
                    <span className="stat-value">{s.value}</span>
                  </div>
                  <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                </div>
              ))}
            </div>
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee Details</th>
                    <th>Department & Role</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center', width: '320px' }}>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const cur = attendance[emp.id] || 'Present';
                    return (
                      <tr key={emp.id}>
                        <td>
                          <div className="employee-profile">
                            <div className="avatar">{emp.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
                            <div className="employee-details">
                              <span className="employee-name">{emp.name}</span>
                              <span className="employee-id">ID: {emp.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500 }}>{emp.role}</span>
                            <span className="dept-badge" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>{emp.department}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${cur === 'Present' ? 'status-active' : cur === 'On Leave' ? 'status-leave' : 'status-inactive'}`}>
                            {cur}
                          </span>
                        </td>
                        <td>
                          <div className="attendance-options">
                            {['Present', 'Absent', 'On Leave'].map(s => (
                              <button
                                key={s}
                                type="button"
                                className={`attendance-btn ${cur === s ? `active-${s.toLowerCase().replace(' ', '-')}` : ''}`}
                                onClick={() => handleSetAttendance(emp.id, s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---- Payroll Tab ---- */}
        {activeTab === 'payroll' && (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee Details</th>
                  <th>Department & Role</th>
                  <th>Annual CTC</th>
                  <th>Monthly Gross</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const annual = Number(emp.salary || 0);
                  const monthly = Math.round(annual / 12);
                  const fmt = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-profile">
                          <div className="avatar">{emp.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
                          <div className="employee-details">
                            <span className="employee-name">{emp.name}</span>
                            <span className="employee-id">ID: {emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500 }}>{emp.role}</span>
                          <span className="dept-badge" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>{emp.department}</span>
                        </div>
                      </td>
                      <td><span style={{ fontWeight: 600 }}>{fmt(annual)}</span></td>
                      <td><span style={{ fontWeight: 500 }}>{fmt(monthly)}</span></td>
                      <td>
                        <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                            onClick={() => setSelectedPayrollEmp(emp)}>
                            <DollarSign size={14} /> Salary Slip
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- Settings Tab ---- */}
        {activeTab === 'settings' && (
          <div className="table-container" style={{ padding: '2rem', maxWidth: '640px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Portal Configurations</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
              Configure operational preferences for the SouthHR employee database portal.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SettingRow
                title="Visual Theme"
                desc="Choose between premium dark and clean light modes"
                action={<button className="btn btn-secondary" onClick={handleToggleTheme} style={{ minWidth: '120px' }}>
                  {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>}
              />
              <SettingRow
                title="Restore Defaults"
                desc="Reset employee listings back to the original 10 mock entries"
                action={<button className="btn btn-danger" onClick={() => {
                  if (window.confirm('This will overwrite all additions and changes. Proceed?')) handleResetData();
                }} style={{ minWidth: '120px' }}>
                  Reset Data
                </button>}
              />
              <SettingRow
                title="Portal Administrator"
                desc="Current session credentials and access level"
                action={null}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.75rem' }}>
                  <div className="avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>{adminInitials}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{adminName}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {role === 'admin' ? 'Full-access Root HR Credentials' : 'Employee Read-only Access'}
                    </p>
                  </div>
                </div>
              </SettingRow>
            </div>
          </div>
        )}
      </main>

      {/* ---- Modals ---- */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={editingEmployee}
      />
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportEmployees}
      />
      <SalarySlipModal
        isOpen={selectedPayrollEmp !== null}
        onClose={() => setSelectedPayrollEmp(null)}
        employee={selectedPayrollEmp}
      />
      <EmployeeProfileModal
        isOpen={profileEmployee !== null}
        onClose={() => setProfileEmployee(null)}
        employee={profileEmployee}
        onEdit={role === 'admin' ? handleOpenEditModal : null}
      />
      <ConfirmDialog
        isOpen={confirmState.open}
        title="Delete Employee"
        message={`Are you sure you want to permanently remove this employee record? This action cannot be undone.`}
        confirmLabel="Delete"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

function SettingRow({ title, desc, action, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</span>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
