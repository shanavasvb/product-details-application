import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import axios from 'axios';

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

  // Get user admin status from localStorage (matches your login implementation)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(userData.is_admin || false);
  }, []);

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

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    setProduct(editedProduct);
    setIsEditing(false);
    alert('Save action triggered (no backend update)');
  };
  const handleDeleteClick = () => alert('Delete action triggered');

  const fetchSuggestions = (field, value) => {
    if (!value) return;
    const endpoint = {
      Category: '/api/v1/categories/search',
      ProductLine: '/api/v1/productLines/search',
      Brand: '/api/v1/brands/search'
    }[field];

    axios.get(`${endpoint}?q=${value}`).then(res => {
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

  const renderInputWithSuggestions = (field, value, suggestions, setValue, keyName) => (
    <div style={{ position: 'relative' }}>
    <input
      type="text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setShowSuggestions(prev => ({ ...prev, [field]: true }));
      }}
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
              onMouseDown={() => {
                setEditedProduct(prev => ({ ...prev, [field]: item[keyName] }));
                setShowSuggestions(prev => ({ ...prev, [field]: false }));
              }}
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
      <div style={styles.header}>
        <h1 style={styles.productName}>{product.ProductName}</h1>
        <div style={styles.headerActions}>
          <button onClick={isEditing ? handleSaveClick : handleEditClick} style={styles.actionButton}>
            {isEditing ? <FaSave /> : <FaEdit />}
            <span style={styles.actionButtonText}>{isEditing ? "Save" : "Edit"}</span>
          </button>
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
                    (val) => setEditedProduct(prev => ({ ...prev, Category: val })),
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
                    (val) => setEditedProduct(prev => ({ ...prev, ProductLine: val })),
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
                    (val) => setEditedProduct(prev => ({ ...prev, Brand: val })),
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
                      value={editedProduct.Quantity}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Quantity: e.target.value })}
                      style={styles.quantityInput}
                    />
                    <input
                      type="text"
                      value={editedProduct.Unit}
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
                    value={editedProduct.Barcode}
                    onChange={(e) => setEditedProduct({ ...editedProduct, Barcode: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.barcodeValue}>{product.Barcode}</p>
                )}
              </div>
            </div>
          </div>
        {/* Description set*/}
           <div style={styles.section}>
             <h2 style={styles.sectionTitle}>Description</h2>
             {isEditing ? (
              <textarea
                value={editedProduct.Description}
                onChange={(e) => setEditedProduct({ ...editedProduct, Description: e.target.value })}
                style={styles.textarea}
                rows="4"
              />
            ) : (
              <p style={styles.descriptionText}>{product.Description}</p>
            )}
          </div>

          {/* Features set*/}
          {editedProduct.Features?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Key Features</h2>
              <div style={styles.featuresGrid}>
                {editedProduct.Features.map((feature, index) => (
                  <div key={index} style={styles.featureCard}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editedProduct.Features];
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
              </div>
            </div>
          )}

          {/* Specifications set*/}
          {editedProduct.Specification && Object.keys(editedProduct.Specification).length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Technical Specifications</h2>
              <div style={styles.specsGrid}>
                {Object.entries(editedProduct.Specification).map(([key, value], index) => (
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
          )}
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
  headerActions: {
    display: 'flex',
    gap: '1rem'
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