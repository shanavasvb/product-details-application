import React, { Suspense, lazy, startTransition } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ListUser from './components/ListUser';
import { AuthProvider, useAuth } from './context/AuthContext';


// Import pages
import Homepage from './components/Homepage';
import ProductData from './components/ProductData'; // Fixed import name to match actual component

// Lazy loaded components
const CategoryPage = lazy(() => import("./components/Category"));
const CategoryProducts = lazy(() => import("./components/CategoryProduct"));
const ProductDetails = lazy(() => import("./components/ProductDetails")); 
const ProductLine = lazy(() => import("./components/ProductLine"));

// Loading component with better styling
const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
        }}></div>
        <div style={{
            fontSize: '1.2rem',
            color: '#64748b',
            fontWeight: '500'
        }}>
            Loading...
        </div>
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#fef2f2'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>❌</div>
                    <h2 style={{ color: '#dc2626', marginBottom: '16px', fontSize: '1.5rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '500px' }}>
                        {this.state.error?.message || 'An unexpected error occurred while loading the page.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null, errorInfo: null });
                            }}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => {
                                startTransition(() => {
                                    window.location.href = '/';
                                });
                            }}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            Go Home
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                        <details style={{
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '8px',
                            textAlign: 'left',
                            maxWidth: '800px',
                            overflow: 'auto'
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                                Error Details (Development Mode)
                            </summary>
                            <pre style={{ fontSize: '12px', color: '#374151', whiteSpace: 'pre-wrap' }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !user.is_admin) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

// Wrapper component for lazy-loaded routes
const LazyWrapper = ({ children }) => (
    <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
            {children}
        </Suspense>
    </ErrorBoundary>
);

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <ErrorBoundary>
                <AuthProvider>
                    <Router>
                        <div className="App">
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    {/* Layout routes - public homepage section */}
                                    <Route path="/homepage" element={<Homepage />} />
                                    <Route path="/homepage/:productId" element={<ProductData />} />

                                    {/* Auth routes */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />

                                    {/* Protected routes */}
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute requireAdmin={true}>
                                                <AdminDashboard />
                                            </ProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path='/list-user'
                                        element={
                                            <ProtectedRoute>
                                                <ListUser />
                                            </ProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Default route */}
                                    <Route path="/" element={<Navigate to="/login" replace />} />

                                    {/* Lazy-loaded routes */}
                                    <Route
                                        path="/Category"
                                        element={
                                            <LazyWrapper>
                                                <CategoryPage />
                                            </LazyWrapper>
                                        }
                                    />

                                    <Route
                                        path="/category/:categoryId/products"
                                        element={
                                            <LazyWrapper>
                                                <CategoryProducts />
                                            </LazyWrapper>
                                        }
                                    />

                                    <Route
                                        path="/productline/:productLineId/products"
                                        element={
                                            <LazyWrapper>
                                                <CategoryProducts />
                                            </LazyWrapper>
                                        }
                                    />

                                    <Route path="/product/:productId" element={
                                         <LazyWrapper>
                                            <ProductDetails />
                                        </LazyWrapper>} /> 

                                    {/* Removed duplicate route for product details since we already have /homepage/:productId */}

                                    <Route
                                        path="/ProductLine"
                                        element={
                                            <LazyWrapper>
                                                <ProductLine />
                                            </LazyWrapper>
                                        }
                                    />
                                </Routes>
                            </Suspense>
                        </div>
                    </Router>
                </AuthProvider>
            </ErrorBoundary>
        </ConfigProvider>
    );
}

export default App;