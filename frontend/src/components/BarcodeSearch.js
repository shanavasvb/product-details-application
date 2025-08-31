import React, { useState, useEffect } from 'react';
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
    List,
    Progress,
    Statistic,
    Row,
    Col,
    Badge,
    Tooltip,
    notification
} from 'antd';
import {
    ScanOutlined,
    SearchOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    BarcodeOutlined,
    DatabaseOutlined,
    ApiOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import ProductList from './ProductList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BarcodeSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [barcodes, setBarcodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [notFound, setNotFound] = useState([]);
    const [searched, setSearched] = useState(false);
    const [searchStats, setSearchStats] = useState(null);
    const [searchProgress, setSearchProgress] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    const isAdmin = user?.is_admin;

    // Enhanced styles with better responsiveness
    const styles = {
        mainContainer: {
            minHeight: '100vh',
            position: 'relative',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ddd6fe 100%)',
        },
        header: {
            position: 'sticky',
            top: '-4%',
            width: '100%',
            zIndex: 50,
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px 0'
        },
        headerContent: {
            display: 'flex',
            flexDirection: window.innerWidth >= 1024 ? 'row' : 'column',
            alignItems: window.innerWidth >= 1024 ? 'center' : 'flex-start',
            justifyContent: window.innerWidth >= 1024 ? 'space-between' : 'flex-start',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
        },
        title: (isAdmin) => ({
            fontSize: '2.25rem',
            fontWeight: 'bold',
            background: isAdmin ? 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))' : 'linear-gradient(to right, #1890ff, #52c41a)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.25rem',
            marginTop: '1.25rem',
        }),
        subtitle: {
            color: 'rgb(75, 85, 99)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.25rem',
        },
        searchControls: {
            display: 'flex',
            flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
            gap: '1rem',
        },
        quickSearchContainer: {
            position: 'relative',
            minWidth: '250px'
        },
        quickSearchInput: {
            padding: '8px 12px 8px 40px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            width: '100%',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontSize: '14px'
        },
        searchIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgb(156, 163, 175)',
            fontSize: '16px',
            pointerEvents: 'none'
        }
    };

    // Enhanced input parsing with validation
    const parseInput = () => {
        const parsed = inputValue
            .split(/[\n,\s]+/)
            .map(code => code.trim())
            .filter(code => {
                // Basic barcode validation (adjust regex as needed)
                return code.length >= 8 && code.length <= 20 && /^[0-9]+$/.test(code);
            });

        if (parsed.length === 0) {
            message.warning('No valid barcodes found. Please enter barcodes with 8-20 digits.');
            return;
        }

        const invalid = inputValue
            .split(/[\n,\s]+/)
            .map(code => code.trim())
            .filter(code => code.length > 0)
            .filter(code => !(code.length >= 8 && code.length <= 20 && /^[0-9]+$/.test(code)));

        if (invalid.length > 0) {
            notification.warning({
                message: 'Invalid Barcodes Detected',
                description: `Skipped ${invalid.length} invalid barcode(s). Valid barcodes should be 8-20 digits.`,
                duration: 4
            });
        }

        setBarcodes(parsed);
        message.success(`${parsed.length} valid barcodes ready for search`);
    };

    const clearInput = () => {
        setInputValue('');
        setBarcodes([]);
        setProducts([]);
        setNotFound([]);
        setSearched(false);
        setSearchStats(null);
        setSearchProgress(0);
    };

    // Enhanced search with progress tracking
    const searchProducts = async () => {
        if (barcodes.length === 0) {
            message.warning('Please add at least one barcode to search');
            return;
        }

        setLoading(true);
        setSearchProgress(0);

        // Simulate progress for user feedback
        const progressInterval = setInterval(() => {
            setSearchProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 15;
            });
        }, 200);

        try {
            const startTime = new Date();

            const response = await axios.post('/api/v1/product/search-by-barcodes', {
                barcodes: barcodes
            });

            clearInterval(progressInterval);
            setSearchProgress(100);

            if (response.data.success) {
                const endTime = new Date();
                const searchTime = ((endTime - startTime) / 1000).toFixed(1);

                setProducts(response.data.data);
                setNotFound(response.data.notFound);
                setSearched(true);

                // Enhanced search statistics
                setSearchStats({
                    totalSearched: barcodes.length,
                    found: response.data.count,
                    notFound: response.data.notFoundCount,
                    fromDatabase: response.data.fromDatabase,
                    newlyFetched: response.data.newlyFetched,
                    searchTime: searchTime,
                    timestamp: response.data.searchTimestamp
                });

                // Enhanced success notification
                notification.success({
                    message: 'Search Completed Successfully',
                    description: (
                        <div>
                            <p>Found <strong>{response.data.count}</strong> products in <strong>{searchTime}s</strong></p>
                            <p>📊 {response.data.fromDatabase} from database, {response.data.newlyFetched} newly fetched</p>
                        </div>
                    ),
                    duration: 5
                });

                if (response.data.notFoundCount > 0) {
                    notification.warning({
                        message: 'Some Barcodes Not Found',
                        description: `${response.data.notFoundCount} barcode(s) could not be found in any source`,
                        duration: 4
                    });
                }
            }
        } catch (error) {
            clearInterval(progressInterval);
            setSearchProgress(0);

            const errorMsg = error.response?.data?.message || 'Failed to search products';

            notification.error({
                message: 'Search Failed',
                description: errorMsg,
                duration: 6
            });

            console.error('Error searching products:', error);
        } finally {
            setLoading(false);
            setTimeout(() => setSearchProgress(0), 1000);
        }
    };

    // Quick single barcode search
    const handleQuickSearch = async (barcode) => {
        if (!barcode.trim()) return;

        setInputValue(barcode);
        setBarcodes([barcode]);

        // Auto-trigger search for single barcode
        try {
            setLoading(true);
            const response = await axios.post('/api/v1/product/search-by-barcodes', {
                barcodes: [barcode]
            });

            if (response.data.success) {
                setProducts(response.data.data);
                setNotFound(response.data.notFound);
                setSearched(true);
                setSearchStats({
                    totalSearched: 1,
                    found: response.data.count,
                    notFound: response.data.notFoundCount,
                    fromDatabase: response.data.fromDatabase,
                    newlyFetched: response.data.newlyFetched,
                    searchTime: '< 1',
                    timestamp: response.data.searchTimestamp
                });
            }
        } catch (error) {
            console.error('Quick search error:', error);
            message.error('Quick search failed');
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        marginBottom: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
    };

    return (
        <div style={styles.mainContainer}>
            {/* Enhanced Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.title(isAdmin)}>
                             Smart Barcode Search
                        </h1>
                        <p style={styles.subtitle}>
                            <BarcodeOutlined style={{ fontSize: '16px' }} />
                            AI-powered product discovery with real-time data enhancement
                        </p>
                    </div>

                    <div style={styles.searchControls}>
                        <div style={styles.quickSearchContainer}>
                            <SearchOutlined style={styles.searchIcon} />
                            <input
                                type="text"
                                style={styles.quickSearchInput}
                                placeholder="Quick single barcode search..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleQuickSearch(e.target.value.trim());
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Search Statistics */}
                {searchStats && (
                    <Card style={{ ...cardStyle, marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Statistic
                                    title="Total Searched"
                                    value={searchStats.totalSearched}
                                    prefix={<BarcodeOutlined />}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Found"
                                    value={searchStats.found}
                                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="From Database"
                                    value={searchStats.fromDatabase}
                                    prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="AI Enhanced"
                                    value={searchStats.newlyFetched}
                                    prefix={<ApiOutlined style={{ color: '#722ed1' }} />}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Col>
                        </Row>
                        <Divider style={{ margin: '16px 0 8px 0' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined /> Search completed in {searchStats.searchTime}s • {new Date(searchStats.timestamp).toLocaleString()}
                        </Text>
                    </Card>
                )}

                <Card style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                <ScanOutlined /> Bulk Barcode Search
                            </Title>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                Enter multiple barcodes for efficient bulk product discovery
                            </Text>
                        </div>
                        {barcodes.length > 0 && (
                            <Badge count={barcodes.length} style={{ backgroundColor: '#52c41a' }}>
                                <Button
                                    icon={<BarcodeOutlined />}
                                    size="small"
                                >
                                    Ready
                                </Button>
                            </Badge>
                        )}
                    </div>

                    {/* Enhanced Input Area */}
                    <TextArea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter barcodes separated by commas, spaces, or new lines...

Examples:
8901234567890
1234567890123, 9876543210987
5901234123457 6901234567890

Supports 8-20 digit barcodes`}
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        style={{
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontFamily: 'monospace',
                            fontSize: '13px'
                        }}
                    />

                    <Space style={{ marginBottom: '16px' }} wrap>
                        <Button
                            type="primary"
                            onClick={parseInput}
                            icon={<ScanOutlined />}
                            disabled={!inputValue.trim()}
                        >
                            Parse & Validate Barcodes
                        </Button>
                        <Button
                            onClick={clearInput}
                            icon={<DeleteOutlined />}
                        >
                            Clear All
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => setInputValue(barcodes.join('\n'))}
                            disabled={barcodes.length === 0}
                        >
                            Reload Parsed
                        </Button>
                    </Space>

                    {/* Enhanced Barcode Display */}
                    {barcodes.length > 0 && (
                        <>
                            <Divider orientation="left">
                                <Space>
                                    Ready for Search
                                    <Badge count={barcodes.length} style={{ backgroundColor: '#1890ff' }} />
                                </Space>
                            </Divider>

                            <div style={{
                                maxHeight: '120px',
                                overflowY: 'auto',
                                marginBottom: '20px',
                                padding: '12px',
                                background: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                }}>
                                    {barcodes.map((code, index) => (
                                        <Tooltip key={index} title={`Barcode ${index + 1}`}>
                                            <div
                                                style={{
                                                    background: '#e6f7ff',
                                                    color: '#1890ff',
                                                    padding: '4px 12px',
                                                    borderRadius: '16px',
                                                    fontSize: '12px',
                                                    fontFamily: 'monospace',
                                                    border: '1px solid #91d5ff',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {code}
                                            </div>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Search Button with Progress */}
                            <div style={{ position: 'relative' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={loading ? <Spin size="small" /> : <SearchOutlined />}
                                    onClick={searchProducts}
                                    loading={loading}
                                    style={{
                                        width: '100%',
                                        height: '50px',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? `Searching ${barcodes.length} Products...` : ` Search ${barcodes.length} Products`}
                                </Button>

                                {loading && searchProgress > 0 && (
                                    <Progress
                                        percent={Math.round(searchProgress)}
                                        size="small"
                                        style={{ marginTop: '8px' }}
                                        status={searchProgress === 100 ? 'success' : 'active'}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* Enhanced Search Results */}
                    {searched && !loading && (
                        <>
                            {notFound.length > 0 && (
                                <Alert
                                    message={`${notFound.length} barcodes not found`}
                                    description={
                                        <div>
                                            <Paragraph style={{ marginBottom: '8px' }}>
                                                The following barcodes could not be found in our database or external sources:
                                            </Paragraph>
                                            <div style={{
                                                maxHeight: '100px',
                                                overflowY: 'auto',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '6px',
                                            }}>
                                                {notFound.map((code, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            background: '#fff2e8',
                                                            color: '#d4380d',
                                                            padding: '4px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontFamily: 'monospace',
                                                            border: '1px solid #ffccc7',
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
                                    icon={<ExclamationCircleOutlined />}
                                    style={{ marginBottom: '20px' }}
                                />
                            )}

                            {products.length > 0 ? (
                                <ProductList products={products} />
                            ) : (
                                <Alert
                                    message="No products found"
                                    description="None of the searched barcodes returned any products. Try with different barcodes or check if they are valid."
                                    type="info"
                                    showIcon
                                    icon={<InfoCircleOutlined />}
                                    action={
                                        <Button size="small" onClick={clearInput}>
                                            Start New Search
                                        </Button>
                                    }
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