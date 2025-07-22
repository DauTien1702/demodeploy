import React, { useEffect, useState } from "react";
import ProductCard from "../../component/ProductCard/ProductCard";
import Pagination from "@mui/material/Pagination";
import FilterSidebar from "../../component/FilterSidebar/FilterSidebar";

const BabyMilkPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("sessionToken");
      try {
        const res = await fetch("http://localhost:8080/api/products/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter(
            (product) =>
              product.categoryName &&
              product.categoryName.toLowerCase().includes("baby")
          );
          setProducts(filtered);
        } else {
          console.error("Không thể lấy sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleClearFilters = () => {
    setSelectedBrand(null);
    setSelectedPriceRange(null);
    setSortOption("");
    setPage(1);
  };

  // filter by brand
  let filteredProducts = [...products];
  if (selectedBrand) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brandName === selectedBrand
    );
  }

  // filter by price
  if (selectedPriceRange) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    );
  }

  // sort
  if (sortOption === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="max-w-screen-xl mx-auto px-5 py-8">
      <h1 className="text-4xl font-bold text-[#F75385] mb-6">Sữa cho bé</h1>

      {(selectedBrand || sortOption || selectedPriceRange) && (
        <div className="mb-4 flex items-center flex-wrap gap-2">
          {selectedBrand && (
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
              Thương hiệu: {selectedBrand}
            </span>
          )}
          {selectedPriceRange && (
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
              Mức giá: {selectedPriceRange.label}
            </span>
          )}
          {sortOption && (
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              Sắp xếp:{" "}
              {sortOption === "priceLowHigh"
                ? "Giá thấp đến cao"
                : "Giá cao đến thấp"}
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="ml-2 text-sm text-red-500 hover:underline"
          >
            Xoá tất cả bộ lọc
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-6">
        <FilterSidebar
          selectedBrand={selectedBrand}
          onSelectBrand={(brand) => {
            setSelectedBrand(brand);
            setPage(1);
          }}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={(range) => {
            setSelectedPriceRange(range);
            setPage(1);
          }}
          sortOption={sortOption}
          onSortChange={(option) => {
            setSortOption(option);
            setPage(1);
          }}
        />

        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy sản phẩm.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Pagination
                  size="small"
                  shape="rounded"
                  color="primary"
                  count={Math.ceil(filteredProducts.length / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BabyMilkPage;
