import {
  Box,
  Button,
  Chip,
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
import { toast } from "react-toastify";
import { Sheet, Table } from "@mui/joy";
import BackToDashboardButton from "../../../utils/backToDashboardBtn";
import { Image } from "antd";
import { formatMoney } from "../../../utils/formatMoney";
import UpdateProduct from "../Forms/ProductForm/FormUpdateProduct";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearProductSelected,
  setBrandSelected,
  setCategorySelected,
} from "../../../state/filter/filterSlice";

const ProductTable = () => {
  const token = localStorage.getItem("sessionToken");
  const userRole = localStorage.getItem("roles");

  const navigate = useNavigate();

  // State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productData, setProductData] = useState([]);
  const [brandsdata, setBrandsData] = useState([]);
  const [categorydata, setCategorydata] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  // Redux
  const dispatch = useDispatch();
  const productSelected = useSelector((state) => state.filter.product);

  // Search and filter product
  const filterProduct = productData.filter((product) => {
    if (productSelected) {
      return product.name === productSelected;
    } else {
      const matchesKeyword = product.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      const matchesCategory = categoryFilter
        ? product.categoryName.toLowerCase() === categoryFilter.toLowerCase()
        : true;

      const matchesBrand = brandFilter
        ? product.brandName.toLowerCase() === brandFilter.toLowerCase()
        : true;

      return matchesKeyword && matchesCategory && matchesBrand;
    }
  });

  // Pagination configuration
  const [page, setPage] = useState(1); //Current page
  const itemsPerPage = 6; //Items per page

  // Start and End index to cut userData into paginatedItems
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = filterProduct.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (e, value) => setPage(value);

  // Logic call API
  const getProductList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/getAll`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response?.ok) {
        const data = await response.json();
        setProductData(data);
      } else {
        toast.error("Lỗi tải danh sách sản phẩm: ");
      }
    } catch (err) {
      toast.error("Lỗi tải danh sách sản phẩm: ", err);
    }
  };

  // Call API when load and page
  useEffect(() => {
    getProductList();
  }, []);

  // Handle row click
  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDeleteProduct = async (e) => {
    const productId = selectedProduct.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
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
        setSelectedProduct(null);
        getProductList();
      } else {
        toast.error("Xoá sản phẩm thất bại");
      }
    } catch (error) {
      toast.error("Xoá thất bại");
    }
  };

  // Call API brand
  const getBrandsList = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/brands/getAll`, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (response?.ok) {
        const brands = await response.json();
        setBrandsData(brands);
      } else {
        toast.error("Lỗi tải danh sách nhãn hiệu: ");
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách nhãn hiệu: ", error);
    }
  };

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
        const categories = await response.json();
        setCategorydata(categories);
      } else {
        toast.error("Lỗi tải danh sách loại: ");
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách loại: ", error);
    }
  };

  // Call API when load and page
  useEffect(() => {
    getBrandsList();
    getCategoryList();
  }, []);

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
          mb: 5,
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
            Danh sách sản phẩm
          </Typography>

          {/* Search & Filter */}
          <Box>
            {!productSelected && (
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
                  placeholder="Tìm theo tên"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  select
                  size="small"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1); // reset to first page
                  }}
                  SelectProps={{ native: true }}
                  sx={{
                    mr: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <option value="">Tất cả loại</option>
                  {categorydata?.map((category) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.name}
                    </option>
                  ))}
                </TextField>

                <TextField
                  select
                  sx={{
                    mr: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  size="small"
                  value={brandFilter}
                  onChange={(e) => {
                    setBrandFilter(e.target.value);
                    setPage(1); // reset to first page
                  }}
                  SelectProps={{ native: true }}
                >
                  <option value="">Tất cả nhãn hiệu</option>
                  {brandsdata?.map((brand) => (
                    <option key={brand.id} value={brand.brandName}>
                      {brand.name}
                    </option>
                  ))}
                </TextField>
              </Box>
            )}

            {productSelected && (
              <Button
                onClick={() => dispatch(clearProductSelected())}
                variant="outlined"
                color="primary"
                sx={{ ml: 2 }}
              >
                Hiển thị tất cả sản phẩm
              </Button>
            )}
          </Box>
        </Box>

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
            {/* Head */}
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Nhãn hiệu</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems?.map((product) => (
                  <TableRow
                    key={product.id}
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
                        src={product.image}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatMoney(product.price)}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.description}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setCategorySelected(product.categoryName));
                        navigate("/dashboard/categorylist");
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
                      {product.categoryName}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setBrandSelected(product.brandName));
                        navigate("/dashboard/brandlist");
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
                      {product.brandName}
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          product?.status ? <CheckCircleIcon /> : <CancelIcon />
                        }
                        label={product?.status ? "Còn hàng" : "Hết hàng"}
                        color={product?.status ? "success" : "error"}
                        variant="filled"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {userRole === "ADMIN" && (
                        <>
                          <Tooltip title="Xoá sản phẩm">
                            <DeleteIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
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
                        </>
                      )}
                      {(userRole === "ADMIN" || userRole === "STAFF") && (
                        <Tooltip title="Xem chi tiết">
                          <VisibilityIcon
                            onClick={() => handleRowClick(product)}
                            sx={{
                              color: "success.main",
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": { transform: "scale(1.2)" },
                            }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Không tìm thấy sản phẩm nào
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>

            {/* Footer */}
            <TableFooter sx={{ borderTop: "1px solid #e0e0e0" }}>
              <TableRow>
                <TableCell colSpan={9}>
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
                      count={Math.ceil(filterProduct.length / itemsPerPage)} //Calculate total of how many page need to display
                      page={page}
                      onChange={handlePageChange}
                    />

                    <Typography color="text.secondary" fontWeight={500}>
                      Tổng số sản phẩm: {filterProduct.length}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Modal for product detail */}
        <UpdateProduct
          open={openModal}
          product={selectedProduct}
          handleClose={() => setOpenModal(false)}
          refreshProducts={getProductList}
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
              Bạn có chắc chắn muốn xoá sản phẩm này?
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
                onClick={handleDeleteProduct}
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
                XÁC NHẬN
              </Button>
            </Box>
          </Box>
        </Modal>
      </Sheet>
    </Box>
  );
};

export default ProductTable;
