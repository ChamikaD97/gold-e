import React, { useEffect } from "react";
import "../App.css";
import { Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { isLoading } from "../redux/authSlice";
import DashboardFullTarget from "../sections/DashboardFullTarget";
import DashboardFieldOfficersCard from "../sections/DashboardFieldOfficersCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(isLoading(true));
    setTimeout(() => {
      dispatch(isLoading(false));
    }, 500);
  }, [dispatch]);

  return (
    <div>
      {!loading ? (
        <div style={{ minHeight: 360, zIndex: 2 }}>
          <Row gutter={25} style={{ marginBottom: 15 }}>
            <Col span={6}>
              <DashboardFullTarget  />
            </Col>
            <Col span={6}>
              <DashboardFieldOfficersCard />
            </Col>
          </Row>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Dashboard;
