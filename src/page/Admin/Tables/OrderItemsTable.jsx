import {
  Box,
  Button,
  Chip,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { formatMoney } from "../../../utils/formatMoney";
import PersonIcon from "@mui/icons-material/Person";
import { Table } from "@mui/joy";
import { Image } from "antd";
import { useDispatch } from "react-redux";
import { setProductSelected } from "../../../state/filter/filterSlice";

const OrderItemTable = () => {
  const { id } = useParams();
  const token = localStorage.getItem("sessionToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [orderData, setOrderData] = useState(null);

  // Call api
  const getOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.ok) {
        const data = await response.json();
        setOrderData(data);
      } else {
        toast.error("Lỗi tải đơn hàng: ");
      }
    } catch (error) {
      toast.error("Lỗi tải đơn hàng: ", error);
    }
  };

  // Call API when load and page
  useEffect(() => {
    getOrder();
  }, []);

  const handleBackDashboard = () => {
    navigate("/dashboard/orderlist");
  };

  // console.log(orderData);

  const renderStatusChip = (status) => {
    switch (status) {
      case "PAID":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Đã thanh toán"
            color="success"
          />
        );
      case "PENDING":
        return (
          <Chip
            icon={<AccessTimeIcon />}
            label="Chờ thanh toán"
            color="warning"
          />
        );
      default:
        return <Chip icon={<CancelIcon />} label="Đã hủy" color="error" />;
    }
  };

  return (
    <Box
      sx={{
        px: 3,
        width: "100%",
        height: "100%",
        backgroundColor: "#f4f4f4",
      }}
    >
      {/* Icon back to dashboard */}
      <Button
        onClick={handleBackDashboard}
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 2, mt: 2 }}
      >
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Thông tin đơn hàng #{orderData?.id}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          {/* User */}
          <Typography>
            <PersonIcon color="primary" />
            Khách hàng: {orderData?.fullName || "Khách hàng"}
          </Typography>

          {/* Totol Amount */}
          <Typography>
            <MonetizationOnIcon color="primary" />
            Tổng tiền: {formatMoney(orderData?.totalAmount)}
          </Typography>

          {/* Order Date */}
          <Typography>
            <CalendarMonthIcon color="action" />
            Ngày đặt:{" "}
            {orderData?.orderDate
              ? `${formatDate(
                  orderData.orderDate.split("T")[0]
                )} | ${formatTime(orderData.orderDate)}`
              : "Đang tải..."}
          </Typography>

          {/* Address */}
          <Typography>
            <LocationOnIcon color="error" />
            Địa chỉ: {orderData?.address}
          </Typography>

          {/* Paid At */}
          <Typography>
            <PaymentsIcon color="info" />
            Thời gian thanh toán:{" "}
            {orderData?.paidAt
              ? `${formatDate(orderData.paidAt)} | ${formatTime(
                  orderData.paidAt
                )}`
              : "Chưa thanh toán"}
          </Typography>

          {/* Status */}
          <Box display="flex" alignItems="center" gap={1}>
            <InventoryIcon />
            Trạng thái: {renderStatusChip(orderData?.status)}
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" fontWeight={700} mb={2}>
        Danh sách sản phẩm
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 540,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "auto",
        }}
      >
        <Table
          size="md"
          variant="outlined"
          borderAxis="xBetween"
          stickyHeader
          stickyFooter
          color="neutral"
        >
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData?.orderItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <TableCell>
                  <Image
                    width={100}
                    height={100}
                    preview={true}
                    src={item.image}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setProductSelected(item.productName));
                    navigate("/dashboard/productlist");
                  }}
                  sx={{
                    fontWeight: 500,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "primary.dark",
                    },
                  }}
                >
                  {item.productName}
                </TableCell>
                <TableCell>{formatMoney(item.unitPrice)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatMoney(item.totalPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderItemTable;
