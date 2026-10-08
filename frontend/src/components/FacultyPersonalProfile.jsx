import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CreditCard,
  Building,
  Save,
  CheckCircle2,
  Calendar,
  Award,
  ShieldCheck,
  BookOpen,
  CalendarCheck,
  Printer,
  Sparkles,
  Edit3,
  Layers,
  FileText,
  AlertCircle,
  Hash,
  Activity
} from 'lucide-react';

export default function FacultyPersonalProfile({
  selectedInstitution,
  currentUser,
  setActiveTab,
  onNavigateWithParams
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('personal'); // 'personal', 'academic', 'contact', 'payroll', 'schedule'

  // Profile data state
  const [profile, setProfile] = useState({
    id: null,
    institution_id: selectedInstitution?.id || 1,
    full_name: currentUser?.full_name || 'Prof. Anjali M. Shinde',
    dob: '1985-05-12',
    gender: 'Female',
    category: 'Open',
    father_name: 'Manohar Shinde',
    mother_name: 'Usha Shinde',
    year_of_joining: '2016',
    department: 'MBA & MCA Management',
    designation: 'Associate Professor & HOD',
    qualification: 'Ph.D (Mgmt), MBA (Finance), UGC-NET',
    email: currentUser?.email || 'anjali.shinde@belhekar.edu',
    mobile_no: '9822119988',
    emergency_mobile: '9422001199',
    address: 'Staff Quarters Q-4, Belhekar Campus, Sangamner-Pune Highway',
    pan_no: 'ABCPS9821K',
    aadhar_no: '3456 7890 1234',
    abc_id: 'FAC-ABC-001',
    bank_account_no: '30987123456',
    bank_ifsc: 'SBIN0001245',
    bank_branch: 'Sangamner Main',
    base_salary: 78500,
    specialization: 'Financial Modeling, Enterprise Risk, Strategic Marketing',
    blood_group: 'B+ve',
    epf_no: 'MH/PUN/0088921/000/0042',
    research_publications: '12 Peer-Reviewed UGC Care & Scopus Indexed Papers'
  });

  // Assigned courses for current semester
  const assignedCourses = [
    {
      code: 'MBA-201',
      subject: 'Consumer Behavior & Strategic Management',
      class: 'MBA Semester II (Div A)',
      studentsCount: 60,
      timing: 'Mon, Wed, Fri (10:00 AM - 11:30 AM)',
      room: 'Classroom 3B, Management Block'
    },
    {
      code: 'MCA-402',
      subject: 'Business Analytics & Data Driven Decision Making',
      class: 'MCA Semester IV (Div B)',
      studentsCount: 55,
      timing: 'Tue, Thu (01:30 PM - 03:00 PM)',
      room: 'Computer Lab 1, Tech Wing'
    },
    {
      code: 'MKT-305',
      subject: 'Digital Marketing & AI Advertising Frameworks',
      class: 'MBA Specialization Semester III',
      studentsCount: 48,
      timing: 'Sat (09:00 AM - 12:00 PM)',
      room: 'Seminar Hall 2'
    }
  ];

  // Fetch faculty profile from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const email = currentUser?.email || 'faculty@belhekar.edu';
      const username = currentUser?.username || 'faculty';
      const instId = selectedInstitution?.id || 1;

      const res = await fetch(`/api/faculty/me?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&institution_id=${instId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({
          ...prev,
          ...data,
          specialization: data.specialization || prev.specialization,
          blood_group: data.blood_group || prev.blood_group,
          epf_no: data.epf_no || prev.epf_no,
          research_publications: data.research_publications || prev.research_publications
        }));
      }
    } catch (err) {
      console.error('Error fetching faculty profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [selectedInstitution, currentUser]);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...profile,
        institution_id: selectedInstitution?.id || 1
      };

      let res;
      if (profile.id) {
        res = await fetch(`/api/faculty/${profile.id}`, {
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
        const created = await res.json();
        if (created.id) {
          setProfile(prev => ({ ...prev, id: created.id }));
        }
      }

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('Failed to update faculty profile.');
      }
    } catch (err) {
      alert('Error updating faculty profile.');
    } finally {
      setSaving(false);
    }
  };

  // Initials generator
  const getInitials = (name) => {
    if (!name) return 'FC';
    const clean = name.replace(/Prof\.|Dr\.|Mr\.|Mrs\.|Ms\./gi, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  };

  // Profile Completeness calculation
  const calculateCompleteness = () => {
    const required = [
      profile.full_name, profile.email, profile.mobile_no, profile.department,
      profile.designation, profile.qualification, profile.pan_no, profile.aadhar_no,
      profile.bank_account_no, profile.bank_ifsc, profile.address, profile.abc_id
    ];
    const filled = required.filter(Boolean).length;
    return Math.round((filled / required.length) * 100);
  };

  const completeness = calculateCompleteness();
  const serviceYears = new Date().getFullYear() - (parseInt(profile.year_of_joining) || 2018);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '12px 12px 40px 12px' }}>
      {/* 1. EXECUTIVE FACULTY HERO HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
        borderRadius: '24px',
        padding: '28px 32px',
        marginBottom: '22px',
        boxShadow: '0 12px 32px -5px rgba(5, 150, 105, 0.3)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1', minWidth: '320px' }}>
          {/* Avatar with Glow */}
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            color: '#064e3b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            fontWeight: '900',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            border: '3px solid rgba(255, 255, 255, 0.4)',
            flexShrink: 0
          }}>
            {getInitials(profile.full_name)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
                {profile.full_name}
              </h1>
              <span style={{
                background: 'rgba(255, 255, 255, 0.22)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: '700',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.35)'
              }}>
                ● {profile.designation}
              </span>
            </div>

            <p style={{ color: '#d1fae5', fontSize: '13.5px', margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span>🏛️ {profile.department}</span>
              <span>•</span>
              <span>🎓 {profile.qualification}</span>
              <span>•</span>
              <span>🆔 ID: {profile.abc_id || 'FAC-2024'}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
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
            <Printer size={17} />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
              background: saveSuccess ? '#10b981' : '#ffffff',
              color: saveSuccess ? '#ffffff' : '#064e3b',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 24px',
              fontWeight: '800',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            <span>{saving ? 'Saving Updates...' : saveSuccess ? 'Profile Saved Live!' : 'Save Profile Changes'}</span>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Experience</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{serviceYears}+ Years Tenure</div>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Courses</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{assignedCourses.length} Subjects Active</div>
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
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile Completeness</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#16a34a', lineHeight: '1.2' }}>{completeness}% Verified</div>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Base Scale</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#ea580c', lineHeight: '1.2' }}>₹{Number(profile.base_salary || 0).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION PILL TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('personal')}
          style={{
            background: activeSubTab === 'personal' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
            color: activeSubTab === 'personal' ? '#ffffff' : '#475569',
            border: activeSubTab === 'personal' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'personal' ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <User size={16} />
          <span>Personal & Identity Details</span>
        </button>

        <button
          onClick={() => setActiveSubTab('academic')}
          style={{
            background: activeSubTab === 'academic' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
            color: activeSubTab === 'academic' ? '#ffffff' : '#475569',
            border: activeSubTab === 'academic' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'academic' ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <GraduationCap size={16} />
          <span>Academic, UGC & Research</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          style={{
            background: activeSubTab === 'contact' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
            color: activeSubTab === 'contact' ? '#ffffff' : '#475569',
            border: activeSubTab === 'contact' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'contact' ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Mail size={16} />
          <span>Contact & Residence</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payroll')}
          style={{
            background: activeSubTab === 'payroll' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
            color: activeSubTab === 'payroll' ? '#ffffff' : '#475569',
            border: activeSubTab === 'payroll' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'payroll' ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <CreditCard size={16} />
          <span>Statutory, Bank & Payroll</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          style={{
            background: activeSubTab === 'schedule' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
            color: activeSubTab === 'schedule' ? '#ffffff' : '#475569',
            border: activeSubTab === 'schedule' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'schedule' ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <BookOpen size={16} />
          <span>Teaching Courses & Quick Actions</span>
        </button>
      </div>

      {/* 4. CONTENT FORM CARDS */}
      <form onSubmit={handleSaveProfile}>
        {/* SUB-TAB 1: PERSONAL & IDENTITY DETAILS */}
        {activeSubTab === 'personal' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <User size={20} color="#059669" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Personal Identification & Demographics
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Faculty Full Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={profile.dob || ''}
                  onChange={(e) => handleChange('dob', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Gender
                </label>
                <select
                  className="form-input"
                  value={profile.gender || 'Female'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Social Category
                </label>
                <select
                  className="form-input"
                  value={profile.category || 'Open'}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="Open">Open / General</option>
                  <option value="OBC">OBC</option>
                  <option value="EWS">EWS</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="NT / VJ">NT / VJ</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Father's / Spouse Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.father_name || ''}
                  onChange={(e) => handleChange('father_name', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Mother's Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.mother_name || ''}
                  onChange={(e) => handleChange('mother_name', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Blood Group
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.blood_group || ''}
                  placeholder="e.g. B+ve, O+ve"
                  onChange={(e) => handleChange('blood_group', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.aadhar_no || ''}
                  placeholder="XXXX XXXX XXXX"
                  onChange={(e) => handleChange('aadhar_no', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: ACADEMIC & RESEARCH */}
        {activeSubTab === 'academic' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <GraduationCap size={20} color="#059669" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Academic Qualifications, UGC/AICTE Cadre & Research Publications
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Assigned Department *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.department || ''}
                  onChange={(e) => handleChange('department', e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Designation / Academic Cadre *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.designation || ''}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Highest Educational Qualification *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.qualification || ''}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Year of Joining Campus
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.year_of_joining || ''}
                  onChange={(e) => handleChange('year_of_joining', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Academic Bank of Credits (ABC / APAAR ID)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.abc_id || ''}
                  placeholder="FAC-ABC-001"
                  onChange={(e) => handleChange('abc_id', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Core Specialization / Teaching Domains
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.specialization || ''}
                  placeholder="e.g. Financial Analytics, Artificial Intelligence"
                  onChange={(e) => handleChange('specialization', e.target.value)}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Research Papers, Books & Conference Publications (UGC/Scopus)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={profile.research_publications || ''}
                  onChange={(e) => handleChange('research_publications', e.target.value)}
                  placeholder="List published research papers, ISBN books, or national conferences..."
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: CONTACT & RESIDENCE */}
        {activeSubTab === 'contact' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <Mail size={20} color="#059669" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Communication Channels & Campus Residential Address
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Official Email Address *
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={profile.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={profile.mobile_no || ''}
                  onChange={(e) => handleChange('mobile_no', e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={profile.emergency_mobile || ''}
                  onChange={(e) => handleChange('emergency_mobile', e.target.value)}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Full Residential / Campus Staff Quarter Address
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={profile.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Staff Quarter Number, Campus Residence, City, District, PIN Code"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: STATUTORY, BANK & PAYROLL */}
        {activeSubTab === 'payroll' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <CreditCard size={20} color="#059669" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Statutory Identifiers, Bank Account & Payroll Parameters
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Permanent Account Number (PAN) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.pan_no || ''}
                  placeholder="ABCPS9821K"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: '700' }}
                  onChange={(e) => handleChange('pan_no', e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.bank_account_no || ''}
                  placeholder="Account Number for Direct Salary Credit"
                  style={{ fontFamily: 'monospace', fontWeight: '700' }}
                  onChange={(e) => handleChange('bank_account_no', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Bank IFSC Code *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.bank_ifsc || ''}
                  placeholder="SBIN0001245"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: '700' }}
                  onChange={(e) => handleChange('bank_ifsc', e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Bank Branch Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.bank_branch || ''}
                  placeholder="Sangamner Main Branch"
                  onChange={(e) => handleChange('bank_branch', e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Monthly Base Scale (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={profile.base_salary || 0}
                  onChange={(e) => handleChange('base_salary', Number(e.target.value))}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  EPF / UAN Member Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.epf_no || ''}
                  placeholder="MH/PUN/0088921/000/0042"
                  onChange={(e) => handleChange('epf_no', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 5: ASSIGNED COURSES & QUICK ACTION CONSOLE */}
        {activeSubTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Action Highlights Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#2563eb" />
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1e40af', margin: 0 }}>
                    Active Teaching Roster & Fast Workstation Links
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#1e3a8a', margin: '4px 0 0 0' }}>
                  One-click access to mark student roll calls and enter Bloom's Taxonomy (K3/K5/K6) internal marks for your assigned courses.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('attendance')}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <CalendarCheck size={16} />
                  <span>Mark Student Attendance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('academics')}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                  }}
                >
                  <Award size={16} />
                  <span>Enter Internal Marks (K3/K5/K6)</span>
                </button>
              </div>
            </div>

            {/* Assigned Courses Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
              {assignedCourses.map((course, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '22px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '10px', fontSize: '11.5px', fontWeight: '800' }}>
                        {course.code}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>
                        👥 {course.studentsCount} Students Enrolled
                      </span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                      {course.subject}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', marginBottom: '10px' }}>
                      {course.class}
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                      <div>🕒 <strong>Slot:</strong> {course.timing}</div>
                      <div>📍 <strong>Venue:</strong> {course.room}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('attendance')}
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '10px',
                        padding: '9px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <CalendarCheck size={14} />
                      <span>Attendance</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('academics')}
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        borderRadius: '10px',
                        padding: '9px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Award size={14} />
                      <span>Enter Marks</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Bottom Save Bar */}
        <div style={{
          marginTop: '24px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={18} color="#059669" />
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>
              All changes are recorded in the institutional faculty master ledger.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: saveSuccess ? '#10b981' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 28px',
              fontWeight: '800',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(5, 150, 105, 0.35)'
            }}
          >
            {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            <span>{saving ? 'Updating Ledger...' : saveSuccess ? 'Profile Saved Successfully!' : 'Save & Update Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
