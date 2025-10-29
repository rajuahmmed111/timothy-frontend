import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Typography, Skeleton, Pagination, Divider, message } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useGetCarPartnerMutation } from "../../redux/api/car/carApi";

const { Title, Text, Paragraph } = Typography;

export default function ReviewCarBusiness() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [getCarPartner, { data, isLoading, isError, error }] = useGetCarPartnerMutation();

  useEffect(() => {
    getCarPartner({ page: pagination.current, limit: pagination.pageSize });
  }, [getCarPartner, pagination.current, pagination.pageSize]);

  const list = data?.data?.data || [];
  const meta = data?.data?.meta;

  useEffect(() => {
    if (meta?.total != null) {
      setPagination((prev) => ({ ...prev, total: meta.total }));
    }
  }, [meta?.total]);

  useEffect(() => {
    if (isError) {
      message.error("Failed to fetch cars");
    }
  }, [isError]);

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  if (isLoading && pagination.current === 1) {
    return <Skeleton active />;
  }

  return (
    <div className="space-y-6">
      {list.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <Title level={3} className="mb-2">No Cars Found</Title>
          <Text type="secondary" className="mb-6 block">You haven't added any car businesses yet.</Text>
          <Button type="primary" onClick={() => (window.location.href = "/")}>Go to Home</Button>
        </div>
      ) : (
        <>
          <div className="!space-y-5 gap-2">
            {list.map((item) => {
              const rental = item?.car_Rental || item;
              const title = rental?.carBusinessName || rental?.carName || "Car Business";
              const type = rental?.carBusinessType || item?.carType;
              const logo = rental?.businessLogo || item?.carImages?.[0] || "https://via.placeholder.com/400x250?text=No+Image";
              const about = rental?.carRentalDescription || item?.carDescription;
              const phone = rental?.carPhone || item?.carPhone;
              const email = rental?.carEmail || item?.carEmail;
              const regNum = rental?.carRegNum || item?.carRegNum;
              const regDate = rental?.carRegDate || item?.carRegDate;
              const address = [rental?.officeAddress, rental?.carCity, rental?.carCountry].filter(Boolean).join(", ");

              return (
                <Card
                  key={item?.id}
                  title={
                    <div className="flex justify-between items-center !mt-2">
                      <Title level={4} className="mb-0">{title}</Title>
                      <span className="text-sm text-gray-500">{type}</span>
                    </div>
                  }
                  className="mb-6"
                  style={{ marginLeft: "-1rem" }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <img
                        src={logo}
                        alt={title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      {about && (
                        <div className="mb-4">
                          <Title level={5} className="mb-2">About</Title>
                          <Paragraph>{about}</Paragraph>
                        </div>
                      )}

                      <Divider />

                      <Title level={5} className="mb-3">Contact Information</Title>
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
                              <Text type="secondary">Established: {new Date(regDate).toLocaleDateString()}</Text>
                            </div>
                          )}
                          {address && (
                            <div className="flex items-center mt-2">
                              <Text type="secondary">Address: {address}</Text>
                            </div>
                          )}
                        </Col>
                      </Row>

                      <Divider />

                      {(rental?.carBookingCondition || rental?.carCancelationPolicy) && (
                        <Row gutter={[16, 16]}>
                          {rental?.carBookingCondition && (
                            <Col span={24} md={12}>
                              <Title level={5} className="mb-2">Booking Conditions</Title>
                              <Text>{rental?.carBookingCondition}</Text>
                            </Col>
                          )}
                          {rental?.carCancelationPolicy && (
                            <Col span={24} md={12}>
                              <Title level={5} className="mb-2">Cancellation Policy</Title>
                              <Text>{rental?.carCancelationPolicy}</Text>
                            </Col>
                          )}
                        </Row>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showQuickJumper
              showTotal={(total) => `Total ${total} cars`}
            />
          </div>
        </>
      )}
    </div>
  );
}