import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatMoney } from "../../utils/formatMoney";
import { Image } from "antd";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("sessionToken");
  const userId = localStorage.getItem("id");
  const [fullName, setFullName] = useState(
    localStorage.getItem("fullName") || ""
  );
  const [email, setEmail] = useState(localStorage.getItem("username") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");

  // State
  const [cartData, setCartData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [usePoint, setUsePoint] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [errors, setErrors] = useState({
    fullName: false,
    phone: false,
    street: false,
    province: false,
    district: false,
    ward: false,
  });

  const [address, setAddress] = useState({
    province: "",
    provinceCode: "",
    district: "",
    districtCode: "",
    ward: "",
    wardCode: "",
    street: "",
  });

  // Get cart
  const getCart = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartData(data);
      }
    } catch (err) {
      toast.error("Lỗi khi tải giỏ hàng");
    }
  };

  // Get user points
  const getPoint = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/${userId}/loyalty-point`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPointData(data);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy điểm của người dùng");
    }
  };

  // Lấy tỉnh/thành
  const getProvinces = async () => {
    const res = await fetch("http://provinces.open-api.vn/api/p/");
    const data = await res.json();
    setProvinces(data);
  };

  const getDistricts = async (provinceCode) => {
    const res = await fetch(
      `http://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    const data = await res.json();
    setDistricts(data.districts);
  };

  const getWards = async (districtCode) => {
    const res = await fetch(
      `http://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    const data = await res.json();
    setWards(data.wards);
  };

  useEffect(() => {
    getProvinces();
    if (token) {
      getCart();
      getPoint();
    }
  }, []);

  const handleChangeProvince = (e) => {
    const selected = provinces.find((p) => p.code === e.target.value);
    setAddress({
      ...address,
      province: selected.name,
      provinceCode: selected.code,
      district: "",
      districtCode: "",
      ward: "",
      wardCode: "",
    });
    getDistricts(selected.code);
    setWards([]);
  };

  const handleChangeDistrict = (e) => {
    const selected = districts.find((d) => d.code === e.target.value);
    setAddress({
      ...address,
      district: selected.name,
      districtCode: selected.code,
      ward: "",
      wardCode: "",
    });
    getWards(selected.code);
  };

  const handleChangeWard = (e) => {
    const selected = wards.find((w) => w.code === e.target.value);
    setAddress({
      ...address,
      ward: selected.name,
      wardCode: selected.code,
    });
  };

  // Create order
  const handleSubmitOrder = async () => {
    const { province, district, ward, street } = address;

    const newErrors = {
      fullName: !fullName.trim(),
      phone: !phone.trim(),
      street: !street.trim(),
      province: !province,
      district: !district,
      ward: !ward,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const fullAddress = `${street}, ${ward}, ${district}, ${province}`;

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/place/${userId}?address=${encodeURIComponent(
          fullAddress
        )}&usePoints=${usePoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.ok) {
        const data = await response.json();

        window.dispatchEvent(new Event("cart-updated"));
        navigate(`/payment/${data.id}`);
      } else {
        toast.error("Lỗi khi tiến hành thanh toán");
      }
    } catch (error) {
      console.error("Xảy ra lỗi khi tạo đơn hàng: ", error);
    }
  };

  console.log(pointData);

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" gap={4} p={4}>
        {/* Left form */}
        <Box
          flex={1}
          sx={{
            p: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            🧾 Thông tin giao hàng
          </Typography>

          <Box display="grid" gap={2}>
            <TextField
              disabled
              label="Họ và tên"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  fullName: !e.target.value.trim(),
                }));
              }}
              error={errors.fullName}
              helperText={errors.fullName ? "Vui lòng nhập họ tên" : ""}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                disabled
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                disabled
                label="Số điện thoại"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    phone: !e.target.value.trim(),
                  }));
                }}
                error={errors.phone}
                helperText={
                  errors.phone ? "Số điện thoại không được trống" : ""
                }
                fullWidth
              />
            </Box>

            <TextField
              label="Địa chỉ cụ thể (số nhà, tên đường...)"
              value={address.street}
              onChange={(e) => {
                const val = e.target.value;
                setAddress({ ...address, street: val });
                setErrors((prev) => ({
                  ...prev,
                  street: !val.trim(),
                }));
              }}
              error={errors.street}
              helperText={errors.street ? "Địa chỉ không được trống" : ""}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                sx={{ maxWidth: "300px" }}
                select
                label="Tỉnh / thành"
                value={address.provinceCode}
                onChange={(e) => {
                  handleChangeProvince(e);
                  setErrors((prev) => ({ ...prev, province: !e.target.value }));
                }}
                error={errors.province}
                helperText={errors.province ? "Vui lòng chọn tỉnh thành" : ""}
                fullWidth
              >
                {provinces.map((prov) => (
                  <MenuItem key={prov.code} value={prov.code}>
                    {prov.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                sx={{ maxWidth: "300px" }}
                select
                label="Quận / huyện"
                value={address.districtCode}
                onChange={(e) => {
                  handleChangeDistrict(e);
                  setErrors((prev) => ({ ...prev, district: !e.target.value }));
                }}
                onClick={() => {
                  if (!address.provinceCode) {
                    toast.error("Vui lòng chọn tỉnh/thành trước");
                  }
                }}
                disabled={!address.provinceCode || !districts.length}
                error={errors.district}
                helperText={
                  !address.provinceCode
                    ? "Chọn tỉnh/thành trước"
                    : errors.district
                    ? "Vui lòng chọn quận huyện"
                    : ""
                }
                fullWidth
              >
                {districts.map((d) => (
                  <MenuItem key={d.code} value={d.code}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                sx={{ maxWidth: "300px" }}
                select
                label="Phường / xã"
                value={address.wardCode}
                onChange={(e) => {
                  handleChangeWard(e);
                  setErrors((prev) => ({ ...prev, ward: !e.target.value }));
                }}
                onClick={() => {
                  if (!address.districtCode) {
                    toast.error("Vui lòng chọn quận/huyện trước");
                  }
                }}
                disabled={!address.districtCode || !wards.length}
                error={errors.ward}
                helperText={
                  !address.districtCode
                    ? "Chọn quận/huyện trước"
                    : errors.ward
                    ? "Vui lòng chọn phường xã"
                    : ""
                }
                fullWidth
              >
                {wards.map((w) => (
                  <MenuItem key={w.code} value={w.code}>
                    {w.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => navigate("/cart")}
              >
                ← Quay lại giỏ hàng
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSubmitOrder}
              >
                Tiếp tục thanh toán →
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right form */}
        <Box
          flex={1}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 3,
            backgroundColor: "#f9f9f9",
            height: "100",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Thông tin đơn hàng
          </Typography>

          <Table
            size="small"
            sx={{
              border: "1px solid #ddd",
              "& th": { backgroundColor: "#f5f5f5", fontWeight: "bold" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {cartData?.cartItems?.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    borderBottom:
                      index === cartData.cartItems.length - 1
                        ? "none"
                        : "1px solid #eee",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Image
                      src={item.image}
                      alt={item.productName}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell align="right">
                    {formatMoney(item.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box
            mt={10}
            p={2}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              border: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {pointData > 0 && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={usePoint}
                    onChange={(e) => setUsePoint(e.target.checked)}
                  />
                }
                label={`Bạn có muốn sử dụng ${
                  pointData?.point || 0
                } điểm tích luỹ không?`}
              />
            )}

            <Typography variant="h6">
              <strong>Tổng cộng:</strong>{" "}
              <span style={{ color: "#1976d2" }}>
                {formatMoney(cartData?.totalPrice || 0)}
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
