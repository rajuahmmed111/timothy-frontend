import React from "react";
import { useMemo, useState } from "react";
import { Table, Spin, ConfigProvider, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetSecurityProtocolsQuery } from "../../../redux/api/security/getAllSecurityApi";

export default function ListingsForSecurity() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isError } = useGetSecurityProtocolsQuery(
    {
      page,
      limit: pageSize,
      search,
    }
  );

  const rows = useMemo(() => {
    const protocols = Array.isArray(data?.data) ? data.data : [];
    const guards = protocols.flatMap((p) =>
      (p.guards || []).map((g) => ({
        id: g.id,
        guardName: g.securityGuardName,
        address: g.securityAddress,
        city: g.securityCity,
        country: g.securityCountry,
        priceDay: g.securityPriceDay,
        rating: g.securityRating,
        availability: g.isBooked,
        protocolName: p.protocolName,
        protocolType: p.protocolType,
      }))
    );
    const term = search.trim().toLowerCase();
    return term
      ? guards.filter(
          (r) =>
            r.guardName?.toLowerCase().includes(term) ||
            r.protocolName?.toLowerCase().includes(term) ||
            r.protocolType?.toLowerCase().includes(term)
        )
      : guards;
  }, [data, search]);

  const total = useMemo(() => rows.length, [rows.length]);

  const hasRows = rows.length > 0;

  const columns = [
    {
      title: "Name",
      dataIndex: "guardName",
      key: "guardName",
      render: (text) => <span className="font-medium">{text || "N/A"}</span>,
    },
    {
      title: "Protocol Name",
      dataIndex: "protocolName",
      key: "protocolName",
      render: (v) => v || "N/A",
    },
    {
      title: "Protocol Type",
      dataIndex: "protocolType",
      key: "protocolType",
      render: (v) => (v ? <Tag color="blue">{v}</Tag> : "N/A"),
    },
    {
      title: "Location",
      key: "location",
      render: (_, r) => (
        <span>
          {r.city ? `${r.city}` : ""}
          {r.country ? `${r.city ? ", " : ""}${r.country}` : ""}
        </span>
      ),
    },
    {
      title: "Price/Day",
      dataIndex: "priceDay",
      key: "priceDay",
      render: (v) => (v !== undefined && v !== null ? `$${v}` : "N/A"),
      align: "right",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (v) => (v ? `${v} ⭐` : "N/A"),
      align: "center",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (v) => (
        <Tag color={v === "AVAILABLE" ? "green" : "red"}>{v || "N/A"}</Tag>
      ),
      align: "center",
    },
  ];

  return (
    <div className="p-5">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Security Listings</h2>
        <div className="space-y-2 w-[400px] flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Security..."
            className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
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
              headerSplitColor: "#00c0b5",
            },
          },
        }}
      >
        <Spin spinning={isLoading || isFetching}>
          <Table
            rowKey="id"
            dataSource={rows}
            columns={columns}
            pagination={
              hasRows
                ? {
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: false,
                    showQuickJumper: false,
                  }
                : false
            }
            onChange={(p) => {
              setPage(p.current || 1);
              setPageSize(p.pageSize || 10);
            }}
            loading={isLoading}
          />
        </Spin>
      </ConfigProvider>
      {isError && (
        <div className="mt-4 text-red-600">
          Failed to load security listings.
        </div>
      )}
    </div>
  );
}
