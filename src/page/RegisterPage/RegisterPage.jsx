import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    username: "",
    fullName: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        const error = await response.json();
        toast.error(error.message || "Lỗi khi đăng ký!");
      }
    } catch (err) {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md mb-10">
        <h2 className="text-2xl font-bold text-center mb-8 mt-10">
          Đăng ký tài khoản
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Họ và tên"
            name="fullName"
            type="text"
            value={input.fullName}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên"
            error={errors.fullName}
          />
          <InputField
            label="Email"
            name="username"
            type="email"
            value={input.username}
            onChange={handleInputChange}
            placeholder="Nhập email"
            error={errors.username}
          />
          <InputField
            label="Số điện thoại"
            name="phone"
            type="text"
            value={input.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            error={errors.phone}
          />
          <InputField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={input.password}
            onChange={handleInputChange}
            placeholder="Nhập mật khẩu"
            error={errors.password}
            icon={{
              visible: showPassword,
              toggle: () => setShowPassword(!showPassword),
            }}
          />
          <InputField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={input.confirmPassword}
            onChange={handleInputChange}
            placeholder="Xác nhận mật khẩu"
            error={errors.confirmPassword}
            icon={{
              visible: showConfirmPassword,
              toggle: () => setShowConfirmPassword(!showConfirmPassword),
            }}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-80 mt-5 flex items-center justify-center bg-sky-400 hover:bg-sky-500 text-white py-2 px-4 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </div>

          <p className="text-sm text-center mt-2">
            Bạn đã có tài khoản?{" "}
            <a href="/login" className="text-red-500 hover:underline">
              Đăng nhập tại đây
            </a>
          </p>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">
            Hoặc đăng nhập bằng
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full flex items-center justify-center border border-blue-500 rounded py-2 hover:bg-blue-50 transition">
          <span className="flex items-center">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </span>
        </button>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  icon,
}) => (
  <div className="flex items-center space-x-2">
    <label className="font-medium min-w-[120px]">{label}:</label>
    <div className="w-full">
      <TextField
        fullWidth
        size="small"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        error={Boolean(error)}
        helperText={error}
        sx={{
          maxWidth: 360,
          input: {
            fontSize: 14,
            // padding: "8px ",
          },
        }}
        {...(icon && {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={icon.toggle} edge="end" sx={{ p: 0.5 }}>
                  {icon.visible ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        })}
      />
    </div>
  </div>
);

export default RegisterPage;
