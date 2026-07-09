import React from 'react';
import { Edit2, Trash2, Mail, Phone, Calendar } from 'lucide-react';

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  // Format currency in Indian Rupees format
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper to generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'EE';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to get status class for badge styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'On Leave':
        return 'status-leave';
      case 'Inactive':
        return 'status-inactive';
      default:
        return '';
    }
  };

  // Date formatter
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3 className="empty-title">No employees found</h3>
        <p className="empty-desc">Try resetting your search query or add a new employee record to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department & Role</th>
            <th>Salary (INR)</th>
            <th>Joining Date</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-profile">
                  <div className="avatar">
                    {getInitials(employee.name)}
                  </div>
                  <div className="employee-details">
                    <span className="employee-name">{employee.name}</span>
                    <span className="employee-id">ID: {employee.id}</span>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: '500' }}>{employee.role}</span>
                  <div>
                    <span className="dept-badge">{employee.department}</span>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ fontWeight: '600' }}>{formatCurrency(employee.salary)}</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span>{formatDate(employee.dateOfJoining)}</span>
                </div>
              </td>
              <td>
                <span className={`status-pill ${getStatusClass(employee.status)}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onEdit(employee)}
                    className="btn btn-secondary btn-icon-only"
                    title="Edit Employee"
                    aria-label={`Edit ${employee.name}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="btn btn-danger btn-icon-only"
                    title="Delete Employee"
                    aria-label={`Delete ${employee.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
