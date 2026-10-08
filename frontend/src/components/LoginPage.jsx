import { apiFetch } from '../api';
import React, { useState } from 'react';
import {
  Building2,
  Lock,
  User,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronDown,
  KeyRound
} from 'lucide-react';

const DEMO_PRESETS = [
  { role: 'Admin', u: 'admin', p: 'admin123', label: 'Admin (Full Access)', color: '#2563eb' },
  { role: 'Principal', u: 'principal', p: 'prin123', label: 'Principal', color: '#7c3aed' },
  { role: 'Clerk', u: 'clerk', p: 'clerk123', label: 'Clerk (Registrar)', color: '#0891b2' },
  { role: 'Faculty', u: 'faculty', p: 'fac123', label: 'Faculty', color: '#059669' },
  { role: 'Account', u: 'account', p: 'acc123', label: 'Accountant', color: '#d97706' },
  { role: 'Store', u: 'store', p: 'store123', label: 'Store Manager', color: '#ea580c' },
  { role: 'Librarian', u: 'librarian', p: 'lib123', label: 'Librarian', color: '#db2777' }
];

export default function LoginPage({ institutions, onLoginSuccess }) {
  const [selectedInstId, setSelectedInstId] = useState(institutions[0]?.id || 1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeRoleChip, setActiveRoleChip] = useState('');

  const handleSelectPreset = (preset) => {
    setUsername(preset.u);
    setPassword(preset.p);
    setActiveRoleChip(preset.role);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          institutionId: Number(selectedInstId)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid login credentials. Please try again.');
        return;
      }

      // Successful verification
      onLoginSuccess({
        user: data.user,
        institution: data.institution
      });
    } catch (err) {
      setErrorMsg('Unable to connect to ERP server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const selectedInstObj = institutions.find(i => i.id === Number(selectedInstId)) || institutions[0];

  return (
    <div className="login-page-bg">
      {/* Decorative Glow Elements */}
      <div
        className="glow-ambient-1"
        style={{
          position: 'absolute',
          top: '-12%',
          left: '-8%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <div
        className="glow-ambient-2"
        style={{
          position: 'absolute',
          bottom: '-12%',
          right: '-8%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Glassmorphic Login Container */}
      <div className="login-glass-card">
        {/* LEFT COLUMN: BRANDING & COLLEGE PORTAL SUMMARY */}
        <div style={{
          background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
          padding: '48px 40px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            {/* Logo & Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                flexShrink: 0,
                padding: '6px'
              }}>
                <img src="/belhekar_logo_official.png" alt="Belhekar Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '23px', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
                  BELHEKAR ERP
                </h2>
                <div style={{ fontSize: '12.5px', color: '#93c5fd', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  Group of Institutions
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.25', margin: '0 0 14px 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Multi-College Centralized ERP System
              </h1>
              <p style={{ fontSize: '14px', color: '#dbeafe', lineHeight: '1.6', margin: 0 }}>
                Select your designated institution and sign in with your role-based credentials to access your campus workspace.
              </p>
            </div>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.12)', padding: '12px 16px', borderRadius: '14px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <Building2 size={20} color="#93c5fd" />
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>12 Specialized Colleges & Schools</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.12)', padding: '12px 16px', borderRadius: '14px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <ShieldCheck size={20} color="#93c5fd" />
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>7 Role-Based Access Control Portals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.12)', padding: '12px 16px', borderRadius: '14px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <CheckCircle size={20} color="#93c5fd" />
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>Biometric Sync, Accounts & Examination</span>
              </div>
            </div>
          </div>

          {/* Selected Campus Badge Footprint */}
          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#93c5fd', fontWeight: '800', marginBottom: '6px' }}>
              Current Target ERP Campus
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} color="#bfdbfe" />
              <span>{selectedInstObj?.name || 'Belhekar Educational Campus'}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM & INSTITUTION SELECTOR */}
        <div style={{ padding: '48px 42px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '26px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Member Authentication
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, fontWeight: '500' }}>
              Choose your college/school and sign in to access your portal.
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Lock size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1. COLLEGE / SCHOOL SELECTION DROPDOWN */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                Select College / School *
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(Number(e.target.value))}
                  className="login-select-field"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '40px',
                    paddingTop: '13px',
                    paddingBottom: '13px'
                  }}
                >
                  {institutions.map((inst, index) => (
                    <option key={inst.id} value={inst.id}>
                      {index + 1}. {inst.name}
                    </option>
                  ))}
                </select>
                <Building2
                  size={19}
                  color="#2563eb"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                />
                <ChevronDown
                  size={18}
                  color="#64748b"
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

            {/* 2. DEMO QUICK ROLE FILLER CHIPS */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Quick Demo Login Fill
                </label>
                <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="#2563eb" /> 1-Click Auto-Fill
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {DEMO_PRESETS.map((preset) => {
                  const isActive = activeRoleChip === preset.role;
                  return (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="login-role-chip"
                      style={{
                        background: isActive ? preset.color : '#f1f5f9',
                        color: isActive ? '#ffffff' : '#334155',
                        borderColor: isActive ? preset.color : '#e2e8f0',
                        boxShadow: isActive ? `0 4px 12px ${preset.color}45` : 'none'
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. USERNAME */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                Username *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. admin, principal, faculty"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setActiveRoleChip('');
                  }}
                  className="login-input-field"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    paddingTop: '13px',
                    paddingBottom: '13px'
                  }}
                />
                <User
                  size={19}
                  color="#64748b"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

            {/* 4. PASSWORD */}
            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setActiveRoleChip('');
                  }}
                  className="login-input-field"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '44px',
                    paddingTop: '13px',
                    paddingBottom: '13px'
                  }}
                />
                <Lock
                  size={19}
                  color="#64748b"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              <span>{loading ? 'Verifying Member...' : 'Sign In to Campus ERP'}</span>
              <ArrowRight size={19} />
            </button>
          </form>

          {/* Footer Security Assurance */}
          <div style={{ marginTop: '26px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <KeyRound size={14} color="#2563eb" />
            <span>256-Bit Encrypted Security | Belhekar Educational Trust</span>
          </div>
        </div>
      </div>
    </div>
  );
}



