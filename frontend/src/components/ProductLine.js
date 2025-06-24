import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, List,Plus, Package, Search, ChevronRight, Edit3, Check, X } from 'lucide-react';

const ProductLine = () => {
  const [selectedProductLine, setSelectedProductLine] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProductLineName, setNewProductLineName] = useState('');
  const [ProductLine, setProductLine] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [editingProductLine, setEditingProductLine] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  

useEffect(() => {
  axios.get('http://localhost:5000/api/v1/category')
    .then((response) => {
      setCategories(response.data);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
    });
}, []);


  // Inline styles
  const styles = {
    mainContainer: {
      minHeight: '100vh',
      // background: ' rgba(255, 255, 255, 0.49)',
      position: 'relative',
      
    },
    header: {
      position: 'sticky',
      top: '-4%',
      width: '100%',
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '2rem',
      // justifyContent: 'space-between',
      // alignItems: 'center',
    },
    headerContent: {
      display: 'flex',
      flexDirection: window.innerWidth >= 1024 ? 'row' : 'column',
      alignItems: window.innerWidth >= 1024 ? 'center' : 'flex-start',
      justifyContent: window.innerWidth >= 1024 ? 'space-between' : 'flex-start',
      // gap: '1rem',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      width: '100%',
      // background: 'linear-gradient( #1890ff)',
      background: ' #1890ff',
      // background: 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      marginBottom: '0.25rem',
      marginTop: '1.25rem',
      marginLeft: '25%'
    },
    subtitle: {
      width: '100%',
      color: 'rgb(75, 85, 99)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.25rem',
      marginLeft: '25%'
    },
    searchControls: {
      display: 'flex',
      flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
      gap: '1rem'
    },
    searchInputContainer: {
      position: 'relative'
    },
    searchInput: {
      padding: '0.5rem 1rem 0.5rem 2.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.75rem',
      width: '100%',
      maxWidth: '16rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontSize: '16px'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgb(156, 163, 175)',
      width: '1.25rem',
      height: '1.25rem',
      pointerEvents: 'none'
    },
    viewButtons: {
      display: 'flex',
      gap: '0.5rem',
      marginRight: '3%'
    },
    viewButton: (isActive) => ({
      padding: '0.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(4px)',
      backgroundColor: isActive ? '#1890ff' : 'rgba(255, 255, 255, 0.5)',
      // backgroundColor: isActive ? 'rgb(99, 102, 241)' : 'rgba(255, 255, 255, 0.5)',
      color: isActive ? 'white' : 'rgb(75, 85, 99)',
      boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
    }),
   ProductLineGrid: {
    display: 'grid',
    gap: '1.5rem',
    padding: '2%',
    paddingBottom: '2rem',
    gridTemplateColumns: viewMode === 'grid' 
      ? 'repeat(auto-fit, minmax(300px, 1fr))' // Changed from repeat(3, 1fr)
      : '1fr',
    maxWidth: viewMode === 'list' ? '56rem' : 'none',
    margin: viewMode === 'list' ? '0 auto' : '0',
    // Add responsive behavior
    '@media (max-width: 1200px)': {
      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr'
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      padding: '1rem'
    }
    },
    ProductLineCard: (hovered, isEditing) => ({
      position: 'relative',
  overflow: 'hidden',
  borderRadius: '1rem',
  cursor: isEditing ? 'default' : 'pointer',
  transition: 'all 0.5s ease',
  height: viewMode === 'grid' ? '12rem' : '6rem',
  width: '100%',
  maxWidth: viewMode === 'grid' ? '400px' : 'none',
  display: viewMode === 'list' ? 'flex' : 'block',
  alignItems: viewMode === 'list' ? 'center' : 'normal',
  transform: (hovered && !isEditing) ? 'scale(1.05)' : 'scale(1)',
  border: '1px solid #e2e8f0',
      boxShadow: hovered 
        ? '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',

  // Modern translucent "car-like" glass effect
  backgroundColor: 'rgba(255, 255, 255, 0.05)', // Soft light glass
  backdropFilter: 'blur(10px)', // Blur behind
  WebkitBackdropFilter: 'blur(10px)', // Safari support
    }),
    hoverGlow: (isActive) => ({
      position: 'absolute',
      inset: 0,
      background: 'rgb(210, 233, 255)',
       borderRadius: '1rem',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.5s ease'
    }),
    cardContent: {
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: viewMode === 'grid' ? 'column' : 'row',
      justifyContent: viewMode === 'grid' ? 'center' : 'space-between',
      textAlign: viewMode === 'grid' ? 'center' : 'left',
      padding: viewMode === 'grid' ? '1.5rem' : '0 1.5rem'
    },
    listItemLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    listItemRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    listItemContent: {
      flex: 1,
      minWidth: 0
    },
    ProductLineIconContainer: {
      // background: 'linear-gradient(to bottom right, #1890ff, rgb(147, 51, 234))',
      background: ' #1890ff',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
      padding: viewMode === 'grid' ? '0.75rem' : '0.5rem',
      borderRadius: viewMode === 'grid' ? '1rem' : '0.75rem',
      marginBottom: viewMode === 'grid' ? '1rem' : '0'
    },
    ProductLineIcon: {
      width: viewMode === 'grid' ? '2rem' : '1.25rem',
      height: viewMode === 'grid' ? '2rem' : '1.25rem',
      color: 'white'
    },
    ProductLineNameSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative',
      width: '100%',
      justifyContent: viewMode === 'grid' ? 'center' : 'flex-start',
      marginBottom: viewMode === 'grid' ? '8px' : '4px'
    },
    ProductLineName: (hovered) => ({
      fontSize: viewMode === 'grid' ? '1.25rem' : '1.125rem',
      fontWeight: 'bold',
      transition: 'color 0.3s ease',
      marginBottom: viewMode === 'grid' ? '0.5rem' : '0',
      color: hovered ? 'rgb(5, 132, 251)' : 'rgb(31, 41, 55)',
      // color: hovered ? 'rgb(99, 102, 241)' : 'rgb(31, 41, 55)',
      margin: 0
    }),
    ProductLineNameInput: {
      background: '#ffffff',
      border: '2px solid rgb(226, 229, 234)',
      borderRadius: '6px',
      padding: '4px 8px',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      fontFamily: 'inherit',
      color: 'inherit',
      outline: 'none',
      flex: 1,
      minWidth: 0,
      textAlign: viewMode === 'grid' ? 'center' : 'left'
    },
    editActions: (showActions) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      opacity: showActions ? 1 : 0,
      transition: 'opacity 0.2s ease'
    }),
    editActionBtn: (type) => {
      const baseStyle = {
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      };

      switch (type) {
        case 'edit':
          return { ...baseStyle, color: '#6b7280' };
        case 'save':
          return { ...baseStyle, color: '#059669' };
        case 'cancel':
          return { ...baseStyle, color: '#dc2626' };
        default:
          return { ...baseStyle, color: '#6b7280' };
      }
    },
    productCount: {
      fontSize: '0.85rem',
      color: '#888',
      marginTop: '4px'
    },
    arrowIcon: (hovered) => ({
      width: '1.25rem',
      height: '1.25rem',
      color: ' #1890ff',
      transition: 'transform 0.3s ease',
      transform: hovered ? 'translateX(0.25rem)' : 'translateX(0)'
    }),
    loadingSkeleton: {
      display: 'grid',
      gap: '1.5rem',
      padding: '2%',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    },
    skeletonItem: {
      height: '12rem',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '1rem',
      animation: 'pulse 1.5s ease-in-out infinite alternate'
    },
    emptyState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '20rem'
    },
    emptyStateCard: {
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '1rem',
      backdropFilter: 'blur(4px)'
    },
    emptyStateIcon: {
      width: '3rem',
      height: '3rem',
      color: 'rgb(156, 163, 175)',
      margin: '0 auto 1rem'
    },
    emptyStateTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'rgb(31, 41, 55)',
      marginBottom: '0.5rem'
    },
    emptyStateText: {
      color: 'rgb(75, 85, 99)'
    }
  };

  // Fetch all categories
  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/v1/productLine')
      .then((response) => {
        setProductLine(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching productLine:', error);
        setIsLoading(false);
      });
  }, []);

  // Fetch all products
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/products')
      .then((response) => {
        console.log("✅ Products fetched:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleProductLineClick = (productLineId) => {
    if (!editingProductLine) {
      navigate(`/productLine/${productLineId}/products`);
    }
  };

  const getProductCount = (productLineId) => {
    return products.filter(product =>
      product.ProductLine_id?.trim().toLowerCase() === productLineId?.trim().toLowerCase()
    ).length;
  };

  const handleEditClick = (e, productLine) => {
    e.stopPropagation();
    setEditingProductLine(productLine._id);
    setEditingValue(productLine.ProductLine_name);
  };

  const handleSaveEdit = async (e, productLineId) => {
  e.stopPropagation();
  try {
    const res = await axios.put(`http://localhost:5000/api/v1/productLine/${productLineId}`, {
      ProductLine_name: editingValue
    });

    console.log('✅ productLine updated:', res.data);

    setProductLine(prev =>
      prev.map(cat =>
        cat._id === productLineId ? { ...cat, ProductLine_name: editingValue } : cat
      )
    );

    setEditingProductLine(null);
    setEditingValue('');
  } catch (error) {
    console.error('Error updating ProductLine:', error);
  }
};


  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingProductLine(null);
    setEditingValue('');
  };

  const handleInputChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleKeyPress = (e, productLineId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(e, productLineId);
    } else if (e.key === 'Escape') {
      handleCancelEdit(e);
    }
  };

  const filteredProductLines = ProductLine.filter((cat) =>
    cat.ProductLine_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.mainContainer}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            {/* <h1 style={styles.title}>Categories</h1> */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1%' }}>
                      <h1 style={styles.title}>ProductLines</h1>
                      <button
                        onClick={() => setIsAdding(true)}
                        title="Add ProductLine"
                        style={{
                          padding: '6px',
                          background: ' #1890ff',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom:'-20%'
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>

            <p style={styles.subtitle}>
              <Package style={{ width: '1rem', height: '1rem' }} />
              {ProductLine.length} ProductLines available
            </p>
          </div>

          <div style={styles.searchControls}>
            <div style={styles.searchInputContainer}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                style={{
                  ...styles.searchInput,
                  ':focus': {
                    boxShadow: '0 0 0 2px #1890ff',
                    borderColor: 'transparent'
                  }
                }}
                placeholder="Search ProductLines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px #1890ff';
                  e.target.style.borderColor = 'transparent';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              />
            </div>

            <div style={styles.viewButtons}>
              <button
                style={styles.viewButton(viewMode === 'grid')}
                onClick={() => setViewMode('grid')}
              >
                <Grid />
              </button>
              <button
                style={styles.viewButton(viewMode === 'list')}
                onClick={() => setViewMode('list')}
              >
                <List />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isAdding && (
  <div style={{ marginLeft: '25%', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
    <input
      type="text"
      value={newProductLineName}
      placeholder="Enter ProductLine name"
      onChange={(e) => setNewProductLineName(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        width: '250px'
      }}
    />

    {/* Dropdown to select category */}
    <select
      value={selectedCategoryId}
      onChange={(e) => setSelectedCategoryId(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        width: '200px'
      }}
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat.Category_id}>
          {cat.Category_name}
        </option>
      ))}
    </select>

    <button
      onClick={async () => {
        try {
          const res = await axios.post('http://localhost:5000/api/v1/productLine', {
            ProductLine_name: newProductLineName,
            Category_id: selectedCategoryId, // Save ID, not name
          });

          setProductLine([...ProductLine, res.data]);
          setNewProductLineName('');
          setSelectedCategoryId('');
          setIsAdding(false);
        } catch (error) {
          console.error('Error adding ProductLine:', error);
        }
      }}
      style={{
        backgroundColor: '#10b981',
        border: 'none',
        color: 'white',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer'
      }}
    >
      Save
    </button>

    <button
      onClick={() => {
        setIsAdding(false);
        setNewProductLineName('');
        setSelectedCategoryId('');
      }}
      style={{
        backgroundColor: '#ef4444',
        border: 'none',
        color: 'white',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer'
      }}
    >
      Cancel
    </button>
  </div>
)}



      <div>
        {isLoading ? (
          <div style={styles.loadingSkeleton}>
            {[...Array(6)].map((_, i) => (
              <div style={styles.skeletonItem} key={i}></div>
            ))}
          </div>
        ) : (
          <div style={styles.ProductLineGrid}>
            {filteredProductLines.map((ProductLine) => {
              const hovered = hoveredCard === ProductLine._id;
              const productCount = getProductCount(ProductLine.ProductLine_id);
              const isEditing = editingProductLine === ProductLine._id;
              const showEditActions = hovered || isEditing || window.innerWidth <= 640;

              return (
                <div
                  key={ProductLine._id}
                  style={styles.ProductLineCard(hovered, isEditing)}
                  onClick={() => handleProductLineClick(ProductLine.ProductLine_id)}
                  onMouseEnter={() => !isEditing && setHoveredCard(ProductLine._id)}
                  onMouseLeave={() => !isEditing && setHoveredCard(null)}
                >
                  <div style={styles.hoverGlow(hovered)}></div>
                  <div style={styles.cardContent}>
                    {viewMode === 'grid' ? (
                      <>
                        <div style={styles.ProductLineIconContainer}>
                          <Package style={styles.ProductLineIcon} />
                        </div>
                        
                        <div style={styles.ProductLineNameSection}>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={handleInputChange}
                              onKeyDown={(e) => handleKeyPress(e, ProductLine._id)}
                              style={styles.ProductLineNameInput}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#2563eb';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          ) : (
                            <h3 style={styles.ProductLineName(hovered)}>
                              {ProductLine.ProductLine_name}
                            </h3>
                          )}
                          
                          <div style={styles.editActions(showEditActions)}>
                            {isEditing ? (
                              <>
                                <button
                                  style={styles.editActionBtn('save')}
                                  onClick={(e) => handleSaveEdit(e, ProductLine._id)}
                                  title="Save"
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#d1fae5';
                                    e.target.style.color = '#047857';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#059669';
                                  }}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  style={styles.editActionBtn('cancel')}
                                  onClick={handleCancelEdit}
                                  title="Cancel"
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#fee2e2';
                                    e.target.style.color = '#b91c1c';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#dc2626';
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <button
                                style={styles.editActionBtn('edit')}
                                onClick={(e) => handleEditClick(e, ProductLine)}
                                title="Edit category name"
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#dbeafe';
                                  e.target.style.color = '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                  e.target.style.color = '#6b7280';
                                }}
                              >
                                <Edit3 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <p style={styles.productCount}>{productCount} products</p>
                        <ChevronRight style={styles.arrowIcon(hovered)} />
                      </>
                    ) : (
                      <>
                        <div style={styles.listItemLeft}>
                          <div style={styles.ProductLineIconContainer}>
                            <Package style={styles.ProductLineIcon} />
                          </div>
                          <div style={styles.listItemContent}>
                            <div style={styles.ProductLineNameSection}>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingValue}
                                  onChange={handleInputChange}
                                  onKeyDown={(e) => handleKeyPress(e, ProductLine._id)}
                                  style={styles.ProductLineNameInput}
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                  onFocus={(e) => {
                                    e.target.style.borderColor = '#2563eb';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = 'none';
                                  }}
                                />
                              ) : (
                                <h3 style={styles.ProductLineName(hovered)}>
                                  {ProductLine.ProductLine_name}
                                </h3>
                              )}
                              
                              <div style={styles.editActions(showEditActions)}>
                                {isEditing ? (
                                  <>
                                    <button
                                      style={styles.editActionBtn('save')}
                                      onClick={(e) => handleSaveEdit(e, ProductLine._id)}
                                      title="Save"
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#d1fae5';
                                        e.target.style.color = '#047857';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#059669';
                                      }}
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button
                                      style={styles.editActionBtn('cancel')}
                                      onClick={handleCancelEdit}
                                      title="Cancel"
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#fee2e2';
                                        e.target.style.color = '#b91c1c';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#dc2626';
                                      }}
                                    >
                                      <X size={14} />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    style={styles.editActionBtn('edit')}
                                    onClick={(e) => handleEditClick(e, ProductLine)}
                                    title="Edit category name"
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = '#dbeafe';
                                      e.target.style.color = '#3b82f6';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = 'transparent';
                                      e.target.style.color = '#6b7280';
                                    }}
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p style={styles.productCount}>{productCount} products</p>
                          </div>
                        </div>
                        <div style={styles.listItemRight}>
                          <ChevronRight style={styles.arrowIcon(hovered)} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filteredProductLines.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateCard}>
              <Package style={styles.emptyStateIcon} />
              <h3 style={styles.emptyStateTitle}>No ProductLines found</h3>
              <p style={styles.emptyStateText}>Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProductLine;