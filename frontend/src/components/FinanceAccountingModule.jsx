import React, { useState, useEffect, useRef } from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertCircle,
  X,
  Users,
  Eye,
  Wallet,
  BookOpen,
  CreditCard
} from 'lucide-react';

// === BELHEKAR BRAND COLORS (matching screenshot) ===
const C = {
  orange:     '#f97316',
  orangeDark: '#ea580c',
  orangeDeep: '#c2410c',
  orangeLight:'#fff7ed',
  orangeBorder:'#fed7aa',
  amber:      '#f59e0b',
  amberDark:  '#d97706',
  amberLight: '#fffbeb',
  white:      '#ffffff',
  bg:         '#f8fafc',
  cardBg:     '#ffffff',
  border:     '#e2e8f0',
  borderLight:'#f1f5f9',
  text:       '#0f172a',
  textMuted:  '#64748b',
  textLight:  '#94a3b8',
  slate:      '#334155',
  green:      '#16a34a',
  greenLight: '#dcfce7',
  greenDark:  '#14532d',
  red:        '#dc2626',
  redLight:   '#fee2e2',
  redDark:    '#991b1b',
  blue:       '#2563eb',
  blueLight:  '#eff6ff',
};

const orangeGrad = `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`;
const amberGrad  = `linear-gradient(135deg, ${C.amber} 0%, ${C.amberDark} 100%)`;
const darkGrad   = `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`;

