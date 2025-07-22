import PersonIcon from "@mui/icons-material/Person";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();

  // State of input
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  // Show or hide "Forgot Password" form
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  // Function change state of input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  // Logic submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(input),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("sessionToken", data.token);
        localStorage.setItem("id", data.id);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("username", data.username);
        localStorage.setItem("roles", data.roles);
        localStorage.setItem("phone", data.phone);

        window.dispatchEvent(new Event("login-status-changed"));

        if (data.roles === "ADMIN" || data.roles === "STAFF") {
          toast.success("Quản trị viên đăng nhập thành công");
          navigate("/dashboard");
        } else {
          toast.success("Ba mẹ đăng nhập thành công");
          navigate("/");
        }
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (err) {
      toast.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      toast.error("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      const url = `http://localhost:8080/api/request-reset-password?username=${encodeURIComponent(
        forgotEmail
      )}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      });

      if (response.ok) {
        toast.success("Yêu cầu đặt lại mật khẩu đã được gửi qua email!");
        setShowForgotPassword(false);
      } else {
        const error = await response.json();
        toast.error(error.message || "Lỗi khi gửi yêu cầu!");
      }
    } catch (err) {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
      console.error("Xảy ra lỗi khi đăng nhập: ", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md mb-10">
        <h2 className="text-2xl font-bold text-center mb-4 mt-10">
          {showForgotPassword ? "Quên mật khẩu" : "Đăng nhập tài khoản"}
        </h2>

        {/* ===== Form Login===== */}
        {!showForgotPassword && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center">
              <label className="font-medium mr-5 min-w-[105px]">
                <div className="flex item-center">
                  <PersonIcon />
                  Email:
                </div>
              </label>
              <input
                type="email"
                name="username"
                value={input.username}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập email"
              />
            </div>

            <div className="flex items-center">
              <label className="font-medium mr-5 min-w-[105px]">
                <div className="flex item-center">
                  <LockOpenIcon />
                  Mật khẩu:
                </div>
              </label>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-80 mt-5 bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded transition"
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={16}
                      sx={{ color: "white", mr: 1 }}
                    />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>

            <p className="text-sm text-center mb-0">
              Quên mật khẩu?{" "}
              <button
                type="button"
                onClick={toggleForgotPassword}
                className="text-red-500 hover:underline"
              >
                Tại đây
              </button>
            </p>

            <p className="text-sm text-center mt-1 mb-0">
              Bạn chưa có tài khoản?{" "}
              <a href="/register" className="text-red-500 hover:underline">
                Tại đây
              </a>
            </p>
          </form>
        )}

        {/* ===== Form Quên Mật Khẩu ===== */}
        {showForgotPassword && (
          <div className="p-2 rounded">
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Nhập email để khôi phục mật khẩu"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-center">
              <button
                onClick={handleForgotSubmit}
                className="w-80 mt-5 bg-sky-400 hover:bg-sky-500 text-white py-2 px-4 rounded transition"
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={16}
                      sx={{ color: "white", mr: 1 }}
                    />
                    <span>Đang gửi yêu cầu...</span>
                  </>
                ) : (
                  "Gửi yêu cầu"
                )}
              </button>
            </div>
            <p className="text-sm text-center mt-3">
              <button
                type="button"
                onClick={toggleForgotPassword}
                className="text-red-500 hover:underline"
              >
                Quay lại đăng nhập
              </button>
            </p>
          </div>
        )}

        {/* Divider + Google login */}
        {!showForgotPassword && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
