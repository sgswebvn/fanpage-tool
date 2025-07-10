export default function Testimonials() {
  const testimonials = [
    { name: "Nguyễn Văn A", text: "Sapo FB Manager giúp tôi quản lý Fanpage hiệu quả hơn rất nhiều!" },
    { name: "Trần Thị B", text: "Tính năng lên lịch bài viết tiết kiệm thời gian đáng kể." },
  ];

  return (
    <section id="testimonials" className="py-12 sm:py-16 bg-gradient-to-br from-teal-100 via-teal-200 to-blue-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">Khách hàng nói gì</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 sm:p-6 bg-teal-800 text-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{testimonial.name}</h3>
              </div>
              <p className="text-gray-200 text-sm sm:text-base">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}