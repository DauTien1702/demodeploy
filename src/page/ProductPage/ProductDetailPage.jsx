import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailInfo from "../ProductDetail/ProductDetailInfo";
import RelatedProducts from "../ProductDetail/RelatedProducts";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("sessionToken");
      try {
        const res = await fetch(
          `http://localhost:8080/api/products/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setProduct(data);

          if (data.categoryId) {
            fetchRelatedProducts(data.categoryId, data.id);
          } else {
            console.warn("❗ Sản phẩm không có categoryId");
          }
        } else {
          console.error("Không lấy được thông tin sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi kết nối đến API:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // fetch related product
  const fetchRelatedProducts = async (categoryId, productId) => {
    const token = localStorage.getItem("sessionToken");
    try {
      const res = await fetch("http://localhost:8080/api/products/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        // filter by categoryId
        const related = data.filter(
          (item) => item.id !== productId && item.categoryId === categoryId
        );

        const shuffled = related.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled);
      } else {
        console.error("Không thể lấy danh sách sản phẩm liên quan");
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    }
  };

  if (!product) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Đang tải thông tin sản phẩm...
      </p>
    );
  }

  return (
    <div className="p-8 max-w-screen-xl mx-auto bg-white">
      <ProductDetailInfo product={product} />

      <div className="mt-12">
        <h2 className="text-4xl font-semibold mb-8">Các sản phẩm cùng loại</h2>
        {relatedProducts.length > 0 ? (
          <>
            <RelatedProducts products={relatedProducts.slice(0, 5)} />

            {relatedProducts.length > 5 && (
              <div className="text-right mt-3">
                <button
                  onClick={() => {
                    const category = product.categoryName?.toLowerCase() || "";
                    if (category.includes("baby")) {
                      navigate("/baby");
                    } else if (
                      category.includes("women") ||
                      category.includes("mom")
                    ) {
                      navigate("/mom");
                    } else {
                      alert("Không xác định được loại sản phẩm.");
                    }
                  }}
                  className="pt-4 text-sm text-[#F75385] hover:underline"
                >
                  Xem tất cả sản phẩm cùng loại ➤
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Không có sản phẩm liên quan.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
