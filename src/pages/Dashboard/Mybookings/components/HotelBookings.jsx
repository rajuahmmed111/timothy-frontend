import React from 'react';
import { Table, Tag } from 'antd';
import { useGetAllHotelBookingQuery } from '../../../../redux/api/userDashboard/myBooking';

export default function HotelBookings() {
  const { data, isLoading, isError } = useGetAllHotelBookingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const columns = [
    { title: 'Hotel Name', dataIndex: ['hotel', 'hotelName'], key: 'hotelName' },
    { title: 'Location', render: (_, record) => (
      `${record.hotel?.hotelCity}, ${record.hotel?.hotelCountry}`
    )},
    { title: 'Check In', dataIndex: 'checkInDate', key: 'checkIn' },
    { title: 'Check Out', dataIndex: 'checkOutDate', key: 'checkOut' },
    { title: 'Guests', render: (_, record) => (
      (record.adults || 0) + (record.children || 0)
    )},
    { title: 'Rooms', dataIndex: 'rooms', key: 'rooms' },
    { 
      title: 'Status', 
      key: 'status',
      render: (_, record) => (
        <Tag color={record.payment?.[0]?.status === 'paid' ? 'green' : 'orange'}>
          {record.payment?.[0]?.status || 'pending'}
        </Tag>
      )
    },
    { title: 'Amount', dataIndex: 'totalPrice', key: 'amount' },
  ];

  if (isLoading) return <div>Loading hotel bookings...</div>;
  if (isError) return <div>Error loading hotel bookings</div>;

  return (
    <Table 
      dataSource={data?.data || []} 
      columns={columns} 
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
