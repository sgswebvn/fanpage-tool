"use client";
import { useState, useEffect } from "react";
import HeroSection from "../../components/client/layouts/HeroSection";
import SolutionsSection from "../../components/client/layouts/SolutionsSection";
import BrandsSection from "../../components/client/layouts/BrandsSection";
import FeaturesSection from "../../components/client/layouts/FeaturesSection";
import Footer from "../../components/client/layouts/Footer";
import Navbar from "../../components/client/layouts/Navbar";

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
    <>
      <Navbar
        loggedIn={loggedIn}
        anchorEl={anchorEl}
        handleAvatarClick={handleAvatarClick}
        handleClose={handleClose}
        handleLogout={handleLogout}
      />
      <HeroSection />
      <SolutionsSection solutions={solutions} />
      <FeaturesSection features={features} />
      <BrandsSection brands={brands} medias={medias} />
      <Footer />
    </>
  );
}