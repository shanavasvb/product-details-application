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
    Divider,
    Checkbox,
    message,
    Affix
} from 'antd';
import {
    EyeOutlined,
    SyncOutlined,
    BarcodeOutlined,
    TagOutlined,
    AppstoreOutlined,
    ShopOutlined,
    InboxOutlined,
    DatabaseOutlined,
    SelectOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const ProductList = ({ products }) => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [fullProductDetails, setFullProductDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    // New state for bulk selection
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

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

    // Handle individual product selection
    const handleProductSelect = (product, checked) => {
        if (checked) {
            setSelectedProducts(prev => [...prev, product]);
        } else {
            setSelectedProducts(prev => prev.filter(p => p._id !== product._id));
        }
    };

    // Handle select all functionality
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedProducts([...products]);
        } else {
            setSelectedProducts([]);
        }
    };

    // Handle bulk sync
    const handleBulkSync = async () => {
        if (selectedProducts.length === 0) {
            message.warning('Please select at least one product to sync');
            return;
        }

        setSyncLoading(true);

        try {
            // Replace this with your actual sync API call
            // const response = await axios.post('/api/v1/products/bulk-sync', {
            //     productIds: selectedProducts.map(p => p._id)
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            message.success(`Successfully synced ${selectedProducts.length} product(s) to database`);

            // Clear selection after successful sync
            setSelectedProducts([]);
            setSelectMode(false);

        } catch (error) {
            console.error('Error syncing products:', error);
            message.error('Failed to sync products to database');
        } finally {
            setSyncLoading(false);
        }
    };

    const handleCloseModal = () => {
        setDetailModalVisible(false);
        setSelectedProduct(null);
        setFullProductDetails(null);
    };

    const toggleSelectMode = () => {
        setSelectMode(!selectMode);
        if (selectMode) {
            setSelectedProducts([]);
        }
    };

    const isProductSelected = (product) => {
        return selectedProducts.some(p => p._id === product._id);
    };

    return (
        <>
            {/* Bulk Action Controls */}
            <div style={{
                marginBottom: 16,
                padding: '12px 16px',
                background: '#fafafa',
                borderRadius: '6px',
                border: '1px solid #e8e8e8'
            }}>
                <Space wrap>
                    <Button
                        type={selectMode ? "primary" : "default"}
                        icon={<SelectOutlined />}
                        onClick={toggleSelectMode}
                    >
                        {selectMode ? 'Cancel Selection' : 'Select Products'}
                    </Button>

                    {selectMode && (
                        <>
                            <Checkbox
                                indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                                checked={selectedProducts.length === products.length && products.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            >
                                Select All ({selectedProducts.length}/{products.length})
                            </Checkbox>

                            <Button
                                type="primary"
                                icon={<DatabaseOutlined />}
                                loading={syncLoading}
                                disabled={selectedProducts.length === 0}
                                onClick={handleBulkSync}
                            >
                                Sync {selectedProducts.length > 0 ? `(${selectedProducts.length})` : ''} to Database
                            </Button>
                        </>
                    )}
                </Space>
            </div>

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
                            hoverable={!selectMode}
                            style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: selectMode && isProductSelected(product) ? '2px solid #1890ff' : undefined,
                                position: 'relative'
                            }}
                            cover={
                                <div style={{ position: 'relative' }}>
                                    {selectMode && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            zIndex: 1,
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '4px',
                                            padding: '4px'
                                        }}>
                                            <Checkbox
                                                checked={isProductSelected(product)}
                                                onChange={(e) => handleProductSelect(product, e.target.checked)}
                                            />
                                        </div>
                                    )}
                                    {product.imageUrl ? (
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
                                    )}
                                </div>
                            }
                            onClick={selectMode ? () => handleProductSelect(product, !isProductSelected(product)) : undefined}
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

                                    {!selectMode && (
                                        <Button
                                            type="primary"
                                            icon={<EyeOutlined />}
                                            block
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                showProductDetails(product);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    )}
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            {/* Floating Action Button for Sync (Alternative UI) */}
            {selectMode && selectedProducts.length > 0 && (
                <Affix offsetBottom={24}>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<DatabaseOutlined />}
                            loading={syncLoading}
                            onClick={handleBulkSync}
                            style={{
                                borderRadius: '24px',
                                padding: '8px 24px',
                                height: 'auto',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            Sync {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} to Database
                        </Button>
                    </div>
                </Affix>
            )}

            {/* Product Detail Modal - Sync button removed */}
            <Modal
                title={selectedProduct?.name}
                open={detailModalVisible}
                onCancel={handleCloseModal}
                width={800}
                footer={[
                    <Button key="back" onClick={handleCloseModal}>
                        Close
                    </Button>
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
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIOJf0rOHY0WPP6OUoKN8nnw4CjoWD7MAaTn0ABOxx/9MYJpAAAAAASUVORK5CYII="
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