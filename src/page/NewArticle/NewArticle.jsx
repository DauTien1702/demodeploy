import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AllArticles() {
  const [articlesdata, setArticlesdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch article list
  const getArticleList = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/articles/getAll",
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
        toast.error("Không thể tải danh sách bài viết.");
      }
    } catch (err) {
      toast.error("Lỗi tải bài viết.");
      console.error("Lỗi gọi API:", err);
    }
  };

  useEffect(() => {
    getArticleList();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(articlesdata.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentArticles = articlesdata.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="px-5 pt-5 bg-white min-h-screen pb-[120px] relative">
      {/* Title */}
      <h2 className="text-[28px] font-semibold text-[#F75385] ml-[10px] text-left mb-6">
        Tất cả bài viết
      </h2>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentArticles.length > 0 ? (
          currentArticles.map((article) => {
            const url = article.link;

            return (
              <a
                key={article.id}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-inherit"
              >
                <div
                  className="bg-white rounded-lg shadow-md overflow-hidden 
                    hover:shadow-lg border border-[#D2D2D2] 
                    transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col"
                >
                  {/* Image */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-[180px] object-cover"
                  />

                  {/* Title && Content */}
                  <div className="p-4 flex flex-col text-center flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                      {article.content}
                    </p>

                    {/* Nút Đọc thêm */}
                    <button
                      className="mt-auto bg-red-500 text-white text-sm font-medium 
                        px-4 py-2 rounded hover:bg-red-600 transition-colors mx-auto"
                    >
                      Đọc thêm
                    </button>
                  </div>
                </div>
              </a>
            );
          })
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            Không có bài viết nào.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-10 z-10 relative">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            ◀ Trước
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 text-sm border rounded ${
                  pageNum === currentPage
                    ? "bg-[#F75385] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Sau ▶
          </button>
        </div>
      )}
    </div>
  );
}
