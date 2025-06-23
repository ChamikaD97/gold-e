import React, { useEffect, useState } from "react";
import {
  Card, Col, Row, Select, Typography, Button, Table, Input, Modal
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import '../App.css';
import lineIdCodeMap from "../data/lineIdCodeMap.json";
import CircularLoader from "../components/CircularLoader";
import SupplierLeafModal from "../components/SupplierLeafModal";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { API_KEY, getMonthDateRangeFromParts } from "../api/api";
import jsPDF from "jspdf";
import "jspdf-autotable";


const { Option } = Select;
const { Text } = Typography;

const LeafCountChart = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ year: "Select Year", month: "Select Month", officer: "All", line: "Select Line", lineCode: '' });
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2025-06-01");
  const [suppliersMarkedTomorrow, setSuppliersMarkedTomorrow] = useState([]);
  const [error, setError] = useState(null);


  const [xModalVisible, setXModalVisible] = useState(false);
  const [xSupplierList, setXSupplierList] = useState([]); // array of supplier IDs
  const [xSupplierDetails, setXSupplierDetails] = useState([]); // array of detailed supplier objects
  const leafRound = useSelector((state) => state.commonData?.leafRound);

  const officerLineMap = useSelector((state) => state.officerLine?.officerLineMap || {});
  const monthMap = useSelector((state) => state.commonData?.monthMap);
  const notificationDate = useSelector((state) => state.commonData?.notificationDate);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loader);

  const getLeafRecordsByRoutes = async () => {
    dispatch(showLoader());
    const dateRange = getMonthDateRangeFromParts(filters.year, filters.month);
    const url = `/quiX/ControllerV1/glfdata?k=${API_KEY}&r=${filters.line}&d=${dateRange}`;
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const result = await response.json();

      const transformed = result.map(item => ({
        leaf_type: item["Leaf Type"] === 2 ? "Super" : "Normal",
        supplier_id: item["Supplier Id"],
        date: item["Leaf Date"],
        net_kg: parseInt(item["Net"]),
        lineCode: parseInt(item["Route"]),
        line: filters.lineCode
      }));

      setData(transformed);
      setColData(transformed);
    } catch (err) {
      setError("Failed to load supplier data");
      setData([]);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (filters.month !== "Select Month") getLeafRecordsByRoutes();
  }, [filters.year, filters.month, filters.line, filters.lineCode]);

  const handleSupplierClick = (record) => {
    const yearNum = Number(filters.year);
    const monthNum = Number(filters.month);

    const firstDate = new Date(yearNum, monthNum - 1, 1);
    setSelectedSupplierId(record.supplier_id);
    setSelectedDate(firstDate);
    setModalOpen(true);
  };


  const getSuppliersMarkedXToday = async () => {
    const today = new Date().toDateString();
    const supplierMap = {};

    data.forEach(item => {
      supplierMap[item.supplier_id] = [...(supplierMap[item.supplier_id] || []), item];
    });

    const result = [];
    const xValueMap = {}; // NEW: store supplier_id => kg

    for (const [supplierId, records] of Object.entries(supplierMap)) {
      const lastRecord = records.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date) ? current : latest
      );

      const nextDate = new Date(lastRecord.date);
      nextDate.setDate(nextDate.getDate() + leafRound);

      if (nextDate.toDateString() === today) {
        result.push(supplierId);
        xValueMap[supplierId] = lastRecord.net_kg;
      }
    }

    setXSupplierList(result);
    setXModalVisible(true);

    try {
      const detailPromises = result.map(id => fetchSupplierDataFromAPI(id));
      const details = await Promise.all(detailPromises);
      const flattened = details.flat().filter(Boolean);

      // Inject the X value (kg) into each supplier object
      const enriched = flattened.map(s => ({
        ...s,
        "X KG": xValueMap[s["Supplier Id"]] || "-"
      }));

      setXSupplierDetails(enriched);
    } catch {
      setXSupplierDetails([]);
    }
  };

  const setColData = (transformedData) => {
    if (filters.month === "Select Month") {
      setColumns([]);
      setTableData([]);
      return;
    }

    const daysInMonth = new Date(parseInt(filters.year), parseInt(filters.month), 0).getDate();
    const suppliers = [...new Set(
      transformedData.filter(item => item.lineCode === parseInt(filters.line)).map(item => item.supplier_id)
    )].sort();

    const highlightDateMap = {};
    const highlightValueMap = {};

    suppliers.forEach(supplierId => {
      const supplierRecords = transformedData
        .filter(item => item.supplier_id === supplierId)
        .map(item => ({ date: new Date(item.date), kg: item.net_kg }));

      const lastRecord = supplierRecords.reduce((latest, current) =>
        current.date > latest.date ? current : latest, supplierRecords[0]);

      const nextDate = new Date(lastRecord.date);
      nextDate.setDate(nextDate.getDate() + leafRound);

      highlightDateMap[supplierId] = nextDate.toDateString();
      highlightValueMap[supplierId] = lastRecord.kg;
    });

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDate = today.getDate();
    const dayCols = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = new Date(`${filters.year}-${filters.month}-${String(day).padStart(2, "0")}`).toDateString();

      const isTodayCol =
        todayYear === parseInt(filters.year) &&
        todayMonth === filters.month &&
        todayDate === day;

      return {
        title: `${day}`,
        dataIndex: `day_${day}`,
        key: `day_${day}`,
        align: "center",
        width: 80,
        className: isTodayCol ? "highlight-column" : "", // ✅ assign custom class

        render: (value, row) => {
          const isHighlight = highlightDateMap[row.supplier_id] === dateStr;
          let bgColor = "", fontColor = "";

          if (isHighlight) {
            bgColor = "#AA0114"; fontColor = "#fff";
          } else if (value?.type === "Super") {
            bgColor = "#FF9900"; fontColor = "#000";
          } else if (value?.type === "Normal") {
            bgColor = "#003366"; fontColor = "#fff";
          }

          return (
            <div
              className={isHighlight ? "pulse-red animated-cell" : "animated-cell"}
              style={{ backgroundColor: bgColor, color: fontColor, fontWeight: "bold", padding: "4px", borderRadius: "4px" }}
            >
              {isHighlight ? "X" : value?.kg || ""}

            </div>
          );
        }
      };
    });

    const rows = suppliers.map(supplier_id => {
      const row = { supplier_id };
      const entries = transformedData.filter(item => item.supplier_id === supplier_id);
      entries.forEach(item => {
        const day = new Date(item.date).getDate();
        row[`day_${day}`] = { type: item.leaf_type, kg: item.net_kg };
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
        width: 120,
        render: (text, record) => (
          <Button
            style={{ backgroundColor: "#006623", color: "#fff", border: "none", fontSize: 15, fontWeight: "500" }}
            onClick={() => handleSupplierClick(record)}
          >
            {text}
          </Button>
        )
      },
      ...dayCols
    ]);

    setTableData(rows);
  };

  const getTotalKG = () => {
    return xSupplierDetails.reduce((sum, item) => sum + (parseFloat(item["X KG"]) || 0), 0);
  };



  const downloadXSupplierListAsPDF = (p) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    const selectedLine = filters.lineCode || "All";

    // Header
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.line(14, 20, 196, 20);
    doc.setFont(undefined, 'bold');
    doc.text("GREEN HOUSE PLANTATION (PVT) LIMITED", 105, 28, { align: "center" });

    doc.setFontSize(9);
    doc.line(14, 32, 196, 32);
    doc.setFont(undefined, 'normal');
    doc.text("Factory: Panakaduwa, No: 40, Rotumba, Bandaranayakapura", 14, 40);
    doc.text("Email: gtgreenhouse9@gmail.com | Tele: +94 77 2004609", 14, 45);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text("Daily Leaf Supply Summary", 14, 52);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`${selectedLine} Line Suppliers that need to Supply Leaf Today`, 14, 58);
    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${today}    |    Line: ${selectedLine}`, 14, 63);



    doc.setDrawColor(0);
    doc.line(14, 66, 196, 66);

    // Table data with ✓ or ✘
    const tableData = xSupplierDetails.map((s, i) => [
      s["Supplier Id"],
      s["Supplier Name"],
      s["Contact"] || "-",
      s["X KG"] || "0", "",  // Simulated Informed
      ""   // Simulated Availability
    ]);

    // Table with footer and page number
    doc.autoTable({
      startY: 72,
      head: [["Supplier ID", "Name", "Mobile", "Last Supply", "Informed", "Availability"]],
      body: tableData,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 9,
        halign: 'center',
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      didDrawPage: function () {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(50);
        doc.line(14, 275, 196, 275);
        doc.setFont(undefined, 'normal');
        doc.text("Green House Plantation SLMS | DA Engineer | ACD Jayasinghe", 14, 280);
        doc.text("0718553224 | deshjayasingha@gmail.com", 14, 285);

        // Page number
        const page = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Page ${page}`, 190, 290, { align: 'right' });
      }
    });

    // Total
    const total = tableData.reduce((sum, row) => sum + parseFloat(row[3] || 0), 0);
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const sixDaysAgoStr = sixDaysAgo.toLocaleDateString();

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.text(`Total KG Supplied on ${sixDaysAgoStr}: ${total} kg`, 14, doc.lastAutoTable.finalY + 10);

    // Optional signature lines
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    // Save
    // Save or Print]
    if (p) {



      doc.autoPrint(); // Trigger print dialog
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl); // Open in new tab for printing
    } else {


      const formattedDate = new Date().toISOString().split('T')[0];
      doc.save(`${selectedLine} line suppliers - ${formattedDate}.pdf`);
    }

  };




  const fetchSupplierDataFromAPI = async (supplierId) => {
    const baseUrl = "/quiX/ControllerV1/supdata";
    const params = new URLSearchParams({ k: apiKey, s: supplierId });
    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const data = await response.json();
      return Array.isArray(data) ? data : data ? [data] : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };


  const filteredTableData = tableData.filter(item =>
    !filters.supplierId || item.supplier_id.toLowerCase().startsWith(filters.supplierId.toLowerCase())
  );
  const apiKey = "quix717244";




  const uniqueLines = [{ label: "All", value: "All" }, ...lineIdCodeMap.map(l => ({ label: l.lineCode, value: l.lineId }))];
  const filteredLines = filters.officer === "All" ? [] : ["All", ...(officerLineMap[filters.officer] || [])];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const filteredMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    .filter(m => parseInt(filters.year) < currentYear || m <= currentMonth);

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.6)", color: "#fff", borderRadius: 12, marginBottom: 6
  };

  const filterText = `Displaying data for ${filters.month !== "Select Month" ? monthMap[filters.month] : "all months"} ${filters.year}, ` +
    `${filters.officer !== "All" ? `Officer: ${filters.officer}, ` : ""}` +
    `${filters.line !== "All" ? `Line: ${filters.lineCode}` : ""}`;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SupplierLeafModal open={modalOpen} filters={filters} onClose={() => setModalOpen(false)} supplierId={selectedSupplierId} selectedDate={selectedDate} />

      <Modal

        open={xModalVisible}
        onCancel={() => setXModalVisible(false)}
        footer={[
          <Button
            key="download"
            type="primary"
            onClick={() => downloadXSupplierListAsPDF(false)}
            style={{
              backgroundColor: '#007bff',
              borderRadius: 6,
              fontWeight: 400,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
            }}
          >
            Download PDF
          </Button>,
          <Button
            key="download"

            onClick={() => downloadXSupplierListAsPDF(true)}
            style={{ backgroundColor: "#28a745", color: "#fff", borderRadius: 6 }}

          >
            Print PDF
          </Button>,

          <Button
            key="close"
            danger
            onClick={() => setXModalVisible(false)}
            style={{ borderRadius: 6 }}
          >
            Close
          </Button>,
        ]}
        bodyStyle={{
          backgroundColor: "#1e1e1e",
          color: "#fff",
          padding: 20,
          borderRadius: 8
        }}
        style={{ top: 60, borderRadius: 12, overflow: 'hidden' }}
        width={800}
      >
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            background: "#2b2b2b",
            borderRadius: 8,
            display: "flex",
            justifyContent: "center", // ✅ center horizontally
            color: "#ffc107",
            fontWeight: "bold",
            fontSize: 16,
            border: "1px solid #444"
          }}
        >
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
            {filters.lineCode} line Suppliers That need to Supply Leaf Today
          </span>
        </div>

        {xSupplierDetails.length > 0 ? (
          <div style={{ padding: 6, borderRadius: 10 }}>
            <Table
              dataSource={xSupplierDetails}

              rowKey="Supplier Id"
              pagination={false}
              bordered
              size="small"
              columns={[
                {
                  title: <span style={{ color: '#000' }}>Supplier ID</span>,
                  dataIndex: "Supplier Id",
                  key: "supplierId",
                  align: "center", // ✅ centered
                  render: text => <span style={{ color: '#000', fontWeight: 500 }}>{text}</span>
                },
                {
                  title: <span style={{ color: '#000' }}>Name</span>,
                  dataIndex: "Supplier Name",
                  key: "name",
                  align: "center", // ✅ centered
                  render: text => <span style={{ color: '#000' }}>{text}</span>
                },
                {
                  title: <span style={{ color: '#000' }}>Contact</span>,
                  dataIndex: "Contact",
                  key: "contact",
                  align: "center", // ✅ centered
                  render: text => <span style={{ color: '#000' }}>{text}</span>
                },
                {
                  title: <span style={{ color: '#000' }}>Net KG (X)</span>,
                  dataIndex: "X KG",
                  key: "xkg",
                  align: "center", // ✅ centered
                  render: value => (
                    <span style={{ color: '#000', fontWeight: 'bold' }}>{value}</span>
                  )
                }
              ]}
              style={{
                backgroundColor: '#2a2a2a',
                color: '#000',
                borderRadius: 8
              }}
            />


            <div
              style={{
                marginTop: 20,
                padding: 12,
                background: "#2b2b2b",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#fff",
                fontSize: 16,
                border: "1px solid #444"
              }}
            >
              <span>Total KG Supplied</span>
              <span>{getTotalKG()} kg</span>
            </div>
          </div>
        ) : (
          <p style={{ color: '#fff', textAlign: "center", margin: "24px 0", fontSize: 16 }}>
            No suppliers marked today.
          </p>
        )}
      </Modal>


      <div style={{ flex: "0 0 auto", marginBottom: 16 }} className="fade-in">
        <Card bordered={false} style={cardStyle}>
          <Row gutter={[16, 16]}>
            <Col md={1}>
              <Button icon={<ReloadOutlined />} danger type="primary" block onClick={() => {


                setXSupplierDetails([]);

                setFilters({ year: "Select Year", month: "Select Month", officer: "All", line: "Select Line", lineCode: "" })
              }} />
            </Col>

            <Col md={4}>
              <Select
                showSearch
                placeholder="Select Line"
                value={filters.line}
                onChange={val => {
                  const selectedLine = uniqueLines.find(line => line.value === val);
                  const officerMatch = Object.entries(officerLineMap).find(([officer, lines]) => lines.includes(val));
                  const matchedOfficer = officerMatch ? officerMatch[0] : "All";
                  setFilters(f => ({ ...f, line: val, lineCode: selectedLine?.label || "", officer: matchedOfficer, month: "Select Month" }));
                }}
                style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "#000", border: "1px solid #333", borderRadius: 6 }}
                dropdownStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
                bordered={false}
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {uniqueLines.map(line => (
                  <Option key={line.value} value={line.value}>{line.label}</Option>
                ))}
              </Select>
            </Col>
            <Col md={4}>
              <Select showSearch
                              style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "#000", border: "1px solid #333", borderRadius: 6 }}

                value={filters.year} 
                bordered={false} onChange={val => setFilters(f => ({ ...f, year: val, month: "Select Month" }))}>

                <Option value="2021">2021</Option>
                <Option value="2022">2022</Option>
                <Option value="2023">2023</Option>

                <Option value="2024">2024</Option>
                <Option value="2025">2025</Option>
              </Select>
            </Col>
            <Col md={3}>
              <Select
                showSearch

                value={filters.month}
                onChange={val => setFilters(prev => ({ ...prev, month: val }))}
                style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "#000", border: "1px solid #333", borderRadius: 6 }}
                bordered={false}
              >
                {filteredMonths.map(m => (
                  <Option key={m} value={m}>{monthMap[m]}</Option>
                ))}
              </Select>
            </Col>
            <Col md={2}><Text style={{ color: "#fff" }}>Supplier ID</Text></Col>
            <Col md={4}>
              <Input
                value={filters.supplierId || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, supplierId: e.target.value }))}
                style={{ width: "100%", backgroundColor: "rgb(0, 0, 0)", color: "#fff", border: "1px solid #333", borderRadius: 6 }}
                allowClear
              />
            </Col>
            <Col>
              <Button type="default" onClick={getSuppliersMarkedXToday}>
                Today  Suppliers
              </Button>
            </Col>
          </Row>
        </Card>

      </div>




      {filters.line !== "M" && filters.officer !== "All" && (
        <Card bordered={false} style={cardStyle}>
          <Row gutter={[12, 12]}>
            {filteredLines.filter(l => l !== "All").map(line => (
              <Col xs={8} sm={4} md={4} key={line}>
                <Button
                  type={filters.line === line ? "primary" : "default"}
                  onClick={() => setFilters(prev => ({ ...prev, line, month: "Select Month" }))}
                  style={{ width: "100%", background: filters.line === line ? "#1890ff" : "#000", color: "#fff" }}
                >
                  {line}
                </Button>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {filters.month !== "Select Month" && (
        <>
          <Card bordered={false} style={cardStyle}><Text strong>{filterText}</Text></Card>
          {suppliersMarkedTomorrow.length > 0 && (
            <Card bordered={false} style={{ ...cardStyle, marginTop: 12 }}>
              <Text strong>Suppliers that need to supply leaf after {notificationDate} days</Text>
              <ul style={{ color: "#fff", paddingLeft: 20 }}>
                {suppliersMarkedTomorrow.map(sid => <li key={sid}>{sid}</li>)}
              </ul>
            </Card>
          )}
          <Card bordered={false} style={cardStyle}>
            {isLoading ? <CircularLoader /> : (
              <Table
                className="red-bordered-table"
                columns={columns}
                dataSource={filteredTableData}
                pagination={false}
                scroll={{ x: "max-content" }}
                bordered
                size="small"
                rowKey="supplier_id"
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default LeafCountChart;
