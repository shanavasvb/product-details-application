import React, { useState } from 'react';
import { RotateCcw, Trash2, Package, Calendar, Tag, Info } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';

const TrashedProductPage = () => {
  const [trashedProducts, setTrashedProducts] = useState([]);
  const [restoredProducts, setRestoredProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/product/trashed')
      .then(res => {
        console.log('Trashed products response:', res.data);
        setTrashedProducts(res.data);
      })
      .catch(err => console.error('Error fetching trashed products:', err));
  }, []);

  const handleRestore = async (productId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/v1/product/restore/${productId}`);
      const restoredProduct = res.data.product;
      setTrashedProducts(prev => prev.filter(p => p._id !== productId));
      setRestoredProducts(prev => [...prev, restoredProduct]);
    } catch (err) {
      console.error('Restore failed:', err);
      alert('Failed to restore product.');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContent: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '2rem 1.5rem'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.5rem'
    },
    headerIcon: {
      padding: '0.5rem',
      backgroundColor: '#fef2f2',
      borderRadius: '0.5rem'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: 0
    },
    subtitle: {
      color: '#64748b',
      marginBottom: '1rem'
    },
    stats: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.875rem'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b'
    },
    statItemGreen: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#16a34a'
    },
    mainContent: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '2rem 1.5rem'
    },
    notification: {
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '0.75rem'
    },
    notificationContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#166534'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 0'
    },
    emptyIcon: {
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '50%',
      width: '5rem',
      height: '5rem',
      margin: '0 auto 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '500',
      color: '#4b5563',
      marginBottom: '0.5rem'
    },
    emptyText: {
      color: '#6b7280'
    },
    productsGrid: {
      display: 'grid',
      gap: '1.5rem'
    },
    productCard: {
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    productCardHover: {
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
    },
    cardHeader: {
      background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #fecaca'
    },
    cardHeaderTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    brandIcon: {
      padding: '0.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    brandBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      backgroundColor: '#fef2f2',
      color: '#991b1b'
    },
    dateInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    cardBody: {
      padding: '1.5rem'
    },
    productName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.75rem',
      lineHeight: '1.4'
    },
    description: {
      color: '#64748b',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    detailSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    sectionTitle: {
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    detailsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      fontSize: '0.875rem'
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    detailLabel: {
      color: '#64748b'
    },
    detailValue: {
      color: '#374151',
      fontWeight: '500'
    },
    detailValueMono: {
      color: '#374151',
      fontFamily: 'Monaco, Consolas, "Courier New", monospace'
    },
    featuresList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    featureItem: {
      fontSize: '0.875rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem'
    },
    featureBullet: {
      width: '0.375rem',
      height: '0.375rem',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      marginTop: '0.5rem',
      flexShrink: 0
    },
    specificationsSection: {
      marginBottom: '1.5rem'
    },
    specificationsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '0.75rem'
    },
    specItem: {
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      padding: '0.75rem'
    },
    specLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    specValue: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginTop: '0.25rem'
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
      paddingTop: '1rem',
      borderTop: '1px solid #f1f5f9'
    },
    restoreButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#16a34a',
      color: '#ffffff',
      borderRadius: '0.75rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    deleteButton: {
      padding: '0.75rem 1rem',
      backgroundColor: '#fef2f2',
      color: '#b91c1c',
      borderRadius: '0.75rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <div style={styles.headerIcon}>
              <Trash2 size={24} color="#dc2626" />
            </div>
            <h1 style={styles.title}>Trashed Products</h1>
          </div>
          <div style={styles.stats}>
            <span style={styles.statItem}>
              <Package size={16} />
              {trashedProducts.length} items in trash
            </span>
            {restoredProducts.length > 0 && (
              <span style={styles.statItemGreen}>
                <RotateCcw size={16} />
                {restoredProducts.length} items restored
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {restoredProducts.length > 0 && (
          <div style={styles.notification}>
            <div style={styles.notificationContent}>
              <RotateCcw size={20} />
              <span style={{ fontWeight: '500' }}>
                {restoredProducts.length} product{restoredProducts.length !== 1 ? 's' : ''} restored successfully
              </span>
            </div>
          </div>
        )}

        {trashedProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Trash2 size={40} color="#9ca3af" />
            </div>
            <h3 style={styles.emptyTitle}>Trash is Empty</h3>
            <p style={styles.emptyText}>No trashed products to display</p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {trashedProducts.map(product => (
              <div 
                key={product._id} 
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = styles.productCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = styles.productCard.boxShadow;
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderTop}>
                    <div style={styles.cardHeaderLeft}>
                      <div style={styles.brandIcon}>
                        <Package size={20} color="#dc2626" />
                      </div>
                      <div>
                        <span style={styles.brandBadge}>{product.Brand_name || 'Unknown Brand'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.ProductName}</h3>
                  <p style={styles.description}>{product.Description}</p>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailSection}>
                      <h4 style={styles.sectionTitle}><Info size={16} />Product Details</h4>
                      <div style={styles.detailsList}>
                        <div style={styles.detailItem}><span style={styles.detailLabel}>Barcode:</span><span style={styles.detailValueMono}>{product.Barcode}</span></div>
                        <div style={styles.detailItem}><span style={styles.detailLabel}>Category:</span><span style={styles.detailValue}>{product.Category_name}</span></div>
                        <div style={styles.detailItem}><span style={styles.detailLabel}>Product Line:</span><span style={styles.detailValue}>{product.ProductLine_name}</span></div>
                        <div style={styles.detailItem}><span style={styles.detailLabel}>Quantity:</span><span style={styles.detailValue}>{product.Quantity} {product.Unit}</span></div>
                      </div>
                    </div>

                    <div style={styles.detailSection}>
                      <h4 style={styles.sectionTitle}><Tag size={16} />Features</h4>
                      <ul style={styles.featuresList}>
                        {(product.Features || []).map((feature, idx) => (
                          <li key={idx} style={styles.featureItem}>
                            <span style={styles.featureBullet}></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={styles.specificationsSection}>
                    <h4 style={styles.sectionTitle}>Specifications</h4>
                    <div style={styles.specificationsGrid}>
                      {Object.entries(product.Specification || {}).map(([key, value]) => (
                        <div key={key} style={styles.specItem}>
                          <div style={styles.specLabel}>{key}</div>
                          <div style={styles.specValue}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      onClick={() => handleRestore(product._id)}
                      style={styles.restoreButton}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#15803d';
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#16a34a';
                        e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <RotateCcw size={16} />
                      Restore Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashedProductPage;