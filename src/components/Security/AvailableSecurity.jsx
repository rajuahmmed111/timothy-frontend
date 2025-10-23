import React, { useState } from "react";
import { Table, ConfigProvider, Modal, Button, message, Tag } from "antd";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../shared/Loader/Loader";
import {
  useDeleteSecurityGuardMutation,
  useGetAvailableSecurityQuery,
} from "../../redux/api/security/securityApi";
import SecurityDetailsModal from "./SecurityDetailsModal";


export default function AvailableSecurity() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetAvailableSecurityQuery({ page, limit });
  console.log("available security", data);
  const [deleteSecurityGuard, { isLoading: isDeleting }] =
    useDeleteSecurityGuardMutation();

  const guards = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  console.log("available security", guards);

  const filtered = guards.filter((g) => {
    const haystack = [
      g?.securityGuardName,
      g?.category,
      g?.securityCity,
      g?.securityCountry,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  // Use server-provided total; index rows by overall position
  const start = (page - 1) * limit;
  const paged = filtered; // server returns current page
  const total = meta.total || 0;

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => start + index + 1,
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <img
          src={record.securityImages?.[0] || "https://via.placeholder.com/80x60"}
          alt="Security"
          className="w-20 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "securityGuardName",
      key: "securityGuardName",
    },
    {
      title: "Location",
      key: "location",
      render: (_, r) => `${r.securityCity}, ${r.securityCountry}`,
    },
    {
      title: "Price/Day",
      key: "price",
      render: (_, r) => `$${r.securityPriceDay}`,
    },
    {
      title: "Rating",
      key: "rating",
      render: (_, r) => `⭐ ${r.securityRating || "N/A"}`,
    },
    {
      title: "Hired",
      key: "hiredCount",
      dataIndex: "hiredCount",
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={r.isBooked === "AVAILABLE" ? "green" : "red"}>{r.isBooked}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Eye
            className="text-[#3b82f6] w-6 h-6 cursor-pointer"
            onClick={() => {
              setSelectedGuard(record);
              setIsViewModalOpen(true);
            }}
          />
          <Trash
            className="text-red-500 w-6 h-6 cursor-pointer"
            onClick={() => {
              setSelectedGuard(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Security Listings</h2>
        <div className="space-y-2 w-[400px] flex gap-2">
          <input
            type="text"
            placeholder="Search security..."
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/add-security-listing")}
            className="bg-blue-600 text-white !py-6 hover:bg-blue-700 p-3"
          >
            Add Listing
          </Button>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#3b82f6",
            },
            Pagination: {
              colorPrimaryBorder: "#3b82f6",
              colorBorder: "#3b82f6",
              colorPrimaryHover: "#3b82f6",
              colorTextPlaceholder: "#3b82f6",
              itemActiveBgDisabled: "#3b82f6",
              colorPrimary: "#3b82f6",
            },
            Table: {
              headerBg: "#3b82f6",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#3b82f6",
            },
          },
        }}
      >
        <Table
          rowKey="id"
          dataSource={paged}
          columns={columns}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: false,
            showQuickJumper: false,
            simple: false,
            hideOnSinglePage: false,
            showLessItems: false,
          }}
          onChange={(pager) => {
            setPage(pager.current || 1);
          }}
          loading={isLoading}
        />
      </ConfigProvider>
      <SecurityDetailsModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        guard={selectedGuard}
      />
      <Modal
        title="Delete Security Guard"
        open={isDeleteModalOpen}
        confirmLoading={isDeleting}
        onOk={async () => {
          try {
            if (!selectedGuard?.id) return;
            await deleteSecurityGuard(selectedGuard.id).unwrap();
            message.success("Deleted successfully");
          } catch (e) {
            message.error(e?.data?.message || "Failed to delete");
          } finally {
            setIsDeleteModalOpen(false);
            setSelectedGuard(null);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this security guard?</p>
      </Modal>
    </div>
  );
}
