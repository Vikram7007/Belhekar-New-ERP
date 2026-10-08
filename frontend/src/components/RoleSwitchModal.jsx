import React from 'react';
import {
  ShieldAlert,
  UserCheck,
  GraduationCap,
  Users,
  DollarSign,
  Package,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

const DEMO_ROLES = [
  {
    role: 'Admin',
    username: 'admin',
    name: 'Dr. S. K. Belhekar (Chairman)',
    desc: 'Full Access to all 8 modules, institution config, audit logs & system provisioning.',
    icon: ShieldAlert,
    color: '#2563eb'
  },
  {
    role: 'Principal',
    username: 'principal',
    name: 'Dr. Rameshwar V. Patil (Principal)',
    desc: 'Executive overview of students, teachers, HR, store inventory, exams & NAAC/NBA.',
    icon: Award,
    color: '#7c3aed'
  },
  {
    role: 'Clerk',
    username: 'clerk',
    name: 'Sunil D. Deshmukh (Sr. Registrar)',
    desc: 'Access to student profiles, document generation (Bonafide, LC, 15A, Validity), placement records, and alumni data.',
    icon: GraduationCap,
    color: '#0891b2'
  },
  {
    role: 'Faculty',
    username: 'faculty',
    name: 'Prof. Anjali M. Shinde (Associate Prof & HOD)',
    desc: 'Access to personal profile management, student attendance marking (P/A & Duration), and Bloom K3/K5/K6 internal marks entry.',
    icon: Users,
    color: '#059669'
  },
  {
    role: 'Account',
    username: 'account',
    name: 'Mahesh B. Kulkarni (Chief Accountant)',
    desc: 'Fee collections, double-entry ledger (Income vs Outflow), scholarships & payroll.',
    icon: DollarSign,
    color: '#d97706'
  },
  {
    role: 'Store',
    username: 'store',
    name: 'Ganesh T. Jadhav (Store Officer)',
    desc: 'Asset & inventory, inward supplier receipts, outward distribution to colleges.',
    icon: Package,
    color: '#ea580c'
  },
  {
    role: 'Librarian',
    username: 'librarian',
    name: 'Pooja R. Bhalerao (Chief Librarian)',
    desc: 'Book/Journal accession, circulation desk (issue/return), automated late fines.',
    icon: BookOpen,
    color: '#db2777'
  }
];

export default function RoleSwitchModal({ show, onClose, onSelectUser, currentUser }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={22} color="#2563eb" />
              <span>Select Role-Based Portal (PDF Specification 1.1)</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Switch instantly between all 7 institutional user roles with pre-configured access control lists (ACL).
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '14px' }}>
            {DEMO_ROLES.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentUser?.role === item.role;

              return (
                <div
                  key={item.role}
                  onClick={() => {
                    onSelectUser({
                      username: item.username,
                      full_name: item.name,
                      role: item.role,
                      email: `${item.username}@belhekar.edu`
                    });
                    onClose();
                  }}
                  style={{
                    border: isCurrent ? `2px solid ${item.color}` : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: isCurrent ? 'rgba(37, 99, 235, 0.04)' : '#ffffff',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    boxShadow: isCurrent ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: `${item.color}15`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '15px', color: '#0f172a' }}>{item.role} Portal</strong>
                        {isCurrent && (
                          <span className="badge badge-success" style={{ fontSize: '10px', padding: '1px 6px' }}>
                            Active
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.name}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
