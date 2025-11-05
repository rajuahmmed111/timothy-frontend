import React from 'react';
import { Table, Tag } from 'antd';
import { useGetAllSecurityBookingQuery } from '../../../../redux/api/userDashboard/myBooking';

export default function SecurityBookings() {
  const { data, isLoading, isError } = useGetAllSecurityBookingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const columns = [
    { title: 'Service', dataIndex: ['security', 'securityName'], key: 'service' },
    { title: 'Location', dataIndex: ['security_Guard', 'securityAddress'], key: 'location' },
    { title: 'Start Date', dataIndex: 'securityBookedFromDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'securityBookedToDate', key: 'endDate' },
    { title: 'Number of Security', dataIndex: 'number_of_security', key: 'securityCount' },
    { 
      title: 'Status', 
      key: 'status',
      render: (_, record) => (
        <Tag color={record.bookingStatus === 'confirmed' ? 'green' : 'orange'}>
          {record.bookingStatus || 'pending'}
        </Tag>
      )
    },
    { title: 'Amount', dataIndex: 'totalPrice', key: 'amount' },
  ];

  if (isLoading) return <div>Loading security bookings...</div>;
  if (isError) return <div>Error loading security bookings</div>;

  return (
    <Table 
      dataSource={data?.data || []} 
      columns={columns} 
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
