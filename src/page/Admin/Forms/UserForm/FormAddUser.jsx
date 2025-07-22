import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { toast } from "react-toastify";
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

const roles = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "STAFF", label: "STAFF" },
];

const AddUser = ({ open, handleClose }) => {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [input, setInput] = useState({
    fullName: "",
    username: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // Function change state of input
  const handleInputChange = (e) => {
    // Name of input, value of input
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });

    let newErrors = { ...errors };

    if (name === "username") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.username = emailRegex.test(value) ? "" : "Email không hợp lệ!";
    }

    if (name === "phone") {
      const phoneRegex = /^(84|0[3|5|7|8|9])\d{8}$/;
      newErrors.phone = phoneRegex.test(value)
        ? ""
        : "Số điện thoại không hợp lệ!";
    }

    if (name === "password") {
      newErrors.password =
        value.length >= 6 ? "" : "Mật khẩu phải có ít nhất 6 ký tự!";
    }

    if (name === "confirmPassword") {
      newErrors.confirmPassword =
        value === input.password ? "" : "Mật khẩu không khớp!";
    }

    setErrors(newErrors);
  };

  //Reset all input when cancel and clods modal
  const handleCancel = () => {
    setInput({
      fullName: "",
      username: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
    handleClose();
    setLoading(false);
    navigate("userlist");
  };

  // Logic submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    if (Object.values(errors).some((error) => error)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(input),
      });

      if (response.ok) {
        toast.success("Tạo người dùng thành công!");

        // Navigate to view users
        setTimeout(() => {
          handleCancel();
          navigate("userlist");
        }, 1000);
      } else {
        toast.error("Lỗi tạo người dùng thất bại");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Tạo người dùng thất bại");
      setLoading(false);
      console.error("Xảy ra lỗi khi tạo người dùng: ", err);
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
              Thêm người dùng
            </Typography>

            {/* Input fields */}
            <Box maxWidth={400} mx="auto">
              {/* Full Name */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Tên đầy đủ"
                name="fullName"
                value={input.fullName}
                onChange={handleInputChange}
                error={errors.fullname}
                helperText={errors.fullname}
              />

              {/* Gmail */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Gmail"
                name="username"
                type="gmail"
                value={input.username}
                onChange={handleInputChange}
                error={errors.username}
                helperText={errors.username}
              />

              {/* Phone */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Số điện thoại"
                name="phone"
                value={input.phone}
                onChange={handleInputChange}
                error={errors.phone}
                helperText={errors.phone}
              />

              {/* Roles */}
              <TextField
                fullWidth
                margin="normal"
                required
                select
                label="Quyền hạn"
                name="role"
                value={input.role}
                onChange={handleInputChange}
              >
                {roles.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </TextField>

              {/* Password */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Mật khẩu"
                name="password"
                type={showPassword ? "text" : "password"}
                value={input.password}
                error={errors.password}
                helperText={errors.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm password */}
              <TextField
                fullWidth
                margin="normal"
                required
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={input.confirmPassword}
                error={errors.confirmPassword}
                helperText={errors.confirmPassword}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                    <span>Đang tạo người dùng...</span>
                  </>
                ) : (
                  "Tạo người dùng"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default AddUser;
