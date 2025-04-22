import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Flex } from "antd";
import { useDispatch } from "react-redux";
import { login, userToken } from "../redux/authSlice";
import CenteredCard from "../components/CenteredCard";
import CustomButton from "../components/CustomButton";
import { ToastContainer, toast } from "react-toastify";

import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Splash = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "http://13.61.26.58:5000";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CenteredCard>
      hihiii
      </CenteredCard>
    </div>
  );
};

export default Splash;
