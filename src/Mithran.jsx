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
  Modal,
} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import {
  UserOutlined,
  LogoutOutlined,
  ReloadOutlined,
  FileAddOutlined,
  CalendarOutlined,
  TeamOutlined,
  EditOutlined,
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
  SearchOutlined,
  SyncOutlined,
  PauseCircleOutlined,
  DownloadOutlined,
  BarChartOutlined,
  TableOutlined,
  EyeOutlined,
  OrderedListOutlined 
} from "@ant-design/icons";
import {
  Button as BootstrapButton,
  Spinner,
  Navbar,
  Nav,
  Container,
  Progress,
} from "react-bootstrap";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdBadge,
  faSuitcase,
  faEnvelope,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import logo from "./Images/stratify-logo.png";
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

dayjs.extend(utc);
const { Header, Content } = Layout;
const { Title, Text } = Typography;
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
message.config({
  duration: 3,
  maxCount: 3,
});

const MithranTaskTracker = ({ username, setUser, user }) => {
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
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewForm] = Form.useForm();
  const employeeDesignation = user?.designation;
  const employeeMail = user?.mailid;
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

  const handleLinkChange = (e) => {
    if (e.target.value) {
      const currentTime = dayjs().utcOffset(330).startOf("second");
      setLinkDateTime(currentTime);
      editForm.setFieldsValue({ dateTime: currentTime });
    }
  };

  useEffect(() => {
    if (linkDateTime) {
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
        `https://script.google.com/macros/s/AKfycbwp5orEoK-YK-iBdeBFoE7KalnVtl99dn-amQtc2durFc2umCPHhuN1RIZtHjy7tLFsLw/exec?function=doOtherUserGet&employeeId=${user.employeeId}`
      );
      const text = await response.text();

      try {
        const result = JSON.parse(text);
        // console.log("Result:", result);

        if (
          result.success === false ||
          !Array.isArray(result.tasks) ||
          result.length === 0
        ) {
          message.warning("No data found.");
          setTableData([]);
          return;
        }

        setTableData(result.tasks);
        // console.log("Result:", result);
        if (isManualRefresh.current) {
          message.success("Table data updated successfully.");
          isManualRefresh.current = false; // Reset after showing message
        }
      } catch {
        throw new Error("Invalid JSON response.");
      }
    } catch (error) {
      message.error("Failed to fetch data.");
      setTableData([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(tableData);
  }, []);

  const handleManualRefresh = () => {
    isManualRefresh.current = true;
    setSelectedStatus(null); // Reset selection so all cards are visible
    setSearchText("");
    setStartDateFilter(null);
    setEndDateFilter(null);
    fetchData();
    setTableKey((prev) => prev + 1);
    console.log(tableData);

  };
  const handleSubmit = async (values) => {
    setLoading(true);
    const formattedDateTime = linkDateTime
      ? linkDateTime.utcOffset(330).format("YYYY-MM-DD HH:mm:ss")
      : "";

    const {
      workType,
      clientName,
      link,
      details,
      socialMediaType,
      startDateTime,
      endDateTime,
      status,
      assigned,
      notes,
    } = values;

    if (!clientName) {
      message.error("Client Name is required.");
      setLoading(false);
      return;
    }
    if (!assigned) {
      message.error("Assigner's Name is required.");
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
    formData.append("assigned", assigned);
    formData.append("notes", notes ? notes : "");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwp5orEoK-YK-iBdeBFoE7KalnVtl99dn-amQtc2durFc2umCPHhuN1RIZtHjy7tLFsLw/exec",
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

  const handleUpdate = async (values) => {
    setIsUpdateLoading(true);
    const formattedDateTime = linkDateTime
      ? linkDateTime.utcOffset(330).format("YYYY-MM-DD HH:mm:ss")
      : "";

    const rowIndex = editingTask?.rowIndex;
    // console.log(rowIndex);
    if (!rowIndex) {
      message.error("Missing row index for update.");
      setIsUpdateLoading(false);
      return;
    }

    const {
      workType,
      clientName,
      link,
      details,
      socialMediaType,
      startDateTime,
      endDateTime,
      status,
      assigned,
      notes,
    } = values;
    // console.log("Values:", values);
    const formData = new URLSearchParams();
    formData.append("action", "st006UpdateTask");
    formData.append("rowIndex", rowIndex); // 🔑 critical value
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
    formData.append("assigned", assigned);
    formData.append("notes", notes ? notes : "");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwp5orEoK-YK-iBdeBFoE7KalnVtl99dn-amQtc2durFc2umCPHhuN1RIZtHjy7tLFsLw/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const result = await response.json();
      if (result.success) {
        message.success("Task Updated Successfully!");
        setIsModalVisible(false);
        editForm.resetFields();
        setEditingTask(null);
        fetchData(); // refresh table
      } else {
        message.error(`Update failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      message.error("An error occurred during update.");
    } finally {
      setIsUpdateLoading(false);
    }
  };
  const formattedData = tableData.map((item, index) => ({
    key: index,
    rowIndex: item.rowIndex,
    workType: item["Work Type"]?.trim(),
    clientName: item["Client Name"]?.trim(),
    startDateTime: item["Start Date & Time"]
      ? dayjs(item["Start Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
      : "-",
    endDateTime: item["End Date & Time"]
      ? dayjs(item["End Date & Time"]).format("YYYY-MM-DD HH:mm:ss")
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
  }));

  const employeeId = user?.employeeId;

  const statusMapping = {
    total: null,
    completed: "Completed",
    pending: "Pending",
    notStarted: "Not Started",
    workinprogress: "Work in Progress",
    underReview: "Under Review",
    hold: "Hold",
  };
  const handleCardClick = (key) => {
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

  // const filteredData = formattedData.filter((item) => {

  //   if (isSearchActive) {
  //     return Object.values(item).some((value) => {
  //       if (!value) return false;

  //       const normalizedValue = value
  //         .toString()
  //         .toLowerCase()
  //         .replace(/\s+/g, ""); // Remove spaces
  //       const normalizedSearch = searchText.toLowerCase().replace(/\s+/g, ""); // Remove spaces

  //       return normalizedValue.includes(normalizedSearch);
  //     });
  //   } else {
  //     return (
  //       !selectedStatus ||
  //       item.status?.toLowerCase() === selectedStatus.toLowerCase()
  //     );
  //   }
  // });

  const filteredData = formattedData.filter((item) => {
    let match = true;

    // Search logic when search is active
    if (isSearchActive) {
      match = Object.values(item).some((value) => {
        if (!value) return false;

        const normalizedValue = value
          .toString()
          .toLowerCase()
          .replace(/\s+/g, ""); // Remove spaces
        const normalizedSearch = searchText.toLowerCase().replace(/\s+/g, ""); // Remove spaces

        return normalizedValue.includes(normalizedSearch);
      });
    } else {
      // If search is not active, check the selected status
      match =
        !selectedStatus ||
        item.status?.toLowerCase() === selectedStatus.toLowerCase();
    }

    if (match && (startDateFilter || endDateFilter)) {
      const taskStart = item.startDateTime !== "-" ? dayjs(item.startDateTime) : null;
      const linkPosted = item.linkPostedDateTime !== "-" ? dayjs(item.linkPostedDateTime) : null;
  
      const isStartInRange =
        taskStart &&
        (!startDateFilter || !taskStart.isBefore(startDateFilter, "day")) &&
        (!endDateFilter || !taskStart.isAfter(endDateFilter, "day"));
  
      const isLinkPostedInRange =
        linkPosted &&
        (!startDateFilter || !linkPosted.isBefore(startDateFilter, "day")) &&
        (!endDateFilter || !linkPosted.isAfter(endDateFilter, "day"));
  
      // Only match if either the start date or the link posted date is in range
      match = isStartInRange || isLinkPostedInRange;
    }
  

    return match;
  });

  const sortedData = [...filteredData]
    .sort((a, b) => {
      const getValidDate = (item) => {
        const linkDate = item.linkPostedDateTime;
        const startDate = item.startDateTime;
        

        // Use linkPostedDateTime if valid, else fallback to startDateTime
        const dateToUse = linkDate && linkDate !== "-" ? linkDate : startDate;

        return new Date(dateToUse);
      };

      return getValidDate(b) - getValidDate(a); // latest first
    })
    .map((item, idx) => ({
      ...item,
      displayIndex: idx,
    }));
  // console.log("Sorted Data", sortedData);

  const columns = [
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
      sorter: (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime),
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
      render: (text) => {
        if (!text || text === "N/A") return <Tooltip title="N/A">N/A</Tooltip>;

        const truncatedText =
          text.length > 50 ? `${text.substring(0, 50)}...` : text;
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
      title: "Notes/Remarks",
      dataIndex: "notes",
      key: "notes",
      width: 250,
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
      title: "Action",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (<>
        <Button
          color="primary"
          variant="filled"
          onClick={() => handleEdit(record, record.rowIndex)}
        >
          <EditOutlined />
          Edit
        </Button>

          <Button
                color="purple"
                variant="filled"
                onClick={() => handleView(record, record.rowIndex)}
                className="ms-1"
              >
                <EyeOutlined />
                View
              </Button>
              </>
      ),
    },
  ];
  // const handleEdit = (record, index) => {
  //   setEditingTask({ ...record, rowIndex: index });
  //   console.log("Record:", record);
  //   console.log("Index:", index);

  //   setIsModalVisible(true);

  //   editForm.setFieldsValue({
  //     ...record,
  //     startDateTime: dayjs(record.startDateTime),
  //     endDateTime: dayjs(record.endDateTime),
  //     dateTime: record.linkPostedDateTime,
  //   });
  // };

  const handleEdit = (record, index) => {
    // console.log(record)
    setEditingTask({ ...record, rowIndex: index });
    // console.log("Record:", record);
    // console.log("Index:", index);
    setIsModalVisible(true);
    editForm.setFieldsValue({
      ...record,
      startDateTime:
        record.startDateTime && record.startDateTime !== "-"
          ? dayjs(record.startDateTime)
          : null,
      endDateTime:
        record.endDateTime && record.endDateTime !== "-"
          ? dayjs(record.endDateTime)
          : null,
      dateTime:
        record.linkPostedDateTime && record.linkPostedDateTime !== "-"
          ? dayjs(record.linkPostedDateTime)
          : null,
    });
    setWorkType(record.workType); // <-- IMPORTANT
    setLinkDateTime(record.dateTime || null); // if you're using it
    setStartDateTime(record.startDateTime || null);
    setEndDateTime(record.endDateTime || null);

    setIsModalVisible(true);
  };

  const handleView = (record, index) => {
    // console.log("Viewing task:", record);
  
    // Prepare values
    const startDate = record.startDateTime && record.startDateTime !== "-" ? dayjs(record.startDateTime) : null;
    const endDate = record.endDateTime && record.endDateTime !== "-" ? dayjs(record.endDateTime) : null;
    const linkPostedDateTime = record.linkPostedDateTime && record.linkPostedDateTime !== "-" ? dayjs(record.linkPostedDateTime) : null;

    // console.log(dateTime);
  
    // Set full record + index
    setViewingTask({ ...record, rowIndex: index });
  
    // Fill view form
    viewForm.setFieldsValue({
      ...record,
      startDateTime: startDate,
      endDateTime: endDate,
      dateTime: linkPostedDateTime,
    });
    
    // Optional state setters (if you're using them in the modal)
    setWorkType(record.workType || null);
    setLinkDateTime(dateTime || null);
    setStartDateTime(startDate);
    setEndDateTime(endDate);
    // console.log(linkDateTime);
    // Show modal
    setIsViewModalVisible(true);
  };
  

  const getTaskStats = () => {
    if (!tableData || tableData.length === 0) {
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

    const total = tableData.length;
    const statuses = [
      "Completed",
      "Pending",
      "Work in Progress",
      "Under Review",
      "Hold",
      "Not Started",
    ];
    const stats = {};

    statuses.forEach((status) => {
      stats[status] = tableData.filter(
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

  const chartData = [
    { name: "Completed", value: taskStats.completed },
    { name: "Pending", value: taskStats.pending },
    { name: "Not Started", value: taskStats.notStarted },
    { name: "Work in Progress", value: taskStats.workinprogress },
    { name: "Under Review", value: taskStats.underReview },
    { name: "Hold", value: taskStats.hold },
  ];

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
            horizontal: "center",
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

    worksheet["!cols"] = maxWidths.map((w) => ({ wch: w + 7 })); // +5 for padding

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${employeeId}-${username}`
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    const today = new Date().toISOString().split("T")[0];
    saveAs(data, `${employeeId} - ${username} Task Report ${today}.xlsx`);
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
      color: white;
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
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  transition: all 0.3s ease;
  margin-top: 20px;
}
.logout-header {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #fffcfd;
  transition: color 0.2s ease-in-out;

}
  .close-button:hover {
  color: orange; 
}
.welcome-text {
  font-size: 12px;
  opacity: 0.9;
}


.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  padding-left: 12px;
  padding-top: 5px;
  padding-right: 12px;
}



.logout-action {
  display: flex;
  justify-content: center;
  color: red;
  cursor: pointer;
  margin: 10px 15px 5px;
  padding: 6px;
  border: 2px solid red;
  border-radius: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}

.logout-action:hover {
  background-color: red;
  color: white;
}
  .header-content {
  display: flex;
  align-items: center;
}

.text-group {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.welcome-text {
  font-size: 12px;
  opacity: 0.9;
  color: white;
}

.user-name {
  font-weight: bold;
  font-size: 15px;
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
      box-shadow: 0 12px 24px rgba(0,0,0,30%);
      border: 1px solid #f0f0f09e;

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
     .ant-modal .ant-modal-title {
    margin: 0;
    color: rgba(0, 0, 0, 0.88);
    font-weight: bold;
    font-size: 20px;
    line-height: 1.5;
    word-wrap: break-word;
    color: #1B75BC;
    }
    .ant-form-item .ant-form-item-explain-error {
    color: #ff4d4f;
    font-weight: 400;
}
  `;

  const groupedByDate = {};

  // sortedData.forEach((item) => {
  //   const dateStr =
  //     item.status === "Completed" && item.endDateTime
  //       ? dayjs(item.endDateTime).format("YYYY-MM-DD")
  //       : item.linkPostedDateTime !== "-"
  //       ? dayjs(item.linkPostedDateTime).format("YYYY-MM-DD")
  //       : item.startDateTime !== "-"
  //       ? dayjs(item.startDateTime).format("YYYY-MM-DD")
  //       : null;

  //   if (!dateStr) return;

  //   if (!groupedByDate[dateStr]) {
  //     groupedByDate[dateStr] = {
  //       date: dateStr,
  //       Completed: 0,
  //       Pending: 0,
  //       "Not Started": 0,
  //       "Work in Progress": 0,
  //       "Under Review": 0,
  //       Hold: 0,
  //     };
  //   }

  //   const status = item.status;
  //   if (groupedByDate[dateStr][status] !== undefined) {
  //     groupedByDate[dateStr][status]++;
  //   }
  // });

  sortedData.forEach((item) => {
    const start =
      item.startDateTime && item.startDateTime !== "-"
        ? dayjs(item.startDateTime)
        : null;
    const end =
      item.endDateTime && item.endDateTime !== "-"
        ? dayjs(item.endDateTime)
        : start;

    if (!start || !end) return;

    const status = item.status;

    for (
      let date = start.clone();
      date.isSameOrBefore(end, "day");
      date = date.add(1, "day")
    ) {
      const dateStr = date.format("YYYY-MM-DD");

      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = {
          date: dateStr,
          Completed: 0,
          Pending: 0,
          "Not Started": 0,
          "Work in Progress": 0,
          "Under Review": 0,
          Hold: 0,
        };
      }

      if (groupedByDate[dateStr][status] !== undefined) {
        groupedByDate[dateStr][status]++;
      }
    }
  });

  const dateWiseChartData = Object.values(groupedByDate).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const filteredChartData =
    Array.isArray(dateRange) && dateRange[0] && dateRange[1]
      ? dateWiseChartData.filter((item) => {
          const date = dayjs(item.endDateTime || item.date); // fallback if needed
          return (
            date.isSameOrAfter(dateRange[0], "day") &&
            date.isSameOrBefore(dateRange[1], "day")
          );
        })
      : dateWiseChartData;

  const hasChartData = filteredChartData.some(
    (item) =>
      item.Completed > 0 ||
      item.Pending > 0 ||
      item["Not Started"] > 0 ||
      item["Work in Progress"] > 0 ||
      item["Under Review"] > 0 ||
      item.Hold > 0
  );

  const handleDateRangeChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange(null); // Clear the filter if cancel is clicked
    } else {
      setDateRange(dates);
    }
  };

  return (
    <div className="container-fluid p-0">
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
              <h2 className="m-0 gradient-text  fw-bold">
                {`${username}'s Task Report Tracker`}
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

              {/* {showLogout && (
                <div
                  className="logout-popup"
                  onMouseLeave={() => setShowLogout(false)}
                  style={{ border: "1px solid lightblue" }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      marginBottom: "3px",
                      color: "black",
                    }}
                    className="text-center "
                  >
                    <div>
                      <UserOutlined
                        className="gradient-background text-white "
                        style={{
                          border: "1px solid white",
                          borderRadius: "40px",
                          padding: "9px",
                          fontSize: "20px",
                        }}
                      />
                    </div>

                    <div className="gradient-text mt-1">
                      Hello, <br />
                      {username}!<br />{employeeId} <br />{employeeDesignation}<br />{employeeMail}
                    </div>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #f0f0f0",
                      width: "190px",
                    }}
                    className="mt-1"
                  ></div>
                  <div
                    className="logout-action mt-2 "
                    onClick={handleLogout}
                    style={{ fontSize: "16px" }}
                  >
                    <LogoutOutlined style={{ marginRight: "6px" }} />
                    <span>Logout</span>
                  </div>
                </div>
              )} */}
              {showLogout && (
                <div
                  className="logout-popup"
                  // onMouseLeave={() => setShowLogout(false)}
                >
                  <div className="logout-header">
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="close-button"
                      onClick={() => setShowLogout(false)}
                    />

                    <div className="header-content">
                      <UserOutlined
                        style={{
                          fontSize: "20px",
                          border: "2px solid",
                          borderRadius: "60%",
                          padding: "10px",
                        }}
                      />
                      <div className="text-group">
                        <div className="welcome-text">Welcome back</div>
                        <div className="user-name">{username}</div>
                      </div>
                    </div>
                  </div>

                  <div className="info-row mt-2">
                    <FontAwesomeIcon icon={faIdBadge} size="xl" />
                    <span className="ms-2">{employeeId}</span>
                  </div>
                  <div className="info-row">
                    <FontAwesomeIcon icon={faSuitcase} size="xl" />{" "}
                    <span className="ms-2">{employeeDesignation}</span>
                  </div>
                  <div className="info-row">
                    <FontAwesomeIcon icon={faEnvelope} size="xl" />
                    <span className="ms-2">{employeeMail}</span>
                  </div>

                  <div className="logout-action mt-3 mb-2" onClick={handleLogout}>
                    <LogoutOutlined style={{ marginRight: "6px" }} />
                    <span>Logout</span>
                  </div>
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
                    <FileAddOutlined
                      style={{ fontSize: "24px", marginRight: "10px" }}
                    />
                    <span className="gradient-text">New Task Report</span>
                  </div>
                }
                className="card-shadow"
                headStyle={{ borderBottom: "2px solid #f0f0f0" }}
              >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <TeamOutlined /> Client Name
                          </span>
                        }
                        name="clientName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter client name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter client name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Work Type
                          </span>
                        }
                        name="workType"
                        rules={[
                          {
                            required: true,
                            message: "Please select your work type",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select work type"
                          onChange={handleWorkTypeChange}
                          size="large"
                        >
                          <Select.Option value="Social Media">
                            Social Media
                          </Select.Option>
                          <Select.Option value="Other">Other</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    {workType === "Social Media" ? (
                      <>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <FormOutlined /> Social Media Type
                              </span>
                            }
                            name="socialMediaType"
                            rules={[
                              {
                                required: true,
                                message: "Please select social media type",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select social media type"
                              size="large"
                            >
                              <Select.Option value="Facebook">
                                <FacebookOutlined /> Facebook
                              </Select.Option>
                              <Select.Option value="Instagram">
                                <InstagramOutlined /> Instagram
                              </Select.Option>
                              <Select.Option value="LinkedIn">
                                <LinkedinOutlined /> LinkedIn
                              </Select.Option>
                              <Select.Option value="X">
                                <XOutlined /> X
                              </Select.Option>
                              <Select.Option value="YouTube">
                                <YoutubeOutlined /> YouTube
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <LinkOutlined /> Link
                              </span>
                            }
                            name="link"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the link",
                              },
                            ]}
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
                          <Form.Item
                            label={
                              <span>
                                <CalendarOutlined /> Date & Time
                              </span>
                            }
                            name="dateTime"
                          >
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
                            label={
                              <span>
                                <CalendarOutlined /> Start Date & Time
                              </span>
                            }
                            name="startDateTime"
                            rules={[
                              {
                                required: true,
                                message: "Please select start date & time",
                              },
                            ]}
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
                            label={
                              <span>
                                <CalendarOutlined /> End Date & Time
                              </span>
                            }
                            name="endDateTime"
                            dependencies={["startDateTime"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select end date & time",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    value.isAfter(
                                      getFieldValue("startDateTime")
                                    )
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "End date & time must be after start date & time"
                                    )
                                  );
                                },
                              }),
                            ]}
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
                        label={
                          <span>
                            <InfoCircleOutlined /> Details
                          </span>
                        }
                        name="details"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the details",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the task details"
                          rows={3}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Notes/Remarks
                          </span>
                        }
                        name="notes"
                        rules={[
                          {
                            required: false,
                            message: "Please enter the Notes/Remarks",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the notes/remarks"
                          rows={3}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    {/* <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <ClockCircleOutlined /> Status
                          </span>
                        }
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Please select status of work",
                          },
                        ]}
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="Not Started">
                            <ClockCircleOutlined style={{ color: "red" }} /> Not
                            Started
                          </Select.Option>
                          <Select.Option value="Work in Progress">
                            <ClockCircleOutlined style={{ color: "blue" }} />{" "}
                            Work in Progress
                          </Select.Option>
                          <Select.Option value="Under Review">
                            <InfoCircleOutlined style={{ color: "purple" }} />{" "}
                            Under Review
                          </Select.Option>
                          <Select.Option value="Pending">
                            <ClockCircleOutlined style={{ color: "orange" }} />{" "}
                            Pending
                          </Select.Option>
                          <Select.Option value="Hold">
                            <ClockCircleOutlined style={{ color: "gray" }} />{" "}
                            Hold
                          </Select.Option>
                          <Select.Option value="Completed">
                            <CheckCircleOutlined style={{ color: "green" }} />{" "}
                            Completed
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col> */}

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Assigned by
                          </span>
                        }
                        name="assigned"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter the name of the task assigner",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter the name of the task assigner"
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <ClockCircleOutlined /> Status
                          </span>
                        }
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Please select status of work",
                          },
                        ]}
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="Not Started">
                            <ClockCircleOutlined style={{ color: "red" }} /> Not
                            Started
                          </Select.Option>
                          <Select.Option value="Work in Progress">
                            <ClockCircleOutlined style={{ color: "blue" }} />{" "}
                            Work in Progress
                          </Select.Option>
                          <Select.Option value="Under Review">
                            <InfoCircleOutlined style={{ color: "purple" }} />{" "}
                            Under Review
                          </Select.Option>
                          <Select.Option value="Pending">
                            <ClockCircleOutlined style={{ color: "orange" }} />{" "}
                            Pending
                          </Select.Option>
                          <Select.Option value="Hold">
                            <ClockCircleOutlined style={{ color: "gray" }} />{" "}
                            Hold
                          </Select.Option>
                          <Select.Option value="Completed">
                            <CheckCircleOutlined style={{ color: "green" }} />{" "}
                            Completed
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    {/* <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Notes/Remarks
                          </span>
                        }
                        name="notes"
                        rules={[
                          {
                            required: false,
                            message: "Please enter the Notes/Remarks",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the notes/remarks"
                          rows={2}
                          size="large"
                        />
                      </Form.Item>
                    </Col> */}

                    <Col xs={24} className="text-center mt-3">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="gradient-btn px-5 py-2"
                        style={{ fontSize: "16px", height: "auto" }}
                        size="large"
                      >
                        {loading ? "Submitting..." : "Submit Task"}
                      </Button>
                      <Button
                        color="danger"
                        variant="solid"
                        className=" px-5 py-2 ms-2"
                        size="large"
                        onClick={() => {
                          form.resetFields();
                          message.success("Form data cleared successfully");
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>

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
                      {taskStats[key]}
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

            <Col xs={24}>
              <Card
                title={
                  <div className="d-flex align-items-center justify-content-center flex-wrap">
                    {/* Icon and Title */}
                    <div className="d-flex align-items-center">
                      <TableOutlined
                        style={{ fontSize: "24px", marginRight: "10px" }}
                      />
                      <span className="gradient-text">
                        {employeeId} - {username}'s Task Report
                      </span>
                    </div>

                    {/* Centered Search Bar */}
                    <div className="flex-grow-1 d-flex justify-content-center">
                      
                      <div>
                        <DatePicker
                          placeholder="Start Date"
                          value={startDateFilter}
                          onChange={(date) => {
                            setStartDateFilter(date);
                            setSearchText("");
                            setIsSearchActive(false);
                            setSelectedStatus(null);
                            if (
                              endDateFilter &&
                              date &&
                              date.isAfter(endDateFilter, "day") // Compare with day precision
                            ) {
                              message.error(
                                "Start date cannot be after end date."
                              );
                            }
                          }}
                          // disabled={isSearchActive || selectedStatus !== null}
                          className="ms-2"
                        />

                        <DatePicker
                          placeholder="End Date"
                          value={endDateFilter}
                          onChange={(date) => {
                            setEndDateFilter(date);
                            setSearchText("");
                            setIsSearchActive(false);
                            setSelectedStatus(null);
                            if (
                              startDateFilter &&
                              date &&
                              date.isBefore(startDateFilter, "day") // Compare with day precision
                            ) {
                              message.error(
                                "End date cannot be before start date."
                              );
                            }
                          }}
                          style={{ marginRight: 16 }}
                          // disabled={isSearchActive || selectedStatus !== null}
                          className="ms-2"
                        />
                      </div>
                      <Input
                        placeholder="Search Tasks..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchText}
                        // onChange={(e) => setSearchText(e.target.value)}
                        onChange={handleSearchChange}
                        disabled={selectedStatus !== null}
                        style={{ width: 400 }}
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
                  disabled={filteredData.length === 0}
                  className="gradient-btn d-flex align-items-end"
                >
                  Export to excel
                </Button>
                <Table
                  key={tableKey}
                  // dataSource={filteredData}
                  dataSource={sortedData}
                  columns={columns}
                  rowKey="key"
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

            <Col xs={24}>
              <Card
                title={
                  <div className="d-flex align-items-center justify-content-center flex-wrap ">
                    {/* Icon and Title */}
                    <div className="d-flex align-items-center">
                      <BarChartOutlined
                        style={{ fontSize: "24px", marginRight: "10px" }}
                      />
                      <span className="gradient-text">
                        {employeeId} - {username}'s Task Status Chart
                      </span>
                    </div>

                    {/* Centered Search Bar */}
                    <div className="flex-grow-1 d-flex justify-content-center">
                      <>
                        {/* <DatePicker.RangePicker
                          format="YYYY-MM-DD"
                          onChange={(dates) => setDateRange(dates)}
                          allowClear
                          className="me-lg-5"
                        /> */}
                      </>
                    </div>

                    <Button
                      type="primary"
                      className="gradient-btn d-flex align-items-center"
                      onClick={() => setShowChart(!showChart)}
                    >
                      {showChart ? "Hide Chart" : "View Chart"}
                    </Button>
                  </div>
                }
                bordered={false}
                style={{
                  width: "100%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Space
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {/* {hasChartData && (
                  <>
                    <Button onClick={() => setShowChart(!showChart)}>
                      {showChart ? "Hide Chart" : "View Chart"}
                    </Button>

                    <DatePicker.RangePicker
                      format="YYYY-MM-DD"
                      onChange={(dates) => setDateRange(dates)}
                      allowClear
                    />
                  </>
                )} */}
                </Space>

                {showChart && hasChartData && (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={
                        Array.isArray(filteredChartData)
                          ? filteredChartData
                          : []
                      }
                      margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="Completed" stackId="a" fill="#33c755" />
                      <Bar dataKey="Pending" stackId="a" fill="#f7971e" />
                      <Bar dataKey="Not Started" stackId="a" fill="#e15260" />
                      <Bar
                        dataKey="Work in Progress"
                        stackId="a"
                        fill="#007bff"
                      />
                      <Bar dataKey="Under Review" stackId="a" fill="#8e44ad" />
                      <Bar dataKey="Hold" stackId="a" fill="#6c757d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {showChart && !hasChartData && (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "2rem",
                      color: "#888",
                    }}
                    className="mb-1"
                  >
                    No data available
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24}>
              <Modal
                title="Edit Task Data"
                className="fw-bold"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1200}
              >
                <Form
                  layout="vertical"
                  form={editForm}
                  onFinish={(values) => handleUpdate(values, user)}
                >
                  <Form.Item name="rowIndex" hidden>
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <TeamOutlined /> Client Name
                          </span>
                        }
                        name="clientName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter client name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter client name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Work Type
                          </span>
                        }
                        name="workType"
                        rules={[
                          {
                            required: true,
                            message: "Please select your work type",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select work type"
                          onChange={handleWorkTypeChange}
                          size="large"
                        >
                          <Select.Option value="Social Media">
                            Social Media
                          </Select.Option>
                          <Select.Option value="Other">Other</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    {workType === "Social Media" ? (
                      <>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <FormOutlined /> Social Media Type
                              </span>
                            }
                            name="socialMediaType"
                            rules={[
                              {
                                required: true,
                                message: "Please select social media type",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select social media type"
                              size="large"
                            >
                              <Select.Option value="Facebook">
                                <FacebookOutlined /> Facebook
                              </Select.Option>
                              <Select.Option value="Instagram">
                                <InstagramOutlined /> Instagram
                              </Select.Option>
                              <Select.Option value="LinkedIn">
                                <LinkedinOutlined /> LinkedIn
                              </Select.Option>
                              <Select.Option value="X">
                                <XOutlined /> X
                              </Select.Option>
                              <Select.Option value="YouTube">
                                <YoutubeOutlined /> YouTube
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <LinkOutlined /> Link
                              </span>
                            }
                            name="link"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the link",
                              },
                            ]}
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
                          <Form.Item
                            label={
                              <span>
                                <CalendarOutlined /> Date & Time
                              </span>
                            }
                            name="dateTime"
                          >
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
                            label={
                              <span>
                                <CalendarOutlined /> Start Date & Time
                              </span>
                            }
                            name="startDateTime"
                            rules={[
                              {
                                required: true,
                                message: "Please select start date & time",
                              },
                            ]}
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
                            label={
                              <span>
                                <CalendarOutlined /> End Date & Time
                              </span>
                            }
                            name="endDateTime"
                            dependencies={["startDateTime"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select end date & time",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    value.isAfter(
                                      getFieldValue("startDateTime")
                                    )
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "End date & time must be after start date & time"
                                    )
                                  );
                                },
                              }),
                            ]}
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
                        label={
                          <span>
                            <InfoCircleOutlined /> Details
                          </span>
                        }
                        name="details"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the details",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the task details"
                          rows={3}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Notes/Remarks
                          </span>
                        }
                        name="notes"
                        rules={[
                          {
                            required: false,
                            message: "Please enter the Notes/Remarks",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the notes/remarks"
                          rows={3}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Assigned by
                          </span>
                        }
                        name="assigned"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter the name of the task assigner",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter the name of the task assigner"
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <ClockCircleOutlined /> Status
                          </span>
                        }
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Please select status of work",
                          },
                        ]}
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="Not Started">
                            <ClockCircleOutlined style={{ color: "red" }} /> Not
                            Started
                          </Select.Option>
                          <Select.Option value="Work in Progress">
                            <ClockCircleOutlined style={{ color: "blue" }} />{" "}
                            Work in Progress
                          </Select.Option>
                          <Select.Option value="Under Review">
                            <InfoCircleOutlined style={{ color: "purple" }} />{" "}
                            Under Review
                          </Select.Option>
                          <Select.Option value="Pending">
                            <ClockCircleOutlined style={{ color: "orange" }} />{" "}
                            Pending
                          </Select.Option>
                          <Select.Option value="Hold">
                            <ClockCircleOutlined style={{ color: "gray" }} />{" "}
                            Hold
                          </Select.Option>
                          <Select.Option value="Completed">
                            <CheckCircleOutlined style={{ color: "green" }} />{" "}
                            Completed
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} className="text-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isUpdateLoading}
                        className="gradient-btn px-5 py-2"
                        size="large"
                      >
                        {isUpdateLoading ? "Updating..." : "Update Task"}
                      </Button>
                      <Button
                        color="danger"
                        variant="solid"
                        size="large"
                        onClick={() => setIsModalVisible(false)}
                        className="ms-2 px-5 py-2"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </Col>

            <Col xs={24}>
              <Modal
                title="View Task Data"
                className="fw-bold"
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
                width={1200}
              >
                <Form
                  layout="vertical"
                  form={viewForm}
                  // onFinish={(values) => handleUpdate(values, user)}
                >
                  <Form.Item name="rowIndex" hidden>
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <TeamOutlined /> Client Name
                          </span>
                        }
                        name="clientName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter client name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter client name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Work Type
                          </span>
                        }
                        name="workType"
                        rules={[
                          {
                            required: true,
                            message: "Please select your work type",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select work type"
                          onChange={handleWorkTypeChange}
                          size="large"
                        >
                          <Select.Option value="Social Media">
                            Social Media
                          </Select.Option>
                          <Select.Option value="Other">Other</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    {workType === "Social Media" ? (
                      <>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <FormOutlined /> Social Media Type
                              </span>
                            }
                            name="socialMediaType"
                            rules={[
                              {
                                required: true,
                                message: "Please select social media type",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select social media type"
                              size="large"
                            >
                              <Select.Option value="Facebook">
                                <FacebookOutlined /> Facebook
                              </Select.Option>
                              <Select.Option value="Instagram">
                                <InstagramOutlined /> Instagram
                              </Select.Option>
                              <Select.Option value="LinkedIn">
                                <LinkedinOutlined /> LinkedIn
                              </Select.Option>
                              <Select.Option value="X">
                                <XOutlined /> X
                              </Select.Option>
                              <Select.Option value="YouTube">
                                <YoutubeOutlined /> YouTube
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <LinkOutlined /> Link
                              </span>
                            }
                            name="link"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the link",
                              },
                            ]}
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
                          <Form.Item
                            label={
                              <span>
                                <CalendarOutlined /> Date & Time
                              </span>
                            }
                            name="dateTime"
                          >
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
                            label={
                              <span>
                                <CalendarOutlined /> Start Date & Time
                              </span>
                            }
                            name="startDateTime"
                            rules={[
                              {
                                required: true,
                                message: "Please select start date & time",
                              },
                            ]}
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
                            label={
                              <span>
                                <CalendarOutlined /> End Date & Time
                              </span>
                            }
                            name="endDateTime"
                            dependencies={["startDateTime"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select end date & time",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    value.isAfter(
                                      getFieldValue("startDateTime")
                                    )
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "End date & time must be after start date & time"
                                    )
                                  );
                                },
                              }),
                            ]}
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
                        label={
                          <span>
                            <InfoCircleOutlined /> Details
                          </span>
                        }
                        name="details"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the details",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the task details"
                          rows={3}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Notes/Remarks
                          </span>
                        }
                        name="notes"
                        rules={[
                          {
                            required: false,
                            message: "Please enter the Notes/Remarks",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter the notes/remarks"
                          rows={3}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Assigned by
                          </span>
                        }
                        name="assigned"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter the name of the task assigner",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter the name of the task assigner"
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <ClockCircleOutlined /> Status
                          </span>
                        }
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Please select status of work",
                          },
                        ]}
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="Not Started">
                            <ClockCircleOutlined style={{ color: "red" }} /> Not
                            Started
                          </Select.Option>
                          <Select.Option value="Work in Progress">
                            <ClockCircleOutlined style={{ color: "blue" }} />{" "}
                            Work in Progress
                          </Select.Option>
                          <Select.Option value="Under Review">
                            <InfoCircleOutlined style={{ color: "purple" }} />{" "}
                            Under Review
                          </Select.Option>
                          <Select.Option value="Pending">
                            <ClockCircleOutlined style={{ color: "orange" }} />{" "}
                            Pending
                          </Select.Option>
                          <Select.Option value="Hold">
                            <ClockCircleOutlined style={{ color: "gray" }} />{" "}
                            Hold
                          </Select.Option>
                          <Select.Option value="Completed">
                            <CheckCircleOutlined style={{ color: "green" }} />{" "}
                            Completed
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                  
                  </Row>
                </Form>
              </Modal>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default MithranTaskTracker;
