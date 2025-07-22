import { Box, Typography, Button, Paper } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useNavigate } from "react-router-dom";

const FailedPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fdf6f9",
        px: 2,
        mt: 2,
        mb: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          maxWidth: 500,
          width: "100%",
          background: "white",
        }}
      >
        <CancelOutlinedIcon sx={{ fontSize: 80, color: "#f44336", mb: 2 }} />

        <Typography variant="h4" fontWeight="bold" gutterBottom color="error">
          Thanh toán thất bại
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Rất tiếc! Đã có lỗi xảy ra trong quá trình thanh toán. <br />
          Vui lòng thử lại hoặc liên hệ với chúng tôi nếu cần hỗ trợ.
        </Typography>

        <Button
          variant="contained"
          onClick={handleBackHome}
          sx={{
            bgcolor: "#e91e63",
            fontWeight: 600,
            px: 4,
            py: 1,
            borderRadius: "25px",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#d81b60",
            },
          }}
        >
          Quay lại trang chủ
        </Button>
      </Paper>
    </Box>
  );
};

export default FailedPage;
