import React, { useEffect, useState } from "react";
import { Table, Modal, Input, Card, Row, Col } from "antd";
import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { engines, enginesClasses, setSearch } from "../redux/engineSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { setSelectedKey } from "../redux/authSlice";
import {
  ReloadOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons"; // Import the icon
const FieldOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [monthlyTargets, setMonthlyTargets] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState([]);
  const [monthlyValue, setMonthlyValue] = useState();
  const [target, setTarget] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [achievements, setIsAchievements] = useState([]);
const navigate = useNavigate()
  const [summaryData, setSummaryData] = useState({
    totalTargets: 0,
    officersCount: 0,
    averageTarget: 0,
    currentMonthTarget: 0,
  });

  const fetchOfficers = () => {
    axios.get("http://localhost:5000/api/officers").then((res) => {
      setOfficers(res.data);
      updateSummaryData(res.data.length);
    });
  };

  const fetchMonthlyTargets = () => {
    axios.get("http://localhost:5000/api/monthly-target").then((res) => {
      setFilteredData(res.data);
      setMonthlyTargets(res.data);
      calculateTotals(res.data);
    });
  };

  const fetchAchievements = () => {
    axios.get("http://localhost:5000/api/achievements").then((res) => {
      setFilteredData(res.data);
      setIsAchievements(res.data);
    });
  };

  const calculateTotals = (data) => {
    if (!data || data.length === 0) return;

    const totals = {
      totalTargets: 0,
      currentMonthTarget: 0,
    };

    // Calculate totals
    data.forEach((item) => {
      totals.totalTargets += item.total_target || 0;
    });

    // Get current month target (simplified example)
    const currentMonth = new Date()
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
    const currentYear = new Date().getFullYear();

    const currentTarget = data.find(
      (item) => item.month === currentMonth && item.year === currentYear
    );

    totals.currentMonthTarget = currentTarget ? currentTarget.value : 0;

    setSummaryData((prev) => ({
      ...prev,
      totalTargets: totals.totalTargets,
      currentMonthTarget: totals.currentMonthTarget,
      averageTarget: totals.totalTargets / (data.length > 0 ? data.length : 1),
    }));
  };

  const updateSummaryData = (officersCount) => {
    setSummaryData((prev) => ({
      ...prev,
      officersCount,
    }));
  };

  useEffect(() => {
    fetchOfficers();
    fetchMonthlyTargets();
    fetchAchievements();
  }, []);

  return (
    <div>
      <div style={{ minHeight: 360, zIndex: 2 }}>
        <Row gutter={25} style={{ marginBottom: 15 }}>
          <Col span={12}>
            <Card onClick={()=>navigate('/fieldOfficers/1')} title={"Mr.Ajith"}></Card>
          </Col>

          <Col span={12}>
            <Card title={"Mr.Chamod"}></Card>
          </Col>
        </Row>
        <Row gutter={25} style={{ marginBottom: 15 }}>
          <Col span={12}>
            <Card title={"Mr.Gamini"}>Current month target</Card>
          </Col>

          <Col span={12}>
            <Card title={"Mr.Udara"}></Card>
          </Col>
        </Row>
        <Row gutter={25} style={{ marginBottom: 15 }}>
          <Col span={12}>
            <Card title={"Mr.Isuru"}></Card>
          </Col>

          <Col span={12}>
            <Card title={"Malinduwa"}></Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FieldOfficers;
