import { Box, Button, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import UpdateIcon from "@mui/icons-material/Update";
import DescriptionIcon from "@mui/icons-material/Description";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InfoRow, InputRow } from "../../../../utils/updateForm";

const UpdateCategory = ({ open, category, handleClose, refreshCategories }) => {
  const token = localStorage.getItem("sessionToken");

  //State
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originalCategory, setOriginalCategory] = useState(null);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const handleCloseModal = () => {
    handleClose();
    setIsEditing(false);
    setSelectedCategory(category);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedCategory((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));

    const newErrors = { ...errors };
    if (name === "name") {
      newErrors.name =
        value.trim() === "" ? "Tên danh mục không được để trống" : "";
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

  // Handle btn edit
  const handleEditToggle = () => {
    //First time click btn: If click in update go into edit mode (save data berfore changes)
    if (!isEditing) {
      setOriginalCategory({ ...selectedCategory });
    } else {
      // Second time click btn:
      handleSaveUpdate();
    }
    setIsEditing(!isEditing);
  };

  // Handle logic update category
  const handleSaveUpdate = async () => {
    const updates = {};

    if (selectedCategory.name !== originalCategory.name) {
      updates.name = selectedCategory.name;
    }
    if (selectedCategory.description !== originalCategory.description) {
      updates.description = selectedCategory.description;
    }
    if (selectedCategory.delete !== originalCategory.delete) {
      updates.delete = selectedCategory.delete;
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/categories/${selectedCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: selectedCategory.name,
              description: selectedCategory.description,
            }),
          }
        );

        if (response.ok) {
          toast.success("Cập nhật danh mục thành công!");
          handleCloseModal();
          refreshCategories?.();
        } else {
          toast.error("Lỗi khi cập nhật danh mục!");
        }
      } catch (err) {
        toast.error("Lỗi hệ thống: " + err.message);
      }
    } else {
      toast.info("Không có thay đổi nào");
      handleCloseModal();
    }
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          width: 550,
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
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
            <CategoryIcon sx={{ mr: 1 }} />
            Thông tin danh mục
          </Typography>

          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
          >
            Đóng
          </Button>
        </Box>

        {/* Body */}
        <Box component="dl" sx={{ p: 2 }}>
          {isEditing ? (
            <>
              {/* Edit mode */}
              <InputRow
                icon={<CategoryIcon />}
                label="Tên danh mục"
                name="name"
                onChange={handleChange}
                value={selectedCategory.name}
                error={errors.name}
                helperText={errors.name}
              />
              <InputRow
                icon={<DescriptionIcon />}
                label="Mô tả"
                name="description"
                value={selectedCategory.description}
                onChange={handleChange}
                error={errors.description}
                helperText={errors.description}
              />
            </>
          ) : (
            <>
              {/* Display mode */}
              <InfoRow
                icon={<CategoryIcon />}
                label="Tên danh mục"
                value={selectedCategory?.name}
              />
              <InfoRow
                icon={<DescriptionIcon />}
                label="Mô tả"
                value={selectedCategory?.description}
              />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<UpdateIcon />}
            onClick={handleEditToggle}
          >
            {isEditing ? "Lưu" : "Cập Nhật"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateCategory;
