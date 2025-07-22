import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserAccount = () => {
  const token = localStorage.getItem("sessionToken");
  const fullName = localStorage.getItem("fullName");
  const username = localStorage.getItem("username");
  const phone = localStorage.getItem("phone");
  const customerId = localStorage.getItem("id");

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    username: "",
    phone: "",
    address: "",
  });

  const [originalUser, setOriginalUser] = useState({});
  const [pointData, setPointData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // Get user points
  const getPoint = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/${customerId}/loyalty-point`,
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

  useEffect(() => {
    getPoint();

    if (!token) {
      toast.error("Vui lòng đăng nhập để xem thông tin!");
      navigate("/login");
      return;
    }

    setUserInfo({
      fullName: fullName || "",
      username: username || "",
      phone: phone || "",
    });

    setOriginalUser({
      fullName: fullName || "",
      phone: phone || "",
    });
  }, [navigate, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "phone") {
      const phoneRegex = /^(84|0[3|5|7|8|9])\d{8}$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: phoneRegex.test(value) ? "" : "Số điện thoại không hợp lệ!",
      }));
    }
  };

  // Handle save update
  const handleSave = async () => {
    const updates = {};

    // Check user data change or not
    if (userInfo.fullName !== originalUser.fullName) {
      updates.fullName = userInfo.fullName;
    }
    if (userInfo.phone !== originalUser.phone) {
      updates.phone = userInfo.phone;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/customer/${customerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...userInfo,
              roles: "CUSTOMER",
              status: true,
            }),
          }
        );

        if (response.ok) {
          toast.success("Cập nhật thành công");

          localStorage.setItem("fullName", userInfo.fullName);
          localStorage.setItem("phone", userInfo.phone);

          setOriginalUser({
            fullName: userInfo.fullName,
            phone: userInfo.phone,
          });

          setIsEditing(false);

          window.dispatchEvent(new Event("login-status-changed"));
        } else {
          toast.error("Cập nhật thất bại");
        }
      } catch (err) {
        toast.error("Lỗi hệ thống khi cập nhật");
      }
    } else {
      toast.info("Không có gì thay đổi");
      setIsEditing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => navigate("/")}
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Quay lại trang chủ
      </Button>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <PersonIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              Thông tin tài khoản
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý và cập nhật thông tin cá nhân
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={userInfo.fullName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="username"
              value={userInfo.username}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              disabled={!isEditing}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Điểm tích luỹ"
              value={pointData ?? ""}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" gap={2}>
          {!isEditing ? (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Cập nhật thông tin
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={handleSave}>
                Lưu thay đổi
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setUserInfo({
                    ...originalUser,
                    username: userInfo.username,
                    address: "",
                  });
                  setIsEditing(false);
                }}
              >
                Hủy
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default UserAccount;
