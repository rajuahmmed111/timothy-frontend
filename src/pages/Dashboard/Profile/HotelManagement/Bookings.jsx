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
        {
            id: 3,
            bookingId: "BK003",
            guest: "Michael Johnson",
            room: "Superior Room",
            checkIn: "2025-09-21",
            checkOut: "2025-09-24",
            status: "Cancelled",
            amount: 450,
            image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101b?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 4,
            bookingId: "BK004",
            guest: "Emily Davis",
            room: "Presidential Suite",
            checkIn: "2025-09-22",
            checkOut: "2025-09-25",
            status: "Confirmed",
            amount: 1200,
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 5,
            bookingId: "BK005",
            guest: "William Brown",
            room: "Standard Room",
            checkIn: "2025-09-25",
            checkOut: "2025-09-27",
            status: "Pending",
            amount: 320,
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 6,
            bookingId: "BK006",
            guest: "Sophia Wilson",
            room: "Honeymoon Suite",
            checkIn: "2025-09-26",
            checkOut: "2025-09-29",
            status: "Confirmed",
            amount: 980,
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 7,
            bookingId: "BK007",
            guest: "James Anderson",
            room: "Luxury Villa",
            checkIn: "2025-09-28",
            checkOut: "2025-10-01",
            status: "Pending",
            amount: 1500,
            image: "https://images.unsplash.com/photo-1560185127-6ed189bf02e2?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 8,
            bookingId: "BK008",
            guest: "Olivia Taylor",
            room: "Ocean View Room",
            checkIn: "2025-09-29",
            checkOut: "2025-10-02",
            status: "Confirmed",
            amount: 780,
            image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 9,
            bookingId: "BK009",
            guest: "Benjamin Martinez",
            room: "Family Suite",
            checkIn: "2025-10-01",
            checkOut: "2025-10-04",
            status: "Cancelled",
            amount: 900,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 10,
            bookingId: "BK010",
            guest: "Charlotte Moore",
            room: "Penthouse",
            checkIn: "2025-10-03",
            checkOut: "2025-10-06",
            status: "Confirmed",
            amount: 2100,
            image: "https://images.unsplash.com/photo-1617093727343-37302d457f53?auto=format&fit=crop&w=600&q=80"
        }
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
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => showViewModal(record)}
                />
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-5 flex justify-end items-center ">
                <div className="space-y-2 w-[400px]">
                    <input
                        type="text"
                        placeholder="Search bookings"
                        className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                    />
                </div>
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