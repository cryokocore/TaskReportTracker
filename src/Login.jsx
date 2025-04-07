// import React, { useState } from "react";
// import { Form, Input, Button, message } from "antd";

// export default function AuthForm({setUser }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     const { username, password } = values;

//     const formBody = new URLSearchParams({
//       action: isSignUp ? "register" : "login",
//       username,
//       password,
//     }).toString();

//     const response = await fetch(
//       "https://script.google.com/macros/s/AKfycbyHAn1nc89GroaM0ZQs7C6UqaaWJC-kUqz6b-oReEpfHhG-WKsBq-OofeLFuOC7X5zUFg/exec",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: formBody,
//       }
//     );

//     const text = await response.text();
//     try {
//       const result = JSON.parse(text);
//       if (result.success) {
//         // message.success(isSignUp ? "Registered successfully" : "Login successful");
//         message.success(isSignUp ? "Registered successfully" : `Welcome ${username}`)
//         setUser(username);
//         form.resetFields();
//       } else {
//         message.error(result.error || "Invalid username or password");
//       }
//     } catch (error) {
//       console.error("Invalid JSON response:", text);
//       message.error("Unexpected response from server");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container">
//       <h1 className="text-center">{isSignUp ? "Sign Up" : "Login"}</h1>
//       <Form layout="vertical" form={form} onFinish={handleSubmit}>
//         <Form.Item
//           label="Username"
//           name="username"
//           rules={[{ required: true, message: "Enter username" }]}
//         >
//           <Input placeholder="Enter username" />
//         </Form.Item>

//         <Form.Item
//           label="Password"
//           name="password"
//           rules={[
//             { required: true, message: "Enter password" },
//             ...(isSignUp
//               ? [
//                   {
//                     pattern:
//                       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
//                     message:
//                       "Password must be 8-15 characters with uppercase, lowercase, number, and special character",
//                   },
//                 ]
//               : []),
//           ]}
//         >
//           <Input.Password placeholder="Enter password" />
//         </Form.Item>

//         {isSignUp && (
//           <Form.Item
//             label="Confirm Password"
//             name="confirmPassword"
//             dependencies={["password"]}
//             rules={[
//               { required: true, message: "Confirm your password" },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("password") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error("Passwords do not match!"));
//                 },
//               }),
//             ]}
//           >
//             <Input.Password placeholder="Confirm password" />
//           </Form.Item>
//         )}

//         <div className="text-center mt-3 pb-3">
//           <Button htmlType="submit" loading={loading}>
//             {isSignUp ? "Sign Up" : "Login"}
//           </Button>
//         </div>
//       </Form>

//       <p className="text-center mt-3">
//         {isSignUp ? "Already have an account?" : "Don't have an account?"}
//         <Button type="link" onClick={() => setIsSignUp(!isSignUp)}>
//           {isSignUp ? "Login" : "Sign Up"}
//         </Button>
//       </p>
//     </div>
//   );
// }

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

  // const handleSubmit = async (values) => {
  //   setLoading(true);
  //   const { username, password } = values;

  //   const formBody = new URLSearchParams({
  //     action: isSignUp ? "register" : "login",
  //     username,
  //     password,
  //   }).toString();

  //   try {
  //     const response = await fetch(
  //       "https://script.google.com/macros/s/AKfycbzrdbiavqZH7zdqiMXhCELAHPTuPUoEvbqFooG40y5emNu3l6GXQ1boKoCLrnGVlqcopw/exec",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: formBody,
  //       }
  //     );

  //     const text = await response.text();
  //     const result = JSON.parse(text);

  //     if (result.success) {
  //       message.success(
  //         isSignUp ? "Registered successfully" : `Welcome ${username}`
  //       );
  //       setUser(username);
  //       form.resetFields();
  //     } else {
  //       message.error(result.error || "Invalid username or password");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     message.error("Unexpected response from server");
  //   }
  //   setLoading(false);
  // };

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

      // if (result.success) {
      //   message.success(isSignUp ? "Registered successfully" : `Welcome ${employeeId}`);
      //   setUser(employeeId); // You could also store username if needed
      //   form.resetFields();
      // }
      if (result.success) {
        // message.success(
        //   isSignUp ? "Registered successfully" : `Welcome ${result.username}`
        // );
        // setUser({ username: result.username, employeeId: result.employeeId });
        // form.resetFields();
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
          {/* <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item> */}
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

          {/* {!isSignUp && (
            <div className="text-end">
              <a href="#" style={{ color: "#3366cc" }}>Forgot password?</a>
            </div>
          )} */}

          <Button
            type="primary"
            htmlType="submit"
            className="w-100 mt-3 btn-gradient"
            size="large"
            loading={loading}
            // style={{ background: "linear-gradient(90deg, #3b82f6, #9333ea)", border: "none" }}
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

        {/* <div className="text-center my-3">OR</div>

        <Row className="text-center">
          <Col>
            <Button shape="circle" icon={<img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />} />
          </Col>
          <Col>
            <Button shape="circle" icon={<img src="https://img.icons8.com/color/24/facebook.png" alt="Facebook" />} />
          </Col>
          <Col>
            <Button shape="circle" icon={<img src="https://img.icons8.com/ios-filled/24/github.png" alt="GitHub" />} />
          </Col>
        </Row> */}

        <p className="text-center mt-3">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          {/* <Button type="link" onClick={() => setIsSignUp(!isSignUp)}> */}
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
