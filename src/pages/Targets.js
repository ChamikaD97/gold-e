import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  Modal,
  Input,
  Form,
  Button,
  Card,
  Select,
  DatePicker,
  notification,
  Row,
  Col,
  Statistic,
} from "antd";
import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";

import {
  ReloadOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MoreOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons"; // Import the icon
const { Option } = Select;
const { TextArea } = Input;
const Targets = () => {
  const [officers, setOfficers] = useState([]);
  const [monthlyTargets, setMonthlyTargets] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState([]);
  const [monthlyValue, setMonthlyValue] = useState();
  const [target, setTarget] = useState("");

  const [summaryData, setSummaryData] = useState({
    totalTargets: 0,
    officersCount: 0,
    averageTarget: 0,
    currentMonthTarget: 0,
  });

  const tot = useRef();

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
  }, []);

  const handleSearch = (officer) => {
    setSelectedOfficer(officer);
    if (!officer) {
      setFilteredData(monthlyTargets);
      return;
    }

    const filtered = monthlyTargets.filter(
      (item) => item.officer_id === officer.id
    );
    setFilteredData(filtered);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAchievementModalVisible, setIsAchievementModalVisible] =
    useState(false);

  const [isDetailsModelVisible, setIsDetailsModelVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [achievementForm] = Form.useForm();

  const handleAddNew = () => {
    setIsAchievementModalVisible(true);
  };

  const closeAchievementModal = () => {
    setIsAchievementModalVisible(false);
    achievementForm.resetFields();
  };

  const showDataModel = () => {
    setIsDetailsModelVisible(true);
  };

  const closeDataModel = () => {
    setIsDetailsModelVisible(false);
  };

  const getMonthData = (month) => {
    let monthId = month.id;
    if (!monthId) {
      setFilteredData(monthlyTargets);
      return;
    }
    if (filteredData.length > 1) {
      let total = 0;
      filteredData.forEach((item) => {
        total += Number(item[monthId]) || 0;
      });

      const monthName = months.find((m) => m.id === monthId)?.name;
      console.log(`Factory 2025 ${monthName} Target : ${total}`);

      setTarget(`Factory 2025 ${month.name} Target : ${total}`);
      setMonthlyValue(total)
      console.log(total);
    } else {
      filteredData.forEach((item) => {
        const tot = months.find((m) => m.id === monthId)?.name;
        setMonthlyValue(item[monthId]);
        setTarget(` ${month.name} Target ${item[monthId]}`);
      });
    }
    showDataModel();
  };

  const handleAchievementSubmit = async (values) => {
    console.log("12367817812", values);

    const date = new Date(values.date);
    const month = date
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
    const year = date.getFullYear();
    const data = {
      officer_id: values.officer,
      date: values.date,
      month,
      year,
      line: values.line,
      value: parseFloat(values.target),
    };
    console.log(data);

    await axios.post("http://localhost:5000/api/achievements", data);
    closeAchievementModal();
    fetchMonthlyTargets(); // Refresh data after submission
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Jan", dataIndex: "jan", key: "jan" },
    { title: "Feb", dataIndex: "feb", key: "feb" },
    { title: "Mar", dataIndex: "mar", key: "mar" },
    { title: "Apr", dataIndex: "apr", key: "apr" },
    { title: "May", dataIndex: "may", key: "may" },
    { title: "Jun", dataIndex: "jun", key: "jun" },
    { title: "Jul", dataIndex: "jul", key: "jul" },
    { title: "Aug", dataIndex: "aug", key: "aug" },
    { title: "Sep", dataIndex: "sep", key: "sep" },
    { title: "Oct", dataIndex: "oct", key: "oct" },
    { title: "Nov", dataIndex: "nov", key: "nov" },
    { title: "Dec", dataIndex: "dece", key: "dece" },
    { title: "Total Target", dataIndex: "total_target", key: "total_target" },
  ];
  const months = [
    { id: "jan", name: "January" },
    { id: "feb", name: "February" },
    { id: "mar", name: "March" },
    { id: "apr", name: "April" },
    { id: "may", name: "May" },
    { id: "jun", name: "June" },
    { id: "jul", name: "July" },
    { id: "aug", name: "August" },
    { id: "sep", name: "September" },
    { id: "oct", name: "October" },
    { id: "nov", name: "November" },
    { id: "dece", name: "December" }, // matches your key: 'dece'
  ];

  return (
    <div>
      {/* Summary Cards Section */}

      {/* Main Content Card */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid black",
            paddingBottom: "3px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomButton
              text="Refresh"
              onClick={() => {
                fetchMonthlyTargets();
                fetchOfficers();
                setSelectedOfficer();
              }}
              icon={<ReloadOutlined />}
              type="rgba(145, 0, 0, 0.78)"
            />
          </div>

          <h2 style={{ margin: 0 }}>
            {selectedOfficer?.name ? selectedOfficer?.name : "2025 Targets"}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <CustomButton
              text="Add New"
              icon={<PlusCircleOutlined />}
              onClick={() => handleAddNew()}
              type="rgba(21, 155, 0, 0.79)"
            />
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid black",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between", // Distribute buttons evenly
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "100%",
            }}
          >
            {months.map((month) => (
              <CustomButton
                key={month.id}
                text={month.name}
                onClick={() => getMonthData(month)} // ✅ Pass the month id
                type="rgba(0, 0, 0, 0.78)"
              />
            ))}
          </div>
        </div>
        <div
           style={{
            display: "flex",
            justifyContent: "space-between", // Distribute buttons evenly
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "10px",
            marginTop: "10px",
            width: "100%",        borderBottom: "1px solid black",
            paddingBottom: "10px",
          }}
        >
          <CustomButton
            text="All"
          
            
            type="rgba(21, 155, 0, 0.79)"
          />
          {officers.map((off) => (
            <CustomButton
            text={off.name}
            type="rgba(0, 10, 145, 0.78)"
            icon={<UserOutlined />}
            onClick={() => handleSearch(off)}
          />
          ))}
          <CustomButton
            text="MALIDUWA"
            type="rgba(0, 0, 0, 0.79)"
          />
        </div>

       
        <div
          style={{
            maxHeight: "calc(100vh - 200px)", // Adjust height to fit window
            overflowY: "auto", // Enable vertical scrolling for the table only
            borderRadius: "15px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            padding: "10px",
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            onRow={(record) => ({})}
            pagination={true} // Disable pagination to show full data with scrolling
            scroll={{ x: true }}
            bordered
          />
        </div>
      </Card>

      <Modal
        title={selectedOfficer ? selectedOfficer.name : ""}
        visible={isDetailsModelVisible}
        onCancel={closeDataModel}
        footer={null}
        centered
      >
        <div
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          {target}
        </div>
        <div
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          Gold Leaf(50%) -  {monthlyValue*0.5}
        </div>
        <div
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          B(60%) -  {monthlyValue*0.6}
        </div>
        <div
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          BB(10%) -  {monthlyValue*0.1}
        </div>
        <div
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          P(30%) -  {monthlyValue*0.3}
        </div>
      </Modal>

      <Modal
        title="Add Achievement"
        visible={isAchievementModalVisible}
        onCancel={closeAchievementModal}
        footer={null}
        centered
      >
        <Form
          layout="vertical"
          form={achievementForm}
          onFinish={handleAchievementSubmit}
          onReset={closeAchievementModal}
        >
          <Form.Item
            label="Officer"
            name="officer"
            rules={[{ required: true, message: "Please select an officer!" }]}
          >
            <Select placeholder="Select Officer">
              {officers.map((off) => (
                <Option key={off.id} value={off.id}>
                  {off.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please pick a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Line"
            name="line"
            rules={[{ required: true, message: "Please enter the line!" }]}
          >
            <Input placeholder="Enter line name" />
          </Form.Item>

          <Form.Item
            label="Target"
            name="target"
            rules={[
              { required: true, message: "Please enter the target value!" },
            ]}
          >
            <Input
              bordered={true}
              type="number"
              placeholder="Enter target value"
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button danger type="default" htmlType="reset">
                Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Targets;
