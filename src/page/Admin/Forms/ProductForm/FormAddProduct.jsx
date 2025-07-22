import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Image } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleImageUpload } from "../../../../utils/uploadImage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const AddProduct = ({ open, handleClose }) => {
  const token = localStorage.getItem("sessionToken");
  const navigate = useNavigate();

  // State
  const [errors, setErrors] = useState({});
  const [brandsdata, setBrandsData] = useState([]);
  const [categorydata, setCategorydata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    image: "",
    price: "",
    description: "",
    categoryId: "",
    brandId: "",
    quantity: "",
    status: true,
  });

  // Function change state of input
  const handleInputChange = (e) => {
    // Name of input, value of input
    const { name, value } = e.target;

    setProductData({ ...productData, [name]: value });

    let newErrors = { ...errors };
    if (name === "name") {
      newErrors.name = value.trim() ? "" : "Tên sản phẩm không được để trống";
    }
    if (name === "image") {
      newErrors.image = value ? "" : "Hình ảnh không được để trống";
    }
    if (name === "price") {
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      newErrors.price =
        value && priceRegex.test(value) ? "" : "Giá phải là số và lớn hơn 0!";
    }
    if (name === "description") {
      if (value.trim() === "") {
        newErrors.description = "Mô tả không được để trống";
      } else if (value.trim().length > 200) {
        newErrors.description = "Mô tả không được vượt quá 200 ký tự";
      } else {
        newErrors.description = "";
      }
    }
    if (name === "quantity") {
      const quantityNumber = Number(value);
      newErrors.quantity =
        !isNaN(quantityNumber) && quantityNumber >= 0
          ? ""
          : "Số lượng phải là số dương";
    }

    setErrors(newErrors);
  };

  //Reset all input when cancel and clode modal
  const handleCancel = () => {
    setProductData({
      name: "",
      image: "",
      price: "",
      description: "",
      categoryId: "",
      brandId: "",
      quantity: "",
    });

    setErrors({});
    handleClose();
    setLoading(false);
    navigate("productlist");
  };

  // Logic submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    if (Object.values(errors).some((error) => error)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...productData, status: true }),
      });

      if (response.ok) {
        toast.success("Tạo sản phẩm thành công!");

        // Navigate to view users
        setTimeout(() => {
          handleCancel();
          navigate("productlist");
        }, 1000);
      } else {
        toast.error("Lỗi tạo sản phẩm thất bại");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Tạo sản phẩm thất bại");
      setLoading(false);
    }
  };

  // Call API brand
  const getBrandsList = async () => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/brands/getAll`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
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
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/getAll`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
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
    <>
      <Modal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <Box sx={style}>
            <Typography
              sx={{ fontWeight: "bold" }}
              variant="h6"
              gutterBottom
              align="center"
            >
              Thêm sản phẩm
            </Typography>

            {/* Input fields */}
            <Box maxWidth={400} mx="auto">
              {/* Product Name */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Tên sản phẩm"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                error={errors.name}
                helperText={errors.name}
              />

              {/* Product Image */}
              {productData.image && (
                <Box mt={2}>
                  <Image
                    src={productData.image}
                    width={120}
                    height={120}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                    preview={{
                      zIndex: 2000,
                    }}
                  />{" "}
                </Box>
              )}

              <Button
                variant="contained"
                component="label"
                sx={{ mb: 1, mt: 1 }}
              >
                Upload Hình Ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, (imgUrl) => {
                      setProductData((prev) => ({ ...prev, image: imgUrl }));
                    })
                  }
                />
              </Button>

              {/* Product Price */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Giá sản phẩm"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                error={errors.price}
                helperText={errors.price}
              />

              {/* Product Description */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Mô tả sản phẩm"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                error={errors.description}
                helperText={errors.description}
              />

              {/* Product Category */}
              <TextField
                fullWidth
                margin="normal"
                required
                select
                label="Loại sản phẩm"
                name="categoryId"
                value={productData.categoryId}
                onChange={handleInputChange}
              >
                {categorydata?.map((category) => {
                  return (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  );
                })}
              </TextField>

              {/* Product Brand */}
              <TextField
                fullWidth
                margin="normal"
                required
                select
                label="Nhãn hiệu sản phẩm"
                name="brandId"
                value={productData.brandId}
                onChange={handleInputChange}
              >
                {brandsdata?.map((brand) => {
                  return (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  );
                })}
              </TextField>

              {/* Product Quantity */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Số lượng sản phẩm"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                error={errors.quantity}
                helperText={errors.quantity}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button onClick={handleCancel} variant="outlined" sx={{ mr: 2 }}>
                Hủy
              </Button>

              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                sx={{
                  border: "2px solid #1976d2",
                  color: "#1976d2",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "#ffffff",
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={16}
                      sx={{ color: "white", mr: 1 }}
                    />
                    <span>Đang tạo sản phẩm...</span>
                  </>
                ) : (
                  "Tạo sản phẩm"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default AddProduct;
