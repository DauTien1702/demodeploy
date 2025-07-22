import {
  Link,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserSideBar = () => {
  const fullName = localStorage.getItem("fullName");

  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        TRANG TÀI KHOẢN
      </Typography>

      <Typography>
        Xin chào,{" "}
        <Typography component="span" color="secondary" fontWeight="bold">
          {fullName}
        </Typography>
        !
      </Typography>

      <List sx={{ mt: 2 }}>
        <ListItemButton onClick={() => navigate("useraccount")}>
          <ListItemText primary="Thông tin tài khoản" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("userorder")}>
          <ListItemText primary="Đơn hàng" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Đơn hàng đặt trước" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("userfeedback")}>
          <ListItemText primary="Đánh giá của bạn" />
        </ListItemButton>
      </List>
    </>
  );
};

export default UserSideBar;
