import React, { useState } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  Row,
  Col,
  Card
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const EmployeeManagementPage = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([
    {
      name: "John Doe",
      nic: "901234567V",
      contact: "0711234567",
      dob: "1990-01-15",
      joined_date: "2015-06-01",
      section: "Factory",
      staff: "Factory",
      job_title: "Machine Operator"
    },
    {
      name: "Jane Smith",
      nic: "912345678V",
      contact: "0776543210",
      dob: "1991-06-30",
      joined_date: "2018-03-12",
      section: "Accounts",
      staff: "Office",
      job_title: "Accountant"
    },
    {
      name: "Kamal Perera",
      nic: "880123456V",
      contact: "0729876543",
      dob: "1988-12-05",
      joined_date: "2012-01-20",
      section: "Field Office",
      staff: "Office",
      job_title: "Supervisor"
    },
    {
      name: "Nimal Fernando",
      nic: "930987654V",
      contact: "0761122334",
      dob: "1993-09-22",
      joined_date: "2020-11-10",
      section: "Workshop",
      staff: "Factory",
      job_title: "Mechanic"
    },
    {
      name: "Harsha De Silva",
      nic: "890123456V",
      contact: "0710001111",
      dob: "1989-02-14",
      joined_date: "2010-04-05",
      section: "Factory",
      staff: "Factory",
      job_title: "Technician"
    },
    {
      name: "Nilakshi Perera",
      nic: "940112233V",
      contact: "0785566778",
      dob: "1994-07-19",
      joined_date: "2019-09-01",
      section: "Accounts",
      staff: "Office",
      job_title: "Payroll Clerk"
    },
    {
      name: "Ruwan Jayasinghe",
      nic: "870998877V",
      contact: "0754443322",
      dob: "1987-11-25",
      joined_date: "2016-08-22",
      section: "Field Office",
      staff: "Office",
      job_title: "Field Analyst"
    }
  ]);


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
        return `${years}`;
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
    },
    { title: "Staff", dataIndex: "staff", align: "center", sorter: (a, b) => a.staff.localeCompare(b.staff) },
    { title: "Section", dataIndex: "section", align: "center", sorter: (a, b) => a.section.localeCompare(b.section) },
    {
      title: "Actions",
      align: "center",
      render: (_, record, index) => (
        <Space>
          <Button onClick={() => showEditModal(record, index)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(index)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 15, width: "100%", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 16 }}>Employee Management</h1>
      <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.3)", marginTop: 16, marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={12} md={2}>
            <Button
              onClick={() => {
                setSearch("");
                setDateRange(null);
                setStaffFilter("");
                setMinYears("");
                setMaxYears("");
              }}
              icon={<ReloadOutlined />}
              danger
              type="primary"
              block
            >
              Reset
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

          {/* <Col xs={24} sm={12} md={4}>
            <Button.Group style={{ width: "100%" }}>
              <Button
                type={staffFilter === "Office" ? "primary" : "default"}
                onClick={() => setStaffFilter("Office")}
                block
              >
                Office
              </Button>
              <Button
                type={staffFilter === "Factory" ? "primary" : "default"}
                onClick={() => setStaffFilter("Factory")}
                block
              >
                Factory
              </Button>
            </Button.Group>
          </Col> */}


          <Col xs={12} sm={12} md={4}>
            <Input
              placeholder="Min Years" className="custom-placeholder"
              type="number"
              value={minYears}
              onChange={(e) => setMinYears(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>

          <Col xs={12} sm={12} md={4}>
            <Input
              placeholder="Max Years"
              type="number" className="custom-placeholder"
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

      <Card bordered={false} style={{ background: "rgba(255, 255, 255, 0.3)", height: "100%", overflow: "hidden" }}>
        <Table
          dataSource={filteredEmployees}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 6 }}
          bordered
          scroll={{ y: "calc(100vh - 340px)" }}
        />
      </Card>

      <Modal
        title={isEditMode ? "Edit Employee" : "Add Employee"}
        open={modalVisible}
        onOk={handleFormSubmit}
        onCancel={() => setModalVisible(false)}
        okText={isEditMode ? "Update" : "Add"}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="nic" label="NIC" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="contact" label="Contact"> <Input /> </Form.Item>
          <Form.Item name="dob" label="Date of Birth"> <DatePicker style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="joined_date" label="Joined Date"> <DatePicker style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="section" label="Section"> <Input /> </Form.Item>
          <Form.Item name="staff" label="Staff Type"> <Input /> </Form.Item>
          <Form.Item name="job_title" label="Job Title"> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagementPage;
