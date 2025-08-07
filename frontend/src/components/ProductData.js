import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave, FaImage, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

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

  const location = useLocation(); 

  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  // const [isAutoSaving, setIsAutoSaving] = useState(false);
  // const [lastSaved, setLastSaved] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsAdmin(user.is_admin || false);
      setUserId(location.state?.employeeId || user._id || user.id);
    }
  }, [user, location]);


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
      }
    } catch (err) {
      console.log('No existing draft found or error loading draft:', err);
    }
  };

  const handleEditClick = () => setIsEditing(true);

const saveDraft = async (saveType) => {
  if (!userId || isAdmin) return;

  try {
    const draftData = {
      productId: productId,
      employeeId: userId,
      draftData: {
        ...editedProduct,
        Category: editedProduct.Category || product.Category || '',
        ProductLine: editedProduct.ProductLine || product.ProductLine || '',
        Brand: editedProduct.Brand || product.Brand || ''
      },
      saveType: saveType
    };

    if (draftId) {
      await axios.put(`http://localhost:5000/api/v1/draft/${draftId}`, draftData);
    } else {
      const response = await axios.post('http://localhost:5000/api/v1/draft', draftData);
      setDraftId(response.data._id);
    }

    if (saveType === 'submitted') {
      const senderName = user?.name?.trim() || user?.username?.trim() || 'Employee';
      const notificationData = {
        message: `${senderName} has submitted the product ${editedProduct.ProductName || product.ProductName} (Barcode: ${editedProduct.Barcode || product.Barcode}) for approval.`,
        type: 'editing',
        senderId: user?._id || user?.id,
        receiverRole: 'admin',
        relatedId: productId.toString(),
        timestamp: new Date().toISOString()
      };
      await axios.post('http://localhost:5000/api/v1/notification', notificationData);
    }

    setIsEditing(false);
    alert(saveType === 'submitted' ? 'Submitted for approval!' : 'Draft saved successfully.');
  } catch (err) {
    console.error(`Failed to ${saveType}:`, err);
    alert(`Failed to ${saveType}. Please try again.`);
  }
};

