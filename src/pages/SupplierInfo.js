import React, { useMemo, useEffect, useState } from "react";
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
import lineIdCodeMap from "../data/lineIdCodeMap.json";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SupplierInfo = () => {


  const [supplier, setSupplier] = useState();
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

  const asddsa = ((id) => {
    const map = {};
    console.log(id);

    lineIdCodeMap.map(item => {
      console.log(item);

    });
    return map;
  }, []);

  const lineIdToCodeMap = (id) => {


    const records = lineIdCodeMap.filter(item => parseInt(item.lineId) === id);



    return (records[0]?.lineCode);







  }


  // const getLeafRecordsById= async () => {
  //   dispatch(showLoader());
  //   const baseUrl = "/quiX/ControllerV1/supdata";
  //   console.log(dateRange);

  //   const params = new URLSearchParams({ k: apiKey, s: supplierId , d : dateRange });
  //   const url = `${baseUrl}?${params.toString()}`;
  //   setError(null);

  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) throw new Error("Failed to fetch supplier data");
  //     const result = await response.json();

  //     const transformed = result.map(item => ({
  //       leaf_type: item["Leaf Type"] === 2 ? "Super" : "Normal",
  //       supplier_id: item["Supplier Id"],
  //       date: item["Leaf Date"],
  //       net_kg: parseInt(item["Net"]),
  //       lineCode: parseInt(item["Route"]),
  //       line: filters.lineCode
  //     }));

  //     setData(transformed);
  //     setColData(transformed);
  //   } catch (err) {
  //     setError("Failed to load supplier data");
  //     setData([]);
  //   } finally {
  //     dispatch(hideLoader());
  //   }
  // };
  const fetchSupplierDataFromId = async (id) => {
    setSupplier(null);
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
      {/* 🔍 Top Card: Search Supplier */}


      <Row gutter={[8, 8]} justify="space-evenly">
        <Col md={8}>
          <Card bordered={false} style={cardStyle}>
            <Col md={24}>

              <Row gutter={[8, 8]} justify="space-evenly">                <Col md={6}>
                <Text style={{ color: "#fff", paddingTop: 3, display: "inline-block" }}>
                  Search
                </Text>
              </Col>
                <Col md={14}>
                  <Input
                    className="custom-supplier-input"
                    value={filters.searchById}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchById: e.target.value }))
                    }
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
                <Col md={4}>
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
            </Col>
          </Card>

        </Col>






      </Row>

      {supplier && (
        <Row gutter={[8, 8]} justify="space-evenly">

          < Col md={12}>
            <Card bordered={false} style={cardStyle}>
              <Col md={24}>

                <Row gutter={[8, 8]} justify="space-evenly">
                  <Col md={6} >
                    {supplier["Supplier Id"]}
                  </Col>

                  <Col md={4}>
                  {lineIdToCodeMap(supplier["Route"])}

                  </Col> <Col md={14}>
                    {supplier["Supplier Name"]}
                  </Col>
                </Row>
              </Col>
            </Card>

          </Col>
          < Col md={12}>
            <Card bordered={false} style={cardStyle}>
              <Col md={24}>

                <Row gutter={[8, 8]} justify="space-evenly">
                  <Col md={6} >
                    {supplier["Supplier Id"]}
                  </Col>

                  <Col md={4}>
                   
                  </Col> <Col md={14}>
                    {supplier["Supplier Name"]}
                  </Col>
                </Row>
              </Col>
            </Card>

          </Col>
        </Row>
      )}

      {supplier && (
        <>


          <Row gutter={[16, 16]} justify="space-between">
            <Col span={12}>
              <Card bordered={false} style={cardStyle}>
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
              </Card></Col>

            <Col span={12}>
              <Card bordered={false} style={cardStyle}>
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
                  // onClick={getLeafRecordsById}
                  disabled={dateRange.length !== 2}
                >
                  Get Leaf Records
                </Button>
              </Card>
            </Col>
          </Row>



        </>
      )
      }

      {
        loading && (

          <CircularLoader />
        )
      }
    </div >
  );

};

export default SupplierInfo;
//05168