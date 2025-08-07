import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  FaBars, FaUserCircle, FaHome, FaTimes,
  FaLayerGroup, FaCubes, FaUpload, FaUsers,
  FaUserCheck, FaSignOutAlt
} from 'react-icons/fa';

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa'
  },
  sidebar: {
    width: '260px',
    height: '100%',
    backgroundColor: ' #f8fafc',
    color: ' #000',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 8px rgba(24, 144, 255, 0.15)'
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: ' #50a8ff',
    borderBottom: '1px solid #0066cc'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: ' #ffffff',
    color: ' #1890ff',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '19px',
    fontWeight: '700'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: ' #ffffff'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: ' #ffffff',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    opacity: 0.8,
    transition: 'opacity 0.2s'
  },
  navSection: {
    flex: 1,
    padding: '24px 0 16px 0'
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  navItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: ' #5d5a5a',
    transition: 'all 0.2s ease',
    borderLeft: '3px solid transparent',
    marginBottom: '8px',
    borderRadius: '6px'
  },
  activeNavItem: {
    backgroundColor: 'rgb(104, 177, 255)',
    color: ' #ffffff',
    borderLeft: '3px solid #ffffff',
    fontWeight: '600',
    borderRadius: '6px'
  },
  logoutNavItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: ' #dc2626',
    transition: 'all 0.2s ease',
    borderLeft: '3px solid transparent',
    marginBottom: '8px',
    borderRadius: '6px',
    marginTop: '16px',
    borderTop: '1px solid #e8eaed',
    paddingTop: '20px'
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  icon: {
    fontSize: '18px',
    color: 'inherit',
    display: 'flex'
  },
  label: {
    flex: 1,
    textAlign: 'left'
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: ' #ffffff',
    borderBottom: '1px solid #e8eaed',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    position: 'relative',
    zIndex: 10
  },
  menuBtn: {
    backgroundColor: ' #1890ff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px',
    cursor: 'pointer',
    color: ' #ffffff',
    transition: 'background-color 0.2s'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerBtn: {
    backgroundColor: ' #f0f8ff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px',
    cursor: 'pointer',
    color: ' #1890ff',
    transition: 'background-color 0.2s'
  },
  // Logout button style for header
  logoutHeaderBtn: {
    backgroundColor: '#fef2f2',
    border: 'none',
    borderRadius: '6px',
    padding: '10px',
    cursor: 'pointer',
    color: '#dc2626',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  content: {
    flex: 1,
    padding: '24px',
    overflow: 'auto'
  }
};

// Inject hover styles dynamically
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    [data-nav-item]:hover {
      background-color: rgb(104, 177, 255) !important;
      color: #ffffff !important;
    }
    [data-logout-item]:hover {
      background-color: #fef2f2 !important;
      color: #dc2626 !important;
      transform: translateX(4px);
    }
    [data-close-btn]:hover {
      opacity: 1 !important;
    }
    [data-menu-btn]:hover {
      background-color: rgb(176, 213, 252) !important;
    }
    [data-header-btn]:hover {
      background-color: #e6f4ff !important;
    }
    [data-logout-header-btn]:hover {
      background-color: #fee2e2 !important;
      color: #b91c1c !important;
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
};
if (typeof document !== 'undefined') {
  setTimeout(addHoverEffects, 0);
}

const EmployeeLayoutWithHover = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Employee', role: 'Employee' };
  const currentPath = location.pathname;

  // Proper logout function
  const handleLogout = () => {
    try {
      // Clear all stored user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('employee');

      // Clear sessionStorage as well
      sessionStorage.clear();

      // Navigate to login page
      navigate('/login', { replace: true });

      // Optional: Show success message or confirmation
      console.log('Employee logged out successfully');

    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if there's an error
      navigate('/login', { replace: true });
    }
  };

  const menuItems = [
    { label: 'Dashboard', path: '/homepage', icon: <FaHome /> },
    { label: 'Category', path: '/category', icon: <FaLayerGroup /> },
    { label: 'Product Line', path: '/productline', icon: <FaCubes /> },
    { label: 'Fetch Products', path: '/barcode-search', icon: <FaUpload /> },
    { label: 'Draft Products', path: '/homepage/draft-products', icon: <FaUpload /> },
    { label: 'Profile', path: '/profile', icon: <FaUserCircle /> }
  ];

  const logoutItem = { label: 'Logout', icon: <FaSignOutAlt /> };

  return (
    <div style={styles.app}>
      {isSidebarOpen && (
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>E</div>
              <span style={styles.logoText}>Employee</span>
            </div>
            <button
              style={styles.closeBtn}
              onClick={() => setIsSidebarOpen(false)}
              data-close-btn
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div style={styles.navSection}>
            <ul style={styles.navList}>
              {menuItems.map((item) => (
                <li
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  data-nav-item
                  style={{
                    ...styles.navItem,
                    ...(currentPath === item.path ? styles.activeNavItem : {})
                  }}
                >
                  <div style={styles.iconText}>
                    <span style={styles.icon}>{item.icon}</span>
                    <span style={styles.label}>{item.label}</span>
                  </div>
                </li>
              ))}

              {/* Logout item with proper function */}
              <li
                onClick={handleLogout}
                data-logout-item
                style={styles.logoutNavItem}
              >
                <div style={styles.iconText}>
                  <span style={styles.icon}>{logoutItem.icon}</span>
                  <span style={styles.label}>{logoutItem.label}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ ...styles.main, marginLeft: isSidebarOpen ? '260px' : '0' }}>
        <div style={styles.header}>
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={styles.menuBtn}
              data-menu-btn
              title="Open sidebar"
            >
              <FaBars size={18} />
            </button>
          )}

          {/* Header actions - profile icon removed, only home and logout */}
          <div style={styles.headerActions}>
            <button
              title="Home"
              style={styles.headerBtn}
              data-header-btn
              onClick={() => navigate('/homepage')}
            >
              <FaHome size={18} />
            </button>

            {/* Logout button in header */}
            <button
              title="Logout"
              style={styles.logoutHeaderBtn}
              data-logout-header-btn
              onClick={handleLogout}
            >
              <FaSignOutAlt size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default EmployeeLayoutWithHover;