import React from 'react';
import {
  Search,
  Cloud,
  Bell,
  Settings,
  RefreshCw
} from 'lucide-react';

export default function Topbar({
  institutions,
  selectedInstitution,
  setSelectedInstitution,
  currentUser,
  onSyncBiometrics,
  isSyncingBiometrics
}) {
  const displayName = currentUser?.role || 'Admin';
  const avatarLetter = displayName.charAt(0) || 'A';

  return (
    <header className="app-topbar no-print">
      <div className="topbar-left">
        {/* Global Search Bar */}
        <div className="topbar-search-wrap">
          <Search size={16} />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search students, faculty, enrollment no, department..."
          />
          <kbd className="search-shortcut-badge">Ctrl + K</kbd>
        </div>
      </div>

      {/* Topbar Actions */}
      <div className="topbar-actions">
        {/* ESSL / Hikvision Sync Pill */}
        <button
          className="btn-biometric-pill"
          onClick={onSyncBiometrics}
          disabled={isSyncingBiometrics}
          title="Sync live biometric logs from ESSL & Hikvision terminals"
        >
          <span className={`sync-live-dot ${isSyncingBiometrics ? 'syncing' : ''}`} />
          {isSyncingBiometrics ? (
            <RefreshCw size={13} className="spin-animation" color="#047857" />
          ) : (
            <Cloud size={14} color="#047857" />
          )}
          <span>{isSyncingBiometrics ? 'Syncing...' : 'ESSL / Hikvision Sync'}</span>
        </button>

        <div className="topbar-divider" />

        {/* Notification Bell */}
        <button className="icon-btn-round" title="3 Notifications">
          <Bell size={17} />
          <span className="icon-btn-badge">3</span>
        </button>

        {/* Settings Gear */}
        <button className="icon-btn-round" title="Settings">
          <Settings size={17} />
        </button>

        <div className="topbar-divider" />

        {/* User Profile Pill */}
        <div className="topbar-profile-pill">
          <div className="topbar-profile-avatar">
            {avatarLetter}
          </div>
          <span className="topbar-profile-name">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
