import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Calendar, Eye, ChevronUp, ChevronDown, ChevronsUpDown, LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from 'lucide-react';
import EmployeeGrid from './EmployeeGrid';

const PAGE_SIZE = 10;

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

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

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
  return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
}

export default function EmployeeTable({ employees, onEdit, onDelete, onView, role }) {
  const [viewMode, setViewMode] = useState('table');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const isAdmin = role !== 'employee';

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const sorted = useMemo(() => {
    return [...employees].sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (sortKey === 'salary') { va = Number(va); vb = Number(vb); }
      if (sortKey === 'dateOfJoining') { va = new Date(va); vb = new Date(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected = paginated.length > 0 && paginated.every(e => selectedIds.has(e.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(prev => { const next = new Set(prev); paginated.forEach(e => next.delete(e.id)); return next; });
    } else {
      setSelectedIds(prev => { const next = new Set(prev); paginated.forEach(e => next.add(e.id)); return next; });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    selectedIds.forEach(id => onDelete(id));
    setSelectedIds(new Set());
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
        <h3 className="empty-title">No employees found</h3>
        <p className="empty-desc">Try resetting your search or add a new employee record.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Table Toolbar */}
      <div className="table-toolbar">
        {/* Bulk actions */}
        {isAdmin && selectedIds.size > 0 && (
          <div className="bulk-actions-bar">
            <span className="bulk-count">{selectedIds.size} selected</span>
            <button className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }} onClick={handleBulkDelete}>
              <Trash2 size={13} /> Delete Selected
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }} onClick={() => setSelectedIds(new Set())}>
              Clear
            </button>
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{employees.length} records</span>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
            aria-label="Switch to table view"
          >
            <LayoutList size={16} />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            aria-label="Switch to grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <EmployeeGrid
          employees={paginated}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          selectedIds={isAdmin ? selectedIds : null}
          onToggleSelect={isAdmin ? toggleSelect : null}
        />
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="employee-table" style={{ position: 'relative' }}>
            <thead>
              <tr>
                {isAdmin && (
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input type="checkbox" className="row-checkbox" checked={allSelected} onChange={toggleSelectAll} aria-label="Select all" />
                  </th>
                )}
                <th className="sortable-th" onClick={() => handleSort('name')}>
                  <span>Employee</span> <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className="sortable-th" onClick={() => handleSort('department')}>
                  <span>Department & Role</span> <SortIcon col="department" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className="sortable-th" onClick={() => handleSort('salary')}>
                  <span>Salary (INR)</span> <SortIcon col="salary" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className="sortable-th" onClick={() => handleSort('dateOfJoining')}>
                  <span>Joining Date</span> <SortIcon col="dateOfJoining" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className="sortable-th" onClick={() => handleSort('status')}>
                  <span>Status</span> <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(emp => (
                <tr
                  key={emp.id || emp._id}
                  className={selectedIds.has(emp.id) ? 'row-selected' : ''}
                  onClick={() => isAdmin && toggleSelect(emp.id)}
                  style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                >
                  {isAdmin && (
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="row-checkbox"
                        checked={selectedIds.has(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                        aria-label={`Select ${emp.name}`}
                      />
                    </td>
                  )}
                  <td>
                    <div className="employee-profile">
                      <div className="avatar">{getInitials(emp.name)}</div>
                      <div className="employee-details">
                        <span className="employee-name">{emp.name}</span>
                        <span className="employee-id">ID: {emp.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 500 }}>{emp.role}</span>
                      <span className="dept-badge">{emp.department}</span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{formatCurrency(emp.salary)}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={14} />
                      <span>{formatDate(emp.dateOfJoining)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${getStatusClass(emp.status)}`}>{emp.status}</span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                      {onView && (
                        <button className="btn btn-secondary btn-icon-only" title="View Profile" onClick={() => onView(emp)} aria-label={`View ${emp.name}`}>
                          <Eye size={14} />
                        </button>
                      )}
                      {isAdmin && (
                        <>
                          <button className="btn btn-secondary btn-icon-only" title="Edit" onClick={() => onEdit(emp)} aria-label={`Edit ${emp.name}`}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-icon-only" title="Delete" onClick={() => onDelete(emp.id)} aria-label={`Delete ${emp.name}`}>
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <span className="pagination-info">
            Page {page} of {totalPages} • {employees.length} total
          </span>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary btn-icon-only"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`pagination-page-btn ${p === page ? 'active' : ''}`}
                onClick={() => setPage(p)}
                aria-label={`Go to page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            ))}
            <button
              className="btn btn-secondary btn-icon-only"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