const handleSaveClick = async () => {
  if (isAdmin) {
    const payload = { ...editedProduct };
    const response = await axios.put(`http://localhost:5000/api/v1/productEdit/${productId}`, payload);
    setProduct(response.data.product || response.data);
    setIsEditing(false);
    alert('Product updated successfully!');
  }
};

  const handleDeleteClick = async () => {
  const confirmDelete = window.confirm('Are you sure you want to delete this product?');
  if (!confirmDelete) return;

  if (product) {
    console.log("All product keys:", Object.keys(product));
    console.log("All product entries:", Object.entries(product));
    console.log("Product as JSON:", JSON.stringify(product, null, 2));
  }
  
  let productId = product?._id;
  
  if (!productId && product?.id) {
    try {
      console.log("Fetching product details to get MongoDB ObjectId...");
      const detailsResponse = await axios.get(`http://localhost:5000/api/v1/product/details/${product.id}`);
      productId = detailsResponse.data.data._id;
      console.log("Got MongoDB ObjectId from details:", productId);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      alert("Unable to get product details for deletion. Please try again.");
      return;
    }
  }
  
  if (!productId) {
    alert('Product ID not found. Cannot delete product.');
    console.error('No valid product ID found in:', product);
    return;
  }

  const productIdString = String(productId).trim();

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const isValidObjectId = objectIdRegex.test(productIdString);
  console.log("Is valid ObjectId format:", isValidObjectId);
  
  if (!isValidObjectId) {
    alert('Invalid product ID format. Cannot delete product.');
    console.error('Invalid ObjectId format:', productIdString);
    return;
  }

  try {
     console.log("Making DELETE request to:", `http://localhost:5000/api/v1/product/mark-deleted/${productIdString}`);

     const response = await axios.put(`http://localhost:5000/api/v1/product/mark-deleted/${productIdString}`, {
        userId: userId
     });

    console.log("Delete response:", response.data);
    alert('Product deleted successfully.');
    window.history.back();
  } catch (error) {
    console.error('Failed to delete product:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.status === 400) {
      alert('Invalid product ID. Please check the product data.');
    } else if (error.response?.status === 404) {
      alert('Product not found. It may have already been deleted.');
    } else {
      alert('Failed to delete product. Please try again.');
    }
  }
};

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

  const isEditDisabled = !isAdmin && product?.Review_Status === 'Pending';

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
          
          {isEditing ? (
          <>
            {isAdmin ? (
              <button onClick={handleSaveClick} style={styles.actionButton}>
                <FaSave />
                <span style={styles.actionButtonText}>Save</span>
              </button>
            ) : (
            <>
              <button onClick={() => saveDraft('save')} style={styles.actionButton}>
                <FaSave />
                <span style={styles.actionButtonText}>Save</span>
              </button>
              <button
                onClick={() => saveDraft('submitted')}
                style={{ ...styles.actionButton, backgroundColor: '#28a745' }}
              >
                <span style={styles.actionButtonText}>Submit for Approval</span>
              </button>
            </>
            )}
          </>
          ) : (

          <div style={styles.editButtonWrapper}>
            <button
              onClick={handleEditClick}
              style={{
                ...styles.submitButton,
                backgroundColor: isEditDisabled ? '#ccc' : '#28a745',
                cursor: isEditDisabled ? 'not-allowed' : 'pointer'
              }}
              disabled={isEditDisabled}
            >
              <FaEdit />
              <span style={styles.actionButtonText}>Edit</span>
            </button>

            {isEditDisabled && (
              <p style={styles.editDisabledMsg}>
                You can't edit this product because it is under review.
              </p>
            )}
          </div>

          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.productInfo}>
          <div style={styles.section}>

            {/* Image Section
            <div style={styles.imageSection}>
              <label style={styles.label}>Product Image</label>
              <div style={styles.imageContainer}>
                <div style={styles.imagePlaceholder}>
                  <FaImage style={styles.imageIcon} />
                  <span style={styles.imageText}>No image available</span>
                </div>
                {isEditing && (
                  <button style={styles.imageEditButton}>
                    <FaEdit style={styles.editIcon} />
                  </button>
                )}
              </div>
            </div> */}

            <div style={styles.detailsGrid}>
              {/* Category Section*/}
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

              {/* Product Line Section*/}
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

              {/* Brand Section*/}
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

                {/* Quantity and unit section */}
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
                    <select
                      value={editedProduct.Unit || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Unit: e.target.value })}
                      style={styles.unitInput}
                    >
                      <option value="" disabled>Select Unit</option>
                      <option value="gm">gm</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="pc">pc</option>
                      <option value="sticks">sticks</option>
                      <option value="unit">unit</option>
                      <option value="pack">pack</option>
                      <option value="dozen">dozen</option>
                      <option value="pair">pair</option>
                      <option value="set">set</option>
                      <option value="roll">roll</option>
                      <option value="bottle">bottle</option>
                      <option value="box">box</option>
                      <option value="tube">tube</option>
                      <option value="tube">ounce</option>
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="inch">inch</option>
                      <option value="ft">ft</option>
                      <option value="bar">bar</option>
                      <option value="sheet">sheet</option>
                      <option value="tablet">tablet</option>
                      <option value="capsule">capsule</option> 
                      <option value="spray">spray</option>
                      <option value="serving">serving</option>
                      <option value="slice">slice</option>
                      <option value="cup">cup</option>
                    </select>
                  </div>
                ) : (
                  <p style={styles.value}>{`${product.Quantity} ${product.Unit}`}</p>
                )}
              </div>

                  {/* BArcode Section*/}
              <div style={styles.gridItem}>
                <label style={styles.label}>Barcode</label>
                {/* {isEditing ? (
                  <input
                    type="text"
                    value={editedProduct.Barcode || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, Barcode: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.barcodeValue}>{product.Barcode}</p>
                )} */}
                <p style={styles.barcodeValue}>{product.Barcode}</p>
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
                      <div style={styles.featureEditWrapper}>
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
                        <button
                          onClick={() => {
                            const updatedFeatures = (editedProduct.Features || []).filter((_, i) => i !== index);
                            setEditedProduct({ ...editedProduct, Features: updatedFeatures });
                          }}
                          style={styles.deleteFeatureButton}
                          title="Delete Feature"
                        >
                          <FaTrash style={{ fontSize: '0.8rem' }} />
                        </button>
                      </div>
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
  borderRadius: '999px',
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
  editDisabledMsg: {
    marginTop: '0.5rem',
    color: '#c0392b',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  editButtonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.3rem'
  },
  featureEditWrapper: {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
},
deleteFeatureButton: {
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem 0.6rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease'
},
  // imageSection: {
  // marginBottom: '2rem',
  // paddingBottom: '1.5rem',
  // borderBottom: '1px solid #f0f0f0'
  // },
  // imageContainer: {
  // position: 'relative',
  // width: '200px',
  // height: '200px',
  // border: '2px dashed #ddd',
  // borderRadius: '8px',
  // display: 'flex',
  // flexDirection: 'column',
  // alignItems: 'center',
  // justifyContent: 'center',
  // backgroundColor: '#f8f9fa'
  // },
  // imagePlaceholder: {
  // display: 'flex',
  // flexDirection: 'column',
  // alignItems: 'center',
  // gap: '0.5rem'
  // },
  // imageIcon: {
  // fontSize: '3rem',
  // color: '#ccc'
  // },
  // imageText: {
  // fontSize: '0.9rem',
  // color: '#666'
  // },
  // imageEditButton: {
  // position: 'absolute',
  // top: '8px',
  // right: '8px',
  // width: '32px',
  // height: '32px',
  // backgroundColor: '#3498db',
  // color: 'white',
  // border: 'none',
  // borderRadius: '50%',
  // cursor: 'pointer',
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'center',
  // boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  // },
  editIcon: {
    fontSize: '0.8rem'
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
    width: '125px',
    appearance : 'auto'
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
    lineHeight: '1.5',
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