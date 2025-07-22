import { Box, Avatar, Typography, Button, Paper, TextField } from "@mui/material";
import BackToDashboardButton from "../../utils/backToDashboardBtn";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const token = localStorage.getItem("sessionToken");
  const customerId = localStorage.getItem("id"); 
  const initialFullName = localStorage.getItem("fullName");
  const initialEmail = localStorage.getItem("username");
  const initialPhone = localStorage.getItem("phone");
  const role = localStorage.getItem("roles");

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: initialFullName,
    username: initialEmail,
    phone: initialPhone,
  });
  const [originalInfo, setOriginalInfo] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUserInfo({
      fullName: initialFullName,
      username: initialEmail,
      phone: initialPhone,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    let newErrors = { ...errors };
    if (name === "phone") {
      const phoneRegex = /^(84|0[3|5|7|8|9])\d{8}$/;
      newErrors.phone = phoneRegex.test(value) ? "" : "Số điện thoại không hợp lệ!";
    }

    setErrors(newErrors);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalInfo(userInfo);
    } else {
      handleSaveUpdate();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveUpdate = async () => {
    const updates = {};

    if (userInfo.fullName !== originalInfo.fullName) {
      updates.fullName = userInfo.fullName;
    }

    if (userInfo.phone !== originalInfo.phone) {
      updates.phone = userInfo.phone;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(`http://localhost:8080/api/customer/${customerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: userInfo.fullName,
            phone: userInfo.phone,
            roles: role || "ADMIN",
            status: true,
          }),
        });

        if (response.ok) {
          toast.success("Cập nhật thành công");
          localStorage.setItem("fullName", userInfo.fullName);
          localStorage.setItem("phone", userInfo.phone);
          setOriginalInfo(userInfo);
        } else {
          toast.error("Cập nhật thất bại!");
        }
      } catch (err) {
        toast.error("Lỗi khi cập nhật thông tin");
      }
    } else {
      toast.info("Không có thay đổi nào.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#eaf6ff", position: "relative" }}>
      <Box sx={{ position: "absolute", top: 2, left: 10 }}>
        <BackToDashboardButton />
      </Box>

      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: 400 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar alt="Admin Avatar" src="/assets/admin-avatar.jpg" sx={{ width: 100, height: 100, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              {userInfo.fullName}
            </Typography>

            <Box sx={{ alignSelf: "flex-start", mt: 1, width: "100%" }}>
              {isEditing ? (
                <>
                  <TextField
                    label="Tên đầy đủ"
                    name="fullName"
                    fullWidth
                    value={userInfo.fullName}
                    onChange={handleChange}
                    margin="dense"
                  />
                  <TextField
                    label="Email"
                    name="username"
                    fullWidth
                    value={userInfo.username}
                    disabled
                    margin="dense"
                  />
                  <TextField
                    label="Số điện thoại"
                    name="phone"
                    fullWidth
                    value={userInfo.phone}
                    onChange={handleChange}
                    margin="dense"
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </>
              ) : (
                <>
                  <Typography gutterBottom>Email: {userInfo.username}</Typography>
                  <Typography gutterBottom>Điện thoại: {userInfo.phone}</Typography>
                </>
              )}

              <Typography gutterBottom>Vai trò: {role}</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button variant="contained" color="secondary" onClick={handleEditToggle}>
                {isEditing ? "Lưu" : "Chỉnh sửa thông tin"}
              </Button>
              {isEditing && (
                <Button variant="outlined" color="primary" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminProfile;
