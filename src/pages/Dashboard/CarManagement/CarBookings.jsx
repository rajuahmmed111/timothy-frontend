import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, Input, Space, Tag } from "antd";
import { SearchOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const CarBookings = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const bookings = [
        {
            id: 1,
            bookingId: "CR001",
            customer: "John Doe",
            carModel: "Toyota Camry",
            pickupDate: "2025-09-15",
            returnDate: "2025-09-17",
            status: "Confirmed",
            amount: 580,
            image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            bookingId: "CR002",
            customer: "Jane Smith",
            carModel: "BMW X5",
            pickupDate: "2025-09-18",
            returnDate: "2025-09-20",
            status: "Pending",
            amount: 850,
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            bookingId: "CR003",
            customer: "Michael Johnson",
            carModel: "Honda Civic",
            pickupDate: "2025-09-21",
            returnDate: "2025-09-24",
            status: "Cancelled",
            amount: 450,
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 4,
            bookingId: "CR004",
            customer: "Emily Davis",
            carModel: "Mercedes-Benz S-Class",
            pickupDate: "2025-09-22",
            returnDate: "2025-09-25",
            status: "Confirmed",
            amount: 1200,
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 5,
            bookingId: "CR005",
            customer: "William Brown",
            carModel: "Nissan Sentra",
            pickupDate: "2025-09-25",
            returnDate: "2025-09-27",
            status: "Pending",
            amount: 320,
            image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 6,
            bookingId: "CR006",
            customer: "Sophia Wilson",
            carModel: "Audi A4",
            pickupDate: "2025-09-26",
            returnDate: "2025-09-29",
            status: "Confirmed",
            amount: 980,
            image: "https://images.unsplash.com/photo-1606016159991-8b61b1c5a5b6?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 7,
            bookingId: "CR007",
            customer: "James Anderson",
            carModel: "Lamborghini Huracan",
            pickupDate: "2025-09-28",
            returnDate: "2025-10-01",
            status: "Pending",
            amount: 1500,
            image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 8,
            bookingId: "CR008",
            customer: "Olivia Taylor",
            carModel: "Tesla Model 3",
            pickupDate: "2025-09-29",
            returnDate: "2025-10-02",
            status: "Confirmed",
            amount: 780,
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 9,
            bookingId: "CR009",
            customer: "Benjamin Martinez",
            carModel: "Ford Explorer",
            pickupDate: "2025-10-01",
            returnDate: "2025-10-04",
            status: "Cancelled",
            amount: 900,
            image: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 10,
            bookingId: "CR010",
            customer: "Charlotte Moore",
            carModel: "Porsche 911",
            pickupDate: "2025-10-03",
            returnDate: "2025-10-06",
            status: "Confirmed",
            amount: 2100,
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
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
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "CarModel",
            dataIndex: "carModel",
            key: "carModel",
        },
        {
            title: "Pickup Date",
            dataIndex: "pickupDate",
            key: "pickupDate",
        },
        {
            title: "Return Date",
            dataIndex: "returnDate",
            key: "returnDate",
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
                title="Car Rental Booking Details"
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
                            alt="Car"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Booking ID</p>
                                <p className="font-medium">{selectedBooking.bookingId}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Customer</p>
                                <p className="font-medium">{selectedBooking.customer}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Car Model</p>
                                <p className="font-medium">{selectedBooking.carModel}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Status</p>
                                <Tag color={selectedBooking.status === "Confirmed" ? "green" : selectedBooking.status === "Cancelled" ? "red" : "orange"}>
                                    {selectedBooking.status}
                                </Tag>
                            </div>
                            <div>
                                <p className="text-gray-600">Pickup Date</p>
                                <p className="font-medium">{selectedBooking.pickupDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Return Date</p>
                                <p className="font-medium">{selectedBooking.returnDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Total Amount</p>
                                <p className="font-medium">${selectedBooking.amount}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Rental Duration</p>
                                <p className="font-medium">
                                    {Math.ceil((new Date(selectedBooking.returnDate) - new Date(selectedBooking.pickupDate)) / (1000 * 60 * 60 * 24))} days
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CarBookings;