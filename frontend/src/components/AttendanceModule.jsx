import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Cpu,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Users,
  GraduationCap,
  Save,
  Radio,
  Wifi,
  WifiOff,
  Filter,
  Search,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

export default function AttendanceModule({ selectedInstitution, currentUser, onSyncBiometrics, isSyncingBiometrics }) {
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'faculty', 'devices'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMode, setAttendanceMode] = useState('toggle'); // 'toggle' (P/A) or 'timestamps' (IN/OUT duration)
  const [selectedSubject, setSelectedSubject] = useState('Consumer Behavior & Strategic Management');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [studentRows, setStudentRows] = useState([]);
  const [facultyRows, setFacultyRows] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Common subjects list
  const SUBJECTS = [
    'Consumer Behavior & Strategic Management',
    'Business Analytics & Data Driven Decision Making',
    'Management Information Systems (MIS)',
    'Financial Accounting & Capital Budgeting',
    'Digital Marketing & Social Media Strategy',
    'Enterprise Cloud Architecture',
    'Kayachikitsa & Charak Samhita',
    'Pharmaceutics & Quality Assurance'
  ];

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const instId = selectedInstitution?.id || 1;

      // 1. Fetch Students
      const stuRes = await apiFetch(`/api/students?institution_id=${instId}`);
      const stuData = await stuRes.json();

      // 2. Fetch Existing Attendance for this date
      const attRes = await apiFetch(`/api/attendance/students?institution_id=${instId}&date=${selectedDate}`);
      const attData = await attRes.json();

      // Merge: For each student, find their attendance record or create default
      const merged = stuData.map(s => {
        const found = attData.find(a => a.student_id === s.id);
        if (found) {
          return {
            student_id: s.id,
            enrollment_no: s.enrollment_no,
            full_name: s.full_name,
            department: s.department,
            current_year: s.current_year,
            status: found.status || 'Present',
            in_time: found.in_time || '09:00 AM',
            out_time: found.out_time || '04:30 PM',
            duration_minutes: found.duration_minutes || 420,
            source: found.source || 'Manual',
            subject: found.subject || selectedSubject
          };
        } else {
          return {
            student_id: s.id,
            enrollment_no: s.enrollment_no,
            full_name: s.full_name,
            department: s.department,
            current_year: s.current_year,
            status: 'Present',
            in_time: '09:00 AM',
            out_time: '04:30 PM',
            duration_minutes: 420,
            source: 'Manual Roll Call',
            subject: selectedSubject
          };
        }
      });

      setStudentRows(merged);

      // 3. Fetch Faculty Attendance
      const resFac = await apiFetch(`/api/attendance/faculty?institution_id=${instId}&date=${selectedDate}`);
      const dataFac = await resFac.json();
      setFacultyRows(dataFac);

      // 4. Fetch Devices
      const resDev = await apiFetch('/api/biometrics/devices');
      const dataDev = await resDev.json();
      setDevices(dataDev);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedInstitution, selectedDate]);

  // Toggle single student status (P/A)
  const handleToggleStudent = (targetStudentId) => {
    setStudentRows(prev => prev.map(row => {
      if (row.student_id === targetStudentId) {
        const newStatus = row.status === 'Present' ? 'Absent' : 'Present';
        return {
          ...row,
          status: newStatus,
          duration_minutes: newStatus === 'Present' ? 420 : 0,
          in_time: newStatus === 'Present' ? (row.in_time || '09:00 AM') : null,
          out_time: newStatus === 'Present' ? (row.out_time || '04:30 PM') : null
        };
      }
      return row;
    }));
  };

  // Change in/out times
  const handleTimeChange = (targetStudentId, field, value) => {
    setStudentRows(prev => prev.map(row => {
      if (row.student_id === targetStudentId) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Batch actions
  const handleMarkAllPresent = () => {
    setStudentRows(prev => prev.map(r => {
      if (selectedDept !== 'ALL' && r.department !== selectedDept) return r;
      return {
        ...r,
        status: 'Present',
        duration_minutes: 420,
        in_time: r.in_time || '09:00 AM',
        out_time: r.out_time || '04:30 PM'
      };
    }));
  };

  const handleMarkAllAbsent = () => {
    setStudentRows(prev => prev.map(r => {
      if (selectedDept !== 'ALL' && r.department !== selectedDept) return r;
      return {
        ...r,
        status: 'Absent',
        duration_minutes: 0,
        in_time: null,
        out_time: null
      };
    }));
  };

  // Save student attendance to backend
  const handleSaveStudentAttendance = async () => {
    try {
      setSaving(true);
      const res = await apiFetch('/api/attendance/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_id: selectedInstitution?.id || 1,
          records: studentRows.map(r => ({
            student_id: r.student_id,
            date: selectedDate,
            status: r.status,
            in_time: r.in_time,
            out_time: r.out_time,
            duration_minutes: r.duration_minutes || (r.status === 'Present' ? 420 : 0),
            source: r.source || 'Faculty Attendance Portal',
            subject: selectedSubject
          }))
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchAttendance();
      }
    } catch (err) {
      alert('Failed to save student attendance ledger.');
    } finally {
      setSaving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (studentRows.length === 0) return;
    const headers = ['Enrollment No', 'Student Full Name', 'Department', 'Year', 'Date', 'Subject', 'Status', 'In Time', 'Out Time', 'Duration (Mins)', 'Source'];
    const rows = studentRows.map(r => [
      `"${r.enrollment_no}"`,
      `"${r.full_name}"`,
      `"${r.department}"`,
      `"${r.current_year}"`,
      `"${selectedDate}"`,
      `"${selectedSubject}"`,
      `"${r.status}"`,
      `"${r.in_time || '-'}"`,
      `"${r.out_time || '-'}"`,
      r.duration_minutes || 0,
      `"${r.source || 'Manual'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Attendance_${selectedDate}_${selectedSubject.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter student rows
  const departmentsList = Array.from(new Set(studentRows.map(s => s.department).filter(Boolean)));
  const filteredStudents = studentRows.filter(row => {
    const matchesDept = selectedDept === 'ALL' || row.department === selectedDept;
    const matchesSearch = !searchQuery ||
      row.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.enrollment_no?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const presentCount = filteredStudents.filter(r => r.status === 'Present').length;
  const absentCount = filteredStudents.filter(r => r.status === 'Absent').length;
  const attendanceRate = filteredStudents.length > 0 ? Math.round((presentCount / filteredStudents.length) * 100) : 0;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '12px 12px 40px 12px' }}>
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        borderRadius: '24px',
        padding: '26px 32px',
        marginBottom: '22px',
        boxShadow: '0 12px 32px -5px rgba(37, 99, 235, 0.3)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              flexShrink: 0
            }}>
              <CalendarCheck size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '25px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
                  Student Attendance Marking & Biometric System
                </h1>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  ● Live Roll Call Ledger
                </span>
              </div>
              <p style={{ color: '#dbeafe', fontSize: '13.5px', margin: '6px 0 0 0' }}>
                Faculty lecture roll calls with 1-click P/A toggle, IN/OUT timestamp tracking, and seamless biometric machine integration.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onSyncBiometrics}
            disabled={isSyncingBiometrics}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '14px',
              padding: '12px 20px',
              fontWeight: '700',
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Cpu size={18} className={isSyncingBiometrics ? 'spin' : ''} />
            <span>{isSyncingBiometrics ? 'Syncing Biometrics...' : 'Sync ESSL/Hikvision'}</span>
          </button>

          <button
            onClick={handleSaveStudentAttendance}
            disabled={saving}
            style={{
              background: saveSuccess ? '#10b981' : '#ffffff',
              color: saveSuccess ? '#ffffff' : '#1e3a8a',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 24px',
              fontWeight: '800',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              transition: 'all 0.2s ease'
            }}
          >
            {saveSuccess ? <CheckCheck size={18} /> : <Save size={18} />}
            <span>{saving ? 'Recording Ledger...' : saveSuccess ? 'Attendance Published!' : 'Save Attendance Ledger'}</span>
          </button>
        </div>
      </div>

      {/* 2. STAT KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Class Strength</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{filteredStudents.length} Students</div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Present Today</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>{presentCount} Students</div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Absent Today</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#dc2626', lineHeight: '1.2' }}>{absentCount} Students</div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attendance Percentage</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#16a34a', lineHeight: '1.2' }}>{attendanceRate}% Present</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('students')}
          style={{ borderRadius: '14px', padding: '10px 20px', fontWeight: '700' }}
        >
          <GraduationCap size={16} />
          <span>Student Attendance Marking</span>
        </button>
        <button
          className={`btn ${activeTab === 'faculty' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('faculty')}
          style={{ borderRadius: '14px', padding: '10px 20px', fontWeight: '700' }}
        >
          <Users size={16} />
          <span>Faculty Punch Logs</span>
        </button>
        <button
          className={`btn ${activeTab === 'devices' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('devices')}
          style={{ borderRadius: '14px', padding: '10px 20px', fontWeight: '700' }}
        >
          <Cpu size={16} />
          <span>Biometric Terminals (ESSL & Hikvision)</span>
        </button>
      </div>

      {/* 4. CONTROLS CONSOLE: Date, Subject & Batch Action Bar */}
      {activeTab === 'students' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '22px 26px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', alignItems: 'flex-end', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Attendance Date *
              </label>
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Select Lecture / Course Subject *
              </label>
              <select
                className="form-input"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Department Filter
              </label>
              <select
                className="form-input"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                {departmentsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Search Student
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Name or Roll No..."
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Quick Batch Actions & Mode Selectors */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b' }}>Quick Batch Actions:</span>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={handleMarkAllPresent}
                style={{ fontWeight: '700', borderRadius: '10px' }}
              >
                <CheckCircle2 size={14} /> Mark All Present
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={handleMarkAllAbsent}
                style={{ fontWeight: '700', borderRadius: '10px' }}
              >
                <XCircle size={14} /> Mark All Absent
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAttendanceMode('toggle')}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: attendanceMode === 'toggle' ? '#ffffff' : 'transparent',
                    color: attendanceMode === 'toggle' ? '#2563eb' : '#64748b',
                    boxShadow: attendanceMode === 'toggle' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  P/A Quick Toggle
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceMode('timestamps')}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: attendanceMode === 'timestamps' ? '#ffffff' : 'transparent',
                    color: attendanceMode === 'timestamps' ? '#2563eb' : '#64748b',
                    boxShadow: attendanceMode === 'timestamps' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  IN / OUT Timestamps
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '10px', fontWeight: '700' }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. STUDENT ATTENDANCE TABLE */}
      {activeTab === 'students' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            background: '#fafafa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={20} color="#2563eb" />
              <div>
                <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Roll Call Roster: <span style={{ color: '#2563eb' }}>{selectedSubject}</span>
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Date: <strong>{selectedDate}</strong> • Click Present/Absent button to toggle status.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-success" style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px' }}>
                Present: {presentCount}
              </span>
              <span className="badge badge-danger" style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px' }}>
                Absent: {absentCount}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="erp-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Roll / Enrollment</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Student Full Name</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Department & Year</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Mark Attendance (P/A)</th>
                  {attendanceMode === 'timestamps' && (
                    <>
                      <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>IN Timestamp</th>
                      <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>OUT Timestamp</th>
                      <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Duration</th>
                    </>
                  )}
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Log Source</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <RefreshCw size={22} className="spin" style={{ display: 'inline', marginRight: '8px' }} />
                      Loading class roll call records...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No students found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((row) => (
                    <tr key={row.student_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '800', color: '#1e40af', padding: '14px 18px' }}>
                        {row.enrollment_no}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{row.full_name}</strong>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className="badge badge-neutral">{row.department}</span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{row.current_year}</div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 18px' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${row.status === 'Present' ? 'btn-success' : 'btn-danger'}`}
                          style={{ minWidth: '105px', borderRadius: '12px', fontWeight: '800' }}
                          onClick={() => handleToggleStudent(row.student_id)}
                        >
                          {row.status === 'Present' ? (
                            <>
                              <CheckCircle2 size={15} /> <span>Present</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={15} /> <span>Absent</span>
                            </>
                          )}
                        </button>
                      </td>
                      {attendanceMode === 'timestamps' && (
                        <>
                          <td style={{ padding: '14px 18px' }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ width: '100px', padding: '6px 8px', fontSize: '12px' }}
                              value={row.in_time || ''}
                              placeholder="09:00 AM"
                              onChange={(e) => handleTimeChange(row.student_id, 'in_time', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ width: '100px', padding: '6px 8px', fontSize: '12px' }}
                              value={row.out_time || ''}
                              placeholder="04:30 PM"
                              onChange={(e) => handleTimeChange(row.student_id, 'out_time', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
                              {row.duration_minutes || 0} mins
                            </span>
                          </td>
                        </>
                      )}
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`badge ${row.source?.includes('Biometric') ? 'badge-success' : 'badge-neutral'}`}>
                          {row.source || 'Manual Roll Call'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. FACULTY PUNCH LOGS */}
      {activeTab === 'faculty' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Faculty Biometric Punch Logs ({selectedDate})
            </h3>
            <span className="badge badge-info">Biometric Punch Verification</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="erp-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px' }}>Faculty Full Name</th>
                  <th style={{ padding: '14px 18px' }}>Designation & Dept</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px' }}>IN Timestamp</th>
                  <th style={{ padding: '14px 18px' }}>OUT Timestamp</th>
                  <th style={{ padding: '14px 18px' }}>Shift Duration</th>
                  <th style={{ padding: '14px 18px' }}>Hardware Source</th>
                </tr>
              </thead>
              <tbody>
                {facultyRows.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <strong>{f.full_name}</strong>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div>{f.designation}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{f.department}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-success">{f.status}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', padding: '14px 18px' }}>{f.in_time || '08:50 AM'}</td>
                    <td style={{ fontFamily: 'monospace', padding: '14px 18px' }}>{f.out_time || '05:00 PM'}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-neutral" style={{ fontFamily: 'monospace' }}>
                        {f.duration_minutes || 490} mins (~8 hrs)
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-success">{f.source || 'Hikvision Face-01'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. BIOMETRIC DEVICES TAB */}
      {activeTab === 'devices' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {devices.map((dev) => (
            <div key={dev.id} style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)', borderTop: `4px solid ${dev.brand === 'ESSL' ? '#2563eb' : '#dc2626'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <span className="badge badge-info" style={{ fontWeight: '800' }}>{dev.brand} TERMINAL</span>
                  <h3 style={{ fontSize: '17px', margin: '8px 0 2px 0', fontWeight: '800' }}>{dev.name}</h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {dev.location}</div>
                </div>
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wifi size={12} /> {dev.status}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', fontSize: '12.5px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>IP Address:</span>
                  <strong style={{ fontFamily: 'monospace' }}>{dev.ip_address}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Port Protocol:</span>
                  <strong style={{ fontFamily: 'monospace' }}>{dev.port} (TCP/UDP)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Last Real-time Sync:</span>
                  <span>{dev.last_sync || 'Just now'}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%', borderRadius: '10px', fontWeight: '700' }}
                onClick={onSyncBiometrics}
                disabled={isSyncingBiometrics}
              >
                <RefreshCw size={14} className={isSyncingBiometrics ? 'spin' : ''} />
                <span>Ping & Pull Attendance Buffer</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
