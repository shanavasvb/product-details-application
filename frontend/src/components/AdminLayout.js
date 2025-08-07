import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Package, Users, LogOut, Layers, Upload } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/homepage', icon: <LayoutDashboard size={18} /> },
  { label: 'Category', path: '/category', icon: <Layers size={18} /> },
  { label: 'Product Line', path: '/productline', icon: <Package size={18} /> },
  { label: 'Fetch Products', path: '/barcode-search', icon: <Upload size={18} /> },
  { label: 'Manage Employee', path: '/admin', icon: <Users size={18} /> },
  { label: 'Profile', path: '/profile', icon: <Users size={18} /> },
  { label: 'Trashed Products', path: '/homepage/trashed-products', icon: <Users size={18} /> },
  { label: 'Approve Products', path: '/approveNotification', icon: <Package size={18} /> },
  { label: 'Draft', path: '/draft', icon: <Package size={18} /> }
];

function AdminLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  // Proper logout function
  const handleLogout = () => {
    try {
      // Clear all stored user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');

      // Clear sessionStorage as well
      sessionStorage.clear();

      // Navigate to login page
      navigate('/login', { replace: true });

      // Optional: Show success message
      console.log('User logged out successfully');

    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if there's an error
      navigate('/login', { replace: true });
    }
  };

  const layoutContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f8fafc',
    color: ' #1a202c'
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ' #ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #e2e8f0'
  };

  const menuButtonStyle = {
    background: 'none',
    border: 'none',
    color: ' #9333ea',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  };

  const sidebarStyle = {
    width: showSidebar ? '260px' : '0',
    backgroundColor: '#ffffff',
    color: '#374151',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid #e5e7eb'
  };

  const contentStyle = {
    flex: 1,
    padding: '2rem',
    overflow: 'auto',
    backgroundColor: '#f8fafc'
  };

  const mainStyle = {
    display: 'flex',
    flex: 1
  };

  const menuListStyle = {
    listStyle: 'none',
    padding: '1rem 0',
    margin: 0
  };

  const menuItemStyle = {
    margin: '0.5rem 0.75rem',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const getLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    color: activePath === path ? ' #ffffff' : ' #4b5563',
    backgroundColor: activePath === path ? ' #9333ea' : 'transparent',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: activePath === path ? '600' : '500',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    textDecoration: 'none',
    boxShadow: activePath === path ? '0 2px 4px rgba(147, 51, 234, 0.2)' : 'none'
  });

  // Special logout button style
  const getLogoutStyle = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    color: '#dc2626',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    textDecoration: 'none'
  });

  const logoutSectionStyle = {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
    marginTop: '1rem'
  };

  // Logout button in navbar
  const navbarLogoutStyle = {
    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
  };

  return (
    <div style={layoutContainerStyle}>
      <nav style={navbarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            style={menuButtonStyle}
            onClick={() => setShowSidebar(!showSidebar)}
            onMouseEnter={(e) => e.target.style.backgroundColor = ' #f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Menu size={22} />
          </button>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            color: ' #7c3aed',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Admin Panel
          </h1>
        </div>

        {/* Only logout button in navbar - profile icon removed */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={navbarLogoutStyle}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.3)';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div style={mainStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <ul style={menuListStyle}>
            {menuItems.map(({ label, path, icon }) => (
              <li key={path} style={menuItemStyle}>
                <button
                  style={getLinkStyle(path)}
                  onClick={() => navigate(path)}
                  onMouseEnter={(e) => {
                    if (activePath !== path) {
                      e.target.style.backgroundColor = ' #9333ea';
                      e.target.style.color = 'rgb(255, 255, 255)';
                      e.target.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activePath !== path) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = ' #4b5563';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              </li>
            ))}

            {/* Logout section in sidebar */}
            <li style={{ ...menuItemStyle, ...logoutSectionStyle }}>
              <button
                style={getLogoutStyle()}
                onClick={handleLogout}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fef2f2';
                  e.target.style.color = '#b91c1c';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#dc2626';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <LogOut size={18} />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <section style={contentStyle}>
          <div style={{
            backgroundColor: ' #ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            minHeight: 'calc(100vh - 8rem)'
          }}>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminLayout;