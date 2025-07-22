import { Box, Button, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InfoRow, InputImageRow, InputRow } from "../../../../utils/updateForm";
import { handleImageUpload } from "../../../../utils/uploadImage";

const UpdateBrand = ({ open, brand, handleClose, refreshBrands }) => {
  const token = localStorage.getItem("sessionToken");

  //State
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(brand);
  const [originalBrand, setOriginalBrand] = useState(null);

  useEffect(() => {
    if (brand) {
      setSelectedBrand(brand);
    }
  }, [brand]);

  const handleCloseModal = () => {
    handleClose();
    setIsEditing(false);
    setSelectedBrand(brand);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedBrand((prev) => ({
      ...prev,
      [name]: value,
    }));

    const newErrors = { ...errors };
    if (name === "name") {
      newErrors.name =
        value.trim() === "" ? "Tên thương hiệu không được để trống" : "";
    }
    if (name === "image") {
      newErrors.image =
        value.trim() === "" ? "Link ảnh không được để trống" : "";
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

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalBrand({ ...selectedBrand });
    } else {
      handleSaveUpdate();
    }
    setIsEditing(!isEditing);
  };

  // Handle logic update brand
  const handleSaveUpdate = async () => {
    const currentId = selectedBrand.id;
    const updates = {};

    if (selectedBrand.name !== originalBrand?.name)
      updates.name = selectedBrand.name;
    if (selectedBrand.image !== originalBrand?.image)
      updates.image = selectedBrand.image;
    if (selectedBrand.description !== originalBrand?.description)
      updates.description = selectedBrand.description;

    if (Object.values(errors).some((e) => e)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/brands/${currentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
            body: JSON.stringify({
              name: selectedBrand.name,
              image: selectedBrand.image,
              description: selectedBrand.description,
            }),
          }
        );

        if (response.ok) {
          toast.success("Cập nhật thương hiệu thành công!");
          handleCloseModal();
          refreshBrands?.();
        } else {
          toast.error("Lỗi khi cập nhật thương hiệu!");
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
            <BrandingWatermarkIcon sx={{ mr: 1 }} />
            Thông tin thương hiệu
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
          {selectedBrand && (
            <>
              {isEditing ? (
                <>
                  {/* Edit mode */}
                  <InputRow
                    label="Tên thương hiệu"
                    name="name"
                    value={selectedBrand.name}
                    onChange={handleChange}
                    error={errors.name}
                    helperText={errors.name}
                  />
                  <InputImageRow
                    label="Hình ảnh"
                    imageUrl={selectedBrand.image}
                    onUpload={(e) =>
                      handleImageUpload(e, (imgUrl) => {
                        setSelectedBrand((prev) => ({
                          ...prev,
                          image: imgUrl,
                        }));
                      })
                    }
                  />
                  <InputRow
                    label="Mô tả"
                    name="description"
                    value={selectedBrand.description || ""}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                  />
                </>
              ) : (
                <>
                  {/* Display mode */}
                  <InfoRow label="Tên nhãn hiệu" value={selectedBrand.name} />
                  <InfoRow
                    label="Hình ảnh"
                    value={selectedBrand.image}
                    isImage
                  />
                  <InfoRow label="Mô tả" value={selectedBrand.description} />
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

export default UpdateBrand;
