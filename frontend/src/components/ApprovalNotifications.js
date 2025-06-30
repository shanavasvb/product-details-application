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
    
  const handleViewClick = (notification) => {
    // Navigate to a draft review page with the notification data
    navigate(`/draft-review/${notification.relatedId}`, {
      state: {
        productId: notification.relatedId,
        employeeId: notification.senderId,
        saveType: 'manual',
        notificationId: notification._id
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Approval Requests</h2>
        <div style={styles.badge}>{notifications.length}</div>
      </div>
      
      {notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <p style={styles.noData}>No approval requests at the moment</p>
          <p style={styles.noDataSub}>New edit requests will appear here</p>
        </div>
      ) : (
        <div style={styles.notificationList}>
          {notifications.map((note) => (
            <div key={note._id} style={styles.notification}>
              <div style={styles.notificationContent}>
                <div style={styles.message}>
                  {note.message}
                </div>
                {/* <div style={styles.metadata}>
                  <div style={styles.metadataItem}>
                    <strong>Product ID:</strong> {note.relatedId}
                  </div>
                  <div style={styles.metadataItem}>
                    <strong>Employee ID:</strong> {note.senderId}
                  </div>
                </div> */}
                <div style={styles.timestamp}>
                  {new Date(note.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
              <button
                style={styles.viewBtn}
                onClick={() => handleViewClick(note)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.viewBtnHover.backgroundColor;
                  e.target.style.transform = styles.viewBtnHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.viewBtn.backgroundColor;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  },
  badge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  notification: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
  },
  notificationContent: {
    flex: 1,
    paddingRight: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '0.75rem',
    fontWeight: '500',
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    marginBottom: '0.5rem',
  },
  metadataItem: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '400',
  },
  timestamp: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '400',
  },
  viewBtn: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
  },
  viewBtnHover: {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  noData: {
    color: '#6b7280',
    fontSize: '1.125rem',
    fontWeight: '500',
    margin: '0 0 0.5rem 0',
  },
  noDataSub: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    margin: '0',
  },
};

export default ApproveNotification;