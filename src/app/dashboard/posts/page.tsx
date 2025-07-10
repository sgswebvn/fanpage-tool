// app/posts/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, ListItemButton, Button, Alert } from "@mui/material";
import { getConnectedPages } from "../../../../services/fanpages";
import { getPostsByPage } from "../../../../services/post";
import CommentList from "../../../../components/CommentList";
import { Post, Fanpage } from "../../../../interfaces/post";

export default function PostsPage() {
    const [pages, setPages] = useState<Fanpage[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loadedPageRef = useRef<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getConnectedPages()
            .then(data => {
                setPages(data);
                const lastPage = localStorage.getItem("selectedPageId");
                if (lastPage && data.some((p: Fanpage) => p.pageId === lastPage)) {
                    setSelectedPage(lastPage);
                } else if (data.length > 0) {
                    setSelectedPage(data[0].pageId);
                }
            })
            .catch(err => setError(err.message || "Không thể lấy danh sách Fanpage"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedPage) {
            localStorage.setItem("selectedPageId", selectedPage);
        }
    }, [selectedPage]);

    useEffect(() => {
        if (selectedPage && loadedPageRef.current !== selectedPage) {
            setLoading(true);
            setError(null);
            getPostsByPage(selectedPage)
                .then(data => {
                    console.log("Posts:", data); // Debug
                    setPosts(data);
                })
                .catch(err => setError(err.message || "Không thể lấy bài đăng"))
                .finally(() => {
                    setLoading(false);
                    loadedPageRef.current = selectedPage;
                });
        }
    }, [selectedPage]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Danh sách bài viết Fanpage</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <Typography>Chọn Fanpage:</Typography>
                <List sx={{ display: "flex", flexDirection: "row", gap: 1, p: 0 }}>
                    {pages.map(page => (
                        <ListItemButton
                            key={page.pageId}
                            selected={selectedPage === page.pageId}
                            onClick={() => setSelectedPage(page.pageId)}
                            sx={{
                                borderRadius: 2,
                                bgcolor: selectedPage === page.pageId ? "#1976d2" : "#f5f5f5",
                                color: selectedPage === page.pageId ? "#fff" : "#333",
                                boxShadow: selectedPage === page.pageId ? 3 : 0,
                                transition: "all 0.2s",
                                minWidth: 120,
                                justifyContent: "center",
                                fontWeight: 600
                            }}
                        >
                            <ListItemText primary={page.name} sx={{ textAlign: "center" }} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            {loading && <CircularProgress />}
            {posts.length === 0 && !loading && !error && (
                <Typography color="textSecondary">Chưa có bài đăng nào.</Typography>
            )}
            <List sx={{ mt: 2 }}>
                {posts.map(post => (
                    <ListItem
                        key={post.postId}
                        disableGutters
                        sx={{
                            display: "block",
                            mb: 3,
                            borderRadius: 3,
                            bgcolor: "#fff",
                            boxShadow: 3,
                            p: 0,
                            border: "1px solid #e0e0e0",
                            maxWidth: 600,
                            mx: "auto",
                            position: "relative",
                            overflow: "hidden",
                            transition: "box-shadow 0.2s",
                            ":hover": { boxShadow: 6 }
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "flex-start", p: 2, pb: 0 }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    bgcolor: "#1976d2",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 22,
                                    mr: 2
                                }}
                            >
                                {post.from?.name?.[0] || "F"}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight={700} fontSize={16}>
                                    {post.from?.name || "Fanpage"}
                                </Typography>
                                <Typography fontSize={13} color="#888">
                                    {new Date(post.created_time).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ px: 2, pt: 1, pb: 1 }}>
                            <Typography sx={{ fontSize: 18, mb: 1, fontWeight: 400, whiteSpace: "pre-line" }}>
                                {post.message || "[Không có nội dung]"}
                            </Typography>
                            {post.picture && (
                                <Box sx={{ mb: 2 }}>
                                    <img src={post.picture} alt="post" style={{ maxWidth: "100%", borderRadius: 8 }} />
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ px: 2, pb: 1, display: "flex", gap: 2 }}>
                            <Button
                                size="small"
                                sx={{ color: "#65676b", fontWeight: 600, textTransform: "none", px: 1, minWidth: 0 }}
                                startIcon={<span style={{ fontSize: 18 }}>👍</span>}
                            >
                                Thích
                            </Button>
                            <Button
                                size="small"
                                sx={{ color: "#65676b", fontWeight: 600, textTransform: "none", px: 1, minWidth: 0 }}
                                startIcon={<span style={{ fontSize: 18 }}>💬</span>}
                            >
                                Bình luận
                            </Button>
                            <Button
                                size="small"
                                sx={{ color: "#65676b", fontWeight: 600, textTransform: "none", px: 1, minWidth: 0 }}
                                startIcon={<span style={{ fontSize: 18 }}>↗️</span>}
                            >
                                Chia sẻ
                            </Button>
                        </Box>
                        <Box sx={{ px: 2, pb: 2 }}>
                            <CommentList pageId={selectedPage!} postId={post.postId} />
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}