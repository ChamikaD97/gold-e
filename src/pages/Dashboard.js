
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, Divider, Tag, Progress } from "antd";
import CountUp from "react-countup";
import leaf_collection_data from "./data/leaf_collection_data.json";




import {
  getTotalLeaf,
  getLineWiseTotals,
  getLeafTypeRatio,
  getTopSuppliers,
  getSuppliersMarkedXOnDate,
  getNewSuppliersThisMonth, getPreveiousMonthSummaryByOfficer,
  getPreviousMonthSummaryByOfficer

} from "./utils/dashboardMetrics";
import PieLeafTypeChart from "./charts/PieLeafTypeChart";
import BarLineWiseChart from "./charts/BarLineWiseChart";
import icon from "../images/logo.ico"; // Path to your logo image


import achievementsData from "./data/achievements.json";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import TeaLoader from "../components/Loader";
import { Login } from "@mui/icons-material";
import { setAchievements } from "../redux/achievementSlice";
import CircularLoader from "../components/CircularLoader";

const { Title, Text } = Typography;

const cardStyle = {
  background: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
  borderRadius: 12,
  marginBottom: 16
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({});
  const [ratios, setRatios] = useState({});
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [xSuppliers, setXSuppliers] = useState([]);
  const [newSuppliers, setNewSuppliers] = useState([]);
  const [lineTotals, setLineTotals] = useState({});
  const [latestAchievementByOfficer, setLatestAchievementByOfficer] = useState({});
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.loader);
  const achievements = useSelector((state) => state.achievement.achievements);
  const maxTotal = Math.max(...topSuppliers.map(s => s.total));

  useEffect(() => {
    dispatch(showLoader())
    console.log(isLoading);
    console.log("Fetching data...");
    dispatch(setAchievements(achievementsData));

    setData(leaf_collection_data);
    console.log("Data fetched successfully.");
    console.log(isLoading);
  }, []);

  useEffect(() => {
    console.log('achievements', latestAchievementByOfficer.length);
    dispatch(showLoader())
    if (data.length) {
      setTotals({
        today: getTotalLeaf(data, "today"),
        week: getTotalLeaf(data, "week"),
        month: getTotalLeaf(data, "month"),
      });
      setRatios(getLeafTypeRatio(data));
      setTopSuppliers(getTopSuppliers(data));
      setXSuppliers(getSuppliersMarkedXOnDate(data));
      setNewSuppliers(getNewSuppliersThisMonth(data));
      setLineTotals(getLineWiseTotals(data));
      setLatestAchievementByOfficer(getPreviousMonthSummaryByOfficer(achievements))
    }
    setTimeout(() => {
      dispatch(hideLoader());
    }, 1500);

  }, [data]);

  if (!data.length) return <div style={{ padding: 24 }}><Spin size="large" /></div>;

  return (



    isLoading ? <CircularLoader /> : <>



      <div style={{ padding: 2 }}>


        <Card bordered={false} style={cardStyle}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly"
          }}>
            {/* Logo on the Left */}
            <img
              src={icon}
              alt="SLMS"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "1px solid white"
              }}
            />

            {/* Text on the Right */}
            <div style={{
              alignItems: "center",
              justifyContent: "space-evenly"
            }}>
              <div style={{ fontWeight: "bold", color: "#fff", fontSize: 30 }}>SUPER LEAF MONITORING SYSTEM</div>
              <div style={{ fontSize: 16, color: "#ccc" }}>GREENHOUSE PLANTATION (PVT) LTD</div>
            </div>
          </div>
        </Card>


        <Row gutter={[16, 16]}>



          <Col span={8}>
            <Card bordered={false}  style={cardStyle}>
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Today’s Collection</Text>
              <Title level={5} style={{ color: "#fff", margin: 0, fontSize: 20 }}>
                <CountUp end={totals.today} />                </Title>
            </Card>
          </Col>

          <Col span={8}>
            <Card  bordered={false} style={cardStyle}>
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Weekly Collection</Text>
              <Title level={5} style={{ color: "#fff", margin: 0, fontSize: 20 }}>
                <CountUp end={totals.week} />                </Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} style={cardStyle}   >
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Monthly Collection</Text>
              <Title level={5} style={{ color: "#fff", margin: 0, fontSize: 20 }}>
                <CountUp end={totals.month} />                </Title>
            </Card>
          </Col>

        </Row>

        <Row gutter={[16, 16]}>

          {/* <Col span={8}>
            <Card  style={cardStyle} >
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Leaf Type</Text>
              <PieLeafTypeChart ratios={ratios} />
            </Card>
          </Col> */}
          <Col span={8}>
            <Card bordered={false} style={cardStyle}>
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Achievements of Last Month</Text>
              {latestAchievementByOfficer.length && latestAchievementByOfficer.map((ach) => (
                <div
                  key={ach.officer}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    marginBottom: 12, marginTop: 12,
                    borderRadius: 8,
                    background: "rgba(0, 0, 0, 0.6)"
                  }}
                >
                  <div>

                    <Title level={5} style={{ margin: 0, color: "#fff" }}>
                      {ach.officer}
                    </Title>

                  </div>

                  <div style={{ textAlign: "right" }}>
                    <Tag
                      color={
                        ach.progress >= 100 ? "green" :
                          ach.progress >= 90 ? "blue" :
                            "red"
                      }
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        padding: "4px 12px",
                        borderRadius: 6
                      }}
                    >
                      {ach.progress}%
                    </Tag>

                  </div>
                </div>
              ))}

            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} style={cardStyle}>
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Top Suppliers of Last Month</Text>
              {topSuppliers.length && topSuppliers.map((s) => (
                <div
                  key={s.supplier_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    marginTop: 12,
                    marginBottom: 12,
                    borderRadius: 8,
                    background: "rgba(0, 0, 0, 0.6)"
                  }}
                >
                  <div>
                    <Title level={5} style={{ margin: 0, color: "#fff" }}>
                      {s.supplier_id}
                    </Title>

                  </div>
                  <div>
                    <Tag
                      color="success"
                      style={{
                        fontSize: 14,
                        color: "#000",


                        borderRadius: 6
                      }}
                    >
                      {s.line}
                    </Tag>

                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Tag
                      color={

                        "red"
                      }
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        padding: "4px 12px",
                        borderRadius: 6
                      }}
                    >
                      {s.total.toFixed(2)} kg
                    </Tag>

                  </div>
                </div>
              ))}

            </Card>
          </Col>
        </Row>
        {/* <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}><Card style={cardStyle} ><BarLineWiseChart lineTotals={lineTotals} /></Card></Col>
        </Row> */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {/* <Col span={12}>
            <Card title="Marked X Tomorrow" style={cardStyle}>
              {xSuppliers.length ? (
                <ul style={{ paddingLeft: 20 }}>
                  {xSuppliers.map(({ supplierId, line }) => (
                    <li key={supplierId}>
                      <strong>{supplierId}</strong> —  <strong>{line}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">No suppliers will be marked X tomorrow.</Text>
              )}
            </Card>

          </Col>
          <Col span={12}>
            <Card style={cardStyle}>
              {newSuppliers.length ? (
                <ul>{newSuppliers.map(id => <li key={id}>{id}</li>)}</ul>
              ) : (
                <Text type="secondary">No new suppliers registered this month.</Text>
              )}
            </Card>
          </Col> */}
          {/* <Col span={8}>
            <Card style={cardStyle}>
              <Text strong style={{ color: "#fff", fontSize: 20 }}>Top Suppliers of Last Month</Text>
              {latestAchievementByOfficer.length && latestAchievementByOfficer.map((ach) => (
                <div
                  key={ach.officer}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    marginBottom: 12,
                    borderRadius: 8,
                    background: "rgba(0, 0, 0, 0.6)"
                  }}
                >
                  <div>
                    <Title level={5} style={{ margin: 0, color: "#fff" }}>
                      {ach.officer}
                    </Title>
                    <Text type="secondary" style={{ color: "#bbb", fontSize: 13 }}>
                      {ach.month}
                    </Text>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <Tag
                      color={
                        ach.progress >= 100 ? "green" :
                          ach.progress >= 90 ? "blue" :
                            "red"
                      }
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        padding: "4px 12px",
                        borderRadius: 6
                      }}
                    >
                      {ach.progress}%
                    </Tag>
                    <Text type="secondary" style={{ display: "block", fontSize: 13, color: "#ccc" }}>
                      {ach.achieved.toLocaleString()} / {ach.target.toLocaleString()} kg
                    </Text>
                  </div>
                </div>
              ))}

            </Card>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
