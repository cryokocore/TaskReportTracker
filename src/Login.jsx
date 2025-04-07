import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Container, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "./App.css";
import logo from "./Images/stratify-logo.png";

const AuthForm = ({ setUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const { employeeId, username, password } = values;

    const payload = isSignUp
      ? { action: "register", employeeId, username, password }
      : { action: "login", employeeId, password };

    const formBody = new URLSearchParams(payload).toString();

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbz2rACgfR3kzocwi1B4TR8-APifgjL0aB_I9hijq1qOsD6jJUFNGbz8uFwQDC_9zWIfKg/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
        }
      );

      const text = await response.text();
      const result = JSON.parse(text);
      console.log(result);

      if (result.success) {
        message.success(
          isSignUp ? "Registered successfully" : `Welcome ${result.username}`
        );

        if (isSignUp) {
          // Switch to login form after signup success
          setIsSignUp(false);
          form.resetFields(); // Optional: Clear form after signup
        } else {
          setUser({ username: result.username, employeeId: result.employeeId });
          form.resetFields();
        }
      } else {
        message.error(result.error || "Invalid Employee ID or password");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Unexpected response from server");
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        className="p-4 border-light shadow login-card text-center"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <div className="d-flex justify-content-center mb-3">
          <img
            src={logo}
            alt="Stratify Technologies Logo"
            style={{ maxWidth: "180px" }}
          />
        </div>
        <div className="login-decoration"></div>
        <div className="login-decoration-2"></div>
        <h3 className="text-center fw-bold" style={{ color: "#2B3A67" }}>
          Task Report Tracker
        </h3>
        <h4 className="text-center fw-bold" style={{ color: "#2B3A67" }}>
          {isSignUp ? "Create Account" : "Welcome Back "}
        </h4>
        <p className="text-center text-muted">
          {isSignUp ? "Sign up to get started" : "Sign in to continue"}
        </p>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="employeeId"
            rules={[
              { required: true, message: "Please enter your Employee ID" },
            ]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="Employee ID"
              size="large"
            />
          </Form.Item>

          {isSignUp && (
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              ...(isSignUp
                ? [
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
                      message:
                        "Password must be 8-15 characters with uppercase, lowercase, number, and special character",
                    },
                  ]
                : []),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {isSignUp && (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          )}

          <Button
            type="primary"
            htmlType="submit"
            className="w-100 mt-3 btn-gradient"
            size="large"
            loading={loading}
          >
            {loading
              ? isSignUp
                ? "Creating Account..."
                : "Signing in..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </Button>
        </Form>

        <p className="text-center mt-3">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <Button
            type="link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              form.resetFields();
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </p>

        <p className="text-center text-muted small mt-3">
          &copy; {new Date().getFullYear()} Stratify technologies. All rights
          reserved.
        </p>
      </Card>
    </Container>
  );
};

export default AuthForm;
