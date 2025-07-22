import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import adminLogo from "../../assets/logo/logoluna.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import AddUser from "./Forms/UserForm/FormAddUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "./Forms/ProductForm/FormAddProduct";
import AddCategory from "./Forms/CategoryForm/FormAddCategory";
import AddBrand from "./Forms/BrandForm/FormAddBrand";
import AddArticle from "./Forms/ArticleForm/FormAddArticle";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("roles");

  // State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");

  const [openDropdowns, setOpenDropdowns] = useState({
    users: false,
    products: false,
    categories: false,
    articles: false,
    feedbacks: false,
    brands: false,
    orders: false,
  });

  // Change state of section
  const toggleDropdown = (section) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("roles");
    localStorage.removeItem("address");
    localStorage.removeItem("phone");

    toast.success("Đăng xuất thành công");

    navigate("/");
  };

  // Move between forms and pages
  const renderContent = () => {
    switch (selectedSection) {
      case "addUser":
        return (
          <AddUser
            open={openAddModal}
            handleClose={() => setOpenAddModal(false)}
          />
        );
      case "addProduct":
        return (
          <AddProduct
            open={openAddModal}
            handleClose={() => setOpenAddModal(false)}
          />
        );
      case "addCategory":
        return (
          <AddCategory
            open={openAddModal}
            handleClose={() => setOpenAddModal(false)}
          />
        );
      case "addBrand":
        return (
          <AddBrand
            open={openAddModal}
            handleClose={() => setOpenAddModal(false)}
          />
        );
      case "addArticle":
        return (
          <AddArticle
            open={openAddModal}
            handleClose={() => setOpenAddModal(false)}
          />
        );
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            backgroundColor: "#2F3542",
            color: "#F1F2F6",
            width: 260,
            boxSizing: "border-box",
          },
          "& .MuiListItemButton-root:hover": {
            backgroundColor: "#4C566A",
          },
          "& .MuiListItemIcon-root": {
            color: "#D8DEE9",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            <div className="flex items-center text-xl font-bold mb-4 text-center tracking-wide border-b border-white-700 p-4">
              <img
                style={{
                  width: "30px",
                  height: "40px",
                  marginRight: "10px",
                }}
                src={adminLogo}
              />
              Admin Dashboard
            </div>

            {/* Section of manager */}
            <div className="border-b border-white-700 p-4">
              {/* Overview */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("dashboardoverview")}>
                  <ListItemIcon>
                    <HomeOutlinedIcon sx={{ color: "#00BFA6" }} />
                  </ListItemIcon>
                  <ListItemText primary="Tổng quan" sx={{ color: "white" }} />
                </ListItemButton>
              </ListItem>

              {/* User and dropdown */}
              {role === "ADMIN" && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => toggleDropdown("users")}>
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon sx={{ color: "#FF7043" }} />
                      </ListItemIcon>

                      <ListItemText
                        primary="Người dùng"
                        sx={{ color: "white" }}
                      />
                      {/* Icon arrow */}
                      {openDropdowns.users ? (
                        <ArrowDropDownOutlinedIcon />
                      ) : (
                        <ArrowRightOutlinedIcon />
                      )}
                    </ListItemButton>
                  </ListItem>

                  <Collapse
                    in={openDropdowns.users}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("userlist")}>
                          <PeopleAltOutlinedIcon className="mr-5" />
                          <ListItemText primary="Danh sách người dùng" />
                        </ListItemButton>
                      </ListItem>

                      {role === "ADMIN" && (
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => {
                              setSelectedSection("addUser");
                              navigate("add-user");
                              setOpenAddModal(true);
                            }}
                          >
                            <PersonAddOutlinedIcon className="mr-5" />
                            <ListItemText primary="Thêm người dùng" />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </>
              )}

              {/* Product and dropdown */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleDropdown("products")}>
                  <ListItemIcon>
                    <ShoppingBagOutlinedIcon style={{ color: "#29B6F6" }} />
                  </ListItemIcon>
                  <ListItemText primary="Sản phẩm" sx={{ color: "white" }} />
                  {/* Icon arrow */}
                  {openDropdowns.products ? (
                    <ArrowDropDownOutlinedIcon />
                  ) : (
                    <ArrowRightOutlinedIcon />
                  )}
                </ListItemButton>
              </ListItem>

              <Collapse
                in={openDropdowns.products}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("productlist")}>
                      <StoreOutlinedIcon className="mr-5" />
                      <ListItemText primary="Danh sách sản phẩm" />
                    </ListItemButton>
                  </ListItem>

                  {role === "ADMIN" && (
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setSelectedSection("addProduct");
                          navigate("add-product");
                          setOpenAddModal(true);
                        }}
                      >
                        <AddBusinessOutlinedIcon className="mr-5" />
                        <ListItemText primary="Thêm sản phẩm" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Collapse>

              {/* Order, PreOrder and dropdown */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleDropdown("orders")}>
                  <ListItemIcon>
                    <ReceiptLongIcon style={{ color: "#FFCA28" }} />
                  </ListItemIcon>
                  <ListItemText primary="Đơn hàng" sx={{ color: "white" }} />
                  {openDropdowns.orders ? (
                    <ArrowDropDownOutlinedIcon />
                  ) : (
                    <ArrowRightOutlinedIcon />
                  )}
                </ListItemButton>
              </ListItem>

              <Collapse in={openDropdowns.orders} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {role === "ADMIN" && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate("orderlist")}>
                        <ListItemIcon>
                          <ListAltIcon style={{ color: "white" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tất cả đơn hàng"
                          sx={{ color: "white" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}

                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/preorders")}>
                      <ListItemIcon>
                        <BookmarkAddedIcon style={{ color: "white" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Đơn đặt trước"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Category and dropdown */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleDropdown("categories")}>
                  <ListItemIcon>
                    <CategoryOutlinedIcon style={{ color: "#AB47BC" }} />
                  </ListItemIcon>
                  <ListItemText primary="Phân loại" sx={{ color: "white" }} />
                  {/* Icon arrow */}
                  {openDropdowns.categories ? (
                    <ArrowDropDownOutlinedIcon />
                  ) : (
                    <ArrowRightOutlinedIcon />
                  )}
                </ListItemButton>
              </ListItem>

              <Collapse
                in={openDropdowns.categories}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("categorylist")}>
                      <FormatListBulletedOutlinedIcon className="mr-5" />
                      <ListItemText primary="Danh sách phân loại" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        {
                          setSelectedSection("addCategory");
                          setOpenAddModal(true);
                        }
                        navigate("add-category");
                      }}
                    >
                      <LibraryAddOutlinedIcon className="mr-5" />
                      <ListItemText primary="Thêm loại" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Article and dropdown */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleDropdown("articles")}>
                  <ListItemIcon>
                    <AssignmentOutlinedIcon style={{ color: "#66BB6A" }} />
                  </ListItemIcon>

                  <ListItemText primary="Bài viết" sx={{ color: "white" }} />
                  {/* Icon arrow */}
                  {openDropdowns.articles ? (
                    <ArrowDropDownOutlinedIcon />
                  ) : (
                    <ArrowRightOutlinedIcon />
                  )}
                </ListItemButton>
              </ListItem>

              <Collapse
                in={openDropdowns.articles}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("articlelist")}>
                      <ArticleOutlinedIcon className="mr-5" />
                      <ListItemText primary="Danh sách bài viết" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setSelectedSection("addArticle");
                        setOpenAddModal(true);
                        navigate("add-article");
                      }}
                    >
                      <AddCommentOutlinedIcon className="mr-5" />
                      <ListItemText primary="Thêm bài viết" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Brand and dropdown */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleDropdown("brands")}>
                  <ListItemIcon>
                    <BrandingWatermarkIcon style={{ color: "#EC407A" }} />
                  </ListItemIcon>

                  <ListItemText primary="Thương hiệu" sx={{ color: "white" }} />
                  {/* Icon arrow */}
                  {openDropdowns.brands ? (
                    <ArrowDropDownOutlinedIcon />
                  ) : (
                    <ArrowRightOutlinedIcon />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={openDropdowns.brands} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("brandlist")}>
                      <FeaturedPlayListIcon className="mr-5" />
                      <ListItemText primary="Danh sách thương hiệu" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        {
                          setSelectedSection("addBrand");
                          setOpenAddModal(true);
                        }
                        navigate("add-brand");
                      }}
                    >
                      <LibraryAddOutlinedIcon className="mr-5" />
                      <ListItemText primary="Thêm thương hiệu" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Feedback and dropdown */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleDropdown("feedbacks")}>
                  <ListItemIcon>
                    <TextsmsOutlinedIcon style={{ color: "#FFA726" }} />
                  </ListItemIcon>

                  <ListItemText primary="Đánh giá" sx={{ color: "white" }} />
                  {/* Icon arrow */}
                  {openDropdowns.feedbacks ? (
                    <ArrowDropDownOutlinedIcon />
                  ) : (
                    <ArrowRightOutlinedIcon />
                  )}
                </ListItemButton>
              </ListItem>

              <Collapse
                in={openDropdowns.feedbacks}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("feedbacklist")}>
                      <QuestionAnswerOutlinedIcon className="mr-5" />
                      <ListItemText primary="Danh sách đánh giá" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
            </div>

            {/* Section of navigate to homepage */}
            <div className="flex items-center tracking-wider mb-4 text-center border-b border-white-700 p-4">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <KeyboardReturnIcon style={{ color: "#90CAF9" }} />
                  </ListItemIcon>
                  <ListItemText
                    onClick={() => navigate("/")}
                    primary="Đi đến trang chính"
                    sx={{ color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            </div>

            {/* Section of profile */}
            <div className="flex items-center tracking-wider mb-4 text-center border-b border-white-700 p-4">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AssignmentIndIcon style={{ color: "#4DD0E1" }} />
                  </ListItemIcon>
                  <ListItemText
                    onClick={() => navigate("admin-profile")}
                    primary="Thông tin cá nhân"
                    sx={{ color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            </div>

            {/* Section of logout */}
            <div className="flex items-center tracking-wider text-center p-4">
              <ListItem onClick={handleLogout} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon style={{ color: "#EF5350" }} />
                  </ListItemIcon>
                  <ListItemText primary="Đăng xuất" sx={{ color: "white" }} />
                </ListItemButton>
              </ListItem>
            </div>
          </List>
        </Box>
      </Drawer>

      {/* Render */}
      <Box>{renderContent()}</Box>
    </>
  );
};

export default AdminSidebar;
