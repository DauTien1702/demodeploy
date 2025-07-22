import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleImageUpload } from "../../../../utils/uploadImage";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 900,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const AddBrand = ({ open, handleClose }) => {
  const token = localStorage.getItem("sessionToken");
  const navigate = useNavigate();

  // State
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState({
    name: "",
    image: "",
    description: "",
  });

  // Function change state of input
  const handleInputChange = (e) => {
    // Name of input, value of input
    const { name, value } = e.target;

    setBrandData({ ...brandData, [name]: value });

    let newErrors = { ...errors };
    if (name === "name") {
      newErrors.name = value.trim() ? "" : "Tên sản phẩm không được để trống";
    }
    if (name === "image") {
      newErrors.image = value ? "" : "Hình ảnh không được để trống";
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

  //Reset all input when cancel and clode modal
  const handleCancel = () => {
    setBrandData({
      name: "",
      image: "",
      description: "",
    });

    setErrors({});
    handleClose();
    setLoading(false);
    navigate("brandlist");
  };

  // Logic submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
      });

      if (res.ok) {
        toast.success("Tạo nhãn hiệu thành công!");

        // Navigate to view brand
        setTimeout(() => {
          handleCancel();
          navigate("brandlist");
        }, 1000);
      } else {
        const errData = await res.json();
        console.error("Lỗi từ API:", errData);
      }
    } catch (error) {
      toast.error("Tạo nhãn hiệu thất bại");
      setLoading(false);
      console.error("Xảy ra lỗi khi tạo nhãn hiệu: ", err);
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
            Thêm thương hiệu
          </Typography>

          <Box mt={3}>
            {/* Brand name */}
            <TextField
              fullWidth
              label="Tên thương hiệu"
              value={brandData.name}
              name="name"
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />

            {/* Brand Image */}
            {brandData.image && (
              <Box mt={2}>
                <Image
                  src={brandData.image}
                  width={120}
                  height={120}
                  style={{ borderRadius: 8, objectFit: "cover" }}
                  preview={{
                    zIndex: 2000,
                  }}
                />{" "}
              </Box>
            )}

            <Button variant="contained" component="label" sx={{ mb: 1, mt: 1 }}>
              Upload Hình Ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e, (imgUrl) => {
                    setBrandData((prev) => ({ ...prev, image: imgUrl }));
                  })
                }
              />
            </Button>

            {/* Brand description */}
            <TextField
              fullWidth
              label="Mô tả"
              value={brandData.description}
              name="description"
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
                "Thêm thương hiệu"
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};

export default AddBrand;
