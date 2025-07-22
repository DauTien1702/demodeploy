import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";

export default function HotProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products/getAll", {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const shuffled = data.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 20);
          setProducts(selected);
        } else {
          console.error("Lỗi khi lấy danh sách sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="px-5 py-5 bg-white">
      <h2 className="text-[28px] font-semibold text-[#F75385] ml-[10px] text-left">
        Các sản phẩm của shop
      </h2>

      {loading ? (
        <div className="text-center mt-6 text-gray-500">
          Đang tải sản phẩm...
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-4 mt-4 place-items-center">
              {products.map((product, index) => (
                <ProductCard key={product.id || index} product={product} />
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/product-list"
              className="inline-block text-[#F75385] border border-pink-300 rounded-full px-6 py-2 text-base 
                font-medium hover:bg-[#F75385] hover:text-white transition-colors"
            >
              Xem tất cả <span className="ml-1">➤</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
