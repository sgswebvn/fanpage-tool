"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@mui/material";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra token trong localStorage để xác định trạng thái đăng nhập
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  return (
    <header className="bg-gradient-to-r from-teal-700 via-teal-800 to-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-2xl font-bold flex items-center mb-4 sm:mb-0">
          <span className="text-teal-300">Sapo</span>
          <span className="text-white">FB Manager</span>
        </div>
        <div className="space-x-2 sm:space-x-4">
          {isLoggedIn ? (

            <>
              <Link href="/auth/profile" className="text-gray-200 hover:text-teal-300 text-sm sm:text-base">Hồ sơ</Link>

              <Button
                onClick={handleLogout}
                className="text-teal-200 font-semibold hover:text-teal-100 text-sm sm:text-base"
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-teal-200 font-semibold hover:text-teal-100 text-sm sm:text-base">Đăng nhập</Link>
              <Link href="/auth/register" className="bg-teal-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-teal-600 transition duration-200 text-sm sm:text-base">
                Dùng thử miễn phí
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}