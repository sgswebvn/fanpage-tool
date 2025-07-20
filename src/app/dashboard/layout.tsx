"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" },
        { href: "/dashboard/messages", label: "Tin nhắn", icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" },
        { href: "/dashboard/posts", label: "Bài viết", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" },
        { href: "/dashboard/fanpages", label: "Fanpage", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="lg:hidden mr-3 text-gray-700"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Image src="/vercel.svg" alt="Logo" width={40} height={40} className="mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">Quản lý Fanpage</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <form onSubmit={handleSearch} className="hidden sm:flex">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tin nhắn, bài viết..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </form>
                        <button
                            onClick={() => router.push("/profile")}
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                        >
                            <Image src="/default-avatar.png" alt="Avatar" width={32} height={32} className="rounded-full" />
                            <span className="hidden sm:inline">Hồ sơ</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <div className="flex">
                <aside
                    className={`bg-white shadow w-64 h-[calc(100vh-60px)] fixed top-[60px] left-0 lg:static transition-transform duration-300 z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
                >
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 mt-[60px] max-w-7xl mx-auto">{children}</main>
            </div>
        </div>
    );
}