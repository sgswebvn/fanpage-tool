"use client";
import { useState, useEffect } from "react";
import api from "../../../../services/api";
import { getFacebookPages, connectPage, disconnectPage, getConnectedPages } from "../../../../services/fanpages";
import { getFacebookAuthUrl } from "../../../../services/facebook";
import { Fanpage } from "../../../../interfaces/fanpage";
import Image from "next/image";

export default function FanpagesPage() {
    const [facebookId, setFacebookId] = useState<string | null>(null);
    const [connectedPages, setConnectedPages] = useState<Fanpage[]>([]);
    const [availablePages, setAvailablePages] = useState<Fanpage[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const fetchData = async () => {
            setLoading(true);
            try {
                const user = await api.get("/auth/me").then((res) => res.data);
                setFacebookId(user.facebookId || null);
                if (user.facebookId) {
                    const [connected, available] = await Promise.all([
                        getConnectedPages(),
                        getFacebookPages(),
                    ]);
                    setConnectedPages(connected);
                    setAvailablePages(available.filter((p) => !connected.some((cp) => cp.pageId === p.pageId)));
                }
            } catch {
                setSnackbar({ open: true, message: "Không thể tải dữ liệu", severity: "error" });
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            api
                .post("/auth/facebook/callback", { code })
                .then((res) => {
                    setSnackbar({ open: true, message: "Kết nối Facebook thành công", severity: "success" });
                    window.history.replaceState({}, document.title, "/fanpages");
                    if (res.data.redirect) window.location.href = res.data.redirect;
                    fetchData();
                })
                .catch(() => {
                    setSnackbar({ open: true, message: "Xác thực Facebook thất bại", severity: "error" });
                    setLoading(false);
                });
        } else {
            fetchData();
        }
    }, []);

    const handleConnectPage = async (page: Fanpage) => {
        setLoading(true);
        try {
            await connectPage(page.pageId, page.name, page.access_token);
            setSnackbar({ open: true, message: "Kết nối Fanpage thành công", severity: "success" });
            setConnectedPages((prev) => [...prev, page]);
            setAvailablePages((prev) => prev.filter((p) => p.pageId !== page.pageId));
        } catch (err: any) {
            setSnackbar({ open: true, message: err.message || "Kết nối thất bại", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnectPage = async (pageId: string) => {
        setLoading(true);
        try {
            await disconnectPage(pageId);
            setSnackbar({ open: true, message: "Ngắt kết nối Fanpage thành công", severity: "success" });
            setConnectedPages((prev) => prev.filter((p) => p.pageId !== pageId));
        } catch (err: any) {
            setSnackbar({ open: true, message: err.message || "Ngắt kết nối thất bại", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleConnectFacebook = async () => {
        try {
            const url = await getFacebookAuthUrl();
            window.location.href = url;
        } catch {
            setSnackbar({ open: true, message: "Không thể kết nối Facebook", severity: "error" });
        }
    };

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar]);

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý Fanpage</h2>
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center p-4 bg-gray-100 rounded-lg">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {!facebookId && (
                        <button
                            onClick={handleConnectFacebook}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.36 14.83h-1.81v-4.84h1.81v-1.56c0-1.79 1.07-2.77 2.63-2.77.77 0 1.43.06 1.62.09v1.88h-1.11c-.87 0-1.04.41-1.04 1.02v1.34h2.08l-.27 2.84h-1.81V22c4.41-.59 7.79-4.37 7.79-8.83 0-5.52-4.48-10-10-10z" />
                            </svg>
                            Kết nối Facebook
                        </button>
                    )}
                    {facebookId && (
                        <>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fanpage đã kết nối</h3>
                                {connectedPages.length === 0 ? (
                                    <p className="text-gray-600">Chưa có Fanpage nào được kết nối.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {connectedPages.map((page) => (
                                            <li key={page.pageId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Image
                                                        src={page.picture || "/default-avatar.png"}
                                                        alt={page.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <span className="text-gray-900 font-medium">{page.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDisconnectPage(page.pageId)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    Ngắt kết nối
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fanpage có thể kết nối</h3>
                                {availablePages.length === 0 ? (
                                    <p className="text-gray-600">Không có Fanpage nào để kết nối.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {availablePages.map((page) => (
                                            <li key={page.pageId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Image
                                                        src={page.picture || "/default-avatar.png"}
                                                        alt={page.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <span className="text-gray-900 font-medium">{page.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleConnectPage(page)}
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                                >
                                                    Kết nối
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
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