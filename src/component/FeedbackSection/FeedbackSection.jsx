import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "../../utils/formatDateTime";

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  const visibleCount = 3;
  const maxIndex = Math.max(0, feedbacks.length - visibleCount);
  const token = localStorage.getItem("sessionToken");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/feedbacks/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const approved = data.filter((fb) => fb.isApproved === true);
          setFeedbacks(approved);
        } else {
          console.error("Lỗi lấy phản hồi");
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token]);

  const prevSlide = () => {
    setPageIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setPageIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Đang tải phản hồi...
      </div>
    );
  }
  if (feedbacks.length === 0) {
    return null;
  }
  if (feedbacks.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        Chưa có phản hồi nào được duyệt.
      </div>
    );
  }

  return (
    <section className="px-5 py-5 bg-white">
      <h2 className="text-[28px] font-bold text-[#F75385] mb-5">
        Feedback của khách hàng
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Prev Button */}
        {feedbacks.length > visibleCount && (
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 bg-white border border-gray-300 rounded-full p-3 shadow hover:bg-pink-100 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Carousel */}
        <div className="w-[960px] overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${(feedbacks.length * 100) / visibleCount}%`,
              transform: `translateX(-${
                (100 / feedbacks.length) * pageIndex
              }%)`,
            }}
          >
            {feedbacks.map((fb, idx) => (
              <div
                key={idx}
                className="w-[320px] max-w-[320px] flex-shrink-0 px-3"
              >
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <p className="text-center text-gray-800 text-lg font-medium mb-6 italic">
                    “{fb.comment}”
                  </p>

                  <div className="flex items-center">
                    <div className="w-2/3 pl-3">
                      <p className="text-sm font-semibold text-black truncate">
                        Khách hàng {fb.fullName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {fb.productName || "Sản phẩm không xác định"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(fb.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        {feedbacks.length > visibleCount && (
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 bg-white border border-gray-300 rounded-full p-3 shadow hover:bg-pink-100 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
}
