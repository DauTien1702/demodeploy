import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FeaturedBrands() {
  const [brandsdata, setBrandsdata] = useState([]);

  const token = localStorage.getItem("sessionToken");

  // Fetch brands
  const getBrandList = async () => {
    try {
      const response = await fetch (http://localhost:8080/api/brands, {
        method: "GET",
        headers: {
          accept: "/",
          Authorization: Bearer ${token},
        },
      });

      if (response?.ok) {
        const data = await response.json();
        setBrandsdata(data);
      } else {
        toast.error("Lỗi tải thương hiệu");
      }
    } catch (err) {
      toast.error("Lỗi tải thương hiệu:", err);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  return (
    <div className="px-5 py-5 bg-white">
      {/* Title */}
      <h2 className="text-[28px] font-semibold text-[#F75385] ml-[10px] text-left">
        Thương hiệu nổi bật
      </h2>

      {/* Brand Logos Grid */}
      <div className="grid grid-cols-5 gap-6 mt-6">
        {brandsdata.map((brand, index) => (
          <div
            key={index}
            className="flex justify-center items-center p-2 hover:scale-105 transition-transform"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="max-h-14 object-contain"
            />
          </div>
        ))}
      </div>

      {/* Banner Section */}
      <div className="mt-10">
        <img
          src="src/assets/img/banner/banner5.jpg"
          alt="Bottom Banner"
          className="w-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}
