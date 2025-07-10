export default function Banner() {
  return (
    <section className="bg-blue-50 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Giải pháp quản lý bán hàng toàn diện</h1>
          <p className="text-gray-600 mb-6">Tăng trưởng doanh thu, quản lý dễ dàng, tối ưu chi phí với nền tảng Sapo Clone.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Dùng thử miễn phí</button>
        </div>
        <div className="md:w-1/2">
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">[Hình ảnh minh họa]</span>
          </div>
        </div>
      </div>
    </section>
  );
}