import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select, Typography, Button, Table, Space, Progress } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // ✅ Add this
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

import achievementsData from "./data/achievements.json";
import CountUp from "react-countup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // ✅ Register this
  ArcElement,
  Tooltip,
  Legend
);

const { Option } = Select;
const { Title, Text } = Typography;

const monthMap = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December"
};

const officerLineMap = {
  Ajith: ["MT", "PH", "PW (PRIVATE)", "PP(PRIVATE)", "GO", "UG", "MP", "BM", "TP", "UP"],
  Chamod: ["NG(PRIVATE)", "S(PRIVATE)", "DR"],
  Udara: ["J", "T", "SELF-2", "TK", "HA", "D"],
  Gamini: ["SELF", "DG", "ML", "MV"],
  Udayanga: ["BA", "BK", "K", "PT", "PK", "A", "KM", "N", "DM"]
};

const FactoryTargetAchievemenets = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("All");
  const [officer, setOfficer] = useState("All");
  const [line, setLine] = useState("All");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setData(achievementsData);
  }, []);

  useEffect(() => {
    let filtered = data.filter((item) => item.month.startsWith(year));
    if (month !== "All") {
      filtered = filtered.filter((item) => item.month === `${year}-${month}`);
    }
    if (officer !== "All") {
      filtered = filtered.filter((item) => item.field_officer === officer);
    }
    if (line !== "All") {
      filtered = filtered.filter((item) => item.line_id === line);
    }
    setFilteredData(filtered);
  }, [data, year, month, officer, line]);

  const totalTarget = filteredData.reduce((sum, d) => sum + d.target, 0);
  const totalAchieved = filteredData.reduce((sum, d) => sum + d.achieved, 0);
  const totalAchievedSuper = filteredData.reduce((sum, d) => sum + d.achievedSuper, 0);
  const achievementRate = totalTarget ? ((totalAchieved / totalTarget) * 100).toFixed(2) : 0;
  const monthlySummary = {};

  filteredData.forEach(({ month, target, achieved }) => {
    if (!monthlySummary[month]) {
      monthlySummary[month] = { target: 0, achieved: 0 };
    }
    monthlySummary[month].target += target;
    monthlySummary[month].achieved += achieved;
  });

  const monthlyChartData = Object.entries(monthlySummary).map(([month, values]) => ({
    month,
    ...values
  }));

  const lineLabels = monthlyChartData.map((d) => {
    const monthNum = d.month.slice(5); // get MM
    const name = monthMap[monthNum];
    return name;
  });
  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Target",
        data: monthlyChartData.map((d) => d.target),
        fill: false,
        borderColor: "#8884d8",
        tension: 0.3
      },
      {
        label: "Achieved",
        data: monthlyChartData.map((d) => d.achieved),
        fill: false,
        borderColor: "#52c41a",
        tension: 0.3
      }
    ]
  };

  const officerMap = {};
  filteredData.forEach((d) => {
    if (!officerMap[d.field_officer]) {
      officerMap[d.field_officer] = { target: 0, achieved: 0 };
    }
    officerMap[d.field_officer].target += d.target;
    officerMap[d.field_officer].achieved += d.achieved;
  });

  const officerChartData = Object.entries(officerMap).map(([officer, stats]) => ({
    officer,
    ...stats,
    percent: stats.target ? ((stats.achieved / stats.target) * 100).toFixed(2) : 0
  }));

  const barData = {
    labels: officerChartData.map((d) => d.officer),
    datasets: [
      {
        label: "Achievement %",
        data: officerChartData.map((d) => d.percent),
        backgroundColor: "#1890ff"
      }
    ]
  };

  const pieData = {
    labels: officerChartData.map((d) => d.officer),
    datasets: [
      {
        label: "Achievement Share",
        data: officerChartData.map((d) => d.achieved),
        backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"]
      }
    ]
  };

  const columns = [
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Line", dataIndex: "line_id", key: "line_id" },
    { title: "Officer", dataIndex: "field_officer", key: "field_officer" },
    { title: "Target", dataIndex: "target", key: "target" },
    { title: "Achieved", dataIndex: "achieved", key: "achieved" },
    {
      title: "Achieved %",
      key: "percent",
      render: (record) => `${((record.achieved / record.target) * 100).toFixed(2)}%`
    }
  ];

  const uniqueOfficers = ["All", ...new Set(data.map((d) => d.field_officer))];
  const filteredLines = officer === "All"
    ? ["All", ...new Set(data.map((d) => d.line_id))]
    : ["All", ...(officerLineMap[officer] || [])];
  const uniqueMonths = ["All", ...new Set(data.filter((d) => d.month.startsWith(year)).map((d) => d.month.slice(5)))];

  const filterText = `Displaying data for ${month !== "All" ? monthMap[month] : "all months"} ${year}, ` +
    `${officer !== "All" ? `Officer: ${officer}, ` : ""}` +
    `${line !== "All" ? `Line: ${line}` : ""}`.trim();

  return (
    <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.06)", boxShadow: "none" }}>
      <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.48)", borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={12} md={2}>
            <Button icon={<ReloadOutlined />} danger type="primary" block onClick={() => { setYear("2024"); setMonth("All"); setOfficer("All"); setLine("All"); }}>Reset</Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select value={year} onChange={(val) => { setYear(val); setMonth("All"); }} style={{ width: "100%" }}>
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select value={officer} onChange={(val) => { setOfficer(val); setLine("All"); }} style={{ width: "100%" }}>
              {uniqueOfficers.map((o) => <Option key={o} value={o}>{o}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select value={line} onChange={(val) => setLine(val)} style={{ width: "100%" }}>
              {filteredLines.map((l) => <Option key={l} value={l}>{l}</Option>)}
            </Select>
          </Col>
        </Row>

        {/* Month buttons row below */}
        <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
          {uniqueMonths
            .filter((m) => m !== "All")
            .sort() // ensure order from Jan to Dec
            .map((m, index) => (
              <Col xs={8} sm={4} md={4} key={m}>
                <Button
                  type={month === m ? "primary" : "default"}
                  onClick={() => setMonth(m)}
                  style={{ width: "100%" }}
                >
                  {monthMap[m]}
                </Button>
              </Col>
            ))}
        </Row>





      </Card>

      <Text style={{ display: "block", marginBottom: 16, fontSize: 16, fontWeight: 500 }}>{filterText}</Text>

      <Row gutter={[16, 16]} align="middle">

        {/* left normal */}




        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: 12, marginBottom: 6 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Text style={{ fontSize: 16 }} strong>Total Target</Text>
              <Title level={5} style={{ margin: 0 }}>
                <CountUp end={totalTarget} duration={1.5} separator="," />
              </Title>
            </div>
          </Card>

        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: 12, marginBottom: 6 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Text style={{ fontSize: 16 }} strong>Target Achievement</Text>
              <Title level={5} style={{ margin: 0 }}>
                <CountUp end={totalAchieved} duration={1.5} separator="," />
              </Title>
            </div>
          </Card>

        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: 12, marginBottom: 6 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Text style={{ fontSize: 16 }} strong>Super Leaf Target</Text>
              <Title level={5} style={{ margin: 0 }}>
                <CountUp end={totalTarget * 0.5} duration={1.5} separator="," />
              </Title>
            </div>
          </Card>

        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: 12, marginBottom: 6 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Text style={{ fontSize: 16 }} strong>Super Leaf Achievement</Text>
              <Title level={5} style={{ margin: 0 }}>
                <CountUp end={totalAchievedSuper} duration={1.5} separator="," />
              </Title>
            </div>
          </Card>

        </Col>

      </Row>
      <Row gutter={[16, 16]} align="middle">






        <Col xs={24} sm={12} md={12}>
          <Card
            bordered={false}
            style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: 12, marginBottom: 6 }}
          >
            <Text strong style={{ fontSize: 16 }}>Overall Progress</Text>
            <div style={{ marginTop: 16 }}>

              <Progress
                percent={parseFloat(achievementRate)}
                strokeColor="#52c41a"
                strokeWidth={16} // 🔥 Increase bar height here
                showInfo
                format={(percent) => (
                  <span style={{ fontSize: 30, fontWeight: 600 }}>
                    <CountUp end={percent} duration={1.2} decimals={0} suffix="%" />
                  </span>
                )}
              />

            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12}>
          <Card
            bordered={false}
            style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: 12, marginBottom: 6 }}
          >
            <Text strong style={{ fontSize: 16 }}>Super Leaf Progress</Text>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={parseFloat(((totalAchievedSuper / (totalTarget * 2)) * 100).toFixed(2))}
                strokeColor="#faad14"
                strokeWidth={16} // ← Increased height of the bar
                showInfo
                format={(percent) => (
                  <span style={{ fontSize: 30, fontWeight: 600 }}>
                    <CountUp end={percent} duration={1.2} decimals={0} suffix="%" />
                  </span>
                )}
              />
            </div>
          </Card>
        </Col>


        <Col xs={24} md={24}>
          <Card
            title=" Monthly Target vs Achievement"
            bordered={false}
            style={{ borderRadius: 12, background: "rgba(255, 255, 255, 0.6)", marginBottom: 16 }}
          >
            <Line data={lineChartData} />
          </Card>
        </Col>




      </Row>




    </Card>
  );
};

export default FactoryTargetAchievemenets;
