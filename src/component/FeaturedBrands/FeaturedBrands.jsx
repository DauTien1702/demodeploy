import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function FeaturedBrands() {
  const [brandsdata, setBrandsdata] = useState([]);

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
          <Link to={`/branddetail/${brand.name}`} key={index}>
            <div
              key={index}
              className="flex justify-center items-center p-4 bg-white border border-[#D2D2D2] 
            rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-14 object-contain"
              />
            </div>
          </Link>
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
