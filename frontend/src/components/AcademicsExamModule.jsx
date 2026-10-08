import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  Filter,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  BookOpen,
  Check,
  TrendingUp,
  BarChart2,
  Users,
  ShieldCheck,
  Download,
  RefreshCw,
  Sparkles,
  Sliders,
  GraduationCap,
  Layers
} from 'lucide-react';

export default function AcademicsExamModule({ selectedInstitution, currentUser }) {
  const [department, setDepartment] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [subject, setSubject] = useState('Consumer Behavior & Strategic Management');
  const [marksList, setMarksList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Maximum Score settings for K3, K5, K6 frameworks from PDF
  const [maxLimits, setMaxLimits] = useState({
    max_k3: 20,
    max_k5: 20,
    max_k6: 20
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const instId = selectedInstitution?.id || 1;

      // 1. Fetch Students
      const stuRes = await apiFetch(`/api/students?institution_id=${instId}`);
      const stuData = await stuRes.json();
      setStudents(stuData);

      // 2. Fetch Existing Marks
      const marksRes = await apiFetch(`/api/academics/marks?institution_id=${instId}&subject=${encodeURIComponent(subject)}`);
      const marksData = await marksRes.json();

      // Merge students with their existing marks or initialize empty rows
      const combined = stuData.map(s => {
        const found = marksData.find(m => m.student_id === s.id);
        return {
          student_id: s.id,
          enrollment_no: s.enrollment_no,
          student_name: s.full_name,
          department: s.department,
          academic_year: academicYear,
          subject: subject,
          k3_score: found ? found.k3_score : 15,
          k5_score: found ? found.k5_score : 16,
          k6_score: found ? found.k6_score : 17,
          total_score: found ? found.total_score : 48,
          remarks: found ? found.remarks : 'Satisfactory K6 Bloom level attainment'
        };
      });

      setMarksList(combined);
    } catch (err) {
      console.error('Error fetching marks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedInstitution, subject, academicYear]);

  // Handle score change with automatic validation against max score
  const handleScoreChange = (indexInFiltered, field, val) => {
    const updated = [...marksList];
    const targetStudentId = filteredList[indexInFiltered]?.student_id;
    const actualIdx = updated.findIndex(m => m.student_id === targetStudentId);
    if (actualIdx === -1) return;

    const row = { ...updated[actualIdx] };
    const num = Number(val);
    const max = maxLimits[field === 'k3_score' ? 'max_k3' : field === 'k5_score' ? 'max_k5' : 'max_k6'];

    if (num > max) {
      alert(`⚠️ Validation Warning: Marks entered (${num}) cannot exceed the maximum limit of ${max}!`);
      row[field] = max;
    } else if (num < 0) {
      row[field] = 0;
    } else {
      row[field] = num;
    }

    // Recompute total score
    row.total_score = Number(row.k3_score || 0) + Number(row.k5_score || 0) + Number(row.k6_score || 0);
    updated[actualIdx] = row;
    setMarksList(updated);
  };

  const handleSaveMarks = async () => {
    try {
      setSaving(true);
      const res = await apiFetch('/api/academics/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_id: selectedInstitution?.id || 1,
          records: marksList.map(r => ({
            ...r,
            max_k3: maxLimits.max_k3,
            max_k5: maxLimits.max_k5,
            max_k6: maxLimits.max_k6
          }))
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to save assessment marks.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (marksList.length === 0) return;
    const headers = ['Enrollment #', 'Student Name', 'Department', 'K3 Score', 'K5 Score', 'K6 Score', 'Total Score', 'Percentage', 'Grade', 'Remarks'];
    const rows = marksList.map(m => {
      const totalMax = maxLimits.max_k3 + maxLimits.max_k5 + maxLimits.max_k6;
      const pct = Math.round((m.total_score / totalMax) * 100);
      const grade = pct >= 85 ? 'O (Outstanding)' : pct >= 75 ? 'A+ (Excellent)' : pct >= 60 ? 'A (Very Good)' : 'B (Average)';
      return [
        `"${m.enrollment_no}"`,
        `"${m.student_name}"`,
        `"${m.department}"`,
        m.k3_score,
        m.k5_score,
        m.k6_score,
        m.total_score,
        `"${pct}%"`,
        `"${grade}"`,
        `"${m.remarks || ''}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Exam_Evaluation_Sheet_${subject.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const filteredList = marksList.filter(row => {
    const matchesDept = department === 'ALL' || row.department === department;
    const matchesSearch = !searchTerm ||
      row.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.enrollment_no?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const maxTotal = maxLimits.max_k3 + maxLimits.max_k5 + maxLimits.max_k6;
  const avgClassScore = marksList.length > 0 ? Math.round(marksList.reduce((acc, c) => acc + (c.total_score || 0), 0) / marksList.length) : 0;
  const passRate = marksList.length > 0 ? Math.round((marksList.filter(m => (m.total_score / maxTotal) >= 0.5).length / marksList.length) * 100) : 100;
  const departmentsList = Array.from(new Set(students.map(s => s.department).filter(Boolean)));

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '12px 12px 40px 12px' }}>
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        borderRadius: '24px',
        padding: '28px 32px',
        marginBottom: '22px',
        boxShadow: '0 12px 32px -5px rgba(37, 99, 235, 0.3)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              flexShrink: 0
            }}>
              <Award size={30} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                  Examination & Internal Marks Assessment
                </h1>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  ● Live Evaluation Engine
                </span>
              </div>
              <p style={{ color: '#dbeafe', fontSize: '14px', margin: '6px 0 0 0', fontWeight: '400' }}>
                Tabular evaluation framework for Bloom's Taxonomy <strong>K3</strong>, <strong>K5</strong>, and <strong>K6</strong> progressive assessment levels with strict real-time score validation.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleExportCSV}
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
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSaveMarks}
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
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {saveSuccess ? <Check size={18} /> : <Save size={18} />}
            <span>{saving ? 'Validating...' : saveSuccess ? 'Marks Published!' : 'Save & Publish Marks'}</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE STAT KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade Roster Enrolment</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{filteredList.length} Students</div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class Average Score</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>
              {avgClassScore} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>/ {maxTotal} Pts</span>
            </div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course Outcome Pass Rate</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0284c7', lineHeight: '1.2' }}>{passRate}% Attainment</div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px 22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Validation Engine</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ea580c', lineHeight: '1.2' }}>Strict Max Cap</div>
          </div>
        </div>
      </div>

      {/* 3. CONTROL CONSOLE CARD: Course Selection & Max Score Limits */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '22px 26px',
        marginBottom: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <Sliders size={20} color="#2563eb" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Evaluation Parameters & Maximum Point Locks
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Course / Subject Name *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Academic Session
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#0f172a',
                outline: 'none',
                background: '#ffffff',
                boxSizing: 'border-box'
              }}
            >
              <option value="2025-26">2025–26 (Current Academic Year)</option>
              <option value="2024-25">2024–25</option>
              <option value="2023-24">2023–24</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#0369a1', marginBottom: '6px' }}>
                Max K3 (Pts)
              </label>
              <input
                type="number"
                value={maxLimits.max_k3}
                onChange={(e) => setMaxLimits({ ...maxLimits, max_k3: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1.5px solid #93c5fd',
                  background: '#f0f9ff',
                  fontSize: '14px',
                  fontWeight: '800',
                  color: '#0369a1',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#15803d', marginBottom: '6px' }}>
                Max K5 (Pts)
              </label>
              <input
                type="number"
                value={maxLimits.max_k5}
                onChange={(e) => setMaxLimits({ ...maxLimits, max_k5: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1.5px solid #6ee7b7',
                  background: '#ecfdf5',
                  fontSize: '14px',
                  fontWeight: '800',
                  color: '#15803d',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#b45309', marginBottom: '6px' }}>
                Max K6 (Pts)
              </label>
              <input
                type="number"
                value={maxLimits.max_k6}
                onChange={(e) => setMaxLimits({ ...maxLimits, max_k6: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1.5px solid #fde68a',
                  background: '#fffbeb',
                  fontSize: '14px',
                  fontWeight: '800',
                  color: '#b45309',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. BLOOM'S TAXONOMY FRAMEWORK GUIDE BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: '18px',
        padding: '18px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: '#2563eb',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
        }}>
          <Layers size={24} />
        </div>
        <div style={{ fontSize: '13.5px', color: '#1e3a8a', lineHeight: '1.6' }}>
          <strong>Assessment Framework Standards:</strong> <strong>K3 Level</strong> evaluates Domain Application & Execution; <strong>K5 Level</strong> evaluates Critical Evaluation & System Analysis; <strong>K6 Level</strong> evaluates Synthesis, Design & Creative Solutions. Combined maximum total score cap is <strong>{maxTotal} Marks</strong>.
        </div>
      </div>

      {/* 5. MARKS ENTRY TABULAR CONSOLE */}
      <div style={{
        background: '#ffffff',
        borderRadius: '22px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Table Header Controls */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Subject Grade Sheet: <span style={{ color: '#2563eb' }}>{subject}</span>
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Enter scores for individual Bloom levels. Scores auto-sum and validate against max caps.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search student or ENR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Department Filter Dropdown */}
            {departmentsList.length > 0 && (
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#475569',
                  background: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="ALL">All Departments</option>
                {departmentsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}

            <span style={{
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '800',
              whiteSpace: 'nowrap'
            }}>
              {filteredList.length} Students in Grade Roster
            </span>
          </div>
        </div>

        {/* High Density Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '150px' }}>
                  Enrollment #
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '240px' }}>
                  Student Full Name
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '180px' }}>
                  Department
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', background: '#f0f9ff', whiteSpace: 'nowrap', minWidth: '140px' }}>
                  K3 Level (Max {maxLimits.max_k3})
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', background: '#ecfdf5', whiteSpace: 'nowrap', minWidth: '140px' }}>
                  K5 Level (Max {maxLimits.max_k5})
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', background: '#fffbeb', whiteSpace: 'nowrap', minWidth: '140px' }}>
                  K6 Level (Max {maxLimits.max_k6})
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', whiteSpace: 'nowrap', minWidth: '150px' }}>
                  Total Score ({maxTotal})
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '170px' }}>
                  Attainment Grade
                </th>
                <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '320px' }}>
                  Remarks / Course Outcomes
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <RefreshCw size={24} className="spin" color="#2563eb" />
                      <span>Loading student grade roster...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    No student records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((row, idx) => {
                  const pct = Math.round((row.total_score / maxTotal) * 100);
                  const grade = pct >= 85 ? 'O (Outstanding)' : pct >= 75 ? 'A+ (Excellent)' : pct >= 60 ? 'A (Very Good)' : 'B (Average)';
                  const initials = getInitials(row.student_name);

                  return (
                    <tr key={row.student_id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                      {/* ENROLLMENT NO */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: '800', color: '#2563eb', fontSize: '13px' }}>
                        <span style={{ background: '#eff6ff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                          {row.enrollment_no}
                        </span>
                      </td>

                      {/* STUDENT FULL NAME WITH AVATAR */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '12.5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{row.student_name}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Reg Student</div>
                          </div>
                        </div>
                      </td>

                      {/* DEPARTMENT */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>
                          {row.department}
                        </span>
                      </td>

                      {/* K3 LEVEL INPUT */}
                      <td style={{ padding: '10px 18px', textAlign: 'center', background: '#f0f9ff', whiteSpace: 'nowrap' }}>
                        <input
                          type="number"
                          style={{
                            width: '76px',
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: '14px',
                            margin: '0 auto',
                            borderRadius: '10px',
                            padding: '8px 6px',
                            border: '1.5px solid #93c5fd',
                            background: '#ffffff',
                            color: '#0369a1',
                            outline: 'none',
                            boxShadow: '0 2px 6px rgba(3, 105, 161, 0.08)'
                          }}
                          min={0}
                          max={maxLimits.max_k3}
                          value={row.k3_score}
                          onChange={(e) => handleScoreChange(idx, 'k3_score', e.target.value)}
                        />
                      </td>

                      {/* K5 LEVEL INPUT */}
                      <td style={{ padding: '10px 18px', textAlign: 'center', background: '#ecfdf5', whiteSpace: 'nowrap' }}>
                        <input
                          type="number"
                          style={{
                            width: '76px',
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: '14px',
                            margin: '0 auto',
                            borderRadius: '10px',
                            padding: '8px 6px',
                            border: '1.5px solid #6ee7b7',
                            background: '#ffffff',
                            color: '#15803d',
                            outline: 'none',
                            boxShadow: '0 2px 6px rgba(21, 128, 61, 0.08)'
                          }}
                          min={0}
                          max={maxLimits.max_k5}
                          value={row.k5_score}
                          onChange={(e) => handleScoreChange(idx, 'k5_score', e.target.value)}
                        />
                      </td>

                      {/* K6 LEVEL INPUT */}
                      <td style={{ padding: '10px 18px', textAlign: 'center', background: '#fffbeb', whiteSpace: 'nowrap' }}>
                        <input
                          type="number"
                          style={{
                            width: '76px',
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: '14px',
                            margin: '0 auto',
                            borderRadius: '10px',
                            padding: '8px 6px',
                            border: '1.5px solid #fde68a',
                            background: '#ffffff',
                            color: '#b45309',
                            outline: 'none',
                            boxShadow: '0 2px 6px rgba(180, 83, 9, 0.08)'
                          }}
                          min={0}
                          max={maxLimits.max_k6}
                          value={row.k6_score}
                          onChange={(e) => handleScoreChange(idx, 'k6_score', e.target.value)}
                        />
                      </td>

                      {/* TOTAL SCORE & PROGRESS BAR */}
                      <td style={{ padding: '14px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div>
                            <strong style={{ fontSize: '16px', color: '#0f172a', fontWeight: '900' }}>
                              {row.total_score}
                            </strong>
                            <span style={{ fontSize: '11.5px', color: '#64748b' }}> / {maxTotal}</span>
                          </div>
                          {/* Mini Progress bar */}
                          <div style={{ width: '80px', height: '5px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: pct >= 75 ? '#10b981' : pct >= 60 ? '#3b82f6' : '#f59e0b' }} />
                          </div>
                          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '800' }}>{pct}% Attained</div>
                        </div>
                      </td>

                      {/* ATTAINMENT GRADE BADGE */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: pct >= 85 ? '#f3e8ff' : pct >= 75 ? '#dcfce7' : pct >= 60 ? '#dbeafe' : '#fef3c7',
                          color: pct >= 85 ? '#7e22ce' : pct >= 75 ? '#15803d' : pct >= 60 ? '#1d4ed8' : '#d97706',
                          border: `1px solid ${pct >= 85 ? '#d8b4fe' : pct >= 75 ? '#86efac' : pct >= 60 ? '#93c5fd' : '#fde68a'}`,
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '800',
                          display: 'inline-block'
                        }}>
                          {grade}
                        </span>
                      </td>

                      {/* REMARKS / COURSE OUTCOMES (MIN-WIDTH 320px TO PREVENT TRUNCATION) */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap', minWidth: '320px' }}>
                        <input
                          type="text"
                          style={{
                            width: '100%',
                            fontSize: '12.5px',
                            fontWeight: '500',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            border: '1.5px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                          value={row.remarks || ''}
                          placeholder="e.g. Satisfactory K6 Bloom level attainment"
                          onChange={(e) => {
                            const updated = [...marksList];
                            const actualIdx = updated.findIndex(m => m.student_id === row.student_id);
                            if (actualIdx !== -1) {
                              updated[actualIdx].remarks = e.target.value;
                              setMarksList(updated);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


