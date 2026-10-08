import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Lock,
  UserCheck,
  Key,
  Database,
  Cpu
} from 'lucide-react';

export default function AuditTrailModule({ selectedInstitution, currentUser }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/audit-logs?institution_id=${selectedInstitution?.id || 1}&limit=100`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedInstitution]);

  const filteredLogs = logs.filter(l =>
    l.username?.toLowerCase().includes(search.toLowerCase()) ||
    l.module?.toLowerCase().includes(search.toLowerCase()) ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.details?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <History size={26} color="#2563eb" />
            <span>Security & Immutable Audit Trail (Non-Functional Requirement)</span>
          </h1>
          <p>
            Detailed ledger logging every financial receipt, student document generation, marks entry, and authentication attempt.
          </p>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Access Control</span>
            <div className="stat-icon-wrap">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '18px' }}>7 Distinct Portals</div>
          <div className="stat-subtext">Admin, Principal, Clerk, Faculty, Account, Store, Librarian</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-header">
            <span className="stat-label">Encryption Standard</span>
            <div className="stat-icon-wrap emerald">
              <Lock size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '18px', color: '#059669' }}>Bcrypt & SHA-256</div>
          <div className="stat-subtext">Aadhaar, PAN & Credential Data Protection</div>
        </div>

        <div className="stat-card gold">
          <div className="stat-header">
            <span className="stat-label">Audit Immutability</span>
            <div className="stat-icon-wrap gold">
              <Database size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '18px', color: '#b45309' }}>Append-Only Ledger</div>
          <div className="stat-subtext">Forensic traceability with IP & Timestamps</div>
        </div>
      </div>

      {/* Search */}
      <div className="panel-card" style={{ marginBottom: '20px' }}>
        <div className="panel-body" style={{ padding: '14px 20px' }}>
          <div className="search-bar-wrap">
            <Search size={16} />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search audit trail by user, action, module, or detailed event string..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title">
            <span>Central Audit Registry ({logs.length} Total Events)</span>
          </div>
          <span className="badge badge-success">Live Tamper-Proof Log</span>
        </div>
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Assigned Role</th>
                <th>System Module</th>
                <th>Action Type</th>
                <th>Forensic Audit Details</th>
                <th>Client IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                    Loading audit trail logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No audit logs match current search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <strong>{log.username}</strong>
                    </td>
                    <td>
                      <span className="badge badge-info">{log.role}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{log.module}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          log.action === 'LOGIN'
                            ? 'badge-success'
                            : log.action === 'FEE_RECEIPT'
                            ? 'badge-success'
                            : log.action === 'DELETE'
                            ? 'badge-danger'
                            : 'badge-info'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px', color: '#1e293b' }}>{log.details}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#64748b' }}>
                      {log.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
