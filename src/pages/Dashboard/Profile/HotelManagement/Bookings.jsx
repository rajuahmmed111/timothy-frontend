import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, Input, Space, Tag } from "antd";
import { SearchOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const Bookings = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const bookings = [
        {
            id: 1,
            bookingId: "BK001",
            guest: "John Doe",
            room: "Deluxe Room",
            checkIn: "2025-09-15",
            checkOut: "2025-09-17",
            status: "Confirmed",
            amount: 580,
            image: "https://images.unsplash.com/photo-1582719471384-894e3a485cf8?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            bookingId: "BK002",
            guest: "Jane Smith",
            room: "Executive Suite",
            checkIn: "2025-09-18",
            checkOut: "2025-09-20",
            status: "Pending",
            amount: 850,
            image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80"
        },
        // Add more booking data...
    ];

    const showViewModal = (booking) => {
        setSelectedBooking(booking);
        setIsViewModalOpen(true);
    };

    const columns = [
        {
            title: "No",
            key: "no",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Booking ID",
            dataIndex: "bookingId",
            key: "bookingId",
        },
        {
            title: "Guest",
            dataIndex: "guest",
            key: "guest",
        },
        {
            title: "Room",
            dataIndex: "room",
            key: "room",
        },
        {
            title: "Check-in",
            dataIndex: "checkIn",
            key: "checkIn",
        },
        {
            title: "Check-out",
            dataIndex: "checkOut",
            key: "checkOut",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "Confirmed" ? "green" : "orange"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${amount}`,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => showViewModal(record)}
                    />
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => console.log("Check-in:", record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-4">
                <Search
                    placeholder="Search bookings..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: "#3b82f6",
                            headerColor: "white",
                            cellFontSize: 16,
                        },
                        Pagination: {
                            colorPrimary: "#3b82f6",
                        },
                    },
                }}
            >
                <Table
                    rowKey="id"
                    dataSource={bookings}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            </ConfigProvider>

            {/* View Modal */}
            <Modal
                title="Booking Details"
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalOpen(false)}>
                        Close
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <div className="space-y-4">
                        <img
                            src={selectedBooking.image}
                            alt="Room"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Booking ID</p>
                                <p className="font-medium">{selectedBooking.bookingId}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Guest</p>
                                <p className="font-medium">{selectedBooking.guest}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Room</p>
                                <p className="font-medium">{selectedBooking.room}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Status</p>
                                <Tag color={selectedBooking.status === "Confirmed" ? "green" : "orange"}>
                                    {selectedBooking.status}
                                </Tag>
                            </div>
                            <div>
                                <p className="text-gray-600">Check-in</p>
                                <p className="font-medium">{selectedBooking.checkIn}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Check-out</p>
                                <p className="font-medium">{selectedBooking.checkOut}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Amount</p>
                                <p className="font-medium">${selectedBooking.amount}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Bookings;