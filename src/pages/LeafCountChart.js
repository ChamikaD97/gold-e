import React, { useEffect, useMemo, useState } from "react";
import {
  Card, Col, Row, Select, Typography, Button, Table, Input,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import '../App.css';
import lineIdCodeMap from "../data/lineIdCodeMap.json";
import CircularLoader from "../components/CircularLoader";
import SupplierLeafModal from "../components/SupplierLeafModal";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { API_KEY, getMonthDateRangeFromParts } from "../api/api";

const { Option } = Select;
const { Text } = Typography;

const LeafCountChart = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ year: "2025", month: "All", officer: "All", line: "All", lineCode: '' });
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2025-06-01");
  const [suppliersMarkedTomorrow, setSuppliersMarkedTomorrow] = useState([]);
  const [error, setError] = useState(null);

  const officerLineMap = useSelector((state) => state.officerLine?.officerLineMap || {});
  const monthMap = useSelector((state) => state.commonData?.monthMap);
  const notificationDate = useSelector((state) => state.commonData?.notificationDate);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loader);

  const getLeafRecordsByRoutes = async () => {
    dispatch(showLoader());
    const dateRange = getMonthDateRangeFromParts(filters.year, filters.month);
    const url = `/quiX/ControllerV1/glfdata?k=${API_KEY}&r=${filters.line}&d=${dateRange}`;
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const result = await response.json();

      const transformed = result.map(item => ({
        leaf_type: item["Leaf Type"] === 2 ? "Super" : "Normal",
        supplier_id: item["Supplier Id"],
        date: item["Leaf Date"],
        net_kg: parseInt(item["Net"]),
        lineCode: parseInt(item["Route"]),
        line: filters.lineCode
      }));

      setData(transformed);
      setColData(transformed);
    } catch (err) {
      setError("Failed to load supplier data");
      setData([]);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (filters.month !== "All") getLeafRecordsByRoutes();
  }, [filters.year, filters.month, filters.line, filters.lineCode]);

  const handleSupplierClick = (record) => {
    setSelectedSupplierId(record.supplier_id);
    setSelectedDate(record.date || "2025-06-01");
    setModalOpen(true);
  };

  const getSupplierListMarkedXOnDate = (data) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 6);
    const targetDate = tomorrow.toDateString();

    const supplierMap = {};
    data.forEach(item => {
      supplierMap[item.supplier_id] = [...(supplierMap[item.supplier_id] || []), item];
    });

    return Object.entries(supplierMap).reduce((acc, [supplierId, records]) => {
      const lastDate = new Date(Math.max(...records.map(r => new Date(r.date))));
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 6);
      if (nextDate.toDateString() === targetDate) acc.push(supplierId);
      return acc;
    }, []);
  };

  const setColData = (transformedData) => {
    if (filters.month === "All") {
      setColumns([]);
      setTableData([]);
      return;
    }

    const daysInMonth = new Date(parseInt(filters.year), parseInt(filters.month), 0).getDate();
    const suppliers = [...new Set(
      transformedData.filter(item => item.lineCode === parseInt(filters.line)).map(item => item.supplier_id)
    )].sort();

    const highlightDateMap = {};
    suppliers.forEach(supplierId => {
      const lastDate = new Date(Math.max(...transformedData
        .filter(item => item.supplier_id === supplierId)
        .map(item => new Date(item.date))
      ));
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 6);
      highlightDateMap[supplierId] = nextDate.toDateString();
    });

    const today = new Date();
    const dayCols = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = new Date(`${filters.year}-${filters.month}-${String(day).padStart(2, "0")}`).toDateString();
      const isTodayCol = today.getFullYear() === parseInt(filters.year) &&
        (today.getMonth() + 1).toString().padStart(2, "0") === filters.month &&
        today.getDate() === day;

      return {
        title: `${day}`,
        dataIndex: `day_${day}`,
        key: `day_${day}`,
        align: "center",
        width: 80,
        className: isTodayCol ? "highlight-column" : "",
        render: (value, row) => {
          const isHighlight = highlightDateMap[row.supplier_id] === dateStr;
          let bgColor = "", fontColor = "";

          if (isHighlight) {
            bgColor = "#AA0114"; fontColor = "#fff";
          } else if (value?.type === "Super") {
            bgColor = "#FF9900"; fontColor = "#000";
          } else if (value?.type === "Normal") {
            bgColor = "#003366"; fontColor = "#fff";
          }

          return (
            <div
              className={isHighlight ? "pulse-red animated-cell" : "animated-cell"}
              style={{ backgroundColor: bgColor, color: fontColor, fontWeight: "bold", padding: "4px", borderRadius: "4px" }}
            >
              {isHighlight ? "X" : value?.kg || ""}
            </div>
          );
        }
      };
    });

    const rows = suppliers.map(supplier_id => {
      const row = { supplier_id };
      const entries = transformedData.filter(item => item.supplier_id === supplier_id);
      entries.forEach(item => {
        const day = new Date(item.date).getDate();
        row[`day_${day}`] = { type: item.leaf_type, kg: item.net_kg };
      });
      return row;
    });

    setColumns([
      {
        title: "Supplier ID",
        dataIndex: "supplier_id",
        key: "supplier_id",
        fixed: "left",
        align: "center",
        width: 120,
        render: (text, record) => (
          <Button
            style={{ backgroundColor: "#006623", color: "#fff", border: "none", fontSize: 15, fontWeight: "500" }}
            onClick={() => handleSupplierClick(record)}
          >
            {text}
          </Button>
        )
      },
      ...dayCols
    ]);

    setTableData(rows);
    setSuppliersMarkedTomorrow(getSupplierListMarkedXOnDate(transformedData));
  };

  const filteredTableData = tableData.filter(item =>
    !filters.supplierId || item.supplier_id.toLowerCase().startsWith(filters.supplierId.toLowerCase())
  );

  const uniqueLines = [{ label: "All", value: "All" }, ...lineIdCodeMap.map(l => ({ label: l.lineCode, value: l.lineId }))];
  const filteredLines = filters.officer === "All" ? [] : ["All", ...(officerLineMap[filters.officer] || [])];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const filteredMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    .filter(m => parseInt(filters.year) < currentYear || m <= currentMonth);

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.6)", color: "#fff", borderRadius: 12, marginBottom: 6
  };

  const filterText = `Displaying data for ${filters.month !== "All" ? monthMap[filters.month] : "all months"} ${filters.year}, ` +
    `${filters.officer !== "All" ? `Officer: ${filters.officer}, ` : ""}` +
    `${filters.line !== "All" ? `Line: ${filters.line}` : ""}`;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SupplierLeafModal open={modalOpen} onClose={() => setModalOpen(false)} supplierId={selectedSupplierId} selectedDate={selectedDate} />

      <Card bordered={false} style={cardStyle}>
        <Row gutter={[16, 16]}>
          <Col md={1}>
            <Button icon={<ReloadOutlined />} danger type="primary" block onClick={() => setFilters({ year: "2025", month: "All", officer: "All", line: "All", lineCode: "" })} />
          </Col>
          <Col md={2}>
            <Select
              showSearch
              className="line-select"
              placeholder="Select Line"
              value={filters.line}
              onChange={val => {
                const selectedLine = uniqueLines.find(line => line.value === val);
                const officerMatch = Object.entries(officerLineMap).find(([officer, lines]) => lines.includes(val));
                const matchedOfficer = officerMatch ? officerMatch[0] : "All";
                setFilters(f => ({ ...f, line: val, lineCode: selectedLine?.label || "", officer: matchedOfficer, month: "All" }));
              }}
              style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "#fff", border: "1px solid #333", borderRadius: 6 }}
              dropdownStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
              bordered={false}
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {uniqueLines.map(line => (
                <Option key={line.value} value={line.value}>{line.label}-{line.value}</Option>
              ))}
            </Select>
          </Col>
          <Col md={2}>
            <Select value={filters.year} onChange={val => setFilters(f => ({ ...f, year: val, month: "All" }))}>
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
            </Select>
          </Col>
          <Col md={3}>
            <Select
              value={filters.month}
              onChange={val => setFilters(prev => ({ ...prev, month: val }))}
              style={{ width: "100%" }}
              bordered={false}
            >
              {filteredMonths.map(m => (
                <Option key={m} value={m}>{monthMap[m]}</Option>
              ))}
            </Select>
          </Col>
          <Col md={2}><Text style={{ color: "#fff" }}>Supplier ID</Text></Col>
          <Col md={4}>
            <Input
              value={filters.supplierId || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, supplierId: e.target.value }))}
              style={{ width: "100%", backgroundColor: "rgb(0, 0, 0)", color: "#fff", border: "1px solid #333", borderRadius: 6 }}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {filters.line !== "M" && filters.officer !== "All" && (
        <Card bordered={false} style={cardStyle}>
          <Row gutter={[12, 12]}>
            {filteredLines.filter(l => l !== "All").map(line => (
              <Col xs={8} sm={4} md={4} key={line}>
                <Button
                  type={filters.line === line ? "primary" : "default"}
                  onClick={() => setFilters(prev => ({ ...prev, line, month: "All" }))}
                  style={{ width: "100%", background: filters.line === line ? "#1890ff" : "#000", color: "#fff" }}
                >
                  {line}
                </Button>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {filters.month !== "All" && (
        <>
          <Card bordered={false} style={cardStyle}><Text strong>{filterText}</Text></Card>
          {suppliersMarkedTomorrow.length > 0 && (
            <Card bordered={false} style={{ ...cardStyle, marginTop: 12 }}>
              <Text strong>Suppliers that need to supply leaf after {notificationDate} days</Text>
              <ul style={{ color: "#fff", paddingLeft: 20 }}>
                {suppliersMarkedTomorrow.map(sid => <li key={sid}>{sid}</li>)}
              </ul>
            </Card>
          )}
          <Card bordered={false} style={cardStyle}>
            {isLoading ? <CircularLoader /> : (
              <Table
                className="red-bordered-table"
                columns={columns}
                dataSource={filteredTableData}
                pagination={false}
                scroll={{ x: "max-content" }}
                bordered
                size="small"
                rowKey="supplier_id"
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default LeafCountChart;
