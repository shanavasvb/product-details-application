import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryProducts = () => {
  const { categoryId, productLineId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [productLineName, setproductLineName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.is_admin;


  const navigate = useNavigate();

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchCategoryData = useCallback(async (catId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category name
      const categoryResponse = await axios.get(`http://localhost:5000/api/v1/category`);
      const foundCategory = categoryResponse.data.find(cat => cat.Category_id === catId);
      if (foundCategory) {
        setCategoryName(foundCategory.Category_name);
      }

      // Fetch products by category
      const productsResponse = await axios.get(`http://localhost:5000/api/v1/products/by-category/${catId}`);
      setProducts(productsResponse.data);

    } catch (err) {
      console.error('Category fetch error:', err);
      setError('Failed to load category data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductLineData = useCallback(async (plId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product line name
      const productLineResponse = await axios.get(`http://localhost:5000/api/v1/productLine`);
      const foundProductLine = productLineResponse.data.find(pl => pl.ProductLine_id === plId);
      if (foundProductLine) {
        setproductLineName(foundProductLine.ProductLine_name);
      }

      // Fetch products by product line
      const productsResponse = await axios.get(`http://localhost:5000/api/v1/products/by-productLine/${plId}`);
      setProducts(productsResponse.data);

    } catch (err) {
      console.error('ProductLine fetch error:', err);
      setError('Failed to load product line data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData(categoryId);
    } else if (productLineId) {
      fetchProductLineData(productLineId);
    } else {
      setLoading(false);
    }
  }, [categoryId, productLineId, fetchCategoryData, fetchProductLineData]);

  // Helper function to get product name from different possible fields
  const getProductName = (product) => {
    return product.ProductName || 'Product Name Not Available';
  };

  // Helper function to get description
  const getDescription = (product) => {
    return product.Description ||
      product.description ||
      product.desc ||
      'No description available';
  };

  // Helper function to get unit
  const getUnit = (product) => {
    return product.Unit ||
      product.unit ||
      product.units ||
      'Unit not specified';
  };

  // Helper function to get quantity
  const getQuantity = (product) => {
    return product.Quantity ||
      product.quantity ||
      product.qty ||
      'N/A';
  };

  const handleProductClick = useCallback((productId) => {
    console.log("Navigating to product ID:", productId);
    navigate(`/product/${productId}`);
  }, [navigate]);

  const pageStyles = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const backButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#6366f1',
    background: 'rgb(71, 166, 255)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)'
  };

  const titleStyles = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '32px',
    textAlign: 'center',
    background: 'rgba(86, 86, 86, 0.71)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    padding: '20px 0'
  };

  const cardStyles = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '280px',
    cursor: 'pointer'
  };

  const cardHoverStyles = {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  const productNameStyles = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    lineHeight: '1.4',
    minHeight: '50px'
  };

  const labelStyles = {
    fontWeight: '600',
    color: '#374151',
    marginRight: '8px'
  };

  const descriptionStyles = {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '16px',
    minHeight: '80px',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const quantityUnitStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  };

  const unitBadgeStyles = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: '1px solid #e2e8f0'
  };

  const quantityBadgeStyles = {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: '1px solid #bfdbfe'
  };

  const noProductsStyles = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
    fontSize: '1.125rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    margin: '40px 0'
  };

  const loadingStyles = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
    fontSize: '1.125rem'
  };

  const errorStyles = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#dc2626',
    fontSize: '1.125rem',
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    border: '1px solid #fecaca',
    margin: '40px 0'
  };

  // Loading state
  if (loading) {
    return (
      <div style={pageStyles}>
        <div style={containerStyles}>
          <button
            style={backButtonStyles}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div style={loadingStyles}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={pageStyles}>
        <div style={containerStyles}>
          <button
            style={backButtonStyles}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div style={errorStyles}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
            <p>{error}</p>
            <button
              style={{
                ...backButtonStyles,
                marginTop: '16px',
                backgroundColor: '#dc2626'
              }}
              onClick={() => {
                if (categoryId) {
                  fetchCategoryData(categoryId);
                } else if (productLineId) {
                  fetchProductLineData(productLineId);
                }
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles}>
      <div style={containerStyles}>
        <button
          style={backButtonStyles}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgb(71, 166, 255)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgb(71, 166, 255)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back
        </button>

        <h2 style={titleStyles}>
          Products in "{categoryName || productLineName || 'Category'}"
        </h2>

        {products.length === 0 ? (
          <div style={noProductsStyles}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div style={gridStyles}>
            {products.map((product, index) => (
              <div
                key={product._id || product.id || index}
                style={{
                  ...cardStyles,
                  ...(hoveredCard === (product._id || index) ? cardHoverStyles : {})
                }}
                onClick={() => handleProductClick(product._id)}
                onMouseEnter={() => setHoveredCard(product._id || index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
               <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: isAdmin
                  ? 'linear-gradient(90deg,rgb(81, 126, 247), #8b5cf6, rgb(231, 74, 223))'  // green gradient
                  : 'linear-gradient(90deg, rgb(128, 203, 253), #8b5cf6, rgb(128, 203, 253))'
              }}
            ></div>


                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <h3 style={productNameStyles}>
                    {getProductName(product)}
                  </h3>

                  <p style={descriptionStyles}>
                    <span style={labelStyles}>Description:</span>
                    {getDescription(product)}
                  </p>

                  <div style={quantityUnitStyles}>
                    <span style={quantityBadgeStyles}>
                      Qty: {getQuantity(product)} {getUnit(product)}
                    </span>
                    {/* <span style={unitBadgeStyles}>
                      
                    </span> */}
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

export default CategoryProducts;