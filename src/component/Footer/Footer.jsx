export default function Footer() {
  return (
    <div className="w-full">
      {/* Thanh ngang hồng phía trên */}
      <div className="h-[6px] bg-[#EF608C] w-full"></div>

      {/* Nội dung footer */}
      <footer className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Cột 1: Thông tin liên hệ */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#EF608C] mb-4">LunaMilk</h2>
            <ul className="text-sm text-gray-800 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                C5 C7 đường số 12, P. Hưng Phú 1,<br /> Q. Cái Răng, TP Cần Thơ.
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                Hotline: <span className="text-red-600 ml-1">1800 6886</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                Mamsuayeuthuong@gmail.com
              </li>
            </ul>
          </div>

          {/* Cột 2: Chính sách */}
          <div>
            <h3 className="text-lg font-bold text-[#EF608C] mb-2">CHÍNH SÁCH</h3>
            <div className="w-10 h-1 bg-[#EF608C] mb-3"></div>
            <ul className="text-sm text-gray-800 space-y-2">
              <li>Chính sách bảo mật thông tin</li>
              <li>Chính sách đổi hàng & bảo hành</li>
            </ul>
          </div>

          {/* Cột 3: Hướng dẫn */}
          <div>
            <h3 className="text-lg font-bold text-[#EF608C] mb-2">HƯỚNG DẪN</h3>
            <div className="w-10 h-1 bg-[#EF608C] mb-3"></div>
            <ul className="text-sm text-gray-800 space-y-2">
              <li>Hướng dẫn mua hàng</li>
              <li>Hướng dẫn thanh toán</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
