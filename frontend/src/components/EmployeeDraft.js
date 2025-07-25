import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const EmployeeDraft = () => {
  const { user } = useAuth(); 
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User in EmployeeDraft:", user);

    if (!user?.id) return;

    axios
      .get(`http://localhost:5000/api/v1/drafts/employee/${user.id}?type=save`)
      .then((res) => {
        setDrafts(res.data);
      })
      .catch((err) => {
        console.error('Error fetching drafts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const handleEditDraft = (productId) => {
    navigate(`/homepage/${productId}`, {
      state: { employeeId: user?.id }
    });
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (drafts.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-file"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No Drafts Available</h3>
          <p style={styles.emptyText}>You haven’t saved any product drafts yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <button
        onClick={() => navigate('/homepage')}
        style={styles.backButton}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.backButtonHover)}
        onMouseLeave={(e) => Object.assign(e.target.style, styles.backButton)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
          </svg>
        <span style={{ fontSize: '15px', fontWeight: '500' }}>Back</span>
        </div>
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Draft Products</h1>
      </div>

      {drafts.length === 0 ? ( 
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-file"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No Drafts Available</h3>
          <p style={styles.emptyText}>You haven’t saved any product drafts yet.</p>
        </div>
      </div>
    ):(
      <div style={styles.cardsContainer}>
        {drafts.map((draft) => (
          <div key={draft._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.brandBadge}>{draft.draftData.Brand}</div>
              <div style={styles.categoryBadge}>{draft.draftData.Category}</div>
            </div>

            <div style={styles.cardBody}>
              <h3 style={styles.productName}>{draft.draftData.ProductName}</h3>

              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Barcode:</span>
                  <span style={styles.detailValue}>{draft.draftData.Barcode}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Quantity:</span>
                  <span style={styles.detailValue}>
                    {draft.draftData.Quantity} {draft.draftData.Unit}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.cardFooter}>
              <div style={styles.timestamp}>
                <span style={styles.timestampLabel}>Last saved:</span>
                <span style={styles.timestampValue}>
                  {new Date(draft.lastSaved).toLocaleString()}
                </span>
              </div>
              <div style={styles.actions}>
                <button style={styles.editButton} onClick={() => handleEditDraft(draft.productId)}>
                  Edit Draft
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
  );
};

const styles = {
 container: {
   padding: '2rem',
   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
   backgroundColor: '#f8fafc',
   minHeight: '100vh',
   lineHeight: '1.6',
 },
 backButton: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      // backgroundColor: '#f3f4f6',
      color: '#000000ff',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    // backButtonHover: {
    //   backgroundColor: '#e5e7eb',
    //   color: '#000000',
    //   transform: 'translateY(-2px)',
    //   boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
    // },
 header: {
   marginBottom: '2rem',
   textAlign: 'center',
 },
 title: {
   fontSize: '2.5rem',
   color: '#1e293b',
   marginBottom: '0.5rem',
   fontWeight: '700',
 },
  subtitle: {
     fontSize: '1.1rem',
     color: '#64748b',
     margin: '0',
   },
   emptyState: {
    textAlign: 'center',
    padding: '6rem 1rem',
    color: '#6b7280',
  },
  emptyIcon: {
    padding: '1rem',
    // backgroundColor: '#f3f4f6',
    borderRadius: '50%',
    width: '5rem',
    height: '5rem',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '0.95rem',
  },
 cardsContainer: {
   display: 'grid',
   gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
   gap: '1.5rem',
   maxWidth: '1200px',
   margin: '0 auto',
 },
 card: {
   backgroundColor: 'white',
   borderRadius: '16px',
   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
   overflow: 'hidden',
   transition: 'transform 0.2s ease, box-shadow 0.2s ease',
   border: '1px solid #e2e8f0',
 },
 cardHeader: {
   padding: '1.5rem 1.5rem 0',
   display: 'flex',
   gap: '0.75rem',
   alignItems: 'center',
 },
 brandBadge: {
   backgroundColor: '#10b981',
   color: 'white',
   padding: '0.375rem 0.75rem',
   borderRadius: '20px',
   fontSize: '0.875rem',
   fontWeight: '600',
 },
 categoryBadge: {
   backgroundColor: '#f3f4f6',
   color: '#374151',
   padding: '0.375rem 0.75rem',
   borderRadius: '20px',
   fontSize: '0.875rem',
   fontWeight: '500',
 },
 cardBody: {
   padding: '1.5rem',
 },
 productName: {
   fontSize: '1.25rem',
   fontWeight: '700',
   color: '#1e293b',
   marginBottom: '0.75rem',
   lineHeight: '1.4',
 },
 description: {
   color: '#64748b',
   fontSize: '0.95rem',
   marginBottom: '1.5rem',
   lineHeight: '1.6',
 },
 detailsGrid: {
   display: 'grid',
   gridTemplateColumns: '1fr',
   gap: '0.75rem',
   marginBottom: '1.5rem',
   padding: '1rem',
   backgroundColor: '#f8fafc',
   borderRadius: '8px',
 },
 detailItem: {
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 detailLabel: {
   fontSize: '0.875rem',
   fontWeight: '600',
   color: '#374151',
 },
 detailValue: {
   fontSize: '0.875rem',
   color: '#6b7280',
   fontFamily: 'monospace',
 },
 featuresSection: {
   marginBottom: '1rem',
 },
 featuresTitle: {
   fontSize: '1rem',
   fontWeight: '600',
   color: '#374151',
   marginBottom: '0.75rem',
 },
 featuresList: {
   display: 'flex',
   flexWrap: 'wrap',
   gap: '0.5rem',
 },
 featureTag: {
   backgroundColor: '#eff6ff',
   color: '#1d4ed8',
   padding: '0.25rem 0.5rem',
   borderRadius: '6px',
   fontSize: '0.75rem',
   fontWeight: '500',
   border: '1px solid #dbeafe',
 },
 moreFeatures: {
   color: '#6b7280',
   fontSize: '0.75rem',
   fontStyle: 'italic',
   padding: '0.25rem 0.5rem',
 },
 cardFooter: {
   padding: '1rem 1.5rem',
   backgroundColor: '#f8fafc',
   borderTop: '1px solid #e2e8f0',
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
   flexWrap: 'wrap',
   gap: '1rem',
 },
 timestamp: {
   display: 'flex',
   flexDirection: 'column',
   gap: '0.25rem',
 },
 timestampLabel: {
   fontSize: '0.75rem',
   color: '#6b7280',
   textTransform: 'uppercase',
   letterSpacing: '0.05em',
 },
 timestampValue: {
   fontSize: '0.875rem',
   color: '#374151',
   fontWeight: '500',
 },
 actions: {
   display: 'flex',
   gap: '0.75rem',
 },
 editButton: {
   padding: '0.5rem 1rem',
   backgroundColor: '#10b981',
   color: 'white',
   border: '1px solid #d1d5db',
   borderRadius: '6px',
   fontSize: '0.875rem',
   fontWeight: '500',
   cursor: 'pointer',
   transition: 'all 0.2s ease',
 },
 publishButton: {
   padding: '0.5rem 1rem',
   backgroundColor: '#3b82f6',
   color: 'white',
   border: 'none',
   borderRadius: '6px',
   fontSize: '0.875rem',
   fontWeight: '600',
   cursor: 'pointer',
   transition: 'all 0.2s ease',
 },
};

export default EmployeeDraft;