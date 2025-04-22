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
} from "antd";
import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";

import {
  ReloadOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MoreOutlined,
  UserAddOutlined,
} from "@ant-design/icons"; // Import the icon
const { Option } = Select;
const { TextArea } = Input;
const Targets = () => {
  const [officers, setOfficers] = useState([]);

  const [monthlyTargets,setMonthlyTargets] = useState([]);

  const [selectedOfficer, setSelectedOfficer] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [total, setTotal] = useState('');
  const [selectedLine, setSelectedLine] = useState("");
  const [target, setTarget] = useState("");
const tot = useRef()
  const fetchOfficers = () => {
    axios
      .get("http://localhost:5000/api/officers")
      .then((res) => setOfficers(res.data));
  };

  const fetchMonthlyTargets = () => {
    axios.get("http://localhost:5000/api/monthly-target").then((res) => {
      setFilteredData(res.data);
      setMonthlyTargets(res.data);
    });
  };
 



  useEffect(() => {
    fetchOfficers();
    fetchMonthlyTargets();
  }, []);
  const handleSearch = (officer) => {
    setSelectedOfficer(officer)
    if (!officer) {
      setFilteredData(monthlyTargets);
      return;
    }

    const filtered = monthlyTargets.filter(
      (item) => item.officer_id === officer.id
    );
  //   let totalValue = 0;
  //  // totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);
  //   tot.current = totalValue
    // setTotal(totalValue);
    // totalValue = 0;
    setFilteredData(filtered);
  };
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAchievementModalVisible, setIsAchievementModalVisible] =
    useState(false);
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
  return (
    <div>
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
            {selectedOfficer?.name ?selectedOfficer?.name : "2025 Targets"}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            {/* <Input
              placeholder="Search..."
              style={{
                width: "300px",
                height: "40px",
                borderRadius: "10px",
              }}
              allowClear={true}
            /> */}
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
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            borderBottom: "1px solid black",
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
              text="All"
              onClick={() => {
                setSelectedOfficer();

                setFilteredData(monthlyTargets);
              }}
              type="rgba(21, 155, 0, 0.79)"
            />
            {officers.map((off) => (
              <CustomButton
                onClick={() => handleSearch(off)}
                text={off.id + "-" + off.name}
                type="rgba(0, 10, 145, 0.78)"
              />
            ))}
            <CustomButton
              text="MALIDUWA"
              onClick={() => handleSearch({id:6})}
              type="rgba(21, 155, 0, 0.79)"
            />
          </div>
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
