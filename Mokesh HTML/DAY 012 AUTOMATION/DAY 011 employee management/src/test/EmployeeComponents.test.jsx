import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFormModal from '../components/EmployeeFormModal';
import StatsSection from '../components/StatsSection';

// ─── Sample employees ────────────────────────────────────────────────────────
const SAMPLE_EMPLOYEES = [
  {
    id: 'EMP-1001',
    name: 'Ramesh Krishnan',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'ramesh.k@company.com',
    phone: '+91 98401 23456',
    salary: 1800000,
    dateOfJoining: '2021-03-15',
    status: 'Active',
  },
  {
    id: 'EMP-1002',
    name: 'Priya Swaminathan',
    role: 'Lead UI/UX Designer',
    department: 'Design',
    email: 'priya.s@company.com',
    phone: '+91 98402 34567',
    salary: 1500000,
    dateOfJoining: '2022-05-10',
    status: 'On Leave',
  },
  {
    id: 'EMP-1003',
    name: 'Venkatesh Prasad',
    role: 'Product Manager',
    department: 'Product',
    email: 'venkatesh.p@company.com',
    phone: '+91 98403 45678',
    salary: 2000000,
    dateOfJoining: '2020-11-01',
    status: 'Inactive',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EmployeeTable Tests
// ═══════════════════════════════════════════════════════════════════════════════
describe('EmployeeTable', () => {
  it('renders all employee rows', () => {
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Ramesh Krishnan')).toBeInTheDocument();
    expect(screen.getByText('Priya Swaminathan')).toBeInTheDocument();
    expect(screen.getByText('Venkatesh Prasad')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByText('Department & Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('shows empty state message when no employees', () => {
    render(<EmployeeTable employees={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
  });

  it('displays correct status pills for each employee', () => {
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('status-EMP-1001')).toHaveTextContent('Active');
    expect(screen.getByTestId('status-EMP-1002')).toHaveTextContent('On Leave');
    expect(screen.getByTestId('status-EMP-1003')).toHaveTextContent('Inactive');
  });

  it('displays employee departments', () => {
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('calls onEdit with correct employee when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={onEdit} onDelete={vi.fn()} />);
    await user.click(screen.getByTestId('edit-btn-EMP-1001'));
    expect(onEdit).toHaveBeenCalledWith(SAMPLE_EMPLOYEES[0]);
  });

  it('calls onDelete with correct id when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={vi.fn()} onDelete={onDelete} />);
    await user.click(screen.getByTestId('delete-btn-EMP-1002'));
    expect(onDelete).toHaveBeenCalledWith('EMP-1002');
  });

  it('formats salary in Indian Rupees', () => {
    render(<EmployeeTable employees={[SAMPLE_EMPLOYEES[0]]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // 1800000 → ₹18,00,000
    expect(screen.getByText(/18,00,000/)).toBeInTheDocument();
  });

  it('shows employee IDs', () => {
    render(<EmployeeTable employees={SAMPLE_EMPLOYEES} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('ID: EMP-1001')).toBeInTheDocument();
    expect(screen.getByText('ID: EMP-1002')).toBeInTheDocument();
  });

  it('renders avatar initials from employee name', () => {
    render(<EmployeeTable employees={[SAMPLE_EMPLOYEES[0]]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // Ramesh Krishnan → RK
    expect(screen.getByText('RK')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EmployeeFormModal Tests
// ═══════════════════════════════════════════════════════════════════════════════
describe('EmployeeFormModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    employeeToEdit: null,
  };

  it('does not render when isOpen is false', () => {
    render(<EmployeeFormModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('renders "Add New Employee" title for new employee', () => {
    render(<EmployeeFormModal {...defaultProps} />);
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Add New Employee');
  });

  it('renders "Edit Employee Record" title when editing', () => {
    render(<EmployeeFormModal {...defaultProps} employeeToEdit={SAMPLE_EMPLOYEES[0]} />);
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Edit Employee Record');
  });

  it('pre-fills form fields when editing an employee', () => {
    render(<EmployeeFormModal {...defaultProps} employeeToEdit={SAMPLE_EMPLOYEES[0]} />);
    expect(screen.getByTestId('input-name')).toHaveValue('Ramesh Krishnan');
    expect(screen.getByTestId('input-email')).toHaveValue('ramesh.k@company.com');
    expect(screen.getByTestId('input-role')).toHaveValue('Senior Software Engineer');
  });

  it('shows validation error when name is empty on submit', async () => {
    const user = userEvent.setup();
    render(<EmployeeFormModal {...defaultProps} />);
    await user.click(screen.getByTestId('btn-save'));
    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<EmployeeFormModal {...defaultProps} />);
    await user.type(screen.getByTestId('input-name'), 'Test User');
    await user.type(screen.getByTestId('input-role'), 'Engineer');
    await user.type(screen.getByTestId('input-email'), 'not-an-email');
    await user.type(screen.getByTestId('input-phone'), '+91 9999999999');
    await user.type(screen.getByTestId('input-salary'), '1200000');
    await user.type(screen.getByTestId('input-doj'), '2024-01-01');
    await user.click(screen.getByTestId('btn-save'));
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('calls onSave with correct data when form is valid', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EmployeeFormModal {...defaultProps} onSave={onSave} />);

    await user.type(screen.getByTestId('input-name'), 'New Employee');
    await user.type(screen.getByTestId('input-role'), 'Developer');
    await user.type(screen.getByTestId('input-email'), 'new@company.com');
    await user.type(screen.getByTestId('input-phone'), '+91 9876543210');
    await user.type(screen.getByTestId('input-salary'), '1000000');
    await user.type(screen.getByTestId('input-doj'), '2024-06-01');
    await user.click(screen.getByTestId('btn-save'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Employee',
        email: 'new@company.com',
        salary: 1000000,
      })
    );
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<EmployeeFormModal {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when modal overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<EmployeeFormModal {...defaultProps} onClose={onClose} />);
    // Click the overlay (role="dialog")
    await user.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders all department options in the select', () => {
    render(<EmployeeFormModal {...defaultProps} />);
    const select = screen.getByTestId('select-department');
    expect(within(select).getByText('Engineering')).toBeInTheDocument();
    expect(within(select).getByText('Design')).toBeInTheDocument();
    expect(within(select).getByText('Human Resources')).toBeInTheDocument();
  });

  it('renders all status options', () => {
    render(<EmployeeFormModal {...defaultProps} />);
    const select = screen.getByTestId('select-status');
    expect(within(select).getByText('Active')).toBeInTheDocument();
    expect(within(select).getByText('On Leave')).toBeInTheDocument();
    expect(within(select).getByText('Inactive')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// StatsSection Integration
// ═══════════════════════════════════════════════════════════════════════════════
describe('StatsSection with SAMPLE_EMPLOYEES', () => {
  it('counts 3 total employees', () => {
    render(<StatsSection employees={SAMPLE_EMPLOYEES} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('counts 1 active employee', () => {
    render(<StatsSection employees={SAMPLE_EMPLOYEES} />);
    // Both 'Active Staff' and 'On Leave' show '1' — use getAllByText
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(2);
  });

  it('shows "1 inactive" note on Active Staff card', () => {
    render(<StatsSection employees={SAMPLE_EMPLOYEES} />);
    // 1 inactive among 3
    expect(screen.getByText('1 inactive')).toBeInTheDocument();
  });
});