export default function FinanceAccountingModule({ selectedInstitution, currentUser }) {
  const [activeTab, setActiveTab]             = useState('summary');
  const [summary, setSummary]                 = useState(null);
  const [feesList, setFeesList]               = useState([]);
  const [expensesList, setExpensesList]       = useState([]);
  const [scholarshipsList, setScholarshipsList] = useState([]);
  const [students, setStudents]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [feeSearch, setFeeSearch]             = useState('');
  const [duesSearch, setDuesSearch]           = useState('');
  const [duesDept, setDuesDept]               = useState('');
  const [showFeeModal, setShowFeeModal]       = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeReceipt, setActiveReceipt]     = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const receiptRef = useRef(null);

  const [feeForm, setFeeForm] = useState({
    student_id: '',
    receipt_no: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    payment_date: new Date().toISOString().split('T')[0],
    tuition_fee: 45000,
    development_fee: 8000,
    exam_fee: 3500,
    registration_fee: 2500,
    bonafide_fee: 0,
    form15a_fee: 0,
    lc_fee: 0,
    hostel_fee: 0,
    transport_fee: 0,
    other_fee: 0,
    scholarship_adjusted: 0,
    payment_mode: 'UPI',
    ref_transaction_no: '',
    remarks: 'Term-1 Academic and Institutional Fees'
  });

  const [expenseForm, setExpenseForm] = useState({
    voucher_no: `VOU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    payment_date: new Date().toISOString().split('T')[0],
    category: 'Petty Cash Voucher',
    payee_name: '',
    amount: '',
    payment_mode: 'Cash',
    cheque_no: '',
    description: '',
    approved_by: currentUser?.full_name || 'Dr. Rameshwar Patil (Principal)'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const instId = selectedInstitution?.id || 1;
      const [sumRes, feesRes, expRes, schRes, stuRes] = await Promise.all([
        fetch(`/api/accounts/summary?institution_id=${instId}`),
        fetch(`/api/accounts/fees?institution_id=${instId}`),
        fetch(`/api/accounts/expenditures?institution_id=${instId}`),
        fetch(`/api/accounts/scholarships?institution_id=${instId}`),
        fetch(`/api/students?institution_id=${instId}`)
      ]);
      const [sumData, feesData, expData, schData, stuData] = await Promise.all([
        sumRes.json(), feesRes.json(), expRes.json(), schRes.json(), stuRes.json()
      ]);
      setSummary(sumData);
      setFeesList(feesData);
      setExpensesList(expData);
      setScholarshipsList(schData);
      setStudents(stuData);
      if (stuData.length > 0 && !feeForm.student_id) {
        setFeeForm(prev => ({ ...prev, student_id: stuData[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedInstitution]);

  const fmt = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);

  const calcTotal = () =>
    Number(feeForm.tuition_fee || 0) + Number(feeForm.development_fee || 0) +
    Number(feeForm.exam_fee || 0) + Number(feeForm.registration_fee || 0) +
    Number(feeForm.bonafide_fee || 0) + Number(feeForm.form15a_fee || 0) +
    Number(feeForm.lc_fee || 0) + Number(feeForm.hostel_fee || 0) +
    Number(feeForm.transport_fee || 0) + Number(feeForm.other_fee || 0) -
    Number(feeForm.scholarship_adjusted || 0);

  const handleSaveFee = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/accounts/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...feeForm, institution_id: selectedInstitution?.id || 1, created_by: currentUser?.full_name || 'Account Officer' })
    });
    if (res.ok) {
      setShowFeeModal(false);
      fetchData();
      setFeeForm(prev => ({
        ...prev,
        receipt_no: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        bonafide_fee: 0, form15a_fee: 0, lc_fee: 0, other_fee: 0, scholarship_adjusted: 0, ref_transaction_no: ''
      }));
    }
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/accounts/expenditures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expenseForm, institution_id: selectedInstitution?.id || 1 })
    });
    if (res.ok) { setShowExpenseModal(false); fetchData(); }
  };

  const handleUpdateScholarship = async (id, inst1, inst2) => {
    await fetch(`/api/accounts/scholarships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inst1_status: inst1, inst2_status: inst2 })
    });
    fetchData();
  };

  const handleActualPrint = () => {
    const html = receiptRef.current?.innerHTML;
    const win = window.open('', '_blank', 'width=900,height=720');
    win.document.write(`<html><head><title>Fee Receipt - ${activeReceipt?.receipt_no}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff}
        .rw{max-width:710px;margin:0 auto;padding:24px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th{background:#ea580c;color:#fff;padding:7px 11px;text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:.5px}
        td{padding:7px 11px;border-bottom:1px solid #f3f4f6}
        tr:nth-child(even) td{background:#fff7ed}
        .net-box{background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;border-radius:8px;padding:12px 16px;margin:12px 0;display:flex;justify-content:space-between;align-items:center}
        @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
      </style></head><body><div class="rw">${html}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  // Pending dues
  const paidMap = {};
  feesList.forEach(f => { paidMap[f.student_id] = (paidMap[f.student_id] || 0) + Number(f.total_amount || 0); });
  const pendingDues = students.filter(s => {
    const due = Number(s.tuition_fee||0)+Number(s.development_fee||0)+Number(s.exam_fee||0)+Number(s.registration_fee||0)+Number(s.other_fee||0);
    return due - (paidMap[s.id]||0) > 0;
  }).map(s => {
    const totalDue = Number(s.tuition_fee||0)+Number(s.development_fee||0)+Number(s.exam_fee||0)+Number(s.registration_fee||0)+Number(s.other_fee||0);
    const paid = paidMap[s.id]||0;
    return { ...s, totalDue, paid, outstanding: totalDue - paid };
  });

  const filteredFees = feesList.filter(f => {
    if (!feeSearch) return true;
    const q = feeSearch.toLowerCase();
    return (f.receipt_no||'').toLowerCase().includes(q)||(f.student_name||'').toLowerCase().includes(q)||(f.enrollment_no||'').toLowerCase().includes(q);
  });

  const filteredDues = pendingDues.filter(s => {
    const q = duesSearch.toLowerCase();
    return (!duesDept || s.department===duesDept) &&
           (!duesSearch || s.full_name.toLowerCase().includes(q) || s.enrollment_no.toLowerCase().includes(q));
  });

  const departments = [...new Set(students.map(s => s.department))].sort();
  const totalPending = filteredDues.reduce((sum,s) => sum+s.outstanding, 0);
  const instName    = selectedInstitution?.name    || 'Belhekar Educational Complex';
  const instAddress = selectedInstitution?.address || 'Udgir, Dist. Latur, Maharashtra - 413517';
  const instPhone   = selectedInstitution?.phone   || '';
  const instEmail   = selectedInstitution?.email   || '';

  // ---- Reusable styled components ----
  const TabBtn = ({ id, icon: Icon, label }) => {
    const active = activeTab === id;
    return (
      <button onClick={() => setActiveTab(id)} style={{
        background: active ? orangeGrad : C.white,
        color:  active ? C.white : C.slate,
        border: active ? 'none' : `1.5px solid ${C.border}`,
        borderRadius: '12px',
        padding: '9px 18px',
        fontSize: '13px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        cursor: 'pointer',
        boxShadow: active ? '0 4px 14px rgba(234,88,12,0.35)' : 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap'
      }}>
        <Icon size={15} />
        <span>{label}</span>
      </button>
    );
  };

  const ThBadge = ({ label, count, color='orange' }) => {
    const colors = {
      orange: { bg: C.orangeLight, color: C.orangeDark },
      blue:   { bg: C.blueLight,   color: C.blue },
      red:    { bg: C.redLight,     color: C.red },
      green:  { bg: C.greenLight,   color: C.green },
      amber:  { bg: C.amberLight,   color: C.amberDark },
    };
    const c = colors[color];
    return (
      <span style={{ background: c.bg, color: c.color, padding: '2px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
        {count !== undefined ? `${count} ${label}` : label}
      </span>
    );
  };

  const statusBadge = (status) => {
    const map = {
      Received: { bg: C.greenLight,  color: C.green },
      Adjusted: { bg: C.blueLight,   color: C.blue },
      Pending:  { bg: C.amberLight,  color: C.amberDark },
    };
    const c = map[status] || map.Pending;
    return <span style={{ background: c.bg, color: c.color, padding: '3px 11px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '800' }}>{status || 'Pending'}</span>;
  };

  const searchInputStyle = {
    paddingLeft: '34px',
    padding: '9px 13px 9px 34px',
    border: `1.5px solid ${C.border}`,
    borderRadius: '10px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    color: C.text,
    background: C.white,
  };

  // Table header cell
  const TH = ({ children, align='left', min }) => (
    <th style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', textAlign: align, minWidth: min }}>
      {children}
    </th>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '4px 4px 40px 4px' }}>

      {/* ===== HEADER BANNER ===== */}
      <div style={{
        background: `linear-gradient(135deg, ${C.white} 0%, #fff7ed 55%, #ffedd5 100%)`,
        borderRadius: '22px',
        padding: '22px 28px',
        marginBottom: '18px',
        boxShadow: '0 8px 28px -4px rgba(234,88,12,0.10)',
        border: `1px solid ${C.orangeBorder}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px', height: '54px', borderRadius: '16px',
            background: orangeGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 22px rgba(234,88,12,0.38)', flexShrink: 0
          }}>
            <Wallet size={28} color={C.white} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: C.text, margin: 0, letterSpacing: '-0.5px' }}>
              Accounts &amp; <span style={{ background: orangeGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fee Management</span>
            </h1>
            <p style={{ color: C.textMuted, fontSize: '13px', margin: '3px 0 0 0', fontWeight: '500' }}>
              Fee collection &nbsp;·&nbsp; Receipts &nbsp;·&nbsp; Scholarships &nbsp;·&nbsp; Expenditure &nbsp;·&nbsp; Outstanding Dues
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Collect Fee Button — orange */}
          <button onClick={() => setShowFeeModal(true)} style={{
            background: orangeGrad, color: C.white, border: 'none',
            borderRadius: '12px', padding: '11px 20px', fontWeight: '700', fontSize: '13.5px',
            display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(234,88,12,0.38)',
            transition: 'all 0.2s'
          }}>
            <Plus size={17} strokeWidth={2.5} /><span>Collect Student Fee</span>
          </button>
          {/* New Expense Button — amber/dark */}
          <button onClick={() => setShowExpenseModal(true)} style={{
            background: amberGrad, color: C.white, border: 'none',
            borderRadius: '12px', padding: '11px 20px', fontWeight: '700', fontSize: '13.5px',
            display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(245,158,11,0.38)',
            transition: 'all 0.2s'
          }}>
            <Plus size={17} strokeWidth={2.5} /><span>New Expense Voucher</span>
          </button>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <TabBtn id="summary"      icon={TrendingUp}  label="Ledger Summary" />
        <TabBtn id="fees"         icon={Receipt}     label={`Fee Receipts (${feesList.length})`} />
        <TabBtn id="dues"         icon={AlertCircle} label={`Pending Dues (${pendingDues.length})`} />
        <TabBtn id="expenditures" icon={DollarSign}  label={`Expenditure (${expensesList.length})`} />
        <TabBtn id="scholarships" icon={ShieldCheck} label={`MahaDBT Scholarships (${scholarshipsList.length})`} />
      </div>

      {/* ==================== TAB 1: LEDGER SUMMARY ==================== */}
      {activeTab === 'summary' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '18px', marginBottom: '18px' }}>

            {/* Income Card */}
            <div style={{ background: C.white, borderRadius: '20px', padding: '22px', border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowUpRight size={20} color={C.green} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: C.greenDark, margin: 0 }}>TOTAL INCOME (A)</h4>
                </div>
                <span style={{ background: C.greenLight, color: C.green, fontWeight: '900', fontSize: '15px', padding: '4px 14px', borderRadius: '16px' }}>{fmt(summary?.income?.totalIncome)}</span>
              </div>
              {[
                ['Tuition & Development Fees', summary?.income?.tuitionAndDev],
                ['Exam & Registration Fees', summary?.income?.examAndOther],
                ['Official Certs (Bonafide/LC/15A)', summary?.income?.certificateFees],
                ['Govt Scholarships Adjusted', summary?.income?.govtScholarshipAdjusted],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 13px', borderRadius: '10px', background: '#fafcff', marginBottom: '8px', border: `1px solid ${C.borderLight}` }}>
                  <span style={{ fontSize: '12.5px', color: C.slate, fontWeight: '600' }}>{label}</span>
                  <strong style={{ fontSize: '13px', color: C.text }}>{fmt(val)}</strong>
                </div>
              ))}
            </div>

            {/* Expenditure Card */}
            <div style={{ background: C.white, borderRadius: '20px', padding: '22px', border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowDownRight size={20} color={C.red} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: C.redDark, margin: 0 }}>TOTAL EXPENDITURE (B)</h4>
                </div>
                <span style={{ background: C.redLight, color: C.red, fontWeight: '900', fontSize: '15px', padding: '4px 14px', borderRadius: '16px' }}>{fmt(summary?.expenditure?.totalExpenditure)}</span>
              </div>
              {[
                ['Staff Payroll Payments', summary?.expenditure?.staffPayroll],
                ['Petty Cash Vouchers', summary?.expenditure?.pettyCashVouchers],
                ['Bank Cheque Disbursements', summary?.expenditure?.bankChequeDisburse],
                ['Institutional Vendor Bills', summary?.expenditure?.vendorBills],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 13px', borderRadius: '10px', background: '#fafcff', marginBottom: '8px', border: `1px solid ${C.borderLight}` }}>
                  <span style={{ fontSize: '12.5px', color: C.slate, fontWeight: '600' }}>{label}</span>
                  <strong style={{ fontSize: '13px', color: C.text }}>{fmt(val)}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Net Balance Banner — orange dark */}
          <div style={{
            background: orangeGrad,
            borderRadius: '18px', padding: '20px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
            boxShadow: '0 8px 24px rgba(234,88,12,0.30)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={22} color={C.white} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: '700', color: C.white }}>Net Institutional Operating Surplus (A - B):</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: C.white }}>
                {fmt(summary?.netBalance)}
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                color: C.white,
                fontSize: '12.5px', fontWeight: '800', padding: '5px 14px', borderRadius: '12px',
                backdropFilter: 'blur(8px)'
              }}>
                {(summary?.netBalance || 0) >= 0 ? 'Net Surplus' : 'Net Deficit'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: FEE RECEIPTS ==================== */}
      {activeTab === 'fees' && (
        <div style={{ background: C.white, borderRadius: '20px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: C.orangeLight }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Receipt size={20} color={C.orange} />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: C.text, margin: 0 }}>Student Fee Collection History</h3>
              <ThBadge label="Records" count={filteredFees.length} color="orange" />
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
                <input type="text" placeholder="Search by name / receipt / enroll..." value={feeSearch}
                  onChange={e => setFeeSearch(e.target.value)}
                  style={{ ...searchInputStyle, width: '260px' }} />
              </div>
              <button onClick={() => setShowFeeModal(true)} style={{
                background: orangeGrad, color: C.white, border: 'none',
                borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: '700',
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(234,88,12,0.35)'
              }}>
                <Plus size={14} /><span>Collect Fee</span>
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: `2px solid ${C.orangeBorder}` }}>
                  <TH>Receipt #</TH><TH min="200px">Student Name</TH><TH>Date</TH>
                  <TH>Tuition & Dev</TH><TH>Exam & Reg</TH><TH>Certs</TH>
                  <TH>Hostel/Trans</TH><TH>Scholarship Adj.</TH><TH>Net Collected</TH>
                  <TH>Mode</TH><TH align="center">Receipt</TH>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length === 0 && (
                  <tr><td colSpan={11} style={{ textAlign: 'center', padding: '50px', color: C.textLight }}>
                    {feeSearch ? 'No matching receipts found.' : 'No fee receipts yet. Click "Collect Fee" to get started.'}
                  </td></tr>
                )}
                {filteredFees.map((fee, idx) => (
                  <tr key={fee.id} style={{ borderBottom: `1px solid ${C.borderLight}`, background: idx%2===0 ? C.white : '#fffaf7', transition: 'background 0.1s' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '800', color: C.orange, fontSize: '13px', whiteSpace: 'nowrap' }}>{fee.receipt_no}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '700', color: C.text, fontSize: '13.5px' }}>{fee.student_name}</div>
                      <div style={{ fontSize: '11px', color: C.textMuted }}>{fee.enrollment_no} &middot; {fee.department}</div>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', color: C.slate }}>{fee.payment_date}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600', color: C.text }}>Rs.{(Number(fee.tuition_fee)+Number(fee.development_fee)).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600', color: C.text }}>Rs.{(Number(fee.exam_fee)+Number(fee.registration_fee)).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600', color: C.text }}>Rs.{(Number(fee.bonafide_fee)+Number(fee.form15a_fee)+Number(fee.lc_fee)).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600', color: C.text }}>Rs.{(Number(fee.hostel_fee)+Number(fee.transport_fee)).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: C.amberDark, fontWeight: '700', fontSize: '13px' }}>- Rs.{Number(fee.scholarship_adjusted).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: C.green, fontSize: '15px', fontWeight: '900' }}>Rs.{Number(fee.total_amount).toLocaleString('en-IN')}</strong>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: C.orangeLight, color: C.orangeDark, padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700', border: `1px solid ${C.orangeBorder}` }}>{fee.payment_mode}</span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button onClick={() => { setActiveReceipt(fee); setShowReceiptModal(true); }} title="View & Print Receipt"
                        style={{ width: '34px', height: '34px', borderRadius: '10px', border: 'none', background: orangeGrad, color: C.white, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 3px 8px rgba(234,88,12,0.35)' }}>
                        <Printer size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PENDING DUES ==================== */}
      {activeTab === 'dues' && (
        <div>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px', marginBottom: '16px' }}>
            {[
              { label: 'Students With Dues', value: pendingDues.length, Icon: Users, bg: C.orangeLight, iconBg: C.orange, textColor: C.orangeDark },
              { label: 'Total Outstanding', value: fmt(totalPending), Icon: AlertCircle, bg: C.amberLight, iconBg: C.amber, textColor: C.amberDark },
              { label: 'Filtered Records', value: filteredDues.length, Icon: Eye, bg: C.blueLight, iconBg: C.blue, textColor: C.blue },
            ].map((c, i) => (
              <div key={i} style={{ background: c.bg, borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', border: `1px solid ${C.border}` }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <c.Icon size={20} color={C.white} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: c.textColor, lineHeight: 1.2 }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, borderRadius: '20px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: '#fff7ed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color={C.orange} />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: C.text, margin: 0 }}>Student Outstanding Dues Register</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
                  <input type="text" placeholder="Search student..." value={duesSearch} onChange={e => setDuesSearch(e.target.value)}
                    style={{ ...searchInputStyle, width: '200px' }} />
                </div>
                <select value={duesDept} onChange={e => setDuesDept(e.target.value)}
                  style={{ padding: '9px 14px', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontSize: '13px', outline: 'none', fontWeight: '600', color: C.slate, fontFamily: 'inherit' }}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                <thead>
                  <tr style={{ background: '#fff3ea', borderBottom: `2px solid ${C.orangeBorder}` }}>
                    {['Enrollment #','Student Name','Department','Year','Total Fees Due','Paid So Far','Outstanding','Status'].map(h => (
                      <th key={h} style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '800', color: C.orangeDeep, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDues.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '50px', color: C.textLight }}>
                      All students have cleared their dues!
                    </td></tr>
                  )}
                  {filteredDues.sort((a,b) => b.outstanding-a.outstanding).map((s, idx) => {
                    const pct = s.totalDue > 0 ? Math.round((s.paid/s.totalDue)*100) : 0;
                    const high = s.outstanding > 50000;
                    return (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${C.borderLight}`, background: high ? '#fff8f3' : idx%2===0 ? C.white : '#fafbfc' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '800', color: C.orange, fontSize: '13px', whiteSpace: 'nowrap' }}>{s.enrollment_no}</td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: '700', color: C.text, fontSize: '13.5px' }}>{s.full_name}</div>
                          <div style={{ fontSize: '11px', color: C.textMuted }}>{s.gender} &middot; {s.category}</div>
                        </td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12.5px', fontWeight: '700', color: C.slate }}>{s.department}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: C.slate }}>{s.current_year}</td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: '700', color: C.text, fontSize: '13.5px' }}>Rs.{s.totalDue.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: '700', color: C.green, fontSize: '13px' }}>Rs.{s.paid.toLocaleString('en-IN')}</div>
                          <div style={{ height: '5px', background: C.borderLight, borderRadius: '4px', marginTop: '5px', width: '80px' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${C.green}, #4ade80)`, borderRadius: '4px' }} />
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <strong style={{ fontSize: '15px', fontWeight: '900', color: high ? C.red : C.orange }}>Rs.{s.outstanding.toLocaleString('en-IN')}</strong>
                        </td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: high ? C.redLight : C.orangeLight, color: high ? C.red : C.orangeDark, padding: '4px 12px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '800', border: `1px solid ${high ? '#fecaca' : C.orangeBorder}` }}>
                            {high ? 'High Due' : 'Partial Paid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {filteredDues.length > 0 && (
                  <tfoot>
                    <tr style={{ background: darkGrad }}>
                      <td colSpan={4} style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>TOTAL ({filteredDues.length} students)</td>
                      <td style={{ padding: '12px 16px', color: '#f1f5f9', fontWeight: '900', fontSize: '14px' }}>Rs.{filteredDues.reduce((s,x)=>s+x.totalDue,0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px', color: '#4ade80', fontWeight: '900', fontSize: '14px' }}>Rs.{filteredDues.reduce((s,x)=>s+x.paid,0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px', color: '#fca5a5', fontWeight: '900', fontSize: '16px' }}>Rs.{totalPending.toLocaleString('en-IN')}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: EXPENDITURES ==================== */}
      {activeTab === 'expenditures' && (
        <div style={{ background: C.white, borderRadius: '20px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.amberLight }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={20} color={C.amberDark} />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: C.text, margin: 0 }}>Campus Expenditure Register</h3>
              <ThBadge label="Vouchers" count={expensesList.length} color="amber" />
            </div>
            <button onClick={() => setShowExpenseModal(true)} style={{
              background: amberGrad, color: C.white, border: 'none',
              borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: '700',
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245,158,11,0.35)'
            }}>
              <Plus size={14} /><span>New Expense Voucher</span>
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '960px' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: `2px solid #fde68a` }}>
                  {['Voucher #','Date','Category','Payee Name','Description','Payment Mode','Amount','Approved By'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '800', color: C.amberDark, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expensesList.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: C.textLight }}>No expenditure vouchers yet.</td></tr>
                )}
                {expensesList.map((exp, idx) => (
                  <tr key={exp.id} style={{ borderBottom: `1px solid ${C.borderLight}`, background: idx%2===0 ? C.white : '#fafbfc' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '800', color: C.amberDark, fontSize: '13px', whiteSpace: 'nowrap' }}>{exp.voucher_no}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', color: C.slate }}>{exp.payment_date}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: C.amberLight, color: C.amberDark, padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700', border: '1px solid #fde68a' }}>{exp.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: '700', color: C.text, fontSize: '13.5px' }}>{exp.payee_name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12.5px', color: C.textMuted, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600', color: C.text }}>
                      {exp.payment_mode}
                      {exp.cheque_no && <div style={{ fontSize: '11px', color: C.textMuted, fontFamily: 'monospace' }}>#{exp.cheque_no}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: C.red, fontSize: '15px', fontWeight: '900' }}>Rs.{Number(exp.amount).toLocaleString('en-IN')}</strong>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12.5px', color: C.textMuted, whiteSpace: 'nowrap' }}>{exp.approved_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: SCHOLARSHIPS ==================== */}
      {activeTab === 'scholarships' && (
        <div style={{ background: C.white, borderRadius: '20px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.greenLight }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color={C.green} />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: C.text, margin: 0 }}>MahaDBT Scholarship Instalment Tracker</h3>
            </div>
            <ThBadge label="Instalments Pending" count={scholarshipsList.filter(s=>s.scholarship_inst1_status==='Pending'||s.scholarship_inst2_status==='Pending').length} color="green" />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
              <thead>
                <tr style={{ background: '#f0fdf4', borderBottom: `2px solid #bbf7d0` }}>
                  {['Enrollment #','Student Name','Category & CAP','Tuition Dues','Instalment 1','Instalment 2','Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '800', color: C.greenDark, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scholarshipsList.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: C.textLight }}>No scholarship-eligible students found.</td></tr>
                )}
                {scholarshipsList.map(s => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '800', color: C.orange, fontSize: '13px', whiteSpace: 'nowrap' }}>{s.enrollment_no}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: '700', color: C.text, fontSize: '13.5px' }}>{s.full_name}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: C.blueLight, color: C.blue, padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>{s.category}</span>
                      <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '3px' }}>{s.cap_type}</div>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: '800', color: C.text }}>Rs.{Number(s.tuition_fee).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>{statusBadge(s.scholarship_inst1_status)}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>{statusBadge(s.scholarship_inst2_status)}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleUpdateScholarship(s.id, 'Received', s.scholarship_inst2_status)}
                          style={{ background: C.greenLight, color: C.green, border: `1px solid #86efac`, borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}>
                          Inst-1 Recv
                        </button>
                        <button onClick={() => handleUpdateScholarship(s.id, s.scholarship_inst1_status, 'Adjusted')}
                          style={{ background: C.blueLight, color: C.blue, border: `1px solid #93c5fd`, borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}>
                          Inst-2 Adj
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== COLLECT FEE MODAL ==================== */}
      {showFeeModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '820px' }}>
            <div className="modal-header" style={{ background: orangeGrad, color: C.white, borderRadius: '20px 20px 0 0' }}>
              <h2 className="modal-title" style={{ color: C.white }}>Collect Student Fee &amp; Issue Receipt</h2>
              <button className="modal-close-btn" onClick={() => setShowFeeModal(false)} style={{ color: C.white, background: 'rgba(255,255,255,0.2)' }}>&times;</button>
            </div>
            <form onSubmit={handleSaveFee}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Select Student *</label>
                    <select className="form-select" required value={feeForm.student_id} onChange={e => setFeeForm({...feeForm, student_id: e.target.value})}>
                      {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.enrollment_no} - {s.department})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Receipt Number</label>
                    <input type="text" className="form-input" value={feeForm.receipt_no} onChange={e => setFeeForm({...feeForm, receipt_no: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Date</label>
                    <input type="date" className="form-input" value={feeForm.payment_date} onChange={e => setFeeForm({...feeForm, payment_date: e.target.value})} />
                  </div>
                </div>

                {/* Fee Categories Grid */}
                <div style={{ background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: '14px', padding: '16px', marginBottom: '14px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '800', color: C.orangeDark, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={14} /> Fee Breakdown Categories
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                    {[
                      ['Tuition Fee (Rs.)',      'tuition_fee'],
                      ['Development Fee (Rs.)',  'development_fee'],
                      ['Exam Fee (Rs.)',          'exam_fee'],
                      ['Registration Fee (Rs.)', 'registration_fee'],
                      ['Bonafide Cert (Rs.)',     'bonafide_fee'],
                      ['Form 15A Fee (Rs.)',      'form15a_fee'],
                      ['LC / TC Fee (Rs.)',       'lc_fee'],
                      ['Other Misc. (Rs.)',       'other_fee'],
                    ].map(([label, key]) => (
                      <div key={key} className="form-group">
                        <label className="form-label">{label}</label>
                        <input type="number" min="0" className="form-input" value={feeForm[key]} onChange={e => setFeeForm({...feeForm, [key]: e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Hostel Fee (Rs.)</label>
                      <input type="number" min="0" className="form-input" value={feeForm.hostel_fee} onChange={e => setFeeForm({...feeForm, hostel_fee: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Transport Fee (Rs.)</label>
                      <input type="number" min="0" className="form-input" value={feeForm.transport_fee} onChange={e => setFeeForm({...feeForm, transport_fee: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Scholarship + Total */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px', background: C.blueLight, padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Scholarship Deduction (Rs.)</label>
                    <input type="number" min="0" className="form-input" value={feeForm.scholarship_adjusted} onChange={e => setFeeForm({...feeForm, scholarship_adjusted: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Remarks</label>
                    <input type="text" className="form-input" value={feeForm.remarks} onChange={e => setFeeForm({...feeForm, remarks: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Total Payable</span>
                    <strong style={{ fontSize: '26px', color: C.orange, lineHeight: 1.2, fontWeight: '900' }}>Rs.{calcTotal().toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Payment Mode */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select className="form-select" value={feeForm.payment_mode} onChange={e => setFeeForm({...feeForm, payment_mode: e.target.value})}>
                      <option value="UPI">UPI / QR Code</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Cheque">Bank Cheque</option>
                      <option value="Net Banking">Net Banking / NEFT</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ref / Transaction # / Cheque No</label>
                    <input type="text" className="form-input" placeholder="UPI ref / Cheque No" value={feeForm.ref_transaction_no} onChange={e => setFeeForm({...feeForm, ref_transaction_no: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFeeModal(false)}>Cancel</button>
                <button type="submit" style={{ background: orangeGrad, color: C.white, border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 6px 18px rgba(234,88,12,0.38)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} /> Confirm Payment &amp; Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EXPENSE VOUCHER MODAL ==================== */}
      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '650px' }}>
            <div className="modal-header" style={{ background: amberGrad, color: C.white, borderRadius: '20px 20px 0 0' }}>
              <h2 className="modal-title" style={{ color: C.white }}>Create Institutional Expense Voucher</h2>
              <button className="modal-close-btn" onClick={() => setShowExpenseModal(false)} style={{ color: C.white, background: 'rgba(255,255,255,0.2)' }}>&times;</button>
            </div>
            <form onSubmit={handleSaveExpense}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Voucher Number</label>
                    <input type="text" className="form-input" value={expenseForm.voucher_no} onChange={e => setExpenseForm({...expenseForm, voucher_no: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Disbursement Date</label>
                    <input type="date" className="form-input" value={expenseForm.payment_date} onChange={e => setExpenseForm({...expenseForm, payment_date: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Expense Category *</label>
                    <select className="form-select" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                      <option value="Staff Payroll">Staff Payroll Payment</option>
                      <option value="Petty Cash Voucher">Petty Cash Voucher</option>
                      <option value="Bank Cheque">Bank Cheque Disbursement</option>
                      <option value="Vendor Bill Settlement">Vendor Bill Settlement</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount (Rs.) *</label>
                    <input type="number" className="form-input" required placeholder="e.g. 15000" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Payee Name / Vendor *</label>
                  <input type="text" className="form-input" required placeholder="e.g. Balaji Stationery / Prof. Anjali Shinde" value={expenseForm.payee_name} onChange={e => setExpenseForm({...expenseForm, payee_name: e.target.value})} />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Particulars / Description</label>
                  <textarea rows={2} className="form-textarea" placeholder="State reason or reference for expense..." value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select className="form-select" value={expenseForm.payment_mode} onChange={e => setExpenseForm({...expenseForm, payment_mode: e.target.value})}>
                      <option value="Cash">Cash</option>
                      <option value="Bank Cheque">Bank Cheque</option>
                      <option value="NEFT/RTGS">NEFT / RTGS</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cheque / Ref No</label>
                    <input type="text" className="form-input" value={expenseForm.cheque_no} onChange={e => setExpenseForm({...expenseForm, cheque_no: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                <button type="submit" style={{ background: amberGrad, color: C.white, border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 6px 18px rgba(245,158,11,0.38)' }}>
                  Authorize &amp; Record Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== PRINT RECEIPT MODAL ==================== */}
      {showReceiptModal && activeReceipt && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: '22px', maxWidth: '760px', width: '95%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.22)' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', borderBottom: `1px solid ${C.border}`, background: C.orangeLight, borderRadius: '22px 22px 0 0' }}>
              <span style={{ fontWeight: '800', fontSize: '15px', color: C.orangeDark, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={18} color={C.orange} /> Fee Receipt Preview — {activeReceipt.receipt_no}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleActualPrint} style={{ background: orangeGrad, color: C.white, border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(234,88,12,0.35)' }}>
                  <Printer size={15} /> Print / Save PDF
                </button>
                <button onClick={() => setShowReceiptModal(false)} style={{ background: C.border, color: C.slate, border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div ref={receiptRef} style={{ padding: '28px 32px', fontFamily: 'Arial, sans-serif', color: '#111' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: `3px solid ${C.orange}`, paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', color: C.orangeDark, letterSpacing: '-0.5px' }}>{instName}</div>
                <div style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginTop: '2px' }}>{instAddress}</div>
                {(instPhone||instEmail) && (
                  <div style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '2px' }}>
                    {instPhone && `Ph: ${instPhone}`}{instPhone && instEmail ? '  |  ' : ''}{instEmail && `Email: ${instEmail}`}
                  </div>
                )}
                <div style={{ display: 'inline-block', background: orangeGrad, color: C.white, fontSize: '14px', fontWeight: '800', padding: '6px 28px', borderRadius: '6px', margin: '10px 0 0 0', letterSpacing: '2px' }}>
                  STUDENT FEE RECEIPT
                </div>
              </div>

              {/* Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px 20px', marginBottom: '14px', fontSize: '11.5px' }}>
                {[
                  ['Receipt No.', activeReceipt.receipt_no],
                  ['Payment Date', activeReceipt.payment_date],
                  ['Payment Mode', activeReceipt.payment_mode],
                  ['Ref / Txn No.', activeReceipt.ref_transaction_no || 'N/A'],
                  ['Issued By', activeReceipt.created_by || 'Accounts Desk'],
                  ['Acad. Year', `${new Date(activeReceipt.payment_date||Date.now()).getFullYear()}-${new Date(activeReceipt.payment_date||Date.now()).getFullYear()+1}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #e5e7eb', padding: '4px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '10.5px' }}>{label}</span>
                    <strong style={{ color: '#0f172a', fontSize: '11.5px' }}>{value}</strong>
                  </div>
                ))}
              </div>

              {/* Student Info */}
              <div style={{ background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  ['Student Name', activeReceipt.student_name],
                  ['Enrollment No.', activeReceipt.enrollment_no],
                  ['Department', activeReceipt.department || '—'],
                  ['Year', activeReceipt.current_year || '—'],
                  ['Remarks', activeReceipt.remarks || '—'],
                  ['Payment Status', 'PAID'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '9.5px', color: C.orangeDark, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#7c2d12' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Fee Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: orangeGrad }}>
                    <th style={{ padding: '8px 12px', color: C.white, textAlign: 'left', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '40px' }}>Sr.</th>
                    <th style={{ padding: '8px 12px', color: C.white, textAlign: 'left', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fee Particulars</th>
                    <th style={{ padding: '8px 12px', color: C.white, textAlign: 'right', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '130px' }}>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1','Tuition Fee',activeReceipt.tuition_fee],
                    ['2','Development Fee',activeReceipt.development_fee],
                    ['3','Exam Fee',activeReceipt.exam_fee],
                    ['4','Registration Fee',activeReceipt.registration_fee],
                    ['5','Bonafide Certificate Fee',activeReceipt.bonafide_fee],
                    ['6','Form 15A Fee',activeReceipt.form15a_fee],
                    ['7','Leaving Certificate (LC) Fee',activeReceipt.lc_fee],
                    ['8','Hostel Fee',activeReceipt.hostel_fee],
                    ['9','Transport Fee',activeReceipt.transport_fee],
                    ['10','Other Miscellaneous Fees',activeReceipt.other_fee],
                  ].filter(([,,amt]) => Number(amt) > 0).map(([sr,name,amt],i) => (
                    <tr key={sr} style={{ background: i%2===0 ? C.white : C.orangeLight, borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '7px 12px', color: '#6b7280' }}>{sr}</td>
                      <td style={{ padding: '7px 12px', fontWeight: '600', color: C.text }}>{name}</td>
                      <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: '700', color: C.text }}>Rs. {Number(amt).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  {Number(activeReceipt.scholarship_adjusted) > 0 && (
                    <tr style={{ background: C.amberLight, borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: '7px 12px', color: C.amberDark }}>-</td>
                      <td style={{ padding: '7px 12px', fontWeight: '700', color: C.amberDark }}>(Less) Scholarship / Govt Grant Adjusted</td>
                      <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: '800', color: C.amberDark }}>- Rs. {Number(activeReceipt.scholarship_adjusted).toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ background: C.orangeLight, borderTop: `2px solid ${C.orange}` }}>
                    <td colSpan={2} style={{ padding: '10px 12px', fontWeight: '900', color: C.orangeDark, fontSize: '14px' }}>NET AMOUNT PAID</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '900', fontSize: '20px', color: C.orange }}>
                      Rs. {Number(activeReceipt.total_amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Amount in Words Banner */}
              <div style={{ background: orangeGrad, color: C.white, borderRadius: '10px', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount in Words</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', marginTop: '2px' }}>{numberToWords(Number(activeReceipt.total_amount))} Rupees Only</div>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900' }}>Rs.{Number(activeReceipt.total_amount).toLocaleString('en-IN')}</div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '14px', borderTop: `1px solid ${C.border}`, fontSize: '11px', color: '#374151' }}>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>* Computer-generated receipt. No signature required.</div>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ border: `2.5px solid ${C.orange}`, color: C.orange, fontWeight: '900', padding: '4px 16px', borderRadius: '6px', letterSpacing: '2px', fontSize: '13px' }}>
                      PAID
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderTop: '1px solid #374151', width: '150px', marginBottom: '4px' }} />
                  <div style={{ fontWeight: '700', fontSize: '12px' }}>Accounts Officer / Cashier</div>
                  <div style={{ color: '#6b7280', fontSize: '10.5px' }}>{instName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Indian number-to-words
function numberToWords(num) {
  if (!num || num === 0) return 'Zero';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens  = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function convert(n) {
    if (n < 20)      return ones[n];
    if (n < 100)     return tens[Math.floor(n/10)] + (n%10 ? ' '+ones[n%10] : '');
    if (n < 1000)    return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' '+convert(n%100) : '');
    if (n < 100000)  return convert(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' '+convert(n%1000) : '');
    if (n < 10000000)return convert(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' '+convert(n%100000) : '');
    return convert(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' '+convert(n%10000000) : '');
  }
  return convert(Math.floor(Math.abs(num)));
}
