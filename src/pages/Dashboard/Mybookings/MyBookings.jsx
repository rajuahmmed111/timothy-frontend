import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Descriptions,
} from "antd";
import { Tabs } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Calendar, MapPin, Users, Clock, CreditCard } from "lucide-react";
import dayjs from "dayjs";
import {
  useGetAllAttractionBookingQuery,
  useGetAllCarBookingQuery,
  useGetAllHotelBookingQuery,
  useGetAllSecurityBookingQuery,
} from "../../../redux/api/userDashboard/myBooking";

const { Option } = Select;

export default function MyBookings() {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedService, setSelectedService] = useState("Car Rental");
  const [activeTab, setActiveTab] = useState("car");

  const TAB_TO_SERVICE = {
    car: "Car Rental",
    stay: "Hotel",
    security: "Security",
    attraction: "Event",
  };

  useEffect(() => {
    setSelectedService(TAB_TO_SERVICE[activeTab]);
  }, [activeTab]);
  const [dateRange, setDateRange] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: hotelData,
    isLoading: isHotelLoading,
    isError: isHotelError,
  } = useGetAllHotelBookingQuery();

  const {
    data: securityData,
    isLoading: isSecurityLoading,
    isError: isSecurityError,
  } = useGetAllSecurityBookingQuery();

  const {
    data: carData,
    isLoading: isCarLoading,
    isError: isCarError,
  } = useGetAllCarBookingQuery();

  const {
    data: attractionData,
    isLoading: isAttractionLoading,
    isError: isAttractionError,
  } = useGetAllAttractionBookingQuery();

  // Sample booking data
  const bookingsData = [
    {
      key: "1",
      bookingId: "HTL001234",
      service: "Hotel",
      title: "Grand Plaza Hotel Dubai",
      location: "Dubai, UAE",
      bookingDate: "2024-08-15",
      checkIn: "2024-09-20",
      checkOut: "2024-09-25",
      guests: 2,
      rooms: 1,
      status: "confirmed",
      amount: 1250.0,
      paymentStatus: "paid",
      paymentMethod: "**** 4532",
      contact: "+971 4 123 4567",
      amenities: ["Free WiFi", "Pool", "Gym", "Spa"],
      cancellationPolicy: "Free cancellation until 24 hours before check-in",
    },
    {
      key: "2",
      bookingId: "CAR005678",
      service: "Car Rental",
      title: "BMW X5 - Premium SUV",
      location: "Dubai International Airport",
      bookingDate: "2024-08-20",
      checkIn: "2024-09-15",
      checkOut: "2024-09-18",
      guests: 4,
      status: "confirmed",
      amount: 450.0,
      paymentStatus: "paid",
      paymentMethod: "**** 8901",
      contact: "+971 4 987 6543",
      features: ["GPS Navigation", "Bluetooth", "AC", "Insurance"],
      fuelPolicy: "Full to Full",
    },
    {
      key: "3",
      bookingId: "EVT009876",
      service: "Event",
      title: "Burj Khalifa: Floors 124 & 125",
      location: "Downtown Dubai, UAE",
      bookingDate: "2024-08-25",
      checkIn: "2024-09-10",
      checkOut: "2024-09-10",
      guests: 3,
      status: "pending",
      amount: 1850.0,
      paymentStatus: "pending",
      paymentMethod: "**** 2345",
      contact: "+971 4 555 0123",
      timeSlot: "18:00 - 20:00",
      includes: ["Fast Track Entry", "Observation Deck Access", "Refreshments"],
    },
    {
      key: "4",
      bookingId: "SEC012345",
      service: "Security",
      title: "Personal Security Service",
      location: "Dubai Marina",
      bookingDate: "2024-08-10",
      checkIn: "2024-09-05",
      checkOut: "2024-09-07",
      guests: 1,
      status: "completed",
      amount: 2400.0,
      paymentStatus: "paid",
      paymentMethod: "**** 4532",
      contact: "+971 4 321 9876",
      duration: "48 hours",
      securityLevel: "Premium",
    },
    {
      key: "5",
      bookingId: "HTL567890",
      service: "Hotel",
      title: "Atlantis The Palm",
      location: "Palm Jumeirah, Dubai",
      bookingDate: "2024-07-30",
      checkIn: "2024-08-15",
      checkOut: "2024-08-20",
      guests: 4,
      rooms: 2,
      status: "cancelled",
      amount: 3200.0,
      paymentStatus: "refunded",
      paymentMethod: "**** 8901",
      contact: "+971 4 426 2000",
      cancellationReason: "Travel plans changed",
      refundAmount: 2880.0,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "green",
      pending: "orange",
      completed: "blue",
      cancelled: "red",
    };
    return colors[status] || "default";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "green",
      pending: "orange",
      refunded: "blue",
      failed: "red",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      width: 100,
      render: (service) => <span>{service}</span>,
      filters: [
        { text: "Hotel", value: "Hotel" },
        { text: "Car Rental", value: "Car Rental" },
        { text: "Event", value: "Event" },
        { text: "Security", value: "Security" },
      ],
      onFilter: (value, record) => record.service === value,
    },
    {
      title: "Title",
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.title}</div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            {record.location}
          </div>
        </div>
      ),
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div className="text-sm">
          <div className="text-gray-600 mb-2">
            {dayjs(record.checkIn).format("MMM DD, YYYY")} -{" "}
            {dayjs(record.checkOut).format("MMM DD, YYYY")}
          </div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.checkIn).unix() - dayjs(b.checkIn).unix(),
    },
    {
      title: "Guests",
      dataIndex: "guests",
      key: "guests",
      width: 80,
      render: (guests, record) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span>{guests}</span>
        </div>
      ),
      sorter: (a, b) => a.guests - b.guests,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 100,
      render: (paymentStatus) => (
        <Tag color={getPaymentStatusColor(paymentStatus)} size="small">
          {paymentStatus}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount, record) => (
        <div>
          <div className="font-medium">${amount.toFixed(2)}</div>
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Actions",
      key: "actions",
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
    console.log("Downloading receipt for booking:", booking.bookingId);
    alert(`Receipt for booking ${booking.bookingId} will be downloaded.`);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const hotelRows = Array.isArray(hotelData?.data)
    ? hotelData.data.map((b) => ({
        key: b.id,
        bookingId: b.checkoutSessionId || b.id,
        service: "Hotel",
        title: b.hotel?.hotelName || "Hotel Booking",
        location:
          [b.hotel?.hotelCity, b.hotel?.hotelCountry]
            .filter(Boolean)
            .join(", ") || "",
        bookingDate: b.createdAt,
        checkIn: b.bookedFromDate,
        checkOut: b.bookedToDate,
        guests: (b.adults || 0) + (b.children || 0),
        rooms: b.rooms,
        status: (b.bookingStatus || "").toLowerCase(),
        amount: typeof b.totalPrice === "number" ? b.totalPrice : 0,
        paymentStatus: (b.payment?.[0]?.status || "").toLowerCase(),
        paymentMethod: b.payment?.[0]?.provider || "",
        contact: b.user?.contactNumber || "",
      }))
    : [];

  const securityRows = Array.isArray(securityData?.data)
    ? securityData.data.map((b) => ({
        key: b.id,
        bookingId: b.checkoutSessionId || b.id,
        service: "Security",
        title: b.security?.securityName || "Security Booking",
        location: b.security_Guard?.securityAddress || "",
        bookingDate: b.createdAt,
        checkIn: b.securityBookedFromDate,
        checkOut: b.securityBookedToDate,
        guests: b.number_of_security || 0,
        status: (b.bookingStatus || "").toLowerCase(),
        amount: typeof b.totalPrice === "number" ? b.totalPrice : 0,
        paymentStatus: (b.payment?.[0]?.status || "").toLowerCase(),
        paymentMethod: b.payment?.[0]?.provider || "",
        contact: b.user?.contactNumber || "",
      }))
    : [];

  const sourceData =
    activeTab === "stay"
      ? hotelRows
      : activeTab === "security"
      ? securityRows
      : bookingsData.filter((b) => b.service === selectedService);

  const filteredData = sourceData.filter((booking) => {
    const matchesSearch =
      booking.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.bookingId?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.location?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;

    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const bookingDate = dayjs(booking.checkIn);
      matchesDate =
        bookingDate.isAfter(dateRange[0]) && bookingDate.isBefore(dateRange[1]);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "car", label: "Car Rental" },
              { key: "stay", label: "Stay" },
              { key: "security", label: "Security" },
              { key: "attraction", label: "Attraction" },
            ]}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search bookings..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {activeTab === "stay" && isHotelLoading && (
            <div className="p-6 text-center text-gray-600">
              Loading hotel bookings...
            </div>
          )}
          {activeTab === "stay" && isHotelError && (
            <div className="p-6 text-center text-red-600">
              Failed to load hotel bookings.
            </div>
          )}
          {activeTab === "security" && isSecurityLoading && (
            <div className="p-6 text-center text-gray-600">
              Loading security bookings...
            </div>
          )}
          {activeTab === "security" && isSecurityError && (
            <div className="p-6 text-center text-red-600">
              Failed to load security bookings.
            </div>
          )}

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={false}
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
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadReceipt(selectedBooking)}
            >
              Download Receipt
            </Button>,
          ]}
          width={800}
        >
          {selectedBooking && (
            <div className="space-y-6">
              <Descriptions title="Booking Information" bordered column={2}>
                <Descriptions.Item label="Service" span={1}>
                  {selectedBooking.service}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                  <Tag
                    color={getStatusColor(selectedBooking.status)}
                    className="capitalize"
                  >
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
                  {dayjs(selectedBooking.checkIn).format("MMMM DD, YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Check-out">
                  {dayjs(selectedBooking.checkOut).format("MMMM DD, YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Guests">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedBooking.guests} guest
                    {selectedBooking.guests > 1 ? "s" : ""}
                    {selectedBooking.rooms &&
                      ` • ${selectedBooking.rooms} room${
                        selectedBooking.rooms > 1 ? "s" : ""
                      }`}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  {selectedBooking.contact}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  <span className="text-lg font-semibold">
                    ${selectedBooking.amount.toFixed(2)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={getPaymentStatusColor(selectedBooking.paymentStatus)}
                  >
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
                      <Tag key={index} color="blue">
                        {amenity}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.features && (
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.features.map((feature, index) => (
                      <Tag key={index} color="green">
                        {feature}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.includes && (
                <div>
                  <h4 className="font-semibold mb-2">Includes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.includes.map((item, index) => (
                      <Tag key={index} color="purple">
                        {item}
                      </Tag>
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
