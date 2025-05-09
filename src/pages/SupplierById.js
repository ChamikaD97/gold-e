import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Col,
  Row,
  Select,
  Button,
  notification,
  Typography,
} from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSupplierSummaryByDateRange } from "../pages/utils/dashboardMetrics";
import supplier_list from "./data/supplier_list.json";

const { Option } = Select;
const { Text } = Typography;

const SupplierById = () => {
  const { id } = useParams();
  const dailyLeafCount = useSelector((state) => state.dailyLeafCount.dailyLeafCount);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title) => {
    api[type]({ message: title });
  };

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  };

  const [filters, setFilters] = useState({
    fromYear: "2025",
    toYear: "2025",
    fromMonth: "01",
    toMonth: "12",
  });

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
    isValid: true,
  });

  const [dailyCountSummeryBySupplierId, setDailyCountSummeryBySupplierId] = useState({});
  const [selectedSuplier, setSelectedSuplier] = useState({});

  const monthMap = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
  };

  const allMonthKeys = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const isBeforeFromDate = (year, month) => {
    const from = new Date(`${filters.fromYear}-${filters.fromMonth}-01`);
    const current = new Date(`${year}-${month}-01`);
    return current < from;
  };

  const isAfterToDate = (year, month) => {
    const to = new Date(`${filters.toYear}-${filters.toMonth}-01`);
    const current = new Date(`${year}-${month}-01`);
    return current > to;
  };

  useEffect(() => {
    const supplier = supplier_list.find((s) => s.supplierId === id);
    if (supplier) {
      setSelectedSuplier(supplier);
    } else {
      openNotificationWithIcon("error", "Supplier not found");
    }

    const fromDate = `${filters.fromYear}-${filters.fromMonth}-01`;
    const toDate = new Date(
      parseInt(filters.toYear),
      parseInt(filters.toMonth),
      0
    ).toISOString().slice(0, 10);

    const isValid = new Date(fromDate) <= new Date(toDate);
    setDateRange({ fromDate, toDate, isValid });

    if (!isValid) {
      openNotificationWithIcon("error", "From date must be before To date");
      setDailyCountSummeryBySupplierId({});
      return;
    }

    const summary = getSupplierSummaryByDateRange(
      dailyLeafCount,
      id,
      fromDate,
      toDate
    );

    setDailyCountSummeryBySupplierId(summary);
  }, [id, filters, dailyLeafCount]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Leaf Type", dataIndex: "leaf_type", key: "leaf_type" },
    { title: "Full KG", dataIndex: "full_kg", key: "full_kg" },
    { title: "Gross", dataIndex: "gross", key: "gross" },
    { title: "Net KG", dataIndex: "net_kg", key: "net_kg" },
    { title: "Bag KG", dataIndex: "bag_kg", key: "bag_kg" },
    { title: "Line", dataIndex: "line", key: "line" },
  ];

  const supplierInfo = selectedSuplier
    ? [{
        supplier_id: selectedSuplier.supplierId,
        supplier_name: selectedSuplier.name,
        line: selectedSuplier.line,
        contact_number: selectedSuplier.contact,
      }]
    : [];

  return (
    <div>
      {contextHolder}

      {/* Year & Month Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card bordered={false} style={cardStyle}>
            <Text strong>From</Text>
            <Select
              value={filters.fromYear}
              onChange={(val) => setFilters(prev => ({ ...prev, fromYear: val }))}
              style={{ width: "100%", marginBottom: 12 }}
            >
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
            </Select>
            <Row gutter={[12, 12]}>
              {allMonthKeys.map((m) => (
                <Col xs={8} sm={6} md={4} key={`from-${m}`}>
                  <Button
                    disabled={isAfterToDate(filters.fromYear, m)}
                    type={filters.fromMonth === m ? "primary" : "default"}
                    onClick={() => setFilters(prev => ({ ...prev, fromMonth: m }))}
                    style={{ width: "100%" }}
                  >
                    {monthMap[m]}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card bordered={false} style={cardStyle}>
            <Text strong>To</Text>
            <Select
              value={filters.toYear}
              onChange={(val) => setFilters(prev => ({ ...prev, toYear: val }))}
              style={{ width: "100%", marginBottom: 12 }}
            >
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
            </Select>
            <Row gutter={[12, 12]}>
              {allMonthKeys.map((m) => (
                <Col xs={8} sm={6} md={4} key={`to-${m}`}>
                  <Button
                    disabled={isBeforeFromDate(filters.toYear, m)}
                    type={filters.toMonth === m ? "primary" : "default"}
                    onClick={() => setFilters(prev => ({ ...prev, toMonth: m }))}
                    style={{ width: "100%" }}
                  >
                    {monthMap[m]}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Date Range Summary */}
      <Card bordered={false} style={{ ...cardStyle, padding: 16 }}>
        <Text style={{ color: dateRange.isValid ? "#00ffcc" : "#ff4d4f", fontSize: 16 }}>
          Date Range: <b>{dateRange.fromDate}</b> to <b>{dateRange.toDate}</b>
        </Text>
      </Card>

      {/* Leaf Totals Summary */}
      {dailyCountSummeryBySupplierId.filteredData?.length > 0 && (
        <Card bordered={false} style={{ ...cardStyle, padding: 16 }}>
          <Text style={{ color: "#fff", fontSize: 16 }}>
            🟢 Normal Leaf Total (Net Kg): <b>{dailyCountSummeryBySupplierId.normalLeafTotalNetKg}</b><br />
            🔵 Super Leaf Total (Net Kg): <b>{dailyCountSummeryBySupplierId.superLeafTotalNetKg}</b>
          </Text>
        </Card>
      )}

      {/* Leaf Collection Table */}
      <Card style={{ marginBottom: 16 }}>
        <Table
          columns={columns}
          dataSource={dailyCountSummeryBySupplierId.filteredData || []}
          pagination={false}
          rowKey="date"
        />
      </Card>

      {/* Supplier Info Table */}
      <Card>
        <Table
          columns={[
            { title: "Supplier ID", dataIndex: "supplier_id", key: "supplier_id" },
            { title: "Name", dataIndex: "supplier_name", key: "supplier_name" },
            { title: "Line", dataIndex: "line", key: "line" },
            { title: "Contact", dataIndex: "contact_number", key: "contact_number" },
          ]}
          dataSource={supplierInfo}
          pagination={false}
          rowKey="supplier_id"
        />
      </Card>
    </div>
  );
};

export default SupplierById;
