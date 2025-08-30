import React from 'react';
import { Card, Descriptions, Tag, Rate, Button, Row, Col, Avatar, List } from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    EditOutlined
} from '@ant-design/icons';

export default function ReviewBusiness() {
    const business = {
        name: 'Luxury Hotel & Spa',
        type: '5-Star Hotel',
        rating: 4.8,
        reviews: 124,
        location: '123 Luxury Street, New York, NY 10001',
        description: 'Experience unparalleled luxury at our 5-star hotel located in the heart of the city. Our hotel offers world-class amenities and exceptional service.',
        amenities: [
            'Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Room Service'
        ],
        contact: {
            phone: '+1 (555) 123-4567',
            email: 'info@luxuryhotel.com',
            website: 'www.luxuryhotel.com'
        }
    };

    return (
        <Card
            title={business.name}
            extra={
                <Button type="primary" icon={<EditOutlined />}>
                    Edit Business
                </Button>
            }
        >
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <Rate
                        allowHalf
                        disabled
                        defaultValue={business.rating}
                        className="text-yellow-500 mr-4"
                    />
                    <span className="text-gray-600">{business.rating} ({business.reviews} reviews)</span>
                </div>

                <div className="mb-6">
                    <p className="text-gray-700">{business.description}</p>
                </div>

                <Descriptions title="Business Information" bordered className="mb-6">
                    <Descriptions.Item label="Type" span={3}>{business.type}</Descriptions.Item>
                    <Descriptions.Item label="Location" span={3}>
                        <div className="flex items-center">
                            <EnvironmentOutlined className="mr-2" />
                            {business.location}
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Contact" span={3}>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <PhoneOutlined className="mr-2" />
                                {business.contact.phone}
                            </div>
                            <div className="flex items-center">
                                <MailOutlined className="mr-2" />
                                {business.contact.email}
                            </div>
                            <div className="flex items-center">
                                <GlobalOutlined className="mr-2" />
                                <a href={`https://${business.contact.website}`} target="_blank" rel="noopener noreferrer">
                                    {business.contact.website}
                                </a>
                            </div>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Amenities" span={3}>
                        <div className="flex flex-wrap gap-2">
                            {business.amenities.map((amenity, index) => (
                                <Tag color="blue" key={index}>{amenity}</Tag>
                            ))}
                        </div>
                    </Descriptions.Item>
                </Descriptions>

                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Gallery</h3>
                    <Row gutter={[16, 16]}>
                        {[1, 2, 3, 4].map((item) => (
                            <Col xs={12} sm={8} md={6} key={item}>
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded overflow-hidden">
                                    <img
                                        src={`https://source.unsplash.com/random/300x200?hotel,${item}`}
                                        alt={`Gallery ${item}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </Card>
    );
};