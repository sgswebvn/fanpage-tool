"use client";
import { useState, useEffect } from "react";
import Header from "../../components/client/layouts/Header";
import Banner from "../../components/client/layouts/Banner";
import Testimonials from "../../components/client/layouts/Testimonials";
import Features from "../../components/client/layouts/Features";
import Pricing from "../../components/client/layouts/Pricing";
import Footer from "../../components/client/layouts/Footer";

const solutions = [
  { title: "Bán hàng hợp kênh", icon: "/icons/omnichannel.svg" },
  { title: "Quản lý nhà hàng & dịch vụ", icon: "/icons/restaurant.svg" },
  { title: "Thiết kế website", icon: "/icons/website.svg" },
  { title: "Doanh nghiệp lớn", icon: "/icons/enterprise.svg" },
];

const features = [
  "Quản lý kho", "Chat hợp kênh AI", "Quản lý khách hàng", "Báo cáo & Nhân viên"
];

const brands = ["Vinamik", "Remax", "Comet", "Bear", "Dunlopillo"];
const medias = ["VnExpress", "Dân trí", "VTV", "Thanh Niên"];

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAnchorEl(null);
    setLoggedIn(false);
    window.location.href = "/auth/login";
  };

  return (
   <div className="flex flex-col min-h-screen">
      <Header />
      <Banner />
      <Features />
      <Testimonials />
      <Pricing/>
      <Footer />
    </div>
  );
}