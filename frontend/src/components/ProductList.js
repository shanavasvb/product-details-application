import React, { useState } from 'react';
import {
    List,
    Card,
    Typography,
    Space,
    Button,
    Modal,
    Descriptions,
    Image,
    Spin,
    Tag,
    Divider
} from 'antd';
import {
    EyeOutlined,
    SyncOutlined,
    BarcodeOutlined,
    TagOutlined,
    AppstoreOutlined,
    ShopOutlined,
    InboxOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const ProductList = ({ products }) => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [fullProductDetails, setFullProductDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    const showProductDetails = async (product) => {
        setSelectedProduct(product);
        setDetailModalVisible(true);
        setLoading(true);

        try {
            const response = await axios.get(`/api/v1/product/details/${product._id}`);
            if (response.data.success) {
                setFullProductDetails(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = (product) => {
        setSyncLoading(true);

        // This is a placeholder for the sync functionality
        setTimeout(() => {
            setSyncLoading(false);
            Modal.success({
                title: 'Sync Placeholder',
                content: (
                    <div>
                        <p>This is a placeholder for the sync functionality.</p>
                        <p>Product "{product.name}" would be synced to database.</p>
                    </div>
                ),
            });
        }, 1500);
    };

    const handleCloseModal = () => {
        setDetailModalVisible(false);
        setSelectedProduct(null);
        setFullProductDetails(null);
    };

    return (
        <>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 4,
                }}
                dataSource={products}
                renderItem={(product) => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}
                            cover={
                                product.imageUrl ? (
                                    <div style={{
                                        height: '200px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#f5f5f5'
                                    }}>
                                        <img
                                            alt={product.name}
                                            src={product.imageUrl}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{
                                        height: '200px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#f5f5f5'
                                    }}>
                                        <InboxOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                                    </div>
                                )
                            }
                        >
                            <div>
                                <Space direction="vertical" style={{ width: '100%' }} size={1}>
                                    {product.barcode && (
                                        <Space>
                                            <BarcodeOutlined style={{ color: '#8c8c8c' }} />
                                            <Text type="secondary" style={{ fontSize: '12px' }}>{product.barcode}</Text>
                                        </Space>
                                    )}

                                    <Title level={5} ellipsis={{ rows: 2 }} style={{ marginTop: 0, marginBottom: '8px', height: '44px' }}>
                                        {product.name}
                                    </Title>

                                    {product.category && (
                                        <div>
                                            <Tag color="blue" icon={<AppstoreOutlined />}>
                                                {product.category.name || 'Category'}
                                            </Tag>
                                        </div>
                                    )}

                                    <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '13px', color: '#595959', height: '42px' }}>
                                        {product.description || 'No description available'}
                                    </Paragraph>

                                    <Button
                                        type="primary"
                                        icon={<EyeOutlined />}
                                        block
                                        onClick={() => showProductDetails(product)}
                                    >
                                        View Details
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            {/* Product Detail Modal */}
            <Modal
                title={selectedProduct?.name}
                open={detailModalVisible}
                onCancel={handleCloseModal}
                width={800}
                footer={[
                    <Button key="back" onClick={handleCloseModal}>
                        Close
                    </Button>,
                    <Button
                        key="sync"
                        type="primary"
                        icon={<SyncOutlined />}
                        loading={syncLoading}
                        onClick={() => handleSync(selectedProduct)}
                    >
                        Sync to Database
                    </Button>,
                ]}
            >
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: '16px' }}>Loading product details...</div>
                    </div>
                ) : fullProductDetails ? (
                    <div style={{ maxHeight: '60vh', overflow: 'auto', padding: '0 4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            {fullProductDetails.imageUrl ? (
                                <Image
                                    width={200}
                                    src={fullProductDetails.imageUrl}
                                    alt={fullProductDetails.name}
                                    style={{ objectFit: 'contain' }}
                                    fallback="data:image/png;base64,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"
                                />
                            ) : (
                                <div style={{
                                    width: 200,
                                    height: 200,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: '#f5f5f5',
                                    borderRadius: '4px'
                                }}>
                                    <InboxOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                                </div>
                            )}
                        </div>

                        <Descriptions
                            bordered
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                            size="small"
                        >
                            <Descriptions.Item label="Product Name" span={2}>
                                {fullProductDetails.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Barcode">
                                <Space>
                                    <BarcodeOutlined />
                                    {fullProductDetails.barcode || 'N/A'}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="SKU">
                                {fullProductDetails.sku || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Category" span={2}>
                                {fullProductDetails.category?.name || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Brand">
                                <Space>
                                    <ShopOutlined />
                                    {fullProductDetails.brand?.name || 'N/A'}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Product Line">
                                {fullProductDetails.productLine?.name || 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Description</Divider>
                        <Paragraph>
                            {fullProductDetails.description || 'No description available'}
                        </Paragraph>

                        {fullProductDetails.specifications && Object.keys(fullProductDetails.specifications).length > 0 && (
                            <>
                                <Divider orientation="left">Specifications</Divider>
                                <Descriptions
                                    bordered
                                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                                    size="small"
                                >
                                    {Object.entries(fullProductDetails.specifications).map(([key, value]) => (
                                        <Descriptions.Item key={key} label={key}>
                                            {value}
                                        </Descriptions.Item>
                                    ))}
                                </Descriptions>
                            </>
                        )}

                        {fullProductDetails.features && fullProductDetails.features.length > 0 && (
                            <>
                                <Divider orientation="left">Features</Divider>
                                <List
                                    bordered
                                    dataSource={fullProductDetails.features}
                                    renderItem={item => (
                                        <List.Item>
                                            <TagOutlined style={{ marginRight: 8 }} /> {item}
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Text type="secondary">No detailed information available</Text>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ProductList;