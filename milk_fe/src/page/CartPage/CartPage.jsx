import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatMoney } from "../../utils/formatMoney";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartPage() {
  const token = localStorage.getItem("sessionToken");

  // State
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [cartItemData, setCartItemData] = useState([]);

  // Pagination configuration
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = cartItemData?.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get cart
  const getCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.ok) {
        const data = await response.json();
        setCartData(data);
        setCartItemData(data.cartItems);
      } else {
        toast.error("Lỗi tải giỏ hàng người dùng: ");
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng người dùng: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token]);

  const handleHomepage = () => {
    navigate("/");
  };

  // Logic increase and decrease quantity
  const handleIncrease = async (item) => {
    const currentQuantity = item.quantity;
    const newQuantity = currentQuantity + 1;

    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${item.productId}?quantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.ok) {
        getCart();
      }
    } catch (error) {
      toast.error("Lỗi tăng số lượng:", error);
    }
  };

  const handleDecrease = async (item) => {
    const currentQuantity = item.quantity;
    const newQuantity = currentQuantity - 1;

    if (newQuantity <= 0) {
      await handeDeleteCartItem(item);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${item.productId}?quantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.ok) {
        getCart();
      }
    } catch (error) {
      toast.error("Lỗi giảm số lượng:", error);
    }
  };

  // Logic delete cart item
  const handeDeleteCartItem = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${item.productId}`,
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
        getCart();
      } else {
        toast.error("Xoá sản phẩm thất bại");
      }
    } catch (error) {
      toast.error("Xoá sản phẩm thất bại");
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", gap: 4, alignItems: "stretch" }}>
      {/* Cart Items */}
      <Box sx={{ flex: 2 }}>
        <Button
          onClick={handleHomepage}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Quay lại trang chủ
        </Button>

        <Typography variant="h5" sx={{ mb: 2 }}>
          🛒 Giỏ hàng của bạn
        </Typography>

        {token ? (
          <>
            {/* Token exist */}
            {cartData && cartItemData && cartItemData?.length > 0 ? (
              <>
                {/* Cart Item exist */}
                {paginatedItems.map((item) => {
                  return (
                    <Card
                      key={item.id}
                      sx={{
                        mb: 2,
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          position: "relative",
                        }}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            overflow: "hidden",
                            borderRadius: 1,
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          {/* Product Name */}
                          <Typography fontWeight="bold">
                            {item.productName}
                          </Typography>

                          {/* Product Price: Unit */}
                          <Typography color="text.secondary">
                            Giá mỗi sản phẩm: {formatMoney(item.unitPrice)}
                          </Typography>

                          {/* Product Quantity */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <IconButton size="small">
                              <RemoveIcon
                                onClick={(e) => {
                                  handleDecrease(item);
                                }}
                              />
                            </IconButton>

                            <Typography sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>

                            <IconButton size="small">
                              <AddIcon
                                onClick={(e) => {
                                  handleIncrease(item);
                                }}
                              />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Product Price: Total */}
                        <Typography color="text.secondary">
                          Giá toàn bộ sản phẩm:{" "}
                          <span
                            style={{ fontWeight: "bold", color: "#1976d2" }}
                          >
                            {formatMoney(item.totalPrice)}
                          </span>
                        </Typography>

                        {/* Button delete */}
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                          onClick={() => handeDeleteCartItem(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  );
                })}

                <Pagination
                  count={Math.ceil(cartItemData.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                />
              </>
            ) : (
              // Cart Item dont exist
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <img
                  src="src/assets/img/cart/empty_cart.webp"
                  style={{
                    width: 500,
                    height: 300,
                    marginBottom: 16,
                  }}
                  alt="No Token"
                />
                <Typography color="error" variant="body1">
                  Giỏ hàng trống!
                </Typography>
              </Box>
            )}
          </>
        ) : (
          // Token doesnt exit
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <img
              src="src/assets/img/cart/no_token_cart_banner_image.png"
              style={{ width: 500, height: 300, marginBottom: 16 }}
              alt="No Token"
            />
            <Typography color="error" variant="body1">
              Bạn cần đăng nhập để xem giỏ hàng!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Address and payment */}
      {cartData && cartItemData && cartItemData?.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            p: 3,
            boxShadow: 1,
            mt: 12.2,
            mb: 6,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Địa chỉ giao hàng
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Chưa có địa chỉ giao hàng
          </Typography>

          <Button variant="contained" fullWidth sx={{ mb: 4 }}>
            Nhập địa chỉ
          </Button>

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Tổng cộng
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Tổng đơn hàng:{" "}
            <span style={{ fontWeight: "bold", color: "#1976d2" }}>
              {formatMoney(cartData.totalPrice)}
            </span>
          </Typography>

          <Button variant="contained" color="primary" fullWidth>
            Thanh toán ngay
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}
