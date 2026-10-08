import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  FileCheck2,
  Download,
  CheckCircle,
  XCircle,
  UserCheck,
  Building,
  ArrowRight,
  Users,
  Clock,
  UserX,
  Printer,
  Columns,
  RotateCcw,
  Calendar,
  FileText,
  Phone,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function StudentManagement({
  selectedInstitution,
  currentUser,
  setActiveTab,
  setSelectedStudentForDoc
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMigrateModal, setShowMigrateModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [actionDropdownOpenId, setActionDropdownOpenId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    application_id: '',
    enrollment_no: '',
    abc_id: '',
    department: 'MBA Marketing',
    admission_year: '2025-26',
    current_year: 'First Year',
    dob: '2004-01-01',
    gender: 'Male',
    category: 'General',
    cap_type: 'CAP Level-I',
    birth_place: 'Pune',
    father_name: '',
    mother_name: '',
    mobile_no: '',
    parent_mobile: '',
    address: '',
    email: '',
    aadhar_no: '',
    registration_fee: 2500,
    tuition_fee: 65000,
    development_fee: 10000,
    exam_fee: 3500,
    other_fee: 2000,
    is_scholarship_eligible: 1,
    scholarship_inst1_status: 'Pending',
    scholarship_inst2_status: 'Pending'
  });

  const [migrateData, setMigrateData] = useState({
    current_company: '',
    current_designation: '',
    ctc_lpa: '',
    city: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let url = `/api/students?institution_id=${selectedInstitution?.id || 1}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedDept) url += `&department=${encodeURIComponent(selectedDept)}`;
      if (selectedYear) url += `&year=${encodeURIComponent(selectedYear)}`;

      const res = await fetch(url);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedInstitution, search, selectedDept, selectedYear]);

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        institution_id: selectedInstitution?.id || 1,
        currentUser: currentUser?.username || 'Admin'
      };

      let res;
      if (formData.id) {
        res = await fetch(`/api/students/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(formData.id ? 'Student profile updated successfully!' : 'New student registered successfully!');
        setShowAddModal(false);
        fetchStudents();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Network error while saving student.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student profile for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Student deleted successfully.');
        fetchStudents();
      }
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  const handleOpenEdit = (student) => {
    setFormData(student);
    setShowAddModal(true);
  };

  const handleOpenAdd = () => {
    setFormData({
      full_name: '',
      application_id: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      enrollment_no: `ENR-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(10000 + Math.random() * 90000)}`,
      abc_id: `ABC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      department: selectedInstitution?.short_name || 'General',
      admission_year: '2025-26',
      current_year: 'First Year',
      dob: '2004-05-15',
      gender: 'Male',
      category: 'General',
      cap_type: 'CAP Level-I',
      birth_place: 'Sangamner',
      father_name: '',
      mother_name: '',
      mobile_no: '',
      parent_mobile: '',
      address: '',
      email: '',
      aadhar_no: '',
      registration_fee: 2500,
      tuition_fee: 55000,
      development_fee: 10000,
      exam_fee: 3500,
      other_fee: 2000,
      is_scholarship_eligible: 1,
      scholarship_inst1_status: 'Pending',
      scholarship_inst2_status: 'Pending'
    });
    setShowAddModal(true);
  };

  const handleMigrateToAlumni = async (e) => {
    e.preventDefault();
    if (!activeStudent) return;
    try {
      const res = await fetch(`/api/alumni/migrate/${activeStudent.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(migrateData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setShowMigrateModal(false);
        fetchStudents();
      } else {
        alert('Migration error: ' + data.error);
      }
    } catch (err) {
      alert('Error migrating student.');
    }
  };

  // Calculate summary metrics
  const totalStudents = students.length;
  const eligibleStudents = students.filter(s => s.is_scholarship_eligible).length;
  const pendingStudents = students.filter(s => s.scholarship_inst1_status === 'Pending' || s.scholarship_inst2_status === 'Pending').length;
  const inactiveStudents = students.filter(s => s.status !== 'Active').length;

  const deptOptions = Array.from(
    new Set([
      'MBA Marketing',
      'MBA Finance',
      'MBA HR',
      'MCA Computer Applications',
      ...students.map(s => s.department).filter(Boolean)
    ])
  );

  const filteredStudents = students.filter(s => {
    if (selectedCategory && s.category !== selectedCategory) return false;
    if (selectedDept && s.department !== selectedDept) return false;
    return true;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4px 4px 40px 4px' }}>
      {/* 1. TOP BANNER HEADER WITH METRIC CARDS & 3D ILLUSTRATION */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f4f8ff 50%, #eef2ff 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        marginBottom: '22px',
        boxShadow: '0 10px 30px -5px rgba(37, 99, 235, 0.06)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Left Content Side */}
        <div style={{ flex: '1', minWidth: '340px', zIndex: 2 }}>
          {/* Title Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              flexShrink: 0
            }}>
              <GraduationCap size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                Student Management & <span style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Master Profiles</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0 0', fontWeight: '400' }}>
                Central registry of enrolled students, CAP allocations, academic ABC IDs, family demographics & scholarships.
              </p>
            </div>
          </div>

          {/* Action Row & Metric Cards */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '18px' }}>
            <button
              onClick={handleOpenAdd}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
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
                boxShadow: '0 8px 22px rgba(124, 58, 237, 0.35)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>New Student Admission</span>
            </button>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Stat 1 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users size={18} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: '1.1' }}>{totalStudents}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Total Students</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <GraduationCap size={18} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: '1.1' }}>{eligibleStudents}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Eligible</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#fff7ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={18} color="#ea580c" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: '1.1' }}>{pendingStudents}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Pending</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <UserX size={18} color="#dc2626" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: '1.1' }}>{inactiveStudents}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>Inactive</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side 3D Illustration Graphic */}
        <div style={{
          position: 'relative',
          width: '280px',
          height: '170px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/graduation_3d_banner.png"
            alt="Graduation 3D Graphic"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(37, 99, 235, 0.15))',
              transform: 'scale(1.1)'
            }}
          />
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        padding: '14px 22px',
        marginBottom: '22px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search Input Box */}
        <div style={{
          flex: '1',
          minWidth: '320px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '10px 16px'
        }}>
          <Search size={18} color="#2563eb" />
          <input
            type="text"
            placeholder="Search by student name, enrollment no, application ID or Aadhaar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '13.5px',
              color: '#0f172a',
              background: 'transparent'
            }}
          />
        </div>

        {/* Department Filter Dropdown */}
        <div style={{ position: 'relative', minWidth: '200px' }}>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              appearance: 'auto',
              cursor: 'pointer'
            }}
          >
            <option value="">All Departments</option>
            {deptOptions.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <Building size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Academic Year Filter Dropdown */}
        <div style={{ position: 'relative', minWidth: '190px' }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              appearance: 'auto',
              cursor: 'pointer'
            }}
          >
            <option value="">All Academic Years</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Final Year">Final Year</option>
          </select>
          <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Category Filter Dropdown */}
        <div style={{ position: 'relative', minWidth: '170px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              appearance: 'auto',
              cursor: 'pointer'
            }}
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="NT">NT</option>
            <option value="SBC">SBC</option>
            <option value="EWS">EWS</option>
          </select>
          <Filter size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={() => {
            setSearch('');
            setSelectedDept('');
            setSelectedYear('');
            setSelectedCategory('');
          }}
          style={{
            background: '#eff6ff',
            color: '#2563eb',
            border: '1px solid #dbeafe',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* 3. ENROLLED STUDENTS DIRECTORY TABLE CARD */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Card Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="#1e293b" />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Enrolled Students Directory
            </h3>
            <span style={{
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '3px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {filteredStudents.length} Records
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}>
              <Download size={14} />
              <span>Export</span>
            </button>

            <button style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}>
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}>
              <Columns size={14} />
              <span>Columns</span>
            </button>

            <button style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155'
            }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', minHeight: '320px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1050px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  ENROLLMENT & APP ID ⇅
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  STUDENT FULL NAME ⇅
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  DEPT & YEAR ⇅
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  CATEGORY / CAP ∨
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  CONTACT & AADHAAR ⇅
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  SCHOLARSHIP ⇅
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    Loading student records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const initials = student.full_name
                    ? student.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'ST';

                  const avatarBg = idx % 2 === 0
                    ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                    : 'linear-gradient(135deg, #2563eb, #3b82f6)';

                  const catBg = student.category === 'OBC' ? '#e0f2fe' : student.category === 'General' ? '#f3e8ff' : '#f1f5f9';
                  const catText = student.category === 'OBC' ? '#0284c7' : student.category === 'General' ? '#7c3aed' : '#334155';

                  return (
                    <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* ENROLLMENT & APP ID */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FileText size={18} color="#2563eb" />
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: '#1d4ed8', fontSize: '14px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                              {student.enrollment_no}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 4px 0', whiteSpace: 'nowrap' }}>
                              {student.application_id}
                            </div>
                            {student.abc_id && (
                              <div style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '10.5px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap'
                              }}>
                                ABC : {student.abc_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* STUDENT FULL NAME */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: avatarBg,
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap' }}>
                              {student.full_name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', whiteSpace: 'nowrap' }}>
                              <span>DOB: {student.dob || 'N/A'}</span>
                              <span style={{ color: student.gender === 'Female' ? '#ec4899' : '#3b82f6', fontWeight: '700' }}>
                                {student.gender === 'Female' ? '♀ Female' : '♂ Male'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DEPT & YEAR */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          padding: '5px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                          whiteSpace: 'nowrap'
                        }}>
                          <Building size={14} color="#2563eb" />
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>
                            {student.department}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                          <Calendar size={13} color="#94a3b8" />
                          <span>{student.current_year} ({student.admission_year || '2024–25'})</span>
                        </div>
                      </td>

                      {/* CATEGORY / CAP */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: catBg,
                          color: catText,
                          padding: '3px 12px',
                          borderRadius: '14px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          display: 'inline-block',
                          marginBottom: '4px',
                          whiteSpace: 'nowrap'
                        }}>
                          {student.category}
                        </span>
                        <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>
                          {student.cap_type || 'CAP Level-I'}
                        </div>
                      </td>

                      {/* CONTACT & AADHAAR */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                          <Phone size={14} color="#e11d48" />
                          <span>{student.mobile_no || '9822334455'}</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', whiteSpace: 'nowrap' }}>
                          <CreditCard size={14} color="#8b5cf6" />
                          <span>Aadhaar: {student.aadhar_no || '6543 2109 8765'}</span>
                        </div>
                      </td>

                      {/* SCHOLARSHIP STATUS */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        {student.is_scholarship_eligible ? (
                          <div>
                            <span style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '700',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginBottom: '4px',
                              whiteSpace: 'nowrap'
                            }}>
                              <CheckCircle size={13} /> Yes
                            </span>
                            <div style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                              I: {student.scholarship_inst1_status || 'Received'}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                              II: {student.scholarship_inst2_status || 'Pending'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '14px', fontSize: '11.5px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                            Self-Financed
                          </span>
                        )}
                      </td>

                      {/* ACTIONS POPUP MENU & QUICK BUTTONS */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            title="View Profile"
                            onClick={() => {
                              setActiveStudent(student);
                              setShowViewModal(true);
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid #dbeafe',
                              background: '#eff6ff',
                              color: '#2563eb',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            title="Edit Profile"
                            onClick={() => handleOpenEdit(student)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid #dcfce7',
                              background: '#f0fdf4',
                              color: '#16a34a',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            title="Generate Certificates"
                            onClick={() => {
                              setSelectedStudentForDoc(student);
                              setActiveTab('documents');
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid #e9d5ff',
                              background: '#faf5ff',
                              color: '#7c3aed',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <FileText size={15} />
                          </button>

                          <button
                            title="More Actions"
                            onClick={() => setActionDropdownOpenId(actionDropdownOpenId === student.id ? null : student.id)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              background: actionDropdownOpenId === student.id ? '#1e293b' : '#ffffff',
                              color: actionDropdownOpenId === student.id ? '#ffffff' : '#475569',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <MoreVertical size={15} />
                          </button>
                        </div>

                        {actionDropdownOpenId === student.id && (
                          <div style={{
                            position: 'absolute',
                            right: '14px',
                            bottom: '44px',
                            top: 'auto',
                            background: '#ffffff',
                            borderRadius: '14px',
                            boxShadow: '0 14px 35px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                            zIndex: 100,
                            padding: '6px',
                            minWidth: '170px',
                            textAlign: 'left'
                          }}>
                            <button
                              onClick={() => {
                                setActionDropdownOpenId(null);
                                setActiveStudent(student);
                                setShowViewModal(true);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: '600',
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={14} color="#2563eb" /> View Profile
                            </button>

                            <button
                              onClick={() => {
                                setActionDropdownOpenId(null);
                                handleOpenEdit(student);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: '600',
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit size={14} color="#16a34a" /> Edit Profile
                            </button>

                            <button
                              onClick={() => {
                                setActionDropdownOpenId(null);
                                setSelectedStudentForDoc(student);
                                setActiveTab('documents');
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: '600',
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <FileText size={14} color="#7c3aed" /> Certificates
                            </button>

                            <button
                              onClick={() => {
                                setActionDropdownOpenId(null);
                                setActiveStudent(student);
                                setShowMigrateModal(true);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: '600',
                                color: '#ea580c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <Building size={14} color="#ea580c" /> Alumni Transfer
                            </button>

                            <button
                              onClick={() => {
                                setActionDropdownOpenId(null);
                                handleDelete(student.id, student.full_name);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: '600',
                                color: '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} color="#dc2626" /> Delete Student
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer / Pagination */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
            Showing 1 to {filteredStudents.length} of {filteredStudents.length} results
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <ChevronLeft size={16} />
            </button>

            <button style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              1
            </button>

            <button style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT STUDENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '850px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {formData.id ? 'Edit Student Master Profile' : 'New Student Admission & Registration'}
              </h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveStudent}>
              <div className="modal-body">
                {/* 1. Academic Identity */}
                <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  1. Academic Identity & Enrolment
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Application ID *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.application_id}
                      onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enrollment Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.enrollment_no}
                      onChange={(e) => setFormData({ ...formData, enrollment_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ABC ID (Academic Bank of Credits)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 123-456-789"
                      value={formData.abc_id}
                      onChange={(e) => setFormData({ ...formData, abc_id: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Department / Branch *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admission Year *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.admission_year}
                      onChange={(e) => setFormData({ ...formData, admission_year: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Academic Year *</label>
                    <select
                      className="form-select"
                      value={formData.current_year}
                      onChange={(e) => setFormData({ ...formData, current_year: e.target.value })}
                    >
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

                {/* 2. Personal Demographics */}
                <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  2. Personal Demographics & Admission Process
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name of Student *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Vikram Dnyaneshwar Belhekar"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.dob || ''}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Social Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="General">General / Open</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="NT">NT</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">CAP Type (Admission Process) *</label>
                    <select
                      className="form-select"
                      value={formData.cap_type}
                      onChange={(e) => setFormData({ ...formData, cap_type: e.target.value })}
                    >
                      <option value="CAP Level-I">CAP Level-I</option>
                      <option value="CAP Level-II">CAP Level-II</option>
                      <option value="Against CAP">Against CAP</option>
                      <option value="Institute Level">Institute Level</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Birth Place</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.birth_place}
                      onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                    />
                  </div>
                </div>

                {/* 3. Family & Contact */}
                <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  3. Family, Contact & Statutory Info
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Father's Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mother's Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Student Mobile No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.mobile_no}
                      onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parent Mobile No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.parent_mobile}
                      onChange={(e) => setFormData({ ...formData, parent_mobile: e.target.value })}
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
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Permanent / Correspondence Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* 4. Financial & Fee Tagging */}
                <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  4. Fee Structure & MahaDBT Scholarship
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Tuition Fee (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.tuition_fee}
                      onChange={(e) => setFormData({ ...formData, tuition_fee: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Development Fee (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.development_fee}
                      onChange={(e) => setFormData({ ...formData, development_fee: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration Fee (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.registration_fee}
                      onChange={(e) => setFormData({ ...formData, registration_fee: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Exam Fee (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.exam_fee}
                      onChange={(e) => setFormData({ ...formData, exam_fee: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Scholarship Eligible?</label>
                    <select
                      className="form-select"
                      value={formData.is_scholarship_eligible ? '1' : '0'}
                      onChange={(e) => setFormData({ ...formData, is_scholarship_eligible: e.target.value === '1' ? 1 : 0 })}
                    >
                      <option value="1">Yes (Eligible)</option>
                      <option value="0">No (Self-Financed)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Scholarship Inst-1 Status</label>
                    <select
                      className="form-select"
                      value={formData.scholarship_inst1_status}
                      onChange={(e) => setFormData({ ...formData, scholarship_inst1_status: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                      <option value="Adjusted">Adjusted</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Scholarship Inst-2 Status</label>
                    <select
                      className="form-select"
                      value={formData.scholarship_inst2_status}
                      onChange={(e) => setFormData({ ...formData, scholarship_inst2_status: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                      <option value="Adjusted">Adjusted</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {formData.id ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOSSIER MODAL */}
      {showViewModal && activeStudent && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Student Digital Dossier</h2>
              <button className="modal-close-btn" onClick={() => setShowViewModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: '#1e40af',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '800'
                  }}
                >
                  {activeStudent.full_name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#0f172a' }}>{activeStudent.full_name}</h3>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Enrollment: <strong>{activeStudent.enrollment_no}</strong> | App ID: {activeStudent.application_id}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span className="badge badge-info">{activeStudent.department}</span>
                    <span className="badge badge-neutral">{activeStudent.current_year}</span>
                    <span className="badge badge-success">{activeStudent.status}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '13px' }}>
                <div><strong>Aadhaar Card:</strong> {activeStudent.aadhar_no || 'N/A'}</div>
                <div><strong>ABC ID:</strong> {activeStudent.abc_id || 'N/A'}</div>
                <div><strong>Date of Birth:</strong> {activeStudent.dob} ({activeStudent.birth_place})</div>
                <div><strong>Gender & Category:</strong> {activeStudent.gender} / {activeStudent.category}</div>
                <div><strong>CAP Type:</strong> {activeStudent.cap_type}</div>
                <div><strong>Admission Year:</strong> {activeStudent.admission_year}</div>
                <div><strong>Father's Name:</strong> {activeStudent.father_name}</div>
                <div><strong>Mother's Name:</strong> {activeStudent.mother_name}</div>
                <div><strong>Student Contact:</strong> {activeStudent.mobile_no}</div>
                <div><strong>Parent Contact:</strong> {activeStudent.parent_mobile}</div>
                <div style={{ gridColumn: 'span 2' }}>
                  <strong>Address:</strong> {activeStudent.address}
                </div>
              </div>

              <div style={{ marginTop: '20px', background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '13px', color: '#1e40af', marginBottom: '8px' }}>Financial Ledger Tagging:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '12.5px' }}>
                  <div>Tuition: ₹{activeStudent.tuition_fee}</div>
                  <div>Dev Fee: ₹{activeStudent.development_fee}</div>
                  <div>Reg Fee: ₹{activeStudent.registration_fee}</div>
                  <div>Exam Fee: ₹{activeStudent.exam_fee}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStudentForDoc(activeStudent);
                  setActiveTab('documents');
                }}
              >
                <FileCheck2 size={16} />
                <span>Issue Certificate (Bonafide / LC / 15A)</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MIGRATE TO ALUMNI MODAL (Section 3.7 in PDF) */}
      {showMigrateModal && activeStudent && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Migrate Student to Alumni Register</h2>
              <button className="modal-close-btn" onClick={() => setShowMigrateModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleMigrateToAlumni}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  This will archive <strong>{activeStudent.full_name}</strong> ({activeStudent.enrollment_no}) as a graduated alumnus in the central alumni repository.
                </p>
                <div className="form-group">
                  <label className="form-label">Current Placement / Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tata Consultancy Services / Pursuing Master's"
                    value={migrateData.current_company}
                    onChange={(e) => setMigrateData({ ...migrateData, current_company: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation / Role</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software Engineer / Research Associate"
                    value={migrateData.current_designation}
                    onChange={(e) => setMigrateData({ ...migrateData, current_designation: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Offered CTC Package (LPA)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="e.g. 6.5"
                      value={migrateData.ctc_lpa}
                      onChange={(e) => setMigrateData({ ...migrateData, ctc_lpa: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Pune, Mumbai"
                      value={migrateData.city}
                      onChange={(e) => setMigrateData({ ...migrateData, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMigrateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Confirm Graduation & Archive to Alumni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
