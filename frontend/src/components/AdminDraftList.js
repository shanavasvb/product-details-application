import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDraftList = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await axios.get('/api/v1/drafts');
      setDrafts(res.data);
    } catch (err) {
      console.error('Error fetching drafts:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await axios.delete(`/api/v1/drafts/${id}`);
        fetchDrafts();
        setSelectedDraft(null);
      } catch (err) {
        console.error('Error deleting draft:', err);
      }
    }
  };

  const handleView = (draft) => {
    setSelectedDraft(draft);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Drafts Overview</h2>

      {drafts.length === 0 ? (
        <p>No draft data available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>#</th>
              <th style={styles.cell}>Product Name</th>
              <th style={styles.cell}>Barcode</th>
              <th style={styles.cell}>Quantity</th>
              {/* <th style={styles.cell}>Save Type</th> */}
              <th style={styles.cell}>Last Saved</th>
              <th style={styles.cell}>Edited By</th>
              <th style={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft, index) => (
              <tr key={draft._id} style={styles.row}>
                <td style={styles.cell}>{index + 1}</td>
                <td style={styles.cell}>{draft.draftData?.ProductName || 'N/A'}</td>
                <td style={styles.cell}>{draft.draftData?.Barcode || '-'}</td>
                <td style={styles.cell}>{draft.draftData?.Quantity} {draft.draftData?.Unit}</td>
                {/* <td style={styles.cell}>{draft.saveType}</td> */}
                <td style={styles.cell}>{new Date(draft.lastSaved).toLocaleString()}</td>
                <td style={styles.cell}>
                  {draft.employeeId?.name || 'N/A'}<br />
                  <small>{draft.employeeId?.email}</small>
                </td>
                <td style={styles.cell}>
                  <button onClick={() => handleView(draft)} style={styles.viewBtn}>View</button>
                  <button onClick={() => handleDelete(draft._id)} style={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDraft && (
        <div style={styles.viewBox}>
          <h4 style={styles.viewTitle}>{selectedDraft.draftData?.ProductName}</h4>
          <p><strong>Barcode:</strong> {selectedDraft.draftData?.Barcode}</p>
          <p><strong>Brand:</strong> {selectedDraft.draftData?.Brand}</p>
          <p><strong>Category:</strong> {selectedDraft.draftData?.Category}</p>
          <p><strong>ProductLine:</strong> {selectedDraft.draftData?.ProductLine}</p>
          <p><strong>Quantity:</strong> {selectedDraft.draftData?.Quantity} {selectedDraft.draftData?.Unit}</p>

          <p><strong>Features:</strong></p>
          <div style={styles.badgeContainer}>
            {selectedDraft.draftData?.Features?.map((feature, i) => (
              <span key={i} style={styles.featureBadge}>{feature}</span>
            ))}
          </div>

          <p><strong>Specifications:</strong></p>
          <div style={styles.badgeContainer}>
            {selectedDraft.draftData?.Specification &&
              Object.entries(selectedDraft.draftData.Specification).map(([key, value]) => (
                <span key={key} style={styles.specBadge}><strong>{key}:</strong> {value}</span>
              ))}
          </div>

          <button onClick={() => setSelectedDraft(null)} style={styles.closeBtn}>Close</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textAlign: 'center',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    backgroundColor: '#fff',
    boxShadow: '0 0 8px rgba(0,0,0,0.05)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  headerRow: {
    backgroundColor: '#f9fafb',
  },
  row: {
    borderBottom: '1px solid #e5e7eb'
  },
  cell: {
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #e5e7eb'
  },
  viewBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px'
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  viewBox: {
    marginTop: '20px',
    padding: '16px',
    maxWidth: '500px',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  viewTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1f2937'
  },
  badgeContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px'
  },
  featureBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px'
  },
  specBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px'
  },
  closeBtn: {
    marginTop: '10px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

export default AdminDraftList;




