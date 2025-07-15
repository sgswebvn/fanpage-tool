"use client";
import { useEffect, useState, useRef } from "react";
import { Box, Typography, List, ListItem, IconButton, TextField, Button, Avatar, Tooltip, Divider, Tabs, Tab } from "@mui/material";
import { ListItemText } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import api from "../../../../services/api";
import { getMessagesByPage } from "../../../../services/message";
import FanpageSelector from "../../../../components/client/dashboard/FanpageSelector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import io from "socket.io-client";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function MessagesPage() {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<any>(null);
    const [reply, setReply] = useState("");
    const [followed, setFollowed] = useState<{ [msgId: string]: boolean }>({});
    const [tab, setTab] = useState(0);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socket = useRef<any>(null);

    // Lấy danh sách page và conversation
    useEffect(() => {
        const saved = localStorage.getItem("selectedPageId");
        if (saved) setSelectedPage(saved);
    }, []);
    useEffect(() => {
        if (selectedPage) {
            localStorage.setItem("selectedPageId", selectedPage);
            getMessagesByPage(selectedPage).then(data => {
                setConversations(data);
                if (data.length > 0) setSelectedConv(data[0]);
                // Follow state
                const f: any = {};
                data.forEach(conv => conv.messages.forEach((msg: any) => { if (msg.followed) f[msg.id] = true; }));
                setFollowed(f);
            });
        }
    }, [selectedPage]);

    // Socket realtime + thông báo âm thanh
    useEffect(() => {
        if (!selectedPage) return;
        if (!socket.current) {
            socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.mutifacebook.pro.vn");
        }
        socket.current.emit("join", { pageId: selectedPage });
        socket.current.on("fb_message", (msg: any) => {
            if (msg.pageId === selectedPage) {
                getMessagesByPage(selectedPage).then(data => {
                    setConversations(data);
                    // Nếu tin nhắn mới là của khách, thông báo và phát âm thanh
                    if (msg.direction === "in") {
                        setSnackbar({ open: true, message: "Bạn có tin nhắn mới!" });
                        new Audio("/notification.mp3").play();
                    }
                });
            }
        });
        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, [selectedPage]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedConv?.messages]);

    // Chọn hội thoại
    const handleSelectConv = (conv: any) => setSelectedConv(conv);

    // Trả lời tin nhắn
    const handleReply = async () => {
        if (!selectedPage || !selectedConv) return;
        const recipientId = selectedConv.messages.find((msg: any) => msg.direction === "in")?.senderId;
        await api.post("/messages/reply", {
            pageId: selectedPage,
            recipientId,
            message: reply,
        });
        setReply("");
        getMessagesByPage(selectedPage).then(data => {
            setConversations(data);
            setSelectedConv(data.find((c: any) => c.conversationId === selectedConv.conversationId));
        });
    };

    // Follow
    const handleFollow = async (msgId: string) => {
        await api.post(`/messages/${msgId}/follow`, { pageId: selectedPage, followed: !followed[msgId] });
        setFollowed(f => ({ ...f, [msgId]: !f[msgId] }));
    };

    // Tabs lọc hội thoại
    const filteredConvs = conversations.filter(conv => {
        if (tab === 1) {
            // Chưa trả lời: tin nhắn cuối là của khách
            const lastMsg = conv.messages[conv.messages.length - 1];
            return lastMsg.direction === "in";
        }
        if (tab === 2) {
            // Ưu tiên: có tin nhắn được follow
            return conv.messages.some((msg: any) => msg.followed);
        }
        return true;
    });

    const customerInfo = selectedConv?.customerInfo;

    return (
        <Box sx={{ display: "flex", height: "80vh", bgcolor: "#f5f6fa" }}>
            {/* Sidebar: Danh sách hội thoại */}
            <Box sx={{ width: 320, bgcolor: "#fff", borderRight: "1px solid #eee", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                    <FanpageSelector selected={selectedPage} onSelect={setSelectedPage} />
                </Box>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
                    <Tab label="Tất cả" />
                    <Tab label="Chưa trả lời" />
                    <Tab label="Ưu tiên" />
                </Tabs>
                <List sx={{ flex: 1, overflowY: "auto" }}>
                    {filteredConvs.map(conv => {
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        const customerMsg = conv.messages.find((msg: any) => msg.direction === "in");
                        return (
                            <ListItem
                                key={conv.conversationId}
                                button={true}


                                selected={selectedConv?.conversationId === conv.conversationId}
                                onClick={() => handleSelectConv(conv)}
                                alignItems="flex-start"
                                sx={{ borderBottom: "1px solid #f0f0f0" }}
                                secondaryAction={
                                    <Tooltip title="Theo dõi">
                                        <IconButton onClick={e => { e.stopPropagation(); handleFollow(lastMsg.id); }}>
                                            {followed[lastMsg.id] ? <StarIcon color="warning" /> : <StarBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <Avatar sx={{ mr: 1 }} src={customerMsg?.picture?.data?.url}>
                                    {customerMsg?.senderName?.[0] || "?"}
                                </Avatar>
                                <ListItemText
                                    primary={customerMsg?.senderName || "Khách"}
                                    secondary={lastMsg?.message}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
            {/* Main: Lịch sử chat */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
                    {selectedConv ? (
                        <>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>Cuộc trò chuyện: {selectedConv.conversationId}</Typography>
                            <List sx={{ px: 0 }}>
                                {[...selectedConv.messages].reverse().map((msg: any, idx: number) => (
                                    <ListItem
                                        key={msg.id}
                                        sx={{
                                            justifyContent: msg.direction === "out" ? "flex-end" : "flex-start",
                                            display: "flex",
                                            px: 0,
                                        }}
                                        disableGutters
                                    >
                                        <Box
                                            sx={{
                                                bgcolor: msg.direction === "out" ? "#1976d2" : "#fff",
                                                color: msg.direction === "out" ? "#fff" : "#222",
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                maxWidth: "70%",
                                                textAlign: msg.direction === "out" ? "right" : "left",
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                                {msg.message}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                {msg.senderName} - {dayjs(msg.timestamp).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm:ss")}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                                <div ref={messagesEndRef} />
                            </List>
                        </>
                    ) : (
                        <Typography>Chọn hội thoại để xem chi tiết</Typography>
                    )}
                </Box>
                {/* Nhập tin nhắn trả lời */}
                {selectedConv && (
                    <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#fafbfc", display: "flex", gap: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Nhập tin nhắn trả lời"
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" disabled={!reply} onClick={handleReply}>Gửi</Button>
                    </Box>
                )}
            </Box>
            {/* Sidebar phải: Thông tin khách hàng */}
            <Box sx={{ width: 300, bgcolor: "#fff", borderLeft: "1px solid #eee", p: 2 }}>
                {customerInfo ? (
                    <>
                        <Avatar
                            src={customerInfo.picture?.data?.url}
                            sx={{ width: 64, height: 64, mb: 2 }}
                        >
                            {customerInfo.name?.[0] || "?"}
                        </Avatar>
                        <Typography variant="h6">{customerInfo.name}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">ID: {customerInfo.id}</Typography>
                        {customerInfo.gender && (
                            <Typography variant="body2" color="text.secondary">Giới tính: {customerInfo.gender}</Typography>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2">Thông tin liên hệ</Typography>
                        <Typography variant="body2" color="text.secondary">Email: {customerInfo.email || "Không có"}</Typography>
                        <Typography variant="body2" color="text.secondary">Điện thoại: {customerInfo.phone || "Không có"}</Typography>
                        <Typography variant="body2" color="text.secondary">Địa chỉ: {customerInfo.address || "Không có"}</Typography>
                        <Typography variant="body2" color="text.secondary">Thành phố: {customerInfo.city || "Không có"}</Typography>
                        <Typography variant="body2" color="text.secondary">Quốc gia: {customerInfo.country || "Không có"}</Typography>
                    </>
                ) : (
                    <Typography>Chọn hội thoại để xem thông tin khách hàng</Typography>
                )}
            </Box>
        </Box>
    );
}