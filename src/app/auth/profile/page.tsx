"use client";
import { useEffect, useState } from "react";
import Header from "../../../../components/client/layouts/Header";
import Footer from "../../../../components/client/layouts/Footer";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    // Giả lập lấy thông tin người dùng từ API
    const fetchUser = async () => {
      try {
        const response = await fetch("https://api.mutifacebook.pro.vn/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Không thể tải thông tin người dùng");
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-teal-100 via-teal-200 to-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-teal-100 via-teal-200 to-blue-100">
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm max-w-md">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex justify-center bg-gradient-to-br from-teal-100 via-teal-200 to-blue-100">
        <div className="bg-white p-6 container sm:p-8 rounded-2xl shadow-xl w-full  transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Hồ sơ của bạn</h1>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Menu tab bên trái */}
            <div className="w-full sm:w-1/4 bg-teal-800 text-white rounded-lg p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "personal" ? "bg-teal-700" : "hover:bg-teal-700"} transition duration-200`}
                  >
                    Thông tin cá nhân
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("upgrades")}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "upgrades" ? "bg-teal-700" : "hover:bg-teal-700"} transition duration-200`}
                  >
                    Các gói nâng cấp
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "payment" ? "bg-teal-700" : "hover:bg-teal-700"} transition duration-200`}
                  >
                    Phương thức thanh toán
                  </button>
                </li>
              </ul>
            </div>
            {/* Nội dung tab bên phải */}
            <div className="w-full sm:w-3/4 bg-teal-50 p-4 sm:p-6 rounded-lg shadow-inner">
              {activeTab === "personal" && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
                  <div className="space-y-4">
                    <p className="text-gray-800"><strong>Tên:</strong> {user?.name || "Chưa cập nhật"}</p>
                    <p className="text-gray-800"><strong>Email:</strong> {user?.email || "Chưa cập nhật"}</p>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200">
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "upgrades" && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">Các gói nâng cấp</h2>
                  <p className="text-gray-600">Gói hiện tại: {user?.plan || "Cơ bản"}</p>
                  <ul className="list-disc list-inside mt-4 text-gray-600">
                    <li>Quản lý lên đến 5 Fanpage</li>
                    <li>Hỗ trợ cơ bản</li>
                  </ul>
                  <button className="bg-teal-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-teal-700 transition duration-200">
                    Nâng cấp ngay
                  </button>
                </div>
              )}
              {activeTab === "payment" && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">Phương thức thanh toán</h2>
                  <p className="text-gray-600">Phương thức hiện tại: {user?.paymentMethod || "Chưa thêm"}</p>
                  <button className="bg-teal-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-teal-700 transition duration-200">
                    Thêm phương thức
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}