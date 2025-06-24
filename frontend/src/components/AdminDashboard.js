import React, { useState, useEffect } from 'react';
import {
    Layout,
    Card,
    Table,
    Button,
    Typography,
    Space,
    message,
    Tag,
    Popconfirm,
    Avatar,
    Tabs
} from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    CheckOutlined,
    CloseOutlined,
    CrownOutlined,
    TeamOutlined,
    UserAddOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ListUser from './ListUser'; // Import the new component

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingUsers();
        }
    }, [activeTab]);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/auth/pending-users');
            if (response.data.success) {
                setPendingUsers(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch pending users');
        }
        setLoading(false);
    };

    const handleApprove = async (userId) => {
        try {
            const response = await axios.patch(`/api/v1/auth/approve-user/${userId}`);
            if (response.data.success) {
                message.success('User approved successfully');
                fetchPendingUsers();
            }
        } catch (error) {
            message.error('Failed to approve user');
        }
    };

    const handleReject = async (userId) => {
        try {
            const response = await axios.delete(`/api/v1/auth/reject-user/${userId}`);
            if (response.data.success) {
                message.success('User rejected successfully');
                fetchPendingUsers();
            }
        } catch (error) {
            message.error('Failed to reject user');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div>{text}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.phoneNumber}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Role',
            dataIndex: 'is_admin',
            key: 'role',
            render: (isAdmin) => (
                <Tag
                    color={isAdmin ? 'gold' : 'blue'}
                    icon={isAdmin ? <CrownOutlined /> : <TeamOutlined />}
                >
                    {isAdmin ? 'Admin' : 'Employee'}
                </Tag>
            ),
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Are you sure you want to approve this user?"
                        onConfirm={() => handleApprove(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                        >
                            Approve
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure you want to reject this user?"
                        onConfirm={() => handleReject(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<CloseOutlined />}
                            size="small"
                        >
                            Reject
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const headerStyle = {
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const contentStyle = {
        padding: '24px',
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)'
    };

    const tabStyle = {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={headerStyle}>
                <div>
                    <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                        Admin Dashboard
                    </Title>
                </div>
                <Space>
                    <Text>Welcome, {user?.name}</Text>
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Space>
            </Header>

            <Content style={contentStyle}>
                <div style={tabStyle}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        size="large"
                        tabBarStyle={{ marginBottom: '24px' }}
                    >
                        <TabPane
                            tab={
                                <span>
                                    <UserAddOutlined />
                                    Pending Approvals
                                    {pendingUsers.length > 0 && (
                                        <Tag
                                            color="orange"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            {pendingUsers.length}
                                        </Tag>
                                    )}
                                </span>
                            }
                            key="pending"
                        >
                            <Card style={{ border: 'none', boxShadow: 'none' }}>
                                <div style={{ marginBottom: 16 }}>
                                    <Title level={4}>Pending User Approvals</Title>
                                    <Text type="secondary">
                                        Review and approve/reject user registration requests
                                    </Text>
                                </div>

                                <Table
                                    columns={columns}
                                    dataSource={pendingUsers}
                                    rowKey="_id"
                                    loading={loading}
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total) => `Total ${total} users`,
                                    }}
                                    locale={{
                                        emptyText: 'No pending users found'
                                    }}
                                />
                            </Card>
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                                    <UsergroupAddOutlined />
                                    Active Users
                                </span>
                            }
                            key="active"
                        >
                            <ListUser />
                        </TabPane>
                    </Tabs>
                </div>
            </Content>
        </Layout>
    );
};

export default AdminDashboard;