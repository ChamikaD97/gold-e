import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Row, Input,
  Col,
  DatePicker,
  Button,
  Tag,
} from "antd";
import { useParams } from "react-router-dom";
import CircularLoader from "../components/CircularLoader";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { SearchRounded } from "@mui/icons-material";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SupplierInfo = () => {
  const { supplierId } = useParams();
  const supplierData = useSelector((state) => state.commonData?.selectedSupplier);

  const [supplier, setSupplier] = useState(supplierData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [filters, setFilters] = useState({
    year: "2024",
    month: "All",
    line: "All",
    search: "", searchById: "",
  });
  const apiKey = "quix717244";

  const fetchSupplierDataFromId = async (id) => {
    const baseUrl = "/quiX/ControllerV1/supdata";
    const params = new URLSearchParams({ k: apiKey, s: id });
    const url = `${baseUrl}?${params.toString()}`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch supplier data");
      const data = await response.json();
      setSupplier(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error(err);
      setError("Failed to load supplier data");
      setSupplier(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierDataFromId(supplierId);
    }
  }, [supplierId]);

  const handleLeafDataSearch = () => {
    if (dateRange.length === 2) {
      const [from, to] = dateRange;
      console.log("Fetch leaf data from", from.format("YYYY-MM-DD"), "to", to.format("YYYY-MM-DD"));
      // You can call the actual fetch function here
    }
  };

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.65)",
    color: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  };

  const labelStyle = { fontWeight: 600, color: "#bbb", width: 130 };
  const valueStyle = { color: "#fff" };

  return (
    <div style={{ padding: 24 }}>


       <Card bordered={false} style={cardStyle}>

      <Row gutter={[8, 8]} justify="end">
        <Col md={6}>
          <Text style={{ color: "#fff", paddingTop: 6, display: "inline-block" }}>
            Search Supplier
          </Text>
        </Col>


        <Col md={8}>
          <Input
            className="custom-supplier-input"
            value={filters.searchById}
            onChange={(e) => setFilters(prev => ({ ...prev, searchById: e.target.value }))}

            placeholder="Search by ID or Name"
            style={{
              width: "100%",
              backgroundColor: "rgb(0, 0, 0)",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 6
            }}
            allowClear
          />
        </Col>
        <Col md={2}>
          <Button
            icon={<SearchRounded />}

            type="primary"
            block
            onClick={() => {
              fetchSupplierDataFromId(filters.searchById);
            }}
          />
        </Col>
      </Row>

       </Card>

      <Row gutter={[16, 16]} justify="space-between">

        <Col span={12}>
          <Card title="🧾 Supplier Profile" bordered={false} style={cardStyle}>
            {loading && <CircularLoader />}
            {error && <Text type="danger">{error}</Text>}
            {supplier && (
              <div>
                <Row>
                  <Col span={10}><Text style={labelStyle}>Supplier ID:</Text></Col>
                  <Col span={14}><Text style={valueStyle}>{supplier["Supplier Id"]}</Text></Col>
                </Row>
                <Row>
                  <Col span={10}><Text style={labelStyle}>Name:</Text></Col>
                  <Col span={14}><Text style={valueStyle}>{supplier["Supplier Name"]}</Text></Col>
                </Row>
                <Row>
                  <Col span={10}><Text style={labelStyle}>Route:</Text></Col>
                  <Col span={14}><Tag color="blue">{supplier["Route"]}</Tag></Col>
                </Row>
                <Row>
                  <Col span={10}><Text style={labelStyle}>Pay Category:</Text></Col>
                  <Col span={14}>
                    <Tag color={
                      supplier["Pay"] === 1 ? "green" :
                        supplier["Pay"] === 2 ? "gold" : "volcano"
                    }>
                      Type {supplier["Pay"]}
                    </Tag>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Card: Date Range Filter */}
        <Col span={12}>
          <Card title="📅 Leaf Data Filter" bordered={false} style={cardStyle}>
            <Text style={{ color: "#ccc" }}>Select From - To Dates</Text>
            <RangePicker
              style={{ marginTop: 8, width: "100%" }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              allowClear
            />
            <Button
              type="primary"
              block
              style={{ marginTop: 16 }}
              onClick={handleLeafDataSearch}
              disabled={dateRange.length !== 2}
            >
              Get Leaf Records
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Additional Full Info */}
      {supplier && (
        <Card title="🏦 Additional Details" bordered={false} style={cardStyle}>
          <Row>
            <Col span={6}><Text style={labelStyle}>Bank:</Text></Col>
            <Col span={18}><Text style={valueStyle}>{supplier["Bank"]}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text style={labelStyle}>Bank A/C:</Text></Col>
            <Col span={18}><Text style={valueStyle}>{supplier["Bank AC"]}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text style={labelStyle}>NIC:</Text></Col>
            <Col span={18}><Text style={valueStyle}>{supplier["NIC"]}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text style={labelStyle}>Contact:</Text></Col>
            <Col span={18}><Text style={valueStyle}>{supplier["Contact"]}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text style={labelStyle}>Joined Date:</Text></Col>
            <Col span={18}><Text style={valueStyle}>{supplier["Joined Date"]}</Text></Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default SupplierInfo;
