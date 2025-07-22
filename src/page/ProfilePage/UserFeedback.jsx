import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
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
  Rating,
} from "@mui/material";
import { Table } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDate, formatTime } from "../../utils/formatDateTime";

const UserFeedback = () => {
  const token = localStorage.getItem("sessionToken");
  const userId = localStorage.getItem("id");

  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = feedbacks.slice(startIndex, endIndex);

  const handlePageChange = (e, value) => setPage(value);

  const getUserFeedbacks = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/feedbacks/user/${userId}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        toast.error("Không thể tải phản hồi người dùng.");
      }
    } catch (error) {
      toast.error("Lỗi khi tải phản hồi.", { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getUserFeedbacks();
  }, []);

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
          Đánh giá sản phẩm của bạn
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
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
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Đánh giá</TableCell>
                <TableCell>Bình luận</TableCell>
                <TableCell>Ngày</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell>{fb.productName}</TableCell>
                    <TableCell>
                      <Rating value={fb.rating} readOnly />
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Tooltip title={fb.comment} arrow>
                        <span>{fb.comment}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {formatDate(fb.createdAt?.split("T")[0])} {" | "}
                      {formatTime(fb.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không có đánh giá nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mx={2}
                    py={1}
                  >
                    <Pagination
                      size="small"
                      shape="rounded"
                      color="primary"
                      count={Math.ceil(feedbacks.length / itemsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                    />
                    <Typography color="text.secondary" fontWeight={500}>
                      Tổng đánh giá: {feedbacks.length}
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

export default UserFeedback;
