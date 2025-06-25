import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import axios from 'axios';

function ProductData() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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

  if (!product) {
    return <div style={styles.loadingContainer}>
      <p style={styles.loadingText}>Loading product details...</p>
    </div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.productName}>{product.ProductName}</h1>
        <button 
          onClick={handleEditClick} 
          style={styles.editIcon}
          title="Edit Product"
        >
          <FaEdit />
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.productInfo}>
          <div style={styles.section}>
            <label style={styles.label}>Description</label>
            {isEditing ? (
              <textarea
                value={editedProduct.Description}
                onChange={(e) => setEditedProduct({ ...editedProduct, Description: e.target.value })}
                style={styles.textarea}
                rows="3"
              />
            ) : (
              <p style={styles.value}>{product.Description}</p>
            )}
          </div>

          <div style={styles.detailsGrid}>
            <div style={styles.gridItem}>
              <label style={styles.label}>Category</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.Category}
                  onChange={(e) => setEditedProduct({ ...editedProduct, Category: e.target.value })}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{product.Category}</p>
              )}
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>Product Line</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.ProductLine}
                  onChange={(e) => setEditedProduct({ ...editedProduct, ProductLine: e.target.value })}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{product.ProductLine}</p>
              )}
            </div>

            <div style={styles.gridItem}>
              <label style={styles.label}>Brand</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.Brand}
                  onChange={(e) => setEditedProduct({ ...editedProduct, Brand: e.target.value })}
                  style={styles.input}
                />
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

          {editedProduct.Features?.length > 0 && (
            <div style={styles.section}>
              <label style={styles.label}>Features</label>
              <div style={styles.featuresList}>
                {editedProduct.Features.map((feature, index) => (
                  <div key={index} style={styles.featureItem}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editedProduct.Features];
                          newFeatures[index] = e.target.value;
                          setEditedProduct({ ...editedProduct, Features: newFeatures });
                        }}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.featureText}>{feature}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {editedProduct.Specification && Object.keys(editedProduct.Specification).length > 0 && (
            <div style={styles.section}>
              <label style={styles.label}>Specifications</label>
              <div style={styles.specsList}>
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
                        style={styles.input}
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

        <div style={styles.actions}>
          <button onClick={handleDeleteClick} style={{ ...styles.button, ...styles.deleteButton }}>
            <FaTrash style={styles.buttonIcon} />
            Delete
          </button>
          {isEditing && (
            <button onClick={handleSaveClick} style={{ ...styles.button, ...styles.saveButton }}>
              <FaSave style={styles.buttonIcon} />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#2c3e50',
    minHeight: '100vh',
    backgroundColor: '#fafbfc'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh'
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#6c757d',
    fontWeight: '400'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e9ecef'
  },
  productName: {
    fontSize: '2rem',
    fontWeight: '300',
    color: '#2c3e50',
    margin: 0,
    letterSpacing: '-0.02em'
  },
  editIcon: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    color: '#6c757d',
    fontSize: '1.1rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden'
  },
  productInfo: {
    padding: '2rem'
  },
  section: {
    marginBottom: '2rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  value: {
    fontSize: '1rem',
    color: '#1f2937',
    margin: 0,
    lineHeight: '1.5'
  },
  barcodeValue: {
    fontSize: '1rem',
    color: '#1f2937',
    margin: 0,
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    backgroundColor: '#f8f9fa',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    display: 'inline-block'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
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
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff'
  },
  unitInput: {
    flex: '1',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff'
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff',
    width: '100%'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff',
    width: '100%',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center'
  },
  featureText: {
    fontSize: '1rem',
    color: '#1f2937',
    position: 'relative',
    paddingLeft: '1rem'
  },
  specsList: {
    display: 'grid',
    gap: '0.75rem'
  },
  specItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1rem',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '0.375rem'
  },
  specKey: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  specValue: {
    fontSize: '1rem',
    color: '#1f2937'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    padding: '1.5rem 2rem',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e9ecef'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  buttonIcon: {
    fontSize: '0.875rem'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#ffffff'
  },
  saveButton: {
    backgroundColor: '#198754',
    color: '#ffffff'
  }
};

export default ProductData;