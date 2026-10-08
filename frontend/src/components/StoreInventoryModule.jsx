import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Truck,
  ArrowRight,
  TrendingDown,
  Layers,
  MapPin,
  Clock,
  DollarSign,
  Building,
  RotateCcw,
  CheckCircle2,
  Boxes,
  ShieldCheck
} from 'lucide-react';

export default function StoreInventoryModule({ selectedInstitution, currentUser }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'distributions'
  const [inventoryList, setInventoryList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [selectedItemForDist, setSelectedItemForDist] = useState(null);

  // Forms
  const [inwardForm, setInwardForm] = useState({
    supplier_name: '',
    receipt_date: new Date().toISOString().split('T')[0],
    material_name: '',
    category: 'Stationery',
    unit: 'Units',
    received_qty: '',
    rate: '',
    location: 'Central Warehouse Bay 1'
  });

  const [distForm, setDistForm] = useState({
    recipient_name: '',
    recipient_type: 'Person',
    target_institution: selectedInstitution?.name || 'Sant Dnyaneshwar MBA & MCA College',
    department: 'Examination Cell',
    distributed_qty: 1,
    remarks: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const instId = selectedInstitution?.id || 1;

      const invRes = await apiFetch(`/api/store/inventory?institution_id=${instId}`);
      const invData = await invRes.json();
      setInventoryList(invData);

      const distRes = await apiFetch(`/api/store/distributions?institution_id=${instId}`);
      const distData = await distRes.json();
      setDistList(distData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedInstitution]);

  const handleSaveInward = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/store/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inwardForm,
          institution_id: selectedInstitution?.id || 1
        })
      });

      if (res.ok) {
        alert('Material inward stock receipt saved!');
        setShowInwardModal(false);
        fetchData();
      }
    } catch (err) {
      alert('Error saving inward material.');
    }
  };

  const handleSaveDistribute = async (e) => {
    e.preventDefault();
    if (!selectedItemForDist) return;
    try {
      const res = await apiFetch('/api/store/distributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_id: selectedInstitution?.id || 1,
          item_id: selectedItemForDist.id,
          ...distForm
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Stock distributed! Remaining available: ${data.remaining_qty} ${selectedItemForDist.unit}`);
        setShowDistributeModal(false);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error distributing item.');
    }
  };

  const filteredInventory = inventoryList.filter(item => {
    const matchesSearch = item.material_name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Category Icon helper
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'furniture': return '🪑';
      case 'it hardware': return '💻';
      case 'laboratory': return '🧪';
      case 'stationery': return '📚';
      case 'maintenance': return '🛠️';
      default: return '📦';
    }
  };

  const totalAssetValuation = inventoryList.reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0);
  const totalStockUnits = inventoryList.reduce((acc, curr) => acc + Number(curr.available_qty || 0), 0);
  const uniqueSuppliers = new Set(inventoryList.map(i => i.supplier_name)).size;

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
              <Package size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                Central Store & <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Asset Inventory</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0 0', fontWeight: '400' }}>
                Track material inward receipts from vendors and outward distribution to staff, college departments & sister schools.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowInwardModal(true)}
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
            <span>Add Inward Stock (Supplier)</span>
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Asset Valuation</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>
              ₹{Number(totalAssetValuation).toLocaleString('en-IN')}
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
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Materials in Stock</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{totalStockUnits} Units</div>
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
            <Truck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Vendors / Suppliers</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{uniqueSuppliers} Suppliers</div>
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
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outward Distributions</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ea580c', lineHeight: '1.2' }}>{distList.length} Dispatched</div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION PILL TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            background: activeTab === 'inventory' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'inventory' ? '#ffffff' : '#475569',
            border: activeTab === 'inventory' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'inventory' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Layers size={16} />
          <span>Stock Availability Ledger ({inventoryList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('distributions')}
          style={{
            background: activeTab === 'distributions' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'distributions' ? '#ffffff' : '#475569',
            border: activeTab === 'distributions' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'distributions' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Truck size={16} />
          <span>Distribution History ({distList.length})</span>
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
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
              placeholder="Search store inventory by material name, supplier, category, location..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            <option value="">All Material Categories</option>
            <option value="Furniture">Furniture</option>
            <option value="IT Hardware">IT Hardware</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Stationery">Stationery</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          {(search || categoryFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); }}
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

      {/* INVENTORY TABLE */}
      {activeTab === 'inventory' && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={20} color="#2563eb" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Stock Ledger: Total Available Materials
              </h3>
            </div>
            <span style={{
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              Warehouse Live Synced
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1150px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '240px' }}>Material / Item Description</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Supplier Name</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Receipt Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Received Qty</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '110px' }}>Rate (₹)</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Total Cost</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Available In Stock</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '180px' }}>Store Location</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', whiteSpace: 'nowrap', minWidth: '110px' }}>Distribute</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      Loading inventory items...
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No inventory records found.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{getCategoryIcon(item.category)}</span>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{item.material_name}</strong>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>Category: <strong>{item.category}</strong></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', color: '#334155' }}>
                        <strong style={{ color: '#0f172a' }}>{item.supplier_name}</strong>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#64748b' }}>{item.receipt_date}</td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', fontWeight: '600', color: '#334155' }}>
                        {item.received_qty} {item.unit}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', fontFamily: 'monospace', color: '#334155' }}>
                        ₹{Number(item.rate).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <strong style={{ color: '#0f172a', fontSize: '14.5px', fontFamily: 'monospace' }}>
                          ₹{Number(item.total_cost).toLocaleString('en-IN')}
                        </strong>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: item.available_qty > 10 ? '#dcfce7' : '#fee2e2',
                          color: item.available_qty > 10 ? '#15803d' : '#b91c1c',
                          padding: '4px 12px',
                          borderRadius: '14px',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {item.available_qty} {item.unit}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                          <MapPin size={14} color="#2563eb" />
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => {
                            setSelectedItemForDist(item);
                            setShowDistributeModal(true);
                          }}
                          disabled={item.available_qty <= 0}
                          style={{
                            background: item.available_qty <= 0 ? '#f1f5f9' : '#ffffff',
                            color: item.available_qty <= 0 ? '#94a3b8' : '#2563eb',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            padding: '6px 14px',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: item.available_qty <= 0 ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                        >
                          <span>Issue</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISTRIBUTIONS TABLE */}
      {activeTab === 'distributions' && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} color="#2563eb" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Material Distribution Outward History
              </h3>
            </div>
            <span style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              Audit Verified
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Distribution Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '220px' }}>Material Issued</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Recipient Name</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '220px' }}>College / School</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Department</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Qty Issued</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Remaining Stock</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Remarks / Requisition</th>
                </tr>
              </thead>
              <tbody>
                {distList.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#475569' }}>{d.distribution_date}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{d.material_name}</strong>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{d.recipient_name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>({d.recipient_type})</div>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#334155' }}>{d.target_institution}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>
                        {d.department}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#dc2626', fontSize: '14px', fontWeight: '900' }}>
                        {d.distributed_qty} {d.unit}
                      </strong>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                        {d.remaining_qty} {d.unit}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '12.5px', color: '#475569', whiteSpace: 'nowrap' }}>{d.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD INWARD STOCK MODAL */}
      {showInwardModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Record Material Inward Receipt</h2>
              <button className="modal-close-btn" onClick={() => setShowInwardModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveInward}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Name of Supplier *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Navneet Stationery Works Pvt Ltd"
                      value={inwardForm.supplier_name}
                      onChange={(e) => setInwardForm({ ...inwardForm, supplier_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Receipt *</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={inwardForm.receipt_date}
                      onChange={(e) => setInwardForm({ ...inwardForm, receipt_date: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Material / Item Description *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. A4 Paper Rim, Dell Desktops, Ergonomic Chairs"
                      value={inwardForm.material_name}
                      onChange={(e) => setInwardForm({ ...inwardForm, material_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit of Measure</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Nos, Ream, Sets"
                      value={inwardForm.unit}
                      onChange={(e) => setInwardForm({ ...inwardForm, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Received Quantity *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      placeholder="e.g. 50"
                      value={inwardForm.received_qty}
                      onChange={(e) => setInwardForm({ ...inwardForm, received_qty: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rate per Unit (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      placeholder="e.g. 250"
                      value={inwardForm.rate}
                      onChange={(e) => setInwardForm({ ...inwardForm, rate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={inwardForm.category}
                      onChange={(e) => setInwardForm({ ...inwardForm, category: e.target.value })}
                    >
                      <option value="Stationery">Stationery</option>
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Warehouse Storage Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inwardForm.location}
                    onChange={(e) => setInwardForm({ ...inwardForm, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInwardModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Inward Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISTRIBUTE MATERIAL MODAL */}
      {showDistributeModal && selectedItemForDist && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Distribute Store Material</h2>
              <button className="modal-close-btn" onClick={() => setShowDistributeModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveDistribute}>
              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af' }}>
                    {selectedItemForDist.material_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Available in Store: <strong>{selectedItemForDist.available_qty} {selectedItemForDist.unit}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Name of Recipient Person *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Prof. Nilesh Thorat"
                      value={distForm.recipient_name}
                      onChange={(e) => setDistForm({ ...distForm, recipient_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity to Distribute *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      min={1}
                      max={selectedItemForDist.available_qty}
                      value={distForm.distributed_qty}
                      onChange={(e) => setDistForm({ ...distForm, distributed_qty: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Target College / School *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={distForm.target_institution}
                      onChange={(e) => setDistForm({ ...distForm, target_institution: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department / Lab</label>
                    <input
                      type="text"
                      className="form-input"
                      value={distForm.department}
                      onChange={(e) => setDistForm({ ...distForm, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks / Purpose of Requisition</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Examination hall usage"
                    value={distForm.remarks}
                    onChange={(e) => setDistForm({ ...distForm, remarks: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDistributeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Distribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

