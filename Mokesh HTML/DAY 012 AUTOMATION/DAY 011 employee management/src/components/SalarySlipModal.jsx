import React, { useState } from 'react';
import { X, Download, FileText, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SalarySlipModal({ isOpen, onClose, employee }) {
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !employee) return null;

  // Salary calculations (Monthly Breakdown based on Annual CTC)
  const annualCTC = Number(employee.salary || 0);
  const monthlyGross = Math.round(annualCTC / 12);
  
  // Earnings
  const basicPay = Math.round(monthlyGross * 0.50); // 50% basic
  const hra = Math.round(basicPay * 0.40); // 40% of basic
  const specialAllowance = monthlyGross - basicPay - hra;

  // Deductions
  const pf = Math.round(basicPay * 0.12); // 12% of basic for PF
  const professionalTax = 200; // Flat Professional Tax
  const healthInsurance = 1000; // Mock health insurance deduction
  const totalDeductions = pf + professionalTax + healthInsurance;

  const netSalary = monthlyGross - totalDeductions;

  // Format currency helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Styling parameters
      const leftMargin = 15;
      let currentY = 15;

      // Header Banner
      doc.setFillColor(11, 15, 25); // Dark primary color
      doc.rect(0, 0, 210, 35, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('CR7 SPORTS CORPORATION', leftMargin, 16);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Enterprise Human Resource Management Systems & Payroll', leftMargin, 22);
      doc.text(`PAYSLIP FOR THE MONTH OF: ${selectedMonth.toUpperCase()} ${selectedYear}`, leftMargin, 28);

      // Reset text color
      doc.setTextColor(15, 23, 42);
      currentY = 48;

      // Employee Information Block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('EMPLOYEE DETAILS', leftMargin, currentY);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(leftMargin, currentY + 2, 195, currentY + 2);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      // Column 1
      doc.text(`Employee ID: ${employee.id}`, leftMargin, currentY);
      doc.text(`Full Name: ${employee.name}`, leftMargin, currentY + 6);
      doc.text(`Department: ${employee.department}`, leftMargin, currentY + 12);

      // Column 2
      const col2X = 110;
      doc.text(`Designation: ${employee.role}`, col2X, currentY);
      doc.text(`Email Address: ${employee.email}`, col2X, currentY + 6);
      doc.text(`Date of Joining: ${employee.dateOfJoining}`, col2X, currentY + 12);
      
      currentY += 22;

      // Draw Earnings & Deductions Tables
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('SALARY BREAKDOWN', leftMargin, currentY);
      doc.line(leftMargin, currentY + 2, 195, currentY + 2);
      currentY += 8;

      // Table Headers
      doc.setFillColor(248, 250, 252);
      doc.rect(leftMargin, currentY, 180, 7, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Earnings Description', leftMargin + 3, currentY + 5);
      doc.text('Amount (INR)', leftMargin + 65, currentY + 5);
      doc.text('Deductions Description', leftMargin + 93, currentY + 5);
      doc.text('Amount (INR)', leftMargin + 155, currentY + 5);
      
      currentY += 7;

      // Table rows
      const items = [
        { earnLabel: 'Basic Pay', earnVal: basicPay, deductLabel: 'Provident Fund (PF)', deductVal: pf },
        { earnLabel: 'House Rent Allowance (HRA)', earnVal: hra, deductLabel: 'Professional Tax (PT)', deductVal: professionalTax },
        { earnLabel: 'Special Allowance', earnVal: specialAllowance, deductLabel: 'Health Insurance', deductVal: healthInsurance }
      ];

      doc.setFont('helvetica', 'normal');
      items.forEach((item, idx) => {
        // Alternating background
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(leftMargin, currentY, 180, 8, 'F');
        }
        
        doc.text(item.earnLabel, leftMargin + 3, currentY + 5.5);
        doc.text(formatCurrency(item.earnVal), leftMargin + 65, currentY + 5.5);
        doc.text(item.deductLabel, leftMargin + 93, currentY + 5.5);
        doc.text(formatCurrency(item.deductVal), leftMargin + 155, currentY + 5.5);
        
        currentY += 8;
      });

      // Draw totals border lines
      doc.setDrawColor(203, 213, 225);
      doc.line(leftMargin, currentY, 195, currentY);
      currentY += 1;

      // Totals row
      doc.setFont('helvetica', 'bold');
      doc.text('Gross Earnings:', leftMargin + 3, currentY + 5.5);
      doc.text(formatCurrency(monthlyGross), leftMargin + 65, currentY + 5.5);
      doc.text('Total Deductions:', leftMargin + 93, currentY + 5.5);
      doc.text(formatCurrency(totalDeductions), leftMargin + 155, currentY + 5.5);
      
      currentY += 10;
      doc.line(leftMargin, currentY, 195, currentY);
      currentY += 8;

      // Net Take-Home block
      doc.setFillColor(241, 245, 249);
      doc.rect(leftMargin, currentY, 180, 16, 'F');
      
      doc.setFontSize(12);
      doc.text('NET TAKE-HOME PAY (MONTHLY):', leftMargin + 5, currentY + 10.5);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(formatCurrency(netSalary), leftMargin + 120, currentY + 10.5);

      currentY += 30;

      // Signatures block
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Employee Signature', leftMargin + 10, currentY);
      doc.text('Authorized Signatory', col2X + 25, currentY);

      doc.setDrawColor(148, 163, 184);
      doc.line(leftMargin + 5, currentY - 8, leftMargin + 55, currentY - 8);
      doc.line(col2X + 15, currentY - 8, col2X + 65, currentY - 8);

      currentY += 20;

      // System Footer
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is a system generated salary slip and does not require a physical signature.', leftMargin, currentY);
      
      // Save PDF
      doc.save(`Payslip_${employee.name.replace(/\s+/g, '_')}_${selectedMonth}_${selectedYear}.pdf`);
      
      // Show success feedback
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF salary slip. See console logs for details.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '650px', width: '95%' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText className="text-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="modal-title">Employee Salary Slip</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Period selector */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Select Payroll Period:</span>
            
            <select 
              className="select-field" 
              style={{ minWidth: '120px' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select 
              className="select-field" 
              style={{ minWidth: '90px' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          {/* Visual Salary Slip Card preview */}
          <div style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            fontSize: '0.875rem'
          }}>
            {/* Slip Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>CR7 Sports Portal</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Corporate Payroll Receipt</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '600', color: 'var(--accent-primary)', fontSize: '0.8125rem' }}>
                  {selectedMonth} {selectedYear} Period
                </span>
              </div>
            </div>

            {/* Slip Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p><span style={{ color: 'var(--text-muted)' }}>Emp ID:</span> <span style={{ fontWeight: '500' }}>{employee.id}</span></p>
                <p><span style={{ color: 'var(--text-muted)' }}>Name:</span> <span style={{ fontWeight: '500' }}>{employee.name}</span></p>
                <p><span style={{ color: 'var(--text-muted)' }}>Dept:</span> <span>{employee.department}</span></p>
              </div>
              <div>
                <p><span style={{ color: 'var(--text-muted)' }}>Designation:</span> <span>{employee.role}</span></p>
                <p><span style={{ color: 'var(--text-muted)' }}>Email:</span> <span style={{ fontSize: '0.8125rem' }}>{employee.email}</span></p>
                <p><span style={{ color: 'var(--text-muted)' }}>CTC:</span> <span style={{ fontWeight: '500' }}>{formatCurrency(employee.salary)}/year</span></p>
              </div>
            </div>

            {/* Calculations Breakdown split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Earnings column */}
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.8125rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Earnings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Basic Salary</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(basicPay)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>HRA</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(hra)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Special Allowance</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(specialAllowance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.375rem', fontWeight: '600' }}>
                    <span>Gross Earnings</span>
                    <span>{formatCurrency(monthlyGross)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions column */}
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.8125rem', marginBottom: '0.5rem', color: 'var(--danger)' }}>Deductions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Provident Fund (PF)</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(pf)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Professional Tax</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(professionalTax)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Health Insurance</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(healthInsurance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.375rem', fontWeight: '600' }}>
                    <span>Total Deductions</span>
                    <span>{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net pay summary footer block */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Net Take-Home Salary:</span>
              <span style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--accent-primary)' }}>
                {formatCurrency(netSalary)}
              </span>
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          
          <button 
            type="button" 
            className={`btn ${downloadSuccess ? 'btn-success' : 'btn-primary'}`} 
            onClick={handleDownloadPDF}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: downloadSuccess ? 'var(--success)' : '' }}
          >
            {downloadSuccess ? (
              <>
                <Check size={16} /> Salary Slip Downloaded
              </>
            ) : (
              <>
                <Download size={16} /> Download PDF Slip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
