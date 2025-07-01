import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

function ProductData() {
  
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [productLineSuggestions, setProductLineSuggestions] = useState([]);
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    Category: false,
    ProductLine: false,
    Brand: false
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsAdmin(user.is_admin || false);
      setUserId(user._id || user.id);
    }
  }, [user]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/product/${productId}`);
        setProduct(res.data);
        setEditedProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (isEditing && !isAdmin && userId) {
      loadDraftData();
    }
  }, [isEditing, isAdmin, userId]);

  const loadDraftData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/draft/${productId}/${userId}`);
      if (response.data) {
        setEditedProduct(response.data.draftData);
        setDraftId(response.data._id);
        setLastSaved(new Date(response.data.lastSaved));
      }
    } catch (err) {
      console.log('No existing draft found or error loading draft:', err);
    }
  };

  useEffect(() => {
    if (isEditing && !isAdmin && userId && Object.keys(editedProduct).length > 0) {
      const autoSaveTimer = setTimeout(() => {
        autoSaveDraft();
      }, 2000); 

      return () => clearTimeout(autoSaveTimer);
    }
  }, [editedProduct, isEditing, isAdmin, userId]);

  const autoSaveDraft = async () => {
    if (!userId || isAdmin || Object.keys(editedProduct).length === 0) return;
    
    setIsAutoSaving(true);
    try {
      const draftData = {
        productId: productId,
        employeeId: userId,
        draftData: { ...editedProduct }, 
        saveType: 'auto'
      };

      console.log('Saving draft data:', draftData); 

      if (draftId) {
        await axios.put(`http://localhost:5000/api/v1/draft/${draftId}`, draftData);
      } else {
        const response = await axios.post('http://localhost:5000/api/v1/draft', draftData);
        setDraftId(response.data._id);
      }
      
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    if (isAdmin) {
      const payload = { ...editedProduct };
      const response = await axios.put(`http://localhost:5000/api/v1/productEdit/${productId}`, payload);
      setProduct(response.data.product || response.data);
      setIsEditing(false);
      alert('Product updated successfully!');
    } else {
      try {
        const draftData = {
        productId: productId,
        employeeId: userId,
        draftData: { ...editedProduct },
        saveType: 'manual'
      };
      
      if (draftId) {
        await axios.put(`http://localhost:5000/api/v1/draft/${draftId}`, draftData);
      } else {
        const response = await axios.post('http://localhost:5000/api/v1/draft', draftData);
        setDraftId(response.data._id);
      }
            
      //Notification data (data need to be store in notifications collection) 
      const senderName = user?.name?.trim() || user?.username?.trim() || 'Employee';

      const notificationData = {
        message: `${senderName} has edited the product ${editedProduct.ProductName || product.ProductName}, Barcode - (${editedProduct.Barcode || product.Barcode})`,
        type: 'editing',
        senderId: user?._id || user?.id,
        receiverRole: 'admin',
        relatedId: productId.toString(),
        timestamp: new Date().toISOString()
      };

      console.log('Sending notification:', notificationData);
      
      // Send notification
      const notificationResponse = await axios.post('http://localhost:5000/api/v1/notification', notificationData);
      console.log('Notification sent successfully:', notificationResponse.data);
      
      setIsEditing(false);
      setLastSaved(new Date());
      alert('Draft saved successfully! Your changes will be reviewed by an admin.');
      
    } catch (err) {
      console.error('Failed to save draft or send notification:', err);
      alert('Failed to save draft. Please try again.');
    }
  }
};

  const handleDeleteClick = () => alert('Delete action triggered');

  const fetchSuggestions = (field, value) => {
    if (!value) return;
    const endpoint = {
      Category: '/api/v1/categories/search',
      ProductLine: '/api/v1/productLines/search',
      Brand: '/api/v1/brands/search'
    }[field];

    axios.get(`http://localhost:5000${endpoint}?q=${value}`).then(res => {
      if (field === 'Category') setCategorySuggestions(res.data);
      if (field === 'ProductLine') setProductLineSuggestions(res.data);
      if (field === 'Brand') setBrandSuggestions(res.data);
    });
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isEditing) fetchSuggestions('Category', editedProduct.Category);
    }, 300);
    return () => clearTimeout(delay);
  }, [editedProduct.Category]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isEditing) fetchSuggestions('ProductLine', editedProduct.ProductLine);
    }, 300);
    return () => clearTimeout(delay);
  }, [editedProduct.ProductLine]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isEditing) fetchSuggestions('Brand', editedProduct.Brand);
    }, 300);
    return () => clearTimeout(delay);
  }, [editedProduct.Brand]);

  const handleSuggestionSelect = (field, selectedValue) => {
    setEditedProduct(prev => {
      const updated = { ...prev, [field]: selectedValue };
      console.log(`Updated ${field} to:`, selectedValue); 
      console.log('Full updated product:', updated); 
      return updated;
    });
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
  };

  const handleInputChange = (field, value) => {
    setEditedProduct(prev => {
      const updated = { ...prev, [field]: value };
      console.log(`Input changed for ${field}:`, value); 
      return updated;
    });
    setShowSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const renderInputWithSuggestions = (field, value, suggestions, keyName) => (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={value || ''} 
        onChange={(e) => handleInputChange(field, e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, [field]: false })), 200)}
        style={styles.input}
      />
      {showSuggestions[field] && (
        <div style={styles.suggestionBox}>
          {suggestions.length === 0 ? (
            <div style={styles.noSuggestions}>No matches found</div>
          ) : (
            suggestions.map((item, index) => (
              <div
                key={index}
                style={styles.suggestionItem}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.suggestionItemHover.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                onMouseDown={() => handleSuggestionSelect(field, item[keyName])}
              >
                {item[keyName]}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  if (!product) {
    return <div style={styles.loadingContainer}><p style={styles.loadingText}>Loading product details...</p></div>;
  }

  return (
    <div style={styles.container}>

      <button onClick={() => window.history.back()} style={styles.backButton}>← Back</button>

      <div style={styles.header}>

        {isEditing ? (
          <input type="text" value={editedProduct.ProductName || ''} onChange={(e) => setEditedProduct({ ...editedProduct, ProductName: e.target.value })}
          style={styles.productNameInput}/>) : (
            <h1 style={styles.productName}>{product.ProductName}</h1>
        )}

        <div style={styles.headerActions}>
          {!isAdmin && isEditing && ( //display the last auto save time
            <div style={styles.autoSaveStatus}>
              {isAutoSaving ? (
                <span style={styles.autoSaveText}>
                  <FaSpinner style={{ ...styles.spinnerIcon, animation: 'spin 1s linear infinite' }} />
                  Auto-saving...
                </span>
              ) : lastSaved ? (
                <span style={styles.autoSaveText}>
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              ) : null}
            </div>
          )}
          
          {isEditing ? (
            <><button onClick={handleSaveClick} style={styles.actionButton}>
              <FaSave />
              <span style={styles.actionButtonText}>Save</span>
            </button>
            {!isAdmin && (
              <button style={{ ...styles.actionButton, backgroundColor: '#28a745' }}>
                <span style={styles.actionButtonText}>Submit for Approval</span>
              </button>
            )}
            </>
          ) : (
          <button onClick={handleEditClick} style={styles.submitButton}>
            <FaEdit />
            <span style={styles.actionButtonText}>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.productInfo}>
          <div style={styles.section}>
            <div style={styles.detailsGrid}>
              {/* Category */}
              <div style={styles.gridItem}>
                <label style={styles.label}>Category</label>
                {isEditing ? (
                  renderInputWithSuggestions(
                    'Category',
                    editedProduct.Category,
                    categorySuggestions,
                    'Category_name'
                  )
                ) : (
                  <p style={styles.value}>{product.Category}</p>
                )}
              </div>

              {/* Product Line */}
              <div style={styles.gridItem}>
                <label style={styles.label}>Product Line</label>
                {isEditing ? (
                  renderInputWithSuggestions(
                    'ProductLine',
                    editedProduct.ProductLine,
                    productLineSuggestions,
                    'ProductLine_name'
                  )
                ) : (
                  <p style={styles.value}>{product.ProductLine}</p>
                )}
              </div>

              {/* Brand */}
              <div style={styles.gridItem}>
                <label style={styles.label}>Brand</label>
                {isEditing ? (
                  renderInputWithSuggestions(
                    'Brand',
                    editedProduct.Brand,
                    brandSuggestions,
                    'Brand_name'
                  )
                ) : (
                  <p style={styles.value}>{product.Brand}</p>
                )}
              </div>

              <div style={styles.gridItem}>
                <label style={styles.label}>Quantity</label>
                {isEditing ? (
                  <div style={styles.quantityGroup}>
                    <input
                      type="number"
                      value={editedProduct.Quantity || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Quantity: e.target.value })}
                      style={styles.quantityInput}
                    />
                    <input
                      type="text"
                      value={editedProduct.Unit || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Unit: e.target.value })}
                      style={styles.unitInput}
                      placeholder="Unit"
                    />
                  </div>
                ) : (
                  <p style={styles.value}>{`${product.Quantity} ${product.Unit}`}</p>
                )}
              </div>

              <div style={styles.gridItem}>
                <label style={styles.label}>Barcode</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProduct.Barcode || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, Barcode: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.barcodeValue}>{product.Barcode}</p>
                )}
              </div>
            </div>
          </div>
        
        {/* Description section */}
           <div style={styles.section}>
             <h2 style={styles.sectionTitle}>Description</h2>
             {isEditing ? (
              <textarea
                value={editedProduct.Description || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, Description: e.target.value })}
                style={styles.textarea}
                rows="4"
              />
            ) : (
              <p style={styles.descriptionText}>{product.Description}</p>
            )}
          </div>

          {/* Features section */}
          {(editedProduct.Features?.length > 0 || isEditing) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Key Features</h2>
              <div style={styles.featuresGrid}>
                {(editedProduct.Features || []).map((feature, index) => (
                  <div key={index} style={styles.featureCard}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...(editedProduct.Features || [])];
                          newFeatures[index] = e.target.value;
                          setEditedProduct({ ...editedProduct, Features: newFeatures });
                        }}
                        style={styles.featureInput}
                      />
                    ) : (
                      <div style={styles.featureContent}>
                        <div style={styles.featureIcon}>✓</div>
                        <span style={styles.featureText}>{feature}</span>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={() => {
                      const newFeatures = [...(editedProduct.Features || []), ''];
                      setEditedProduct({ ...editedProduct, Features: newFeatures });
                    }}
                    style={styles.addFeatureButton}
                  >
                    + Add Feature
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Specifications section */}
          {(editedProduct.Specification && Object.keys(editedProduct.Specification).length > 0) || isEditing ? (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Technical Specifications</h2>
              <div style={styles.specsGrid}>
                {Object.entries(editedProduct.Specification || {}).map(([key, value], index) => (
                  <div key={index} style={styles.specItem}>
                    <span style={styles.specKey}>{key}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newSpecs = { ...editedProduct.Specification };
                          newSpecs[key] = e.target.value;
                          setEditedProduct({ ...editedProduct, Specification: newSpecs });
                        }}
                        style={styles.specInput}
                      />
                    ) : (
                      <span style={styles.specValue}>{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Only show delete button if user is admin */}
        {isAdmin && (
          <div style={styles.actions}>
            <button onClick={handleDeleteClick} style={styles.deleteButton}>
              <FaTrash style={styles.buttonIcon} />
              <span style={styles.buttonText}>Delete Product</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: '#333',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh'
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#666',
    fontWeight: '400'
  },
  backButton: {
  position: 'fixed',
  top: '20px',
  left: '20px',
  padding: '10px 16px',
  backgroundColor: '#ffffff',
  color: '#3498db',
  border: '2px solid #3498db',
  borderRadius: '999px', // pill shape
  fontSize: '0.95rem',
  fontWeight: '500',
  cursor: 'pointer',
  zIndex: 1001,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  },
  backButtonHover: {
  backgroundColor: '#3498db',
  color: '#ffffff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e0e0e0'
  },
  productName: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  productNameInput: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
    border: '1px solid #ccc',
    padding: '0.5rem',
    borderRadius: '4px',
    width: '70%',
    backgroundColor: '#fff'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  autoSaveStatus: {
    display: 'flex',
    alignItems: 'center'
  },
  autoSaveText: {
    fontSize: '0.8rem',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  spinnerIcon: {
    fontSize: '0.8rem'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745', 
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  actionButtonText: {
    marginLeft: '0.3rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    border: '1px solid #e0e0e0'
  },
  productInfo: {
    padding: '2rem'
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #f0f0f0'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1.2rem'
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#555',
    marginBottom: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  value: {
    fontSize: '1rem',
    color: '#333',
    margin: 0,
    lineHeight: '1.5',
    padding: '0.5rem 0'
  },
  descriptionText: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.6'
  },
  barcodeValue: {
    fontSize: '1rem',
    color: '#333',
    margin: 0,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: '0.5rem',
    borderRadius: '4px',
    display: 'inline-block'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1rem'
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  quantityGroup: {
    display: 'flex',
    gap: '0.5rem'
  },
  quantityInput: {
    flex: '2',
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
    width: '125px'
  },
  unitInput: {
    flex: '1',
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
    width: '125px'
  },
  input: {
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
    width: '100%'
  },
  textarea: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
    width: '100%',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem'
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '1rem',
    border: '1px solid #e9ecef'
  },
  featureContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem'
  },
  featureIcon: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '0.2rem'
  },
  featureText: {
    fontSize: '0.95rem',
    color: '#333',
    lineHeight: '1.5',
    flex: 1
  },
  featureInput: {
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    width: '100%'
  },
  addFeatureButton: {
    padding: '1rem',
    backgroundColor: '#e9ecef',
    border: '1px dashed #ced4da',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#6c757d',
    textAlign: 'center'
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem'
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  },
  specKey: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#555',
    marginBottom: '0.5rem'
  },
  specValue: {
    fontSize: '1rem',
    color: '#333'
  },
  specInput: {
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
    width: '100%'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e0e0e0'
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  buttonIcon: {
    fontSize: '0.9rem'
  },
  buttonText: {
    marginLeft: '0.3rem'
  },
  suggestionBox: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderRadius: '4px',
    zIndex: 1000,
    maxHeight: '180px',
    overflowY: 'auto',
    marginTop: '4px',
  },
  suggestionItem: {
    padding: '10px 14px',
    fontSize: '0.95rem',
    color: '#333',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid #f1f1f1'
  },
  suggestionItemHover: {
    backgroundColor: '#eef6ff'
  },
  noSuggestions: {
    padding: '10px 14px',
    fontSize: '0.9rem',
    color: '#888'
  }
};

export default ProductData;