import React, { useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Skeleton,
  Pagination,
  Divider,
  Tag,
  Badge,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useGetAllAttractionBusinessQuery, useGetAttractionBusinessQuery } from "../../redux/api/attraction/attractionApi";
import { Loader } from "lucide-react";
import AttractionBusinessEdit from "./AttractionBusinessEdit";

const { Title, Text, Paragraph } = Typography;

export default function ReviewAttractionBusiness() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingAttraction, setEditingAttraction] = useState(null);
  const [isEditVisible, setIsEditVisible] = useState(false);

  const { data, isLoading, isError } = useGetAllAttractionBusinessQuery(pageSize);
  
  // Handle different possible data structures
  const list = Array.isArray(data?.data?.data) 
    ? data.data.data 
    : Array.isArray(data?.data) 
    ? data.data 
    : [];
  const meta = data?.data?.meta || {};
  const total = meta?.total || list.length;

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <Title level={3} className="mb-2">
          Failed to Load Attraction Businesses
        </Title>
        <Text type="secondary">Please try again later.</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {list.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎡</div>
          <Title level={3} className="mb-2">
            No Attraction Businesses Found
          </Title>
          <Text type="secondary" className="mb-6 block">
            You haven't added any attraction businesses yet.
          </Text>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {list.map((item) => {
              const businessName = item?.attractionBusinessName || "Attraction Business";
              const attractionName = item?.attractionName || "";
              const type = item?.attractionBusinessType || "N/A";
              const logo = item?.businessLogo || "https://via.placeholder.com/400x250?text=No+Image";
              const tagline = item?.attractionBusinessTagline || "";
              const description = item?.attractionBusinessDescription || "";
              const phone = item?.attractionPhone || "";
              const email = item?.attractionEmail || "";
              const regNum = item?.attractionRegNum || "";
              const regDate = item?.attractionRegDate || "";
              const bookingCondition = item?.attractionBookingCondition || "";
              const cancelationPolicy = item?.attractionCancelationPolicy || "";
              const docs = item?.attractionDocs || [];
              const appeals = item?.appeal || [];
              const reviews = item?.review || [];
              const user = item?.user || {};

              return (
                <Card
                  key={item?.id}
                  title={
                    <div className="flex justify-between items-center">
                      <div>
                        <Title level={4} className="mb-0">
                          {businessName}
                        </Title>
                        {attractionName && (
                          <Text type="secondary" className="text-sm">
                            {attractionName}
                          </Text>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                      
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingAttraction(item);
                            setIsEditVisible(true);
                          }}
                        >
                          Manage Attraction
                        </Button>
                      </div>
                    </div>
                  }
                  className="mb-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo Section */}
                    <div className="w-full md:w-1/3">
                      <img
                        src={logo}
                        alt={businessName}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="mt-3 text-center">
                        <Text strong className="text-blue-600 text-lg">
                          Total Appeals: {appeals.length}
                        </Text>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1">
                      {/* Partner Info */}
                      {user?.fullName && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={user?.profileImage || "https://i.ibb.co/Ps9gZ8DD/Profile-image.png"}
                              alt={user?.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <Text strong>Partner: {user?.fullName}</Text>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {description && (
                        <div className="mb-4">
                          <Title level={5} className="mb-2">
                            About
                          </Title>
                          <Paragraph>{description}</Paragraph>
                        </div>
                      )}

                      <Divider />

                      {/* Contact Information */}
                      <Title level={5} className="mb-3">
                        Contact Information
                      </Title>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          {phone && (
                            <div className="flex items-center mb-2">
                              <PhoneOutlined className="mr-2 text-blue-500" />
                              <Text>{phone}</Text>
                            </div>
                          )}
                          {email && (
                            <div className="flex items-center mb-2">
                              <MailOutlined className="mr-2 text-blue-500" />
                              <Text>{email}</Text>
                            </div>
                          )}
                        </Col>
                        <Col xs={24} md={12}>
                          {regNum && (
                            <div className="flex items-center mb-2">
                              <EnvironmentOutlined className="mr-2 text-blue-500" />
                              <Text>Registration: {regNum}</Text>
                            </div>
                          )}
                          {regDate && (
                            <div className="flex items-center">
                              <Text type="secondary">
                                Established: {new Date(regDate).toLocaleDateString()}
                              </Text>
                            </div>
                          )}
                        </Col>
                      </Row>

                      <Divider />

                      {/* Policies */}
                      {(bookingCondition || cancelationPolicy) && (
                        <Row gutter={[16, 16]}>
                          {bookingCondition && (
                            <Col span={24} md={12}>
                              <Title level={5} className="mb-2">
                                Booking Conditions
                              </Title>
                              <Text>{bookingCondition}</Text>
                            </Col>
                          )}
                          {cancelationPolicy && (
                            <Col span={24} md={12}>
                              <Title level={5} className="mb-2">
                                Cancellation Policy
                              </Title>
                              <Text>{cancelationPolicy}</Text>
                            </Col>
                          )}
                        </Row>
                      )}

                      {/* Documents */}
                      {docs.length > 0 && (
                        <>
                          <Divider />
                          <div>
                            <Title level={5} className="mb-3">
                              Documents
                            </Title>
                            <div className="flex flex-wrap gap-2">
                              {docs.map((doc, idx) => (
                                <Button
                                  key={idx}
                                  icon={<FileTextOutlined />}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Document {idx + 1}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Appeals Summary */}
                      {appeals.length > 0 && (
                        <>
                          <Divider />
                          <div>
                            <Title level={5} className="mb-3">
                              Active Appeals ({appeals.length})
                            </Title>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {appeals.slice(0, 4).map((appeal) => (
                                <div
                                  key={appeal.id}
                                  className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <Text strong className="text-sm">
                                      {appeal.attractionDestinationType}
                                    </Text>
                                    <Tag
                                      color={
                                        appeal.isBooked === "AVAILABLE"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {appeal.isBooked}
                                    </Tag>
                                  </div>
                                  <Text type="secondary" className="text-xs block mb-1">
                                    {appeal.attractionCity}, {appeal.attractionCountry}
                                  </Text>
                                  <div className="flex justify-between items-center mt-2">
                                    <Text className="text-xs">
                                      Adult: ৳{appeal.attractionAdultPrice}
                                    </Text>
                                    <Text className="text-xs">
                                      ⭐ {appeal.attractionRating || "N/A"}
                                    </Text>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {appeals.length > 4 && (
                              <Text type="secondary" className="text-sm mt-2 block">
                                +{appeals.length - 4} more appeals
                              </Text>
                            )}
                          </div>
                        </>
                      )}

                      {/* Timestamps */}
                      <Divider />
                      <div className="flex justify-between text-xs text-gray-500">
                        <Text type="secondary">
                          Created: {new Date(item?.createdAt).toLocaleDateString()}
                        </Text>
                        <Text type="secondary">
                          Updated: {new Date(item?.updatedAt).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showQuickJumper
              showSizeChanger
              showTotal={(total) => `Total ${total} attraction businesses`}
            />
          </div>
        </>
      )}
      {editingAttraction && (
        <AttractionBusinessEdit
          visible={isEditVisible}
          attraction={editingAttraction}
          onClose={() => {
            setIsEditVisible(false);
            setEditingAttraction(null);
          }}
          onSuccess={() => {
            // Refetch data after successful update
            setIsEditVisible(false);
            setEditingAttraction(null);
          }}
        />
      )}
    </div>
  );
}
