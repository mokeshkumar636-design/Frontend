import React from 'react';
import { Users, Activity, IndianRupee, Clock } from 'lucide-react';

export default function StatsSection({ employees }) {
  const totalEmployees = employees.length;
  
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
  
  const averageSalary = totalEmployees > 0 
    ? Math.round(employees.reduce((acc, curr) => acc + Number(curr.salary || 0), 0) / totalEmployees) 
    : 0;

  // Format currency in Indian Rupees format (e.g. ₹15,00,000)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const statCards = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      changeText: 'Across all departments',
      icon: <Users size={22} />,
      iconClass: 'info'
    },
    {
      label: 'Active Staff',
      value: activeEmployees,
      changeText: `${totalEmployees - activeEmployees - onLeaveEmployees} inactive`,
      icon: <Activity size={22} />,
      iconClass: 'success'
    },
    {
      label: 'On Leave',
      value: onLeaveEmployees,
      changeText: 'Awaiting return',
      icon: <Clock size={22} />,
      iconClass: 'warning'
    },
    {
      label: 'Average Annual Package',
      value: formatCurrency(averageSalary),
      changeText: 'CTC per employee',
      icon: <IndianRupee size={22} />,
      iconClass: 'accent' // Uses primary accent styling
    }
  ];

  return (
    <div className="stats-grid">
      {statCards.map((stat, idx) => (
        <div key={idx} className="stat-card">
          <div className="stat-info">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-change text-secondary" style={{ fontSize: '0.75rem' }}>
              {stat.changeText}
            </span>
          </div>
          <div className={`stat-icon ${stat.iconClass}`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
