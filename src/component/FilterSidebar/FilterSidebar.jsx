import React, { useEffect, useState } from "react";

const priceRanges = [
  { label: "Giá dưới 100.000đ", min: 0, max: 100000 },
  { label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
  { label: "200.000đ - 300.000đ", min: 200000, max: 300000 },
  { label: "300.000đ - 500.000đ", min: 300000, max: 500000 },
  { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  { label: "1.000.000đ - 2.000.000đ", min: 1000000, max: 2000000 },
  { label: "Giá trên 2.000.000đ", min: 2000000, max: Infinity },
];

const FilterSidebar = ({
  selectedBrand,
  onSelectBrand,
  selectedPriceRange,
  onSelectPriceRange,
}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      const token = localStorage.getItem("sessionToken");
      try {
        const res = await fetch("http://localhost:8080/api/brands/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setBrands(data);
        } else {
          console.error("Không thể lấy danh sách thương hiệu");
        }
      } catch (err) {
        console.error("Lỗi kết nối API brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="w-full md:w-64 border p-4 rounded shadow-sm bg-white">
      <h3 className="font-semibold mb-3 text-gray-700">Thương hiệu</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : brands.length === 0 ? (
        <p className="text-sm text-gray-500">Không có thương hiệu.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                className={`text-sm w-full text-left px-2 py-1 rounded transition ${
                  selectedBrand === brand.name
                    ? "bg-pink-100 text-pink-600 font-medium"
                    : "text-gray-700 hover:bg-pink-50"
                }`}
                onClick={() =>
                  onSelectBrand(
                    selectedBrand === brand.name ? null : brand.name
                  )
                }
              >
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className="font-semibold mb-3 text-gray-700">Mức giá</h3>
      <ul className="space-y-2 mb-6">
        {priceRanges.map((range, idx) => {
          const isSelected =
            selectedPriceRange &&
            selectedPriceRange.min === range.min &&
            selectedPriceRange.max === range.max;

          return (
            <li key={idx}>
              <label className="flex items-center text-sm text-gray-700 hover:text-pink-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isSelected}
                  onChange={() => onSelectPriceRange(isSelected ? null : range)}
                />

                {range.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterSidebar;
