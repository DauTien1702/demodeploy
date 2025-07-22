import {
  Box,
  Button,
  InputAdornment,
  Modal,
  Pagination,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import BackToDashboardButton from "../../../utils/backToDashboardBtn";
import { Sheet, Table } from "@mui/joy";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Image } from "antd";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import UpdateArticle from "../Forms/ArticleForm/FormUpdateArticle";

const ArticleTable = () => {
  const token = localStorage.getItem("sessionToken");

  // State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articlesdata, setArticlesdata] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Filter article by search
  const filteredArticle = articlesdata.filter((article) => {
    const matchesArticle = article.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    return matchesArticle;
  });

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredArticle.slice(startIndex, endIndex);

  const handlePageChange = (e, value) => setPage(value);

  // Fetch article
  const getArticleList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/articles/getAll`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response?.ok) {
        const data = await response.json();
        setArticlesdata(data);
      } else {
        toast.error("Lỗi tải bài viết");
      }
    } catch (err) {
      toast.error("Lỗi tải bài viết:", err);
    }
  };

  useEffect(() => {
    getArticleList();
  }, []);

  // Handle row click (open update modal)
  const handleRowClick = (article) => {
    setSelectedArticle(article);
    setOpenModal(true);
  };

  // Handle delete article
  const handleDeleteArticle = async () => {
    const articleId = selectedArticle.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/articles/${articleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Xoá thành công");
        setOpenDeleteModal(false);
        setSelectedArticle(null);
        getArticleList();
      } else {
        toast.error("Xoá bài viết thất bại");
      }
    } catch (error) {
      toast.error("Xoá bài viết thất bại");
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
      <BackToDashboardButton />

      <Sheet
        sx={{
          backgroundColor: "#fff",
          border: "1px",
          borderRadius: 10,
          p: 2,
          mb: 2,
        }}
      >
        {/* Title & Filter */}
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
          {/* Title */}
          <Typography variant="h5" fontWeight={700} color="primary" px={4}>
            Danh sách bài viết
          </Typography>

          {/* Search & Filter */}
          <Box>
            <TextField
              sx={{
                mr: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              size="small"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tiêu đề"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          {/* Table */}
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
                <TableCell>Hình ảnh</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Tiêu đề</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Đường dẫn</TableCell>
                <TableCell>Ngày/Giờ tạo</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems?.map((article) => (
                  <TableRow
                    key={article.id}
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
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        preview={true}
                        src={article.image}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 100,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {article.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {article.content}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {article.link}
                    </TableCell>
                    <TableCell>
                      {formatDate(article.createdDate.split("T")[0])} {" | "}
                      {formatTime(article.createdDate)}
                    </TableCell>
                    <TableCell>{article.authorName}</TableCell>
                    <TableCell>
                      <Tooltip title="Xoá bài viết">
                        <DeleteIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(article);
                            setOpenDeleteModal(true);
                          }}
                          sx={{
                            color: "error.main",
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                        />
                      </Tooltip>

                      <Tooltip title="Xem chi tiết">
                        <VisibilityIcon
                          onClick={() => handleRowClick(article)}
                          sx={{
                            color: "success.main",
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không tìm thấy bài viết nào
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>

            {/* Footer */}
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginX={2}
                  >
                    <Pagination
                      size="small"
                      shape="rounded"
                      color="primary"
                      count={Math.ceil(filteredArticle.length / itemsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                    />

                    <Typography color="text.secondary">
                      Tổng số bài viết: {filteredArticle.length}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Modal for article detail */}
        <UpdateArticle
          open={openModal}
          article={selectedArticle}
          handleClose={() => setOpenModal(false)}
          refreshArticle={getArticleList}
        />

        {/* Modal confirm delete */}
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
            <Typography variant="h6" fontWeight="bold" color="error">
              ⚠️ Xác nhận xoá
            </Typography>

            <Typography color="text.secondary">
              Bạn có chắc chắn muốn xoá bài viết này?
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
                onClick={handleDeleteArticle}
                variant="text"
                sx={{
                  color: "#f44336",
                  border: "2px solid #f44336",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  borderRadius: 2,
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
      </Sheet>
    </Box>
  );
};

export default ArticleTable;
