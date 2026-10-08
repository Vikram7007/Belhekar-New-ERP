import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  BookMarked,
  Plus,
  Search,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  ShieldCheck,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function LibraryManagementModule({ selectedInstitution, currentUser }) {
  const [activeTab, setActiveTab] = useState('books'); // 'books', 'journals', 'circulation'
  const [books, setBooks] = useState([]);
  const [journals, setJournals] = useState([]);
  const [circulation, setCirculation] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Forms
  const [bookForm, setBookForm] = useState({
    accession_no: `ACC-BK-${Math.floor(10000 + Math.random() * 90000)}`,
    title: '',
    author: '',
    publisher: '',
    edition: '1st Edition',
    category: 'Management & IT',
    shelf_location: 'Rack B-04',
    total_copies: 5,
    price: 650
  });

  const [journalForm, setJournalForm] = useState({
    accession_no: `ACC-JRN-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    issn: '',
    publisher: '',
    frequency: 'Monthly',
    volume_issue: 'Vol. 12, Issue 3',
    subscription_year: '2025-26',
    shelf_location: 'Journal Stand A'
  });

  const [issueForm, setIssueForm] = useState({
    item_type: 'Book',
    item_id: '',
    borrower_type: 'Student',
    borrower_id: '',
    due_days: 15
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const instId = selectedInstitution?.id || 1;

      const [bRes, jRes, cRes, sRes, fRes] = await Promise.all([
        fetch(`/api/library/books?institution_id=${instId}`),
        fetch(`/api/library/journals?institution_id=${instId}`),
        fetch(`/api/library/circulation?institution_id=${instId}`),
        fetch(`/api/students?institution_id=${instId}`),
        fetch(`/api/faculty?institution_id=${instId}`)
      ]);

      const [bData, jData, cData, sData, fData] = await Promise.all([
        bRes.json(),
        jRes.json(),
        cRes.json(),
        sRes.json(),
        fRes.json()
      ]);

      setBooks(bData);
      setJournals(jData);
      setCirculation(cData);
      setStudents(sData);
      setFaculty(fData);

      if (bData.length > 0 && !issueForm.item_id) {
        setIssueForm(prev => ({ ...prev, item_id: bData[0].id }));
      }
      if (sData.length > 0 && !issueForm.borrower_id) {
        setIssueForm(prev => ({ ...prev, borrower_id: sData[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedInstitution]);

  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookForm, institution_id: selectedInstitution?.id || 1 })
      });
      if (res.ok) {
        alert('Book accessioned successfully into central library!');
        setShowBookModal(false);
        fetchData();
      }
    } catch (err) {
      alert('Error saving book.');
    }
  };

  const handleSaveJournal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...journalForm, institution_id: selectedInstitution?.id || 1 })
      });
      if (res.ok) {
        alert('Journal accession recorded!');
        setShowJournalModal(false);
        fetchData();
      }
    } catch (err) {
      alert('Error saving journal.');
    }
  };

  const handleIssueItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...issueForm, institution_id: selectedInstitution?.id || 1 })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Item successfully issued to borrower!');
        setShowIssueModal(false);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error issuing item.');
    }
  };

  const handleReturnItem = async (circId) => {
    if (!window.confirm('Confirm return of this library book / journal?')) return;
    try {
      const res = await fetch('/api/library/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circulation_id: circId })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.fine_amount > 0) {
          alert(`Item returned. Overdue Late Fine applied: ₹${data.fine_amount}`);
        } else {
          alert('Item returned on time with zero fine.');
        }
        fetchData();
      }
    } catch (err) {
      alert('Error processing return.');
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.accession_no.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalCopiesCount = books.reduce((acc, c) => acc + Number(c.total_copies || 0), 0);
  const activeBorrowedCount = circulation.filter(c => c.status !== 'Returned').length;

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
              <BookOpen size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                Library Management <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>System (LMS)</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0 0', fontWeight: '400' }}>
                Book & Journal accession cataloging, barcode/accession numbering, circulation desk & automated late fine calculation.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowIssueModal(true)}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 20px',
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
            <BookMarked size={18} />
            <span>Issue Book / Journal</span>
          </button>
          <button
            onClick={() => setShowBookModal(true)}
            style={{
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '12px 18px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={16} />
            <span>Accession Book</span>
          </button>
          <button
            onClick={() => setShowJournalModal(true)}
            style={{
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '12px 18px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={16} />
            <span>Accession Journal</span>
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
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cataloged Titles</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{books.length} Books</div>
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
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Accessioned Copies</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>{totalCopiesCount} Volumes</div>
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
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Circulation Loans</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{activeBorrowedCount} Borrowed</div>
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
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subscribed Periodicals</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ea580c', lineHeight: '1.2' }}>{journals.length} UGC CARE</div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION PILL TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('books')}
          style={{
            background: activeTab === 'books' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'books' ? '#ffffff' : '#475569',
            border: activeTab === 'books' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'books' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <BookOpen size={16} />
          <span>Books Catalog ({books.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('journals')}
          style={{
            background: activeTab === 'journals' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'journals' ? '#ffffff' : '#475569',
            border: activeTab === 'journals' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'journals' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Layers size={16} />
          <span>Journals & Periodicals ({journals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('circulation')}
          style={{
            background: activeTab === 'circulation' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
            color: activeTab === 'circulation' ? '#ffffff' : '#475569',
            border: activeTab === 'circulation' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: activeTab === 'circulation' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Clock size={16} />
          <span>Circulation Desk ({circulation.length})</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        padding: '16px 20px',
        marginBottom: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={17} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search catalog by title, accession number, author, category..."
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

      {/* TAB 1: BOOKS CATALOG */}
      {activeTab === 'books' && (
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
              <BookOpen size={20} color="#2563eb" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Accessioned Library Books
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
              {books.length} Unique Titles
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Accession #</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '240px' }}>Title & Author</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Category</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Publisher & Edition</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Shelf Location</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '110px' }}>Total Copies</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Available Copies</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '110px' }}>Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      Loading library catalog...
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No books found in catalog.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: '800', color: '#1d4ed8', fontSize: '13.5px' }}>
                        {b.accession_no}
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{b.title}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>By {b.author}</div>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>
                          {b.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '13.5px', color: '#334155' }}>{b.publisher}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>{b.edition}</div>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                          <MapPin size={13} color="#2563eb" />
                          <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{b.shelf_location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', fontWeight: '700', color: '#334155' }}>{b.total_copies}</td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: b.available_copies > 0 ? '#dcfce7' : '#fee2e2',
                          color: b.available_copies > 0 ? '#15803d' : '#b91c1c',
                          padding: '4px 12px',
                          borderRadius: '14px',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}>
                          {b.available_copies} Available
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>
                        ₹{b.price}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: JOURNALS */}
      {activeTab === 'journals' && (
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
              <Layers size={20} color="#2563eb" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                National & International Subscribed Journals
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
              UGC CARE Listed
            </span>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '150px' }}>Accession #</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '240px' }}>Journal Title</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '150px' }}>ISSN Number</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '180px' }}>Publisher</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Frequency</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Volume & Issue</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '150px' }}>Subscription Year</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '160px' }}>Shelf Location</th>
                </tr>
              </thead>
              <tbody>
                {journals.map((j) => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: '800', color: '#1d4ed8', fontSize: '13.5px' }}>
                      {j.accession_no}
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{j.title}</strong>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '12.5px', color: '#334155' }}>{j.issn}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13.5px', color: '#334155' }}>{j.publisher}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700' }}>
                        {j.frequency}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#475569' }}>{j.volume_issue}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#475569' }}>{j.subscription_year}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#475569' }}>{j.shelf_location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CIRCULATION DESK */}
      {activeTab === 'circulation' && (
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
              <Clock size={20} color="#2563eb" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Circulation Desk: Issued & Overdue Items
              </h3>
            </div>
            <button
              onClick={() => setShowIssueModal(true)}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>Issue New Item</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1150px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '150px' }}>Accession #</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '220px' }}>Title</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '200px' }}>Borrower Details</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Issue Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Due Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '140px' }}>Return Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '130px' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', minWidth: '120px' }}>Late Fine (₹)</th>
                  <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', whiteSpace: 'nowrap', minWidth: '110px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {circulation.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: '800', color: '#1d4ed8', fontSize: '13.5px' }}>
                      {c.accession_no}
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{c.item_title}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>Type: {c.item_type}</div>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{c.borrower_name}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>({c.borrower_type})</div>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#475569' }}>{c.issue_date}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{c.due_date}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontSize: '13px', color: '#64748b' }}>{c.return_date || 'Active Borrow'}</td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        background: c.status === 'Returned' ? '#f1f5f9' : c.status === 'Overdue' ? '#fee2e2' : '#dcfce7',
                        color: c.status === 'Returned' ? '#475569' : c.status === 'Overdue' ? '#b91c1c' : '#15803d',
                        padding: '4px 12px',
                        borderRadius: '14px',
                        fontSize: '12px',
                        fontWeight: '800'
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      <strong style={{ color: c.fine_amount > 0 ? '#dc2626' : '#059669', fontSize: '14.5px' }}>
                        ₹{c.fine_amount}
                      </strong>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {c.status !== 'Returned' && (
                        <button
                          onClick={() => handleReturnItem(c.id)}
                          style={{
                            background: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <RotateCcw size={13} />
                          <span>Return</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACCESSION BOOK MODAL */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Book Accession Register</h2>
              <button className="modal-close-btn" onClick={() => setShowBookModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveBook}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Accession Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={bookForm.accession_no}
                      onChange={(e) => setBookForm({ ...bookForm, accession_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Book Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Modern Operating Systems"
                      value={bookForm.title}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Author / Editor *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={bookForm.author}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publisher</label>
                    <input
                      type="text"
                      className="form-input"
                      value={bookForm.publisher}
                      onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Edition</label>
                    <input
                      type="text"
                      className="form-input"
                      value={bookForm.edition}
                      onChange={(e) => setBookForm({ ...bookForm, edition: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shelf / Rack Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={bookForm.shelf_location}
                      onChange={(e) => setBookForm({ ...bookForm, shelf_location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Copies</label>
                    <input
                      type="number"
                      className="form-input"
                      min={1}
                      value={bookForm.total_copies}
                      onChange={(e) => setBookForm({ ...bookForm, total_copies: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Accession Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACCESSION JOURNAL MODAL */}
      {showJournalModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Journal Accession Register</h2>
              <button className="modal-close-btn" onClick={() => setShowJournalModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveJournal}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Accession No *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={journalForm.accession_no}
                      onChange={(e) => setJournalForm({ ...journalForm, accession_no: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Journal Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={journalForm.title}
                      onChange={(e) => setJournalForm({ ...journalForm, title: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">ISSN Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={journalForm.issn}
                      onChange={(e) => setJournalForm({ ...journalForm, issn: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <select
                      className="form-select"
                      value={journalForm.frequency}
                      onChange={(e) => setJournalForm({ ...journalForm, frequency: e.target.value })}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Bi-Monthly">Bi-Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subscription Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={journalForm.subscription_year}
                      onChange={(e) => setJournalForm({ ...journalForm, subscription_year: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowJournalModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Accession Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE BOOK / JOURNAL MODAL */}
      {showIssueModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Circulation Desk: Issue Item</h2>
              <button className="modal-close-btn" onClick={() => setShowIssueModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleIssueItem}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Item Type</label>
                    <select
                      className="form-select"
                      value={issueForm.item_type}
                      onChange={(e) => setIssueForm({ ...issueForm, item_type: e.target.value })}
                    >
                      <option value="Book">Library Book</option>
                      <option value="Journal">Journal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Title *</label>
                    <select
                      className="form-select"
                      required
                      value={issueForm.item_id}
                      onChange={(e) => setIssueForm({ ...issueForm, item_id: e.target.value })}
                    >
                      {issueForm.item_type === 'Book'
                        ? books.filter(b => b.available_copies > 0).map(b => (
                            <option key={b.id} value={b.id}>
                              {b.accession_no} - {b.title} ({b.available_copies} left)
                            </option>
                          ))
                        : journals.map(j => (
                            <option key={j.id} value={j.id}>
                              {j.accession_no} - {j.title}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Borrower Type</label>
                    <select
                      className="form-select"
                      value={issueForm.borrower_type}
                      onChange={(e) => setIssueForm({ ...issueForm, borrower_type: e.target.value })}
                    >
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty Member</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Borrower *</label>
                    <select
                      className="form-select"
                      required
                      value={issueForm.borrower_id}
                      onChange={(e) => setIssueForm({ ...issueForm, borrower_id: e.target.value })}
                    >
                      {issueForm.borrower_type === 'Student'
                        ? students.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.full_name} ({s.enrollment_no})
                            </option>
                          ))
                        : faculty.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.full_name} ({f.designation})
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Loan Duration (Days)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={issueForm.due_days}
                    onChange={(e) => setIssueForm({ ...issueForm, due_days: e.target.value })}
                  />
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                    Late fine rule: ₹2 per day after due date automatically billed.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowIssueModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

