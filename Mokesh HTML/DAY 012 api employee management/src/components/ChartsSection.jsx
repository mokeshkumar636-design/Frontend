import React, { useMemo } from 'react';
import { TrendingUp, Users, IndianRupee, Briefcase } from 'lucide-react';

// ---- Helpers ----
const DEPT_COLORS = {
  Engineering:     '#6366f1',
  Design:          '#ec4899',
  Product:         '#f59e0b',
  'Human Resources': '#10b981',
  QA:              '#06b6d4',
  Marketing:       '#8b5cf6',
  Finance:         '#f97316',
  Operations:      '#3b82f6',
};

const DEFAULT_COLOR = '#6b7280';

function getDeptColor(dept) {
  return DEPT_COLORS[dept] || DEFAULT_COLOR;
}

// ---- Bar Chart ----
function BarChart({ data, title, subtitle }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle">{subtitle}</p>
        </div>
        <div className="chart-icon-wrap">
          <Users size={18} />
        </div>
      </div>
      <div className="bar-chart">
        {data.map((item, i) => (
          <div key={i} className="bar-row">
            <span className="bar-label">{item.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  background: getDeptColor(item.label),
                  animationDelay: `${i * 80}ms`
                }}
              />
            </div>
            <span className="bar-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Donut Chart ----
function DonutChart({ data, title, subtitle }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * r;

  let cumulativePercent = 0;

  const slices = data.map((item, i) => {
    const pct = item.value / total;
    const dashArray = `${pct * circumference} ${circumference}`;
    const offset = circumference * (1 - cumulativePercent);
    cumulativePercent += pct;
    return { ...item, dashArray, offset, pct, color: getDeptColor(item.label) };
  });

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle">{subtitle}</p>
        </div>
        <div className="chart-icon-wrap">
          <Briefcase size={18} />
        </div>
      </div>
      <div className="donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
          {slices.map((slice, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={slice.dashArray}
              strokeDashoffset={-slice.offset + circumference}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease', animationDelay: `${i * 100}ms` }}
            />
          ))}
        </svg>
        <div className="donut-center">
          <span className="donut-total">{total}</span>
          <span className="donut-label">Total</span>
        </div>
      </div>
      <div className="donut-legend">
        {slices.map((s, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            <span className="legend-name">{s.label}</span>
            <span className="legend-pct">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Status Breakdown ----
function StatusBreakdown({ employees }) {
  const active   = employees.filter(e => e.status === 'Active').length;
  const onLeave  = employees.filter(e => e.status === 'On Leave').length;
  const inactive = employees.filter(e => e.status === 'Inactive').length;
  const total = employees.length || 1;

  const bars = [
    { label: 'Active',   value: active,   color: '#10b981', pct: (active / total) * 100 },
    { label: 'On Leave', value: onLeave,  color: '#f59e0b', pct: (onLeave / total) * 100 },
    { label: 'Inactive', value: inactive, color: '#ef4444', pct: (inactive / total) * 100 },
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Employment Status</h3>
          <p className="chart-subtitle">Current workforce breakdown</p>
        </div>
        <div className="chart-icon-wrap" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
          <TrendingUp size={18} />
        </div>
      </div>

      <div className="status-breakdown-bars">
        {bars.map((bar, i) => (
          <div key={i} className="status-breakdown-row">
            <div className="status-breakdown-meta">
              <span className="status-breakdown-label">{bar.label}</span>
              <span className="status-breakdown-count">{bar.value}</span>
            </div>
            <div className="status-breakdown-track">
              <div
                className="status-breakdown-fill"
                style={{ width: `${bar.pct}%`, background: bar.color, animationDelay: `${i * 120}ms` }}
              />
            </div>
            <span className="status-breakdown-pct">{Math.round(bar.pct)}%</span>
          </div>
        ))}
      </div>

      <div className="status-breakdown-summary">
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {active} of {employees.length} employees are currently active
        </p>
      </div>
    </div>
  );
}

// ---- Salary Range Chart ----
function SalaryRangeChart({ employees }) {
  const ranges = [
    { label: '< ₹8L',   min: 0,       max: 800000 },
    { label: '₹8–12L',  min: 800000,  max: 1200000 },
    { label: '₹12–18L', min: 1200000, max: 1800000 },
    { label: '₹18–25L', min: 1800000, max: 2500000 },
    { label: '> ₹25L',  min: 2500000, max: Infinity },
  ];

  const counts = ranges.map(r => ({
    label: r.label,
    value: employees.filter(e => Number(e.salary) >= r.min && Number(e.salary) < r.max).length
  }));

  const max = Math.max(...counts.map(c => c.value), 1);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Salary Distribution</h3>
          <p className="chart-subtitle">Annual CTC ranges across workforce</p>
        </div>
        <div className="chart-icon-wrap" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
          <IndianRupee size={18} />
        </div>
      </div>
      <div className="bar-chart">
        {counts.map((item, i) => (
          <div key={i} className="bar-row">
            <span className="bar-label" style={{ minWidth: '62px' }}>{item.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                  animationDelay: `${i * 80}ms`
                }}
              />
            </div>
            <span className="bar-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Main Export ----
export default function ChartsSection({ employees }) {
  const deptData = useMemo(() => {
    const map = {};
    employees.forEach(e => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [employees]);

  return (
    <div className="charts-grid">
      <BarChart
        data={deptData}
        title="Department Headcount"
        subtitle="Employees per department"
      />
      <DonutChart
        data={deptData}
        title="Department Split"
        subtitle="Proportional breakdown"
      />
      <StatusBreakdown employees={employees} />
      <SalaryRangeChart employees={employees} />
    </div>
  );
}
