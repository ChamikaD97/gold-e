import React, { useEffect, useMemo, useState } from "react";
import {
  Card, Col, Row, Select, Typography, Button, Table,
  Tooltip
} from "antd";
import { MinusCircleFilled, PlusCircleFilled, ReloadOutlined } from "@ant-design/icons";
import leaf_collection_data from "./data/leaf_collection_data.json";
import '../App.css'; // Import your CSS file here
import { getSuppliersMarkedXOnDate } from "./utils/dashboardMetrics";
import { setNotificationDate, setLeafRound } from "../redux/commonDataSlice";



import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;
const { Text } = Typography;





const LeafCountChart = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ year: "2025", month: "All", officer: "All", line: "All" });
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const officerLineMap = useSelector((state) => state.officerLine?.officerLineMap || {});
  const monthMap = useSelector((state) => state.commonData?.monthMap);
  const allLines = useSelector(state => state.officerLine.allLines || []);

  const [suppliersMarkedTomorrow, setSuppliersMarkedTomorrow] = useState([]);
  const notificationDate = useSelector((state) => state.commonData?.notificationDate);
  const dispatch = useDispatch()

  useEffect(() => {
    setData(leaf_collection_data);
  }, []);

  const filteredData = useMemo(() => {
    let result = data.filter(d => d.date.startsWith(filters.year));
    if (filters.month !== "All") result = result.filter(d => d.date.slice(5, 7) === filters.month);
    if (filters.officer !== "All") result = result.filter(d => (officerLineMap[filters.officer] || []).includes(d.line));
    if (filters.line !== "All") result = result.filter(d => d.line === filters.line);
    return result;
  }, [data, filters]);

  const latestRecordedDate = useMemo(() => {
    if (!filteredData.length) return null;
    return new Date(Math.max(...filteredData.map(d => new Date(d.date))));
  }, [filteredData]);

  function getSupplierListMarkedXOnDate(data) {


    const tomorrowDateStr = new Date();
    tomorrowDateStr.setDate(tomorrowDateStr.getDate() + 6);
    const targetDate = tomorrowDateStr.toDateString();

    const supplierMap = {};

    // Group records by supplier_id
    data.forEach(item => {
      const current = supplierMap[item.supplier_id] || [];
      supplierMap[item.supplier_id] = [...current, item];
    });

    const result = [];
    const targetDateStr = new Date(targetDate).toDateString();

    for (const supplierId in supplierMap) {
      const records = supplierMap[supplierId];
      const lastDate = new Date(Math.max(...records.map(r => new Date(r.date))));
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 6);

      if (nextDate.toDateString() === targetDateStr) {
        result.push(supplierId);
      }
    }

    return result;
  }

  useEffect(() => {
    if (filters.month !== "All") {
      const daysInMonth = new Date(parseInt(filters.year), parseInt(filters.month), 0).getDate();

      // 1. Build supplier => highlight date map
      const allLineSuppliers = data
        .filter(item => item.line === filters.line)
        .map(item => item.supplier_id);

      const suppliers = Array.from(new Set(allLineSuppliers)).sort();

      const highlightDateMap = {};
      suppliers.forEach(supplierId => {
        const supplierRecords = data.filter(item => item.supplier_id === supplierId);
        if (supplierRecords.length > 0) {
          const lastDate = new Date(Math.max(...supplierRecords.map(item => new Date(item.date))));
          const nextDate = new Date(lastDate);
          nextDate.setDate(nextDate.getDate() + 6);
          highlightDateMap[supplierId] = nextDate.toDateString();
        }
      });


      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
      const todayDate = today.getDate();

      const dayCols = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayKey = `day_${day}`;

        const isTodayCol =
          todayYear === parseInt(filters.year) &&
          todayMonth === filters.month &&
          todayDate === day;

        return {
          title: `${day}`, // keep title simple, no styling here
          dataIndex: dayKey,
          key: dayKey,
          align: "center",
          width: 80,
          className: isTodayCol ? "highlight-column" : "", // ✅ assign custom class
          render: (value, row) => {
            const supplierId = row.supplier_id;
            const cellDate = new Date(`${filters.year}-${filters.month}-${String(day).padStart(2, "0")}`);
            const isHighlight = highlightDateMap[supplierId] === cellDate.toDateString();

            let bgColor = "";
            let fontColor = "";
            if (isHighlight) {
              bgColor = "#AA0114"; // red
              fontColor = '#fff'; // white
            } else if (value?.type === "Super") {
              bgColor = "#FF9900"; // gold

              fontColor = '#000'; // white
            } else if (value?.type === "Normal") {
              bgColor = "#003366"; // sky blue
              fontColor = '#fff'; // white
            }

            return (
              <div
                className={isHighlight ? "pulse-red animated-cell" : "animated-cell"}
                style={{
                  backgroundColor: bgColor,
                  color: fontColor,
                  fontWeight: "bold",
                  padding: "4px",
                  borderRadius: "4px"
                }}
              >
                {isHighlight ? "X" : value?.kg || ""}
              </div>

            );
          }
        };
      });


      // 3. Build row data
      const dataSource = suppliers.map(supplierId => {
        const row = { supplier_id: supplierId };
        const records = filteredData.filter(item => item.supplier_id === supplierId);
        records.forEach(item => {
          const day = new Date(item.date).getDate();
          row[`day_${day}`] = {
            type: item.leaf_type,
            kg: item.net_kg
          };
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
          width: 120
        },
        ...dayCols
      ]);

      setTableData(dataSource);


      // Call your function with current filtered data
      const markedTomorrow = getSupplierListMarkedXOnDate(filteredData);
      setSuppliersMarkedTomorrow(markedTomorrow);


    } else {
      setColumns([]);
      setTableData([]);
    }
  }, [filteredData, filters.month, 6]);


  const uniqueOfficers = ["All", ...Object.keys(officerLineMap)];
  const filteredLines = filters.officer === "All" ? [] : ["All", ...(officerLineMap[filters.officer] || [])];
  const uniqueMonths = ["All", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  const filteredMonths = uniqueMonths
    .filter(m => m !== "All")
    .filter(m => {
      if (parseInt(filters.year) < currentYear) return true;
      return m <= currentMonth;
    })
    .sort();

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    borderRadius: 12,
    marginBottom: 6
  };

  const filterText = `Displaying data for ${filters.month !== "All" ? monthMap[filters.month] : "all months"} ${filters.year}, ` +
    `${filters.officer !== "All" ? `Officer: ${filters.officer}, ` : ""}` +
    `${filters.line !== "All" ? `Line: ${filters.line}` : ""}`.trim();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "0 0 auto", marginBottom: 16 }}>

        {/* Reset + Year + Officers */}
        <div key={`filters-${filters.year}-${filters.officer}`}>
          <Card bordered={false} style={{ ...cardStyle }}>
            <Row gutter={[16, 16]}>
              <Col md={1}>
                <Button
                  icon={<ReloadOutlined />}
                  danger
                  type="primary"
                  block
                  onClick={() => setFilters({ year: "2025", month: "All", officer: "All", line: "All" })}
                >

                </Button>
              </Col>





              <Col md={2}>
                <Select
                  showSearch
                  className="line-select"
                  placeholder="Select Line"
                  value={filters.line}
                  onChange={val => {
                    const officerMatch = Object.entries(officerLineMap).find(
                      ([officer, lines]) => lines.includes(val)
                    );
                    const matchedOfficer = officerMatch ? officerMatch[0] : "All";
                    setFilters(f => ({
                      ...f,
                      line: val,
                      officer: matchedOfficer,
                      month: "All"
                    }));
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    border: "1px solid #333",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                  dropdownStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    cursor: "pointer"
                  }}
                  bordered={false}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {allLines.map(line => (
                    <Option key={line} value={line}>{line}</Option>
                  ))}
                </Select>
              </Col>
              <Col md={2}>
                <Select
                  className="year-select"
                  value={filters.year}
                  onChange={val => setFilters(f => ({ ...f, year: val, month: "All" }))}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    border: "1px solid #333",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                  dropdownStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    color: "#fff"
                  }}
                  bordered={false}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="2024">2024</Option>
                  <Option value="2025">2025</Option>
                </Select>
              </Col>
              {filteredMonths.filter(m => m !== "All").sort().map(m => (
                <Col xs={8} sm={4} md={2} key={m}>
                  <Button
                    type={filters.month === m ? "primary" : "default"}
                    onClick={() => setFilters(prev => ({ ...prev, month: m }))}
                    style={{ width: "100%", background: filters.month === m ? "#1890ff" : "#000", color: "#fff", borderColor: "#333" }}
                  >
                    {monthMap[m]}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </div>

        {/* Line filter */}
        {filters.line !== "M" && filters.officer !== "All" && (
          <div key={`line-${filters.officer}`}>
            <Card bordered={false} className="fade-in" style={cardStyle}>
              <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                {filteredLines.filter(l => l !== "All").map(line => (
                  <Col xs={8} sm={4} md={4} key={line}>
                    <Button
                      type={filters.line === line ? "primary" : "default"}
                      onClick={() => setFilters(prev => ({ ...prev, line, month: "All" }))}
                      style={{ width: "100%", background: filters.line === line ? "#1890ff" : "#000", color: "#fff", borderColor: "#333" }}
                    >
                      {line}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>
        )}

        {/* Month filter */}
        {/* {filters.line !== "All" && (
          <div key={`month-${filters.line}`}>
            <Card bordered={false} className="fade-in" style={cardStyle}>
              <Row gutter={[12, 12]}>
                {uniqueMonths.filter(m => m !== "All").sort().map(m => (
                  <Col xs={8} sm={4} md={2} key={m}>
                    <Button
                      type={filters.month === m ? "primary" : "default"}
                      onClick={() => setFilters(prev => ({ ...prev, month: m }))}
                      style={{ width: "100%", background: filters.month === m ? "#1890ff" : "#000", color: "#fff", borderColor: "#333" }}
                    >
                      {monthMap[m]}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>
        )} */}

        {/* Filter Summary */}
        {filters.month !== "All" && filters.officer !== "All" && filters.line !== "All" && (
          <div key={`summary-${filters.month}`}>
            <Card bordered={false} className="fad-in" style={cardStyle}>
              <Text strong style={{ color: "#fff", fontSize: 20 }}>{filterText}</Text>
            </Card>
          </div>
        )}
        {filters.month !== "All" && suppliersMarkedTomorrow.length > 0 && (
          <Card bordered={false} className="fade-n" style={{ ...cardStyle, marginTop: 12 }}>

            <Text strong style={{ color: "#fff", fontSize: 20 }}>Suppliers that need to supply leaf after {notificationDate} days</Text>
            <ul style={{ color: "#fff", paddingLeft: 20 }}>
              {suppliersMarkedTomorrow.map(sid => (
                <li key={sid}>{sid}</li>
              ))}
            </ul>
          </Card>
        )}
        {/* Table */}
        {filters.month !== "All" && (
          <div key={`table-${filters.month}`}>
            <Card bordered={false} className="d-in" style={cardStyle}>
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: "max-content" }}
                bordered
                size="small"
                rowKey="supplier_id"
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );

};

export default LeafCountChart;
