"use client";
import { useEffect, useState, useRef } from "react";
import api from "../../../../services/api";
import { Socket, io } from "socket.io-client";
import { getMessagesByPage } from "../../../../services/message";
import FanpageSelector from "../../../../components/client/dashboard/FanpageSelector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useDebounce } from "use-debounce";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    direction: "in" | "out";
    avatar?: string;
    followed?: boolean;
    conversationId?: string;
    attachments?: { type: string; url: string }[];
}

interface CustomerInfo {
    id: string;
    name: string;
    picture?: { data: { url: string } };
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    gender?: string;
}

interface Conversation {
    conversationId: string;
    customerInfo: CustomerInfo | null;
    messages: Message[];
}

export default function MessagesPage() {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [reply, setReply] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
    const [followed, setFollowed] = useState<{ [msgId: string]: boolean }>({});
    const [tab, setTab] = useState(0);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("selectedPageId");
        if (saved) setSelectedPage(saved);
    }, []);

    useEffect(() => {
        if (selectedPage) {
            getMessagesByPage(selectedPage)
                .then((data) => {
                    setConversations(data);
                    if (data.length > 0) setSelectedConv(data[0]);
                    const f: { [msgId: string]: boolean } = {};
                    data.forEach((conv) => conv.messages.forEach((msg) => { if (msg.followed) f[msg.id] = true; }));
                    setFollowed(f);
                })
                .catch(() => setSnackbar({ open: true, message: "Lỗi khi lấy tin nhắn", severity: "error" }));
        }
    }, [selectedPage]);

    useEffect(() => {
        if (!selectedPage) return;
        if (!socket.current) {
            const token = localStorage.getItem("authToken");
            socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.mutifacebook.pro.vn", {
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });
            socket.current.on("connect_error", (err) => {
                setSnackbar({ open: true, message: "Lỗi kết nối Socket.IO, đang thử lại...", severity: "error" });
                const newToken = localStorage.getItem("authToken"); // Thay bằng logic làm mới token
                if (newToken && socket.current) {
                    socket.current.auth.token = newToken;
                    socket.current.connect();
                }
            });
        }
        socket.current.emit("join", { pageId: selectedPage });
        socket.current.on("fb_message", (msg: Message) => {
            console.log("New message received:", { msgConversationId: msg.conversationId, selectedConvId: selectedConv?.conversationId });
            if (msg.pageId === selectedPage) {
                setConversations((prev) => {
                    const existingConvIndex = prev.findIndex((conv) => conv.conversationId === msg.conversationId);
                    let updatedConvs = [...prev];
                    if (existingConvIndex !== -1) {
                        updatedConvs[existingConvIndex] = {
                            ...updatedConvs[existingConvIndex],
                            messages: [...updatedConvs[existingConvIndex].messages, msg].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
                        };
                    } else {
                        updatedConvs.push({
                            conversationId: msg.conversationId!,
                            customerInfo: { id: msg.senderId, name: msg.senderName, picture: msg.avatar ? { data: { url: msg.avatar } } : undefined },
                            messages: [msg],
                        });
                    }
                    return updatedConvs;
                });
                if (selectedConv?.conversationId === msg.conversationId) {
                    setSelectedConv((prev) => prev ? {
                        ...prev,
                        messages: [...prev.messages, msg].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    } : prev);
                } else if (!selectedConv && conversations.length === 0) {
                    const newConv: Conversation = {
                        conversationId: msg.conversationId!,
                        customerInfo: { id: msg.senderId, name: msg.senderName, picture: msg.avatar ? { data: { url: msg.avatar } } : undefined },
                        messages: [msg],
                    };
                    setSelectedConv(newConv);
                    setConversations([newConv]);
                }
                if (msg.direction === "in") {
                    setSnackbar({ open: true, message: "Bạn có tin nhắn mới!", severity: "success" });
                    new Audio("/notification.mp3").play();
                }
            }
        });
        socket.current.on("fb_message_followed", ({ messageId, followed }: { messageId: string; followed: boolean }) => {
            setFollowed((f) => ({ ...f, [messageId]: followed }));
            setConversations((prev) =>
                prev.map((conv) => ({
                    ...conv,
                    messages: conv.messages.map((msg) =>
                        msg.id === messageId ? { ...msg, followed } : msg
                    ),
                }))
            );
            setSelectedConv((prev) =>
                prev ? {
                    ...prev,
                    messages: prev.messages.map((msg) =>
                        msg.id === messageId ? { ...msg, followed } : msg
                    ),
                } : prev
            );
        });
        socket.current.on("error", (error: { error: string }) => {
            setSnackbar({ open: true, message: error.error, severity: "error" });
        });
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [selectedPage, selectedConv?.conversationId, conversations.length]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedConv?.messages]);

    const handleSelectConv = (conv: Conversation) => setSelectedConv(conv);

    const handleReply = async () => {
        if (!selectedPage || !selectedConv || !reply.trim()) return;
        const recipientId = selectedConv.messages.find((msg) => msg.direction === "in")?.senderId;
        if (!recipientId) {
            setSnackbar({ open: true, message: "Không tìm thấy người nhận", severity: "error" });
            return;
        }
        const tempId = `temp_${uuidv4()}`;
        const newMsg: Message = {
            id: tempId,
            senderId: selectedPage,
            senderName: "Page",
            message: reply,
            timestamp: new Date().toISOString(),
            direction: "out",
            avatar: selectedConv.messages.find((msg) => msg.direction === "out")?.avatar || null,
            conversationId: selectedConv.conversationId,
        };
        setConversations((prev) => {
            const updatedConvs = prev.map((conv) => {
                if (conv.conversationId === selectedConv.conversationId) {
                    return { ...conv, messages: [...conv.messages, newMsg].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) };
                }
                return conv;
            });
            return updatedConvs;
        });
        setSelectedConv((prev) => prev ? {
            ...prev,
            messages: [...prev.messages, newMsg].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        } : prev);
        setReply("");
        try {
            await api.post("/messages/reply", {
                pageId: selectedPage,
                recipientId,
                message: reply,
            });
            getMessagesByPage(selectedPage).then((data) => {
                setConversations(data);
                setSelectedConv(data.find((c) => c.conversationId === selectedConv.conversationId));
            });
        } catch {
            setSnackbar({ open: true, message: "Lỗi khi gửi tin nhắn", severity: "error" });
            setConversations((prev) => prev.map((conv) => {
                if (conv.conversationId === selectedConv.conversationId) {
                    return { ...conv, messages: conv.messages.filter((msg) => msg.id !== tempId) };
                }
                return conv;
            }));
            setSelectedConv((prev) => prev ? {
                ...prev,
                messages: prev.messages.filter((msg) => msg.id !== tempId)
            } : prev);
        }
    };

    const handleFollow = async (msgId: string) => {
        if (!selectedPage) return;
        const currentFollowed = followed[msgId] || false;
        try {
            await api.post(`/messages/${msgId}/follow`, { pageId: selectedPage, followed: !currentFollowed });
            setFollowed((f) => ({ ...f, [msgId]: !currentFollowed }));
            setConversations((prev) =>
                prev.map((conv) => ({
                    ...conv,
                    messages: conv.messages.map((msg) =>
                        msg.id === msgId ? { ...msg, followed: !currentFollowed } : msg
                    ),
                }))
            );
            setSelectedConv((prev) =>
                prev ? {
                    ...prev,
                    messages: prev.messages.map((msg) =>
                        msg.id === msgId ? { ...msg, followed: !currentFollowed } : msg
                    ),
                } : prev
            );
            setSnackbar({ open: true, message: "Cập nhật trạng thái theo dõi thành công", severity: "success" });
        } catch {
            setSnackbar({ open: true, message: "Lỗi khi cập nhật trạng thái theo dõi", severity: "error" });
        }
    };

    const filteredConvs = conversations.filter((conv) => {
        if (debouncedSearchQuery) {
            const query = debouncedSearchQuery.toLowerCase();
            return (
                conv.customerInfo?.name.toLowerCase().includes(query) ||
                conv.messages.some((msg) => msg.message.toLowerCase().includes(query))
            );
        }
        if (tab === 1) {
            const lastMsg = conv.messages[conv.messages.length - 1];
            return lastMsg.direction === "in";
        }
        if (tab === 2) {
            return conv.messages.some((msg) => msg.followed);
        }
        return true;
    });

    const customerInfo = selectedConv?.customerInfo;
    const avatarUrl = customerInfo?.picture?.data?.url || selectedConv?.messages.find((msg) => msg.direction === "in")?.avatar;

    return (
        <div className="flex h-[calc(100vh-60px)]">
            {/* Conversation List */}
            <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <FanpageSelector selected={selectedPage} onSelect={setSelectedPage} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm hội thoại..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-2 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex border-b border-gray-200">
                    {["Tất cả", "Chưa trả lời", "Ưu tiên"].map((label, index) => (
                        <button
                            key={index}
                            onClick={() => setTab(index)}
                            className={`flex-1 py-2 text-center text-sm ${tab === index ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConvs.map((conv) => {
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        const customerMsg = conv.messages.find((msg) => msg.direction === "in");
                        return (
                            <div
                                key={conv.conversationId}
                                onClick={() => handleSelectConv(conv)}
                                className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${selectedConv?.conversationId === conv.conversationId ? "bg-blue-50" : ""}`}
                            >
                                <Image
                                    src={customerMsg?.avatar || conv.customerInfo?.picture?.data?.url || "/default-avatar.png"}
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div className="flex-1 ml-3">
                                    <p className="text-gray-900 font-medium">{customerMsg?.senderName || conv.customerInfo?.name || "Khách"}</p>
                                    <p className="text-gray-600 text-sm truncate">{lastMsg?.message}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFollow(lastMsg.id);
                                    }}
                                    className="text-yellow-500"
                                >
                                    {followed[lastMsg.id] ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Messages */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-200">
                    <p className="text-lg font-semibold text-gray-900">
                        {selectedConv ? `Cuộc trò chuyện: ${selectedConv.conversationId}` : "Chọn hội thoại"}
                    </p>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {selectedConv ? (
                        <>
                            {selectedConv.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.direction === "out" ? "justify-end" : "justify-start"} mb-4`}>
                                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.direction === "out" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                                        <p className="text-sm">{msg.message}</p>
                                        {msg.attachments?.map((att, index) => (
                                            <div key={index} className="mt-2">
                                                {att.type === "photo" && (
                                                    <Image src={att.url} alt="Attachment" width={200} height={200} className="rounded-lg" />
                                                )}
                                                {att.type === "video" && (
                                                    <video src={att.url} controls className="max-w-full rounded-lg" />
                                                )}
                                            </div>
                                        ))}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {msg.senderName} - {dayjs(msg.timestamp).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm:ss")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <p className="text-gray-600 text-center mt-10">Chọn hội thoại để xem chi tiết</p>
                    )}
                </div>
                {selectedConv && (
                    <div className="p-4 border-t border-gray-200 flex gap-2">
                        <textarea
                            placeholder="Nhập tin nhắn trả lời"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                        <button
                            onClick={handleReply}
                            disabled={!reply.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            Gửi
                        </button>
                    </div>
                )}
            </div>
            {/* Customer Info */}
            <div className="w-full lg:w-72 bg-white border-l border-gray-200 p-4">
                {selectedConv ? (
                    <>
                        <Image
                            src={avatarUrl || "/default-avatar.png"}
                            alt="Avatar"
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 text-center">
                            {customerInfo?.name || selectedConv?.messages.find((msg) => msg.direction === "in")?.senderName || "Khách"}
                        </h3>
                        <hr className="my-4" />
                        <p className="text-sm text-gray-600">ID: {customerInfo?.id || selectedConv?.messages.find((msg) => msg.direction === "in")?.senderId}</p>
                        {customerInfo?.gender && <p className="text-sm text-gray-600">Giới tính: {customerInfo.gender}</p>}
                        <hr className="my-4" />
                        <p className="text-sm font-semibold text-gray-700">Thông tin liên hệ</p>
                        <p className="text-sm text-gray-600">Email: {customerInfo?.email || "Không có"}</p>
                        <p className="text-sm text-gray-600">Điện thoại: {customerInfo?.phone || "Không có"}</p>
                        <p className="text-sm text-gray-600">Địa chỉ: {customerInfo?.address || "Không có"}</p>
                        <p className="text-sm text-gray-600">Thành phố: {customerInfo?.city || "Không có"}</p>
                        <p className="text-sm text-gray-600">Quốc gia: {customerInfo?.country || "Không có"}</p>
                    </>
                ) : (
                    <p className="text-gray-600 text-center mt-10">Chọn hội thoại để xem thông tin khách hàng</p>
                )}
            </div>
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