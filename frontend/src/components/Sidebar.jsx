import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  DollarSign,
  Package,
  ShieldCheck,
  Briefcase,
  LogOut,
  ChevronRight,
  User,
  FileText,
  CalendarCheck,
  UserCheck
} from 'lucide-react';

export const ROLE_PERMISSIONS = {
  Admin: ['dashboard', 'faculty_profile', 'students', 'documents', 'attendance', 'alumni', 'accounts', 'hr', 'faculty', 'store', 'academics', 'compliance', 'library'],
  Principal: ['dashboard', 'faculty_profile', 'students', 'documents', 'attendance', 'alumni', 'hr', 'faculty', 'store', 'academics', 'compliance', 'library'],
  Clerk: ['dashboard', 'students', 'documents', 'alumni'],
  Faculty: ['dashboard', 'faculty_profile', 'attendance', 'academics', 'students', 'compliance'],
  Account: ['dashboard', 'students', 'accounts', 'hr', 'faculty'],
  Store: ['dashboard', 'store'],
  Librarian: ['dashboard', 'library', 'compliance']
};

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard & KPI', icon: LayoutDashboard },
  { id: 'faculty_profile', label: 'My Personal Profile', icon: UserCheck },
  { id: 'attendance', label: 'Student Attendance Marking', icon: CalendarCheck },
  { id: 'academics', label: 'Internal Marks Entry & Exam', icon: Award },
  { id: 'students', label: 'Student Management', icon: GraduationCap },
  { id: 'documents', label: 'Document Generation (Bonafide/LC/15A)', icon: FileText },
  { id: 'alumni', label: 'Placement & Alumni Records', icon: Briefcase },
  { id: 'accounts', label: 'Account Management', icon: DollarSign },
  { id: 'hr', label: 'HR Management', icon: Briefcase },
  { id: 'faculty', label: 'Teacher Management', icon: Users },
  { id: 'store', label: 'Asset & Inventory Management', icon: Package },
  { id: 'compliance', label: 'NAAC/NBA Management', icon: ShieldCheck },
  { id: 'library', label: 'Library Management', icon: BookOpen }
];

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout, selectedInstitution }) {
  const userRole = currentUser?.role || 'Admin';
  const allowedTabIds = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.Admin;
  const filteredMenuItems = MENU_ITEMS.filter(item => allowedTabIds.includes(item.id));

  return (
    <aside className="app-sidebar no-print">
      {/* Brand Header */}
      <div className="sidebar-header">
        <img
          src="/belhekar_logo_official.png"
          alt="Belhekar Logo"
          className="sidebar-brand-logo-img"
        />
        <div className="sidebar-brand-text">
          <h2>BELHEKAR ERP</h2>
          <span>Group of Institutes</span>
        </div>
      </div>

      {/* User Role Profile Badge */}
      <div style={{
        margin: '12px 14px',
        padding: '10px 12px',
        background: '#f8fafc',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <User size={18} color="#2563eb" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: '700' }}>
            LOGGED IN PORTAL
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
            <span>{userRole} Portal</span>
            <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '1px 7px', borderRadius: '10px', fontWeight: '800' }}>
              8 Modules
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">MAIN MENU ({userRole.toUpperCase()})</div>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-left">
                <Icon size={17} />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} className="nav-item-chevron" />
            </div>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={onLogout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2', fontWeight: '700' }}
        >
          <LogOut size={14} />
          <span>Logout / Switch College</span>
        </button>
      </div>
    </aside>
  );
}

