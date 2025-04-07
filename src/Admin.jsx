import React, { useEffect, useState, useRef } from "react";
import {
  Layout,
  Select,
  Table,
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Input,
  Button,
  message,
  Avatar,
  Form,
  Spin,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  FileAddOutlined,
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
  SyncOutlined,
  PauseCircleOutlined,
  IdcardOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./App.css";
import {
  Button as BootstrapButton,
  Spinner,
  Navbar,
  Nav,
  Container,
  Progress,
} from "react-bootstrap";
import logo from "./Images/stratify-logo.png";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Admin = ({ username, setUser, user }) => {
  const [employeeIds, setEmployeeIds] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const isManualRefresh = useRef(false);
  const [showLogout, setShowLogout] = useState(false);
  const [form] = Form.useForm();
  const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  const selectedEmployeeName = employeeList.find(
    (emp) => emp.id === selectedEmployee
  )?.name;
  const selectedEmployeeId = employeeList.find(
    (emp) => emp.id === selectedEmployee
  )?.id;

  // Fetch employee IDs
  useEffect(() => {
    fetchEmployeeIds();
  }, []);

  const fetchEmployeeIds = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbz2rACgfR3kzocwi1B4TR8-APifgjL0aB_I9hijq1qOsD6jJUFNGbz8uFwQDC_9zWIfKg/exec"
      );
      const data = await response.json();

      if (data.success) {
        setEmployeeList(data.data);

        console.log("Employee List:", data);
      } else {
        console.error("Error fetching employee IDs:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // ✅ Function to fetch selected employee's task data
  const fetchEmployeeData = async (employeeId) => {
    setRefreshing(true);

    try {
      setLoadingEmployeeData(true);
      setSelectedEmployee(employeeId); // Update selected employee
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbz2rACgfR3kzocwi1B4TR8-APifgjL0aB_I9hijq1qOsD6jJUFNGbz8uFwQDC_9zWIfKg/exec?employeeId=${employeeId}`
      );
      const data = await response.json();
      console.log("Fetched Employee Data:", data);

      // ✅ Ensure employeeData is always an array
      if (Array.isArray(data)) {
        setEmployeeData(data);
        if (isManualRefresh.current) {
          message.success("Table data updated successfully.");
          isManualRefresh.current = false; // Reset after showing message
        }
      } else if (data.success === false) {
        setEmployeeData([]); // Clear data if empty
        console.error("No data found:", data.message);
      } else {
        setEmployeeData([]); // Fallback if unexpected response
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setRefreshing(false);
      setLoadingEmployeeData(false);
    }
  };
  const handleLogout = () => {
    setUser(null);
    message.info(`See you soon ${username}. Take care!`);
  };
  const statusMapping = {
    total: null,
    completed: "Completed",
    pending: "Pending",
    notStarted: "Not Started",
    workinprogress: "Work In Progress",
    underReview: "Under Review",
    hold: "Hold",
  };
  const employeeId = user?.employeeId;

  const handleCardClick = (key) => {
    // setSelectedStatus(statusMapping[key]);
    setSearchText(""); // ✅ Clear search text
    setIsSearchActive(false);
    setSelectedStatus((prev) =>
      prev === statusMapping[key] ? null : statusMapping[key]
    );
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value) {
      setSelectedStatus(null); // ✅ Disable card selection when searching
      setIsSearchActive(true); // ✅ Activate search mode
    } else {
      setIsSearchActive(false); // ✅ Restore normal mode when search is cleared
    }
  };

  const formattedData = employeeData.map((item, index) => {
    console.log("Mapping item", item); // Add this

    if (selectedEmployee === "ST006") {
      return {
        key: index,
        workType: item["Work Type"]?.trim(),
        clientName: item["Client Name"]?.trim(),
        startDateTime: item["Start Date & Time"]
          ? dayjs(item["Start Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        endDateTime: item[" End Date & Time"]
          ? dayjs(item[" End Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        duration:
          item["Duration"] && item["Duration"] !== "1899-12-29T18:38:53.000Z"
            ? item["Duration"]
            : "-",
        details: item["Details"]?.trim() || "-",
        socialMediaType: item["Social Media Type"]?.trim() || "-",
        link: item["Link"] || "N/A",
        linkPostedDateTime: item["Link Posted Date & Time"]
          ? dayjs(item["Link Posted Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        totalLinkCount: item["Total Link Count"] || "-",
        status: item["Status"],
        assigned: item["Assigned By"],
        notes: item["Notes/Remarks"] || "-",
      };
    } else {
      return {
        key: index,
        clientName: item["Client/Task Name"]?.trim() || "-",
        startDateTime: item["Start Date & Time"]
          ? dayjs(item["Start Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        endDateTime: item["End Date & Time"]
          ? dayjs(item["End Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        duration: item["Duration"] || "-",
        details: item["Details"]?.trim() || "-",
        link: item["Link"] || "N/A",
        totalCount: item["Total Count"] || "0",
        status: item["Status"] || "-",
        assigned: item["Assigned By"] || "-",
        notes: item["Notes/Remarks"] || "-",
      };
    }
  });
  const filteredData = formattedData.filter((item) => {
    if (isSearchActive) {
      return Object.values(item).some((value) => {
        if (!value) return false;

        const normalizedValue = value
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, ""); // Normalize spaces
        const normalizedSearch = searchText
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "");

        return normalizedValue.includes(normalizedSearch);
      });
    } else {
      return (
        !selectedStatus ||
        item.status?.toLowerCase().trim() ===
          selectedStatus.toLowerCase().trim()
      );
    }
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const getValidDate = (item) => {
      const linkDate = item.linkPostedDateTime;
      const startDate = item.startDateTime;

      // Use linkPostedDateTime if valid, else fallback to startDateTime
      const dateToUse = linkDate && linkDate !== "-" ? linkDate : startDate;

      return new Date(dateToUse);
    };

    return getValidDate(b) - getValidDate(a); // latest first
  });

  console.log(filteredData.map((item) => item.startDateTime));
  console.log("Formatted Data", formattedData);

  const getSocialMediaIcon = (type) => {
    switch (type) {
      case "Facebook":
        return <FacebookOutlined />;
      case "Instagram":
        return <InstagramOutlined />;
      case "LinkedIn":
        return <LinkedinOutlined />;
      case "YouTube":
        return <YoutubeOutlined />;
      case "X":
        return <XOutlined />;
      default:
        return null;
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleOutlined style={{ color: "green" }} />;
      case "Work in Progress":
        return <ClockCircleOutlined style={{ color: "blue" }} />;
      case "Not Started":
        return <ClockCircleOutlined style={{ color: "red" }} />;
      case "Under Review":
        return <InfoCircleOutlined style={{ color: "purple" }} />;
      case "Pending":
        return <ClockCircleOutlined style={{ color: "orange" }} />;
      case "Hold":
        return <ClockCircleOutlined style={{ color: "gray" }} />;
      default:
        return null;
    }
  };
  const getColumns = (employeeId) => {
    if (employeeId === "ST006") {
      return [
        {
          title: "Work Type",
          dataIndex: "workType",
          key: "workType",
          width: 150,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Client Name",
          dataIndex: "clientName",
          key: "clientName",
          width: 150,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Start Date & Time",
          dataIndex: "startDateTime",
          key: "startDateTime",
          width: 180,
          sorter: (a, b) =>
            new Date(a.startDateTime) - new Date(b.startDateTime),

          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "End Date & Time",
          dataIndex: "endDateTime",
          key: "endDateTime",
          width: 180,
          sorter: (a, b) => new Date(a.endDateTime) - new Date(b.endDateTime),

          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Duration",
          dataIndex: "duration",
          key: "duration",
          width: 120,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Details",
          dataIndex: "details",
          key: "details",
          width: 300,
          render: (text) => {
            const truncatedText =
              text.length > 50 ? `${text.substring(0, 50)}...` : text;
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
            return (
              <Tooltip title={text}>
                {icon ? (
                  <>
                    {icon} {text}
                  </>
                ) : (
                  text
                )}
              </Tooltip>
            );
          },
        },
        {
          title: "Link",
          dataIndex: "link",
          key: "link",
          width: 200,
          render: (text) =>
            text && text !== "N/A" ? (
              <Tooltip title={text}>
                <a href={text} target="_blank" rel="noopener noreferrer">
                  {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                </a>
              </Tooltip>
            ) : (
              <Tooltip title="N/A">N/A</Tooltip>
            ),
        },
        {
          title: "Link Posted Date & Time",
          dataIndex: "linkPostedDateTime",
          key: "linkPostedDateTime",
          width: 180,
          sorter: (a, b) =>
            new Date(a.linkPostedDateTime) - new Date(b.linkPostedDateTime),

          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Total Link Count",
          dataIndex: "totalLinkCount",
          key: "totalLinkCount",
          width: 100,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 120,
          render: (text) => {
            const icon = getStatusIcon(text);
            return (
              <Tooltip title={text}>
                <span>
                  {icon} {text}
                </span>
              </Tooltip>
            );
          },
        },
        {
          title: "Assigned By",
          dataIndex: "assigned",
          key: "assigned",
          width: 150,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Notes/Remarks",
          dataIndex: "notes",
          key: "notes",
          width: 250,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
      ];
    } else {
      return [
        {
          title: "Client Name",
          dataIndex: "clientName",
          key: "clientName",
          width: 150,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Start Date & Time",
          dataIndex: "startDateTime",
          key: "startDateTime",
          width: 180,
          sorter: (a, b) =>
            new Date(a.startDateTime) - new Date(b.startDateTime),
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "End Date & Time",
          dataIndex: "endDateTime",
          key: "endDateTime",
          width: 180,
          sorter: (a, b) => new Date(a.endDateTime) - new Date(b.endDateTime),
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Duration",
          dataIndex: "duration",
          key: "duration",
          width: 120,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Details",
          dataIndex: "details",
          key: "details",
          width: 300,
          render: (text) => {
            const truncatedText =
              text.length > 50 ? `${text.substring(0, 50)}...` : text;
            return <Tooltip title={text}>{truncatedText}</Tooltip>;
          },
        },
        {
          title: "Link",
          dataIndex: "link",
          key: "link",
          width: 200,
          render: (text) =>
            text && text !== "N/A" ? (
              <Tooltip title={text}>
                <a href={text} target="_blank" rel="noopener noreferrer">
                  {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                </a>
              </Tooltip>
            ) : (
              "N/A"
            ),
        },
        {
          title: "Total Count",
          dataIndex: "totalCount",
          key: "totalCount",
          width: 100,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 120,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Assigned By",
          dataIndex: "assigned",
          key: "assigned",
          width: 150,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Notes/Remarks",
          dataIndex: "notes",
          key: "notes",
          width: 250,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
      ];
    }
  };

  // Usage example
  const columns = getColumns(selectedEmployee);
  const handleExport = () => {
    const exportData = filteredData.map(({ key, ...rest }) => {
      const newRow = {};
      Object.keys(rest).forEach((k) => {
        const capitalizedKey = k.charAt(0).toUpperCase() + k.slice(1);
        newRow[capitalizedKey] = rest[k];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Apply header styles
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      const cell = worksheet[headerCell];

      if (cell) {
        cell.s = {
          fill: {
            fgColor: { rgb: "FFFF00" }, // Yellow background
          },
          font: {
            bold: true,
            sz: 14,
            color: { rgb: "000000" }, // Ensure font is black
          },
          alignment: {
            horizontal: "top",
            vertical: "center",
            wrapText: true, // Makes long text readable
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // Apply border & wrapping to all cells
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cell_address];
        if (cell) {
          if (!cell.s) cell.s = {};
          cell.s.border = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          };
          cell.s.alignment = {
            vertical: "center",
            horizontal: "center",
            wrapText: true,
          };
        }
      }
    }

    // Adjust column widths
    const maxWidths = [];
    exportData.forEach((row) => {
      Object.values(row).forEach((val, colIdx) => {
        const len = String(val).length;
        maxWidths[colIdx] = Math.max(maxWidths[colIdx] || 10, len);
      });
    });

    worksheet["!cols"] = maxWidths.map((w) => ({ wch: w + 6 })); // +5 for padding

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${selectedEmployeeId} - ${selectedEmployeeName}`
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    const today = new Date().toISOString().split("T")[0];
    saveAs(
      data,
      `${selectedEmployeeId} - ${selectedEmployeeName} Task Report ${today}.xlsx`
    );
  };

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
           .gradient-background {
      background: linear-gradient(to right, #5c258d, #4389a2);
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
      padding: 15px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: rgba(255, 255, 255); /* transparent white */

      margin-top: 10px;
      margin-left: 100px !important;
      z-index: 100;
      display: flex;
        flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size:16px;
       border: 2px solid #f7f5f5;
                     width: 200px;
       height: auto;
    }
    
  .logout-action {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: red;
  cursor: pointer;
  padding: 4px 8px;
     border: 2px solid red;
  border-radius: 4px;
  transition: background 0.2s ease, color 0.2s ease;
}

.logout-action:hover {
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
      padding: 2.5rem;
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
      font-size: 15px;
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
      .not-started-card {
  background: linear-gradient(135deg, #757f9a 0%, #d7dde8 100%);
}

.work-in-progress-card {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
}

.under-review-card {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
}

.hold-card {
  background: linear-gradient(135deg, #b06ab3 0%, #4568dc 100%);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}
.ant-card .ant-card-body {
    padding: 10px;
    border-radius: 0 0 8px 8px;
}
  `;

  const getTaskStats = () => {
    if (!employeeData || employeeData.length === 0) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        workinprogress: 0,
        underReview: 0,
        hold: 0,
        notStarted: 0,
        percentages: {
          completed: 0,
          pending: 0,
          workinprogress: 0,
          underReview: 0,
          hold: 0,
          notStarted: 0,
        },
      };
    }

    const total = employeeData.length;
    const statuses = [
      "Completed",
      "Pending",
      "Work in Progress",
      "Under Review",
      "Hold",
      "Not Started",
    ];
    const stats = {};

    // Count occurrences of each status
    statuses.forEach((status) => {
      stats[status] = employeeData.filter(
        (item) => item["Status"] === status
      ).length;
    });

    const getPercentage = (count) =>
      total ? ((count / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      completed: stats["Completed"] || 0,
      pending: stats["Pending"] || 0,
      workinprogress: stats["Work in Progress"] || 0,
      underReview: stats["Under Review"] || 0,
      hold: stats["Hold"] || 0,
      notStarted: stats["Not Started"] || 0,
      percentages: {
        completed: getPercentage(stats["Completed"]),
        pending: getPercentage(stats["Pending"]),
        workinprogress: getPercentage(stats["Work in Progress"]),
        underReview: getPercentage(stats["Under Review"]),
        hold: getPercentage(stats["Hold"]),
        notStarted: getPercentage(stats["Not Started"]),
      },
    };
  };

  const taskStats = getTaskStats();
  const handleManualRefresh = () => {
    if (!selectedEmployee) {
      message.warning("Please select an employee first.");
      return;
    }

    isManualRefresh.current = true;
    setSelectedStatus(null);
    setSearchText("");
    fetchEmployeeData(selectedEmployee);
    setTableKey((prev) => prev + 1);
  };

  return (
    <div className="container-fluid p-0">
      {" "}
      <style>{customStyles}</style>
      <Layout className="min-vh-100">
        <Navbar fixed="top" className="header-gradient  py-3">
          <Container
            fluid
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <img
                src={logo}
                alt="stratify logo"
                height="50"
                className="ms-2"
              />
            </div>

            <div className="text-center flex-grow-1">
              <h2 className="m-0 gradient-text fw-bold">
                {`${username}'s Admin Dashboard`}
              </h2>
            </div>

            <div className="d-flex align-items-center profile-container">
              <Avatar
                size={48}
                style={{ backgroundColor: "#2f81c2", cursor: "pointer" }}
                onMouseEnter={() => setShowLogout(true)}
              >
                {username?.slice(0, 2).toUpperCase()}
              </Avatar>

              {showLogout && (
                <div
                  className="logout-popup"
                  onMouseLeave={() => setShowLogout(false)}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      marginBottom: "3px",
                      fontSize: "18px",
                      color: "black",
                    }}
                    className="text-center"
                  >
                    <div>
                      <UserOutlined
                        className="gradient-background text-white "
                        style={{
                          border: "2px solid white",
                          padding: "10px",
                          borderRadius: "40px",
                          padding: "10px",
                        }}
                      />
                    </div>

                    <div className="gradient-text mt-1">
                      Hello, <br />
                      {username}!<br />({employeeId})
                    </div>
                  </div>
                  <div
                    style={{
                      borderBottom: "3px solid #f0f0f0",
                      borderRadius: "50%",
                      width: "150px",
                    }}
                    className="mt-1"
                  ></div>

                  <div className="logout-action mt-2" onClick={handleLogout}>
                    <LogoutOutlined style={{ marginRight: "6px" }} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Navbar>

        <Content className="container mt-5 pt-5">
          <Row
            gutter={[24, 24]}
            justify="center"
            className="mt-4"
            style={{ marginBottom: "20px" }}
          >
            <Col>
              <Form.Item
                label={
                  <>
                    <span className="mt-1">
                      <IdcardOutlined style={{ fontSize: 25 }} />
                    </span>
                    <span className="ms-1 ">Please select the employee Id</span>
                  </>
                }
              >
                {" "}
                <Spin spinning={loadingEmployeeData} className="text-center">
                  <Select
                    style={{ width: 300 }}
                    placeholder="Select Employee"
                    onChange={fetchEmployeeData}
                  >
                    {employeeList.map((emp) => (
                      <Option key={emp.id} value={emp.id}>
                        {emp.id} - {emp.name}
                      </Option>
                    ))}
                  </Select>
                </Spin>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} justify="center">
            {[
              {
                label: "Total Tasks",
                key: "total",
                gradient: "linear-gradient(to right, #5913e6, #8e2de2)",
              },
              {
                label: "Completed",
                key: "completed",
                gradient: "linear-gradient(to right, #33c755, #74e974)",
              },
              {
                label: "Pending",
                key: "pending",
                gradient: "linear-gradient(to right, #f7971e, #edb053)",
              },
              {
                label: "Not Started",
                key: "notStarted",
                gradient: "linear-gradient(to right, #e15260, #ee847b)",
              },
              {
                label: "Work in Progress",
                key: "workinprogress",
                gradient: "linear-gradient(to right, #007bff, #649bee)",
              },

              {
                label: "Under Review",
                key: "underReview",
                gradient: "linear-gradient(to right, #8e44ad, #c386db)",
              },
              {
                label: "Hold",
                key: "hold",
                gradient: "linear-gradient(to right, #6c757d, #9cb1c6)",
              },
            ].map(({ label, key, gradient }) => (
              <Col xs={24} sm={12} md={8} lg={5} key={key}>
                <Card
                  className="stats-card"
                  style={{
                    background: gradient,
                    minHeight: "100px", // ✅ Ensures uniform height
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "opacity 0.3s ease-in-out", // ✅ Smooth transition

                    opacity:
                      selectedStatus && selectedStatus !== statusMapping[key]
                        ? 0.3
                        : 1,
                  }}
                  onClick={() => handleCardClick(key)}
                >
                  <div
                    className="stat-value"
                    style={{ fontSize: "1.8rem", fontWeight: "bold" }}
                  >
                    {taskStats[key]} {/* ✅ Show actual task count */}
                  </div>
                  <div className="stat-title">
                    {label} (
                    {key !== "total"
                      ? `${taskStats.percentages[key]}%`
                      : "100%"}
                    )
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width:
                          key !== "total"
                            ? `${taskStats.percentages[key]}%`
                            : "100%",
                      }}
                    ></div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Col xs={24} className="mt-5">
            <Card
              title={
                <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 ">
                  {/* Icon and Title */}
                  <div className="d-flex align-items-center ">
                    <CalendarOutlined
                      style={{ fontSize: "24px", marginRight: "10px" }}
                    />
                    {/* <span className="gradient-text">Task Reports</span> */}
                    <span className="gradient-text">
                      {selectedEmployeeName && selectedEmployeeId
                        ? ` ${selectedEmployeeId} - ${selectedEmployeeName}'s `
                        : ""}
                      Task Report{" "}
                    </span>
                  </div>

                  {/* Centered Search Bar */}
                  <div className="flex-grow-1 d-flex justify-content-center">
                    <Input
                      placeholder="Search Tasks..."
                      prefix={<SearchOutlined />}
                      allowClear
                      value={searchText}
                      // onChange={(e) => setSearchText(e.target.value)}
                      onChange={handleSearchChange}
                      disabled={selectedStatus !== null}
                      style={{ width: 500 }}
                    />
                  </div>

                  {/* Refresh Button */}
                  <Button
                    type="primary"
                    onClick={handleManualRefresh}
                    loading={refreshing}
                    icon={<ReloadOutlined />}
                    className="gradient-btn d-flex align-items-center"
                  >
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              }
              className="card-shadow"
              headStyle={{ borderBottom: "2px solid #f0f0f0" }}
            >
              <Button
                type="primary"
                onClick={handleExport}
                icon={<DownloadOutlined />}
                disabled={filteredData.length === 0 || loadingEmployeeData}
                className="gradient-btn d-flex align-items-end"
              >
                Export to excel
              </Button>
              <Table
                key={tableKey}
                dataSource={sortedData}
                columns={columns}
                rowKey={(record) => record.key}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                scroll={{ x: "max-content" }}
                size="middle"
                bordered
                loading={refreshing}
                className="mt-2"
              />
            </Card>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};

export default Admin;
