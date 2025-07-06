"use client";
import { useEffect, useState, useRef } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, ListItemButton, Button } from "@mui/material";
import { getConnectedPages } from "../../../../services/fanpages";
import { getPostsByPage } from "../../../../services/post";
import CommentList from "../../../../components/CommentList";

export default function PostsPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const loadedPageRef = useRef<string | null>(null);

    // Lưu page đã chọn vào localStorage
    useEffect(() => {
        getConnectedPages().then(data => {
            setPages(data);
            // Nếu đã có page được chọn trước đó thì tự động chọn lại
            const lastPage = localStorage.getItem('selectedPageId');
            if (lastPage && data.some((p: any) => p.pageId === lastPage)) {
                setSelectedPage(lastPage);
            } else if (data.length > 0) {
                setSelectedPage(data[0].pageId);
            }
        });
    }, []);

    // Khi chọn page mới thì lưu vào localStorage
    useEffect(() => {
        if (selectedPage) {
            localStorage.setItem('selectedPageId', selectedPage);
        }
    }, [selectedPage]);

    useEffect(() => {
        if (selectedPage && loadedPageRef.current !== selectedPage) {
            setLoading(true);
            getPostsByPage(selectedPage)
                .then(setPosts)
                .finally(() => {
                    setLoading(false);
                    loadedPageRef.current = selectedPage;
                });
        }
    }, [selectedPage]);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Danh sách bài viết Fanpage</Typography>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Typography>Chọn Fanpage:</Typography>
                <List sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 0 }}>
                    {pages.map(page => (
                        <ListItemButton
                            key={page.pageId}
                            selected={selectedPage === page.pageId}
                            onClick={() => setSelectedPage(page.pageId)}
                            sx={{
                                borderRadius: 2,
                                bgcolor: selectedPage === page.pageId ? '#1976d2' : '#f5f5f5',
                                color: selectedPage === page.pageId ? '#fff' : '#333',
                                boxShadow: selectedPage === page.pageId ? 3 : 0,
                                transition: 'all 0.2s',
                                minWidth: 120,
                                justifyContent: 'center',
                                fontWeight: 600
                            }}
                        >
                            <ListItemText primary={page.name} sx={{ textAlign: 'center' }} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            {loading && <CircularProgress />}
            <List sx={{ mt: 2 }}>
                {posts.map(post => (
                    <ListItem key={post.postId} disableGutters sx={{
                        display: 'block',
                        mb: 3,
                        borderRadius: 3,
                        bgcolor: '#fff',
                        boxShadow: 3,
                        p: 0,
                        border: '1px solid #e0e0e0',
                        maxWidth: 600,
                        mx: 'auto',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s',
                        ':hover': { boxShadow: 6 }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, pb: 0 }}>
                            <Box sx={{
                                width: 48, height: 48, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, mr: 2
                            }}>{post.from?.name?.[0] || 'F'}</Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight={700} fontSize={16}>{post.from?.name || 'Fanpage'}</Typography>
                                <Typography fontSize={13} color="#888">{new Date(post.created_time).toLocaleString()}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ px: 2, pt: 1, pb: 1 }}>
                            <Typography sx={{ fontSize: 18, mb: 1, fontWeight: 400, whiteSpace: 'pre-line' }}>{post.message || '[Không có nội dung]'}</Typography>
                            {post.attachments && post.attachments.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    {post.attachments.map((att: any, idx: number) => (
                                        <img key={idx} src={att.url} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8 }} />
                                    ))}
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 2 }}>
                            <Button size="small" sx={{ color: '#65676b', fontWeight: 600, textTransform: 'none', px: 1, minWidth: 0 }} startIcon={<span style={{fontSize:18}}>👍</span>}>Thích</Button>
                            <Button size="small" sx={{ color: '#65676b', fontWeight: 600, textTransform: 'none', px: 1, minWidth: 0 }} startIcon={<span style={{fontSize:18}}>💬</span>}>Bình luận</Button>
                            <Button size="small" sx={{ color: '#65676b', fontWeight: 600, textTransform: 'none', px: 1, minWidth: 0 }} startIcon={<span style={{fontSize:18}}>↗️</span>}>Chia sẻ</Button>
                        </Box>
                        <Box sx={{ px: 2, pb: 2 }}>
                            <CommentList postId={post.postId} />
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}