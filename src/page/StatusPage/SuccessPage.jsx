import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/profile-user");
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
        <CheckCircleOutlineIcon
          sx={{ fontSize: 80, color: "#4caf50", mb: 2 }}
        />

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color="success.main"
        >
          Thanh toán thành công
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Cảm ơn Ba/mẹ đã lựa chọn mua hàng tại <strong>LunaMilk</strong> 💖
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleBackHome}
            sx={{
              bgcolor: "#e91e63",
              fontWeight: 600,
              px: 3,
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

          <Button
            variant="outlined"
            onClick={() => {
              navigate("/profile-user/userorder");
              handleViewOrders;
            }}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "25px",
              borderColor: "#e91e63",
              color: "#e91e63",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#fce4ec",
                borderColor: "#d81b60",
              },
            }}
          >
            Theo dõi đơn hàng
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SuccessPage;
