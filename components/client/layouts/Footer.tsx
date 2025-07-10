export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-700 via-teal-800 to-blue-900 text-white py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Sapo FB Manager</h3>
            <p className="text-sm sm:text-base">Công cụ quản lý Fanpage Facebook hiệu quả.</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="#features" className="hover:underline">Tính năng</a></li>
              <li><a href="#pricing" className="hover:underline">Bảng giá</a></li>
              <li><a href="#support" className="hover:underline">Hỗ trợ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Liên hệ</h3>
            <p className="text-sm sm:text-base">Email: support@sapofb.com</p>
            <p className="text-sm sm:text-base">Hotline: 1900 1234</p>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm sm:text-base">© 2025 Sapo FB Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}