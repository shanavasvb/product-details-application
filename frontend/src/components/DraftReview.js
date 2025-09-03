import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Check, X, FileText, User, Clock, Star, Tag, Info, Barcode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DraftReview = () => {
  const { productId: paramProductId } = useParams();
  const location = useLocation();
  const { employeeId, productId: stateProductId } = location.state || {};
  const finalProductId = paramProductId || stateProductId;
  const finalEmployeeId = employeeId;

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchDraft = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/drafts/${finalProductId}/${finalEmployeeId}`);
      console.log("Fetched draft:", res.data); 
      setDraft(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch draft data');
    } finally {
      setLoading(false);
    }
  };

    if (finalProductId && finalEmployeeId) {
      fetchDraft();
    } else {
      setError('Missing product or employee ID.');
      setLoading(false);
    }
  }, [finalProductId, finalEmployeeId]);

  const handleDecision = async (type) => {
    if (!draft?._id) return;
    setIsProcessing(true);
    setDecision(type);

    try {
      await axios.put(`http://localhost:5000/api/v1/drafts/${draft._id}/${type === 'approve' ? 'approve' : 'reject'}`);
      alert(`Edit ${type === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!draft) return <div style={{ padding: '2rem' }}>No draft found.</div>;

  const { draftData, employeeId: employeeObj, lastSaved } = draft;
  const employeeName = employeeObj?.name || 'Unknown';
  const submittedAt = lastSaved;

  const styles = {
    container: {
      minHeight: '100vh',
    //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#ffffff'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      color:'#000000'
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      fontWeight: '300'
    },
    mainCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative'
    },
    cardHeader: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      padding: '2rem',
      color: '#ffffff',
      position: 'relative'
    },
    headerPattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      opacity: 0.3
    },
    headerContent: {
      position: 'relative',
      zIndex: 1
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    headerInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      fontSize: '0.9rem'
    },
    headerInfoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '0.75rem',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)'
    },
    cardBody: {
      padding: '2rem'
    },
    productHeader: {
      marginBottom: '2rem',
      textAlign: 'center'
    },
    productName: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    productBrand: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#f0f9ff',
      color: '#0369a1',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    description: {
      backgroundColor: '#f8fafc',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      borderLeft: '4px solid #3b82f6'
    },
    descriptionText: {
      color: '#374151',
      lineHeight: '1.6',
      fontSize: '1rem'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    detailCard: {
      backgroundColor: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    },
    detailTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    detailList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    detailItem: {
      padding: '0.5rem 0',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    detailItemLast: {
      padding: '0.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    detailLabel: {
      color: '#6b7280',
      fontSize: '0.9rem'
    },
    detailValue: {
      color: '#111827',
      fontWeight: '500',
      fontSize: '0.9rem'
    },
    detailValueMono: {
      color: '#111827',
      fontWeight: '500',
      fontSize: '0.9rem',
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      backgroundColor: '#f3f4f6',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px'
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    featureItem: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#374151'
    },
    featureItemLast: {
      padding: '0.75rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#374151'
    },
    featureIcon: {
      width: '8px',
      height: '8px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      flexShrink: 0
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '2rem',
      padding: '2rem',
      backgroundColor: '#f9fafb',
      borderRadius: '12px'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '140px',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    acceptBtn: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)'
    },
    acceptBtnHover: {
      backgroundColor: '#059669',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px 0 rgba(16, 185, 129, 0.5)'
    },
    rejectBtn: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)'
    },
    rejectBtnHover: {
      backgroundColor: '#dc2626',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px 0 rgba(239, 68, 68, 0.5)'
    },
    processing: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    },
    statusBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    statusAccepted: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    statusRejected: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    }
  };

  return (
    <div style={styles.container}>

      <button
        onClick={() => navigate('/approveNotification')}
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

      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Review</h1>
          <p style={styles.subtitle}>Review and approve product changes</p>
        </div>

        <div style={styles.mainCard}>
          <div style={{
            ...styles.statusBadge,
            ...(decision === 'accepted' ? styles.statusAccepted :
              decision === 'rejected' ? styles.statusRejected : styles.statusPending)
          }}>
            {decision === 'accepted' ? '✅ Approved' :
              decision === 'rejected' ? '❌ Rejected' : '⏳ Pending Review'}
          </div>

          <div style={styles.cardHeader}>
            <div style={styles.headerPattern}></div>
            <div style={styles.headerContent}>
              <h2 style={styles.headerTitle}>
                <FileText size={24} /> Product Edit Submission
              </h2>
              <div style={styles.headerInfo}>
                <div style={styles.headerInfoItem}>
                  <User size={16} />
                  <span>By: {employeeName}</span>
                </div>
                <div style={styles.headerInfoItem}>
                  <Clock size={16} />
                  <span>Submitted: {new Date(submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.cardBody}>
            <div style={styles.productHeader}>
              <h3 style={styles.productName}>{draftData.ProductName}</h3>
              <div style={styles.productBrand}>
                <Star size={16} />
                {draftData.Brand}
              </div>
            </div>

            <div style={styles.description}>
              <p style={styles.descriptionText}>{draftData.Description}</p>
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailCard}>
                <h4 style={styles.detailTitle}><Info size={18} /> Product Information</h4>
                <ul style={styles.detailList}>
                  <li style={styles.detailItem}>
                    <span style={styles.detailLabel}>Barcode:</span>
                    <span style={styles.detailValueMono}>{draftData.Barcode}</span>
                  </li>
                  <li style={styles.detailItem}>
                    <span style={styles.detailLabel}>Category:</span>
                    <span style={styles.detailValue}>{draftData.Category}</span>
                  </li>
                  <li style={styles.detailItem}>
                    <span style={styles.detailLabel}>Product Line:</span>
                    <span style={styles.detailValue}>{draftData.ProductLine}</span>
                  </li>
                  <li style={styles.detailItemLast}>
                    <span style={styles.detailLabel}>Quantity:</span>
                    <span style={styles.detailValue}>{draftData.Quantity} {draftData.Unit}</span>
                  </li>
                </ul>
              </div>

              <div style={styles.detailCard}>
                <h4 style={styles.detailTitle}><Tag size={18} /> Key Features</h4>
                <ul style={styles.featuresList}>
                  {Array.isArray(draftData.Features) && draftData.Features.map((f, i) => (
                    <li key={i} style={i === draftData.Features.length - 1 ? styles.featureItemLast : styles.featureItem}>
                      <div style={styles.featureIcon}></div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={styles.detailCard}>
              <h4 style={styles.detailTitle}><Barcode size={18} /> Specifications</h4>
              <ul style={styles.detailList}>
                {draftData.Specification && Object.entries(draftData.Specification).map(([k, v], idx, arr) => (
                  <li key={k} style={idx === arr.length - 1 ? styles.detailItemLast : styles.detailItem}>
                    <span style={styles.detailLabel}>{k}:</span>
                    <span style={styles.detailValue}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.actions}>
              <button
                style={{
                  ...styles.actionButton,
                  ...styles.acceptBtn,
                  ...(isProcessing ? styles.processing : {})
                }}
                onClick={() => handleDecision('approve')}
                disabled={isProcessing || decision}
                onMouseEnter={(e) => {
                  if (!isProcessing && !decision) Object.assign(e.target.style, styles.acceptBtnHover);
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing && !decision) Object.assign(e.target.style, styles.acceptBtn);
                }}
              >
                <Check size={20} />
                {isProcessing && decision === 'accepted' ? 'Processing...' : 'Accept'}
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  ...styles.rejectBtn,
                  ...(isProcessing ? styles.processing : {})
                }}
                onClick={() => handleDecision('reject')}
                disabled={isProcessing || decision}
                onMouseEnter={(e) => {
                  if (!isProcessing && !decision) Object.assign(e.target.style, styles.rejectBtnHover);
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing && !decision) Object.assign(e.target.style, styles.rejectBtn);
                }}
              >
                <X size={20} />
                {isProcessing && decision === 'rejected' ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftReview;