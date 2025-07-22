import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    const newErrors = { ...errors };

    if (name === "password") {
      newErrors.password = value.length >= 6 ? "" : "Mật khẩu quá ngắn!";
    }
    if (name === "confirmPassword") {
      newErrors.confirmPassword =
        value === password ? "" : "Mật khẩu không khớp!";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/reset-password?token=${token}&newPassword=${password}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        toast.success("Đổi mật khẩu thành công!");
        navigate("/login");
      } else {
        const err = await response.json();
        toast.error(err.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!");
    }
  };

  return (
    <div className="flex items-center justify-center bg-white py-8">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8 mt-4 ">
          Đặt lại mật khẩu
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Mật khẩu mới"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Nhập mật khẩu mới"
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
            value={confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="Xác nhận lại mật khẩu"
            error={errors.confirmPassword}
            icon={{
              visible: showConfirmPassword,
              toggle: () =>
                setShowConfirmPassword((prevVisible) => !prevVisible),
            }}
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-80 mt-5 bg-sky-400 hover:bg-sky-500 text-white py-2 px-4 rounded transition"
            >
              Đặt lại mật khẩu
            </button>
          </div>

          <p className="text-sm text-center mt-2">
            Bạn đã nhớ mật khẩu?{" "}
            <a href="/login" className="text-red-500 hover:underline">
              Quay lại đăng nhập
            </a>
          </p>
        </form>
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
    <label className="font-medium min-w-[140px] ">{label}:</label>
    <div className="ml-auto">
      <TextField
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
          maxWidth: 380,
          input: {
            fontSize: 14,
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

export default ResetPasswordPage;
