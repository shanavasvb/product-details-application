import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductFetch() {
  const [barcodes, setBarcodes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFetch = async () => {
    if (!barcodes.trim()) {
      alert('Please enter at least one barcode');
      return;
    }

    const barcodeList = barcodes
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    setIsLoading(true);
    setProgress(0);

    const total = barcodeList.length;
    const fetchedData = [];

    for (let i = 0; i < total; i++) {
      try {
        const response = await axios.post('http://localhost:5000/api/products/fetchByBarcode', {
          barcode: barcodeList[i],
        });

        // Only add if product is found
        if (response.data) {
          fetchedData.push(response.data);
        }
      } catch (error) {
        console.error(`Error fetching barcode ${barcodeList[i]}`, error);
      }
      // Update real progress
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsLoading(false);
    alert('✅ Product fetch completed!');
    navigate('/ProductList', { state: { products: fetchedData } });
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e2e8f0'
  };

  const homeBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    textDecoration: 'none'
  };

  const profileBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.25rem',
    transition: 'background-color 0.2s'
  };

  const mainStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: 'calc(100vh - 80px)'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    height: 'fit-content'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center'
  };

  const inputGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '200px',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    resize: 'vertical',
    backgroundColor: isLoading ? '#f9fafb' : '#ffffff',
    color: isLoading ? '#6b7280' : '#111827',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  };

  const countStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    textAlign: 'right'
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  };

  const fetchBtnStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: (isLoading || !barcodes.trim()) ? '#9ca3af' : '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: (isLoading || !barcodes.trim()) ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    minWidth: '120px'
  };

  const progressSectionStyle = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0'
  };

  const progressInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem'
  };

  const progressFillStyle = {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    transition: 'width 0.3s ease-in-out',
    width: `${progress}%`
  };

  const progressMessageStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button 
          style={homeBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: '0.5rem' }}
          >
            <span>🏠</span> Home
          </Link>
        </button>
        <button 
          style={profileBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
        >
          <span>👤</span>
        </button>
      </header>

      <main style={mainStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Fetch Product Barcodes</h1>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Enter up to 100 barcodes (one per line):</label>
            <textarea
              value={barcodes}
              onChange={(e) => setBarcodes(e.target.value)}
              placeholder={`123456789012\n987654321098\n456789012345...`}
              style={textareaStyle}
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={countStyle}>
              {barcodes.split('\n').filter((line) => line.trim()).length} barcodes entered
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button
              onClick={handleFetch}
              disabled={isLoading || !barcodes.trim()}
              style={fetchBtnStyle}
              onMouseEnter={(e) => {
                if (!isLoading && barcodes.trim()) {
                  e.target.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && barcodes.trim()) {
                  e.target.style.backgroundColor = '#10b981';
                }
              }}
            >
              {isLoading ? 'Fetching...' : 'Fetch'}
            </button>
          </div>

          {/* Real Progress Bar */}
          {isLoading && (
            <div style={progressSectionStyle}>
              <div style={progressInfoStyle}>
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle}></div>
              </div>
              <div style={progressMessageStyle}>
                Fetching {progress}%...
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}