"use client";
import { useState, useEffect } from "react";
import { getConnectedPages } from "../../../services/fanpages";
import { getPostsByPage } from "../../../services/post";
import Image from "next/image";

export default function Dashboard() {
    const [stats, setStats] = useState({ pages: 0, posts: 0 });
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pages = await getConnectedPages();
                const posts = await Promise.all(
                    pages.map(async (page) => (await getPostsByPage(page.pageId)).length)
                ).then((counts) => counts.reduce((a, b) => a + b, 0));
                setStats({ pages: pages.length, posts });
            } catch {
                setSnackbar({ open: true, message: "Không thể tải dữ liệu", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar]);

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng điều khiển</h2>
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4">
                            <Image
                                src="/default-avatar.png"
                                alt="User"
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Người dùng</h3>
                                <p className="text-sm text-gray-600">Quản lý Fanpage và bài viết</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h4 className="text-sm font-semibold text-gray-700">Fanpage</h4>
                            <p className="text-2xl font-bold text-blue-500">{stats.pages}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h4 className="text-sm font-semibold text-gray-700">Bài đăng</h4>
                            <p className="text-2xl font-bold text-blue-500">{stats.posts}</p>
                        </div>
                    </div>
                </div>
            )}
            {snackbar.open && (
                <div
                    className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${snackbar.severity === "success" ? "bg-green-500" : "bg-red-500"}`}
                >
                    {snackbar.message}
                </div>
            )}
        </div>
    );
}