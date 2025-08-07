import React from 'react';
import {
    Layout,
    Card,
    Typography,
    Space,
    Button,
    Descriptions,
    Avatar,
    Tag
} from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    CrownOutlined,
    TeamOutlined,
    PhoneOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                background: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                
            </Header>

            <Content style={{ padding: '24px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Card>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar size={80} icon={<UserOutlined />} />
                            <Title level={2} style={{ marginTop: 16 }}>
                                {user?.name}
                            </Title>
                            <Tag
                                color={user?.is_admin ? 'gold' : 'blue'}
                                icon={user?.is_admin ? <CrownOutlined /> : <TeamOutlined />}
                                style={{ fontSize: '14px', padding: '4px 12px' }}
                            >
                                {user?.is_admin ? 'Administrator' : 'Employee'}
                            </Tag>
                        </div>

                        <Descriptions
                            title="Profile Information"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item
                                label={<Space><UserOutlined /> Full Name</Space>}
                            >
                                {user?.name}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<Space><PhoneOutlined /> Phone Number</Space>}
                            >
                                {user?.phoneNumber}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<Space><BankOutlined /> Organization</Space>}
                            >
                                {user?.organization}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<Space><TeamOutlined /> Role</Space>}
                            >
                                <Tag
                                    color={user?.is_admin ? 'gold' : 'blue'}
                                    icon={user?.is_admin ? <CrownOutlined /> : <TeamOutlined />}
                                >
                                    {user?.is_admin ? 'Administrator' : 'Employee'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Status"
                            >
                                <Tag color="green">Active</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* {user?.is_admin && (
                        <Card style={{ marginTop: 24 }}>
                            <Title level={4}>Admin Actions</Title>
                            <Text type="secondary">
                                As an administrator, you have access to additional features.
                            </Text>
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    type="primary"
                                    onClick={() => navigate('/admin')}
                                >
                                    Go to Admin Panel
                                </Button>
                            </div>
                        </Card>
                    )} */}
                </div>
            </Content>
        </Layout>
    );
};

export default Profile;