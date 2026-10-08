import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  FileCheck2,
  CalendarCheck,
  Award,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Fingerprint,
  Plus,
  Receipt,
  FileText,
  UserPlus,
  Building2,
  ChevronDown,
  Megaphone,
  CalendarDays,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BarChart2,
  ShieldCheck,
  Package,
  BookMarked,
  AlertTriangle,
  Send,
  CheckSquare,
  Search,
  Printer
} from 'lucide-react';

export default function Dashboard({
  stats,
  selectedInstitution,
  currentUser,
  setActiveTab,
  onSyncBiometrics,
  isSyncingBiometrics
}) {
  const role = currentUser?.role || 'Admin';

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  // Render Role-Specific Dashboard View
  if (role === 'Principal') {
    return (
      <PrincipalDashboard
        stats={stats}
        selectedInstitution={selectedInstitution}
        currentUser={currentUser}
        setActiveTab={setActiveTab}
        formatCurrency={formatCurrency}
      />
    );
  }

  if (role === 'Clerk') {
    return (
      <ClerkDashboard
        stats={stats}
        selectedInstitution={selectedInstitution}
        currentUser={currentUser}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (role === 'Faculty') {
    return (
      <FacultyDashboard
        stats={stats}
        selectedInstitution={selectedInstitution}
        currentUser={currentUser}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (role === 'Account' || role === 'Accountant') {
    return (
      <AccountantDashboard
        stats={stats}
        selectedInstitution={selectedInstitution}
        currentUser={currentUser}
        setActiveTab={setActiveTab}
        formatCurrency={formatCurrency}
      />
    );
  }

  if (role === 'Store' || role === 'Store Officer') {
    return (
      <StoreDashboard
        stats={stats}
        selectedInstitution={selectedInstitution}
        currentUser={currentUser}
        setActiveTab={setActiveTab}
        formatCurrency={formatCurrency}
      />
    );
  }

  if (role === 'Librarian') {
    return (
      <LibrarianDashboard
        stats={stats}
        selectedInstitution={selectedInstitution}
        currentUser={currentUser}
        setActiveTab={setActiveTab}
        formatCurrency={formatCurrency}
      />
    );
  }

  // DEFAULT / ADMIN DASHBOARD (Executive Chairman View)
  return (
    <AdminDashboard
      stats={stats}
      selectedInstitution={selectedInstitution}
      currentUser={currentUser}
      setActiveTab={setActiveTab}
      formatCurrency={formatCurrency}
    />
  );
}

// =============================================================================
// 1. ADMIN DASHBOARD (Executive Chairman View)
// =============================================================================
function AdminDashboard({ stats, selectedInstitution, currentUser, setActiveTab, formatCurrency }) {
  const [enrollmentYearFilter, setEnrollmentYearFilter] = useState('This Academic Year');
  const [feeTrendFilter, setFeeTrendFilter] = useState('Monthly');

  const enrollmentMonths = [
    { m: 'Apr', h: 35 },
    { m: 'May', h: 48 },
    { m: 'Jun', h: 65 },
    { m: 'Jul', h: 80 },
    { m: 'Aug', h: 95 },
    { m: 'Sep', h: 125, active: true },
    { m: 'Oct', h: 88 },
    { m: 'Nov', h: 92 },
    { m: 'Dec', h: 100 },
    { m: 'Jan', h: 110 },
    { m: 'Feb', h: 120 },
    { m: 'Mar', h: 115 }
  ];

  return (
    <div>
      <div className="hero-campus-banner">
        <div className="hero-left-content">
          <div className="hero-tag-row">
            <span className="hero-gold-badge">EXECUTIVE ADMIN PORTAL</span>
            <span className="hero-inst-code">
              Institutional Code: <strong>{selectedInstitution?.code || 'SD-MBA-MCA'}</strong>
            </span>
          </div>

          <h1 className="hero-title">
            {selectedInstitution?.name || 'Sant Dnyaneshwar MBA & MCA College'}
          </h1>

          <div className="hero-subtext-row">
            <span className="hero-portal-name">Belhekar Campus Executive Control Desk</span>
            <span className="hero-user-badge">
              • Welcome back, <strong>{currentUser?.full_name || 'Dr. S. K. Belhekar (Chairman)'}</strong> (Admin) 👋
            </span>
          </div>

          <div className="hero-features-pills">
            <div className="feature-pill">
              <BookOpen size={13} color="#d97706" />
              <span>Excellence in Education</span>
            </div>
            <div className="feature-pill">
              <Users size={13} color="#0284c7" />
              <span>Empowering Future Leaders</span>
            </div>
            <div className="feature-pill">
              <Award size={13} color="#b45309" />
              <span>Innovation & Opportunities</span>
            </div>
            <div className="feature-pill">
              <GraduationCap size={13} color="#dc2626" />
              <span>Placement for Brighter Tomorrow</span>
            </div>
          </div>
        </div>

        <div className="hero-right-illustration">
          <div className="campus-graphic-container">
            <img
              src="/campus_banner.jpg"
              alt="Campus Banner"
              className="campus-photo-banner"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="campus-photo-overlay" />
            <div className="campus-quote-overlay">
              <div className="cursive-motto">Knowledge Today</div>
              <div className="cursive-motto highlight-underline">Leaders Tomorrow</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-action-bar">
        <button className="btn-hero-action green" onClick={() => setActiveTab('accounts')}>
          <Plus size={15} />
          <span>Collect Student Fee</span>
        </button>
        <button className="btn-hero-action blue" onClick={() => setActiveTab('students')}>
          <FileCheck2 size={15} />
          <span>Print Official Documents</span>
        </button>
        <button className="btn-hero-action purple" onClick={() => setActiveTab('compliance')}>
          <BarChart2 size={15} />
          <span>View Compliance Reports</span>
        </button>
      </div>

      <div className="kpi-five-grid">
        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● ACTIVE STUDENTS</span>
            <div className="kpi-icon-pill"><GraduationCap size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.totalStudents || 2}</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-success kpi-badge-pill">✓ 100% Verified</span>
            <span>Digital Profiles & CAP Enrolled</span>
          </div>
        </div>

        <div className="kpi-card purple">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● FACULTY & STAFF</span>
            <div className="kpi-icon-pill"><Users size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.totalFaculty || 2}</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-info kpi-badge-pill" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
              UGC / AICTE
            </span>
            <span>Approved Cadre</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● TOTAL FEE INFLOW</span>
            <div className="kpi-icon-pill"><span style={{ fontWeight: '800', fontSize: '14px' }}>₹</span></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">₹{(stats?.totalIncome || 90250).toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Tuition, Development & Scholarships</span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● INSTITUTIONAL OUTFLOW</span>
            <div className="kpi-icon-pill"><ArrowUpRight size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">₹{(stats?.totalExpenditure || 180050).toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Payroll, Cheques & Vouchers</span>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● BIOMETRIC ATTENDANCE</span>
            <div className="kpi-icon-pill"><Fingerprint size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.attendanceRate || 93}%</div>
          </div>
          <div className="kpi-card-footer">
            <span>ESSL & Hikvision Live Ratio</span>
          </div>
        </div>
      </div>

      <div className="middle-dashboard-grid">
        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={15} />
              </div>
              <span>Student Enrollment Overview</span>
            </div>
            <select className="dash-card-dropdown" value={enrollmentYearFilter} onChange={(e) => setEnrollmentYearFilter(e.target.value)}>
              <option value="This Academic Year">This Academic Year</option>
              <option value="Last Academic Year">Last Academic Year</option>
            </select>
          </div>
          <div style={{ position: 'relative', marginTop: '12px', height: '170px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ marginLeft: '10px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' }}>
              {enrollmentMonths.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  {item.active && (
                    <div style={{ position: 'absolute', top: -36, background: '#0f172a', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '700', zIndex: 10 }}>
                      Sep: 125 Students
                    </div>
                  )}
                  <div style={{ width: '14px', height: `${(item.h / 150) * 110}px`, background: item.active ? '#1e40af' : '#93c5fd', borderRadius: '4px 4px 2px 2px' }} />
                  <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px' }}>{item.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '13px' }}>₹</span>
              </div>
              <span>Fee Collection Trend</span>
            </div>
            <select className="dash-card-dropdown" value={feeTrendFilter} onChange={(e) => setFeeTrendFilter(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
          <div style={{ position: 'relative', marginTop: '12px', height: '170px' }}>
            <svg viewBox="0 0 340 120" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
              <path d="M 10,70 Q 50,60 90,52 T 180,32 T 260,48 T 330,22" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 10,80 Q 50,85 90,82 T 180,88 T 260,84 T 330,78" fill="none" stroke="#f43f5e" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <span style={{ color: '#f59e0b' }}>⚡</span>
              <span>Admin Quick Actions</span>
            </div>
          </div>
          <div className="quick-actions-grid">
            <div className="quick-action-tile" onClick={() => setActiveTab('students')}>
              <div className="quick-action-icon" style={{ background: '#ecfdf5', color: '#059669' }}><UserPlus size={18} /></div>
              <span className="quick-action-label">Add Student</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('accounts')}>
              <div className="quick-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><Receipt size={18} /></div>
              <span className="quick-action-label">Generate Fee Receipt</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('students')}>
              <div className="quick-action-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}><FileText size={18} /></div>
              <span className="quick-action-label">Student Directory</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('students')}>
              <div className="quick-action-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Award size={18} /></div>
              <span className="quick-action-label">Issue Certificate</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('hr')}>
              <div className="quick-action-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><Users size={18} /></div>
              <span className="quick-action-label">Manage HR Payroll</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('compliance')}>
              <div className="quick-action-icon" style={{ background: '#ecfeff', color: '#0891b2' }}><ShieldCheck size={18} /></div>
              <span className="quick-action-label">NAAC SSR Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 2. PRINCIPAL DASHBOARD (Academic Leadership Desk)
// =============================================================================
function PrincipalDashboard({ stats, selectedInstitution, currentUser, setActiveTab, formatCurrency }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(49, 46, 129, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#a5b4fc', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              PRINCIPAL EXECUTIVE PORTAL
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '4px' }}>
              {selectedInstitution?.name || 'Belhekar College'} — Executive Academic Desk
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '13px' }}>
              Welcome back, <strong>{currentUser?.full_name || 'Dr. Rameshwar V. Patil (Principal)'}</strong> 👋 | Institutional Code: {selectedInstitution?.code}
            </p>
          </div>
          <button className="btn btn-primary" style={{ background: '#6366f1', borderColor: '#818cf8' }} onClick={() => setActiveTab('compliance')}>
            <ShieldCheck size={16} />
            <span>Review NAAC & NBA Attainment</span>
          </button>
        </div>
      </div>

      <div className="kpi-five-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● TOTAL STUDENT STRENGTH</span>
            <div className="kpi-icon-pill"><GraduationCap size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.totalStudents || 2}</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-success">Active Enrolments</span>
            <span>All Departments</span>
          </div>
        </div>

        <div className="kpi-card purple">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● FACULTY & TEACHING CADRE</span>
            <div className="kpi-icon-pill"><Users size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.totalFaculty || 2}</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-info" style={{ background: '#f5f3ff', color: '#7c3aed' }}>1 : 15 Ratio</span>
            <span>UGC/AICTE Approved</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● ACADEMIC ATTENDANCE RATE</span>
            <div className="kpi-icon-pill"><Fingerprint size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.attendanceRate || 93}%</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-success">ESSL Hardware Live</span>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● NAAC SSR COMPLIANCE INDEX</span>
            <div className="kpi-icon-pill"><Award size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">3.42 / 4.0</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-warning">A+ Grade Target</span>
          </div>
        </div>
      </div>

      <div className="middle-dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <CheckSquare size={18} color="#6366f1" />
              <span>Principal Executive Approvals Desk</span>
            </div>
            <span className="badge badge-danger">3 Approvals Pending</span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="list-item-compact">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>Leaving Certificate (LC) Signoff — 4 Students</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Submitted by Registrar Office</div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('students')}>Review & Sign</button>
            </div>

            <div className="list-item-compact">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>Lab Equipment Purchase Voucher — ₹45,000</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Store Officer Request</div>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setActiveTab('store')}>Inspect Inventory</button>
            </div>

            <div className="list-item-compact">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>K3/K5/K6 Internal Marks Final Lock</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>MBA Department - Semester III</div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('academics')}>View Evaluation</button>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <span style={{ color: '#f59e0b' }}>⚡</span>
              <span>Principal Quick Actions</span>
            </div>
          </div>
          <div className="quick-actions-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="quick-action-tile" onClick={() => setActiveTab('compliance')}>
              <div className="quick-action-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}><ShieldCheck size={18} /></div>
              <span className="quick-action-label">NAAC / NBA Accreditation Criteria</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('academics')}>
              <div className="quick-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><Award size={18} /></div>
              <span className="quick-action-label">Exam Marks & OBE Attainment</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('faculty')}>
              <div className="quick-action-icon" style={{ background: '#ecfdf5', color: '#059669' }}><Users size={18} /></div>
              <span className="quick-action-label">Faculty Directory & Cadre</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 3. CLERK DASHBOARD (Admissions & Document Registry Desk)
