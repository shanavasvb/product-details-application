import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/enriched-products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Error fetching product:', err));
  }, [productId]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.25rem' }}>
        Loading product...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 16px', fontFamily: 'sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: ' rgb(71, 166, 255)',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          marginBottom: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'rgb(85, 85, 87)', marginBottom: '12px' }}>
        {product['Product Name']}
      </h2>

      {product.Features?.length > 0 && (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
    {product.Features.map((feature, i) => (
      <span key={i} style={pillStyle}>
        {feature}
      </span>
    ))}
  </div>
)}


      <div style={infoStyle}>
        <strong>Description:</strong> {product.Description || 'N/A'}
      </div>
      <div style={infoStyle}>
        <strong>Barcode:</strong> {product.Barcode || 'N/A'}
      </div>
      <div style={infoStyle}>
        <strong>Brand:</strong> {product.Brand || 'N/A'}
      </div>
      <div style={infoStyle}>
        <strong>Category:</strong> {product.Category || 'N/A'}
      </div>
      <div style={infoStyle}>
        <strong>Product Line:</strong> {product.ProductLine || 'N/A'}
      </div>
      <div style={infoStyle}>
        <strong>Quantity:</strong> {product.Quantity || 'N/A'}
      </div>

      {/* <div style={infoStyle}>
        <strong>Features:</strong>
        {product.Features?.length ? (
          <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
            {product.Features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#6b7280' }}>No features available.</p>
        )}
      </div> */}

      <div style={infoStyle}>
        <strong>Specifications:</strong>
        {product.Specification ? (
          <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
            {Object.entries(product.Specification).map(([k, v], i) => (
              <li key={i}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#6b7280' }}>No specifications available.</p>
        )}
      </div>
    </div>
  );
};

const pillStyle = {
  background: '#e0f2fe',
  color: '#0369a1',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
  borderRadius: '999px'
};

const infoStyle = {
  marginBottom: '16px',
  fontSize: '15px',
  color: '#374151'
};

export default ProductDetails;
