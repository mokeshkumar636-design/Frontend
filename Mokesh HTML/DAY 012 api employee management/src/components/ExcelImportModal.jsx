import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedEmployees, setParsedEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [serverNotice, setServerNotice] = useState(null);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setError('Unsupported file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
      setFile(null);
      setParsedEmployees([]);
      return;
    }
    setError(null);
    setFile(file);
    uploadAndParseFile(file);
  };

  const uploadAndParseFile = async (selectedFile) => {
    setLoading(true);
    setParsedEmployees([]);
    setServerNotice(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // First attempt: Connect to the port 5000 Express backend
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with code ${response.status}`);
      }

      const result = await response.json();
      
      if (result.employees && result.employees.length > 0) {
        setParsedEmployees(result.employees);
        setServerNotice('Success: Parsed successfully using Express server backend.');
      } else {
        throw new Error('No employees could be parsed from the file.');
      }
    } catch (err) {
      console.warn("Backend server not available or failed. Falling back to local client-side XLSX parsing...", err);
      
      // Fallback: Parse the Excel sheet directly on the client using the sheet reader
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);
            
            if (rows.length === 0) {
              setError('Excel file is empty or has no readable rows.');
              setLoading(false);
              return;
            }

            const mapped = rows.map((row) => {
              const findValue = (keys) => {
                const foundKey = Object.keys(row).find(k => 
                  keys.some(key => k.toLowerCase().trim() === key.toLowerCase().trim())
                );
                return foundKey ? row[foundKey] : undefined;
              };

              const name = findValue(['Name', 'Full Name', 'Employee Name', 'Username']) || '';
              const role = findValue(['Role', 'Designation', 'Job Title', 'Position']) || '';
              const department = findValue(['Department', 'Dept']) || 'Engineering';
              const email = findValue(['Email', 'Email Address', 'Mail']) || '';
              const phone = findValue(['Phone', 'Phone Number', 'Contact', 'Mobile']) || '';
              const salary = Number(findValue(['Salary', 'CTC', 'Annual CTC', 'Pay']) || 0);
              const dateOfJoining = findValue(['Date of Joining', 'Joining Date', 'DateOfJoining', 'DOJ']) || new Date().toISOString().split('T')[0];
              const status = findValue(['Status', 'Employment Status', 'ActiveStatus']) || 'Active';

              return {
                name,
                role,
                department,
                email,
                phone: String(phone),
                salary,
                dateOfJoining,
                status
              };
            });

            setParsedEmployees(mapped);
            setServerNotice('Notice: Local parser fallback active (Express server offline/unreachable on port 5000).');
          } catch (innerErr) {
            setError(`Local parsing error: ${innerErr.message}`);
          }
          setLoading(false);
        };
        
        reader.onerror = () => {
          setError('Failed to read the file.');
          setLoading(false);
        };
        
        reader.readAsArrayBuffer(selectedFile);
        return; // Don't turn off loading until reader completes
      } catch (clientErr) {
        setError(`Failed to parse file: ${clientErr.message}`);
      }
    }
    
    setLoading(false);
  };

  const handleConfirmImport = () => {
    if (parsedEmployees.length > 0) {
      onImport(parsedEmployees);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedEmployees([]);
    setError(null);
    setServerNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if a row has basic validation issues
  const validateRow = (row) => {
    const issues = [];
    if (!row.name || row.name.trim().length < 3) issues.push('Name too short');
    if (!row.role) issues.push('Role missing');
    if (!row.email || !row.email.includes('@')) issues.push('Invalid email');
    if (!row.phone || row.phone.trim().length < 8) issues.push('Invalid phone');
    if (isNaN(row.salary) || row.salary <= 0) issues.push('Invalid CTC');
    return issues;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '850px', width: '95%' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet className="text-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="modal-title">Bulk Import Employees</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Server notice alert box */}
          {serverNotice && (
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.8125rem',
              backgroundColor: serverNotice.includes('fallback') ? 'var(--warning-bg)' : 'var(--success-bg)',
              color: serverNotice.includes('fallback') ? 'var(--warning)' : 'var(--success)',
              border: `1px solid ${serverNotice.includes('fallback') ? 'var(--warning-border)' : 'var(--success-border)'}`
            }}>
              {serverNotice.includes('fallback') ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              <span>{serverNotice}</span>
            </div>
          )}

          {/* Drag & drop upload area */}
          {!file && (
            <div 
              className={`upload-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragActive ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: dragActive ? 'var(--accent-primary)' : 'var(--border-color)',
                transition: 'all var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                style={{ display: 'none' }}
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifycontent: 'center',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                justifyContent: 'center'
              }}>
                <Upload size={24} />
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Drag and drop your spreadsheet here</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
                </p>
              </div>
              <button type="button" className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
                Select File
              </button>
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              fontSize: '0.8125rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 0',
              gap: '1rem'
            }}>
              <div className="avatar" style={{
                animation: 'spin 1s linear infinite',
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-primary)',
                background: 'transparent',
                borderRadius: '50%'
              }} />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uploading and parsing spreadsheet...</span>
            </div>
          )}

          {/* File Selected & Preview */}
          {file && !loading && parsedEmployees.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileSpreadsheet size={20} className="text-secondary" />
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{file.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {(file.size / 1024).toFixed(1)} KB • {parsedEmployees.length} rows found
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleReset} 
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Change File
                </button>
              </div>

              {/* Table Preview of Excel Records */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={16} /> Spreadsheet Data Preview
                </h3>
                <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
                  <table className="employee-table" style={{ fontSize: '0.8125rem' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department & Role</th>
                        <th>Email & Phone</th>
                        <th>Salary</th>
                        <th>Joining Date</th>
                        <th>Status</th>
                        <th>Validation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedEmployees.map((emp, index) => {
                        const issues = validateRow(emp);
                        const hasErrors = issues.length > 0;
                        return (
                          <tr key={index} style={{
                            backgroundColor: hasErrors ? 'rgba(239, 68, 68, 0.03)' : 'transparent'
                          }}>
                            <td>
                              <span style={{ fontWeight: '600', color: hasErrors ? 'var(--danger)' : 'var(--text-primary)' }}>
                                {emp.name || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Missing</span>}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{emp.role || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Missing</span>}</span>
                                <span className="dept-badge" style={{ alignSelf: 'flex-start', marginTop: '0.125rem', fontSize: '0.6875rem', padding: '1px 6px' }}>
                                  {emp.department}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{emp.email || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Missing</span>}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{emp.phone || '-'}</span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontWeight: '500' }}>{formatCurrency(emp.salary)}</span>
                            </td>
                            <td>
                              <span>{emp.dateOfJoining}</span>
                            </td>
                            <td>
                              <span className="status-pill status-active" style={{ fontSize: '0.6875rem', padding: '1px 6px' }}>
                                {emp.status}
                              </span>
                            </td>
                            <td>
                              {hasErrors ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                                  {issues.map((iss, i) => (
                                    <span key={i} style={{ color: 'var(--danger)', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      ⚠️ {iss}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  ✅ Ready
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleConfirmImport}
            disabled={parsedEmployees.length === 0 || loading}
          >
            Import {parsedEmployees.length > 0 ? `${parsedEmployees.length} ` : ''}Employees
          </button>
        </div>
      </div>
    </div>
  );
}
