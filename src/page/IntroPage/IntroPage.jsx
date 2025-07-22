import React, { useEffect, useState } from "react";
import ProductCard from "../../component/ProductCard/ProductCard";
import { Link } from "react-router-dom";

const IntroPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products/getAll");
        if (res.ok) {
          const data = await res.json();
          const shuffled = data.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3); // chỉ lấy 3 sản phẩm
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
    <main className="min-h-screen bg-pink-50 flex flex-col items-center p-6">
      {/* --- PHẦN GIỚI THIỆU --- */}
      <section className="bg-white max-w-3xl w-full p-10 rounded-2xl shadow-xl mb-10">
        <h1 className="text-4xl font-bold text-pink-700 mb-6 text-center">
          Giới thiệu về LunaMilk
        </h1>
        <div className="mb-6 flex justify-center">
          <img
            src="https://cdn1.concung.com/storage/data/2021/thong-tin-bo-ich/2024/12/S%E1%BB%AFa%20b%E1%BB%99t%20t%E1%BB%91t%20nh%E1%BA%A5t%20hi%E1%BB%87n%20nay.webp"
            alt="LunaMilk"
            className="rounded-lg shadow-md max-h-64 object-cover"
          />
        </div>
        <p className="text-lg text-gray-800 mb-4 leading-relaxed">
          Chào mừng bạn đến với <strong>LunaMilk</strong> – nơi mang đến những
          sản phẩm dinh dưỡng tốt nhất cho mẹ bầu, mẹ sau sinh và bé yêu...
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Sản phẩm chính hãng 100%</li>
          <li>Giao hàng toàn quốc nhanh chóng</li>
          <li>Tư vấn dinh dưỡng tận tâm</li>
          <li>Giá cả cạnh tranh, nhiều ưu đãi</li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          Hãy để <strong>LunaMilk</strong> đồng hành cùng hành trình nuôi dưỡng
          bé yêu khỏe mạnh và thông minh mỗi ngày!
        </p>
      </section>

      {/* --- PHẦN SẢN PHẨM NỔI BẬT --- */}
      <section className="w-full max-w-6xl bg-white p-5 rounded-xl shadow-md">
        <div className="flex justify-between items-center px-1 mb-4">
          <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#F75385]">
            Sản phẩm nổi bật
          </h2>
          <Link
            to="/all"
            className="inline-block text-[#F75385] border border-pink-300 rounded-full px-6 py-2 text-base 
        font-medium hover:bg-[#F75385] hover:text-white transition-colors"
          >
            Xem thêm <span className="ml-1">➤</span>
          </Link>
        </div>

        {/* Nội dung sản phẩm */}
        {loading ? (
          <div className="text-center mt-6 text-gray-500">
            Đang tải sản phẩm...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 place-items-center">
            {products.map((product) => (
              <div key={product.id} className="w-[220px] scale-[1.05]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default IntroPage;
