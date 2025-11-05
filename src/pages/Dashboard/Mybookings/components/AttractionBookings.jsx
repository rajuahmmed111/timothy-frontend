import React from 'react';
import { Table, Tag } from 'antd';
import { useGetAllAttractionBookingQuery } from '../../../../redux/api/userDashboard/myBooking';

export default function AttractionBookings() {
  const { data, isLoading, isError } = useGetAllAttractionBookingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const columns = [
    { 
      title: 'Attraction', 
      dataIndex: ['attraction', 'attractionName'], 
      key: 'attractionName' 
    },
    { 
      title: 'Location', 
      dataIndex: ['appeal', 'attractionAddress'], 
      key: 'location' 
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date' 
    },
    { 
      title: 'Time Slot', 
      render: (_, record) => (
        record.timeSlot ? `${record.timeSlot.from} - ${record.timeSlot.to}` : 'N/A'
      ),
      key: 'timeSlot' 
    },
    { 
      title: 'Guests', 
      render: (_, record) => (record.adults || 0) + (record.children || 0),
      key: 'guests' 
    },
    { 
      title: 'Status', 
      key: 'status',
      render: (_, record) => (
        <Tag color={record.payment?.[0]?.status === 'paid' ? 'green' : 'orange'}>
          {record.payment?.[0]?.status || 'pending'}
        </Tag>
      )
    },
    { 
      title: 'Amount', 
      dataIndex: 'totalPrice', 
      key: 'amount' 
    },
  ];

  if (isLoading) return <div>Loading attraction bookings...</div>;
  if (isError) return <div>Error loading attraction bookings</div>;

  return (
    <Table 
      dataSource={data?.data || []} 
      columns={columns} 
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
