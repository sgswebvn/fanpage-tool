export default function Pricing() {
  const plans = [
    { name: "Cơ bản", price: "Liên hệ", features: ["Lên lịch bài viết", "Quản lý bình luận"] },
    { name: "Nâng cao", price: "Liên hệ", features: ["Phân tích tương tác", "Hỗ trợ 24/7"] },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 bg-gradient-to-br from-teal-100 via-teal-200 to-blue-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">Gói dịch vụ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="p-4 sm:p-6 bg-teal-800 text-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-teal-300 mb-6">{plan.price}</p>
              <ul className="text-gray-200 mb-6 space-y-2 text-sm sm:text-base">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-teal-500 text-white py-2 sm:py-3 rounded-md hover:bg-teal-600 transition duration-200 font-semibold text-sm sm:text-base">
                Đăng ký
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}