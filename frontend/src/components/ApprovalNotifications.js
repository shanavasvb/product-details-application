import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApproveNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/approvalNotify')
        .then(res => {
        console.log('Notifications received:', res.data); 
        const editingNotifications = res.data.filter(note => note.type === 'editing');
        setNotifications(editingNotifications);
        })
        .catch(err => {
        console.error('Error fetching notifications:', err);
        });
    }, []);


  const handleViewClick = (relatedId) => {
    navigate(`/draft/${relatedId}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Product Edit Notifications</h2>
      {notifications.length === 0 ? (
        <p style={styles.noData}>No edit notifications available.</p>
      ) : (
        notifications.map((note) => (
          <div key={note._id} style={styles.card}>
            <div style={styles.info}>
              <p><strong>Message:</strong> {note.message}</p>
              <p><strong>Employee ID:</strong> {note.senderId}</p>
              <p><strong>Product ID:</strong> {note.relatedId}</p>
              <p><strong>Time:</strong> {new Date(note.timestamp).toLocaleString()}</p>
            </div>
            <button
              style={styles.viewBtn}
              onClick={() => handleViewClick(note.relatedId)}
            >
              View
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.2rem',
    borderRadius: '8px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    lineHeight: '1.6',
    flex: 1,
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  noData: {
    color: '#666',
  },
};

export default ApproveNotification;
