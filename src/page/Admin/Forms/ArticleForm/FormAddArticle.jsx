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
import { handleImageUpload } from "../../../../utils/uploadImage";
import { Image } from "antd";

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

const AddArticle = ({ open, handleClose }) => {
  const token = localStorage.getItem("sessionToken");
  const user = localStorage.getItem("fullName");
  const navigate = useNavigate();

  //State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [articleData, setArticleData] = useState({
    title: "",
    image: "",
    content: "",
    authorName: user,
    link: "",
  });

  //Reset all input when cancel and clods modal
  const handleCancel = () => {
    setArticleData({
      title: "",
      image: "",
      content: "",
      authorName: user,
      link: "",
    });

    setErrors({});
    handleClose();
    setLoading(false);
    navigate("articlelist");
  };

  // Function change state of input
  const handleInputChange = (e) => {
    // Name of input, value of input
    const { name, value } = e.target;

    setArticleData({ ...articleData, [name]: value });

    let newErrors = { ...errors };
    if (name === "title") {
      newErrors.title = value.trim() ? "" : "Tiêu đề không được để trống";
    }
    if (name === "image") {
      newErrors.image = value ? "" : "Hình ảnh không được để trống";
    }
    if (name === "content") {
      if (value.trim() === "") {
        newErrors.content = "Nội dung không được để trống";
      } else if (value.trim().length > 200) {
        newErrors.content = "Nội dung không được vượt quá 200 ký tự";
      } else {
        newErrors.content = "";
      }
    }
    if (name === "link") {
      newErrors.link = value.trim() ? "" : "Đường dẫn không được để trống";
    }

    setErrors(newErrors);
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
      const res = await fetch("http://localhost:8080/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      });

      if (res?.ok) {
        toast.success("Tạo bài viết thành công!");

        // Navigate to view brand
        setTimeout(() => {
          handleCancel();
          navigate("articlelist");
        }, 1000);
      } else {
        toast.error("Tạo bài viết thất bại");
      }
    } catch (error) {
      toast.error("Tạo bài viết thất bại");
      setLoading(false);
      console.error("Xảy ra lỗi khi tạo bài viết: ", error);
    }
  };

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
              Thêm bài viết
            </Typography>

            {/* Input fields */}
            <Box maxWidth={400} mx="auto">
              {/* Title */}
              <TextField
                fullWidth
                margin="normal"
                label="Tiêu đề"
                name="title"
                value={articleData.title}
                onChange={handleInputChange}
                error={errors.title}
                helperText={errors.title}
              />

              {/* Article Image */}
              {articleData.image && (
                <Box mt={2}>
                  <Image
                    src={articleData.image}
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
                      setArticleData((prev) => ({ ...prev, image: imgUrl }));
                    })
                  }
                />
              </Button>

              {/* Content */}
              <TextField
                fullWidth
                margin="normal"
                label="Nội dung"
                name="content"
                value={articleData.content}
                onChange={handleInputChange}
                error={errors.content}
                helperText={errors.content}
              />

              {/* Link */}
              <TextField
                fullWidth
                margin="normal"
                label="Đường dẫn"
                name="link"
                value={articleData.link}
                onChange={handleInputChange}
                error={errors.link}
                helperText={errors.link}
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
                    <span>Đang tạo bài viết...</span>
                  </>
                ) : (
                  "Tạo bài viết"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default AddArticle;
