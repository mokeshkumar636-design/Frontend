import React, { useEffect, useRef, useState } from 'react';
import { Users, Activity, IndianRupee, Clock, TrendingUp } from 'lucide-react';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const frame = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return count;
}

function AnimatedStatCard({ stat }) {
  const numericTarget = typeof stat.raw === 'number' ? stat.raw : null;
  const count = useCountUp(numericTarget ?? 0);
  const displayValue = numericTarget !== null ? stat.formatFn ? stat.formatFn(count) : count : stat.value;

  return (
    <div className="stat-card stat-card-enhanced">
      <div className="stat-info">
        <span className="stat-label">{stat.label}</span>
        <span className="stat-value">{displayValue}</span>
        <div className="stat-change-row">
          {stat.trend && (
            <span className={`stat-trend ${stat.trend === 'up' ? 'trend-up' : stat.trend === 'down' ? 'trend-down' : 'trend-neutral'}`}>
              {stat.trend === 'up' ? '▲' : stat.trend === 'down' ? '▼' : '●'} {stat.trendText}
            </span>
          )}
        </div>
      </div>
      <div className={`stat-icon ${stat.iconClass}`}>
        {stat.icon}
      </div>
      <div className="stat-card-glow" style={{ background: stat.glowColor }} />
    </div>
  );
}

export default function StatsSection({ employees }) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'Inactive').length;

  const totalPayroll = employees.reduce((acc, e) => acc + Number(e.salary || 0), 0);
  const averageSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(val);

  const formatCr = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000)   return `₹${(val / 100000).toFixed(1)} L`;
    return formatCurrency(val);
  };

  const statCards = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      raw: totalEmployees,
      trend: 'up',
      trendText: 'Across all departments',
      icon: <Users size={22} />,
      iconClass: 'info',
      glowColor: 'rgba(6,182,212,0.06)',
    },
    {
      label: 'Active Staff',
      value: activeEmployees,
      raw: activeEmployees,
      trend: 'up',
      trendText: `${inactiveEmployees} inactive`,
      icon: <Activity size={22} />,
      iconClass: 'success',
      glowColor: 'rgba(16,185,129,0.06)',
    },
    {
      label: 'On Leave',
      value: onLeaveEmployees,
      raw: onLeaveEmployees,
      trend: 'neutral',
      trendText: 'Awaiting return',
      icon: <Clock size={22} />,
      iconClass: 'warning',
      glowColor: 'rgba(245,158,11,0.06)',
    },
    {
      label: 'Avg Annual Package',
      value: formatCurrency(averageSalary),
      raw: null,
      trend: 'up',
      trendText: 'CTC per employee',
      icon: <IndianRupee size={22} />,
      iconClass: 'accent',
      glowColor: 'rgba(99,102,241,0.06)',
    },
    {
      label: 'Total Payroll Budget',
      value: formatCr(totalPayroll),
      raw: null,
      trend: 'up',
      trendText: 'Annual workforce cost',
      icon: <TrendingUp size={22} />,
      iconClass: 'danger',
      glowColor: 'rgba(239,68,68,0.06)',
    },
  ];

  return (
    <div className="stats-grid stats-grid-5">
      {statCards.map((stat, idx) => (
        <AnimatedStatCard key={idx} stat={stat} />
      ))}
    </div>
  );
}
