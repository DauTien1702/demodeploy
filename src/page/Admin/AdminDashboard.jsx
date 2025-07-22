import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const AdminDashboard = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <AdminSidebar />

      <div style={{ flexGrow: 1, height: "100vh" }}>
        <Outlet /> {/* Render child route */}
      </div>
    </div>
  );
};

export default AdminDashboard;
