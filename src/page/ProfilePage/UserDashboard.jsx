import { Outlet } from "react-router-dom";
import UserSideBar from "./UserSideBar";
import { Box, Divider } from "@mui/material";

const UserInformation = () => {
  return (
    <Box sx={{ display: "flex", maxHeight: "500vh", bgcolor: "#fff" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          px: 2,
          py: 3,
          borderRight: "1px solid #ddd",
        }}
      >
        <UserSideBar />
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserInformation;
