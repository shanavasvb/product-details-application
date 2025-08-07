import React, { useState } from 'react';
import {
    Card,
    Typography,
    Input,
    Button,
    Space,
    message,
    Divider,
    Alert,
    Spin,
    List
} from 'antd';
import {
    ScanOutlined,
    SearchOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    BarcodeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import ProductList from './ProductList'; // Assuming this component exists
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const BarcodeSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [barcodes, setBarcodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [notFound, setNotFound] = useState([]);
    const [searched, setSearched] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Get user info for admin status
    const isAdmin = user?.is_admin;

    // Inline styles following your ProductLine pattern
    const styles = {
        mainContainer: {
            minHeight: '100vh',
            position: 'relative',
        },
        header: {
            position: 'sticky',
            top: '-4%',
            width: '100%',
            zIndex: 50,
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem',
        },
        headerContent: {
            display: 'flex',
            flexDirection: window.innerWidth >= 1024 ? 'row' : 'column',
            alignItems: window.innerWidth >= 1024 ? 'center' : 'flex-start',
            justifyContent: window.innerWidth >= 1024 ? 'space-between' : 'flex-start',
        },
        title: (isAdmin) => ({
            fontSize: '2.25rem',
            fontWeight: 'bold',
            width: '108%',
            background: isAdmin ? 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))' : '#1890ff',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.25rem',
            marginTop: '1.25rem',
            marginLeft: '25%'
        }),
        subtitle: {
            width: '100%',
            color: 'rgb(75, 85, 99)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.25rem',
            marginLeft: '25%'
        },
        searchControls: {
            display: 'flex',
            flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
            gap: '1rem',
            marginRight: '3%'
        },
        searchInputContainer: {
            position: 'relative'
        },
        searchInput: {
            padding: '0.5rem 1rem 0.5rem 2.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.75rem',
            width: '100%',
            maxWidth: '16rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontSize: '16px'
        },
        searchIcon: {
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgb(156, 163, 175)',
            width: '1.25rem',
            height: '1.25rem',
            pointerEvents: 'none'
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const parseInput = () => {
        // Split by newlines, commas, or spaces and filter out empty values
        const parsed = inputValue
            .split(/[\n,\s]+/)
            .map(code => code.trim())
            .filter(code => code.length > 0);

        setBarcodes(parsed);
        message.info(`${parsed.length} barcodes added for search`);
    };

    const clearInput = () => {
        setInputValue('');
        setBarcodes([]);
        setProducts([]);
        setNotFound([]);
        setSearched(false);
    };

    const searchProducts = async () => {
        if (barcodes.length === 0) {
            message.warning('Please add at least one barcode to search');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/v1/product/search-by-barcodes', {
                barcodes: barcodes
            });

            if (response.data.success) {
                setProducts(response.data.data);
                setNotFound(response.data.notFound);
                setSearched(true);

                message.success(`Found ${response.data.count} products`);
                if (response.data.notFoundCount > 0) {
                    message.warning(`${response.data.notFoundCount} barcodes not found`);
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to search products';
            message.error(errorMsg);
            console.error('Error searching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        marginBottom: '20px'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px'
    };

    return (
        <div style={styles.mainContainer}>
            {/* Header Section - Following ProductLine Pattern */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                       
                        <p style={styles.subtitle}>
                            <BarcodeOutlined style={{ width: '1rem', height: '1rem' }} />
                            Search products by barcode - Enter multiple barcodes for bulk search
                        </p>
                    </div>

                    <div style={styles.searchControls}>
                        <div style={styles.searchInputContainer}>
                            <SearchOutlined style={styles.searchIcon} />
                            <input
                                type="text"
                                style={{
                                    ...styles.searchInput,
                                    ':focus': {
                                        boxShadow: '0 0 0 2px #1890ff',
                                        borderColor: 'transparent'
                                    }
                                }}
                                placeholder="Quick barcode search..."
                                onFocus={(e) => {
                                    e.target.style.boxShadow = '0 0 0 2px #1890ff';
                                    e.target.style.borderColor = 'transparent';
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        setInputValue(e.target.value.trim());
                                        parseInput();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div style={{ padding: '0 2%' }}>
                <Card style={cardStyle}>
                    <div style={headerStyle}>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                <ScanOutlined /> Barcode Product Search
                            </Title>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                Enter multiple barcodes to search for products
                            </Text>
                        </div>
                    </div>

                    {/* Input Area */}
                    <TextArea
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter barcodes separated by commas, spaces, or new lines..."
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        style={{ borderRadius: '6px', marginBottom: '16px' }}
                    />

                    <Space style={{ marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            onClick={parseInput}
                            icon={<ScanOutlined />}
                        >
                            Parse Barcodes
                        </Button>
                        <Button
                            onClick={clearInput}
                            icon={<DeleteOutlined />}
                        >
                            Clear All
                        </Button>
                    </Space>

                    {/* Barcode List */}
                    {barcodes.length > 0 && (
                        <>
                            <Divider orientation="left">Barcodes to Search ({barcodes.length})</Divider>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginBottom: '16px'
                            }}>
                                {barcodes.map((code, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: '#f0f0f0',
                                            padding: '4px 10px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            display: 'inline-block'
                                        }}
                                    >
                                        {code}
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                onClick={searchProducts}
                                loading={loading}
                                style={{ width: '100%', marginBottom: '16px' }}
                            >
                                Search Products
                            </Button>
                        </>
                    )}

                    {/* Search Results */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: '10px' }}>Searching for products...</div>
                        </div>
                    )}

                    {searched && !loading && (
                        <>
                            {notFound.length > 0 && (
                                <Alert
                                    message={`${notFound.length} barcodes not found`}
                                    description={
                                        <div>
                                            <Text>The following barcodes could not be found in the database:</Text>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                                marginTop: '8px'
                                            }}>
                                                {notFound.map((code, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            background: '#fff2e8',
                                                            borderColor: '#ffccc7',
                                                            padding: '4px 10px',
                                                            borderRadius: '16px',
                                                            fontSize: '12px',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {code}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    type="warning"
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />
                            )}

                            {products.length > 0 ? (
                                <ProductList products={products} />
                            ) : (
                                <Alert
                                    message="No products found"
                                    description="Try searching with different barcodes"
                                    type="info"
                                    showIcon
                                    icon={<InfoCircleOutlined />}
                                />
                            )}
                        </>
                    )}
                </Card>
                
            </div>
        </div>
    );
};

export default BarcodeSearch;