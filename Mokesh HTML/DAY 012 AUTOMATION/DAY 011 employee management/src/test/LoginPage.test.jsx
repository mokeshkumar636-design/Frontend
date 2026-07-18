import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../components/LoginPage';

describe('LoginPage', () => {
  // ─── Rendering ────────────────────────────────────────────────────────────
  it('renders the login page with admin and employee tabs', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    expect(screen.getByText('Admin Sign-in')).toBeInTheDocument();
    expect(screen.getByText('Employee Sign-in')).toBeInTheDocument();
  });

  it('shows Admin Portal heading by default', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
  });

  it('renders username and password input fields', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    expect(screen.getByLabelText(/Admin Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders the Sign In button', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  // ─── Tab Switching ─────────────────────────────────────────────────────────
  it('switches to Employee Portal heading when employee tab is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.click(screen.getByText('Employee Sign-in'));
    expect(screen.getByText('Employee Portal')).toBeInTheDocument();
  });

  it('changes label to Employee ID / Email after switching to employee tab', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.click(screen.getByText('Employee Sign-in'));
    expect(screen.getByLabelText(/Employee ID \/ Email/i)).toBeInTheDocument();
  });

  it('clears inputs when switching between tabs', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.type(screen.getByLabelText(/Admin Username/i), 'admin');
    await user.click(screen.getByText('Employee Sign-in'));
    await user.click(screen.getByText('Admin Sign-in'));
    expect(screen.getByLabelText(/Admin Username/i)).toHaveValue('');
  });

  // ─── Validation ───────────────────────────────────────────────────────────
  it('shows error when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  it('shows error when only username is filled', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.type(screen.getByLabelText(/Admin Username/i), 'admin');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  // ─── Admin Login ──────────────────────────────────────────────────────────
  it('calls onLogin with "admin" for correct admin credentials', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);
    await user.type(screen.getByLabelText(/Admin Username/i), 'admin');
    await user.type(screen.getByLabelText(/Password/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('admin', null);
    }, { timeout: 2000 });
  });

  it('shows error for wrong admin credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.type(screen.getByLabelText(/Admin Username/i), 'wronguser');
    await user.type(screen.getByLabelText(/Password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => {
      expect(screen.getByText('Invalid admin credentials')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows Authenticating... text while loading', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={vi.fn()} />);
    await user.type(screen.getByLabelText(/Admin Username/i), 'admin');
    await user.type(screen.getByLabelText(/Password/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });

  // ─── Employee Login ───────────────────────────────────────────────────────
  it('calls onLogin with "employee" for correct employee credentials', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();

    // Seed localStorage with an employee
    const emp = {
      id: 'EMP-1001',
      name: 'Ramesh Krishnan',
      email: 'ramesh.k@company.com',
      status: 'Active',
    };
    localStorage.setItem('employees_list', JSON.stringify([emp]));

    render(<LoginPage onLogin={onLogin} />);
    await user.click(screen.getByText('Employee Sign-in'));
    await user.type(screen.getByLabelText(/Employee ID \/ Email/i), 'EMP-1001');
    await user.type(screen.getByLabelText(/Password/i), 'employee123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('employee', emp);
    }, { timeout: 2000 });
  });

  it('shows error for employee login with wrong password', async () => {
    const user = userEvent.setup();
    const emp = { id: 'EMP-1001', name: 'Ramesh', email: 'r@company.com' };
    localStorage.setItem('employees_list', JSON.stringify([emp]));

    render(<LoginPage onLogin={vi.fn()} />);
    await user.click(screen.getByText('Employee Sign-in'));
    await user.type(screen.getByLabelText(/Employee ID \/ Email/i), 'EMP-1001');
    await user.type(screen.getByLabelText(/Password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid Employee ID/Email or password')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