// =============================================================================
function ClerkDashboard({ stats, selectedInstitution, currentUser, setActiveTab }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0e7490 0%, #155e75 100%)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(14, 116, 144, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#a5f3fc', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              CLERK & REGISTRAR ADMISSION DESK
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '4px' }}>
              Student Enrolment & Document Generation Portal
            </h1>
            <p style={{ color: '#cffaff', fontSize: '13px' }}>
              Welcome back, <strong>{currentUser?.full_name || 'Sunil D. Deshmukh (Sr. Registrar)'}</strong> 👋 | {selectedInstitution?.name}
            </p>
          </div>
          <button className="btn btn-primary" style={{ background: '#06b6d4', borderColor: '#22d3ee' }} onClick={() => setActiveTab('students')}>
            <UserPlus size={16} />
            <span>New Student Admission</span>
          </button>
        </div>
      </div>

      <div className="kpi-five-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● ACTIVE STUDENT PROFILES</span>
            <div className="kpi-icon-pill"><GraduationCap size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.totalStudents || 2}</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-success">CAP & Institute Enrolled</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● CERTIFICATES ISSUED TODAY</span>
            <div className="kpi-icon-pill"><FileCheck2 size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">14</div>
          </div>
          <div className="kpi-card-footer">
            <span>Bonafide, LC, 15A & Validity</span>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● MAHADBT SCHOLARSHIP TAGGED</span>
            <div className="kpi-icon-pill"><Award size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">100%</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-info">OBC/SC/ST Category Tagged</span>
          </div>
        </div>

        <div className="kpi-card purple">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● ALUMNI MIGRATIONS</span>
            <div className="kpi-icon-pill"><Building2 size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.totalPlacements || 12}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Graduated Candidate Records</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <div className="dash-card-header">
          <div className="dash-card-title">
            <FileText size={18} color="#0891b2" />
            <span>Document Generation Engine (Official PDF Letterheads)</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '14px' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 4px 0' }}>📄 Bonafide Certificate</h4>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 10px 0' }}>Proof of enrolment for passport, bus pass, or bank loan.</p>
            <button className="btn btn-sm btn-primary" style={{ width: '100%' }} onClick={() => setActiveTab('students')}>
              Issue Bonafide
            </button>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 4px 0' }}>📜 Leaving Certificate (LC / TC)</h4>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 10px 0' }}>Official transfer record with conduct, progress & leaving reason.</p>
            <button className="btn btn-sm btn-secondary" style={{ width: '100%' }} onClick={() => setActiveTab('students')}>
              Print LC Record
            </button>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 4px 0' }}>💳 Form 15A Fee Statement</h4>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 10px 0' }}>Verified statement of academic fee dues for bank education loans.</p>
            <button className="btn btn-sm btn-primary" style={{ width: '100%', background: '#0891b2', borderColor: '#06b6d4' }} onClick={() => setActiveTab('students')}>
              Generate Form 15A
            </button>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 4px 0' }}>🏛️ Caste Validity Letter</h4>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 10px 0' }}>Scrutiny committee verification letter with GR record details.</p>
            <button className="btn btn-sm btn-secondary" style={{ width: '100%' }} onClick={() => setActiveTab('students')}>
              Issue Validity Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 4. FACULTY DASHBOARD (Teacher & Assessment Desk)
