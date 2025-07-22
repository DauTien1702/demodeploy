import { useEffect, useState } from "react";
import ProductCard from "../../component/ProductCard/ProductCard";
import Pagination from "@mui/material/Pagination";
import FilterSidebar from "../../component/FilterSidebar/FilterSidebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setSearchResults,
  setSearchTerm,
} from "../../state/searchProduct/searchSlice";

const AllMilkPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOption, setSortOption] = useState("");

  // Redux
  const dispatch = useDispatch();
  const { searchResults, searchTerm } = useSelector((state) => state.search);

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
          setProducts(data);
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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedBrand(null);
    setSelectedPriceRange(null);
    setSortOption("");
    setPage(1);

    dispatch(setSearchResults([]));
    dispatch(setSearchTerm(""));
  };

  // User searchTerm/searchResults to display data
  let filteredProducts;
  if (searchTerm) {
    filteredProducts = [...searchResults];
  } else {
    filteredProducts = [...products];
  }

  if (selectedBrand) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brandName === selectedBrand
    );
  }
  if (selectedPriceRange) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    );
  }

  if (sortOption === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination
  const itemsPerPage = 12;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="max-w-screen-xl mx-auto px-5 py-8">
      <h1 className="text-4xl font-bold text-[#F75385] mb-6">
        Tất cả sản phẩm sữa
      </h1>

      {(selectedBrand || sortOption) && (
        <div className="mb-4 flex items-center flex-wrap gap-2">
          {selectedBrand && (
            <span className="inline-flex items-center bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm max-w-fit">
              Thương hiệu: {selectedBrand}
            </span>
          )}
          {sortOption && (
            <span className="inline-flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm max-w-fit">
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

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="md:w-1/4 w-full">
            <FilterSidebar
              selectedBrand={selectedBrand}
              sortOption={sortOption}
              selectedPriceRange={selectedPriceRange}
              onSelectBrand={(brand) => {
                setSelectedBrand(brand);
                setPage(1);
              }}
              onSelectPriceRange={(range) => {
                setSelectedPriceRange(range);
                setPage(1);
              }}
            />
          </div>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              searchTerm ? (
                <p className="text-gray-500">
                  Không tìm thấy sản phẩm phù hợp.
                </p>
              ) : (
                <p className="text-gray-500">Không có sản phẩm nào.</p>
              )
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <select
                    className="border border-gray-300 px-3 py-2 text-sm rounded"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="">-- Sắp xếp theo --</option>
                    <option value="priceLowHigh">Giá: thấp đến cao</option>
                    <option value="priceHighLow">Giá: cao đến thấp</option>
                  </select>
                </div>

                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
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
      )}
    </div>
  );
};

export default AllMilkPage;
