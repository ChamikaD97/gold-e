import React, { useState } from "react";
import {
  Table,
  Space,
  Button,
  Input,
  DatePicker,
  Popconfirm,
  Row, Form,
  Col,
  Card,
  Tag
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import EmployeeModal from "../components/EmployeeModal";
import employeesData from './data/employeesData.json'; // Assuming you have a JSON file with employee data

const EmployeeManagementPage = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState(employeesData);

 
  
  
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [minYears, setMinYears] = useState("");
  const [maxYears, setMaxYears] = useState("");

  const showAddModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setModalVisible(true);
  };

  const showEditModal = (record, index) => {
    form.setFieldsValue({ ...record });
    setEditingIndex(index);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = (index) => {
    const updated = employees.filter((_, i) => i !== index);
    setEmployees(updated);
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      if (isEditMode) {
        const updated = [...employees];
        updated[editingIndex] = values;
        setEmployees(updated);
      } else {
        setEmployees([...employees, values]);
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const matchesYears = (joined) => {
    if (!joined) return true;
    const joinedDate = new Date(joined);
    const today = new Date();
    let years = today.getFullYear() - joinedDate.getFullYear();
    const m = today.getMonth() - joinedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < joinedDate.getDate())) years--;
    return (!minYears || years >= Number(minYears)) &&
      (!maxYears || years <= Number(maxYears));
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.nic?.toLowerCase().includes(search.toLowerCase());

    const matchesStaff = staffFilter ? emp.staff === staffFilter : true;

    const matchesDate =
      dateRange && dateRange.length === 2
        ? new Date(emp.joined_date) >= dateRange[0]._d &&
        new Date(emp.joined_date) <= dateRange[1]._d
        : true;

    return matchesSearch && matchesStaff && matchesDate && matchesYears(emp.joined_date);
  });

  const columns = [
    { title: "Name", dataIndex: "name", align: "center", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Contact", dataIndex: "contact", align: "center", sorter: (a, b) => a.contact.localeCompare(b.contact) },
    {
      title: "Joined",
      dataIndex: "joined_date",
      align: "center",
      sorter: (a, b) => new Date(a.joined_date) - new Date(b.joined_date)
    },


    {
      title: "Service Years",
      dataIndex: "joined_date",
      align: "center",
      render: (date) => {
        if (!date) return "-";
        const joined = new Date(date);
        const today = new Date();
        let years = today.getFullYear() - joined.getFullYear();
        const mDiff = today.getMonth() - joined.getMonth();
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < joined.getDate())) {
          years--;
        }

        let color = "default";
        let label = `${years} yrs`;

        if (years <= 2) color = "red";
        else if (years <= 5) color = "orange";
        else if (years <= 9) color = "gold";
        else color = "green";

        return <Tag color={color}>{label}</Tag>;
      },
      sorter: (a, b) => {
        const getYears = (date) => {
          const joined = new Date(date);
          const today = new Date();
          let years = today.getFullYear() - joined.getFullYear();
          const mDiff = today.getMonth() - joined.getMonth();
          if (mDiff < 0 || (mDiff === 0 && today.getDate() < joined.getDate())) {
            years--;
          }
          return years;
        };
        return getYears(a.joined_date) - getYears(b.joined_date);
      }
    }
    ,
    { title: "Staff", dataIndex: "staff", align: "center", sorter: (a, b) => a.staff.localeCompare(b.staff) },
    { title: "Section", dataIndex: "section", align: "center", sorter: (a, b) => a.section.localeCompare(b.section) },
    {
      title: "Actions",
      align: "center",
      render: (_, record, index) => (
        <Space>
          <Button onClick={() => showEditModal(record, index)}>Edit</Button>
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(index)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.06)" }}>
      <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.48)", marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={12} md={2}>
            <Button
              icon={<ReloadOutlined />}
              danger
              type="primary"
              block
              onClick={() => {
                setSearch("");
                setDateRange(null);
                setStaffFilter("");
                setMinYears("");
                setMaxYears("");
              }}
            > Reset
            </Button>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Input
              className="custom-placeholder"
              placeholder="Search by name or NIC"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ width: "100%" }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <DatePicker.RangePicker
              className="custom-placeholder"
              onChange={(dates) => setDateRange(dates)}
              style={{ width: "100%" }}
              placeholder={["Start Join Date", "End Join Date"]}
            />
          </Col>

          <Col xs={12} sm={12} md={4}>
            <Input
              placeholder="Min Years"
              type="number"
              className="custom-placeholder"
              value={minYears}
              onChange={(e) => setMinYears(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>

          <Col xs={12} sm={12} md={4}>
            <Input
              placeholder="Max Years"
              type="number"
              className="custom-placeholder"
              value={maxYears}
              onChange={(e) => setMaxYears(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>

          <Col xs={24} sm={12} md={2}>
            <Button type="primary" onClick={showAddModal} block>
              Add
            </Button>
          </Col>
        </Row>

        <style>
          {`
            .custom-placeholder::placeholder {
              color: #444 !important;
              opacity: 1;
            }
            .custom-placeholder input::placeholder {
              color: #444 !important;
            }
            .ant-picker-input input::placeholder {
              color: #444 !important;
            }
          `}
        </style>
      </Card>

      <Table
        dataSource={filteredEmployees}
        columns={columns}
        rowKey={(record, index) => index}
        bordered
        scroll={{ y: "calc(100vh - 340px)" }}
        pagination={{
          pageSize: 250,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`
        }}
      />


      <EmployeeModal
        open={modalVisible}
        isEditMode={isEditMode}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        form={form}
      />
    </Card>
  );
};

export default EmployeeManagementPage;
