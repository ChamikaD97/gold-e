
import React, { useEffect, useMemo, useState } from "react";
import {
  Card, Col, Row, Button, Table
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers, clearSupplierState } from "../redux/supplierSlice";

const Suppliers = () => {
  const [filters, setFilters] = useState({ year: "2024", month: "All", officer: "All", line: "All" });
  const dispatch = useDispatch();

  const officerLineMap = useSelector((state) => state.officerLine.officerLineMap);
  const { suppliers, loading, error } = useSelector((state) => state.supplier);

  const columns = [
    { title: "Supplier ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Line", dataIndex: "line", key: "line" },
    { title: "Joined", dataIndex: "joinedDate", key: "joinedDate" }
  ];

  const uniqueOfficers = ["All", ...Object.keys(officerLineMap)];
  const filteredLines = filters.officer === "All"
    ? ["All"]
    : ["All", ...(officerLineMap[filters.officer]?.map(l => l.code) || [])];

  const selectedLineDetails = useMemo(() => {
    if (filters.officer === "All" || filters.line === "All") return null;
    const officerLines = officerLineMap[filters.officer] || [];
    if (typeof officerLines[0] === "object") {
      return officerLines.find(item => item.code === filters.line);
    }
    return { line: null, code: filters.line, officer: filters.officer };
  }, [filters.officer, filters.line, officerLineMap]);

  useEffect(() => {
    if (filters.line !== "All" && filters.officer !== "All") {
      dispatch(fetchSuppliers(filters.line));
    } else {
      dispatch(clearSupplierState());
    }
  }, [filters.line, filters.officer, dispatch]);

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
                onClick={() => setFilters({ year: "2025", month: "All", officer: "All", line: "All" })}
              />
            </Col>
            {uniqueOfficers.filter(o => o !== "All").map(o => (
              <Col xs={8} sm={4} md={3} key={o}>
                <Button
                  type={filters.officer === o ? "primary" : "default"}
                  onClick={() =>
                    setFilters(prev => ({
                      ...prev,
                      officer: o,
                      line: "All",
                      month: "All"
                    }))
                  }
                  style={{
                    width: "100%",
                    background: filters.officer === o ? "#1890ff" : "#000",
                    color: "#fff",
                    borderColor: "#333"
                  }}
                >
                  {o}
                </Button>
              </Col>
            ))}
          </Row>
        </Card>

        {filters.line !== "M" && filters.officer !== "All" && (
          <Card bordered={false} className="fade-in" style={cardStyle}>
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              {filteredLines.filter(l => l !== "All").map(lineCode => (
                <Col xs={8} sm={4} md={4} key={lineCode}>
                  <Button
                    type={filters.line === lineCode ? "primary" : "default"}
                    onClick={() => setFilters(prev => ({ ...prev, line: lineCode, month: "All" }))}
                    style={{
                      width: "100%",
                      background: filters.line === lineCode ? "#1890ff" : "#000",
                      color: "#fff",
                      borderColor: "#333"
                    }}
                  >
                    {lineCode}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {selectedLineDetails && (
          <Card size="small" style={{ backgroundColor: "#001529", color: "#fff", marginBottom: 12 }}>
            <p><strong>Line Code:</strong> {selectedLineDetails.code}</p>
            <p><strong>Line No:</strong> {selectedLineDetails.line}</p>
            <p><strong>Officer:</strong> {selectedLineDetails.officer}</p>
          </Card>
        )}

        {loading && <p style={{ color: "white" }}>Loading suppliers...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && suppliers.length > 0 && (
          <Card size="small" style={{ marginTop: 12 }}>
            <Table
              columns={columns}
              dataSource={suppliers.map((s, index) => ({ ...s, key: index }))}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
