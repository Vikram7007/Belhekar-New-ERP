import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  Building,
  CreditCard,
  Briefcase,
  Printer,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Filter,
  RotateCcw
} from 'lucide-react';

export default function FacultyHRManagement({ selectedInstitution, currentUser, initialSubTab = 'directory' }) {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'directory' or 'payroll'

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Payroll state
  const [payrollData, setPayrollData] = useState(null);
  const [payrollLoading, setPayrollLoading] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '1988-06-15',
    gender: 'Male',
    category: 'General',
    father_name: '',
    mother_name: '',
    year_of_joining: '2022',
    department: 'MBA & MCA Management',
    designation: 'Assistant Professor',
    qualification: 'Ph.D, MBA, UGC-NET',
    email: '',
    mobile_no: '',
    emergency_mobile: '',
    address: 'Campus Staff Enclave, Belhe',
    pan_no: '',
    aadhar_no: '',
    abc_id: '',
    bank_account_no: '',
    bank_ifsc: '',
    bank_branch: 'Sangamner Main',
    base_salary: 65000
  });

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      let url = `/api/faculty?institution_id=${selectedInstitution?.id || 1}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      setFacultyList(data);
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayroll = async () => {
    try {
      setPayrollLoading(true);
      const res = await fetch(`/api/attendance/payroll?institution_id=${selectedInstitution?.id || 1}`);
      const data = await res.json();
      setPayrollData(data);
    } catch (err) {
      console.error('Failed to load payroll sheet:', err);
    } finally {
      setPayrollLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
    if (activeSubTab === 'payroll') {
      fetchPayroll();
    }
  }, [selectedInstitution, search, activeSubTab]);

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        institution_id: selectedInstitution?.id || 1
      };

      let res;
      if (formData.id) {
        res = await fetch(`/api/faculty/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/faculty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(formData.id ? 'Faculty profile updated!' : 'New Faculty added successfully!');
        setShowAddModal(false);
        fetchFaculty();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error saving faculty profile.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete faculty record for ${name}?`)) return;
    await fetch(`/api/faculty/${id}`, { method: 'DELETE' });
    fetchFaculty();
  };

  const handleOpenAdd = () => {
    setFormData({
      full_name: '',
      dob: '1988-06-15',
      gender: 'Male',
      category: 'General',
      father_name: '',
      mother_name: '',
      year_of_joining: new Date().getFullYear().toString(),
      department: selectedInstitution?.short_name || 'Academics',
      designation: 'Assistant Professor',
      qualification: 'Post Graduate / Doctorate',
      email: '',
      mobile_no: '',
      emergency_mobile: '',
      address: '',
      pan_no: '',
      aadhar_no: '',
      abc_id: '',
      bank_account_no: '',
      bank_ifsc: 'SBIN0001245',
      bank_branch: 'Sangamner',
      base_salary: 60000
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (f) => {
    setFormData(f);
    setShowAddModal(true);
  };

  // Helper for initials avatar
  const getInitials = (name) => {
    if (!name) return 'FC';
    const clean = name.replace(/Prof\.|Dr\.|Mr\.|Mrs\.|Ms\./gi, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  };

  const filteredFaculty = facultyList.filter(f => {
    if (deptFilter && f.department !== deptFilter) return false;
    return true;
  });

  const totalPayrollOutflow = payrollData?.totalDisbursement || facultyList.reduce((acc, curr) => acc + Number(curr.base_salary || 0), 0);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4px 4px 40px 4px' }}>
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f4f7ff 50%, #eef2ff 100%)',
        borderRadius: '24px',
        padding: '24px 30px',
        marginBottom: '22px',
        boxShadow: '0 10px 30px -5px rgba(37, 99, 235, 0.06)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              flexShrink: 0
            }}>
              <Users size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                Human Resource & <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Faculty Management</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0 0', fontWeight: '400' }}>
                Master employee credentials, bank payroll parameters, UGC/AICTE designations & automated attendance-linked salary sheets.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleOpenAdd}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 22px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 22px rgba(37, 99, 235, 0.35)',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add New Faculty Member</span>
          </button>
        </div>
      </div>

      {/* 2. STAT SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Active Staff</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{facultyList.length} Members</div>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Payroll Outflow</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>
              ₹{Number(totalPayrollOutflow).toLocaleString('en-IN')}
            </div>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Biometric Attendance</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>94.2% Logged</div>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Statutory Compliance</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ea580c', lineHeight: '1.2' }}>100% PF Verified</div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION PILL TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('directory')}
          style={{
            background: activeSubTab === 'directory' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeSubTab === 'directory' ? '#ffffff' : '#475569',
            border: activeSubTab === 'directory' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'directory' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Briefcase size={16} />
          <span>Faculty Master Directory ({facultyList.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('payroll')}
          style={{
            background: activeSubTab === 'payroll' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeSubTab === 'payroll' ? '#ffffff' : '#475569',
            border: activeSubTab === 'payroll' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'payroll' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <FileSpreadsheet size={16} />
          <span>Automated Monthly Payroll Sheet (Biometric Linked)</span>
        </button>
      </div>

      {/* SUB-TAB 1: FACULTY MASTER DIRECTORY */}
      {activeSubTab === 'directory' && (
        <>
          {/* Search & Filter Bar */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '16px 20px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '280px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Search size={17} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search faculty by name, designation, department, PAN card, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  background: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="">All Departments</option>
                {[...new Set(facultyList.map(f => f.department))].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {(search || deptFilter) && (
                <button
                  onClick={() => { setSearch(''); setDeptFilter(''); }}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '9px 14px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Directory Table Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '240px' }}>Faculty & Designation</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '180px' }}>Department & Joining</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '180px' }}>Statutory Identifiers</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Bank Payroll Details</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Base Scale (₹)</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Contact Details</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', whiteSpace: 'nowrap', minWidth: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        Loading faculty profiles...
                      </td>
                    </tr>
                  ) : filteredFaculty.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        No faculty records found.
                      </td>
                    </tr>
                  ) : (
                    filteredFaculty.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              color: '#ffffff',
                              fontWeight: '800',
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                              flexShrink: 0
                            }}>
                              {getInitials(f.full_name)}
                            </div>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{f.full_name}</strong>
                              <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700' }}>{f.designation}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{f.qualification}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>
                            {f.department}
                          </span>
                          <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                            Joined: <strong>{f.year_of_joining}</strong>
                          </div>
                        </td>
                        <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                            PAN: <strong style={{ color: '#0f172a' }}>{f.pan_no || 'Pending'}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            Aadhaar: {f.aadhar_no || 'Pending'}
                          </div>
                        </td>
                        <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>
                            A/C: {f.bank_account_no}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            IFSC: <strong>{f.bank_ifsc}</strong> ({f.bank_branch})
                          </div>
                        </td>
                        <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                          <strong style={{ color: '#059669', fontSize: '15px', fontWeight: '900' }}>
                            ₹{Number(f.base_salary).toLocaleString('en-IN')}
                          </strong>
                          <div style={{ fontSize: '10.5px', color: '#64748b' }}>per month scale</div>
                        </td>
                        <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '12px', color: '#334155' }}>✉️ {f.email}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>📞 {f.mobile_no}</div>
                        </td>
                        <td style={{ padding: '16px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleOpenEdit(f)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              title="Edit Record"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(f.id, f.full_name)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: '1px solid #fecaca',
                                background: '#fef2f2',
                                color: '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              title="Delete Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SUB-TAB 2: AUTOMATED MONTHLY PAYROLL SHEET */}
      {activeSubTab === 'payroll' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Panel Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={22} color="#059669" />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Monthly Staff Payroll Sheet (Auto-compiled from Biometric Logs)
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                Payroll automatically computed by crossing base salary scale with Present days, Half-days and Leaves from ESSL/Hikvision machines.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                background: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <Printer size={16} />
              <span>Print Payroll Report</span>
            </button>
          </div>

          {/* Payroll Table */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1150px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '220px' }}>Faculty & Designation</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '190px' }}>Bank Account & IFSC</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '120px' }}>Working Days</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Days Present</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Gross Salary</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Leave Deduction</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '120px' }}>PF (5%)</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Net Payable</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '180px' }}>Disbursement Status</th>
                </tr>
              </thead>
              <tbody>
                {payrollLoading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      Compiling biometric attendance logs...
                    </td>
                  </tr>
                ) : !payrollData || payrollData.sheet?.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No payroll data found.
                    </td>
                  </tr>
                ) : (
                  payrollData.sheet.map((item) => (
                    <tr key={item.faculty_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontWeight: '800',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getInitials(item.full_name)}
                          </div>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{item.full_name}</strong>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{item.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>
                          {item.bank_account_no}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.bank_ifsc}</div>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', fontWeight: '700', color: '#475569' }}>
                        {item.totalWorkingDays}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '4px 12px',
                          borderRadius: '14px',
                          fontSize: '12px',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle size={13} />
                          {item.presentDays} Days
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>
                        ₹{item.grossSalary.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', color: '#dc2626', fontWeight: '700', fontSize: '13.5px' }}>
                        -₹{item.leaveDeduction.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', color: '#d97706', fontWeight: '700', fontSize: '13.5px' }}>
                        -₹{item.pfDeduction.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <strong style={{ color: '#059669', fontSize: '15.5px', fontWeight: '900' }}>
                          ₹{item.netSalary.toLocaleString('en-IN')}
                        </strong>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: '#e0f2fe',
                          color: '#0284c7',
                          padding: '5px 14px',
                          borderRadius: '14px',
                          fontSize: '12px',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}>
                          <CheckCircle2 size={14} />
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {payrollData && (
                <tfoot>
                  <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                    <td colSpan={7} style={{ textAlign: 'right', padding: '16px 20px', fontWeight: '800', color: '#334155', fontSize: '14px' }}>
                      Total Campus Monthly Payroll Outflow:
                    </td>
                    <td colSpan={2} style={{ fontSize: '18px', fontWeight: '900', color: '#059669', padding: '16px 20px' }}>
                      ₹{payrollData.totalDisbursement?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT FACULTY MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '820px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {formData.id ? 'Edit Faculty Record' : 'Add New Faculty Member'}
              </h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveFaculty}>
              <div className="modal-body">
                <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '12px', fontWeight: '800' }}>
                  1. Personal & Professional Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name of Faculty *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Prof. Anjali M. Shinde"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year of Joining</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.year_of_joining}
                      onChange={(e) => setFormData({ ...formData, year_of_joining: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Associate Professor & HOD"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Qualifications</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ph.D, MBA, UGC-NET"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                </div>

                <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '12px', fontWeight: '800' }}>
                  2. Statutory Identifiers & Bank Account
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">PAN Card Details *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ABCDE1234F"
                      value={formData.pan_no}
                      onChange={(e) => setFormData({ ...formData, pan_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Aadhaar Card No</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="XXXX XXXX XXXX"
                      value={formData.aadhar_no}
                      onChange={(e) => setFormData({ ...formData, aadhar_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ABC ID (Faculty)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="FAC-ABC-001"
                      value={formData.abc_id}
                      onChange={(e) => setFormData({ ...formData, abc_id: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Bank Account No *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.bank_account_no}
                      onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">IFSC Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.bank_ifsc}
                      onChange={(e) => setFormData({ ...formData, bank_ifsc: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Base Salary Scale (₹/month) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={formData.base_salary}
                      onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Faculty Official Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.mobile_no}
                      onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {formData.id ? 'Save Changes' : 'Confirm Faculty Enrolment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

