import React, { useEffect, useState } from 'react';
import { Card, Tag, Button, Row, Col, Avatar, message, Skeleton, Pagination, Descriptions, Divider, Space, Typography } from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    EditOutlined,
    StarFilled,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import HotelBusinessEdit from './HotelBusinessEdit';
import { useGetHotelBusinessPartnerMutation } from '../../redux/api/hotel/hotelApi';

const { Title, Text, Paragraph } = Typography;

export default function ReviewBusiness() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingHotel, setEditingHotel] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [getHotelBusinessPartner] = useGetHotelBusinessPartnerMutation();

    useEffect(() => {
        fetchHotels();
    }, [pagination.current]);

    const fetchHotels = async () => {
        try {
            const response = await getHotelBusinessPartner({ 
                limit: pagination.pageSize, 
                page: pagination.current 
            }).unwrap();
            
            if (response.success) {
                setHotels(response.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.meta?.total || 0
                }));
            }
        } catch (error) {
            message.error('Failed to fetch hotels');
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    const renderAmenities = (hotel) => (
        <div className="mt-4">
            <Title level={5} className="mb-2">Facilities & Services</Title>
            <Row gutter={[16, 16]}>
                {[
                    { key: 'AC', value: hotel.hotelAC, label: 'Air Conditioning' },
                    { key: 'Parking', value: hotel.hotelParking, label: 'Parking' },
                    { key: 'WiFi', value: hotel.hoitelWifi, label: 'Free WiFi' },
                    { key: 'Breakfast', value: hotel.hotelBreakfast, label: 'Breakfast' },
                    { key: 'Pool', value: hotel.hotelPool, label: 'Swimming Pool' },
                    { key: 'Spa', value: hotel.hotelSpa, label: 'Spa' },
                    { key: 'Gym', value: hotel.hotelGym, label: 'Gym' },
                    { key: 'Kitchen', value: hotel.hotelKitchen, label: 'Kitchen' },
                    { key: 'Restaurant', value: hotel.hotelRestaurant, label: 'Restaurant' },
                    { key: '24/7 Front Desk', value: hotel.hotel24HourFrontDesk, label: '24/7 Front Desk' },
                    { key: 'Airport Shuttle', value: hotel.hotelAirportShuttle, label: 'Airport Shuttle' },
                    { key: 'Coffee Bar', value: hotel.hotelCoffeeBar, label: 'Coffee Bar' }
                ].map(amenity => (
                    <Col xs={12} sm={8} md={6} key={amenity.key}>
                        <div className="flex items-center">
                            {amenity.value ? 
                                <CheckCircleOutlined className="text-green-500 mr-2" /> : 
                                <CloseCircleOutlined className="text-gray-300 mr-2" />
                            }
                            <span className={amenity.value ? "text-gray-800" : "text-gray-400"}>{amenity.label}</span>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );

    if (loading && pagination.current === 1) {
        return <Skeleton active />;
    }

    return (
        <div className="space-y-6">
            {hotels.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏨</div>
                    <Title level={3} className="mb-2">No Hotels Found</Title>
                    <Text type="secondary" className="mb-6 block">You haven't added any hotel businesses yet.</Text>
                    <Button 
                        type="primary" 
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Home
                    </Button>
                </div>
            ) : (
                <>
                    <div className="!space-y-5 gap-2">
                        {hotels.map((hotel) => (
                            <Card
                                key={hotel.id}
                                title={
                                    <div className="flex justify-between items-center !mt-2">
                                        <Title level={4} className="mb-0">{hotel.hotelBusinessName}</Title>
                                        <span className="text-sm text-gray-500">
                                            {hotel.hotelBusinessType}
                                        </span>
                                    </div>
                                }
                                extra={
                                    <Button 
                                        type="primary" 
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setEditingHotel(hotel);
                                            setIsEditModalVisible(true);
                                        }}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Manage Hotel
                                    </Button>
                                }
                                className="mb-6"
                                style={{ marginLeft: '-1rem' }}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3">
                                        <img
                                            src={hotel.businessLogo || 'https://via.placeholder.com/400x250?text=No+Image'}
                                            alt={hotel.hotelName}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <div className="mt-4">
                                            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                                <div className="text-center w-full">
                                                    <Title level={3} className="mb-0">{hotel.totalRooms}</Title>
                                                    <Text type="secondary">Total Rooms</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <Title level={5} className="mb-2">About</Title>
                                            <Paragraph>{hotel.businessDescription}</Paragraph>
                                        </div>

                                        <Divider />

                                        <Title level={5} className="mb-3">Contact Information</Title>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={12}>
                                                <div className="flex items-center mb-2">
                                                    <PhoneOutlined className="mr-2 text-blue-500" />
                                                    <Text>{hotel.hotelPhone}</Text>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <MailOutlined className="mr-2 text-blue-500" />
                                                    <Text>{hotel.hotelEmail}</Text>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <div className="flex items-center mb-2">
                                                    <EnvironmentOutlined className="mr-2 text-blue-500" />
                                                    <Text>Registration: {hotel.hotelRegNum}</Text>
                                                </div>
                                                <div className="flex items-center">
                                                    <Text type="secondary">Established: {new Date(hotel.hotelRegDate).toLocaleDateString()}</Text>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Divider />

                                        {renderAmenities(hotel)}

                                        <Divider />

                                        <Row gutter={[16, 16]}>
                                            <Col span={24} md={12}>
                                                <Title level={5} className="mb-2">Booking Conditions</Title>
                                                <Text>{hotel.hotelBookingCondition}</Text>
                                            </Col>
                                            <Col span={24} md={12}>
                                                <Title level={5} className="mb-2">Cancellation Policy</Title>
                                                <Text>{hotel.hotelCancelationPolicy}</Text>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            showQuickJumper
                            showTotal={(total) => `Total ${total} hotels`}
                        />
                    </div>
                </>
            )}
            
            {editingHotel && (
                <HotelBusinessEdit
                    hotel={editingHotel}
                    visible={isEditModalVisible}
                    onClose={() => {
                        setIsEditModalVisible(false);
                        setEditingHotel(null);
                    }}
                    onSuccess={(updatedHotel) => {
                        // Update the specific hotel in the hotels array
                        setHotels(prevHotels => 
                            prevHotels.map(hotel => 
                                hotel.id === updatedHotel.id ? updatedHotel : hotel
                            )
                        );
                        setIsEditModalVisible(false);
                        setEditingHotel(null);
                    }}
                />
            )}
        </div>
    );
}