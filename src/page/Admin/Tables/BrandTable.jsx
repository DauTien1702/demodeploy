import {
  Box,
  Button,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { Sheet, Table } from "@mui/joy";
import BackToDashboardButton from "../../../utils/backToDashboardBtn";
import UpdateBrand from "../Forms/BrandForm/FormUpdateBrand";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Image } from "antd";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearBrandSelected } from "../../../state/filter/filterSlice";

const BrandTable = () => {
  const token = localStorage.getItem("sessionToken");

  // State
  const [openModal, setOpenModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandsdata, setBrandsdata] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [brandFilter, setBrandFilter] = useState("");

  // Redux
  const dispatch = useDispatch();
  const brandSelected = useSelector((state) => state.filter.brand);

  // Filter brands by search
  const filteredBrands = brandsdata.filter((brand) => {
    if (brandSelected) {
      return brand.name === brandSelected;
    }

    if (brandFilter) {
      return brand.name.toLowerCase() === brandFilter.toLowerCase();
    }

    return true;
  });

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredBrands.slice(startIndex, endIndex);

  const handlePageChange = (e, value) => setPage(value);

  // Fetch brands
  const getBrandList = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/brands/getAll`, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (response?.ok) {
        const data = await response.json();
        setBrandsdata(data);
      } else {
        toast.error("Lỗi tải thương hiệu");
      }
    } catch (err) {
      toast.error("Lỗi tải thương hiệu:", err);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  // Handle row click (open update modal)
  const handleRowClick = (brand) => {
    setSelectedBrand(brand);
    setOpenModal(true);
  };

  // Handle delete brand
  const handleDeleteBrand = async () => {
    const brandId = selectedBrand.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/brands/${brandId}`,
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
        setSelectedBrand(null);
        getBrandList();
      } else {
        toast.error("Xoá sản phẩm thất bại");
      }
    } catch (error) {
      toast.error("Xoá sản phẩm thất bại");
    }
  };

  return (
    <Box
      sx={{ px: 3, width: "100%", height: "100%", backgroundColor: "#f4f4f4" }}
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
          <Typography sx={{ p: 4 }} variant="h5">
            Danh sách thương hiệu
          </Typography>

          {!brandSelected && (
            <TextField
              select
              size="small"
              value={brandFilter}
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setPage(1);
              }}
              SelectProps={{ native: true }}
            >
              <option value="">Tất cả thương hiệu</option>
              {brandsdata?.map((brand) => (
                <option key={brand.id} value={brand.brandName}>
                  {brand.name}
                </option>
              ))}
            </TextField>
          )}

          {brandSelected && (
            <Button
              onClick={() => dispatch(clearBrandSelected())}
              variant="outlined"
              color="primary"
              sx={{ ml: 2 }}
            >
              Hiển thị tất cả thương hiệu
            </Button>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
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
                <TableCell sx={{ minWidth: 200 }}>Hình ảnh</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Tên thương hiệu</TableCell>
                <TableCell sx={{ minWidth: 300 }}>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedItems.map((brand) => (
                <TableRow
                  key={brand.id}
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
                      src={brand.image}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {brand.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xoá thương hiệu">
                      <DeleteIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBrand(brand);
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
                        onClick={() => handleRowClick(brand)}
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

            {/* Footer */}
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
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
                      count={Math.ceil(filteredBrands.length / itemsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                    />

                    <Typography color="text.secondary">
                      Tổng số thương hiệu: {filteredBrands.length}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Modal for update brand */}
        <UpdateBrand
          open={openModal}
          brand={selectedBrand}
          handleClose={() => setOpenModal(false)}
          refreshBrands={getBrandList}
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
              Bạn có chắc chắn muốn xoá thương hiệu này?
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
                onClick={handleDeleteBrand}
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

export default BrandTable;
