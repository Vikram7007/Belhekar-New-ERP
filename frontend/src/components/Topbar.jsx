import React from 'react';
import {
  School,
  Search,
  Cloud,
  Bell,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Topbar({
  institutions,
  selectedInstitution,
  setSelectedInstitution,
  currentUser,
  setShowRoleModal,
  onSyncBiometrics,
  isSyncingBiometrics
}) {
  return (
    <header className="app-topbar no-print">
      <div className="topbar-left">
        {/* 1. College Dropdown matching mockup */}
        <div className="institution-selector-wrapper">
          <School size={17} color="#2563eb" />
          <select
            className="inst-select-input"
            value={selectedInstitution?.id || 1}
            onChange={(e) => {
              const chosen = institutions.find(i => i.id === Number(e.target.value));
              if (chosen) setSelectedInstitution(chosen);
            }}
          >
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.id}. {inst.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} color="#64748b" />
        </div>

        {/* Global Search Bar with Ctrl + K */}
        <div className="topbar-search-wrap">
          <Search size={15} />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search students, enrollment no, name, department..."
          />
          <span className="search-shortcut-badge">Ctrl + K</span>
        </div>
      </div>

      {/* Topbar Actions */}
      <div className="topbar-actions">
        {/* ESSL / Hikvision Sync Green Pill */}
        <button
          className="btn-biometric-pill"
          onClick={onSyncBiometrics}
          disabled={isSyncingBiometrics}
          title="Sync live logs from ESSL & Hikvision terminals"
        >
          <Cloud size={14} color="#059669" />
          <span>{isSyncingBiometrics ? 'Syncing...' : 'ESSL / Hikvision Sync'}</span>
        </button>

        {/* Notification Bell with Badge 3 */}
        <button className="icon-btn-round" title="3 Notifications">
          <Bell size={16} />
          <span className="icon-btn-badge">3</span>
        </button>

        {/* Settings Gear Icon */}
        <button className="icon-btn-round" title="Settings">
          <Settings size={16} />
        </button>

        {/* User Profile Pill */}
        <div
          className="topbar-profile-pill"
          onClick={() => setShowRoleModal(true)}
          title="Click to Switch Portal"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div className="topbar-profile-avatar" style={{ background: '#f59e0b', color: '#fff', fontWeight: '800' }}>
            S
          </div>
          <div className="topbar-profile-info">
            <span className="topbar-profile-name" style={{ fontWeight: '800', fontSize: '12.5px', color: '#0f172a' }}>
              Dr. S. K. Belhekar
            </span>
            <span className="topbar-profile-role" style={{ fontSize: '10.5px', color: '#64748b' }}>
              Chairman (Admin)
            </span>
          </div>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>
    </header>
  );
}
