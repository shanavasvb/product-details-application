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
  if (drafts.length === 0) return <div style={{ padding: '2rem' }}>No saved drafts found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Draft Products</h1>
      </div>

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