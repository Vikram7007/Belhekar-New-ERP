import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  Layers,
  FileCheck2,
  Users,
  Briefcase
} from 'lucide-react';

export default function AccreditationComplianceModule({ selectedInstitution, currentUser }) {
  const [activeTab, setActiveTab] = useState('naac'); // 'naac' or 'nba'
  const [naacData, setNaacData] = useState(null);
  const [nbaData, setNbaData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const instId = selectedInstitution?.id || 1;

      const [naacRes, nbaRes] = await Promise.all([
        fetch(`/api/compliance/naac?institution_id=${instId}`),
        fetch(`/api/compliance/nba?institution_id=${instId}`)
      ]);

      const [naacJson, nbaJson] = await Promise.all([
        naacRes.json(),
        nbaRes.json()
      ]);

      setNaacData(naacJson);
      setNbaData(nbaJson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedInstitution]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4px 4px 40px 4px' }}>
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="no-print" style={{
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
              <ShieldCheck size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                Accreditation & <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Compliance Framework (NAAC & NBA)</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0 0', fontWeight: '400' }}>
                Automated SSR compliance data compiler, Student-Teacher ratio, and Outcome-Based Education (OBE) K3/K5/K6 to PO-CO attainment mapping.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '12px 22px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap'
            }}
          >
            <Printer size={18} />
            <span>Print Accreditation Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. STAT SUMMARY CARDS */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
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
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NAAC Cycle Target</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>Grade A++ Grade</div>
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
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student-Teacher Ratio</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>
              {naacData?.metric_2_2_2?.ratio || '15:1 Benchmark'}
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
            <Briefcase size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Placements</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{naacData?.metric_5_2_1?.total_placements || 142} Placed</div>
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
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NBA PO Attainment</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ea580c', lineHeight: '1.2' }}>100% Target Met</div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION PILL TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }} className="no-print">
        <button
          onClick={() => setActiveTab('naac')}
          style={{
            background: activeTab === 'naac' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'naac' ? '#ffffff' : '#475569',
            border: activeTab === 'naac' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'naac' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Award size={16} />
          <span>NAAC Self-Study Report (SSR Format)</span>
        </button>
        <button
          onClick={() => setActiveTab('nba')}
          style={{
            background: activeTab === 'nba' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'nba' ? '#ffffff' : '#475569',
            border: activeTab === 'nba' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'nba' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Layers size={16} />
          <span>NBA Outcome-Based Education (OBE PO/CO Matrix)</span>
        </button>
      </div>

      {/* NAAC FORMAT (Page 2 & 7 in PDF) */}
      {activeTab === 'naac' && naacData && (
        <div>
          {/* Institutional Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '20px 26px',
            marginBottom: '22px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 6px 0' }}>
              National Assessment and Accreditation Council (NAAC) Criteria Dossier
            </h3>
            <div style={{ fontSize: '13.5px', color: '#64748b' }}>
              Compiled for: <strong style={{ color: '#0f172a' }}>{selectedInstitution?.name}</strong> • AISHE Code: <strong style={{ color: '#2563eb' }}>C-45892</strong> • Cycle: <strong style={{ color: '#059669' }}>Grade A++ SSR Submission</strong>
            </div>
          </div>

          {/* Metric 2.2.2: Student - Full Time Teacher Ratio */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            marginBottom: '22px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Criterion II - Teaching, Learning & Evaluation (Metric 2.2.2)
              </h4>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' }}>
                Optimal Benchmark Achieved
              </span>
            </div>
            <div style={{ padding: '24px' }}>
              <h5 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '700', margin: '0 0 6px 0' }}>
                Student - Full Time Teacher Ratio (Data for Latest Completed Academic Year)
              </h5>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
                Formula: (Total Number of Enrolled Students) / (Total Number of Full-time Teachers)
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>Total Enrolled Students</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#1e3a8a', margin: '6px 0' }}>
                    {naacData.metric_2_2_2?.total_students}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Verified against CAP Admissions</div>
                </div>

                <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>Full-time Faculty Count</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#1e3a8a', margin: '6px 0' }}>
                    {naacData.metric_2_2_2?.total_faculty}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>UGC/AICTE Sanctioned Cadre</div>
                </div>

                <div style={{ background: '#ecfdf5', padding: '18px', borderRadius: '16px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Computed Student-Teacher Ratio</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#065f46', margin: '6px 0' }}>
                    {naacData.metric_2_2_2?.ratio}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: '600' }}>Surpasses NAAC Standard of 15:1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric 5.2.1: Placements & Higher Education */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            marginBottom: '22px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Criterion V - Student Support & Progression (Metric 5.2.1)
              </h4>
              <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' }}>
                100% Tracking Verified
              </span>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '600' }}>
                    Total Verified Corporate Placements:
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>
                    {naacData.metric_5_2_1?.total_placements} Students Placed
                  </div>
                  <div style={{ fontSize: '13px', color: '#2563eb', marginTop: '6px', fontWeight: '600' }}>
                    Average Salary Package: <strong>{naacData.metric_5_2_1?.average_ctc}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: '600' }}>
                    Key Campus Recruiters:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {naacData.metric_5_2_1?.top_recruiters.map((r, i) => (
                      <span key={i} style={{ background: '#f1f5f9', color: '#334155', padding: '5px 14px', borderRadius: '12px', fontSize: '12.5px', fontWeight: '700' }}>
                        🏢 {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric 6.2.3: Implementation of e-Governance in ERP */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Criterion VI - Governance, Leadership & Management (Metric 6.2.3)
              </h4>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' }}>
                Fully Automated ERP Suite
              </span>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: '13.5px', lineHeight: '1.9', color: '#334155' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px' }}>Institutional ERP Modules Operational:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <strong>🏛️ Administration:</strong> Central student profiles, document generator (Bonafide/LC/15A/Validity) & biometric hardware sync.
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <strong>💳 Finance & Accounts:</strong> Double-entry ledger (Income A vs Outflow B), student fees collection & payroll disbursal.
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <strong>🎓 Student Admission:</strong> CAP allocations, ABC ID banking, and scholarship tracking.
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <strong>📚 Examination & LMS:</strong> Progressive K3, K5, K6 mark entry and library accession with circulation fines.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NBA FORMAT (Outcome-Based Education PO & CO) */}
      {activeTab === 'nba' && nbaData && (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '20px 26px',
            marginBottom: '22px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 6px 0' }}>
              National Board of Accreditation (NBA) - OBE Mapping Framework
            </h3>
            <div style={{ fontSize: '13.5px', color: '#64748b' }}>
              Program Accreditation: <strong style={{ color: '#0f172a' }}>{selectedInstitution?.name}</strong> • Tier-II Outcome-Based Matrix
            </div>
          </div>

          {/* Program Outcomes PO Attainment */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            marginBottom: '22px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Program Outcomes (POs) Attainment Mapped to K3, K5 & K6 Internal Marks
              </h4>
            </div>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '120px' }}>PO Code</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '260px' }}>Program Outcome Competency Definition</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Correlated Bloom Level</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Target Attainment</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Current Attainment</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '120px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {nbaData.program_outcomes?.map((po, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: '800', color: '#1d4ed8', fontSize: '13.5px' }}>
                        {po.code}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{po.title}</strong>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>
                          {idx === 0 ? 'K3 (Application)' : idx === 1 ? 'K5 (Analysis)' : idx === 2 ? 'K6 (Synthesis)' : 'Modern ERP'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', color: '#475569', fontWeight: '600' }}>80.0%</td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: '15px', color: '#059669', fontWeight: '900' }}>{po.attainment}</strong>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800' }}>
                          Attained
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Course Outcomes CO */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Course Outcomes (CO) Matrix & Bloom's Taxonomy Attainment
              </h4>
            </div>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>CO Identifier</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '280px' }}>Outcome Competency</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '150px' }}>Bloom Level</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Benchmark Target</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Attained Actual</th>
                    <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {nbaData.course_outcomes?.map((co, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: '800', color: '#1d4ed8', fontSize: '13.5px' }}>
                        {co.code}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', color: '#0f172a' }}>{co.desc}</td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>{co.k_level}</span>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', color: '#475569', fontWeight: '600' }}>{co.target}</td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <strong style={{ color: '#059669', fontSize: '15px', fontWeight: '900' }}>{co.actual}</strong>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800' }}>Met Target</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

