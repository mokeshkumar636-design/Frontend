import React from 'react';
import { Pencil, Trash2, Eye, Mail, Phone, Calendar, IndianRupee } from 'lucide-react';

const DEPT_GRADIENTS = {
  Engineering:       'linear-gradient(135deg, #6366f1, #8b5cf6)',
  Design:            'linear-gradient(135deg, #ec4899, #f97316)',
  Product:           'linear-gradient(135deg, #f59e0b, #ef4444)',
  'Human Resources': 'linear-gradient(135deg, #10b981, #06b6d4)',
  QA:                'linear-gradient(135deg, #06b6d4, #3b82f6)',
  Marketing:         'linear-gradient(135deg, #8b5cf6, #ec4899)',
  Finance:           'linear-gradient(135deg, #f97316, #f59e0b)',
  Operations:        'linear-gradient(135deg, #3b82f6, #10b981)',
};

const DEPT_BG = {
  Engineering:       'rgba(99,102,241,0.08)',
  Design:            'rgba(236,72,153,0.08)',
  Product:           'rgba(245,158,11,0.08)',
  'Human Resources': 'rgba(16,185,129,0.08)',
  QA:                'rgba(6,182,212,0.08)',
  Marketing:         'rgba(139,92,246,0.08)',
  Finance:           'rgba(249,115,22,0.08)',
  Operations:        'rgba(59,130,246,0.08)',
};

function getInitials(name) {
  if (!name) return 'EE';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getStatusClass(status) {
  switch (status) {
    case 'Active':   return 'status-active';
    case 'On Leave': return 'status-leave';
    case 'Inactive': return 'status-inactive';
    default:         return '';
  }
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(val);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

export default function EmployeeGrid({ employees, onEdit, onDelete, onView, selectedIds, onToggleSelect }) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
        <h3 className="empty-title">No employees found</h3>
        <p className="empty-desc">Try resetting your search query or add a new employee record.</p>
      </div>
    );
  }

  return (
    <div className="employee-grid">
      {employees.map(emp => {
        const isSelected = selectedIds?.has(emp.id);
        const deptGrad = DEPT_GRADIENTS[emp.department] || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        const deptBg   = DEPT_BG[emp.department] || 'rgba(99,102,241,0.08)';

        return (
          <div key={emp.id || emp._id} className={`emp-grid-card ${isSelected ? 'selected' : ''}`}>
            {/* Selection checkbox */}
            {onToggleSelect && (
              <div className="grid-card-check">
                <input
                  type="checkbox"
                  className="row-checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(emp.id)}
                  aria-label={`Select ${emp.name}`}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}

            {/* Dept color band */}
            <div className="grid-card-band" style={{ background: deptGrad }} />

            {/* Avatar */}
            <div className="grid-card-avatar" style={{ background: deptGrad }}>
              {getInitials(emp.name)}
            </div>

            {/* Name & Role */}
            <div className="grid-card-identity">
              <h4 className="grid-card-name">{emp.name}</h4>
              <p className="grid-card-role">{emp.role}</p>
              <span className="grid-card-id">{emp.id}</span>
            </div>

            {/* Status & Department */}
            <div className="grid-card-tags">
              <span className="dept-badge" style={{ background: deptBg }}>
                {emp.department}
              </span>
              <span className={`status-pill ${getStatusClass(emp.status)}`}>
                {emp.status}
              </span>
            </div>

            {/* Info rows */}
            <div className="grid-card-info">
              <div className="grid-info-row">
                <Mail size={12} />
                <span>{emp.email}</span>
              </div>
              <div className="grid-info-row">
                <Phone size={12} />
                <span>{emp.phone}</span>
              </div>
              <div className="grid-info-row">
                <IndianRupee size={12} />
                <span>{formatCurrency(emp.salary)} / yr</span>
              </div>
              <div className="grid-info-row">
                <Calendar size={12} />
                <span>Joined {formatDate(emp.dateOfJoining)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid-card-actions">
              {onView && (
                <button
                  className="btn btn-secondary btn-icon-only"
                  title="View Profile"
                  onClick={() => onView(emp)}
                  aria-label={`View ${emp.name}`}
                >
                  <Eye size={14} />
                </button>
              )}
              <button
                className="btn btn-secondary btn-icon-only"
                title="Edit Employee"
                onClick={() => onEdit(emp)}
                aria-label={`Edit ${emp.name}`}
              >
                <Pencil size={14} />
              </button>
              <button
                className="btn btn-danger btn-icon-only"
                title="Delete Employee"
                onClick={() => onDelete(emp.id)}
                aria-label={`Delete ${emp.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
