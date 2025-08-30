import React from 'react';
import { Table, Tag, Button, Space, Input } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const Bookings = () => {
    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Guest',
            dataIndex: 'guest',
            key: 'guest',
        },
        {
            title: 'Check-in',
            dataIndex: 'checkIn',
            key: 'checkIn',
        },
        {
            title: 'Check-out',
            dataIndex: 'checkOut',
            key: 'checkOut',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Confirmed' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} type="link">View</Button>
                    <Button icon={<CheckCircleOutlined />} type="link">Check-in</Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            id: 'B001',
            guest: 'John Doe',
            checkIn: '2025-09-15',
            checkOut: '2025-09-17',
            status: 'Confirmed',
            amount: '$250',
        },
        // Add more booking data...
    ];

    return (
        <div>
            <div className="mb-4">
                <Search
                    placeholder="Search bookings..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default Bookings;