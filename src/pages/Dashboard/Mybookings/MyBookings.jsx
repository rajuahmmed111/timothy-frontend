import React, { useState } from "react";
import { Table, Tag, Button, Space, Input, Select, DatePicker, Modal, Descriptions, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { Calendar, MapPin, Users, Clock, CreditCard } from "lucide-react";
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function MyBookings() {
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedService, setSelectedService] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Sample booking data
    const bookingsData = [
        {
            key: '1',
            bookingId: 'HTL001234',
            service: 'Hotel',
            title: 'Grand Plaza Hotel Dubai',
            location: 'Dubai, UAE',
            bookingDate: '2024-08-15',
            checkIn: '2024-09-20',
            checkOut: '2024-09-25',
            guests: 2,
            rooms: 1,
            status: 'confirmed',
            amount: 1250.00,
            paymentStatus: 'paid',
            paymentMethod: '**** 4532',
            contact: '+971 4 123 4567',
            amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa'],
            cancellationPolicy: 'Free cancellation until 24 hours before check-in'
        },
        {
            key: '2',
            bookingId: 'CAR005678',
            service: 'Car Rental',
            title: 'BMW X5 - Premium SUV',
            location: 'Dubai International Airport',
            bookingDate: '2024-08-20',
            checkIn: '2024-09-15',
            checkOut: '2024-09-18',
            guests: 4,
            status: 'confirmed',
            amount: 450.00,
            paymentStatus: 'paid',
            paymentMethod: '**** 8901',
            contact: '+971 4 987 6543',
            features: ['GPS Navigation', 'Bluetooth', 'AC', 'Insurance'],
            fuelPolicy: 'Full to Full'
        },
        {
            key: '3',
            bookingId: 'EVT009876',
            service: 'Event',
            title: 'Burj Khalifa: Floors 124 & 125',
            location: 'Downtown Dubai, UAE',
            bookingDate: '2024-08-25',
            checkIn: '2024-09-10',
            checkOut: '2024-09-10',
            guests: 3,
            status: 'pending',
            amount: 1850.00,
            paymentStatus: 'pending',
            paymentMethod: '**** 2345',
            contact: '+971 4 555 0123',
            timeSlot: '18:00 - 20:00',
            includes: ['Fast Track Entry', 'Observation Deck Access', 'Refreshments']
        },
        {
            key: '4',
            bookingId: 'SEC012345',
            service: 'Security',
            title: 'Personal Security Service',
            location: 'Dubai Marina',
            bookingDate: '2024-08-10',
            checkIn: '2024-09-05',
            checkOut: '2024-09-07',
            guests: 1,
            status: 'completed',
            amount: 2400.00,
            paymentStatus: 'paid',
            paymentMethod: '**** 4532',
            contact: '+971 4 321 9876',
            duration: '48 hours',
            securityLevel: 'Premium'
        },
        {
            key: '5',
            bookingId: 'HTL567890',
            service: 'Hotel',
            title: 'Atlantis The Palm',
            location: 'Palm Jumeirah, Dubai',
            bookingDate: '2024-07-30',
            checkIn: '2024-08-15',
            checkOut: '2024-08-20',
            guests: 4,
            rooms: 2,
            status: 'cancelled',
            amount: 3200.00,
            paymentStatus: 'refunded',
            paymentMethod: '**** 8901',
            contact: '+971 4 426 2000',
            cancellationReason: 'Travel plans changed',
            refundAmount: 2880.00
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            confirmed: 'green',
            pending: 'orange',
            completed: 'blue',
            cancelled: 'red'
        };
        return colors[status] || 'default';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            paid: 'green',
            pending: 'orange',
            refunded: 'blue',
            failed: 'red'
        };
        return colors[status] || 'default';
    };

    const getServiceIcon = (service) => {
        const icons = {
            Hotel: '🏨',
            'Car Rental': '🚗',
            Event: '🎫',
            Security: '🛡️'
        };
        return icons[service] || '📋';
    };

    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
            width: 120,
            render: (text) => <span className="font-mono font-medium">{text}</span>,
            sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
            width: 100,
            render: (service) => (
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getServiceIcon(service)}</span>
                    <span>{service}</span>
                </div>
            ),
            filters: [
                { text: 'Hotel', value: 'Hotel' },
                { text: 'Car Rental', value: 'Car Rental' },
                { text: 'Event', value: 'Event' },
                { text: 'Security', value: 'Security' },
            ],
            onFilter: (value, record) => record.service === value,
        },
        {
            title: 'Title & Location',
            key: 'titleLocation',
            render: (_, record) => (
                <div>
                    <div className="font-medium text-gray-900">{record.title}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {record.location}
                    </div>
                </div>
            ),
        },
        {
            title: 'Dates',
            key: 'dates',
            render: (_, record) => (
                <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        <span className="font-medium">Check-in:</span>
                    </div>
                    <div className="text-gray-600 mb-2">{dayjs(record.checkIn).format('MMM DD, YYYY')}</div>
                    <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-red-500" />
                        <span className="font-medium">Check-out:</span>
                    </div>
                    <div className="text-gray-600">{dayjs(record.checkOut).format('MMM DD, YYYY')}</div>
                </div>
            ),
            sorter: (a, b) => dayjs(a.checkIn).unix() - dayjs(b.checkIn).unix(),
        },
        {
            title: 'Guests',
            dataIndex: 'guests',
            key: 'guests',
            width: 80,
            render: (guests, record) => (
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{guests}</span>
                    {record.rooms && <span className="text-gray-500">({record.rooms} room{record.rooms > 1 ? 's' : ''})</span>}
                </div>
            ),
            sorter: (a, b) => a.guests - b.guests,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)} className="capitalize">
                    {status}
                </Tag>
            ),
            filters: [
                { text: 'Confirmed', value: 'confirmed' },
                { text: 'Pending', value: 'pending' },
                { text: 'Completed', value: 'completed' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (amount, record) => (
                <div>
                    <div className="font-medium">${amount.toFixed(2)}</div>
                    <Tag color={getPaymentStatusColor(record.paymentStatus)} size="small">
                        {record.paymentStatus}
                    </Tag>
                </div>
            ),
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => showBookingDetails(record)}
                    >
                        View
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => downloadReceipt(record)}
                    >
                        Receipt
                    </Button>
                </Space>
            ),
        },
    ];

    const showBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const downloadReceipt = (booking) => {
        // Simulate receipt download
        console.log('Downloading receipt for booking:', booking.bookingId);
        alert(`Receipt for booking ${booking.bookingId} will be downloaded.`);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    const filteredData = bookingsData.filter(booking => {
        const matchesSearch = booking.title.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.bookingId.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.location.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
        const matchesService = selectedService === 'all' || booking.service === selectedService;

        let matchesDate = true;
        if (dateRange && dateRange.length === 2) {
            const bookingDate = dayjs(booking.checkIn);
            matchesDate = bookingDate.isAfter(dateRange[0]) && bookingDate.isBefore(dateRange[1]);
        }

        return matchesSearch && matchesStatus && matchesService && matchesDate;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Summary Stats */}
            <div className="mt-10 container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{bookingsData.filter(b => b.status === 'confirmed').length}</div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{bookingsData.filter(b => b.status === 'pending').length}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{bookingsData.filter(b => b.status === 'completed').length}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{bookingsData.reduce((sum, b) => sum + b.amount, 0).toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Total Spent ($)</div>
                </div>
            </div>
            <div className="container mx-auto mt-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">View and manage all your reservations</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            placeholder="Search bookings..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                        <Select
                            placeholder="Filter by status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="confirmed">Confirmed</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                        <Select
                            placeholder="Filter by service"
                            value={selectedService}
                            onChange={setSelectedService}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">All Services</Option>
                            <Option value="Hotel">Hotel</Option>
                            <Option value="Car Rental">Car Rental</Option>
                            <Option value="Event">Event</Option>
                            <Option value="Security">Security</Option>
                        </Select>
                        <RangePicker
                            placeholder={['Start Date', 'End Date']}
                            value={dateRange}
                            onChange={setDateRange}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
                        }}
                        scroll={{ x: 1200 }}
                        className="custom-table"
                    />
                </div>

                {/* Booking Details Modal */}
                <Modal
                    title={`Booking Details - ${selectedBooking?.bookingId}`}
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={[
                        <Button key="close" onClick={handleModalClose}>
                            Close
                        </Button>,
                        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => downloadReceipt(selectedBooking)}>
                            Download Receipt
                        </Button>,
                    ]}
                    width={800}
                >
                    {selectedBooking && (
                        <div className="space-y-6">
                            <Descriptions title="Booking Information" bordered column={2}>
                                <Descriptions.Item label="Service" span={1}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{getServiceIcon(selectedBooking.service)}</span>
                                        {selectedBooking.service}
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Status" span={1}>
                                    <Tag color={getStatusColor(selectedBooking.status)} className="capitalize">
                                        {selectedBooking.status}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Title" span={2}>
                                    {selectedBooking.title}
                                </Descriptions.Item>
                                <Descriptions.Item label="Location" span={2}>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {selectedBooking.location}
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Check-in">
                                    {dayjs(selectedBooking.checkIn).format('MMMM DD, YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Check-out">
                                    {dayjs(selectedBooking.checkOut).format('MMMM DD, YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Guests">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {selectedBooking.guests} guest{selectedBooking.guests > 1 ? 's' : ''}
                                        {selectedBooking.rooms && ` • ${selectedBooking.rooms} room${selectedBooking.rooms > 1 ? 's' : ''}`}
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Contact">
                                    {selectedBooking.contact}
                                </Descriptions.Item>
                                <Descriptions.Item label="Amount">
                                    <span className="text-lg font-semibold">${selectedBooking.amount.toFixed(2)}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Status">
                                    <Tag color={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                                        {selectedBooking.paymentStatus}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Method" span={2}>
                                    <div className="flex items-center gap-1">
                                        <CreditCard className="w-4 h-4" />
                                        {selectedBooking.paymentMethod}
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>

                            {/* Additional Details based on service type */}
                            {selectedBooking.amenities && (
                                <div>
                                    <h4 className="font-semibold mb-2">Amenities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedBooking.amenities.map((amenity, index) => (
                                            <Tag key={index} color="blue">{amenity}</Tag>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedBooking.features && (
                                <div>
                                    <h4 className="font-semibold mb-2">Features</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedBooking.features.map((feature, index) => (
                                            <Tag key={index} color="green">{feature}</Tag>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedBooking.includes && (
                                <div>
                                    <h4 className="font-semibold mb-2">Includes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedBooking.includes.map((item, index) => (
                                            <Tag key={index} color="purple">{item}</Tag>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedBooking.timeSlot && (
                                <div>
                                    <h4 className="font-semibold mb-2">Time Slot</h4>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {selectedBooking.timeSlot}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

            </div>
        </div>
    );
}
