import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsSection from '../components/StatsSection';

// ─── Sample Data ────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id: 'EMP-1', name: 'Alice', status: 'Active',   salary: 1200000, department: 'Engineering' },
  { id: 'EMP-2', name: 'Bob',   status: 'Active',   salary: 1800000, department: 'Design'      },
  { id: 'EMP-3', name: 'Carol', status: 'On Leave', salary: 900000,  department: 'QA'          },
  { id: 'EMP-4', name: 'Dave',  status: 'Inactive', salary: 600000,  department: 'Marketing'   },
];

describe('StatsSection', () => {
  it('renders 4 stat cards', () => {
    render(<StatsSection employees={EMPLOYEES} />);
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Active Staff')).toBeInTheDocument();
    expect(screen.getByText('On Leave')).toBeInTheDocument();
    expect(screen.getByText('Average Annual Package')).toBeInTheDocument();
  });

  it('shows correct total employee count', () => {
    render(<StatsSection employees={EMPLOYEES} />);
    // "4" should appear as the total employees value
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows correct active employee count', () => {
    render(<StatsSection employees={EMPLOYEES} />);
    // 2 active employees
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows correct on-leave employee count', () => {
    render(<StatsSection employees={EMPLOYEES} />);
    // 1 on leave
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows "1 inactive" text in the active staff card', () => {
    render(<StatsSection employees={EMPLOYEES} />);
    expect(screen.getByText('1 inactive')).toBeInTheDocument();
  });

  it('renders with empty employee list without crashing', () => {
    render(<StatsSection employees={[]} />);
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    // Multiple stat cards all show '0' — use getAllByText
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });

  it('shows average salary formatted in Indian Rupees (₹)', () => {
    render(<StatsSection employees={EMPLOYEES} />);
    // Average = (1200000+1800000+900000+600000)/4 = 1125000
    // In en-IN format: ₹11,25,000
    expect(screen.getByText(/₹/)).toBeInTheDocument();
  });

  it('calculates average salary correctly', () => {
    const employees = [
      { id: 'E1', name: 'A', status: 'Active', salary: 1000000 },
      { id: 'E2', name: 'B', status: 'Active', salary: 2000000 },
    ];
    render(<StatsSection employees={employees} />);
    // Average = 1500000 → formatted as ₹15,00,000
    expect(screen.getByText(/15,00,000/)).toBeInTheDocument();
  });
});
