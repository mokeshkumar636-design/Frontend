import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, Calendar, DollarSign, Save } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Human Resources',
  'QA',
  'Marketing',
  'Finance',
  'Operations',
];

const STATUSES = ['Active', 'On Leave', 'Inactive'];

const EMPTY_FORM = {
  name: '',
  role: '',
  department: 'Engineering',
  email: '',
  phone: '',
  salary: '',
  dateOfJoining: '',
  status: 'Active',
};

export default function EmployeeFormModal({ isOpen, onClose, onSave, employeeToEdit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing an existing employee
  useEffect(() => {
    if (isOpen) {
      if (employeeToEdit) {
        setFormData({ ...employeeToEdit });
      } else {
        setFormData(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the specific field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.role.trim()) newErrors.role = 'Job title / role is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Please enter a valid annual salary.';
    }
    if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      ...formData,
      salary: Number(formData.salary),
    });
  };

  const isEditing = !!employeeToEdit;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={isEditing ? 'Edit Employee' : 'Add Employee'}>
      <div
        className="modal-content"
        style={{ maxWidth: '600px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="modal-title" data-testid="modal-title">
              {isEditing ? 'Edit Employee Record' : 'Add New Employee'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Row 1: Name + Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  <User size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Ramesh Krishnan"
                  value={formData.name}
                  onChange={handleChange}
                  data-testid="input-name"
                />
                {errors.name && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  <Briefcase size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Job Title / Role *
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  className={`form-input ${errors.role ? 'input-error' : ''}`}
                  placeholder="e.g. Senior Engineer"
                  value={formData.role}
                  onChange={handleChange}
                  data-testid="input-role"
                />
                {errors.role && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.role}</span>}
              </div>
            </div>

            {/* Row 2: Department + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="select-field"
                  value={formData.department}
                  onChange={handleChange}
                  data-testid="select-department"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">Employment Status</label>
                <select
                  id="status"
                  name="status"
                  className="select-field"
                  value={formData.status}
                  onChange={handleChange}
                  data-testid="select-status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <Mail size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="e.g. user@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="input-email"
                />
                {errors.email && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  <Phone size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="e.g. +91 98401 23456"
                  value={formData.phone}
                  onChange={handleChange}
                  data-testid="input-phone"
                />
                {errors.phone && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
              </div>
            </div>

            {/* Row 4: Salary + Date of Joining */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="salary">
                  <DollarSign size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Annual CTC (₹) *
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  className={`form-input ${errors.salary ? 'input-error' : ''}`}
                  placeholder="e.g. 1500000"
                  value={formData.salary}
                  onChange={handleChange}
                  data-testid="input-salary"
                />
                {errors.salary && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.salary}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dateOfJoining">
                  <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Date of Joining *
                </label>
                <input
                  id="dateOfJoining"
                  name="dateOfJoining"
                  type="date"
                  className={`form-input ${errors.dateOfJoining ? 'input-error' : ''}`}
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  data-testid="input-doj"
                />
                {errors.dateOfJoining && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.dateOfJoining}</span>}
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              data-testid="btn-save"
            >
              <Save size={16} />
              {isEditing ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
