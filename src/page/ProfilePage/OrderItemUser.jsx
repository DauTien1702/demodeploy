import {
  Box,
  Button,
  Chip,
  Modal,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
import { formatDate, formatTime } from "../../utils/formatDateTime";
import { formatMoney } from "../../utils/formatMoney";
import PersonIcon from "@mui/icons-material/Person";
import { Table } from "@mui/joy";
import { Image } from "antd";

const UserOrderItem = () => {
  const { id } = useParams();
  const token = localStorage.getItem("sessionToken");
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  // State
  const [orderData, setOrderData] = useState(null);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comment, setComment] = useState({
    userId: userId,
    productId: "",
    rating: 5,
    comment: "",
  });
  const [errors, setErrors] = useState({});

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

  //Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setComment({ ...comment, [name]: value });

    let newErrors = { ...errors };
    if (name === "comment") {
      if (value.trim() === "") {
        newErrors.comment = "Đánh giá không được để trống";
      } else if (value.trim().length > 300) {
        newErrors.comment = "Đánh giá không được vượt quá 300 ký tự";
      } else {
        newErrors.comment = "";
      }
    }

    setErrors(newErrors);
  };

  //   Submit feedback
  const handleSubmitFeedback = async (e) => {
    try {
      const response = await fetch(`http://localhost:8080/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...comment,
          productId: selectedProduct.productId,
        }),
      });

      if (response.ok) {
        toast.success("Gửi đánh giá thành công");
        setOpenFeedbackModal(false);
      } else {
        toast.error("Gửi đánh giá thất bại");
      }
    } catch (error) {
      toast.error("Gửi đánh giá thất bại");
    }
  };

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

  //   console.log(orderData);
  console.log(selectedProduct);
  return (
    <>
      <Button
        onClick={() => navigate("/profile-user/userorder")}
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Quay lại
      </Button>

      <Paper
        elevation={3}
        sx={{ p: 1, maxWidth: 1000, mx: "auto", mt: 1, borderRadius: 2 }}
      >
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

      <Typography variant="h6" fontWeight={700} mb={2} mt={2}>
        Danh sách sản phẩm
      </Typography>

      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            maxWidth: "100%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
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
                <TableCell>Hành động</TableCell>
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
                    onClick={() => {
                      navigate(`/product/${item.productId}`);
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
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedProduct(item);
                        setOpenFeedbackModal(true);
                      }}
                    >
                      Đánh giá
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal feedback*/}
      <Modal
        open={openFeedbackModal}
        // onClose={() => setOpenDeleteModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Đánh giá sản phẩm
          </Typography>
          <Typography mb={1}>{selectedProduct?.productName}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhận xét"
            name="comment"
            value={comment.comment}
            error={errors?.comment}
            helperText={errors?.comment}
            onChange={handleChange}
            sx={{ my: 2 }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpenFeedbackModal(false), setErrors();
              }}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
              }}
            >
              HỦY
            </Button>
            <Button variant="contained" onClick={() => handleSubmitFeedback()}>
              Gửi đánh giá
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserOrderItem;
