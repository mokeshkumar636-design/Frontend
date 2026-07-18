import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="table-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No employees found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="employee-table" role="table" aria-label="Employee directory">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department & Role</th>
            <th>Contact</th>
            <th>Annual CTC</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} data-testid={`employee-row-${emp.id}`}>
              {/* Employee profile column */}
              <td>
                <div className="employee-profile">
                  <div className="avatar" aria-hidden="true">
                    {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="employee-details">
                    <span className="employee-name">{emp.name}</span>
                    <span className="employee-id">ID: {emp.id}</span>
                  </div>
                </div>
              </td>

              {/* Department & Role column */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{emp.role}</span>
                  <span className="dept-badge" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                    {emp.department}
                  </span>
                </div>
              </td>

              {/* Contact column */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.8125rem' }}>{emp.email}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{emp.phone}</span>
                </div>
              </td>

              {/* Salary column */}
              <td>
                <span style={{ fontWeight: '600' }}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(Number(emp.salary || 0))}
                </span>
              </td>

              {/* Status column */}
              <td>
                <span
                  className={`status-pill ${
                    emp.status === 'Active'
                      ? 'status-active'
                      : emp.status === 'On Leave'
                      ? 'status-leave'
                      : 'status-inactive'
                  }`}
                  data-testid={`status-${emp.id}`}
                >
                  {emp.status}
                </span>
              </td>

              {/* Actions column */}
              <td>
                <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="action-btn edit"
                    onClick={() => onEdit(emp)}
                    title={`Edit ${emp.name}`}
                    aria-label={`Edit ${emp.name}`}
                    data-testid={`edit-btn-${emp.id}`}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => onDelete(emp.id)}
                    title={`Delete ${emp.name}`}
                    aria-label={`Delete ${emp.name}`}
                    data-testid={`delete-btn-${emp.id}`}
                  >
                    <Trash2 size={15} />
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
