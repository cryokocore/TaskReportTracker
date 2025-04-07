import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Space,
  Table,
  Select,
  Tooltip,
  Avatar,
  Layout,
  Card,
  Divider,
  Row,
  Col,
  Typography,
  Statistic,
} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  UserOutlined,
  LogoutOutlined,
  ReloadOutlined,
  FileAddOutlined,
  CalendarOutlined,
  TeamOutlined,
  LinkOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  XOutlined,
} from "@ant-design/icons";
import { Button as BootstrapButton, Spinner, Navbar, Nav, Container } from "react-bootstrap";
import logo from "./Images/stratify-logo.png";
import Mithran from "./Images/Mithiran.png";
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

dayjs.extend(utc);
const { Header, Content } = Layout;
const { Title, Text } = Typography;

message.config({
  duration: 3,
  maxCount: 3,
});

const KarthiTaskTracker = ({ username, setUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [linkDateTime, setLinkDateTime] = useState(null);
  const isManualRefresh = useRef(false);
  const [tableData, setTableData] = useState([]); 
  const [showTable, setShowTable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workType, setWorkType] = useState(null);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const getSocialMediaIcon = (type) => {
    switch(type) {
      case "Facebook": return <FacebookOutlined />;
      case "Instagram": return <InstagramOutlined />;
      case "LinkedIn": return <LinkedinOutlined />;
      case "YouTube": return <YoutubeOutlined />;
      case "X": return <XOutlined />;
      default: return null;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Completed": return <CheckCircleOutlined style={{ color: 'green' }} />;
      case "Work in Progress": return <ClockCircleOutlined style={{ color: 'blue' }} />;
      case "Not Started": return <ClockCircleOutlined style={{ color: 'red' }} />;
      case "Under Review": return <InfoCircleOutlined style={{ color: 'purple' }} />;
      case "Pending": return <ClockCircleOutlined style={{ color: 'orange' }} />;
      case "Hold": return <ClockCircleOutlined style={{ color: 'gray' }} />;
      default: return null;
    }
  };

  const handleLinkChange = (e) => {
    if (e.target.value) {
      const currentTime = dayjs().utcOffset(330).startOf("second");          
      console.log("Updated DateTime:", currentTime.format("YYYY-MM-DD HH:mm:ss"));
      setLinkDateTime(currentTime);
    }
  };

  useEffect(() => {
    if (linkDateTime) {
      console.log("Updated dateTime state:", linkDateTime.format("YYYY-MM-DD HH:mm:ss"));
      form.setFieldsValue({ dateTime: linkDateTime }); 
    }
  }, [linkDateTime, form]);

  const handleLogout = () => {
    setUser(null);
    message.info(`See you soon ${username}. Take care!`);
  };

  const handleWorkTypeChange = (value) => {
    setWorkType(value);
    form.setFieldsValue({
      link: value === "Social Media" ? "" : undefined, 
      socialMediaType: value === "Social Media" ? "" : undefined,
      startDateTime: value !== "Social Media" ? "" : undefined,
      endDateTime: value !== "Social Media" ? "" : undefined,
    });
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxhY43Q1XMOUV7FAR5zhk3k4VE7aayMLmPBkIbZEbIbQ3ODkpPS9uI4ruv3hWY5P0DsQA/exec"
      );
      const text = await response.text();
      console.log("Raw Response:", text);

      try {
        const result = JSON.parse(text);

        if (
          result.success === false ||
          !Array.isArray(result) ||
          result.length === 0
        ) {
          message.warning("No data found.");
          setTableData([]);
          return;
        }

        console.log("Fetched Data:", result);
        setTableData(result);
        if (isManualRefresh.current) {
          message.success("Table data updated successfully.");
          isManualRefresh.current = false; // Reset after showing message
        }
      } catch {
        throw new Error("Invalid JSON response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
      setTableData([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleManualRefresh = () => {
    isManualRefresh.current = true;
    fetchData();

  };
  const handleSubmit = async (values) => {
    setLoading(true);
    const formattedDateTime = linkDateTime
      ? linkDateTime.utcOffset(330).format("YYYY-MM-DD HH:mm:ss")
      : "";

    console.log("Final Sent to Google Sheets (Fixed Time):", formattedDateTime);
    console.log("Form Values Submitted:", values);

    const {
      workType,
      clientName,
      link,
      details,
      socialMediaType,
      startDateTime,
      endDateTime,
      status
    } = values;

    if (!clientName) {
      message.error("Client Name is required.");
      setLoading(false);
      return;
    }

    if (workType === "Social Media") {
      if (!link || link.trim() === "") {
        message.error("Link is required for social media work.");
        setLoading(false);
        return;
      }
      if (!socialMediaType) {
        message.error("Please select a social media type.");
        setLoading(false);
        return;
      }
    }
  
    if (workType !== "Social Media" && (!startDateTime || !endDateTime)) {
      message.error("Please select start and end date/time.");
      setLoading(false);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("action", "submit");
    formData.append("workType", workType);
    formData.append("clientName", clientName);
    formData.append("link", workType === "Social Media" ? link : ""); 
    formData.append("details", details || "N/A");
    formData.append("dateTime", formattedDateTime || "N/A"); 

    if (workType === "Social Media") {
      formData.append("socialMediaType", socialMediaType);
      formData.append("startDateTime", "");
      formData.append("endDateTime", "");
    } else {
      formData.append("socialMediaType", "");
      formData.append(
        "startDateTime",
        startDateTime ? startDateTime.toISOString() : ""
      );
      formData.append(
        "endDateTime",
        endDateTime ? endDateTime.toISOString() : ""
      );
    }
    formData.append("status", status);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxhY43Q1XMOUV7FAR5zhk3k4VE7aayMLmPBkIbZEbIbQ3ODkpPS9uI4ruv3hWY5P0DsQA/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const result = await response.json();
      if (result.success) {
        message.success("Task Report Submitted Successfully!");
        form.resetFields();
        setDateTime(null);
        setStartDateTime(null);
        setEndDateTime(null);
        fetchData();
      } else {
        message.error(`Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      message.error("An error occurred while saving data.");
    } finally {
      setLoading(false);
    }
  };

  const formattedData = tableData.map((item, index) => ({
    key: index,
    workType: item["Work Type"]?.trim(),
    clientName: item["Client Name"]?.trim(),
    startDateTime: item["Start Date & Time"] ? dayjs(item["Start Date & Time"]).format("YYYY-MM-DD HH:mm:ss") : "-",
    endDateTime: item[" End Date & Time"] ? dayjs(item[" End Date & Time"]).format("YYYY-MM-DD HH:mm:ss") : "-",
    duration: item["Duration"] && item["Duration"] !== "1899-12-29T18:38:53.000Z" ? item["Duration"] : "-",
    details: item["Details"]?.trim() || "-",
    socialMediaType: item["Social Media Type"]?.trim() || "-",
    link: item["Link"] || "N/A",
    linkPostedDateTime: item["Link Posted Date & Time"] ? dayjs(item["Link Posted Date & Time"]).format("YYYY-MM-DD HH:mm:ss") : "-",
    totalLinkCount: item["Total Link Count"] || "-",
    status: item["Status"] 
  }));

  const columns = [
    { 
      title: "Work Type", 
      dataIndex: "workType", 
      key: "workType", 
      width: 150,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    { 
      title: "Client Name", 
      dataIndex: "clientName", 
      key: "clientName", 
      width: 150, 
      render: (text) => <Tooltip title={text}>{text}</Tooltip> 
    },
    { 
      title: "Start Date & Time", 
      dataIndex: "startDateTime", 
      key: "startDateTime", 
      width: 180, 
      render: (text) => <Tooltip title={text}>{text}</Tooltip> 
    },
    { 
      title: "End Date & Time", 
      dataIndex: "endDateTime", 
      key: "endDateTime", 
      width: 180, 
      render: (text) => <Tooltip title={text}>{text}</Tooltip> 
    },
    { 
      title: "Duration", 
      dataIndex: "duration", 
      key: "duration", 
      width: 120, 
      render: (text) => <Tooltip title={text}>{text}</Tooltip> 
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      width: 300,
      render: (text) => {
        const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;
        return <Tooltip title={text}>{truncatedText}</Tooltip>;
      },
    },
    { 
      title: "Social Media Type", 
      dataIndex: "socialMediaType", 
      key: "socialMediaType", 
      width: 150, 
      render: (text) => {
        const icon = getSocialMediaIcon(text);
        return <Tooltip title={text}>{icon ? <>{icon} {text}</> : text}</Tooltip>;
      } 
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      width: 200,
      render: (text) => {
        if (!text || text === "N/A") return <Tooltip title="N/A">N/A</Tooltip>;
  
        const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;
        return (
          <Tooltip title={text}>
            <a href={text} target="_blank" rel="noopener noreferrer">
              {truncatedText}
            </a>
          </Tooltip>
        );
      },
    },
    { 
      title: "Link Posted Date & Time", 
      dataIndex: "linkPostedDateTime", 
      key: "linkPostedDateTime", 
      width: 180,  
      render: (text) => <Tooltip title={text}>{text}</Tooltip>, 
    },
    { 
      title: "Total Link Count", 
      dataIndex: "totalLinkCount", 
      key: "totalLinkCount", 
      width: 100,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: "Status", 
      dataIndex: "status", 
      key: "status",  
      width: 120,
      render: (text) => {
        const icon = getStatusIcon(text);
        return <Tooltip title={text}><span>{icon} {text}</span></Tooltip>;
      }
    }
  ];

  const getTaskStats = () => {
    if (!tableData || tableData.length === 0) return { total: 0, completed: 0, pending: 0, incomplete: 0 };
    
    const total = tableData.length;
    const completed = tableData.filter(item => item["Status"] === "Completed").length;
    const pending = tableData.filter(item => item["Status"] === "Pending" || item["Status"] === "Under Review").length;
    const incomplete = tableData.filter(item => 
      item["Status"] === "Not Started" || 
      item["Status"] === "Work in Progress" || 
      item["Status"] === "Hold"
    ).length;
    
    return { total, completed, pending, incomplete };
  };

  const taskStats = getTaskStats();

  const customStyles = `
    .spinner-border-sm {
      --bs-spinner-width: 1rem;
      --bs-spinner-height: 1rem;
      --bs-spinner-border-width: 2px;
      margin-right: 3px;
    }
    
    .header-gradient {
      background: linear-gradient(to right,rgb(255, 255, 255),rgb(255, 255, 255));
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .card-shadow {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border-radius: 8px;
    }
    
    .card-shadow:hover {
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .form-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .table-section {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .gradient-btn {
      background: linear-gradient(to right, #5c258d, #4389a2);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }
    
    .gradient-btn:hover {
      background: linear-gradient(to left,rgb(13, 28, 79), #5c258d);
      opacity: 0.95;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .gradient-text {
      background: linear-gradient(to right, #5c258d, #4389a2);
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bold;
    }
    
    .ant-form-item-label > label {
      font-weight: 600;
      color: #333;
    }
    
    .ant-btn {
      font-size: 16px;
      height: auto;
      padding: 8px 16px;
      border-radius: 6px;
    }
    
    .ant-table {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    
    .ant-table-thead > tr > th {
      background-color: #f0f5ff;
      font-weight: 600;
    }
    
    .profile-container {
      position: relative;
    }
    
    .logout-popup {
      position: absolute;
      top: 100%;
      right: -10px;
      background: white;
      color: red;
      padding: 10px ;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-top: 10px;
      margin-left: 100px !important;
      z-index: 100;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size:16px;
    }
    
    .logout-popup:hover {
      background-color: red;
      color: white;
    }
    
    .stats-card {
      border-radius: 12px;
      transition: all 0.3s;
      height: 100%;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    
    .stats-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    
    .total-card {
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    }
    
    .completed-card {
      background: linear-gradient(135deg, #1d976c 0%, #93f9b9 100%);
    }
    
    .pending-card {
      background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
    }
    
    .incomplete-card {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    }
    
    .stat-value {
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .stat-title {
      font-size: 1.2rem;
      color: white;
      font-weight: 600;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: white;
      opacity: 0.8;
    }
  `;

  return (
    <div className="container-fluid p-0">
      <style>{customStyles}</style>
      <Layout className="min-vh-100">
        <Navbar fixed="top" className="header-gradient  py-3">
          <Container fluid className="d-flex justify-content-between align-items-center">
            <div>
              <img src={logo} alt="stratify logo" height="50" className="ms-2" />
            </div>

            <div className="text-center flex-grow-1">
              <h2 className="m-0 text-dark">
                {`${username}'s Task Report Tracker`}
              </h2>
            </div>

            <div className="d-flex align-items-center profile-container">
                <Avatar
                  size={48}
                //   src={Mithran}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
                  onMouseEnter={() => setShowLogout(true)}
                />
              
              {showLogout && (
                <div 
                  className="logout-popup"
                  onClick={handleLogout}
                  onMouseLeave={() => setShowLogout(false)}
                >
                  <LogoutOutlined style={{ marginRight: '4px' }} />
                  <span>Logout</span>
                </div>
              )}
            </div>
          </Container>
        </Navbar>
        
        <Content className="container mt-5 pt-4">
          <Row gutter={[24, 24]} className="mt-4">
            <Col xs={24}>
              <Card 
                title={
                  <div className="d-flex align-items-center">
                    <FileAddOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                    <span className="gradient-text">New Task Report</span>
                  </div>
                } 
                className="card-shadow"
                headStyle={{ borderBottom: '2px solid #f0f0f0' }}
              >
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handleSubmit}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span><TeamOutlined /> Client Name</span>}
                        name="clientName"
                        rules={[{ required: true, message: "Please enter client name" }]}
                      >
                        <Input placeholder="Enter client name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span><FormOutlined /> Work Type</span>}
                        name="workType"
                        rules={[{ required: true, message: "Please select your work type" }]}
                      >
                        <Select
                          placeholder="Select work type"
                          onChange={handleWorkTypeChange}
                          size="large"
                        >
                          <Select.Option value="Social Media">Social Media</Select.Option>
                          <Select.Option value="Other">Other</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    {workType === "Social Media" ? (
                      <>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<span><FormOutlined /> Social Media Type</span>}
                            name="socialMediaType"
                            rules={[{ required: true, message: "Please select social media type" }]}
                          >
                            <Select placeholder="Select social media type" size="large">
                              <Select.Option value="Facebook"><FacebookOutlined /> Facebook</Select.Option>
                              <Select.Option value="Instagram"><InstagramOutlined /> Instagram</Select.Option>
                              <Select.Option value="LinkedIn"><LinkedinOutlined /> LinkedIn</Select.Option>
                              <Select.Option value="X"><XOutlined /> X</Select.Option>
                              <Select.Option value="YouTube"><YoutubeOutlined /> YouTube</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<span><LinkOutlined /> Link</span>}
                            name="link"
                            rules={[{ required: true, message: "Please enter the link" }]}
                          >
                            <TextArea
                              placeholder="Enter the link"
                              onChange={handleLinkChange}
                              rows={1}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item label={<span><CalendarOutlined /> Date & Time</span>} name="dateTime">
                            <DatePicker
                              showTime
                              value={linkDateTime ? dayjs(linkDateTime) : null}
                              disabled
                              style={{ width: "100%" }}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<span><CalendarOutlined /> Start Date & Time</span>}
                            name="startDateTime"
                            rules={[{ required: true, message: "Please select start date & time" }]}
                          >
                            <DatePicker
                              showTime
                              value={startDateTime}
                              onChange={(value) => setStartDateTime(value)}
                              style={{ width: "100%" }}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<span><CalendarOutlined /> End Date & Time</span>}
                            name="endDateTime"
                            rules={[{ required: true, message: "Please select end date & time" }]}
                          >
                            <DatePicker
                              showTime
                              value={endDateTime}
                              onChange={(value) => setEndDateTime(value)}
                              style={{ width: "100%" }}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span><InfoCircleOutlined /> Details</span>}
                        name="details"
                        rules={[{ required: true, message: "Please enter the details" }]}
                      >
                        <TextArea placeholder="Enter the task details" rows={3} size="large" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span><ClockCircleOutlined /> Status</span>}
                        name="status"
                        rules={[{ required: true, message: "Please select status of work" }]}
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="Not Started">
                            <ClockCircleOutlined style={{ color: 'red' }} /> Not Started
                          </Select.Option>
                          <Select.Option value="Work in Progress">
                            <ClockCircleOutlined style={{ color: 'blue' }} /> Work in Progress
                          </Select.Option>
                          <Select.Option value="Under Review">
                            <InfoCircleOutlined style={{ color: 'purple' }} /> Under Review
                          </Select.Option>
                          <Select.Option value="Pending">
                            <ClockCircleOutlined style={{ color: 'orange' }} /> Pending
                          </Select.Option>
                          <Select.Option value="Hold">
                            <ClockCircleOutlined style={{ color: 'gray' }} /> Hold
                          </Select.Option>
                          <Select.Option value="Completed">
                            <CheckCircleOutlined style={{ color: 'green' }} /> Completed
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} className="text-center mt-3">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="gradient-btn px-5 py-2"
                        style={{ fontSize: "16px", height: "auto" }}
                        size="large"
                      >
                        {loading ? "Submitting..." : "Submit Task Report"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div className="stats-card total-card">
                    <div className="stat-icon">
                      <FormOutlined />
                    </div>
                    <div className="stat-value">{taskStats.total}</div>
                    <div className="stat-title">Total Tasks</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="stats-card completed-card">
                    <div className="stat-icon">
                      <CheckCircleOutlined />
                    </div>
                    <div className="stat-value">{taskStats.completed}</div>
                    <div className="stat-title">Completed</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="stats-card pending-card">
                    <div className="stat-icon">
                      <ClockCircleOutlined />
                    </div>
                    <div className="stat-value">{taskStats.pending}</div>
                    <div className="stat-title">Pending</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="stats-card incomplete-card">
                    <div className="stat-icon">
                      <InfoCircleOutlined />
                    </div>
                    <div className="stat-value">{taskStats.incomplete}</div>
                    <div className="stat-title">Incomplete</div>
                  </div>
                </Col>
              </Row>
            </Col>
            
            <Col xs={24}>
              <Card 
                title={
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <CalendarOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                      <span className="gradient-text">Task Reports</span>
                    </div>
                    <Space>
                 
                      <Button
                        type="primary"
                        onClick={handleManualRefresh}

                        loading={refreshing}
                        icon={<ReloadOutlined />}
                        className="gradient-btn d-flex align-items-center"
                      >
                        {refreshing ? "Refreshing..." : "Refresh"}
                      </Button>
                    </Space>
                  </div>
                } 
                className="card-shadow"
                headStyle={{ borderBottom: '2px solid #f0f0f0' }}
              >
            
                  <Table
                    dataSource={formattedData}
                    columns={columns}
                    rowKey={(record) => record.key}
                    pagination={{ 
                      pageSize: 10,
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` 
                    }}
                    scroll={{ x: "max-content" }}
                    size="middle"
                    bordered
                    loading={refreshing}
                    className="mt-2"
                    rowClassName={(record) => record.status === 'Completed' ? 'bg-light' : ''}
                  />
         
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default KarthiTaskTracker;
