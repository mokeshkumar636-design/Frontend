import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  Settings, 
  LayoutDashboard, 
  UserCheck, 
  LogOut,
  FileSpreadsheet,
  DollarSign,
  X
} from 'lucide-react';
import StatsSection from './StatsSection';
import EmployeeTable from './EmployeeTable';
import EmployeeFormModal from './EmployeeFormModal';
import ExcelImportModal from './ExcelImportModal';
import SalarySlipModal from './SalarySlipModal';

// Initial South Indian (South Side based) employee list
const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-1001',
    name: 'Ramesh Krishnan',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'ramesh.k@company.com',
    phone: '+91 98401 23456',
    salary: 1800000,
    dateOfJoining: '2021-03-15',
    status: 'Active'
  },
  {
    id: 'EMP-1002',
    name: 'Priya Swaminathan',
    role: 'Lead UI/UX Designer',
    department: 'Design',
    email: 'priya.s@company.com',
    phone: '+91 98402 34567',
    salary: 1500000,
    dateOfJoining: '2022-05-10',
    status: 'Active'
  },
  {
    id: 'EMP-1003',
    name: 'Venkatesh Prasad',
    role: 'Product Manager',
    department: 'Product',
    email: 'venkatesh.p@company.com',
    phone: '+91 98403 45678',
    salary: 2000000,
    dateOfJoining: '2020-11-01',
    status: 'Active'
  },
  {
    id: 'EMP-1004',
    name: 'Lakshmi Narayanan',
    role: 'HR Director',
    department: 'Human Resources',
    email: 'lakshmi.n@company.com',
    phone: '+91 98404 56789',
    salary: 1600000,
    dateOfJoining: '2019-08-20',
    status: 'Active'
  },
  {
    id: 'EMP-1005',
    name: 'Sandeep Naidu',
    role: 'DevOps Engineer',
    department: 'Engineering',
    email: 'sandeep.n@company.com',
    phone: '+91 98405 67890',
    salary: 1400000,
    dateOfJoining: '2023-01-15',
    status: 'On Leave'
  },
  {
    id: 'EMP-1006',
    name: 'Meera Hegde',
    role: 'QA Specialist',
    department: 'QA',
    email: 'meera.h@company.com',
    phone: '+91 98406 78901',
    salary: 950000,
    dateOfJoining: '2023-06-25',
    status: 'Active'
  },
  {
    id: 'EMP-1007',
    name: 'Karthik Subramanian',
    role: 'Frontend Developer',
    department: 'Engineering',
    email: 'karthik.s@company.com',
    phone: '+91 98407 89012',
    salary: 1100000,
    dateOfJoining: '2024-02-18',
    status: 'Active'
  },
  {
    id: 'EMP-1008',
    name: 'Divya Reddy',
    role: 'Marketing Specialist',
    department: 'Marketing',
    email: 'divya.r@company.com',
    phone: '+91 98408 90123',
    salary: 850000,
    dateOfJoining: '2023-09-05',
    status: 'Inactive'
  },
  {
    id: 'EMP-1009',
    name: 'Vignesh Rajan',
    role: 'Backend Engineer',
    department: 'Engineering',
    email: 'vignesh.r@company.com',
    phone: '+91 98409 01234',
    salary: 1300000,
    dateOfJoining: '2022-10-12',
    status: 'Active'
  },
  {
    id: 'EMP-1010',
    name: 'Ananth Ramaswamy',
    role: 'Financial Analyst',
    department: 'Finance',
    email: 'ananth.r@company.com',
    phone: '+91 98410 12345',
    salary: 1250000,
    dateOfJoining: '2021-07-30',
    status: 'Active'
  },
  {
    id: 'EMP-1011',
    name: 'Srinivasan Ramanujam',
    role: 'Principal Architect',
    department: 'Engineering',
    email: 'srinivasan.r@company.com',
    phone: '+91 98411 23456',
    salary: 2400000,
    dateOfJoining: '2018-04-10',
    status: 'Active'
  },
  {
    id: 'EMP-1012',
    name: 'Deepa Selvam',
    role: 'Content Lead',
    department: 'Marketing',
    email: 'deepa.s@company.com',
    phone: '+91 98412 34567',
    salary: 900000,
    dateOfJoining: '2023-11-15',
    status: 'Active'
  },
  {
    id: 'EMP-1013',
    name: 'Harish Kalyan',
    role: 'Business Analyst',
    department: 'Finance',
    email: 'harish.k@company.com',
    phone: '+91 98413 45678',
    salary: 1150000,
    dateOfJoining: '2022-02-28',
    status: 'Active'
  },
  {
    id: 'EMP-1014',
    name: 'Kavitha Murugan',
    role: 'HR Specialist',
    department: 'Human Resources',
    email: 'kavitha.m@company.com',
    phone: '+91 98414 56789',
    salary: 800000,
    dateOfJoining: '2024-01-10',
    status: 'Active'
  },
  {
    id: 'EMP-1015',
    name: 'Rajesh Sekhar',
    role: 'Support Engineer',
    department: 'Operations',
    email: 'rajesh.s@company.com',
    phone: '+91 98415 67890',
    salary: 700000,
    dateOfJoining: '2024-05-01',
    status: 'On Leave'
  }
];

