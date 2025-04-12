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
  Drawer,
  DatePicker,
  Modal,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";

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
  EditOutlined,
  PauseCircleOutlined,
  IdcardOutlined,
  DownloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  TableOutlined,
  BarChartOutlined,
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
const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Admin = ({ username, setUser, user, designation, mailid }) => {
  const [employeeIds, setEmployeeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [otherEditingTask, setOtherEditingTask] = useState(null);
  const [isOtherModalVisible, setIsOtherModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeAllData, setEmployeeAllData] = useState([]);
  const [showChart, setShowChart] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const isManualRefresh = useRef(false);
  const [showLogout, setShowLogout] = useState(false);
  const [form] = Form.useForm();
  const [Defaultform] = Form.useForm();
  const [ST006form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [otherEditForm] = Form.useForm();
  const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);
  const [loadingEmployeeAllData, setLoadingEmployeeAllData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [dropdownEmployeeId, setDropdownEmployeeId] = useState("");
  const [defaultDropdownEmployeeId, setDefaultDropdownEmployeeId] = useState("");
  const [linkDateTime, setLinkDateTime] = useState(null);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isOtherUpdateLoading, setIsOtherUpdateLoading] = useState(false);
  const [workType, setWorkType] = useState("Other");
  const [dateTime, setDateTime] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [exportAllEmployeeExcel, setExportAllEmployeeExcel] = useState(false);
  const employeeDesignation = user?.designation;
  const employeeMail = user?.mailid;
  const selectedEmployeeName = employeeList.find(
    (emp) => emp.id === selectedEmployee
  )?.name;
  const selectedEmployeeId = employeeList.find(
    (emp) => emp.id === selectedEmployee
  )?.id;
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  useEffect(() => {
    fetchEmployeeIds();
  }, []);

  useEffect(() => {
    fetchEmployeeAllData();
  }, []);

  const fetchEmployeeIds = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzuJR-J2nkUFO3VPcru2TXgYPNvjahxM4AbXzAT9O82YEqudKF3BmcEwSoPR9Mi8bsX9w/exec?mode=dropdown"
      );
      const data = await response.json();
      // console.log("fetchEmployeeIds:", data);

      if (data.success) {
        setEmployeeList(data.data);
      } else {
      }
    } catch (error) {}
  };

  const fetchEmployeeData = async (employeeId) => {
    setRefreshing(true);
    // console.log(employeeId);

    try {
      setLoadingEmployeeData(true);
      setSelectedEmployee(employeeId);
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzuJR-J2nkUFO3VPcru2TXgYPNvjahxM4AbXzAT9O82YEqudKF3BmcEwSoPR9Mi8bsX9w/exec?employeeId=${employeeId}`
      );
      const data = await response.json();
      // console.log("fetchEmployeeData:", data);
      // console.log("Employee Id", employeeId);
      if (Array.isArray(data.tasks)) {
        setEmployeeData(data.tasks);
        if (isManualRefresh.current) {
          message.success("Table data updated successfully.");
          isManualRefresh.current = false;
        }
      } else if (data.success === false) {
        setEmployeeData([]);
      } else {
        setEmployeeData([]);
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
      setLoadingEmployeeData(false);
    }
  };

  const fetchEmployeeAllData = async () => {
    setRefreshing(true);

    try {
      setLoadingEmployeeAllData(true);
      // setSelectedEmployee(employeeId);
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzuJR-J2nkUFO3VPcru2TXgYPNvjahxM4AbXzAT9O82YEqudKF3BmcEwSoPR9Mi8bsX9w/exec?mode=allTasks`
      );
      const data = await response.json();
      // console.log("fetchEmployeeAllData:", data);
      if (Array.isArray(data)) {
        setEmployeeAllData(data);
        if (isManualRefresh.current) {
          message.success("Table data updated successfully.");
          isManualRefresh.current = false;
        }
      } else if (data.success === false) {
        setEmployeeAllData([]);
      } else {
        setEmployeeAllData([]);
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
      setLoadingEmployeeAllData(false);
    }
  };
  // const getInitials = (name) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .slice(0, 2)
  //     .toUpperCase();
  // };

  const ExportExcelAllUser = async () => {
    setExportAllEmployeeExcel(true);
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzuJR-J2nkUFO3VPcru2TXgYPNvjahxM4AbXzAT9O82YEqudKF3BmcEwSoPR9Mi8bsX9w/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "exportToExcel",
          }).toString(),
        }
      );

      const result = await response.json();
      if (result.success) {
        window.open(result.downloadUrl, "_blank");
      } else {
        message.error(result.error || "Export failed");
      }
    } catch (err) {
      message.error("Something went wrong");
    }
    finally{
      setExportAllEmployeeExcel(false);
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";

    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase(); // First 2 letters of one word
    }

    return (words[0][0] + words[1][0]).toUpperCase(); // First letter of first two words
  };

  const calculateCompletedPercentage = (tasks = []) => {
    const completed = tasks.filter((t) => t.Status === "Completed").length;
    const total = tasks.length;
    const percentage = total ? ((completed / total) * 100).toFixed(1) : 0.0;
    return { completed, total, percentage };
  };

  const calculatePendingPercentage = (tasks = []) => {
    const pending = tasks.filter((t) => t.Status === "Pending").length;
    const total = tasks.length;
    const percentage = total ? ((pending / total) * 100).toFixed(1) : 0.0;
    return { pending, total, percentage };
  };

  const calculateWorkInProgressPercentage = (tasks = []) => {
    const workInProgress = tasks.filter(
      (t) => t.Status === "Work in Progress"
    ).length;
    const total = tasks.length;
    const percentage = total
      ? ((workInProgress / total) * 100).toFixed(1)
      : 0.0;
    return { workInProgress, total, percentage };
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
  const employeeId = user.employeeId;
  // console.log("Employee Id:", employeeId);

  const handleCardClick = (key) => {
    // setSelectedStatus(statusMapping[key]);
    if (key === "assignTask") {
      setIsDrawerVisible(true);
      return;
    }

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
      setSelectedStatus(null);
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  };

  const formattedData = employeeData.map((item, index) => {
    if (selectedEmployee === "ST006") {
      return {
        key: index,
        rowIndex: item.rowIndex,
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
        rowIndex: item.rowIndex,
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
          .replace(/\s+/g, "");
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

  const sortedData = [...filteredData]
    .sort((a, b) => {
      const getValidDate = (item) => {
        const linkDate = item.linkPostedDateTime;
        const startDate = item.startDateTime;

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
          width: 200,
          sorter: (a, b) =>
            new Date(a.linkPostedDateTime) - new Date(b.linkPostedDateTime),

          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Total Link Count",
          dataIndex: "totalLinkCount",
          key: "totalLinkCount",
          width: 150,
          render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
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
        //   {
        //     title: "Actions",
        //     key: "action",
        //     width: 120,
        //     fixed: "right",
        //     render: (_, record) => (
        //       <>
        //       <Button
        //         color="primary"
        //         variant="filled"
        //         onClick={() => handleEdit(record, record.rowIndex)}
        //       >
        //         <EditOutlined />

        //       </Button>
        //       <Button  color="danger"
        //         variant="filled"
        //         className="ms-1"
        //   danger
        //   onClick={() => handleDelete(record.rowIndex)}
        // >
        //  <DeleteOutlined />
        // </Button>
        //       </>
        //     ),
        //   },
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
          width: 200,
          // render: (text) => <Tooltip title={text}>{text}</Tooltip>,
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
        // {
        //   title: "Action",
        //   key: "action",
        //   width: 100,
        //   fixed: "right",
        //   render: (_, record) => (
        //     <Button
        //       color="primary"
        //       variant="filled"
        //       onClick={() => handleOtherEdit(record, record.rowIndex)}
        //     >
        //       <EditOutlined />
        //       Edit
        //     </Button>
        //   ),
        // },
      ];
    }
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

  // const handleUpdate = async (values) => {
  //   setIsUpdateLoading(true);
  //   const formattedDateTime = linkDateTime
  //     ? linkDateTime.utcOffset(330).format("YYYY-MM-DD HH:mm:ss")
  //     : "";

  //   const rowIndex = editingTask?.rowIndex;
  //   console.log(rowIndex);
  //   if (!rowIndex) {
  //     message.error("Missing row index for update.");
  //     setIsUpdateLoading(false);
  //     return;
  //   }

  //   const {
  //     workType,
  //     clientName,
  //     link,
  //     details,
  //     socialMediaType,
  //     startDateTime,
  //     endDateTime,
  //     status,
  //     assigned,
  //     notes,
  //   } = values;
  //   console.log("Values:", values);
  //   const formData = new URLSearchParams();
  //   formData.append("action", "st006UpdateTask");

  //   formData.append("rowIndex", rowIndex);
  //   formData.append("workType", workType);
  //   formData.append("clientName", clientName);
  //   formData.append("link", workType === "Social Media" ? link : "");
  //   formData.append("details", details || "N/A");
  //   formData.append("dateTime", formattedDateTime || "N/A");

  //   if (workType === "Social Media") {
  //     formData.append("socialMediaType", socialMediaType);
  //     formData.append("startDateTime", "");
  //     formData.append("endDateTime", "");
  //   } else {
  //     formData.append("socialMediaType", "");
  //     formData.append(
  //       "startDateTime",
  //       startDateTime ? startDateTime.toISOString() : ""
  //     );
  //     formData.append(
  //       "endDateTime",
  //       endDateTime ? endDateTime.toISOString() : ""
  //     );
  //   }
  //   formData.append("status", status);
  //   formData.append("assigned", assigned);
  //   formData.append("notes", notes ? notes : "");

  //   try {
  //     const response = await fetch(
  //       "https://script.google.com/macros/s/AKfycbxe37f6n4P_tV5Bot3v4y18w9WYjMbsB7-OpmA436gErCxxUVLSF5XBf-wmzK5EGkSchA/exec",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: formData.toString(),
  //       }
  //     );

  //     const result = await response.json();
  //     if (result.success) {
  //       message.success("Task Updated Successfully!");
  //       setIsModalVisible(false);
  //       editForm.resetFields();
  //       setEditingTask(null);
  //       fetchEmployeeData(selectedEmployee);
  //     } else {
  //       message.error(`Update failed: ${result.error || "Unknown error"}`);
  //     }
  //   } catch (error) {
  //     message.error("An error occurred during update.");
  //   } finally {
  //     setIsUpdateLoading(false);
  //   }
  // };

  //  const handleOtherUpdate = async (values) => {
  //     setIsOtherUpdateLoading(true);

  //     const rowIndex = otherEditingTask?.rowIndex;
  //     console.log(rowIndex);
  //     if (!rowIndex) {
  //       message.error("Missing row index for update.");
  //       setIsOtherUpdateLoading(false);
  //       return;
  //     }

  //     const {
  //       clientName,
  //       link,
  //       details,
  //       startDateTime,
  //       endDateTime,
  //       status,
  //       assigned,
  //       notes,
  //     } = values;
  //     console.log("Values:", values);
  //     const formData = new URLSearchParams();
  //     formData.append("action", "updateTask");
  //     formData.append("employeeId", selectedEmployeeId);
  //     formData.append("rowIndex", rowIndex); // 🔑 critical value
  //     formData.append("clientName", clientName);
  //     formData.append("link", link || "");
  //     formData.append("details", details || "");
  //     formData.append("startDateTime", startDateTime.toISOString());
  //     formData.append("endDateTime", endDateTime.toISOString());
  //     formData.append("status", status);
  //     formData.append("assigned", assigned);
  //     formData.append("notes", notes || "");

  //     try {
  //       const response = await fetch(
  //         "https://script.google.com/macros/s/AKfycbxe37f6n4P_tV5Bot3v4y18w9WYjMbsB7-OpmA436gErCxxUVLSF5XBf-wmzK5EGkSchA/exec",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //           body: formData.toString(),
  //         }
  //       );

  //       const result = await response.json();
  //       if (result.success) {
  //         message.success("Task Updated Successfully!");
  //         setIsOtherModalVisible(false);
  //         otherEditForm.resetFields();
  //         setOtherEditingTask(null);
  //         fetchEmployeeData(selectedEmployee);
  //       } else {
  //         message.error(`Update failed: ${result.error || "Unknown error"}`);
  //       }
  //     } catch (error) {
  //       message.error("An error occurred during update.");
  //     } finally {
  //       setIsOtherUpdateLoading(false);
  //     }
  //   };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Usage example
  const columns = getColumns(selectedEmployee);

  const groupedByDate = {};

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
      color: white;
    }
       .gradient-btn:disabled:hover {
      background: #e0e0e0;     
      opacity: 0.95;
      color: #999999;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .gradient-text {
      background: linear-gradient(to right, #5c258d, #4389a2) !important;
      -webkit-background-clip: text !important;
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
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background: rgba(255, 255, 255); /* transparent white */
      padding: 5px;
      margin-top: 10px;
      margin-left: 100px !important;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid #f7f5f5;
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
    .ant-drawer .ant-drawer-title {
    flex: 1;
    margin: 0;
    font-weight: bold;
    font-size: 24px;
    line-height: 1.5;
    background: linear-gradient(to right, #5c258d, #4389a2);
      -webkit-background-clip: text;
      color: transparent;
    }
     .ant-drawer .ant-drawer-close {
    display: inline-flex
;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    margin-inline-end: 8px;
    color: #dc3545;
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 1;
    text-align: center;
    text-transform: none;
    text-decoration: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    transition: all 0.2s;
    text-rendering: auto;
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

  const chartData = [
    { name: "Completed", value: taskStats.completed },
    { name: "Pending", value: taskStats.pending },
    { name: "Not Started", value: taskStats.notStarted },
    { name: "Work in Progress", value: taskStats.workinprogress },
    { name: "Under Review", value: taskStats.underReview },
    { name: "Hold", value: taskStats.hold },
  ];

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
  const handleSubmit = async (values, user) => {
    setLoading(true);

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
    formData.append("details", details || "N/A");
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
        "https://script.google.com/macros/s/AKfycbzuJR-J2nkUFO3VPcru2TXgYPNvjahxM4AbXzAT9O82YEqudKF3BmcEwSoPR9Mi8bsX9w/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const result = await response.json();
      if (result.success) {
        message.success("Task Assigned Successfully!");
        ST006form.resetFields();
        Defaultform.resetFields();
        setStartDateTime(null);
        setEndDateTime(null);
        fetchEmployeeData(selectedEmployee);
      } else {
        message.error(`Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      message.error("An error occurred while saving data.");
    } finally {
      setLoading(false);
    }
  };
  const handleDefaultSubmit = async (values, user) => {
    setLoading(true);
    const {
      clientName,
      link,
      details,
      startDateTime,
      endDateTime,
      status,
      assigned,
      notes,
      empId,
    } = values;

    // console.log("Values:", values);
    if (!clientName) {
      message.error("Client/Task Name is required.");
      setLoading(false);
      return;
    }
    if (!assigned) {
      message.error("Assigner's Name is required.");
      setLoading(false);
      return;
    }
    if (!startDateTime || !endDateTime) {
      message.error("Please select start and end date/time.");
      setLoading(false);
      return;
    }
    if (!empId) {
      message.error("Please select an employee.");
      setLoading(false);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("action", "otherUserSubmit");
    formData.append("employeeId", empId);
    formData.append("clientName", clientName);
    formData.append("link", link || "");
    formData.append("details", details || "N/A");
    formData.append("startDateTime", startDateTime.toISOString());
    formData.append("endDateTime", endDateTime.toISOString());
    formData.append("status", status);
    formData.append("assigned", assigned);
    formData.append("notes", notes || "");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzuJR-J2nkUFO3VPcru2TXgYPNvjahxM4AbXzAT9O82YEqudKF3BmcEwSoPR9Mi8bsX9w/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const result = await response.json();
      if (result.success) {
        message.success("Task Assigned Successfully!");
        ST006form.resetFields();
        Defaultform.resetFields();
        setStartDateTime(null);
        setEndDateTime(null);
        fetchEmployeeData(selectedEmployee);
      } else {
        message.error(`Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      message.error("An error occurred while assigning the task.");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   const empId = form.getFieldValue("empId");
  //   setDropdownEmployeeId(empId);
  // }, [ST006form.getFieldValue("empId")]);

  // const handleEmployeeChange = (value) => {
  //   form.resetFields();
  //   setDropdownEmployeeId(value);
  //   form.setFieldsValue({ empId: value });
  // };
  useEffect(() => {
    if (dropdownEmployeeId) {
      ST006form.resetFields();
      Defaultform.resetFields();
      ST006form.setFieldsValue({ empId: dropdownEmployeeId });
      Defaultform.setFieldsValue({ empId: dropdownEmployeeId });
    }
  }, [dropdownEmployeeId]);

  // useEffect(() => {
  //   if (dropdownEmployeeId === "ST006") {
  //     Defaultform.resetFields();
  //   } else {
  //     ST006form.resetFields();
  //   }
  // }, [dropdownEmployeeId]);

  useEffect(() => {
    if (!isDrawerVisible) {
      ST006form.resetFields();
      Defaultform.resetFields();
      setDropdownEmployeeId(undefined);
      setStartDateTime(null);
      setEndDateTime(null);
    }
  }, [isDrawerVisible]);

  // const handleEdit = (record, index) => {
  //   setEditingTask({ ...record, rowIndex: index });
  //   console.log("Record:", record);
  //   console.log("Index:", index);

  //   setIsModalVisible(true);

  //   editForm.setFieldsValue({
  //     ...record,
  //     startDateTime:
  //       record.startDateTime && record.startDateTime !== "-"
  //         ? dayjs(record.startDateTime)
  //         : null,
  //     endDateTime:
  //       record.endDateTime && record.endDateTime !== "-"
  //         ? dayjs(record.endDateTime)
  //         : null,
  //     dateTime:
  //       record.linkPostedDateTime && record.linkPostedDateTime !== "-"
  //         ? dayjs(record.linkPostedDateTime)
  //         : null,
  //   });
  //   setWorkType(record.workType); // <-- IMPORTANT
  //   setLinkDateTime(record.dateTime || null); // if you're using it
  //   setStartDateTime(record.startDateTime || null);
  //   setEndDateTime(record.endDateTime || null);

  //   setIsModalVisible(true);
  // };

  // const handleOtherEdit = (record, index) => {
  //   setOtherEditingTask({ ...record, rowIndex: index });
  //   console.log("Record:", record);
  //   console.log("Index:", index);

  //   setIsOtherModalVisible(true);

  //   otherEditForm.setFieldsValue({
  //     ...record,
  //     startDateTime: dayjs(record.startDateTime),
  //     endDateTime: dayjs(record.endDateTime),
  //   });
  // };

  // const handleDelete = async (rowIndex) => {
  //   const confirmed = window.confirm("Are you sure you want to delete this task?");
  //   if (!confirmed) return;

  //   try {
  //     const response = await fetch("https://script.google.com/macros/s/AKfycbxe37f6n4P_tV5Bot3v4y18w9WYjMbsB7-OpmA436gErCxxUVLSF5XBf-wmzK5EGkSchA/exec", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: new URLSearchParams({
  //         action: "deleteTask",
  //         rowIndex: rowIndex.toString(),
  //       }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       message.success("Task deleted successfully");
  //       fetchEmployeeData(selectedEmployee);
  //     } else {
  //       message.error(result.error || "Failed to delete task");
  //     }
  //   } catch (error) {
  //     message.error("An error occurred while deleting the task");
  //     console.error(error);
  //   }
  // };

  // const handleDelete = (rowIndex) => {
  //   Modal.confirm({
  //     title: "Are you sure?",
  //     content: "This action will permanently delete the task.",
  //     okText: "Yes, delete it",
  //     okType: "danger",
  //     cancelText: "Cancel",
  //     onOk: async () => {
  //       try {
  //         const response = await fetch("https://script.google.com/macros/s/AKfycbxe37f6n4P_tV5Bot3v4y18w9WYjMbsB7-OpmA436gErCxxUVLSF5XBf-wmzK5EGkSchA/exec", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/x-www-form-urlencoded",
  //           },
  //           body: new URLSearchParams({
  //             action: "deleteTask",
  //             rowIndex: rowIndex.toString(),
  //           }),
  //         });

  //         const result = await response.json();

  //         if (result.success) {
  //           message.success("Task deleted successfully");
  //           fetchEmployeeData(selectedEmployee);
  //         } else {
  //           message.error(result.error || "Failed to delete task");
  //         }
  //       } catch (error) {
  //         message.error("An error occurred while deleting the task");
  //         console.error(error);
  //       }
  //     },
  //   });
  // };

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
                  style={{ border: "1px solid lightblue" }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      marginBottom: "3px",
                      color: "black",
                    }}
                    className="text-center"
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

                    <div
                      className="gradient-text mt-1"
                      style={{ fontSize: "15px" }}
                    >
                      Hello, <br />
                      {username}!<br />
                      {employeeId}
                      <br />
                      {employeeDesignation}
                      <br />
                      {employeeMail}
                    </div>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #f0f0f0",
                      width: "190px",
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
          {/* <Row>
          <div className="employee-performance-card">
            <h3 className="gradient-text">Completed Task Status</h3>
            {employeeAllData.map((emp) => {
              const { completed, total, percentage } =
                calculateCompletedPercentage(emp.tasks);
              return (
                <div key={emp.id} className="employee-performance-item mt-3">
                  <Avatar style={{ backgroundColor: "#662D91" }}>
                    {getInitials(emp.name)}
                  </Avatar>
                  <div className="employee-info">
                    <strong>{emp.name}-{emp.id}</strong>
                    <div
                      className="progress-performance-bar"
                      percent={percentage}
                      showInfo={false}
                      strokeColor="#a167ff"
                      trailColor="#d1c2f0"
                    />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {completed} of {total} tasks completed
                    </span>
                  </div>
                  <div className="percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
          <div className="employee-performance-card">
            <h3 className="gradient-text">Pending Task Status</h3>
            {employeeAllData.map((emp) => {
              const { pending, total, percentage } =
                calculatePendingPercentage(emp.tasks);
              return (
                <div key={emp.id} className="employee-performance-item mt-3">
                  <Avatar style={{ backgroundColor: "#662D91" }}>
                    {getInitials(emp.name)}
                  </Avatar>
                  <div className="employee-info">
                    <strong>{emp.name}-{emp.id}</strong>
                    <div
                      className="progress-performance-bar"
                      percent={percentage}
                      showInfo={false}
                      strokeColor="#a167ff"
                      trailColor="#d1c2f0"
                    />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {pending} of {total} tasks pending
                    </span>
                  </div>
                  <div className="percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
          <div className="employee-performance-card">
            <h3 className="gradient-text"> In-progress Task Status</h3>
            {employeeAllData.map((emp) => {
              const { workInProgress, total, percentage } =
              calculateWorkInProgressPercentage(emp.tasks);
              return (
                <div key={emp.id} className="employee-performance-item mt-3">
                  <Avatar style={{ backgroundColor: "#662D91" }}>
                    {getInitials(emp.name)}
                  </Avatar>
                  <div className="employee-info">
                    <strong>{emp.name}-{emp.id}</strong>
                    <div
                      className="progress-performance-bar"
                      percent={percentage}
                      showInfo={false}
                      strokeColor="#6006f3"
                      trailColor="#d1c2f0"
                    />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {workInProgress} of {total} tasks work in progress
                    </span>
                  </div>
                  <div className="percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
       
          </Row> */}

          <div className="employee-performance-title-wrapper">
            <div className="employeeperformancediv">
              <h3
                className="employee-performance-title gradient-text"
                style={{ textDecoration: "underline" }}
              >
                {" "}
                <UserOutlined style={{ color: "#5c258d" }} /> Employee
                Performance{" "}
              </h3>{" "}
              <Button
                type="primary"
                onClick={ExportExcelAllUser}
                className="gradient-btn"
                loading={exportAllEmployeeExcel}
              >
               
                {exportAllEmployeeExcel ? "Exporting..." : " Export all employee data to excel"}
              </Button>
            </div>
            <Row className="employee-performance-row mt-1">
              <div className="employee-performance-card">
                <h4 className="gradient-text m-0 p-0">Completed Task Status</h4>
                {employeeAllData.map((emp) => {
                  const { completed, total, percentage } =
                    calculateCompletedPercentage(emp.tasks);
                  return (
                    <div key={emp.id} className="employee-performance-item">
                      <Avatar style={{ backgroundColor: "#662D91" }}>
                        {getInitials(emp.name)}
                      </Avatar>
                      <div className="employee-info">
                        <strong>
                          {emp.name}-{emp.id}
                        </strong>
                        <div
                          className="progress-performance-bar"
                          percent={percentage}
                        />
                        <span>
                          {completed} of {total} tasks completed
                        </span>
                      </div>
                      <div className="percentage">{percentage}%</div>
                    </div>
                  );
                })}
              </div>

              <div className="employee-performance-card">
                <h4 className="gradient-text">Pending Task Status</h4>
                {employeeAllData.map((emp) => {
                  const { pending, total, percentage } =
                    calculatePendingPercentage(emp.tasks);
                  return (
                    <div key={emp.id} className="employee-performance-item">
                      <Avatar style={{ backgroundColor: "#662D91" }}>
                        {getInitials(emp.name)}
                      </Avatar>
                      <div className="employee-info">
                        <strong>
                          {emp.name}-{emp.id}
                        </strong>
                        <div
                          className="progress-performance-bar"
                          percent={percentage}
                        />
                        <span>
                          {pending} of {total} tasks pending
                        </span>
                      </div>
                      <div className="percentage">{percentage}%</div>
                    </div>
                  );
                })}
              </div>

              <div className="employee-performance-card">
                <h4 className="gradient-text">In-progress Task Status</h4>
                {employeeAllData.map((emp) => {
                  const { workInProgress, total, percentage } =
                    calculateWorkInProgressPercentage(emp.tasks);
                  return (
                    <div key={emp.id} className="employee-performance-item">
                      <Avatar style={{ backgroundColor: "#662D91" }}>
                        {getInitials(emp.name)}
                      </Avatar>
                      <div className="employee-info">
                        <strong>
                          {emp.name}-{emp.id}
                        </strong>
                        <div
                          className="progress-performance-bar"
                          percent={percentage}
                        />
                        <span>
                          {workInProgress} of {total} tasks work in progress
                        </span>
                      </div>
                      <div className="percentage">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </Row>
          </div>

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
          <>
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
                {
                  label: "Assign Task",
                  key: "assignTask",
                  gradient:
                    "linear-gradient(to right, rgb(234 23 103), rgb(96, 120, 234))",
                },
              ].map(({ label, key, gradient }) => (
                <Col xs={24} sm={12} md={8} lg={5} key={key}>
                  <Card
                    className="stats-card"
                    style={{
                      background: gradient,
                      minHeight: "100px",
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

                    <div
                      className="stat-title"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {key == "assignTask" ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <PlusOutlined style={{ fontSize: "40px" }} />{" "}
                            <span className="mt-2" style={{ fontSize: "20px" }}>
                              {label}
                            </span>{" "}
                          </div>
                        </>
                      ) : (
                        `${label} (${
                          key !== "total"
                            ? `${taskStats.percentages[key]}%`
                            : "100%"
                        })`
                      )}
                    </div>

                    {key !== "assignTask" && (
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
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
            <Drawer
              title="Assign New Task"
              placement="right"
              onClose={() => setIsDrawerVisible(false)}
              open={isDrawerVisible}
              destroyOnClose
              width={1200}
              zIndex={1200}
            >
              {dropdownEmployeeId === "ST006" ? (
                <Form
                  layout="vertical"
                  form={ST006form}
                  onFinish={(values) => handleSubmit(values, user)}
                  initialValues={{
                    employeeId: user?.employeeId || undefined,
                    status: "Pending",
                    assigned: username,
                    // empId: dropdownEmployeeId,
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <>
                            <IdcardOutlined />
                            <span className="ms-1">Select Employee</span>
                          </>
                        }
                        name="empId"
                        rules={[
                          {
                            required: true,
                            message: "Please select the employee Id",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Employee"
                          size="large"
                          value={dropdownEmployeeId}
                          onChange={(value) => {
                            setDropdownEmployeeId(value);
                          }}
                        >
                          {employeeList.map((emp) => (
                            <Option key={emp.id} value={emp.id}>
                              {emp.id} - {emp.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Work Type
                          </span>
                        }
                        initialValue="Other"
                        name="workType"
                        rules={[
                          {
                            required: true,
                            message: "Please select your work type",
                          },
                        ]}
                      >
                        <Input size="large" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24}>
                      <Form.Item
                        label={
                          <span>
                            <TeamOutlined /> Client Name/Task Name
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
                                value.isAfter(getFieldValue("startDateTime"))
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
                        <Select
                          placeholder="Select status"
                          size="large"
                          disabled
                        >
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
                          disabled
                        />
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
                        {loading ? "Assigning..." : "Assign Task"}
                      </Button>
                      <Button
                        color="danger"
                        variant="solid"
                        className=" px-5 py-2 ms-2"
                        size="large"
                        onClick={() => {
                          ST006form.resetFields();
                          Defaultform.resetFields();
                          message.success("Form data cleared successfully");
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <Form
                  layout="vertical"
                  form={Defaultform}
                  onFinish={(values) => handleDefaultSubmit(values, user)}
                  initialValues={{
                    employeeId: user?.employeeId || undefined,
                    status: "Pending",
                    assigned: username,
                    // empId: dropdownEmployeeId,
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <>
                            <IdcardOutlined />
                            <span className="ms-1">Select Employee</span>
                          </>
                        }
                        name="empId"
                        rules={[
                          {
                            required: true,
                            message: "Please select the employee Id",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Employee"
                          size="large"
                          value={dropdownEmployeeId}
                          onChange={(value) => {
                            setDropdownEmployeeId(value);
                            Defaultform.setFieldsValue({ empId: value });
                          }}
                        >
                          {employeeList.map((emp) => (
                            <Option key={emp.id} value={emp.id}>
                              {emp.id} - {emp.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <TeamOutlined /> Client/Task Name
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

                    <Col xs={24} md={24}>
                      <Row gutter={24}>
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
                                      "End date must be after start date"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <DatePicker
                              showTime
                              style={{ width: "100%" }}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

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
                            message: "Please enter task details",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter task details"
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
                        <Select
                          placeholder="Select status"
                          size="large"
                          disabled
                        >
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

                    {/* Assigned By */}
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
                            message: "Please enter assigner name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter name" size="large" disabled />
                      </Form.Item>
                    </Col>

                    {/* Notes */}

                    <Col xs={24} className="text-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="gradient-btn px-5 py-2"
                        size="large"
                      >
                        {loading ? "Assigning..." : "Assign Task"}
                      </Button>
                      <Button
                        color="danger"
                        variant="solid"
                        className=" px-5 py-2 ms-2"
                        size="large"
                        onClick={() => {
                          ST006form.resetFields();
                          Defaultform.resetFields();
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Drawer>
          </>

          <Col xs={24} className="mt-5">
            <Card
              title={
                <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 ">
                  {/* Icon and Title */}
                  <div className="d-flex align-items-center ">
                    <TableOutlined
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
                // rowKey={(record) => record.key}
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
            {/* <Modal
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
              </Modal> */}
          </Col>

          <Col xs={24}>
            {/* <Modal
                title="Edit Task Data"
                className="fw-bold"
                open={isOtherModalVisible}
                onCancel={() => setIsOtherModalVisible(false)}
                footer={null}
                width={1200}
              >
                <Form
                  layout="vertical"
                  form={otherEditForm}
                  onFinish={(values) => handleOtherUpdate(values, user)}
                >
                  <Form.Item name="rowIndex" hidden>
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <TeamOutlined /> Client/Task Name
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
                      <Row gutter={16}>
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
                                      "End date must be after start date"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <DatePicker
                              showTime
                              style={{ width: "100%" }}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

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
                            message: "Please enter task details",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Enter task details"
                          rows={3}
                          size="large"
                        />
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
                      >
                        <TextArea
                          placeholder="Enter link (optional)"
                          rows={1}
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
                          { required: true, message: "Please select status" },
                        ]}
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="Not Started">
                            Not Started
                          </Select.Option>
                          <Select.Option value="Work in Progress">
                            Work in Progress
                          </Select.Option>
                          <Select.Option value="Under Review">
                            Under Review
                          </Select.Option>
                          <Select.Option value="Pending">Pending</Select.Option>
                          <Select.Option value="Hold">Hold</Select.Option>
                          <Select.Option value="Completed">
                            Completed
                          </Select.Option>
                        </Select>
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
                            message: "Please enter assigner name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter name" size="large" />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label={
                          <span>
                            <FormOutlined /> Notes/Remarks
                          </span>
                        }
                        name="notes"
                      >
                        <TextArea
                          placeholder="Enter remarks"
                          rows={2}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} className="text-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isOtherUpdateLoading}
                        className="gradient-btn px-5 py-2"
                        size="large"
                      >
                        {isOtherUpdateLoading ? "Updating..." : "Update Task"}
                      </Button>
                      <Button
                        color="danger"
                        variant="solid"
                        size="large"
                        onClick={() => setIsOtherModalVisible(false)}
                        className="ms-2 px-5 py-2"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Modal> */}
          </Col>
          <Col xs={24} className="mt-3">
            <Card
              title={
                <div className="d-flex align-items-center justify-content-center flex-wrap ">
                  {/* Icon and Title */}
                  <div className="d-flex align-items-center">
                    <BarChartOutlined
                      style={{ fontSize: "24px", marginRight: "10px" }}
                    />
                    <span className="gradient-text">
                      {selectedEmployeeName && selectedEmployeeId
                        ? ` ${selectedEmployeeId} - ${selectedEmployeeName}'s Task Status Chart`
                        : ""}
                    </span>
                  </div>

                  {/* Centered Search Bar */}
                  <div className="flex-grow-1 d-flex justify-content-center">
                    <>
                      <DatePicker.RangePicker
                        format="YYYY-MM-DD"
                        onChange={(dates) => setDateRange(dates)}
                        allowClear
                        className="me-lg-5"
                      />
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
                      Array.isArray(filteredChartData) ? filteredChartData : []
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
        </Content>
      </Layout>
    </div>
  );
};

export default Admin;
