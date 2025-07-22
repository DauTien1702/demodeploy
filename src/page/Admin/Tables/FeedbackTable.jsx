import {
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Pagination,
  Paper,
  SvgIcon,
  Tooltip,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";

import { Sheet, Table } from "@mui/joy";
import { useEffect, useState } from "react";
import BackToDashboardButton from "../../../utils/backToDashboardBtn";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProductSelected } from "../../../state/filter/filterSlice";

const FeedbackTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const itemsPerPage = 5;
  const token = localStorage.getItem("sessionToken");

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/feedbacks/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data);
      } else {
        console.error("Lỗi lấy danh sách phản hồi");
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/feedbacks/${feedbackToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        await fetchFeedbacks();
        toast.success("Xoá phản hồi thành công!");
      } else {
        toast.error("Xoá phản hồi thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      alert("Có lỗi khi xoá!");
    } finally {
      setOpenDeleteModal(false);
      setFeedbackToDelete(null);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filtered = feedbackList.filter((f) =>
    f.comment?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (e, value) => setPage(value);

  return (
    <Box sx={{ px: 3, backgroundColor: "#f4f4f4" }}>
      <BackToDashboardButton />

      <Sheet sx={{ backgroundColor: "#fff", borderRadius: 10, p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
            mb: 2,
            mt: 1,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="primary" px={4}>
            Danh sách phản hồi khách hàng
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table stickyHeader variant="outlined" size="md">
              <TableHead>
                <TableRow>
                  <TableCell>Nội dung</TableCell>
                  <TableCell>Ngày phản hồi</TableCell>
                  <TableCell>Phê duyệt</TableCell>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.length > 0 ? (
                  paginated.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>{feedback.comment || "—"}</TableCell>
                      <TableCell>
                        {formatDate(feedback.createdAt.split("T")[0])} {" | "}
                        {formatTime(feedback.createdAt)}
                      </TableCell>
                      <TableCell>
                        {feedback.isApproved ? (
                          <CheckCircleIcon sx={{ color: "green" }} />
                        ) : (
                          <CancelIcon sx={{ color: "red" }} />
                        )}
                      </TableCell>
                      <TableCell>{feedback.fullName || "—"}</TableCell>
                      <TableCell
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setProductSelected(feedback.productName));
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
                        {feedback.productName || "—"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Xoá đánh giá">
                          <DeleteIcon
                            sx={{
                              color: "error.main",
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": { transform: "scale(1.2)" },
                            }}
                            onClick={() => {
                              setFeedbackToDelete(feedback);
                              setOpenDeleteModal(true);
                            }}
                          />
                        </Tooltip>

                        <Tooltip title="Xem chi tiết">
                          <VisibilityIcon
                            sx={{
                              color: "success.main",
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": { transform: "scale(1.2)" },
                            }}
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setOpenDetailModal(true);
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có phản hồi nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mx={2}
                    >
                      <Pagination
                        size="small"
                        shape="rounded"
                        color="primary"
                        count={Math.ceil(filtered.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                      />

                      <Typography color="text.secondary">
                        Tổng số phản hồi: {filtered.length}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Sheet>

      <Modal open={openDetailModal} onClose={() => setOpenDetailModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#e3f2fd",
              px: 3,
              py: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography fontWeight="bold" color="text.primary">
              Chi tiết phản hồi
            </Typography>
            <Button
              onClick={() => setOpenDetailModal(false)}
              sx={{
                minWidth: 0,
                px: 2,
                py: 0.5,
                border: "1px solid #f44336",
                color: "#f44336",
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#f44336",
                  color: "#fff",
                },
              }}
            >
              ĐÓNG
            </Button>
          </Box>

          {/* Nội dung */}
          <Box px={3} py={3} display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2} alignItems="center">
              <SvgIcon color="action">
                <NotesOutlinedIcon />
              </SvgIcon>
              <Typography color="text.secondary" width={120}>
                Nội dung
              </Typography>
              <Typography>{selectedFeedback?.comment || "—"}</Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <SvgIcon color="action">
                <AccessTimeOutlinedIcon />
              </SvgIcon>
              <Typography color="text.secondary" width={120}>
                Thời gian
              </Typography>
              <Typography>
                {selectedFeedback?.createdAt
                  ? `${formatDate(selectedFeedback.createdAt)} | ${formatTime(
                      selectedFeedback.createdAt
                    )}`
                  : "—"}
              </Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <SvgIcon color="action">
                <CheckCircleOutlineIcon />
              </SvgIcon>
              <Typography color="text.secondary" width={120}>
                Phê duyệt
              </Typography>
              <Typography>
                {selectedFeedback?.isApproved ? "✔ Đã duyệt" : "✘ Chưa duyệt"}
              </Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <SvgIcon color="action">
                <PersonOutlineIcon />
              </SvgIcon>
              <Typography color="text.secondary" width={120}>
                Người dùng
              </Typography>
              <Typography>{selectedFeedback?.fullName || "—"}</Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <SvgIcon color="action">
                <Inventory2OutlinedIcon />
              </SvgIcon>
              <Typography color="text.secondary" width={120}>
                Sản phẩm
              </Typography>
              <Typography>{selectedFeedback?.productName || "—"}</Typography>
            </Box>

            {/* Nút Phê duyệt / Từ chối */}
            {selectedFeedback && !selectedFeedback.isApproved && (
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:8080/api/feedbacks/${selectedFeedback.id}/approve`,
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      if (res.ok) {
                        toast.success("Phê duyệt thành công!");
                        await fetchFeedbacks();
                        setOpenDetailModal(false);
                      } else {
                        toast.error("Phê duyệt thất bại!");
                      }
                    } catch (err) {
                      console.error("Lỗi khi phê duyệt:", err);
                      toast.error("Có lỗi xảy ra khi phê duyệt!");
                    }
                  }}
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Phê duyệt
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
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
          <Typography variant="h6" fontWeight="bold" color="error.main">
            Xác nhận xoá
          </Typography>

          <Typography color="text.secondary">
            Bạn có chắc chắn muốn xoá phản hồi này?
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenDeleteModal(false)}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
              }}
            >
              HỦY
            </Button>
            <Button
              onClick={handleDeleteFeedback}
              variant="text"
              sx={{
                color: "#f44336",
                border: "2px solid #f44336",
                backgroundColor: "#ffffff",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#f44336",
                  color: "#ffffff",
                  borderColor: "#f44336",
                },
              }}
            >
              XÓA
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FeedbackTable;
