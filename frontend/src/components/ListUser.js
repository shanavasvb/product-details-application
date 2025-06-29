import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Typography,
    Space,
    message,
    Tag,
    Avatar,
    Input,
    Button,
    Select,
    Popconfirm,
    Modal
} from 'antd';
import {
    UserOutlined,
    CrownOutlined,
    TeamOutlined,
    SearchOutlined,
    ReloadOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('all');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchText, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/admin/list-user');
            if (response.data.success) {
                setUsers(response.data.data);
                message.success(`${response.data.count} approved users loaded`);
            }
        } catch (error) {
            message.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                user.phoneNumber.includes(searchText) ||
                user.organization.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            const isAdmin = roleFilter === 'admin';
            filtered = filtered.filter(user => user.is_admin === isAdmin);
        }

        setFilteredUsers(filtered);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleRoleFilterChange = (value) => {
        setRoleFilter(value);
    };

    const handleRefresh = () => {
        fetchUsers();
        setSearchText('');
        setRoleFilter('all');
    };

    // New function to handle user deletion
    const deleteUser = async (userId, userName) => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`/api/v1/admin/delete-user/${userId}`);
            if (response.data.success) {
                // Update local state by removing the deleted user
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                message.success(`${userName} was deleted successfully`);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete user';
            message.error(errorMsg);
            console.error('Error deleting user:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // New function to show deletion confirmation
    const showDeleteConfirm = (user) => {
        confirm({
            title: `Are you sure you want to delete ${user.name}?`,
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: (
                <div>
                    <p>This action cannot be undone.</p>
                    <p>User details:</p>
                    <ul>
                        <li><strong>Name:</strong> {user.name}</li>
                        <li><strong>Organization:</strong> {user.organization}</li>
                        <li><strong>Role:</strong> {user.is_admin ? 'Admin' : 'Employee'}</li>
                    </ul>
                </div>
            ),
            okText: 'Yes, delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteUser(user._id, user.name);
            },
        });
    };

    const columns = [
        {
            title: 'User Details',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: record.is_admin ? '#faad14' : '#1890ff'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {text}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.phoneNumber}
                        </Text>
                    </div>
                </Space>
            ),
            width: '25%',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
            render: (text) => (
                <Text style={{ fontSize: '13px' }}>{text}</Text>
            ),
            width: '20%',
        },
        {
            title: 'Role',
            dataIndex: 'is_admin',
            key: 'role',
            render: (isAdmin) => (
                <Tag
                    color={isAdmin ? 'gold' : 'blue'}
                    icon={isAdmin ? <CrownOutlined /> : <TeamOutlined />}
                    style={{ fontSize: '12px' }}
                >
                    {isAdmin ? 'Admin' : 'Employee'}
                </Tag>
            ),
            width: '15%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color="green" style={{ fontSize: '12px' }}>
                    Active
                </Tag>
            ),
            width: '15%',
        },
        {
            title: 'Joined Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text style={{ fontSize: '12px' }}>
                    {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            ),
            width: '15%',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => showDeleteConfirm(record)}
                    loading={deleteLoading}
                    disabled={record.is_admin} // Optional: prevent deleting admins
                >
                    Delete
                </Button>
            ),
            width: '10%',
        },
    ];

    const cardStyle = {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px'
    };

    const filterRowStyle = {
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
    };

    const statsStyle = {
        display: 'flex',
        gap: '20px',
        marginBottom: '16px',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e9ecef'
    };

    const statItemStyle = {
        textAlign: 'center'
    };

    const statNumberStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1890ff',
        display: 'block'
    };

    const statLabelStyle = {
        fontSize: '12px',
        color: '#666',
        marginTop: '2px'
    };

    // Calculate statistics
    const totalUsers = users.length;
    const adminCount = users.filter(user => user.is_admin).length;
    const employeeCount = totalUsers - adminCount;

    return (
        <Card style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                        Active Users Directory
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        All approved users in the system
                    </Text>
                </div>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading}
                    style={{ borderRadius: '6px' }}
                >
                    Refresh
                </Button>
            </div>

            {/* Statistics Row */}
            <div style={statsStyle}>
                <div style={statItemStyle}>
                    <span style={statNumberStyle}>{totalUsers}</span>
                    <div style={statLabelStyle}>Total Users</div>
                </div>
                <div style={statItemStyle}>
                    <span style={statNumberStyle}>{adminCount}</span>
                    <div style={statLabelStyle}>Admins</div>
                </div>
                <div style={statItemStyle}>
                    <span style={statNumberStyle}>{employeeCount}</span>
                    <div style={statLabelStyle}>Employees</div>
                </div>
            </div>

            {/* Filter Controls */}
            <div style={filterRowStyle}>
                <Search
                    placeholder="Search by name, phone, or organization"
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="middle"
                    onSearch={handleSearch}
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                    style={{
                        width: '300px',
                        borderRadius: '6px'
                    }}
                />
                <Select
                    value={roleFilter}
                    onChange={handleRoleFilterChange}
                    style={{ width: '120px' }}
                    size="middle"
                >
                    <Option value="all">All Roles</Option>
                    <Option value="admin">Admins</Option>
                    <Option value="employee">Employees</Option>
                </Select>
            </div>

            {/* Users Table */}
            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} users`,
                    pageSizeOptions: ['10', '20', '50', '100']
                }}
                locale={{
                    emptyText: searchText || roleFilter !== 'all'
                        ? 'No users match your search criteria'
                        : 'No active users found'
                }}
                size="middle"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '6px'
                }}
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

export default ListUser;