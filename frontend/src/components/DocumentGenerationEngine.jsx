import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Printer,
  Edit3,
  Search,
  CheckCircle,
  Building,
  Award,
  Download,
  RotateCcw
} from 'lucide-react';

const DOCUMENT_TYPES = [
  { id: 'bonafide', label: '1. Bonafide Certificate', refPrefix: 'BON' },
  { id: 'lc', label: '2. Leaving Certificate (LC / TC)', refPrefix: 'LC' },
  { id: 'form15a', label: '3. Form 15A (Fee / Income Certificate)', refPrefix: '15A' },
  { id: 'validity', label: '4. Caste Validity Support Letter', refPrefix: 'VAL' }
];

export default function DocumentGenerationEngine({
  selectedInstitution,
  selectedStudentForDoc,
  currentUser
}) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(selectedStudentForDoc?.id || '');
  const [selectedDocType, setSelectedDocType] = useState('bonafide');
  
  // Custom Editable Fields state
  const [docFields, setDocFields] = useState({
    serial_no: `BEL/BON/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    issue_date: new Date().toISOString().split('T')[0],
    academic_year: '2025-26',
    general_reg_no: '',
    purpose: 'Passport / MahaDBT Scholarship / Educational Verification',
    character_conduct: 'Good & Exemplary',
    reason_for_leaving: 'Completed Academic Course / Transferred to Higher Institute',
    progress: 'Satisfactory',
    dues_cleared: 'Yes, All Tuition and Institutional Dues Cleared',
    caste_claim: '',
    caste_cert_no: `CC-MAH-${Math.floor(100000 + Math.random() * 900000)}`,
    scrutiny_committee: 'District Caste Scrutiny Committee, Ahmednagar / Pune',
    authorized_signatory: 'Dr. Rameshwar V. Patil (Principal)'
  });

  // Load students for dropdown
  useEffect(() => {
    fetch(`/api/students?institution_id=${selectedInstitution?.id || 1}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        if (!selectedStudentId && data.length > 0) {
          setSelectedStudentId(data[0].id);
        }
      });
  }, [selectedInstitution]);

  // If a student was passed from Student Management tab
  useEffect(() => {
    if (selectedStudentForDoc?.id) {
      setSelectedStudentId(selectedStudentForDoc.id);
    }
  }, [selectedStudentForDoc]);

  // Find currently selected student object
  const currentStudent = students.find(s => s.id === Number(selectedStudentId)) || students[0] || {};

  // Auto-refresh serial number and fields when doc type or student changes
  useEffect(() => {
    const docMeta = DOCUMENT_TYPES.find(d => d.id === selectedDocType);
    const prefix = docMeta?.refPrefix || 'DOC';
    setDocFields(prev => ({
      ...prev,
      serial_no: `BEL/${prefix}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      caste_claim: currentStudent.category || 'General'
    }));
  }, [selectedDocType, selectedStudentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToAudit = async () => {
    try {
      await fetch('/api/documents/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_id: selectedInstitution?.id || 1,
          student_id: currentStudent.id,
          doc_type: selectedDocType,
          payload: {
            ...docFields,
            student_name: currentStudent.full_name,
            enrollment_no: currentStudent.enrollment_no
          }
        })
      });
      alert(`Certificate ${docFields.serial_no} recorded and archived in ERP document ledger!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="doc-engine-wrapper">

      {/* ===== PREMIUM PAGE HEADER ===== */}
      <div className="doc-engine-header no-print">
        <div className="doc-engine-header-left">
          <div className="doc-engine-icon-wrap">
            <FileCheck2 size={28} color="#ffffff" />
          </div>
          <div>
            <h1 className="doc-engine-title">Document & Statutory Certificate Generation Engine</h1>
            <p className="doc-engine-subtitle">
              Dynamically populates official templates from Student Master Profiles. View, Edit inline &amp; Print official certificates.
            </p>
          </div>
        </div>
        <div className="doc-engine-header-right">
          {/* Decorative certificate illustration */}
          <div className="doc-engine-illustration">
            <Award size={52} color="rgba(255,255,255,0.18)" strokeWidth={1.2} />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="doc-engine-header-actions">
          <button className="doc-btn-save" onClick={handleSaveToAudit}>
            <CheckCircle size={15} />
            <span>Save to Document Registry</span>
          </button>
          <button className="doc-btn-print" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>

      {/* ===== CERTIFICATE GENERATION DETAILS PANEL ===== */}
      <div className="doc-engine-panel no-print">
        <div className="doc-engine-panel-header">
          <FileCheck2 size={16} color="#1d4ed8" />
          <span>Certificate Generation Details</span>
        </div>
        <div className="doc-engine-panel-body">
          {/* Top Row: 3 Selectors */}
          <div className="doc-fields-grid-3">
            {/* Choose Certificate Template */}
            <div className="doc-field-group">
              <label className="doc-field-label">
                <Building size={12} />
                Select Certificate Template *
              </label>
              <div className="doc-select-wrap">
                <Award size={14} color="#1d4ed8" className="doc-select-icon" />
                <select
                  className="doc-select"
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                >
                  {DOCUMENT_TYPES.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Choose Student */}
            <div className="doc-field-group">
              <label className="doc-field-label">
                <Search size={12} />
                Select Enrolled Student *
              </label>
              <div className="doc-select-wrap">
                <Search size={14} color="#1d4ed8" className="doc-select-icon" />
                <select
                  className="doc-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.enrollment_no} - {s.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Academic Year */}
            <div className="doc-field-group">
              <label className="doc-field-label">
                <RotateCcw size={12} />
                Academic Session
              </label>
              <div className="doc-select-wrap">
                <RotateCcw size={14} color="#1d4ed8" className="doc-select-icon" />
                <input
                  type="text"
                  className="doc-input"
                  value={docFields.academic_year}
                  onChange={(e) => setDocFields({ ...docFields, academic_year: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="doc-panel-divider" />

          {/* Bottom Row: Dynamic Fields */}
          <div className="doc-fields-grid-dynamic">
            {/* Serial No */}
            <div className="doc-field-group-sm">
              <label className="doc-field-label-sm">
                <Edit3 size={11} />
                Serial Reference No
              </label>
              <div className="doc-select-wrap">
                <span className="doc-input-prefix">#</span>
                <input
                  type="text"
                  className="doc-input doc-input-sm doc-input-mono"
                  value={docFields.serial_no}
                  onChange={(e) => setDocFields({ ...docFields, serial_no: e.target.value })}
                />
              </div>
            </div>

            {/* Date of Issue */}
            <div className="doc-field-group-sm">
              <label className="doc-field-label-sm">
                <Edit3 size={11} />
                Date of Issue
              </label>
              <div className="doc-select-wrap">
                <Download size={13} color="#1d4ed8" className="doc-select-icon" />
                <input
                  type="date"
                  className="doc-input doc-input-sm"
                  value={docFields.issue_date}
                  onChange={(e) => setDocFields({ ...docFields, issue_date: e.target.value })}
                />
              </div>
            </div>

            {/* Conditional Fields */}
            {selectedDocType === 'bonafide' && (
              <div className="doc-field-group-sm doc-field-span2">
                <label className="doc-field-label-sm">
                  <Edit3 size={11} />
                  Purpose of Bonafide Certificate
                </label>
                <div className="doc-select-wrap">
                  <FileCheck2 size={13} color="#1d4ed8" className="doc-select-icon" />
                  <input
                    type="text"
                    className="doc-input doc-input-sm"
                    value={docFields.purpose}
                    onChange={(e) => setDocFields({ ...docFields, purpose: e.target.value })}
                  />
                </div>
              </div>
            )}
            {selectedDocType === 'lc' && (
              <>
                <div className="doc-field-group-sm doc-field-span2">
                  <label className="doc-field-label-sm"><Edit3 size={11} /> Reason for Leaving</label>
                  <div className="doc-select-wrap">
                    <input type="text" className="doc-input doc-input-sm"
                      value={docFields.reason_for_leaving}
                      onChange={(e) => setDocFields({ ...docFields, reason_for_leaving: e.target.value })}
                    />
                  </div>
                </div>
                <div className="doc-field-group-sm">
                  <label className="doc-field-label-sm"><Edit3 size={11} /> Conduct &amp; Character</label>
                  <div className="doc-select-wrap">
                    <input type="text" className="doc-input doc-input-sm"
                      value={docFields.character_conduct}
                      onChange={(e) => setDocFields({ ...docFields, character_conduct: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}
            {selectedDocType === 'form15a' && (
              <>
                <div className="doc-field-group-sm">
                  <label className="doc-field-label-sm"><Edit3 size={11} /> General Register No. (GR No)</label>
                  <div className="doc-select-wrap">
                    <input
                      type="text"
                      className="doc-input doc-input-sm"
                      placeholder="e.g. 4582 / 2024"
                      value={docFields.general_reg_no}
                      onChange={(e) => setDocFields({ ...docFields, general_reg_no: e.target.value })}
                    />
                  </div>
                </div>
                <div className="doc-field-group-sm">
                  <label className="doc-field-label-sm"><Edit3 size={11} /> Caste as per General Register</label>
                  <div className="doc-select-wrap">
                    <input
                      type="text"
                      className="doc-input doc-input-sm"
                      placeholder="e.g. Hindu Maratha / OBC"
                      value={docFields.caste_claim}
                      onChange={(e) => setDocFields({ ...docFields, caste_claim: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}
            {selectedDocType === 'validity' && (
              <>
                <div className="doc-field-group-sm">
                  <label className="doc-field-label-sm"><Edit3 size={11} /> General Register No. (जर्नल रजिस्टर नोंद)</label>
                  <div className="doc-select-wrap">
                    <input
                      type="text"
                      className="doc-input doc-input-sm"
                      placeholder="e.g. 4582 / 2024"
                      value={docFields.general_reg_no}
                      onChange={(e) => setDocFields({ ...docFields, general_reg_no: e.target.value })}
                    />
                  </div>
                </div>
                <div className="doc-field-group-sm">
                  <label className="doc-field-label-sm"><Edit3 size={11} /> Ref Inward No (जावक क्र.)</label>
                  <div className="doc-select-wrap">
                    <input
                      type="text"
                      className="doc-input doc-input-sm"
                      placeholder="e.g. 2069/1"
                      value={docFields.serial_no}
                      onChange={(e) => setDocFields({ ...docFields, serial_no: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== CERTIFICATE PREVIEW TOOLBAR (no-print) ===== */}
      <div className="doc-preview-toolbar no-print">
        <div className="doc-preview-label">
          <div className="doc-preview-dot"></div>
          <span>Certificate Preview</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Fit Width</span>
          <button className="doc-zoom-btn" title="Zoom Out"><span>−</span></button>
          <button className="doc-zoom-btn" title="Zoom In"><span>+</span></button>
          <button className="doc-zoom-btn" title="Fullscreen"><span>⛶</span></button>
        </div>
      </div>

      {/* =====================================================================
          OFFICIAL PRINTABLE CERTIFICATE — EXACT REPLICA OF REAL DOCUMENTS
          ===================================================================== */}

      {/* ---- BONAFIDE CERTIFICATE ---- */}
      {selectedDocType === 'bonafide' && (
        <div className="real-cert-page">

          {/* Scholarship note */}
          <div className="real-cert-scholarship-note">Used for Scholarship only</div>

          {/* ---- LETTERHEAD ---- */}
          <div className="real-cert-letterhead">
            {/* Left logo (MSBTE Official Seal) */}
            <div className="real-cert-logo-left">
              <img src="/msbte_logo.png" alt="MSBTE Board Logo" className="real-cert-logo-img" />
            </div>

            {/* Centre text */}
            <div className="real-cert-letterhead-center">
              <div className="real-cert-trust-name">
                Sulochana Belhekar Samajik Va Bahu Uddieshiya Shikshan Sanstha
              </div>
              <div className="real-cert-college-name">{selectedInstitution?.name || 'DNYANESHWAR POLYTECHNIC'}</div>
              <div className="real-cert-approval">
                AICTE, DTE Approved and MSBTE Mumbai Affiliated DTE 5248, MSBTE-1174
              </div>
              <div className="real-cert-contact">
                Email- <span className="real-cert-link">1174principal@msbte.ac.in</span>; Web{' '}
                <span className="real-cert-link">https://belhekargroupofinstitute.in/</span>
              </div>
              <div className="real-cert-address">
                {selectedInstitution?.address || 'Bhanashivre, Tal: Newasa, Dist: Ahmednagar (Maharshtra) 414609'}{' '}
                Phone/Fax- {selectedInstitution?.phone || '(02427) 297099; 8830443056'}
              </div>
            </div>

            {/* Right logo (Belhekar Group Official Logo) */}
            <div className="real-cert-logo-right">
              <img src="/belhekar_logo_official.png" alt="Belhekar Group Logo" className="real-cert-logo-img" />
            </div>
          </div>

          {/* Divider */}
          <div className="real-cert-hr-double" />

          {/* ---- TITLE BOX ---- */}
          <div className="real-cert-title-box">
            BONAFIED CERTIFICATE
          </div>

          {/* ---- Sr.No & Date row ---- */}
          <div className="real-cert-srno-row">
            <span>Sr.No. <span className="real-cert-field-value">{docFields.serial_no}</span></span>
            <span className="real-cert-srno-divider">|</span>
            <span>Date: <span className="real-cert-blank-field">__/__/{new Date(docFields.issue_date).getFullYear()}</span></span>
          </div>

          {/* ---- Certificate Body ---- */}
          <div className="real-cert-body">
            <p className="real-cert-para">
              This is certify that Mr./Miss
              <span className="real-cert-blank-underline">
                {currentStudent.full_name || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
              </span>
            </p>
            <p className="real-cert-para">
              Is a Bonafied Student of this College Studying in Year{' '}
              <span className="real-cert-blank-underline">
                {currentStudent.current_year || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
              </span>{' '}
              at Course{' '}
              <span className="real-cert-blank-underline real-cert-bold">
                {currentStudent.department || 'Diploma in\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0Engineering'}
              </span>
              {'  '}Enrolment No:{' '}
              <span className="real-cert-blank-underline">
                {currentStudent.enrollment_no || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
              </span>
            </p>
            <p className="real-cert-para">
              Application id:{' '}
              <span className="real-cert-blank-underline">
                {currentStudent.application_id || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
              </span>{' '}
              For Academic Year <span className="real-cert-underline-text">{docFields.academic_year}</span>.
            </p>
            <p className="real-cert-para">
              His / Her Date of Birth according to our Register is{' '}
              <span className="real-cert-blank-underline">
                {currentStudent.dob || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
              </span>
            </p>
          </div>

          {/* ---- Spacer ---- */}
          <div style={{ height: '40px' }} />

          {/* ---- Footer ---- */}
          <div className="real-cert-footer-bonafide">
            <div>
              <div><strong>Place:</strong> {selectedInstitution?.address?.split(',')[0] || 'Bhanshiware'}</div>
              <div><strong>Date:</strong>  &nbsp;/&nbsp;&nbsp;/{new Date(docFields.issue_date).getFullYear()}</div>
            </div>
            <div className="real-cert-principal-sign">
              <div className="real-cert-sign-line-long" />
              <strong>Principal</strong>
            </div>
          </div>
        </div>
      )}

      {/* ---- LEAVING CERTIFICATE ---- */}
      {selectedDocType === 'lc' && (
        <div className="real-cert-page">

          {/* Letterhead */}
          <div className="real-cert-lc-letterhead">
            <div className="real-cert-logo-left-sm">
              <img src="/belhekar_logo_official.png" alt="Belhekar Logo" className="real-cert-logo-img-sm" />
            </div>
            <div className="real-cert-lc-center">
              <div className="real-cert-lc-trust">Sulochana Belhekar Samajik &amp; Bahuudeshiya Shikshan Sanstha's</div>
              <div className="real-cert-lc-college">{selectedInstitution?.name || 'DNYANESHWAR POLYTECHNIC'}</div>
              <div className="real-cert-lc-address">
                {selectedInstitution?.address || 'Bhanashivre, Tal- Newasa, Dist-Ahmednagar'}
              </div>
              <div className="real-cert-lc-code">
                AICTE Approval No.- F-22-2890/2009 Dated- 29/06/2009<br />
                MSBTE Code- 1174 DTE Code: 5248
              </div>
            </div>
            <div className="real-cert-logo-right">
              <img src="/msbte_logo.png" alt="MSBTE Logo" className="real-cert-logo-img-sm" />
            </div>
          </div>

          <div className="real-cert-hr-single" />

          {/* Title + Register No */}
          <div className="real-cert-lc-title-row">
            <div className="real-cert-lc-title-box">LEAVING CERTIFICATE</div>
            <div className="real-cert-lc-regbox">
              Register No<br />
              <span className="real-cert-blank-underline-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
          </div>

          {/* NB note */}
          <div className="real-cert-nb">
            N.B. No change in any entry is to be made except by the authority issuing the Leaving Certificate and infringement of the rule will be punished with restration.
          </div>

          {/* ---- LC Table ---- */}
          <table className="real-cert-lc-table">
            <tbody>
              <tr>
                <td className="real-cert-lc-td-label">1. Name of candidate in full</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{currentStudent.full_name || ''}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label" style={{ verticalAlign: 'top', paddingTop: '6px' }}>
                  2. Caste and sub caste only in the case of candidate<br />
                  &nbsp;&nbsp;&nbsp;Belonging to Backward classes ane cregory<br />
                  &nbsp;&nbsp;&nbsp;among Backward classes
                </td>
                <td className="real-cert-lc-td-sep" style={{ verticalAlign: 'top', paddingTop: '6px' }}>:-</td>
                <td className="real-cert-lc-td-value" style={{ verticalAlign: 'top', paddingTop: '6px' }}>
                  {currentStudent.category || ''}
                </td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">3. Nationality</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">Indian</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">4. Place of Birth</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{currentStudent.birth_place || ''}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">5. Date of Birth, in Figures</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{currentStudent.dob || ''}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">6. Date of Birth in Words</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">&nbsp;</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">7. Last School / College attended</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">&nbsp;</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  8. Date of Admission
                </td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{currentStudent.admission_year || ''}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">9. Progress</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{docFields.progress}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">10. Conduct</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{docFields.character_conduct}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">11. Date of Leaving Institute</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{docFields.issue_date}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">
                  12. Standard in which studing when leaving the institute:-
                </td>
                <td className="real-cert-lc-td-sep"></td>
                <td className="real-cert-lc-td-value">{currentStudent.department} – {currentStudent.current_year}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">13. Reason of Leaving Institute</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">{docFields.reason_for_leaving}</td>
              </tr>
              <tr>
                <td className="real-cert-lc-td-label">14. Remark</td>
                <td className="real-cert-lc-td-sep">:-</td>
                <td className="real-cert-lc-td-value">&nbsp;</td>
              </tr>
            </tbody>
          </table>

          {/* Certification line */}
          <div className="real-cert-lc-cert-line">
            Certificate that, the above information is{' '}
            <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '200px' }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>{' '}
            accordance with the institute register.
          </div>

          {/* Footer */}
          <div className="real-cert-lc-footer">
            <div>
              <strong>Date:-</strong> &nbsp;/ &nbsp;/20<span style={{ borderBottom: '1px solid #000', paddingBottom: '1px' }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div className="real-cert-lc-signs">
              <div className="real-cert-lc-sign-block">
                <div className="real-cert-sign-line-long" />
                <strong>Checked by</strong>
              </div>
              <div className="real-cert-lc-sign-block" style={{ textAlign: 'right' }}>
                <div className="real-cert-sign-line-long" />
                <strong>Principal</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- FORM 15A ---- */}
      {selectedDocType === 'form15a' && (
        <div className="real-cert-page form15a-page">
          <div className="form15a-container">
            <h1 className="form15a-title">Form-15A</h1>
            <h2 className="form15a-subtitle">Certificate to be given by Principal of the College</h2>

            <div className="form15a-body">
              <p className="form15a-para">
                This is to Certify that Shri/Kum_<strong>{currentStudent.full_name ? currentStudent.full_name.toUpperCase() : 'BARDE SATYAM YASHWANT'}</strong>_ is Student of this {selectedInstitution?.name || 'Dnyaneshwar Polytechnic'} Bhanshiware College in Year {docFields.academic_year || '2025-26'} Enrolment No:_<strong>{currentStudent.enrollment_no || '23611850001'}</strong>_ and he/she is studying in Std Diploma in _<strong>{(currentStudent.department || 'CIVIL').replace(/^Diploma in\s*/i, '').replace(/\s*Engineering$/i, '').toUpperCase()}</strong>_ Engineering faculty. His/her name and other information is as per mentioned at number <span className="form15a-underline">{docFields.general_reg_no || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}</span> in general register. And the Caste stated as per our general register is <span className="form15a-underline">{docFields.caste_claim || currentStudent.category || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}</span> (Strike out of if not applicable).
              </p>
            </div>

            <div className="form15a-footer">
              <div className="form15a-footer-left">
                <div>Place: {selectedInstitution?.address?.split(',')[0] || 'Bhanshiware'}</div>
                <div>
                  Date: {
                    docFields.issue_date
                      ? (function(dStr) {
                          const parts = dStr.split('-');
                          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                          return dStr;
                        })(docFields.issue_date)
                      : '03/07/2026'
                  }
                </div>
              </div>
              <div className="form15a-footer-right">
                <div>Seal and Signature of the Principal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- CASTE VALIDITY (जात पडताळणी प्रस्ताव पत्र) ---- */}
      {selectedDocType === 'validity' && (
        <div className="real-cert-page validity-marathi-page">

          {/* Letterhead Header */}
          <div className="validity-header">
            {/* Left: Sanstha Logo (Clean emblem without text underneath) */}
            <div className="validity-header-left">
              <img
                src="/belhekar_sanstha_logo.jpeg"
                alt="Sanstha Emblem"
                className="validity-sanstha-logo"
                onError={(e) => { e.target.src = '/belhekar_logo_official.png'; }}
              />
            </div>

            {/* Center: Sanstha & College Details */}
            <div className="validity-header-center">
              <div className="validity-trust-title">
                Sulochana Belhekar Samajik Va Bahu Uddieshiya Shikshan Sanstha
              </div>
              <h1 className="validity-college-title">
                {selectedInstitution?.name || 'DNYANESHWAR POLYTECHNIC'}
              </h1>
              <div className="validity-approval-text">
                AICTE, DTE Approved and MSBTE Mumbai Affiliated DTE 5248, MSBTE-1174
              </div>
              <div className="validity-contact-text">
                Email- <span className="validity-link">1174principal@msbte.ac.in</span>; Web{' '}
                <span className="validity-link">http://dnyaneshwarpoly.com/</span>
              </div>
            </div>
          </div>

          {/* Address Bar */}
          <div className="validity-address-bar">
            {selectedInstitution?.address || 'Bhanashivre, Tal: Newasa, Dist: Ahmednagar (Maharashtra) 414609'}{' '}
            Phone/Fax- {selectedInstitution?.phone || '(02427) 297099; 8830443056'}
          </div>

          {/* Ref No & Date */}
          <div className="validity-meta-block">
            <div>SBSBSS/DP/{docFields.academic_year || '2025-26'}/{docFields.serial_no?.split('/')?.pop() || '2069/1'}</div>
            <div>
              Date:{
                docFields.issue_date
                  ? (function(dStr) {
                      const parts = dStr.split('-');
                      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                      return dStr;
                    })(docFields.issue_date)
                  : '03/07/2026'
              }
            </div>
          </div>

          {/* Addressee (प्रति) */}
          <div className="validity-to-block">
            <div>प्रति,</div>
            <div>मा.सदस्य सचिव,</div>
            <div>जात पडताळणी समिती</div>
          </div>
          <div className="validity-to-line" />

          {/* Subject & Reference */}
          <div className="validity-subject-block">
            <div><strong>विषय :- जात पडताळणी प्रस्ताव स्विकारणेबाबत</strong></div>
            <div><strong>संदर्भ: विद्यार्थी विनंती अर्ज प्रमाणे दिनांक :</strong></div>
          </div>

          {/* Salutation & Body */}
          <div className="validity-salutation">मा.महोदय,</div>
          <p className="validity-body-para">
            &nbsp;&nbsp;&nbsp;&nbsp;वरील विषयास अनुसरून विनंती पत्र सादर करण्यात येते कि, आमच्या सुलोचना बेल्हेकर सामाजिक व बहु उद्देशीय शिक्षण संस्था {selectedInstitution?.name || 'ज्ञानेश्वर पॉलीटेक्निक'} भानसहिवरे ता.नेवासा जि. अहमदनगर या कॉलेजमध्ये शैक्षणिक वर्ष <strong>_{docFields.academic_year || '2025-26'}_</strong> मध्ये इ <strong>{currentStudent.current_year ? currentStudent.current_year.toUpperCase() : 'FIRST YEAR'}</strong> वर्ष या वर्गात <strong>_{currentStudent.department ? currentStudent.department.toUpperCase() : 'DIPLOMA IN CIVIL ENGINEERING'}_</strong> या शाखेत शिकत असलेला विद्यार्थी <strong>_{currentStudent.full_name ? currentStudent.full_name.toUpperCase() : 'KARDAK GAURAV SUBHASH'}_</strong> या विद्यार्थ्यांची कॉलेज नोंदणी क्रमांक (Enrollment No.) <strong>_{currentStudent.enrollment_no || '2211740249'}_</strong> Application No. <strong>_{currentStudent.application_id || 'DSD22164392'}_</strong> आहे जर्नल रजिस्टर नोंद <span className="validity-gr-underline">{docFields.general_reg_no || '___________'}</span> हि आहे, या विद्यार्थ्यांचे जात वैधता प्रकरण सादर करत आहोत तरी सदर प्रकरणाचा स्वीकार व्हावा हि नम्र विनंती
          </p>

          <div className="validity-closing">कळावे,</div>

          {/* Footer: Left side under 'कळावे,' has Prof. Ahire H.J Principal, Right side has आपला विश्वासू */}
          <div className="validity-footer-row">
            <div className="validity-footer-left">
              <div className="validity-principal-name-bottom">Prof. Ahire H.J</div>
              <div className="validity-principal-title-bottom">Principal</div>
            </div>
            <div className="validity-sign-off">
              आपला विश्वासू
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
