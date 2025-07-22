import { Box, Button, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InfoRow, InputImageRow, InputRow } from "../../../../utils/updateForm";
import UpdateIcon from "@mui/icons-material/Update";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { handleImageUpload } from "../../../../utils/uploadImage";
import { formatDate, formatTime } from "../../../../utils/formatDateTime";

const UpdateArticle = ({ open, article, handleClose, refreshArticle }) => {
  const token = localStorage.getItem("sessionToken");

  //State
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(article);
  const [originalArticle, setOriginalArticle] = useState(null);

  useEffect(() => {
    if (article) {
      setSelectedArticle(article);
    }
  }, [article]);

  const handleCloseModal = () => {
    handleClose();
    setIsEditing(false);
    setSelectedArticle(article);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedArticle((prev) => ({
      ...prev,
      [name]: value,
    }));

    const newErrors = { ...errors };
    if (name === "title") {
      newErrors.title =
        value.trim() === "" ? "Tiêu đề không được để trống" : "";
    }
    if (name === "link") {
      newErrors.link =
        value.trim() === "" ? "Đường dẫn không được để trống" : "";
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

    setErrors(newErrors);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalArticle({ ...selectedArticle });
    } else {
      handleSaveUpdate();
    }
    setIsEditing(!isEditing);
  };

  // Handle logic update brand
  const handleSaveUpdate = async () => {
    const currentId = selectedArticle.id;
    const updates = {};

    if (selectedArticle.title !== originalArticle?.title)
      updates.title = selectedArticle.title;
    if (selectedArticle.link !== originalArticle?.link)
      updates.link = selectedArticle.link;
    if (selectedArticle.content !== originalArticle?.content)
      updates.content = selectedArticle.content;

    if (Object.values(errors).some((e) => e)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/articles/${currentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
            body: JSON.stringify({
              title: selectedArticle.title,
              image: selectedArticle.image,
              link: selectedArticle.link,
              content: selectedArticle.content,
              authorName: localStorage.getItem("fullName"),
            }),
          }
        );

        if (response.ok) {
          toast.success("Cập nhật bài viết thành công!");
          handleCloseModal();
          refreshArticle?.();
        } else {
          toast.error("Lỗi khi cập nhật bài viết!");
        }
      } catch (err) {
        toast.error("Lỗi hệ thống: " + err.message);
      }
    } else {
      toast.info("Không có thay đổi nào.");
      handleCloseModal();
    }
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(to right, #42a5f5, #1976d2)",
            color: "white",
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Thông tin bài viết
          </Typography>

          <Button
            onClick={handleCloseModal}
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
              },
            }}
          >
            <CloseIcon />
            Đóng
          </Button>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3, overflowY: "auto", maxHeight: "70vh" }}>
          {selectedArticle && (
            <>
              {isEditing ? (
                <>
                  <InputRow
                    label="Tiêu đề"
                    name="title"
                    value={selectedArticle.title}
                    onChange={handleChange}
                    error={errors.title}
                    helperText={errors.title}
                  />

                  <InputImageRow
                    label="Hình ảnh"
                    imageUrl={selectedArticle.image}
                    onUpload={(e) =>
                      handleImageUpload(e, (imgUrl) => {
                        setSelectedArticle((prev) => ({
                          ...prev,
                          image: imgUrl,
                        }));
                      })
                    }
                  />

                  <InputRow
                    label="Nội dung"
                    name="content"
                    value={selectedArticle.content || ""}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                  />

                  <InputRow
                    label="Đường dẫn"
                    name="link"
                    value={selectedArticle.link || ""}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                  />
                </>
              ) : (
                <>
                  {/* Display mode */}
                  <InfoRow label="Tiêu đề" value={selectedArticle.title} />
                  <InfoRow
                    label="Hình ảnh"
                    value={selectedArticle.image}
                    isImage
                  />
                  <InfoRow label="Nội dung" value={selectedArticle.content} />
                  <InfoRow label="Đường dẫn" value={selectedArticle.link} />

                  <InfoRow
                    label="Người thêm"
                    value={selectedArticle.authorName}
                  />
                  <InfoRow
                    label="Ngày thêm"
                    value={`${formatDate(
                      selectedArticle.createdDate.split("T")[0]
                    )} | ${formatTime(selectedArticle.createdDate)}`}
                  />
                </>
              )}

              {/* Footer */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
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
                  onClick={handleEditToggle}
                >
                  <UpdateIcon sx={{ mr: 1 }} />
                  {isEditing ? "Lưu" : "Cập Nhật"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateArticle;