export default function EmployeeDashboard({ onLogout }) {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees_list');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'employees', 'attendance', 'payroll', 'settings'
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Attendance & Payroll states
  const [selectedPayrollEmp, setSelectedPayrollEmp] = useState(null);
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('employees_attendance');
    if (saved) return JSON.parse(saved);
    // Initialize default status
    const initial = {};
    INITIAL_EMPLOYEES.forEach(emp => {
      initial[emp.id] = emp.status === 'Active' ? 'Present' : (emp.status === 'On Leave' ? 'On Leave' : 'Absent');
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('employees_attendance', JSON.stringify(attendance));
  }, [attendance]);

  const handleSetAttendance = (empId, status) => {
    setAttendance(prev => ({
      ...prev,
      [empId]: status
    }));
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Sync employee state
  useEffect(() => {
    localStorage.setItem('employees_list', JSON.stringify(employees));
  }, [employees]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // CRUD handlers
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this employee record?');
    if (confirmDelete) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleSaveEmployee = (formData) => {
    if (editingEmployee) {
      // Edit mode
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? formData : emp));
    } else {
      // Add mode - generate sequential ID
      const numericIds = employees
        .map(emp => parseInt(emp.id.replace('EMP-', ''), 10))
        .filter(num => !isNaN(num));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1001;
      const nextId = `EMP-${nextNum}`;
      
      const newEmp = {
        ...formData,
        id: nextId
      };
      setEmployees(prev => [newEmp, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleImportEmployees = (newEmployees) => {
    const numericIds = employees
      .map(emp => parseInt(emp.id.replace('EMP-', ''), 10))
      .filter(num => !isNaN(num));
    let nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1001;

    const mapped = newEmployees.map(emp => {
      const id = `EMP-${nextNum++}`;
      return {
        ...emp,
        id
      };
    });

    setEmployees(prev => [...mapped, ...prev]);
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === '' || emp.department === deptFilter;
    const matchesStatus = statusFilter === '' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Background Glow effects */}
      <div className="bg-glow-effect bg-glow-top-right"></div>
      <div className="bg-glow-effect bg-glow-bottom-left"></div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Briefcase size={20} />
          </div>
          <span className="logo-text">SouthHR Portal</span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <Users size={18} />
            <span>Employees</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <UserCheck size={18} />
            <span>Attendance</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <DollarSign size={18} />
            <span>Payroll Slips</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Portal Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="user-profile-preview">
            <div className="avatar">
              MK
            </div>
            <div className="user-info">
              <span className="user-name">Mokesh Kumar</span>
              <span className="user-role">HR Administrator</span>
            </div>
          </div>
          <button 
            className="nav-item" 
            onClick={onLogout}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              width: '100%', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.625rem 0.875rem', 
              color: 'var(--danger)', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 550,
              textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content Area */}
      <main className="main-content">
        
        {/* Header Bar */}
        <header className="header-bar">
          <div className="page-title-container">
            <h1 className="page-title">
              {activeTab === 'dashboard' && 'Executive Dashboard'}
              {activeTab === 'employees' && 'Employee Directory'}
              {activeTab === 'attendance' && 'Attendance Tracking'}
              {activeTab === 'payroll' && 'Payroll Workspace'}
              {activeTab === 'settings' && 'System Configurations'}
            </h1>
            <span className="page-subtitle">
              {activeTab === 'dashboard' && 'Operational overview of human resources and statistics.'}
              {activeTab === 'employees' && `Detailed database of corporate staff members (${filteredEmployees.length} records shown).`}
              {activeTab === 'attendance' && 'Monitor and update daily status (Present, Leave, Absent) for staff.'}
              {activeTab === 'payroll' && 'Manage employee monthly CTC packages and download PDF salary slips.'}
              {activeTab === 'settings' && 'Adjust local portal styling and configurations.'}
            </span>
          </div>

          <div className="header-actions">
            <button 
              className="theme-toggle-btn" 
              onClick={handleToggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {(activeTab === 'employees' || activeTab === 'dashboard') && (
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <StatsSection employees={employees} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Quick Actions & Direct Staff</h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <FileSpreadsheet size={16} /> Bulk Import
                </button>
                <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Plus size={16} /> Add Employee
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveTab('employees')}>
                  Manage All Employees
                </button>
              </div>
            </div>

            <EmployeeTable 
              employees={employees.slice(0, 5)} 
              onEdit={handleOpenEditModal} 
              onDelete={handleDeleteEmployee} 
            />
          </>
        )}

        {/* Employees Listing Tab */}
        {activeTab === 'employees' && (
          <>
            {/* Filter toolbar */}
            <div className="toolbar-card">
              <div className="search-filter-group">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search by ID, name, role or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="select-field"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="QA">QA</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>

                <select
                  className="select-field"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button className="btn btn-secondary" onClick={() => {
                setSearchQuery('');
                setDeptFilter('');
                setStatusFilter('');
              }}>
                Clear Filters
              </button>
            </div>

            {/* Complete Employee Table */}
            <EmployeeTable 
              employees={filteredEmployees} 
              onEdit={handleOpenEditModal} 
              onDelete={handleDeleteEmployee} 
            />
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="table-container" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Portal Configurations</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
              Configure operational preferences for the SouthHR employee database portal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Visual Theme</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Choose between premium dark and clean light modes</span>
                </div>
                <button className="btn btn-secondary" onClick={handleToggleTheme} style={{ minWidth: '120px' }}>
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Restore Defaults</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reset employee listings back to the original 10 mock entries</span>
                </div>
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    const confirmReset = window.confirm('This will overwrite all additions and changes. Proceed?');
                    if (confirmReset) {
                      setEmployees(INITIAL_EMPLOYEES);
                    }
                  }}
                  style={{ minWidth: '120px' }}
                >
                  Reset Data
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Portal Administrator</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1rem' }}>MK</div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>Mokesh Kumar R</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Full-access Root HR Credentials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Workspace */}
        {activeTab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick stats for attendance */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Staff</span>
                  <span className="stat-value">{employees.length}</span>
                  <span className="stat-change text-secondary" style={{ fontSize: '0.75rem' }}>Registered employees</span>
                </div>
                <div className="stat-icon info">
                  <Users size={22} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Present Today</span>
                  <span className="stat-value">
                    {employees.filter(e => (attendance[e.id] || 'Present') === 'Present').length}
                  </span>
                  <span className="stat-change text-secondary" style={{ fontSize: '0.75rem' }}>Active status staff</span>
                </div>
                <div className="stat-icon success">
                  <UserCheck size={22} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Absent Today</span>
                  <span className="stat-value">
                    {employees.filter(e => (attendance[e.id] || 'Present') === 'Absent').length}
                  </span>
                  <span className="stat-change text-secondary" style={{ fontSize: '0.75rem' }}>Awaiting check-in</span>
                </div>
                <div className="stat-icon danger">
                  <X size={22} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">On Leave</span>
                  <span className="stat-value">
                    {employees.filter(e => (attendance[e.id] || 'Present') === 'On Leave').length}
                  </span>
                  <span className="stat-change text-secondary" style={{ fontSize: '0.75rem' }}>Approved absences</span>
                </div>
                <div className="stat-icon warning">
                  <Sun size={22} />
                </div>
              </div>
            </div>

            {/* Attendance Toggle Grid */}
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
                  {employees.map((emp) => {
                    const currentStatus = attendance[emp.id] || 'Present';
                    return (
                      <tr key={emp.id}>
                        <td>
                          <div className="employee-profile">
                            <div className="avatar">
                              {emp.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="employee-details">
                              <span className="employee-name">{emp.name}</span>
                              <span className="employee-id">ID: {emp.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '500' }}>{emp.role}</span>
                            <span className="dept-badge" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>{emp.department}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${
                            currentStatus === 'Present' ? 'status-active' : 
                            (currentStatus === 'On Leave' ? 'status-leave' : 'status-inactive')
                          }`}>
                            {currentStatus}
                          </span>
                        </td>
                        <td>
                          <div className="attendance-options">
                            <button 
                              type="button"
                              className={`attendance-btn ${currentStatus === 'Present' ? 'active-present' : ''}`}
                              onClick={() => handleSetAttendance(emp.id, 'Present')}
                            >
                              Present
                            </button>
                            <button 
                              type="button"
                              className={`attendance-btn ${currentStatus === 'Absent' ? 'active-absent' : ''}`}
                              onClick={() => handleSetAttendance(emp.id, 'Absent')}
                            >
                              Absent
                            </button>
                            <button 
                              type="button"
                              className={`attendance-btn ${currentStatus === 'On Leave' ? 'active-leave' : ''}`}
                              onClick={() => handleSetAttendance(emp.id, 'On Leave')}
                            >
                              On Leave
                            </button>
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

        {/* Payroll Workspace Tab */}
        {activeTab === 'payroll' && (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee Details</th>
                  <th>Department & Role</th>
                  <th>Annual package (CTC)</th>
                  <th>Monthly Gross CTC</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const annualCTC = Number(emp.salary || 0);
                  const monthlyCTC = Math.round(annualCTC / 12);
                  const formatCurrency = (val) => {
                    return new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(val);
                  };

                  return (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-profile">
                          <div className="avatar">
                            {emp.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className="employee-details">
                            <span className="employee-name">{emp.name}</span>
                            <span className="employee-id">ID: {emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '500' }}>{emp.role}</span>
                          <span className="dept-badge" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>{emp.department}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(annualCTC)}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '500' }}>{formatCurrency(monthlyCTC)}</span>
                      </td>
                      <td>
                        <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                            onClick={() => setSelectedPayrollEmp(emp)}
                          >
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
      </main>

      {/* Modal Dialog */}
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
    </div>
  );
}
