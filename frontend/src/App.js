import React from 'react';
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ListUser from './components/ListUser';
import { AuthProvider, useAuth } from './context/AuthContext';
const CategoryPage = lazy(() => import("./components/Category")); 
const CategoryProducts = lazy(() => import("./components/CategoryProduct")); 
const ProductDetails = lazy(() => import("./components/ProductDetails")); 
const ProductLine = lazy(() => import("./components/ProductLine")); 
// const Layout = lazy(() => import("./components/Layout"));
import './App.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !user.is_admin) {
        return <Navigate to="/profile" />;
    }

    return children;
};

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
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
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/Category" element={<CategoryPage />} />
                            {/* <Route path="/Layout" element={<Layout />} /> */}
                            <Route path="/category/:categoryId/products" element={<CategoryProducts />} /> {/* 👈 Add this line */}
                            <Route path="/productline/:productLineId/products" element={<CategoryProducts />} /> {/* 👈 Add this line */}
                            <Route path="/product/:productId" element={<ProductDetails />} /> 
                            <Route path="/ProductLine" element={<ProductLine />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ConfigProvider>
    );
}

export default App;