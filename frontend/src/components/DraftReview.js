import React, { useState } from 'react';
import { Check, X, FileText, User, Package, Barcode, Tag, Info, Clock, Star } from 'lucide-react';

const DraftReview = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [decision, setDecision] = useState(null);

  // Sample draft data
  const draft = {
    productId: "P00015",
    employeeId: "68514f35a32b42f2d1511788",
    submittedAt: "2025-06-29T15:30:00.000Z",
    employeeName: "Shreya",
    draftData: {
      Barcode: "8902102127369",
      ProductName: "Henko Stain Care Stain Busters Detergent Bar",
      Description: "Henko Stain Care Stain Busters Detergent Bar is scientifically formulated to remove up to 99% of tough stains, leaving your clothes fresh and stain-free.",
      Category: "Laundry Detergents",
      ProductLine: "Detergent Bar",
      Brand: "Henko",
      Quantity: 80,
      Unit: "gm",
      Features: [
        "Removes up to 99% of tough stains",
        "Suitable for all types of fabrics",
        "Leaves clothes fresh and clean"
      ],
      Specification: {
        Weight: "80 gm",
        Form: "Bar",
        "Packaging Type": "Wrapper"
      }
    }
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    setDecision('accepted');
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      alert('✅ Changes accepted for product ' + draft.productId);
    }, 2000);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setDecision('rejected');
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      alert('❌ Changes rejected for product ' + draft.productId);
    }, 2000);
  };

  const { draftData } = draft;

  const styles = {
    container: {
      minHeight: '100vh',
    //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Draft Review</h1>
          <p style={styles.subtitle}>Review and approve product changes</p>
        </div>

        {/* Main Card */}
        <div style={styles.mainCard}>
          {/* Status Badge */}
          <div style={{
            ...styles.statusBadge,
            ...(decision === 'accepted' ? styles.statusAccepted :
                decision === 'rejected' ? styles.statusRejected :
                styles.statusPending)
          }}>
            {decision === 'accepted' ? '✅ Approved' :
             decision === 'rejected' ? '❌ Rejected' :
             '⏳ Pending Review'}
          </div>

          {/* Card Header */}
          <div style={styles.cardHeader}>
            <div style={styles.headerPattern}></div>
            <div style={styles.headerContent}>
              <h2 style={styles.headerTitle}>
                <FileText size={24} />
                Product Draft Submission
              </h2>
              <div style={styles.headerInfo}>
                {/* <div style={styles.headerInfoItem}>
                  <Package size={16} />
                  <span>Product ID: {draft.productId}</span>
                </div> */}
                <div style={styles.headerInfoItem}>
                  <User size={16} />
                  <span>By: {draft.employeeName}</span>
                </div>
                <div style={styles.headerInfoItem}>
                  <Clock size={16} />
                  <span>Submitted: {new Date(draft.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div style={styles.cardBody}>
            {/* Product Header */}
            <div style={styles.productHeader}>
              <h3 style={styles.productName}>{draftData.ProductName}</h3>
              <div style={styles.productBrand}>
                <Star size={16} />
                {draftData.Brand}
              </div>
            </div>

            {/* Description */}
            <div style={styles.description}>
              <p style={styles.descriptionText}>{draftData.Description}</p>
            </div>

            {/* Details Grid */}
            <div style={styles.detailsGrid}>
              {/* Product Information */}
              <div style={styles.detailCard}>
                <h4 style={styles.detailTitle}>
                  <Info size={18} />
                  Product Information
                </h4>
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

              {/* Features */}
              <div style={styles.detailCard}>
                <h4 style={styles.detailTitle}>
                  <Tag size={18} />
                  Key Features
                </h4>
                <ul style={styles.featuresList}>
                  {draftData.Features.map((feature, i) => (
                    <li key={i} style={i === draftData.Features.length - 1 ? styles.featureItemLast : styles.featureItem}>
                      <div style={styles.featureIcon}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specifications */}
            <div style={styles.detailCard}>
              <h4 style={styles.detailTitle}>
                <Barcode size={18} />
                Specifications
              </h4>
              <ul style={styles.detailList}>
                {Object.entries(draftData.Specification).map(([key, value], index, array) => (
                  <li key={key} style={index === array.length - 1 ? styles.detailItemLast : styles.detailItem}>
                    <span style={styles.detailLabel}>{key}:</span>
                    <span style={styles.detailValue}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                style={{
                  ...styles.actionButton,
                  ...styles.acceptBtn,
                  ...(isProcessing ? styles.processing : {})
                }}
                onClick={handleAccept}
                disabled={isProcessing || decision}
                onMouseEnter={(e) => {
                  if (!isProcessing && !decision) {
                    Object.assign(e.target.style, styles.acceptBtnHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing && !decision) {
                    Object.assign(e.target.style, styles.acceptBtn);
                  }
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
                onClick={handleReject}
                disabled={isProcessing || decision}
                onMouseEnter={(e) => {
                  if (!isProcessing && !decision) {
                    Object.assign(e.target.style, styles.rejectBtnHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing && !decision) {
                    Object.assign(e.target.style, styles.rejectBtn);
                  }
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



// import { useEffect, useState } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import axios from 'axios';

// const DraftReview = () => {
//   const { productId } = useParams();
//   const location = useLocation();
//   const [drafts, setDrafts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Get data from navigation state - productId might be here instead of URL params
//   const { employeeId, saveType, notificationId, productId: stateProductId } = location.state || {};
  
//   // Use productId from URL params first, then fall back to state
//   const finalProductId = productId || stateProductId;
//   const finalEmployeeId = employeeId;

//   useEffect(() => {
//     const fetchDrafts = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         console.log('Fetching draft for:', { 
//           urlProductId: productId, 
//           stateProductId: stateProductId,
//           finalProductId: finalProductId,
//           employeeId: finalEmployeeId 
//         });
        
//         const response = await axios.get(
//           `http://localhost:5000/api/v1/drafts/${finalProductId}/${finalEmployeeId}`
//         );

//         console.log('Draft response:', response.data);
        
//         // Handle single draft response
//         if (response.data) {
//           setDrafts([response.data]); 
//         } else {
//           setDrafts([]);
//         }
        
//       } catch (err) {
//         console.error('Error fetching drafts:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch drafts';
//         setError(errorMessage);
        
//         // Log more details for debugging
//         if (err.response) {
//           console.error('Response status:', err.response.status);
//           console.error('Response data:', err.response.data);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Only fetch if we have both finalProductId and finalEmployeeId
//     if (finalProductId && finalEmployeeId) {
//       fetchDrafts();
//     } else {
//       setError(`Missing required parameters - ProductId: ${finalProductId || 'missing'}, EmployeeId: ${finalEmployeeId || 'missing'}`);
//       setLoading(false);
//     }
//   }, [finalProductId, finalEmployeeId, saveType]);

//   const handleApprove = async (draftId) => {
//     try {
//       // Fixed: Use correct endpoint
//       await axios.put(`http://localhost:5000/api/v1/drafts/${draftId}/approve`);
      
//       // Update the draft status locally
//       setDrafts(prev => prev.map(draft => 
//         draft._id === draftId 
//           ? { ...draft, isPublished: true }
//           : draft
//       ));
      
//       alert('Draft approved successfully!');
//     } catch (err) {
//       console.error('Error approving draft:', err);
//       alert(`Failed to approve draft: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   const handleReject = async (draftId) => {
//     try {
//       // Fixed: Use correct endpoint
//       await axios.put(`http://localhost:5000/api/v1/drafts/${draftId}/reject`);
      
//       // Update local state to reflect rejection
//       setDrafts(prev => prev.map(draft => 
//         draft._id === draftId 
//           ? { ...draft, isRejected: true }
//           : draft
//       ));
      
//       alert('Draft rejected successfully!');
//     } catch (err) {
//       console.error('Error rejecting draft:', err);
//       alert(`Failed to reject draft: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.loading}>
//           <div style={styles.spinner}></div>
//           <p>Loading drafts...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.error}>
//           <div style={styles.errorIcon}>⚠️</div>
//           <p>Error: {error}</p>
//           <p style={styles.errorDetails}>
//             ProductId: {finalProductId || 'missing'}, EmployeeId: {finalEmployeeId || 'missing'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2 style={styles.heading}>Draft Review</h2>
//         <div style={styles.info}>
//           <div style={styles.infoItem}>
//             <span style={styles.infoLabel}>Product ID:</span>
//             <span style={styles.infoValue}>{finalProductId || 'N/A'}</span>
//           </div>
//           <div style={styles.infoItem}>
//             <span style={styles.infoLabel}>Employee ID:</span>
//             <span style={styles.infoValue}>{finalEmployeeId || 'N/A'}</span>
//           </div>
//           <div style={styles.infoItem}>
//             <span style={styles.infoLabel}>Save Type:</span>
//             <span style={styles.infoValue}>{saveType || 'N/A'}</span>
//           </div>
//         </div>
//       </div>

//       {drafts.length === 0 ? (
//         <div style={styles.emptyState}>
//           <div style={styles.emptyIcon}>📄</div>
//           <p style={styles.noData}>No drafts found for this request</p>
//           <p style={styles.noDataSub}>The draft may have been removed or doesn't match the criteria</p>
//         </div>
//       ) : (
//         <div style={styles.draftList}>
//           {drafts.map((draft) => (
//             <div key={draft._id} style={styles.draftCard}>
//               <div style={styles.draftHeader}>
//                 <h3 style={styles.draftTitle}>
//                   {draft.draftData?.ProductName || 'Unnamed Product'}
//                 </h3>
//                 <div style={styles.draftMeta}>
//                   <span style={styles.saveType}>{draft.saveType}</span>
//                   <span style={styles.timestamp}>
//                     {new Date(draft.lastSaved).toLocaleString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </span>
//                 </div>
//               </div>

//               <div style={styles.draftContent}>
//                 <div style={styles.fieldRow}>
//                   <div style={styles.field}>
//                     <span style={styles.fieldLabel}>Barcode:</span>
//                     <span style={styles.fieldValue}>{draft.draftData?.Barcode || 'N/A'}</span>
//                   </div>
//                   <div style={styles.field}>
//                     <span style={styles.fieldLabel}>Brand:</span>
//                     <span style={styles.fieldValue}>{draft.draftData?.Brand || 'N/A'}</span>
//                   </div>
//                 </div>

//                 <div style={styles.fieldRow}>
//                   <div style={styles.field}>
//                     <span style={styles.fieldLabel}>Category:</span>
//                     <span style={styles.fieldValue}>{draft.draftData?.Category || 'N/A'}</span>
//                   </div>
//                   <div style={styles.field}>
//                     <span style={styles.fieldLabel}>Product Line:</span>
//                     <span style={styles.fieldValue}>{draft.draftData?.ProductLine || 'N/A'}</span>
//                   </div>
//                 </div>

//                 <div style={styles.fieldRow}>
//                   <div style={styles.field}>
//                     <span style={styles.fieldLabel}>Quantity:</span>
//                     <span style={styles.fieldValue}>
//                       {draft.draftData?.Quantity || 0} {draft.draftData?.Unit || ''}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={styles.fieldFull}>
//                   <span style={styles.fieldLabel}>Description:</span>
//                   <div style={styles.description}>
//                     {draft.draftData?.Description || 'No description provided'}
//                   </div>
//                 </div>
                
//                 {draft.draftData?.Features && draft.draftData.Features.length > 0 && (
//                   <div style={styles.fieldFull}>
//                     <span style={styles.fieldLabel}>Features:</span>
//                     <ul style={styles.list}>
//                       {draft.draftData.Features.map((feature, index) => (
//                         <li key={index} style={styles.listItem}>{feature}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {draft.draftData?.Specification && Object.keys(draft.draftData.Specification).length > 0 && (
//                   <div style={styles.fieldFull}>
//                     <span style={styles.fieldLabel}>Specifications:</span>
//                     <div style={styles.specs}>
//                       {Object.entries(draft.draftData.Specification).map(([key, value]) => (
//                         <div key={key} style={styles.specItem}>
//                           <span style={styles.specKey}>{key}:</span>
//                           <span style={styles.specValue}>{value}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div style={styles.actions}>
//                 <button
//                   style={{
//                     ...styles.approveBtn,
//                     ...(draft.isPublished || draft.isRejected ? styles.disabledBtn : {})
//                   }}
//                   onClick={() => handleApprove(draft._id)}
//                   disabled={draft.isPublished || draft.isRejected}
//                 >
//                   {draft.isPublished ? '✓ Approved' : 'Approve'}
//                 </button>
//                 <button
//                   style={{
//                     ...styles.rejectBtn,
//                     ...(draft.isPublished || draft.isRejected ? styles.disabledBtn : {})
//                   }}
//                   onClick={() => handleReject(draft._id)}
//                   disabled={draft.isPublished || draft.isRejected}
//                 >
//                   {draft.isRejected ? '✗ Rejected' : 'Reject'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: '2rem',
//     fontFamily: "'Inter', 'Segoe UI', sans-serif",
//     backgroundColor: '#f8fafc',
//     minHeight: '100vh',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   header: {
//     marginBottom: '2rem',
//     paddingBottom: '1rem',
//     borderBottom: '2px solid #e2e8f0',
//   },
//   heading: {
//     fontSize: '2rem',
//     fontWeight: '700',
//     color: '#1e293b',
//     margin: '0 0 1rem 0',
//   },
//   info: {
//     display: 'flex',
//     gap: '2rem',
//     flexWrap: 'wrap',
//   },
//   infoItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//   },
//   infoLabel: {
//     fontSize: '0.875rem',
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: '0.875rem',
//     color: '#1f2937',
//     fontWeight: '600',
//     backgroundColor: '#f3f4f6',
//     padding: '0.25rem 0.5rem',
//     borderRadius: '4px',
//   },
//   loading: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '300px',
//     color: '#6b7280',
//   },
//   spinner: {
//     width: '40px',
//     height: '40px',
//     border: '4px solid #e5e7eb',
//     borderTop: '4px solid #3b82f6',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//     marginBottom: '1rem',
//   },
//   error: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '300px',
//     color: '#ef4444',
//     backgroundColor: '#fef2f2',
//     borderRadius: '8px',
//     padding: '2rem',
//     border: '1px solid #fecaca',
//   },
//   errorIcon: {
//     fontSize: '2rem',
//     marginBottom: '1rem',
//   },
//   errorDetails: {
//     fontSize: '0.875rem',
//     color: '#6b7280',
//     marginTop: '0.5rem',
//   },
//   emptyState: {
//     textAlign: 'center',
//     padding: '4rem 2rem',
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//     border: '1px solid #e2e8f0',
//   },
//   emptyIcon: {
//     fontSize: '3rem',
//     marginBottom: '1rem',
//   },
//   noData: {
//     color: '#6b7280',
//     fontSize: '1.125rem',
//     fontWeight: '500',
//     margin: '0 0 0.5rem 0',
//   },
//   noDataSub: {
//     color: '#9ca3af',
//     fontSize: '0.875rem',
//     margin: '0',
//   },
//   draftList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '1.5rem',
//   },
//   draftCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//     border: '1px solid #e2e8f0',
//     overflow: 'hidden',
//     transition: 'all 0.2s ease-in-out',
//   },
//   draftHeader: {
//     padding: '1.5rem 1.5rem 1rem 1.5rem',
//     borderBottom: '1px solid #f3f4f6',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   draftTitle: {
//     fontSize: '1.25rem',
//     fontWeight: '600',
//     color: '#1f2937',
//     margin: '0',
//   },
//   draftMeta: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//     gap: '0.5rem',
//   },
//   saveType: {
//     backgroundColor: '#dbeafe',
//     color: '#1e40af',
//     padding: '0.25rem 0.75rem',
//     borderRadius: '20px',
//     fontSize: '0.75rem',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//   },
//   timestamp: {
//     fontSize: '0.875rem',
//     color: '#6b7280',
//     fontWeight: '400',
//   },
//   draftContent: {
//     padding: '1.5rem',
//   },
//   fieldRow: {
//     display: 'flex',
//     gap: '2rem',
//     marginBottom: '1rem',
//     flexWrap: 'wrap',
//   },
//   field: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '0.25rem',
//     flex: '1',
//     minWidth: '200px',
//   },
//   fieldFull: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '0.5rem',
//     marginBottom: '1rem',
//   },
//   fieldLabel: {
//     fontSize: '0.875rem',
//     fontWeight: '600',
//     color: '#374151',
//   },
//   fieldValue: {
//     fontSize: '0.875rem',
//     color: '#1f2937',
//     backgroundColor: '#f9fafb',
//     padding: '0.5rem',
//     borderRadius: '6px',
//     border: '1px solid #e5e7eb',
//   },
//   description: {
//     fontSize: '0.875rem',
//     color: '#1f2937',
//     backgroundColor: '#f9fafb',
//     padding: '0.75rem',
//     borderRadius: '6px',
//     border: '1px solid #e5e7eb',
//     lineHeight: '1.5',
//   },
//   list: {
//     margin: '0',
//     padding: '0 0 0 1.5rem',
//   },
//   listItem: {
//     fontSize: '0.875rem',
//     color: '#1f2937',
//     marginBottom: '0.25rem',
//   },
//   specs: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//     gap: '0.5rem',
//   },
//   specItem: {
//     display: 'flex',
//     gap: '0.5rem',
//     backgroundColor: '#f9fafb',
//     padding: '0.5rem',
//     borderRadius: '6px',
//     border: '1px solid #e5e7eb',
//   },
//   specKey: {
//     fontSize: '0.875rem',
//     fontWeight: '600',
//     color: '#374151',
//     minWidth: '80px',
//   },
//   specValue: {
//     fontSize: '0.875rem',
//     color: '#1f2937',
//     flex: '1',
//   },
//   actions: {
//     padding: '1rem 1.5rem',
//     backgroundColor: '#f8fafc',
//     borderTop: '1px solid #e2e8f0',
//     display: 'flex',
//     gap: '1rem',
//     justifyContent: 'flex-end',
//   },
//   approveBtn: {
//     backgroundColor: '#10b981',
//     color: '#ffffff',
//     border: 'none',
//     padding: '0.75rem 1.5rem',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '0.875rem',
//     fontWeight: '600',
//     transition: 'all 0.2s ease-in-out',
//     boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
//   },
//   rejectBtn: {
//     backgroundColor: '#ef4444',
//     color: '#ffffff',
//     border: 'none',
//     padding: '0.75rem 1.5rem',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '0.875rem',
//     fontWeight: '600',
//     transition: 'all 0.2s ease-in-out',
//     boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
//   },
//   disabledBtn: {
//     backgroundColor: '#9ca3af',
//     cursor: 'not-allowed',
//     opacity: '0.6',
//   },
// };

// const styleSheet = document.createElement('style');
// styleSheet.textContent = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default DraftReview;