import React from 'react';
import {
  X, User, Mail, Phone, Briefcase, Building2,
  Calendar, IndianRupee, BadgeCheck, Clock, XCircle
} from 'lucide-react';

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

function getInitials(name) {
  if (!name) return 'EE';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(val);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

function getTenure(dateStr) {
  if (!dateStr) return '-';
  try {
    const start = new Date(dateStr);
    const now   = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years  = Math.floor(months / 12);
    const rem    = months % 12;
    if (years === 0) return `${rem} month${rem !== 1 ? 's' : ''}`;
    if (rem === 0)   return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years}y ${rem}m`;
  } catch { return '-'; }
}

function getStatusIcon(status) {
  switch (status) {
    case 'Active':   return <BadgeCheck size={14} />;
    case 'On Leave': return <Clock size={14} />;
    case 'Inactive': return <XCircle size={14} />;
    default:         return null;
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'Active':   return 'status-active';
    case 'On Leave': return 'status-leave';
    case 'Inactive': return 'status-inactive';
    default:         return '';
  }
}

export default function EmployeeProfileModal({ isOpen, onClose, employee, onEdit }) {
  if (!isOpen || !employee) return null;

  const grad = DEPT_GRADIENTS[employee.department] || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
  const annualCTC   = Number(employee.salary || 0);
  const monthlyCTC  = Math.round(annualCTC / 12);
  const basicSalary = Math.round(monthlyCTC * 0.40);
  const hra         = Math.round(monthlyCTC * 0.20);
  const allowances  = Math.round(monthlyCTC * 0.25);
  const deductions  = Math.round(monthlyCTC * 0.15);
  const netPay      = monthlyCTC - deductions;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content profile-modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${employee.name} Profile`}
      >
        {/* Profile header band */}
        <div className="profile-hero" style={{ background: grad }}>
          <button className="close-btn profile-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
          <div className="profile-avatar-large">
            {getInitials(employee.name)}
          </div>
          <h2 className="profile-name">{employee.name}</h2>
          <p className="profile-role-text">{employee.role}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
            <span className="dept-badge profile-dept-badge">{employee.department}</span>
            <span className={`status-pill ${getStatusClass(employee.status)}`}>
              {getStatusIcon(employee.status)} {employee.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Info Grid */}
          <div className="profile-info-grid">
            <InfoRow icon={<User size={15} />} label="Employee ID" value={employee.id} />
            <InfoRow icon={<Mail size={15} />} label="Email" value={employee.email} />
            <InfoRow icon={<Phone size={15} />} label="Phone" value={employee.phone} />
            <InfoRow icon={<Building2 size={15} />} label="Department" value={employee.department} />
            <InfoRow icon={<Briefcase size={15} />} label="Designation" value={employee.role} />
            <InfoRow icon={<Calendar size={15} />} label="Date of Joining" value={formatDate(employee.dateOfJoining)} />
            <InfoRow icon={<Clock size={15} />} label="Tenure" value={getTenure(employee.dateOfJoining)} />
            <InfoRow icon={<IndianRupee size={15} />} label="Annual CTC" value={formatCurrency(annualCTC)} highlight />
          </div>

          {/* Salary Breakdown */}
          <div className="profile-section">
            <h3 className="profile-section-title">Monthly Salary Breakdown</h3>
            <div className="salary-breakdown-grid">
              <SalaryRow label="Basic Salary"    value={basicSalary}  color="var(--accent-primary)" />
              <SalaryRow label="HRA"             value={hra}          color="#10b981" />
              <SalaryRow label="Allowances"      value={allowances}   color="#f59e0b" />
              <SalaryRow label="Deductions"      value={-deductions}  color="#ef4444" isDeduction />
              <div className="salary-net-row">
                <span>Net Monthly Pay</span>
                <span className="salary-net-value">{formatCurrency(netPay)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {onEdit && (
            <button className="btn btn-primary" onClick={() => { onClose(); onEdit(employee); }}>
              Edit Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, highlight }) {
  return (
    <div className="profile-info-row">
      <div className="profile-info-icon">{icon}</div>
      <div className="profile-info-content">
        <span className="profile-info-label">{label}</span>
        <span className={`profile-info-value ${highlight ? 'highlight' : ''}`}>{value}</span>
      </div>
    </div>
  );
}

function SalaryRow({ label, value, color, isDeduction }) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(Math.abs(value));

  return (
    <div className="salary-breakdown-row">
      <span className="salary-breakdown-label">{label}</span>
      <span className="salary-breakdown-amount" style={{ color }}>
        {isDeduction ? '-' : '+'}{formatted}
      </span>
    </div>
  );
}
