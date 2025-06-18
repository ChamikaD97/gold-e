import React, { useEffect, useMemo, useState } from "react";
import {
  Card, Col, Row, Button, Table,
  Select
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import lineIdCodeMap from "../data/lineIdCodeMap.json";

const Suppliers = () => {
  const { Option } = Select;

  const [filters, setFilters] = useState({ year: "2024", month: "All", line: "All" });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "quix717244";
  const fetchSupplierDataFromAPI = async (lineCode) => {
    const baseUrl = "/quiX/ControllerV1/supdata";
    const params = new URLSearchParams({
      k: apiKey,
      r: lineCode
    });
    const url = `${baseUrl}?${params.toString()}`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const data = await response.json();

      // ✅ Ensure it's an array
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else if (data && typeof data === "object") {
        setSuppliers([data]); // wrap in array if it's a single object
      } else {
        setSuppliers([]); // fallback empty array
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load supplier data");
      setSuppliers([]); // reset on error
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppslierDataFromAPI = async (lineCode) => {
    const baseUrl = "/quiX/ControllerV1/supdata";
    const params = new URLSearchParams({
      k: apiKey,
      r: lineCode
    });
    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching:", url);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load supplier data");
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

  const uniqueLines = [{ label: "All", value: "All" },
  ...lineIdCodeMap
    .filter(l => l.lineCode && l.lineId)
    .map(l => ({
      label: `${l.lineCode} - ${l.lineId}`,
      value: l.lineId

    }))
  ];


  useEffect(() => {
    if (filters.line !== "All") {
      fetchSupplierDataFromAPI(filters.line);
    } else {
      setSuppliers([]);
    }
  }, [filters.line]);

  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "Supplier Id",
      key: "supplierId",
      sorter: (a, b) => a["Supplier Id"].localeCompare(b["Supplier Id"])
    },
    {
      title: "Name",
      dataIndex: "Supplier Name",
      key: "supplierName",
      filterSearch: true,
      filters: [...new Set(suppliers.map(s => s["Supplier Name"]))].map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record["Supplier Name"] === value
    },
    {
      title: "Route",
      dataIndex: "Route",
      key: "route",
      render: (value) => lineIdToCodeMap[value] || value,
      filters: [...new Set(suppliers.map(s => s.Route))].map(r => ({
        text: lineIdToCodeMap[r] || r,
        value: r
      })),
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
      sorter: (a, b) => new Date(a["Joined Date"]) - new Date(b["Joined Date"])
    }
  ];

  const cardStyle = { background: "rgba(0, 0, 0, 0.6)", color: "#fff", borderRadius: 12, marginBottom: 6 };

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
                onClick={() => setFilters({ year: "2025", month: "All", line: "All" })}
              />
            </Col>
            <Select
              value={filters.line}
              onChange={val => setFilters(prev => ({ ...prev, line: val }))}
              style={{ width: "100%" }}
            >
              {uniqueLines.map(line => (
                <Option key={line.value} value={line.value}>
                  {line.label}
                </Option>
              ))}
            </Select>

          </Row>
        </Card>

        {loading && <p style={{ color: "white" }}>Loading suppliers...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && suppliers.length > 0 && (
          <Card size="small" style={{ marginTop: 12 }}>
            <Table
              columns={columns}
              dataSource={suppliers.map((s, index) => ({ ...s, key: index }))}
              pagination={{ pageSize: 5 }}
              bordered
              scroll={{ x: "max-content" }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
