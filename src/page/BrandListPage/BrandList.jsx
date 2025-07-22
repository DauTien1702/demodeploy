import { Box, Divider, Grid, Pagination, Typography } from "@mui/material";
import { Image } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatMoney } from "../../utils/formatMoney";

export default function BrandList() {
  const { name } = useParams();

  const [productData, setProductData] = useState([]);
  const [brandsdata, setBrandsdata] = useState([]);

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = productData.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Logic call API
  const getProductList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/getAll`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response?.ok) {
        const data = await response.json();

        var productBrand = data.filter(function (item) {
          return item.brandName === name;
        });

        setProductData(productBrand);
      } else {
        toast.error("Lỗi tải danh sách sản phẩm: ");
      }
    } catch (err) {
      toast.error("Lỗi tải danh sách sản phẩm: ", err);
    }
  };

  // Fetch brands
  const getBrandList = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/brands/getAll`, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (response?.ok) {
        const data = await response.json();

        var brand = data.filter(function (item) {
          return item.name.trim().toLowerCase() === name.trim().toLowerCase();
        });

        setBrandsdata(brand);
      } else {
        toast.error("Lỗi tải thương hiệu");
      }
    } catch (err) {
      toast.error("Lỗi tải thương hiệu:", err);
    }
  };

  // Call API when load and page
  useEffect(() => {
    getProductList();
    getBrandList();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* Brand name */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Nhãn hàng sữa {name}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Brand img and description */}
      {brandsdata && brandsdata.length > 0 && (
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Grid item xs={12} md={4}>
            <Image
              width={200}
              style={{
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              src={brandsdata[0].image}
              alt={brandsdata[0].name}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography
              variant="body1"
              sx={{
                textAlign: "justify",
                fontSize: "1rem",
                maxWidth: "900px",
              }}
            >
              {brandsdata[0].description}
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Product */}
      <div className="flex justify-center mb-5">
        <div className="grid grid-cols-5 gap-4 mt-4 place-items-center">
          {paginatedItems.map((product, index) => (
            <div
              key={product.id || index}
              className="w-[200px] text-center rounded-lg p-3 bg-white border-2 border-[#D2D2D2] 
                  hover:scale-105 transition-transform shadow-sm cursor-pointer"
            >
              {/* Product image */}
              <div className="w-full h-[160px] flex items-center justify-center overflow-hidden mb-3">
                <Image
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  src={product.image}
                  alt={product.name}
                />
              </div>

              {/* Product Name */}
              <p className="text-sm font-medium mb-1 h-[40px] line-clamp-2">
                {product.name}
              </p>

              <div className="flex justify-between items-center mt-2">
                <p className="text-red-600 font-bold text-sm">
                  {formatMoney(product.price)}
                </p>
                <button
                  className="text-[#F75385] text-sm font-medium border border-[#F75385] rounded-full px-3 py-1 
                    hover:bg-[#F75385] hover:text-pink-50 transition-colors"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* MUI Pagination Component */}
        <Pagination
          size="small"
          shape="rounded"
          color="primary"
          count={Math.ceil(productData.length / itemsPerPage)} // Total pages
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </Box>
  );
}
