import React, { useState } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import { login, userToken } from "../redux/authSlice";
import CenteredCard from "../components/CenteredCard";
import CustomButton from "../components/CustomButton";
import { ToastContainer } from "react-toastify";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "http://13.61.26.58:5000";

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, {
        comNum: "Admin",
        password: "Admin",
      });

      if (response.status === 200) {
        dispatch(login(response.data.user));
        dispatch(userToken(response.data.token));
        navigate("/dashboard");
      } else {
       
      }
    } catch (error) {
  //    message.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CenteredCard>
        <Input
          size="large"
          placeholder="Computer Number"
          style={{ padding: 10 }}
          prefix={<UserOutlined style={{ paddingRight: 5 }} />}
        />
        <br /> <br />
        <Input
          size="large"
          placeholder="Password"
          type="password"
          style={{ padding: 10 }}
          prefix={<LockOutlined style={{ paddingRight: 5 }} />}
        />
        <br /> <br />
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <CustomButton
            text="Login"
            onClick={handleLogin}
            type="rgba(0, 22, 145, 0.78)"
            loading={isLoading}
          />
          <CustomButton
            text="Register"
            onClick={handleRegister}
            type="rgba(53, 145, 0, 0.78)"
          />
        </div>
        <ToastContainer />
      </CenteredCard>
    </div>
  );
};

export default LoginForm;
