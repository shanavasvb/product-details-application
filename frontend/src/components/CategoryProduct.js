import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryProducts = () => {
  const { categoryId, productLineId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [productLineName, setproductLineName] = useState('');

  const navigate = useNavigate();

             useEffect(() => {
                if (categoryId) {
                  axios.get(`http://localhost:5000/api/v1/category`)
                    .then(res => {
                      const found = res.data.find(cat => cat.Category_id === categoryId);
                      if (found) setCategoryName(found.Category_name);
                    });

                  axios.get(`http://localhost:5000/api/v1/products/by-category/${categoryId}`)
                    .then(res => setProducts(res.data))
                    .catch(err => console.error('Category fetch error:', err));
                } else if (productLineId) {
                  axios.get(`http://localhost:5000/api/v1/productLine`)
                    .then(res => {
                      const found = res.data.find(pl => pl.ProductLine_id === productLineId);
                      if (found) setproductLineName(found.ProductLine_name);
                    });

                  axios.get(`http://localhost:5000/api/v1/products/by-productLine/${productLineId}`)
                    .then(res => setProducts(res.data))
                    .catch(err => console.error('ProductLine fetch error:', err));
                }
              }, [categoryId, productLineId]);


  // Helper function to get product name from different possible fields
  const getProductName = (product) => {
    return product.ProductName || 
           'Product Name Not Available';
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

  const pageStyles = {
    minHeight: '100vh',
    backgroundColor: ' #f8fafc',
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
    color: ' #1e293b',
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
    minHeight: '280px'
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

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={pageStyles}>
      <div style={containerStyles}>
        <button 
          style={backButtonStyles}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = ' rgb(71, 166, 255)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = ' rgb(71, 166, 255)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back
        </button>
        
        <h2 style={titleStyles}>
          Products in "{categoryName || productLineName ||'Category'}"
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
                
                onClick={() =>{
                  console.log("Navigating to product ID:", product._id); 
                  navigate(`/product/${product._id}`)}}
                onMouseEnter={() => setHoveredCard(product._id || index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg,rgb(128, 203, 253), #8b5cf6,rgb(128, 203, 253))'
                }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <h3 style={productNameStyles}>
                    {/* <span style={labelStyles}>Name:</span> */}
                    {getProductName(product)}
                  </h3>
                  
                  <p style={descriptionStyles}>
                    <span style={labelStyles}>Description:</span>
                    {getDescription(product)}
                  </p>
                  
                  <div style={quantityUnitStyles}>
                    <span style={quantityBadgeStyles}>
                      Qty: {getQuantity(product)}
                    </span>
                    <span style={unitBadgeStyles}>
                      {getUnit(product)}
                    </span>
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