// =============================================================================
function FacultyDashboard({ stats, selectedInstitution, currentUser, setActiveTab }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)', borderRadius: '18px', padding: '26px 30px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(4, 120, 87, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#a7f3d0', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              TEACHER & ACADEMIC FACULTY PORTAL
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '4px' }}>
              Faculty Teaching & Assessment Workstation
            </h1>
            <p style={{ color: '#d1fae5', fontSize: '13px', margin: 0 }}>
              Welcome back, <strong>{currentUser?.full_name || 'Prof. Anjali M. Shinde'}</strong> 👋 | {selectedInstitution?.name}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: '700' }} onClick={() => setActiveTab('faculty_profile')}>
              <Users size={16} />
              <span>Personal Profile</span>
            </button>
            <button className="btn btn-primary" style={{ background: '#2563eb', borderColor: '#3b82f6', fontWeight: '700' }} onClick={() => setActiveTab('attendance')}>
              <CalendarCheck size={16} />
              <span>Mark Student Attendance</span>
            </button>
            <button className="btn btn-primary" style={{ background: '#10b981', borderColor: '#34d399', fontWeight: '800' }} onClick={() => setActiveTab('academics')}>
              <Award size={16} />
              <span>Enter Internal Marks (K3/K5/K6)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="kpi-five-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card green" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('faculty_profile')}>
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● FACULTY DOSSIER</span>
            <div className="kpi-icon-pill"><Users size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">100% Verified</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-success">Manage Profile & Bank</span>
          </div>
        </div>

        <div className="kpi-card blue" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('attendance')}>
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● STUDENT ATTENDANCE</span>
            <div className="kpi-icon-pill"><CalendarCheck size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">94.5%</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-info">Mark Daily Roll Call</span>
          </div>
        </div>

        <div className="kpi-card purple" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('academics')}>
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● BLOOM'S MARKS EVALUATION</span>
            <div className="kpi-icon-pill"><Award size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">K3 / K5 / K6</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-warning">Live Score Validation</span>
          </div>
        </div>

        <div className="kpi-card amber" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('compliance')}>
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● CO-PO ATTAINMENT RATE</span>
            <div className="kpi-icon-pill"><ShieldCheck size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">88% Target</div>
          </div>
          <div className="kpi-card-footer">
            <span>NBA OBE Criteria</span>
          </div>
        </div>
      </div>

      <div className="middle-dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <Clock size={18} color="#059669" />
              <span>My Lecture Schedule Today</span>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('attendance')}>
              <CalendarCheck size={14} /> Mark Roll Call
            </button>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="list-item-compact">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>
                <span>10:00</span>
                <span>AM</span>
              </div>
              <div style={{ flex: 1, marginLeft: '8px' }}>
                <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Management Information Systems (MIS-201)</strong>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>MBA Year 1 — Classroom 3B • 60 Students</div>
              </div>
              <button className="btn btn-sm btn-primary" style={{ background: '#2563eb', borderColor: '#3b82f6' }} onClick={() => setActiveTab('attendance')}>
                <CalendarCheck size={14} /> Mark Attendance
              </button>
            </div>

            <div className="list-item-compact">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>
                <span>01:30</span>
                <span>PM</span>
              </div>
              <div style={{ flex: 1, marginLeft: '8px' }}>
                <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Business Analytics & AI (BA-405)</strong>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>MCA Year 2 — Computer Lab 1 • 55 Students</div>
              </div>
              <button className="btn btn-sm btn-primary" style={{ background: '#2563eb', borderColor: '#3b82f6' }} onClick={() => setActiveTab('attendance')}>
                <CalendarCheck size={14} /> Mark Attendance
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <span style={{ color: '#f59e0b' }}>⚡</span>
              <span>Faculty Workstation Actions</span>
            </div>
          </div>
          <div className="quick-actions-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="quick-action-tile" onClick={() => setActiveTab('faculty_profile')}>
              <div className="quick-action-icon" style={{ background: '#ecfdf5', color: '#059669' }}><Users size={18} /></div>
              <span className="quick-action-label">My Personal & Banking Profile</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('attendance')}>
              <div className="quick-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><CalendarCheck size={18} /></div>
              <span className="quick-action-label">Student Lecture Attendance Marking</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('academics')}>
              <div className="quick-action-icon" style={{ background: '#fffbeb', color: '#b45309' }}><Award size={18} /></div>
              <span className="quick-action-label">Enter Internal Marks (K3 / K5 / K6)</span>
            </div>
            <div className="quick-action-tile" onClick={() => setActiveTab('students')}>
              <div className="quick-action-icon" style={{ background: '#f8fafc', color: '#475569' }}><GraduationCap size={18} /></div>
              <span className="quick-action-label">View Class Student Roster</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 5. ACCOUNTANT DASHBOARD (Finance & Fee Counter)
