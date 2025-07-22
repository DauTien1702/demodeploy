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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import { Sheet, Table } from "@mui/joy";
import BackToDashboardButton from "../../../utils/backToDashboardBtn";
import UpdateCategory from "../Forms/CategoryForm/FormUpdateCategory";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearCategorySelected } from "../../../state/filter/filterSlice";

const CategoryTable = () => {
  const token = localStorage.getItem("sessionToken");

  // State
  const [categorieData, setCategorieData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const categorySelected = useSelector((state) => state.filter.category);

  // Filter categories by search
  const filteredCategories = categorieData.filter((category) => {
    if (categorySelected) {
      return category.name === categorySelected;
    } else {
      return category.name.toLowerCase().includes(searchKeyword.toLowerCase());
    }
  });

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (e, value) => setPage(value);

  // Fetch categories
  const getCategoryList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/getAll`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response?.ok) {
        const data = await response.json();
        setCategorieData(data);
      } else {
        toast.error("Lỗi tải danh mục");
      }
    } catch (err) {
      toast.error("Lỗi tải danh mục:", err);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  // Handle row click (open update modal)
  const handleRowClick = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    const categoryId = selectedCategory.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/${categoryId}`,
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
        getCategoryList();
      } else {
        toast.error("Xoá loại thất bại");
      }
    } catch (error) {
      toast.error("Xoá loại thất bại");
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
          backgroundColor: "#ffffff",
          border: "1px",
          borderRadius: 4,
          p: 2,
          mb: 2,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
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
            Danh sách danh mục
          </Typography>

          <Box>
            {!categorySelected && (
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
                placeholder="Tìm theo tên danh mục"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {categorySelected && (
              <Button
                onClick={() => dispatch(clearCategorySelected())}
                variant="outlined"
                color="primary"
                sx={{ ml: 2 }}
              >
                Hiển thị tất cả loại
              </Button>
            )}
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 440,
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
                <TableCell sx={{ minWidth: 200 }}>Tên danh mục</TableCell>
                <TableCell sx={{ minWidth: 300 }}>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedItems.map((category) => (
                <TableRow
                  key={category.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <TableCell>{category.name}</TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {category.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xoá loại">
                      <DeleteIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category);
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
                        onClick={() => handleRowClick(category)}
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
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
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
                      count={Math.ceil(
                        filteredCategories.length / itemsPerPage
                      )}
                      page={page}
                      onChange={handlePageChange}
                    />

                    <Typography color="text.secondary">
                      Tổng số danh mục: {filteredCategories.length}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Modal for update category */}
        <UpdateCategory
          open={openModal}
          category={selectedCategory}
          handleClose={() => setOpenModal(false)}
          refreshCategories={getCategoryList}
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
            <Typography variant="h6" fontWeight="bold" color="error.main">
              Xác nhận xoá
            </Typography>

            <Typography color="text.secondary">
              Bạn có chắc chắn muốn xoá danh mục này?
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
                onClick={handleDeleteCategory}
                variant="text"
                sx={{
                  color: "#f44336",
                  border: "2px solid #f44336",
                  borderColor: "#f44336",
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

export default CategoryTable;
