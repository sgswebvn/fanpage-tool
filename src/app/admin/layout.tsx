import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdminGuard from "../middlaware/AdminGuard";
import AdminSidebar from "../../../components/admin/layouts/AdminSidebar";
import AdminHeader from "../../../components/admin/layouts/AdminHeader";
import AdminFooter from "../../../components/admin/layouts/AdminFooter";
import { Box, CssBaseline } from "@mui/material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Dashboard | Fanpage Tool",
  description:
    "Trang quản trị Fanpage Tool, quản lý người dùng, gói dịch vụ, fanpage, tối ưu SEO.",
  keywords: [
    "admin dashboard",
    "fanpage tool",
    "quản trị",
    "quản lý người dùng",
    "quản lý gói",
    "SEO",
  ],
  openGraph: {
    title: "Admin Dashboard | Fanpage Tool",
    description:
      "Trang quản trị Fanpage Tool, quản lý người dùng, gói dịch vụ, fanpage, tối ưu SEO.",
    url: "https://your-domain.com/admin",
    type: "website",
  },
  alternates: {
    canonical: "https://your-domain.com/admin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-geist-sans), Arial, sans-serif' }}
      >
        <CssBaseline />
        <AdminGuard>
          <Box
            sx={{
              display: "flex",
              minHeight: "100vh",
              flexDirection: "column",
            }}
          >
            <AdminHeader />
            <Box sx={{ display: "flex", flex: 1 }}>
              <AdminSidebar />
              <Box
                component="main"
                sx={{ flex: 1, p: 3, bgcolor: "#f7f7fa" }}
              >
                {children}
              </Box>
            </Box>
            <AdminFooter />
          </Box>
        </AdminGuard>
      </body>
    </html>
  );
}
