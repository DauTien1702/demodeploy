import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const AddCategory = ({ open, handleClose }) => {
  const token = localStorage.getItem("sessionToken");
  const navigate = useNavigate();

  // State
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  // Function change state of input
  const handleInputChange = (e) => {
    // Name of input, value of input
    const { name, value } = e.target;

    setCategoryData({ ...categoryData, [name]: value });

    let newErrors = { ...errors };
    if (name === "name") {
      newErrors.name = value.trim() ? "" : "Tên sản phẩm không được để trống";
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

    setErrors(newErrors);
  };

  // Reset inputs and close modal
  const handleCancel = () => {
    setCategoryData({
      name: "",
      description: "",
    });

    setErrors({});
    setLoading(false);
    handleClose();
    navigate("categorylist");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check for validation errors
    if (Object.values(errors).some((error) => error)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        toast.success("Tạo loại thành công!");

        // Navigate to view brand
        setTimeout(() => {
          handleCancel();
          navigate("categoryList");
        }, 1000);
      } else {
        const errData = await response.json();
        console.error("Lỗi từ API:", errData);
      }
    } catch (error) {
      toast.error("Tạo loại thất bại");
      console.error("Lỗi khi thêm loại:", error);
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Box sx={style}>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="h6"
            gutterBottom
            align="center"
          >
            Thêm danh mục
          </Typography>

          <Box mt={3}>
            {/* Category name */}
            <TextField
              fullWidth
              label="Tên danh mục"
              value={categoryData.name}
              name="name"
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              error={errors.name}
              helperText={errors.name}
            />

            {/* Category description */}
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={categoryData.description}
              onChange={handleInputChange}
              error={errors.description}
              helperText={errors.description}
              multiline
              rows={3}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4}>
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
                  <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
                  <span>Đang thêm...</span>
                </>
              ) : (
                "Thêm loại"
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};

export default AddCategory;
