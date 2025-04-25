import React, { useEffect, useState } from "react";
import { Card, Tag, Row, Col, Spin, notification, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import CustomButton from "../components/CustomButton";
import {
  LeftCircleOutlined,
  DeleteFilled,
  UserOutlined,
} from "@ant-design/icons";
import "./SingleTrip.css";
import { Alert } from "antd";
import { Iso, Padding } from "@mui/icons-material";
import CenteredCard from "../components/CenteredCard";
import {
  ReloadOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MoreOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { b, bb, gl, p } from "../var";
import { selectClasses } from "@mui/material";
import MonthRangeSelector from "../components/MonthButton";
const FieldOfficerReports = () => {
  const { Ids } = useParams();

  const navigate = useNavigate();
  const [diff, setDiff] = useState("");
  const [officer, setOfficer] = useState();
  const [officers, setOfficers] = useState();
  const [Id, setId] = useState([]);
  const [total, setTotal] = useState();

  const [monthlyTargets, setMonthlyTargets] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isDetailsModelVisible, setIsDetailsModelVisible] = useState(false);
  const [isShorMoreModel, setShorMoreModelVisible] = useState(false);

  const [filteredmonthlyTargets, setFilteredMonthlyTargets] = useState([]);
  const [filteredachievements, setFilteredAchievements] = useState([]);

  const [achivementFroSelectedMonth, setAchivementFroSelectedMonth] = useState(
    []
  );
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });

  const [targetForSelectedMonth, setTargetForSelectedMonth] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState([]);
  const [
    monthlyTargetsFroSelectedOfficer,
    setMonthlyTargetsFroSelectedOfficer,
  ] = useState([]);

  const [achivementsFroSelectedOfficer, setAchivementsFroSelectedOfficer] =
    useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [summaryData, setSummaryData] = useState([]);

  const [selectedOfficer, setSelectedOfficer] = useState([]);
  const [monthSelectorKey, setMonthSelectorKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const API_URL = "http://192.168.1.4:8080";
  const resetRange = () => {
    setSummaryData([]);
    setMonthSelectorKey(prev => prev + 1); // This forces remount
  };
  
  const handleRangeChange = (range, firstMonth) => {
    console.log("Selected Range start:", range.start);
    console.log("Selected end:", range.end);
    const filtered = achievements.filter(
      (item) => item.officer_id === officer.id
    );
    let startMonth = range.start;
    if (!range.end) {
      
      let endMonth = range.end;

      let x = startMonth;
      startMonth = endMonth;
      endMonth = x;

console.log('same');

      const summary = calculateCumulative(filtered, range.start, range.start);


      console.log(summary);

    }else{
      
      const summary = calculateCumulative(filtered, range.start, range.end);

      console.log(summary);
    }



    if (range.start > selectedMonth.id) {
      console.log("Invalid ******** selected");
      return;
    }

   

    setShorMoreModelVisible(true);
    closeDataModel();
    setShorMoreModelVisible(true);

    if (!range.start || !range.end) {
      console.log("Invalid range selected");
      return;
    }
  };

  const fetchOfficers = () => {
    axios.get("http://localhost:5000/api/officers").then((res) => {
      const filtered = res.data.filter((item) => item.id == Id);
      setOfficers(res.data);
      setOfficer(filtered[0]);
    });
  };
  const calculateTotalTargetSum = (dataArray) => {
    return dataArray.reduce((sum, item) => sum + (item.total_target || 0), 0);
  };
  const fetchMonthlyTargets = () => {
    axios.get("http://localhost:5000/api/monthly-target").then((res) => {
      const filtered = res.data.filter((item) => item.officer_id == Id);
      setTotal(calculateTotalTargetSum(res.data));

      setMonthlyTargets(res.data);
      setFilteredMonthlyTargets(filtered);
      //calculateTotals(res.data);
    });
  };

  const fetchAchievements = () => {
    axios.get("http://localhost:5000/api/achievements").then((res) => {
      const filtered = res.data.filter((item) => item.officer_id == Id);
      setAchievements(res.data);
      setFilteredAchievements(res.data);
    });
  };

  const handleSearch = (officer) => {
    setId(officer.id);
    setSelectedOfficer(officer);

    if (officer == "all") {
      setOfficer();
      return;
    }

    const filtered = achievements.filter(
      (item) => item.officer_id === officer.id
    );
    setOfficer(officer);
    const filteredMonthlyTargets = monthlyTargets.filter(
      (item) => item.officer_id === officer.id
    );
    setFilteredAchievements(filtered);

    setFilteredMonthlyTargets(filteredMonthlyTargets);

    const updateTargets = months.map((month) => ({
      id: month.id,
      name: month.name,
      target: filteredMonthlyTargets[month.id], // Get the target from original data
    }));

    // Transform into an array of { id, name, target }
    const TargetsFroSelectedOfficer = months.map((month) => ({
      id: month.id,
      name: month.name,
      target: filteredMonthlyTargets[0][month.id], // Get the target from original data
    }));

    setMonthlyTargetsFroSelectedOfficer(TargetsFroSelectedOfficer);

    const achivementsFroSelectedOfficer = months.map((month) => ({
      id: month.id,
      name: month.name,
      target: filtered[0][month.id], // Get the target from original data
    }));

    setAchivementsFroSelectedOfficer(achivementsFroSelectedOfficer);

    setId(officer.id);
  };

  useEffect(() => {
    fetchOfficers();
    fetchMonthlyTargets();
    fetchAchievements();
  }, [Id]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  // Get all data related to the Id

  const showDataModel = (monthData) => {
    const filtered = achievements.filter(
      (item) => item.officer_id === selectedOfficer.id
    );
    setSelectedMonth(monthData);
    const achivement = filtered.filter((item) => item.month == monthData.id);
    const officerMonthlyTargets = monthlyTargetsFroSelectedOfficer.filter(
      (item) => item.id == monthData.id
    );

    if (achivement[0]) {
      setAchivementFroSelectedMonth(achivement[0]);
      setTargetForSelectedMonth(officerMonthlyTargets[0]);
      setIsDetailsModelVisible(true);
    }
  };

  const closeDetailsModel = () => {
    setIsDetailsModelVisible(false);
  };
  const closeDataModel = () => {
    setShorMoreModelVisible(false);
  };
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
  const monthOrder = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dece",
  ];

  const getMonthNameById = (monthId) =>
    months.find((m) => m.id === monthId)?.name || null;
  const achievedMonths = new Set(filteredachievements.map((ach) => ach.month));

  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100) + "%";
  };

  function filterTargetsByMonthRange(data, startMonth, endMonth) {
    const record = data[0]; // Assuming only one object

    if (startMonth == endMonth) {
      const sum = record[startMonth] || 0;

      return sum;
    }
    const sum = (record[startMonth] || 0) + (record[endMonth] || 0);

    return sum;
  }

  const calculateCumulative = (dataArray, startMonth, endMonth) => {
    const monthOrder = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    let startIdx = monthOrder.indexOf(startMonth.toLowerCase());
    let endIdx = monthOrder.indexOf(endMonth.toLowerCase());
    if (startIdx > endIdx) {
      let x = startIdx;
      startIdx = endIdx;
      endIdx = x;
    }
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      throw new Error("Invalid month range");
    }

    const filteredData = dataArray.filter((item) => {
      const monthIdx = monthOrder.indexOf(item.month.toLowerCase());
      return monthIdx >= startIdx && monthIdx <= endIdx;
    });

    const months = filteredData.length;
    const r = filteredData.reduce((sum, item) => sum + (item.value || 0), 0);
    const b = filteredData.reduce((sum, item) => sum + (item.B || 0), 0);
    const bob = filteredData.reduce((sum, item) => sum + (item.BoB || 0), 0);
    const p = filteredData.reduce((sum, item) => sum + (item.P || 0), 0);
    const gold_leaf = filteredData.reduce(
      (sum, item) => sum + (item.gold_leaf || 0),
      0
    );
    const targets = monthlyTargets.filter(
      (item) => item.officer_id === officer.id
    );
    const total_target = filterTargetsByMonthRange(
      targets,
      startMonth,
      selectedMonth.id
    );

    const b_percentage = months > 0 ? Math.round(b / months) + "%" : "0%";
    const bob_percentage = months > 0 ? Math.round(bob / months) + "%" : "0%";
    const p_percentage = months > 0 ? Math.round(p / months) + "%" : "0%";
    const gold_leaf_percentage =
      r > 0 ? Math.round((gold_leaf / r) * 100) + "%" : "0%";

    return {
      received: r,
      months,
      gold_leaf,
      b_percentage,
      bob_percentage,
      p_percentage,
      gold_leaf_percentage,
      total_target,
    };
  };

  const calculateData = (starttedMonth) => {
    const filtered = achievements.filter(
      (item) => item.officer_id === officer.id
    );
    const summary = calculateCumulative(
      filtered,
      starttedMonth,
      selectedMonth.id
    );
    setShorMoreModelVisible(true);
    closeDataModel();
    setShorMoreModelVisible(true);
    setSummaryData(summary);
  };

  const showMoreModel = () => {
    setShorMoreModelVisible(true);
    closeDataModel();
    resetRange()
    setShorMoreModelVisible(true);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "10px",
          marginTop: "10px",
          width: "100%",
          paddingBottom: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#FFFFFF" /* Add your desired color here */,
          }}
        >
          {officer?.name
            ? `${officer.name}'s Reports`
            : " Factory Reports - 2025"}
        </h2>
      </div>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Distribute buttons evenly
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",

            width: "100%",
          }}
        >
          <CustomButton
            onClick={() => {

            }}
            icon={<ReloadOutlined />}
            type="#910000"
          />
          {officers &&
            officers.map((off) => (
              <CustomButton
                text={off.name}
                type="rgba(0, 10, 145, 0.78)"
                icon={<UserOutlined />}
                onClick={() => handleSearch(off)}
              />
            ))}

          <CustomButton
            text="MALIDUWA"
            onClick={() => setId(6)}
            type="rgba(0, 10, 145, 0.78)"
          />
        </div>
      </Card>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Distribute buttons evenly
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "10px",
          marginTop: "10px",

          paddingBottom: "10px",
        }}
      >
        {officer && filteredData && (
          <Card
            style={{
              display: "flex",
              justifyContent: "space-evenly", // Distribute buttons evenly
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",

                width: "100%",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Monthly Target
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly", // Distribute buttons evenly
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {officers && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
                    gap: "10px", // spacing between items
                    width: "100%",
                    margin: "10px 0",
                  }}
                >
                  {monthlyTargetsFroSelectedOfficer.map((month) => (
                    <CustomButton
                      key={month.id}
                      text={`${month.name} - ${month.target.toLocaleString()}`}
                      type="rgba(0, 0, 0, 0.78)"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
        {officer && filteredData && (
          <Card
            style={{
              display: "flex",
              justifyContent: "space-between", // Distribute buttons evenly
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",

                width: "100%",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Achievement Target
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between", // Distribute buttons evenly
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {officers && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
                    gap: "10px", // spacing between items
                    width: "100%",
                    margin: "10px 0",
                  }}
                >
                  {months
                    .sort((a, b) => {
                      const monthOrder = {
                        jan: 1,
                        feb: 2,
                        mar: 3,
                        apr: 4,
                        may: 5,
                        jun: 6,
                        jul: 7,
                        aug: 8,
                        sep: 9,
                        oct: 10,
                        nov: 11,
                        dece: 12,
                      };
                      return monthOrder[a.id] - monthOrder[b.id];
                    })
                    .map((month) => (
                      <CustomButton
                        key={month.id}
                        text={month.name}
                        type={
                          achievedMonths.has(month.id)
                            ? "rgba(0, 145, 31, 0.78)"
                            : "rgba(145, 0, 0, 0.78)"
                        }
                        onClick={
                          achievedMonths.has(month.id)
                            ? () => showDataModel(month)
                            : () => console.log("")
                        }
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      />
                    ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
      <Modal
        title={
          selectedOfficer
            ? selectedMonth.name + " Report of " + selectedOfficer.name
            : selectedOfficer.id
        }
        visible={isDetailsModelVisible}
        onCancel={() => setIsDetailsModelVisible(false)}
        footer={null}
        centered
      >
        <h2
          style={{
            margin: 0,
            fontSize: "15px",
          }}
        >
          Leaf Count
        </h2>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Target - {targetForSelectedMonth.target} kg
        </div>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Recived - {achivementFroSelectedMonth.value} kg
        </div>

        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          {getPercentage(
            achivementFroSelectedMonth.value,
            targetForSelectedMonth.target
          )}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "15px",
          }}
        >
          Gold Leaf (50%)
        </h2>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Target - {targetForSelectedMonth.target * gl} kg
        </div>

        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Recived - {achivementFroSelectedMonth.gold_leaf} kg
        </div>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          {getPercentage(
            achivementFroSelectedMonth.gold_leaf,
            targetForSelectedMonth.target * gl
          )}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "15px",
          }}
        >
          B (60%)
        </h2>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Target - {targetForSelectedMonth.target * b} kg
        </div>

        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Recived - {achivementFroSelectedMonth.B} % (
          {(achivementFroSelectedMonth.value * achivementFroSelectedMonth.B) /
            100}
          kg )
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "15px",
          }}
        >
          BB (10%)
        </h2>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Target - {targetForSelectedMonth.target * bb}
        </div>

        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Recived - {achivementFroSelectedMonth.BoB} % (
          {(achivementFroSelectedMonth.value * achivementFroSelectedMonth.BoB) /
            100}
          kg )
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "15px",
          }}
        >
          P (30%)
        </h2>
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Target - {targetForSelectedMonth.target * p}
        </div>

        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Recived - {achivementFroSelectedMonth.P} %(
          {(achivementFroSelectedMonth.value * achivementFroSelectedMonth.P) /
            100}
          kg )
        </div>
        <CustomButton
          text={"More"}
          type={"rgb(44, 0, 145)"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
          onClick={() => showMoreModel()}
        />
      </Modal>
      <Modal
        title={"Select Month Range"}
        visible={isShorMoreModel}
        onCancel={() => setShorMoreModelVisible(false)}
        footer={null}
        centered
        width={"60%"}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Distribute buttons evenly
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {" "}
          <CustomButton
            type="#f0f0f0"
            onClick={resetRange}
            icon={<ReloadOutlined />}
            style={{
              backgroundColor: "#910000",
              border: "1px solid #d9d9d9",
            }}
          />
          {months
            .filter((month) => achievedMonths.has(month.id)) // Only the achieved months
            .sort((a, b) => monthOrder.indexOf(a.id) - monthOrder.indexOf(b.id)) // Sort by month order
            .length > 0 && (
            <MonthRangeSelector
            key={monthSelectorKey}
              months={months.filter((month) => achievedMonths.has(month.id))} // Pass the filtered months
              onRangeChange={handleRangeChange} // Call the handleRangeChange function
            />
          )}
        </div>
        {summaryData && summaryData.months}
      </Modal>

      {/* {!officer && <Card>{total}</Card>} */}
    </>
  );
};

export default FieldOfficerReports;
