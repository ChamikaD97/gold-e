import React, { useEffect, useMemo, useState } from "react";
import {
  Card, Col, Row, Select, Typography, Button
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import achievementsData from "./data/achievements.json";

const { Option } = Select;
const { Text } = Typography;

const monthMap = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December"
};

const officerLineMap = {
  Ajith: ["MT", "PH", "PW (PRIVATE)", "PP(PRIVATE)", "GO", "UG", "MP", "BM", "TP", "UP"],
  Chamod: ["NG(PRIVATE)", "S(PRIVATE)", "DR"],
  Udara: ["J", "T", "SELF-2", "TK", "HA", "D"],
  Gamini: ["SELF", "DG", "ML", "MV"],
  Udayanga: ["BA", "BK", "K", "PT", "PK", "A", "KM", "N", "DM"]
};

const LeafCountChart = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ year: "2024", month: "All", officer: "All", line: "All" });

  useEffect(() => {
    setData(achievementsData);
  }, []);

  const filteredData = useMemo(() => {
    let result = data.filter(d => d.month.startsWith(filters.year));
    if (filters.month !== "All") result = result.filter(d => d.month === `${filters.year}-${filters.month}`);
    if (filters.officer !== "All") result = result.filter(d => d.field_officer === filters.officer);
    if (filters.line !== "All") result = result.filter(d => d.line_id === filters.line);
    return result;
  }, [data, filters]);

  const uniqueOfficers = ["All", ...new Set(data.map(d => d.field_officer))];
  const filteredLines = filters.officer === "All" ? [] : ["All", ...(officerLineMap[filters.officer] || [])];
  const uniqueMonths = ["All", ...new Set(data.filter(d => d.month.startsWith(filters.year)).map(d => d.month.slice(5)))];

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

        <Card bordered={false} className="fade-in" style={{ ...cardStyle }}>
          <Row gutter={[16, 16]}>
            <Col md={2}>
              <Button
                icon={<ReloadOutlined />}
                danger
                type="primary"
                block
                onClick={() => setFilters({ year: "2024", month: "All", officer: "All", line: "All" })}
              >
                Reset
              </Button>
            </Col>

            <Col md={2}>
              <Select
                value={filters.year}
                onChange={val => setFilters(f => ({ ...f, year: val, month: "All" }))}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 6
                }}
                dropdownStyle={{ backgroundColor: "rgba(255, 255, 255, 0.6)", color: "rgba(238, 255, 0, 0.6)" }}
                bordered={false}
                className="custom-select-white"
              >
                <Option value="2024">2024</Option>
                <Option value="2025">2025</Option>
              </Select>
            </Col>

            {uniqueOfficers.filter(o => o !== "All").map(o => (
              <Col xs={8} sm={4} md={4} key={o}>
                <Button
                  type={filters.officer === o ? "primary" : "default"}
                  onClick={() => setFilters(prev => ({ ...prev, officer: o, line: "All", month: "All" }))}
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

        {filters.officer !== "All" && (
          <Card bordered={false} className="fade-in" style={cardStyle}>
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              {filteredLines.filter(l => l !== "All").map((line) => (
                <Col xs={8} sm={4} md={4} key={line}>
                  <Button
                    type={filters.line === line ? "primary" : "default"}
                    onClick={() => setFilters(prev => ({ ...prev, line, month: "All" }))}
                    style={{
                      width: "100%",
                      background: filters.line === line ? "#1890ff" : "#000",
                      color: "#fff",
                      borderColor: "#333"
                    }}
                  >
                    {line}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {filters.line !== "All" && (
          <Card bordered={false} className="fade-in" style={cardStyle}>
            <Row gutter={[12, 12]}>
              {uniqueMonths.filter(m => m !== "All").sort().map(m => (
                <Col xs={8} sm={4} md={4} key={m}>
                  <Button
                    type={filters.month === m ? "primary" : "default"}
                    onClick={() => setFilters(prev => ({ ...prev, month: m }))}
                    style={{
                      width: "100%",
                      background: filters.month === m ? "#1890ff" : "#000",
                      color: "#fff",
                      borderColor: "#333"
                    }}
                  >
                    {monthMap[m]}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {filters.month !== "All" && filters.officer !== "All" && filters.line !== "All" && (
          <Card bordered={false} className="fade-in" style={cardStyle}>
            <Text strong style={{ color: "#fff", fontSize: 20 }}>{filterText}</Text>
          </Card>
        )}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .fade-in {
            animation: fadeIn 0.6s ease-in-out;
          }

          .custom-select-white .ant-select-selector {
            color: #fff !important;
          }

          .custom-select-white .ant-select-arrow {
            color: #fff !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LeafCountChart;
