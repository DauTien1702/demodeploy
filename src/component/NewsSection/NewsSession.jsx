import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function NewsSection() {
  const [articlesdata, setArticlesdata] = useState([]);

  // Fetch article
  const getArticleList = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/articles/getAll`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response?.ok) {
        const data = await response.json();
        setArticlesdata(data);
      } else {
        console.error("Lỗi tải bài viết");
      }
    } catch (err) {
      toast.error("Lỗi tải bài viết:", err);
    }
  };

  useEffect(() => {
    getArticleList();
  }, []);

  return (
    <div className="px-5 py-5 bg-white">
      {/* Title */}
      <h2 className="text-[28px] font-semibold text-[#F75385] ml-[10px] text-left mb-6">
        Tin tức
      </h2>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articlesdata &&
          articlesdata.slice(0, 3).map((article) => {
            const url = article.link;

            return (
              <a
                href={url ? url : "#"}
                target="_blank"
                rel="noopner noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden 
                hover:shadow-lg border border-[#D2D2D2] 
                transition-shadow duration-300 flex flex-col hover:scale-105 
                transition-transform shadow-sm cursor-pointer"
                >
                  {/* Image */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-[180px] object-cover"
                  />

                  {/* Title && Content */}
                  <div className="p-4 flex flex-col text-center justify-between flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                      {article.content}
                    </p>

                    {/* Nút Đọc thêm */}
                    <button
                      className="mt-auto bg-red-500 text-white text-sm font-medium 
                    px-4 py-2 rounded hover:bg-red-600 transition-colors mx-auto cursor-pointer"
                    >
                      Đọc thêm
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
      </div>

      {/* View All Button */}

      <div className="flex justify-center mt-10">
        <Link
          to="/all-article"
          className="text-[#F75385] border border-pink-300 rounded-full px-6 py-2 text-base font-medium hover:bg-[#F75385] hover:text-white transition-colors"
        >
          Xem tất cả <span className="ml-1">➤</span>
        </Link>
      </div>
    </div>
  );
}
