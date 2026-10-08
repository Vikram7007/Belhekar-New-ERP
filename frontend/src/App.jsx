import React, { useState, useEffect } from 'react';
import Sidebar, { ROLE_PERMISSIONS } from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import FacultyHRManagement from './components/FacultyHRManagement';
import AttendanceModule from './components/AttendanceModule';
import DocumentGenerationEngine from './components/DocumentGenerationEngine';
import AcademicsExamModule from './components/AcademicsExamModule';
import CareerAlumniModule from './components/CareerAlumniModule';
import FinanceAccountingModule from './components/FinanceAccountingModule';
import StoreInventoryModule from './components/StoreInventoryModule';
import LibraryManagementModule from './components/LibraryManagementModule';
import AccreditationComplianceModule from './components/AccreditationComplianceModule';
import FacultyPersonalProfile from './components/FacultyPersonalProfile';
import RoleSwitchModal from './components/RoleSwitchModal';
import LoginPage from './components/LoginPage';

export default function App() {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [selectedStudentForDoc, setSelectedStudentForDoc] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isSyncingBiometrics, setIsSyncingBiometrics] = useState(false);

  // 1. Fetch Institutions on load
  useEffect(() => {
    fetch('/api/institutions')
      .then(res => res.json())
      .then(data => {
        setInstitutions(data);
        if (data.length > 0 && !selectedInstitution) {
          setSelectedInstitution(data[0]);
        }
      })
      .catch(err => console.error('Failed to load institutions:', err));
  }, []);

  // 2. Fetch Dashboard Stats whenever selectedInstitution changes
  const fetchDashboardStats = () => {
    if (!selectedInstitution) return;
    fetch(`/api/dashboard/stats?institution_id=${selectedInstitution.id}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load dashboard stats:', err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [selectedInstitution, isAuthenticated]);

  // 3. Ensure activeTab is permitted for currentUser role
  useEffect(() => {
    if (currentUser?.role) {
      const allowed = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.Admin;
      if (!allowed.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser]);

  // 4. Handle Login Success
  const handleLoginSuccess = ({ user, institution }) => {
    setCurrentUser(user);
    if (institution) {
      setSelectedInstitution(institution);
    }
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  // 5. Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // 6. Biometric Hardware Synchronization
  const handleSyncBiometrics = async () => {
    try {
      setIsSyncingBiometrics(true);
      const res = await fetch('/api/biometrics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: 1 })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`⚡ Biometric Sync Successful!\n${data.message}\nTotal Attendance Records Synced: ${data.recordsSynced}`);
        fetchDashboardStats();
      }
    } catch (err) {
      alert('Error connecting to biometric terminal.');
    } finally {
      setIsSyncingBiometrics(false);
    }
  };

  // IF NOT AUTHENTICATED: RENDER LOGIN PAGE FIRST!
  if (!isAuthenticated) {
    return (
      <LoginPage
        institutions={institutions}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // MAIN ERP LAYOUT (WHEN AUTHENTICATED)
  return (
    <div className="app-container">
      {/* Dynamic Role-Based Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        selectedInstitution={selectedInstitution}
      />

      <div className="app-main">
        {/* Topbar with 12 Institutional Selector & Quick Switch */}
        <Topbar
          institutions={institutions}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
          currentUser={currentUser}
          setShowRoleModal={setShowRoleModal}
          onSyncBiometrics={handleSyncBiometrics}
          isSyncingBiometrics={isSyncingBiometrics}
        />

        {/* Dynamic Content Panel */}
        <main className="app-content">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              onSyncBiometrics={handleSyncBiometrics}
              isSyncingBiometrics={isSyncingBiometrics}
            />
          )}

          {activeTab === 'faculty_profile' && (
            <FacultyPersonalProfile
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              onSyncBiometrics={handleSyncBiometrics}
              isSyncingBiometrics={isSyncingBiometrics}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              setSelectedStudentForDoc={setSelectedStudentForDoc}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentGenerationEngine
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              selectedStudentForDoc={selectedStudentForDoc}
            />
          )}

          {activeTab === 'alumni' && (
            <CareerAlumniModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'accounts' && (
            <FinanceAccountingModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'hr' && (
            <FacultyHRManagement
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              initialSubTab="payroll"
            />
          )}

          {activeTab === 'faculty' && (
            <FacultyHRManagement
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
              initialSubTab="directory"
            />
          )}

          {activeTab === 'store' && (
            <StoreInventoryModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicsExamModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'compliance' && (
            <AccreditationComplianceModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'library' && (
            <LibraryManagementModule
              selectedInstitution={selectedInstitution}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* 7-Role Quick Switcher Modal */}
      <RoleSwitchModal
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentUser={currentUser}
        onSelectUser={(newUser) => {
          setCurrentUser(newUser);
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}

