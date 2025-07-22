import { useEffect, useState } from "react";
import { Box, Typography, Card, Grid, Divider } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatMoney } from "../../utils/formatMoney";
import PersonIcon from "@mui/icons-material/Person";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDateTime";

const months = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function DashboardOverview() {
  const token = localStorage.getItem("sessionToken");
  const navigate = useNavigate();

  // Chart data
  const revenueByMonth = Array(12).fill(0);
  const dailyRevenue = {};

  // State
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [feedbacksData, setFeedbacksData] = useState([]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductQuantity, setTotalProductQuantity] = useState([0]);
  const [totalCustomer, setTotalCustomer] = useState(0);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders`, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.ok) {
          const data = await response.json();
          setOrdersData(data);
        }
      } catch (err) {
        console.error("Lỗi tải đơn hàng: ", err);
      }
    };

    const getProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/getAll`,
          {
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (response?.ok) {
          const data = await response.json();
          setProductsData(data);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm: ", err);
      }
    };

    const getUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/user`, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.ok) {
          const data = await response.json();
          setUsersData(data);
        }
      } catch (error) {
        console.error("Lỗi tải người dùng: ", err);
      }
    };

    const getBrands = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/brands/getAll`,
          {
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (response?.ok) {
          const data = await response.json();
          setBrandsData(data);
        }
      } catch (error) {
        console.error("Lỗi tải thương hiệu: ", err);
      }
    };

    const getFeedbacks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/feedbacks/getAll`,
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.ok) {
          const data = await response.json();
          setFeedbacksData(data);
        }
      } catch (error) {
        console.error("Lỗi tải đánh giá: ", err);
      }
    };

    getOrders();
    getProducts();
    getUsers();
    getBrands();
    getFeedbacks();
  }, []);

  useEffect(() => {
    // Order
    if (ordersData && ordersData.length > 0) {
      const total = ordersData.reduce((acc, cur) => {
        return acc + cur.totalAmount;
      }, 0);
      setTotalRevenue(total);
    }

    // Product
    if (productsData && productsData.length > 0) {
      const total = productsData.reduce((acc, cur) => {
        return acc + cur.quantity;
      }, 0);
      setTotalProductQuantity(total);
    }

    // User
    if (usersData && usersData.length > 0) {
      const filter = usersData.filter((item) => {
        return item.roles === "CUSTOMER";
      });

      setTotalCustomer(filter);
    }
  }, [ordersData, productsData, usersData, brandsData]);

  // Logic calculate data of chart by month
  ordersData.forEach((order) => {
    const orderMonth = dayjs(order.orderDate).month();
    revenueByMonth[orderMonth] += order.totalAmount;
  });

  // Logic calculate data of chart by date
  ordersData.forEach((order) => {
    const day = formatDate(order.orderDate);

    if (!dailyRevenue[day]) {
      dailyRevenue[day] = 0;
    }
    dailyRevenue[day] += order.totalAmount || 0;
  });

  const chartLabels = Object.keys(dailyRevenue).sort();
  const chartValues = chartLabels.map((date) => dailyRevenue[date]);

  // console.log(revenueByMonth);
  // console.log(dailyRevenue);

  const stats = [
    {
      icon: <TimelineIcon fontSize="large" sx={{ color: "#1976d2" }} />,
      label: "Tổng doanh thu",
      value: `${formatMoney(totalRevenue)}`,
    },
    {
      icon: <PointOfSaleIcon fontSize="large" sx={{ color: "#388e3c" }} />,
      label: "Tổng sản phẩm",
      value: `${productsData.length || 0} Sản phẩm`,
      link: "/dashboard/productlist",
    },
    {
      icon: <Inventory2Icon fontSize="large" sx={{ color: "#f57c00" }} />,
      label: "Tổng sản phẩm trong kho",
      value: `${totalProductQuantity} Sản phẩm`,
      link: "/dashboard/productlist",
    },
    {
      icon: <CreditScoreIcon fontSize="large" sx={{ color: "#7b1fa2" }} />,
      label: "Tổng đơn hàng",
      value: `${ordersData.length || 0} Đơn`,
      link: "/dashboard/orderlist",
    },
    {
      icon: <CreditScoreIcon fontSize="large" sx={{ color: "#f57c00" }} />,
      label: "Tổng đơn đặt trước",
      value: `${0} Đơn`,
    },
    {
      icon: <PersonIcon fontSize="large" sx={{ color: "#d32f2f" }} />,
      label: "Số lượng khách hàng",
      value: `${totalCustomer.length || 0} Người`,
    },
    {
      icon: (
        <BrandingWatermarkIcon fontSize="large" sx={{ color: "#0288d1" }} />
      ),
      label: "Số lượng thương hiệu",
      value: `${brandsData.length || 0} Thương hiệu`,
      link: "/dashboard/brandlist",
    },
    {
      icon: <ChatIcon fontSize="large" sx={{ color: "#c2185b" }} />,
      label: "Số lượt đánh giá",
      value: `${feedbacksData.length || 0} Đánh giá`,
      link: "/dashboard/feedbacklist",
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        p: 5,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Tổng quan
      </Typography>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              onClick={() => navigate(stat.link)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: "white",
                height: "100%",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                },
              }}
            >
              <Box sx={{ mr: 1 }}>{stat.icon}</Box>
              <Box textAlign="right">
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  {stat.label}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Daily */}
      <Box mt={6}>
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "white",
            mt: 4,
            maxWidth: 600,
            maxHeight: 400,
            mx: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Doanh thu theo ngày
          </Typography>

          {/* Chart */}
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: chartLabels,
                label: "Ngày",
                tickLabelAngle: -45,
              },
            ]}
            series={[
              {
                data: chartValues,
                label: "Doanh thu (VNĐ)",
                color: "#1976d2",
                barThickness: 20,
              },
            ]}
            width={400}
            height={400}
            margin={{ top: 20, bottom: 120, left: 80, right: 40 }}
          />
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Month */}
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "white",
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Doanh thu theo tháng
        </Typography>

        {/* Chart */}
        <BarChart
          xAxis={[{ scaleType: "band", data: months }]}
          series={[
            {
              data: revenueByMonth,
              label: "Doanh thu (VNĐ)",
              color: "#1976d2",
            },
          ]}
          width={1000}
          height={400}
        />
      </Card>
    </Box>
  );
}
