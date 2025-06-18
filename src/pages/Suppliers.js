import React, { useEffect, useMemo, useState } from "react";
import {
  Card, Col, Row, Button, Table,
  Select, Typography, Input
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import lineIdCodeMap from "../data/lineIdCodeMap.json";
import CircularLoader from "../components/CircularLoader";
import { Pagination } from "antd"; // ✅ make sure to import this

const Suppliers = () => {
  const { Option } = Select;
  const { Text } = Typography;

  const [filters, setFilters] = useState({
    year: "2024",
    month: "All",
    line: "All",
    search: ""
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "quix717244";

  const fetchSupplierDataFromAPI = async (lineCode) => {
    const baseUrl = "/quiX/ControllerV1/supdata";
    const params = new URLSearchParams({ k: apiKey, r: lineCode });
    const url = `${baseUrl}?${params.toString()}`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load supplier data");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const lineIdToCodeMap = useMemo(() => {
    const map = {};
    lineIdCodeMap.forEach(item => {
      map[item.lineId] = item.lineCode;
    });
    return map;
  }, []);

  const uniqueLines = [
    { label: "All", value: "All" },
    ...lineIdCodeMap
      .filter(l => l.lineCode && l.lineId)
      .map(l => ({ label: l.lineCode, value: l.lineId }))
  ];

  useEffect(() => {
    if (filters.line !== "All") {
      fetchSupplierDataFromAPI(filters.line);
    } else {
      setSuppliers([]);
    }
  }, [filters.line]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const filteredData = suppliers
    .filter(s => {
      const search = (filters.search || "").toLowerCase();
      return (
        s["Supplier Id"]?.toLowerCase().includes(search) ||
        s["Supplier Name"]?.toLowerCase().includes(search)
      );
    })
    .map((s, index) => ({ ...s, key: index }));
const paginatedData = filteredData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "Supplier Id",
      key: "supplierId",
      sorter: (a, b) => a["Supplier Id"].localeCompare(b["Supplier Id"]),
      render: (text) => (
        <Button
          style={{
            backgroundColor: "#006623",
            color: "#fff",
            border: "none",
            fontSize: 15,
            fontWeight: "normal"
          }}
        >
          {text}
        </Button>
      )
    },
    {
      title: "Name",
      dataIndex: "Supplier Name",
      key: "supplierName",
      filterSearch: true,
      render: (text) => <div style={{ fontWeight: "normal", color: "#fff" }}>{text}</div>,
      filters: [...new Set(suppliers.map(s => s["Supplier Name"]))]
        .map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record["Supplier Name"] === value
    },
    {
      title: "Route",
      dataIndex: "Route",
      key: "route",
      render: (value) => lineIdToCodeMap[value] || value,
      filters: [...new Set(suppliers.map(s => s.Route))]
        .map(r => ({ text: lineIdToCodeMap[r] || r, value: r })),
      onFilter: (value, record) => record.Route === value
    },
    {
      title: "Pay Category",
      dataIndex: "Pay",
      key: "pay",
      filters: [
        { text: "Type 1", value: 1 },
        { text: "Type 2", value: 2 },
        { text: "Type 3", value: 3 }
      ],
      onFilter: (value, record) => record.Pay === value
    },
    {
      title: "Bank",
      dataIndex: "Bank",
      key: "bank"
    },
    {
      title: "Bank A/C",
      dataIndex: "Bank AC",
      key: "bankAc"
    },
    {
      title: "NIC",
      dataIndex: "NIC",
      key: "nic"
    },
    {
      title: "Contact",
      dataIndex: "Contact",
      key: "contact"
    },
    {
      title: "Joined Date",
      dataIndex: "Joined Date",
      key: "joinedDate",
      sorter: (a, b) =>
        new Date(a["Joined Date"]) - new Date(b["Joined Date"])
    }
  ];

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    borderRadius: 12,
    marginBottom: 6
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: 16 }}>
      <div style={{ flex: "0 0 auto", marginBottom: 16 }} className="fade-in">
        <Card bordered={false} style={cardStyle}>
          <Row gutter={[16, 16]}>
            <Col md={1}>
              <Button
                icon={<ReloadOutlined />}
                danger
                type="primary"
                block
                onClick={() => setFilters({ year: "2024", month: "All", line: "All", search: "" })}
              />
            </Col>
            <Col md={2}>
              <Select
                showSearch
                className="line-select"
                placeholder="Select Line"
                value={filters.line}
                onChange={val => setFilters(prev => ({ ...prev, line: val }))}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 6
                }}
                dropdownStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
                bordered={false}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {uniqueLines.map(line => (
                  <Option key={line.value} value={line.value}>
                    {line.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col md={2}>
              <Text style={{ color: "#fff", paddingTop: 6 }}>Search Supplier</Text>
            </Col>
            <Col md={6}>
              <Input
                className="custom-supplier-input"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search by ID or Name"
                style={{
                  width: "100%",
                  backgroundColor: "rgb(0, 0, 0)",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 6
                }}
                allowClear
              />
            </Col>
          </Row>
        </Card>

        {loading && <CircularLoader />}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && filteredData.length > 0 && (
          <Card
            size="small"
            bordered={false}
            style={{
              marginTop: 12,
              background: "rgba(0, 0, 0, 0.6)",
              borderRadius: 16
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ maxHeight: "460px", overflowY: "auto" }}>
              <Table
                className="sup-bordered-table"
                columns={columns}
                dataSource={paginatedData}
pagination={false}
                scroll={{ x: "max-content" }}
                bordered
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                showSizeChanger
                pageSizeOptions={["5", "10", "15", "20"]}
                showTotal={(total, range) => `${range[0]}–${range[1]} of ${total} suppliers`}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
              />
            </div>

          </Card>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
