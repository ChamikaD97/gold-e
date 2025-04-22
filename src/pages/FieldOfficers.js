import React, { useState } from "react";
import { Table, Modal, Input, Card } from "antd";
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
  const API_URL = "http://13.61.26.58:5000";
  const { enginesClasses, search } = useSelector((state) => state.eng);
  const { loading, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState(enginesClasses);
  const [filteredData, setFilteredData] = useState(enginesClasses);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Field Officer",
      dataIndex: "fieldOfficer",
      key: "fieldOfficer",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Routes",
      dataIndex: "routes",
      key: "routes",
    },
  ];

  const handleRowClick = (record) => {
    console.log(record);

    dispatch(setSearch(record.class));
    navigate("/engines");
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    if (!value) {
      setFilteredData(enginesClasses);
      return;
    }
    // const filtered = tableData.filter((item) =>
    //   item.className?.toLowerCase().includes(value)
    // );
    const filtered = tableData.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const fetchEngines = async () => {
    try {
      const classEnginesData = await axios.get(`${API_URL}/api/classEngines`, {
        headers: {
          Authorization: token, // Include token if required
        },
      });
      dispatch(enginesClasses(classEnginesData.data));
    } catch (error) {
      console.error("Error fetching engines:", error.message);
    }
  };
  const exportToPDF = (data, columns, fileName) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns],
      body: data.map((item) => columns.map((col) => item[col.key])),
    });
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
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
              onClick={fetchEngines}
              icon={<ReloadOutlined />}
              type="rgba(145, 0, 0, 0.78)"
            />
          </div>
          <h2
            style={{ margin: 0 }}
            onClick={() => setFilteredData(enginesClasses)}
          >
            Field Officers
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Input
              placeholder="Search"
              onClear={() => setFilteredData(enginesClasses)}
              onChange={handleSearch}
              allowClear={true}
              style={{
                width: "200px",
                height: "40px",
                borderRadius: "15px",
                marginRight: "10px",
              }}
            />

            <CustomButton
              text="Downlaod"
              icon={<DownloadOutlined />}
              onClick={() => exportToPDF(filteredData, columns, "TableData")}
              type="rgba(0, 15, 145, 0.79)"
            />
            <CustomButton
              text="Add New"
              icon={<PlusCircleOutlined />}
              // onClick={() => handleAddNew()}
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
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            pagination={true} // Disable pagination to show full data with scrolling
            scroll={{ x: true }}
            bordered
            loading={loading}
          />
        </div>
      </Card>
    </div>
  );
};

export default FieldOfficers;
