import { Box, Button, Chip, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  InfoRow,
  InputImageRow,
  InputRow,
  InputSelectRow,
} from "../../../../utils/updateForm";
import { useEffect, useState } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import { formatMoney } from "../../../../utils/formatMoney";
import { toast } from "react-toastify";
import { handleImageUpload } from "../../../../utils/uploadImage";

const UpdateProduct = ({ open, product, handleClose, refreshProducts }) => {
  const userRole = localStorage.getItem("roles");
  const token = localStorage.getItem("sessionToken");

  //State
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(product);
  const [originalProduct, setOriginalProduct] = useState([]);

  // Set data from product into selectedProduct
  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product]);

  const handleCloseModal = () => {
    setErrors({});
    setSelectedProduct(product);
    handleClose();
    setIsEditing(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

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
      newErrors.description =
        value.trim() !== "" ? "" : "Mô tả không được để trống";
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

  // Handle btn edit
  const handleEditToggle = () => {
    //First time click btn: If click in update go into edit mode (save data berfore changes)
    if (!isEditing) {
      setOriginalProduct({ ...selectedProduct });
    } else {
      // Second time click btn:
      handleSaveUpdate();
    }

    setIsEditing(!isEditing);
  };

  // Handle logic update product
  const handleSaveUpdate = async (e) => {
    const currentProductId = selectedProduct.id;
    const updates = {};

    // Check user data change or not
    if (selectedProduct.name !== originalProduct.name) {
      updates.name = selectedProduct.name;
    }
    if (selectedProduct.price !== originalProduct.price) {
      updates.price = selectedProduct.price;
    }
    if (selectedProduct.image !== originalProduct.image) {
      updates.image = selectedProduct.image;
    }
    if (selectedProduct.description !== originalProduct.description) {
      updates.description = selectedProduct.description;
    }
    if (selectedProduct.quantity !== originalProduct.quantity) {
      updates.quantity = selectedProduct.quantity;
    }
    if (selectedProduct.status !== originalProduct.status) {
      updates.status = selectedProduct.status;
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${currentProductId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: selectedProduct.name,
              price: selectedProduct.price,
              description: selectedProduct.description,
              categoryId: selectedProduct.categoryId,
              brandId: selectedProduct.brandId,
              image: selectedProduct.image,
              quantity: selectedProduct.quantity,
              status: selectedProduct.status,
            }),
          }
        );

        if (response.ok) {
          toast.success("Cập nhật thành công");
          handleCloseModal();
          refreshProducts?.();
        }
      } catch (error) {
        toast.error("Lỗi cập nhật sản phẩm: ", error);
      }
    } else {
      toast.info("Không có gì thay đổi");
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
          width: { xs: "95%", sm: 600 },
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 10,
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
            Thông tin sản phẩm
          </Typography>

          <Button
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
            onClick={handleCloseModal}
          >
            <CloseIcon />
            Đóng
          </Button>
        </Box>

        {/* Body */}
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "70vh",
          }}
        >
          {selectedProduct && (
            <Box component="dl" sx={{ p: 2 }}>
              {isEditing ? (
                <>
                  {/* Edit mode */}
                  <InputRow
                    label="Tên"
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleChange}
                  />
                  <InputRow
                    label="Giá"
                    name="price"
                    value={selectedProduct.price}
                    onChange={handleChange}
                    error={errors.price}
                    helperText={errors.price}
                  />
                  <InputImageRow
                    label="Hình ảnh"
                    imageUrl={selectedProduct.image}
                    onUpload={(e) =>
                      handleImageUpload(e, (imgUrl) => {
                        setSelectedProduct((prev) => ({
                          ...prev,
                          image: imgUrl,
                        }));
                      })
                    }
                  />
                  <InputRow
                    label="Mô tả"
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleChange}
                  />
                  <InputRow
                    label="Số lượng"
                    name="quantity"
                    value={selectedProduct.quantity}
                    onChange={handleChange}
                    error={errors.quantity}
                    helperText={errors.quantity}
                  />
                  <InfoRow
                    label="Nhãn hiệu"
                    name="brandId"
                    value={selectedProduct.brandId}
                    onChange={handleChange}
                  />
                  <InfoRow
                    label="Loại sản phẩm"
                    name="categoryId"
                    value={selectedProduct.categoryId}
                    onChange={handleChange}
                  />
                  <InputSelectRow
                    label="Trạng thái"
                    name="status"
                    value={selectedProduct.status}
                    onChange={(e) =>
                      setSelectedProduct((prevProduct) => ({
                        ...prevProduct,
                        status: e.target.value === "true",
                      }))
                    }
                    options={[
                      { label: "Còn hàng", value: "true" },
                      { label: "Hết hàng", value: "false" },
                    ]}
                  />
                </>
              ) : (
                <>
                  {/* Display mode */}
                  <InfoRow label="Tên" value={selectedProduct.name} />
                  <InfoRow
                    label="Giá"
                    value={formatMoney(selectedProduct.price)}
                  />
                  <InfoRow
                    label="Hình ảnh"
                    value={selectedProduct.image}
                    isImage
                  />
                  <InfoRow label="Mô tả" value={selectedProduct.description} />
                  <InfoRow label="Loại" value={selectedProduct.categoryName} />
                  <InfoRow
                    label="Nhãn hiệu"
                    value={selectedProduct.brandName}
                  />
                  <InfoRow label="Số lượng" value={selectedProduct.quantity} />
                  <InfoRow
                    label="Trạng thái"
                    value={
                      <Chip
                        label={product?.status ? "Còn hàng" : "Hết hàng"}
                        color={product?.status ? "success" : "error"}
                        variant="outlined"
                        size="small"
                      />
                    }
                  />
                </>
              )}

              {/* Button */}
              {userRole === "ADMIN" ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <Button
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
                    onClick={handleEditToggle}
                  >
                    <UpdateIcon />
                    {isEditing ? "Lưu" : "Cập Nhật"}
                  </Button>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateProduct;
