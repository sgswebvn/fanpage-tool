export default function Features() {
  const features = [
    { title: "Quản lý nội dung", description: "Lên lịch bài viết, quản lý bình luận dễ dàng.", image: "https://via.placeholder.com/300x200?text=Quan+Ly+Noi+Dung" },
    { title: "Tăng tương tác", description: "Phân tích và tối ưu hóa tương tác Fanpage.", image: "https://via.placeholder.com/300x200?text=Tang+Tuong+Tac" },
    { title: "Báo cáo chi tiết", description: "Theo dõi hiệu suất Fanpage theo thời gian thực.", image: "https://via.placeholder.com/300x200?text=Bao+Cao+Chi+Tiet" },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 bg-gradient-to-br from-teal-100 via-teal-200 to-blue-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-4 sm:p-6 bg-teal-800 text-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <img src={feature.image} alt={feature.title} className="w-full h-28 sm:h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-200 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}