// =============================================================================
function AccountantDashboard({ stats, selectedInstitution, currentUser, setActiveTab, formatCurrency }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(180, 83, 9, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fef08a', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              CHIEF ACCOUNTANT & FEE COUNTER
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '4px' }}>
              Double-Entry Finance & Student Fee Counter Desk
            </h1>
            <p style={{ color: '#fef3c7', fontSize: '13px' }}>
              Welcome back, <strong>{currentUser?.full_name || 'Mahesh B. Kulkarni (Chief Accountant)'}</strong> 👋 | {selectedInstitution?.name}
            </p>
          </div>
          <button className="btn btn-primary" style={{ background: '#f59e0b', borderColor: '#fbbf24', color: '#0f172a', fontWeight: '800' }} onClick={() => setActiveTab('accounts')}>
            <Receipt size={16} />
            <span>Fee Collection Desk</span>
          </button>
        </div>
      </div>

      <div className="kpi-five-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card green">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● TOTAL FEE INFLOW (INCOME)</span>
            <div className="kpi-icon-pill"><span style={{ fontWeight: '800', fontSize: '14px' }}>₹</span></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">₹{(stats?.totalIncome || 90250).toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Tuition, Development & Registration</span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● INSTITUTIONAL EXPENDITURE</span>
            <div className="kpi-icon-pill"><ArrowUpRight size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">₹{(stats?.totalExpenditure || 180050).toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Payroll, Cheques & Vouchers</span>
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● NET CASH BALANCE</span>
            <div className="kpi-icon-pill"><TrendingUp size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">
              ₹{((stats?.totalIncome || 90250) - (stats?.totalExpenditure || 180050)).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="kpi-card-footer">
            <span>Real-time Surplus / Deficit</span>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● RECENT RECEIPTS GENERATED</span>
            <div className="kpi-icon-pill"><Receipt size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{stats?.recentFees?.length || 5} Receipts</div>
          </div>
          <div className="kpi-card-footer">
            <span>Printable Official PDF Counter</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <div className="dash-card-header">
          <div className="dash-card-title">
            <Receipt size={18} color="#d97706" />
            <span>Recent Student Fee Collection Counter Receipts</span>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('accounts')}>
            Open Fee Collection Desk
          </button>
        </div>

        <table className="data-table" style={{ marginTop: '12px' }}>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Student Name</th>
              <th>Enrollment No</th>
              <th>Sub-Head</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentFees || [
              { receipt_no: 'REC-1001', student_name: 'Rahul V. Patil', enrollment_no: 'SD202501', fee_type: 'Tuition Fee', total_amount: 15000, payment_date: '2026-10-04', payment_mode: 'Cash' },
              { receipt_no: 'REC-1002', student_name: 'Priya S. Kulkarni', enrollment_no: 'SD202502', fee_type: 'Development Fee', total_amount: 12500, payment_date: '2026-10-04', payment_mode: 'UPI' }
            ]).map((fee, idx) => (
              <tr key={idx}>
                <td><strong>{fee.receipt_no || `REC-${1000 + idx}`}</strong></td>
                <td>{fee.student_name}</td>
                <td>{fee.enrollment_no}</td>
                <td><span className="badge badge-info">{fee.fee_type || 'Tuition Fee'}</span></td>
                <td><strong style={{ color: '#059669' }}>₹{(fee.total_amount || 10000).toLocaleString('en-IN')}</strong></td>
                <td>{fee.payment_date || 'Today'}</td>
                <td><span className="badge badge-success">{fee.payment_mode || 'Online'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// 6. STORE OFFICER DASHBOARD (Asset & Inventory Desk)
// =============================================================================
function StoreDashboard({ stats, selectedInstitution, currentUser, setActiveTab, formatCurrency }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(194, 65, 12, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#ffedd5', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              CENTRAL STORE & INVENTORY DESK
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '4px' }}>
              Warehouse Assets & Material Distribution Portal
            </h1>
            <p style={{ color: '#fed7aa', fontSize: '13px' }}>
              Welcome back, <strong>{currentUser?.full_name || 'Ganesh T. Jadhav (Store Officer)'}</strong> 👋 | {selectedInstitution?.name}
            </p>
          </div>
          <button className="btn btn-primary" style={{ background: '#ea580c', borderColor: '#fdba74' }} onClick={() => setActiveTab('store')}>
            <Package size={16} />
            <span>Manage Inventory Stock</span>
          </button>
        </div>
      </div>

      <div className="kpi-five-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● INVENTORY VALUATION</span>
            <div className="kpi-icon-pill"><Package size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">₹{(stats?.inventoryValue || 1450000).toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Total Stock Cost</span>
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● ACTIVE STOCK ITEMS</span>
            <div className="kpi-icon-pill"><Package size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">148 Items</div>
          </div>
          <div className="kpi-card-footer">
            <span>Furniture, IT & Stationery</span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● LOW STOCK ALERTS</span>
            <div className="kpi-icon-pill"><AlertTriangle size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">3 Items</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-danger">Reorder Needed</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● OUTWARD ISSUES TODAY</span>
            <div className="kpi-icon-pill"><Send size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">8 Orders</div>
          </div>
          <div className="kpi-card-footer">
            <span>Distributed to Sister Schools</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dash-card-header">
          <div className="dash-card-title">
            <Package size={18} color="#ea580c" />
            <span>Store Operations Shortcuts</span>
          </div>
        </div>
        <div className="quick-actions-grid">
          <div className="quick-action-tile" onClick={() => setActiveTab('store')}>
            <div className="quick-action-icon" style={{ background: '#ffedd5', color: '#c2410c' }}><Plus size={18} /></div>
            <span className="quick-action-label">Inward Supplier Material</span>
          </div>
          <div className="quick-action-tile" onClick={() => setActiveTab('store')}>
            <div className="quick-action-icon" style={{ background: '#ecfdf5', color: '#059669' }}><Send size={18} /></div>
            <span className="quick-action-label">Outward Stock Distribution</span>
          </div>
          <div className="quick-action-tile" onClick={() => setActiveTab('store')}>
            <div className="quick-action-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><AlertTriangle size={18} /></div>
            <span className="quick-action-label">Low Stock Reorder List</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 7. LIBRARIAN DASHBOARD (Central Library Desk)
// =============================================================================
function LibrarianDashboard({ stats, selectedInstitution, currentUser, setActiveTab, formatCurrency }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #be185d 0%, #831843 100%)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(190, 24, 93, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fbcfe8', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              CHIEF LIBRARIAN CIRCULATION DESK
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '4px' }}>
              Central Library Accession & Circulation System
            </h1>
            <p style={{ color: '#fce7f3', fontSize: '13px' }}>
              Welcome back, <strong>{currentUser?.full_name || 'Pooja R. Bhalerao (Chief Librarian)'}</strong> 👋 | {selectedInstitution?.name}
            </p>
          </div>
          <button className="btn btn-primary" style={{ background: '#db2777', borderColor: '#f472b6' }} onClick={() => setActiveTab('library')}>
            <BookOpen size={16} />
            <span>Circulation Desk</span>
          </button>
        </div>
      </div>

      <div className="kpi-five-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card purple">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● TOTAL ACCESSIONED BOOKS</span>
            <div className="kpi-icon-pill"><BookOpen size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">{(stats?.totalBooks || 4500).toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-card-footer">
            <span>Books & National Journals</span>
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● ISSUED BOOKS CURRENTLY</span>
            <div className="kpi-icon-pill"><BookMarked size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">142 Books</div>
          </div>
          <div className="kpi-card-footer">
            <span>With Students & Faculty</span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● OVERDUE BOOKS</span>
            <div className="kpi-icon-pill"><Clock size={16} /></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">5 Books</div>
          </div>
          <div className="kpi-card-footer">
            <span className="badge badge-danger">₹2 / Day Fine Accrued</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-card-header">
            <span className="kpi-tag-label">● LATE FINE COLLECTED TODAY</span>
            <div className="kpi-icon-pill"><span style={{ fontWeight: '800', fontSize: '14px' }}>₹</span></div>
          </div>
          <div className="kpi-value-row">
            <div className="kpi-main-number">₹140</div>
          </div>
          <div className="kpi-card-footer">
            <span>Automated Daily Counter</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dash-card-header">
          <div className="dash-card-title">
            <BookOpen size={18} color="#db2777" />
            <span>Library Quick Counter Actions</span>
          </div>
        </div>
        <div className="quick-actions-grid">
          <div className="quick-action-tile" onClick={() => setActiveTab('library')}>
            <div className="quick-action-icon" style={{ background: '#fce7f3', color: '#db2777' }}><BookMarked size={18} /></div>
            <span className="quick-action-label">Issue Book to Student</span>
          </div>
          <div className="quick-action-tile" onClick={() => setActiveTab('library')}>
            <div className="quick-action-icon" style={{ background: '#ecfdf5', color: '#059669' }}><CheckCircle2 size={18} /></div>
            <span className="quick-action-label">Return Book Desk</span>
          </div>
          <div className="quick-action-tile" onClick={() => setActiveTab('library')}>
            <div className="quick-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><Plus size={18} /></div>
            <span className="quick-action-label">Accession New Book Title</span>
          </div>
        </div>
      </div>
    </div>
  );
}
