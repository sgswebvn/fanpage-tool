"use client";
import { useEffect, useState } from "react";
import { getConnectedPages } from "../../../../services/fanpages";
import { getPostsByPage } from "../../../../services/post";
import { Post } from "../../../../interfaces/post";
import { Fanpage } from "../../../../interfaces/fanpage";
import FanpageSelector from "../../../../components/client/dashboard/FanpageSelector";
import CommentList from "../../../../components/CommentList";
import Image from "next/image";
import dayjs from "dayjs";

export default function PostsPage() {
    const [pages, setPages] = useState<Fanpage[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        setLoading(true);
        setError(null);
        getConnectedPages()
            .then((data) => {
                setPages(data);
                const lastPage = localStorage.getItem("selectedPageId");
                if (lastPage && data.some((p) => p.pageId === lastPage)) {
                    setSelectedPage(lastPage);
                } else if (data.length > 0) {
                    setSelectedPage(data[0].pageId);
                }
            })
            .catch(() => {
                setError("Không thể lấy danh sách Fanpage");
                setSnackbar({ open: true, message: "Không thể lấy danh sách Fanpage", severity: "error" });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedPage) {
            setLoading(true);
            setError(null);
            getPostsByPage(selectedPage, page, 10)
                .then((data) => {
                    setPosts((prev) => (page === 1 ? data : [...prev, ...data]));
                    setHasMore(data.length === 10);
                })
                .catch((err) => {
                    setError(err.message || "Không thể lấy bài đăng");
                    setSnackbar({ open: true, message: err.message || "Không thể lấy bài đăng", severity: "error" });
                })
                .finally(() => setLoading(false));
        }
    }, [selectedPage, page]);

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar]);

    return (
        <div className="max-w-3xl mx-auto py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh sách bài viết</h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            {pages.length > 0 && (
                <div className="mb-6">
                    <FanpageSelector selected={selectedPage} onSelect={setSelectedPage} />
                </div>
            )}
            {loading && page === 1 ? (
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center mb-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <p className="text-gray-600">Chưa có bài đăng nào.</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.postId} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="flex items-center p-4 border-b border-gray-200">
                                <Image
                                    src={pages.find((p) => p.pageId === post.pageId)?.picture || "/default-avatar.png"}
                                    alt="Fanpage"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div className="ml-3">
                                    <p className="text-gray-900 font-medium">{pages.find((p) => p.pageId === post.pageId)?.name || "Fanpage"}</p>
                                    <p className="text-xs text-gray-600">{dayjs(post.created_time).format("DD/MM/YYYY HH:mm")}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-800 whitespace-pre-line">{post.message || "[Không có nội dung]"}</p>
                                {post.picture && (
                                    <Image
                                        src={post.picture}
                                        alt="Post"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto rounded-lg mt-2"
                                    />
                                )}
                            </div>
                            <div className="px-4 pb-2 flex gap-4 text-sm text-gray-600">
                                <p>{post.likes} Thích</p>
                                <p>{post.shares} Chia sẻ</p>
                            </div>
                            <div className="px-4 pb-4">
                                <CommentList pageId={post.pageId} postId={post.postId} />
                            </div>
                        </div>
                    ))}
                    {hasMore && !error && (
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
                        >
                            Tải thêm
                        </button>
                    )}
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