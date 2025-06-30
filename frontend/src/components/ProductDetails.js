import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/enriched-products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setIsLoading(false);
      });
  }, [productId]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ddd6fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <p style={{
            fontSize: '20px',
            fontWeight: '500',
            color: '#64748b',
            margin: 0
          }}>Loading premium experience...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ddd6fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '20px', color: '#64748b' }}>Product not found</p>
      </div>
    );
  }

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%,rgba(221, 214, 254, 0.82) 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(203, 213, 225, 0.3)',
    padding: '20px 0'
  };

  const navContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const backButtonStyle = {
    background: ' #1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const mainContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 32px'
  };

  const heroSectionStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    padding: '48px',
    marginBottom: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

  const productTitleStyle = {
    fontSize: '35px',
    fontWeight: '800',
    background: ' #1890ff',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '24px',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,

    lineHeight: '1.2'
  };

  const featuresContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '32px'
  };

  const getFeatureStyle = (index) => ({
  background: hoveredFeature === index
    ? 'rgb(152, 208, 110)'
    : ' #f6ffed',
  color: hoveredFeature === index ? 'white' : 'rgb(52, 146, 12)',
  fontSize: '12px',
  fontWeight: '600',
  padding: '5px 18px',
  borderRadius: '50px',
  border: '1px solid #b7eb8f',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
  transform: hoveredFeature === index ? 'translateY(-2px)' : 'translateY(0)'
});


  const cardStyle = {
    padding: '16px',
    width: '40%',
    background: '#fff',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

  const specificationsCardStyle = {
    padding: '16px',
    width: '40%',
    background: '#fff',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

  const titleStyle = {
    fontSize: '20px',
    // fontWeight: '700',
    background: 'rgb(85, 170, 250)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    marginBottom: '32px'
  };

  const labelStyle = {
    // fontWeight: '500',
    color: ' #4b5563',
    minWidth: '120px',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,

  };

  const valueStyle = {
    color: 'rgb(144, 144, 151)',
    // fontWeight: '600',
    fontSize: '14px',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,

  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6'
  };

  const specTitleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '32px'
  };

  const specListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  };

  const specItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(203, 213, 225, 0.3)'
  };

  const specKeyStyle = {
    fontWeight: '600',
    color: '#374151',
    fontSize: '16px'
  };

  const specValueStyle = {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Navigation */}
      <nav style={navStyle}>
        <div style={navContentStyle}>
          <button
            onClick={() => navigate(-1)}
            style={backButtonStyle}
            className="back-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Products
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <section style={heroSectionStyle}>
          <h1 style={productTitleStyle}>{product['Product Name']}</h1>

             {/* Features */}
          {product.Features?.length > 0 && (
            <div style={featuresContainerStyle}>
              {product.Features.map((feature, i) => (
                <span
                  key={i}
                  style={getFeatureStyle(i)}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {product.Description && (
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.6',
              marginBottom: '32px',
              maxWidth: '800px',
              fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,

            }}>{product.Description}</p>
          )}

       

          {/* Side-by-side Product Info and Specifications */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            <div style={cardStyle}>
              <div style={titleStyle}>Product Information</div>
              {<div style={itemStyle}><span style={labelStyle}>Brand</span><span style={valueStyle}>{product.Brand}</span></div>}
              {<div style={itemStyle}><span style={labelStyle}>Category</span><span style={valueStyle}>{product.Category}</span></div>}
              {<div style={itemStyle}><span style={labelStyle}>Product Line</span><span style={valueStyle}>{product.ProductLine}</span></div>}
              {<div style={itemStyle}><span style={labelStyle}>Barcode</span><span style={valueStyle}>{product.Barcode}</span></div>}
              {<div style={itemStyle}><span style={labelStyle}>Quantity</span><span style={valueStyle}>{product.Quantity}</span></div>}
            </div>

            {product.Specification && Object.keys(product.Specification).length > 0 && (
              <section style={specificationsCardStyle}>
              <div style={titleStyle}>Technical Specifications</div>
              <div style={specListStyle}>
                  {Object.entries(product.Specification).map(([key, value], index) => (
                    <div key={index} style={itemStyle} className="spec-item">
                      <span style={labelStyle}>{key}</span>
                      <span style={valueStyle}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
