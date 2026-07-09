import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Human Resources',
  'QA',
  'Marketing',
  'Finance',
  'Operations'
];

const STATUSES = ['Active', 'On Leave', 'Inactive'];

export default function EmployeeFormModal({ isOpen, onClose, onSave, employeeToEdit }) {
  const initialFormState = {
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    phone: '',
    salary: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        salary: employeeToEdit.salary.toString()
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Role Validation
    if (!formData.role.trim()) {
      newErrors.role = 'Professional designation/role is required';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    // Salary Validation
    const salaryNum = Number(formData.salary);
    if (!formData.salary) {
      newErrors.salary = 'Salary/CTC is required';
    } else if (isNaN(salaryNum) || salaryNum <= 0) {
      newErrors.salary = 'Please enter a valid positive salary';
    }

    // Date of Joining Validation
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Joining date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        salary: Number(formData.salary)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {employeeToEdit ? 'Edit Employee Details' : 'Add New Employee'}
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              {/* Full Name */}
              <div className="form-group form-span-2">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Ramesh Krishnan"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="select-field"
                  style={{ width: '100%', minWidth: 'auto' }}
                  value={formData.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Designation / Role */}
              <div className="form-group">
                <label className="form-label" htmlFor="role">Designation / Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className={`form-input ${errors.role ? 'error' : ''}`}
                  placeholder="e.g. Lead Developer"
                  value={formData.role}
                  onChange={handleChange}
                />
                {errors.role && <span className="error-text">{errors.role}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Contact Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="e.g. +91 98401 23456"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Salary / Annual CTC */}
              <div className="form-group">
                <label className="form-label" htmlFor="salary">Annual CTC (INR)</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  className={`form-input ${errors.salary ? 'error' : ''}`}
                  placeholder="e.g. 1500000"
                  value={formData.salary}
                  onChange={handleChange}
                />
                {errors.salary && <span className="error-text">{errors.salary}</span>}
              </div>

              {/* Date of Joining */}
              <div className="form-group">
                <label className="form-label" htmlFor="dateOfJoining">Date of Joining</label>
                <input
                  type="date"
                  id="dateOfJoining"
                  name="dateOfJoining"
                  className={`form-input ${errors.dateOfJoining ? 'error' : ''}`}
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
                {errors.dateOfJoining && <span className="error-text">{errors.dateOfJoining}</span>}
              </div>

              {/* Status */}
              <div className="form-group form-span-2">
                <label className="form-label" htmlFor="status">Employment Status</label>
                <select
                  id="status"
                  name="status"
                  className="select-field"
                  style={{ width: '100%', minWidth: 'auto' }}
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {employeeToEdit ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
