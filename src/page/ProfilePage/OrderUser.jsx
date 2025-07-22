import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Pagination,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Table } from "@mui/joy";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import { formatMoney } from "../../utils/formatMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const UserOrder = () => {
  const token = localStorage.getItem("sessionToken");
  const userId = localStorage.getItem("id");

  const navigate = useNavigate();

  // State
  const [ordersData, setOrdersData] = useState([]);

  // Pagination configuration
  const [page, setPage] = useState(1); //Current page
  const itemsPerPage = 6; //Items per page

  // Start and End index to cut userData into paginatedItems
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = ordersData.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (e, value) => setPage(value);

  // Call API brand
  const getUserOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/getOrderbyUserId/${userId}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.ok) {
        const orders = await response.json();
        setOrdersData(orders);
      } else {
        toast.error("Lỗi tải danh sách đơn hàng: ");
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách đơn hàng: ", error);
    }
  };

  // Call API when load and page
  useEffect(() => {
    getUserOrder();
  }, []);

  // console.log(ordersData);

  return (
    <>
      <Button
        onClick={() => navigate("/")}
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Quay lại trang chủ
      </Button>

      <Paper
        elevation={3}
        sx={{ p: 1, maxWidth: 1000, mx: "auto", mt: 1, borderRadius: 2 }}
      >
        <Typography variant="h5" fontWeight={700} color="primary" px={4} mb={4}>
          Danh sách đơn hàng
        </Typography>

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
            {/* Head */}
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Ngày tạo đơn</TableCell>
                <TableCell>Thời gian thanh toán</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {paginatedItems && paginatedItems.length > 0 ? (
                paginatedItems.map((order) => (
                  <Tooltip title="Xem chi tiết đơn hàng" key={order.id}>
                    <TableRow
                      onClick={() =>
                        navigate(
                          `/profile-user/userorder/userorderitem/${order.id}`
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        {formatDate(order.orderDate.split("T")[0])} {" | "}
                        {formatTime(order.orderDate)}
                      </TableCell>
                      <TableCell>
                        {order?.paidAt ? (
                          <>
                            {formatDate(order.paidAt.split("T")[0])} {" | "}
                            {formatTime(order.paidAt)}
                          </>
                        ) : (
                          "Chưa thanh toán"
                        )}
                      </TableCell>
                      <TableCell>{formatMoney(order.totalAmount)}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {order.address}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            order?.status === "PAID" ? (
                              <CheckCircleIcon />
                            ) : order?.status === "PENDING" ? (
                              <AccessTimeIcon />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          label={
                            order?.status === "PAID"
                              ? "Đã thanh toán"
                              : order?.status === "PENDING"
                              ? "Chờ thanh toán"
                              : "Hủy đơn hàng"
                          }
                          color={
                            order?.status === "PAID"
                              ? "success"
                              : order?.status === "PENDING"
                              ? "warning"
                              : "error"
                          }
                          variant="filled"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {/* Footer */}
            <TableFooter sx={{ borderTop: "1px solid #e0e0e0" }}>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginX={2}
                    py={1}
                  >
                    <Pagination
                      size="small"
                      shape="rounded"
                      color="primary"
                      count={Math.ceil(ordersData.length / itemsPerPage)} //Calculate total of how many page need to display
                      page={page}
                      onChange={handlePageChange}
                    />

                    <Typography color="text.secondary" fontWeight={500}>
                      Tổng số đơn hàng: {ordersData.length}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default UserOrder;
