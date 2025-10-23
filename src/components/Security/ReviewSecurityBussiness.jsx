import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, message, Skeleton, Divider, Typography } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useGetSecurityPartnerMutation } from "../../redux/api/security/securityApi";
import SecurityBusinessEdit from "./SecurityBusinessEdit";

const { Title, Text, Paragraph } = Typography;

export default function ReviewSecurityBussiness() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHotel, setEditingHotel] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [getSecurityPartner] = useGetSecurityPartnerMutation();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await getSecurityPartner({
        limit: 1000,
        page: 1,
      }).unwrap();

      if (response.success) {
        setItems(response.data.data || []);
      }
    } catch (error) {
      message.error("Failed to fetch security businesses");
      console.error("Error fetching security businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeaderChips = (item) => (
    <Row gutter={[8, 8]} className="mt-2">
      <Col>
        <Text type="secondary">Type: {item.securityBusinessType || item.securityProtocolType}</Text>
      </Col>
      {typeof item.totalGuards === "number" && (
        <Col>
          <Text type="secondary">Total Guards: {item.totalGuards}</Text>
        </Col>
      )}
    </Row>
  );

  if (loading) {
    return <Skeleton active />;
  }

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏨</div>
          <Title level={3} className="mb-2">
            No Security Businesses Found
          </Title>
          <Text type="secondary" className="mb-6 block">
            You haven't added any security businesses yet.
          </Text>
          <Button type="primary" onClick={() => (window.location.href = "/")}>
            Go to Home
          </Button>
        </div>
      ) : (
        <>
          <div className="!space-y-5 gap-2">
            {items.map((item) => (
              <Card
                key={item.id}
                title={
                  <div className="flex justify-between items-center !mt-2">
                    <Title level={4} className="mb-0">
                      {item.securityBusinessName}
                    </Title>
                    <span className="text-sm text-gray-500">
                      {item.securityBusinessType || item.securityProtocolType}
                    </span>
                  </div>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingHotel(item);
                      setIsEditModalVisible(true);
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    Manage Business
                  </Button>
                }
                className="mb-6"
                style={{ marginLeft: "-1rem" }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img
                      src={
                        item.businessLogo ||
                        "https://via.placeholder.com/400x250?text=No+Image"
                      }
                      alt={item.securityBusinessName}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="mt-4">
                      <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                        <div className="text-center w-full">
                          <Title level={3} className="mb-0">
                            {item.totalGuards ?? 0}
                          </Title>
                          <Text type="secondary">Total Guards</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">{renderHeaderChips(item)}</div>
                    <div className="mb-4">
                      <Title level={5} className="mb-2">
                        Tagline
                      </Title>
                      <Paragraph>{item.securityTagline}</Paragraph>
                    </div>

                    <Divider />

                    <Title level={5} className="mb-3">
                      Contact Information
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div className="flex items-center mb-2">
                          <PhoneOutlined className="mr-2 text-blue-500" />
                          <Text>{item.securityPhone}</Text>
                        </div>
                        <div className="flex items-center mb-2">
                          <MailOutlined className="mr-2 text-blue-500" />
                          <Text>{item.securityEmail}</Text>
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div className="flex items-center mb-2">
                          <EnvironmentOutlined className="mr-2 text-blue-500" />
                          <Text>Registration: {item.securityRegNum}</Text>
                        </div>
                        <div className="flex items-center">
                          <Text type="secondary">
                            Established:{" "}
                            {new Date(item.securityRegDate).toLocaleDateString()}
                          </Text>
                        </div>
                      </Col>
                    </Row>

                    <Divider />

                    <Row gutter={[16, 16]}>
                      <Col span={24} md={12}>
                        <Title level={5} className="mb-2">
                          Booking Conditions
                        </Title>
                        <Text>{item.securityBookingCondition}</Text>
                      </Col>
                      <Col span={24} md={12}>
                        <Title level={5} className="mb-2">
                          Cancellation Policy
                        </Title>
                        <Text>{item.securityCancelationPolicy}</Text>
                      </Col>
                    </Row>

                    <Divider />
                    <Title level={5} className="mb-2">Protocol Description</Title>
                    <Paragraph>{item.securityProtocolDescription}</Paragraph>

                    {item?.user?.fullName && (
                      <>
                        <Divider />
                        <Title level={5} className="mb-2">Partner</Title>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.user.profileImage}
                            alt={item.user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <Text>{item.user.fullName}</Text>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination removed */}
        </>
      )}

      {editingHotel && (
        <SecurityBusinessEdit
          hotel={editingHotel}
          visible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setEditingHotel(null);
          }}
          onSuccess={(updatedHotel) => {
            // Update the specific hotel in the hotels array
            setItems((prev) =>
              prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h))
            );
            setIsEditModalVisible(false);
            setEditingHotel(null);
          }}
        />
      )}
    </div>
  );
}
