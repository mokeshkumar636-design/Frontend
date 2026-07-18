import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, IndianRupee, Calendar, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering', 'Design', 'Product', 'Human Resources',
  'QA', 'Marketing', 'Finance', 'Operations'
];
const STATUSES = ['Active', 'On Leave', 'Inactive'];

const STEPS = [
  { id: 1, label: 'Basic Info',    icon: <User size={16} /> },
  { id: 2, label: 'Contact & Pay', icon: <Phone size={16} /> },
  { id: 3, label: 'Review',        icon: <CheckCircle size={16} /> },
];

const INIT = {
  name: '', role: '', department: 'Engineering',
  email: '', phone: '', salary: '',
  dateOfJoining: new Date().toISOString().split('T')[0],
  status: 'Active'
};

function formatCurrency(val) {
  const n = Number(val);
  if (!n) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function EmployeeFormModal({ isOpen, onClose, onSave, employeeToEdit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INIT);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      if (employeeToEdit) {
        setFormData({ ...employeeToEdit, salary: String(employeeToEdit.salary) });
      } else {
        setFormData(INIT);
      }
    }
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    else if (formData.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';
    if (!formData.role.trim()) errs.role = 'Designation / role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email address';
    const clean = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) errs.phone = 'Contact number is required';
    else if (clean.length < 10) errs.phone = 'Phone must be at least 10 digits';
    const sal = Number(formData.salary);
    if (!formData.salary) errs.salary = 'Annual CTC is required';
    else if (isNaN(sal) || sal <= 0) errs.salary = 'Enter a valid positive salary';
    if (!formData.dateOfJoining) errs.dateOfJoining = 'Joining date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    onSave({ ...formData, salary: Number(formData.salary) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wizard-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {/* Step Indicator */}
        <div className="wizard-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`wizard-step ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}>
                <div className="wizard-step-icon">
                  {step > s.id ? <CheckCircle size={16} /> : s.icon}
                </div>
                <span className="wizard-step-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`wizard-connector ${step > s.id ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="modal-body wizard-body">

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="wizard-step-content">
              <div className="wizard-step-hero">
                <div className="wizard-step-hero-icon"><User size={22} /></div>
                <div>
                  <h3>Basic Information</h3>
                  <p>Enter the employee's name, role and department</p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group form-span-2">
                  <label className="form-label" htmlFor="emp-name">Full Name *</label>
                  <input id="emp-name" type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Ramesh Krishnan" value={formData.name} onChange={handleChange} />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emp-dept">Department *</label>
                  <select id="emp-dept" name="department" className="select-field" style={{ width: '100%', minWidth: 'auto' }}
                    value={formData.department} onChange={handleChange}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emp-role">Designation / Role *</label>
                  <input id="emp-role" type="text" name="role" className={`form-input ${errors.role ? 'error' : ''}`}
                    placeholder="e.g. Senior Developer" value={formData.role} onChange={handleChange} />
                  {errors.role && <span className="error-text">{errors.role}</span>}
                </div>

                <div className="form-group form-span-2">
                  <label className="form-label" htmlFor="emp-status">Employment Status *</label>
                  <div className="status-toggle-group">
                    {STATUSES.map(s => (
                      <button key={s} type="button"
                        className={`status-toggle-btn ${formData.status === s ? `active-${s.toLowerCase().replace(' ', '-')}` : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Pay */}
          {step === 2 && (
            <div className="wizard-step-content">
              <div className="wizard-step-hero">
                <div className="wizard-step-hero-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h3>Contact & Compensation</h3>
                  <p>Provide contact details and salary information</p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-email">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input id="emp-email" type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }} placeholder="name@company.com" value={formData.email} onChange={handleChange} />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emp-phone">Contact Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input id="emp-phone" type="tel" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }} placeholder="+91 98401 23456" value={formData.phone} onChange={handleChange} />
                  </div>
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emp-salary">Annual CTC (INR) *</label>
                  <div style={{ position: 'relative' }}>
                    <IndianRupee size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input id="emp-salary" type="number" name="salary" className={`form-input ${errors.salary ? 'error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }} placeholder="e.g. 1500000" value={formData.salary} onChange={handleChange} />
                  </div>
                  {errors.salary && <span className="error-text">{errors.salary}</span>}
                  {formData.salary && Number(formData.salary) > 0 && (
                    <span className="salary-hint">≈ {formatCurrency(Math.round(Number(formData.salary) / 12))} / month</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emp-doj">Date of Joining *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input id="emp-doj" type="date" name="dateOfJoining" className={`form-input ${errors.dateOfJoining ? 'error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }} value={formData.dateOfJoining} onChange={handleChange} />
                  </div>
                  {errors.dateOfJoining && <span className="error-text">{errors.dateOfJoining}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="wizard-step-content">
              <div className="wizard-step-hero">
                <div className="wizard-step-hero-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h3>Review & Confirm</h3>
                  <p>Please verify all details before saving</p>
                </div>
              </div>
              <div className="review-grid">
                <ReviewRow label="Full Name"      value={formData.name} icon={<User size={13} />} />
                <ReviewRow label="Department"     value={formData.department} icon={<Briefcase size={13} />} />
                <ReviewRow label="Role"           value={formData.role} icon={<Briefcase size={13} />} />
                <ReviewRow label="Status"         value={formData.status} icon={<CheckCircle size={13} />} />
                <ReviewRow label="Email"          value={formData.email} icon={<Mail size={13} />} />
                <ReviewRow label="Phone"          value={formData.phone} icon={<Phone size={13} />} />
                <ReviewRow label="Annual CTC"     value={formatCurrency(formData.salary)} icon={<IndianRupee size={13} />} highlight />
                <ReviewRow label="Monthly Gross"  value={formatCurrency(Math.round(Number(formData.salary) / 12))} icon={<IndianRupee size={13} />} />
                <ReviewRow label="Date of Joining" value={formData.dateOfJoining} icon={<Calendar size={13} />} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer wizard-footer">
          <button type="button" className="btn btn-secondary" onClick={step === 1 ? onClose : handleBack}>
            {step === 1 ? 'Cancel' : <><ChevronLeft size={15} /> Back</>}
          </button>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="wizard-step-counter">{step} of {STEPS.length}</span>
            {step < 3 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                <CheckCircle size={15} /> {employeeToEdit ? 'Save Changes' : 'Add Employee'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, icon, highlight }) {
  return (
    <div className="review-row">
      <div className="review-icon">{icon}</div>
      <div className="review-label">{label}</div>
      <div className={`review-value ${highlight ? 'highlight' : ''}`}>{value || '—'}</div>
    </div>
  );
}
