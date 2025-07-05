"use client";
import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { getConnectedPages } from "../../../../services/fanpages";
import { getPostsByPage } from "../../../../services/post";

export default function PostsPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getConnectedPages().then(setPages);
    }, []);

    useEffect(() => {
        if (selectedPage) {
            setLoading(true);
            getPostsByPage(selectedPage)
                .then(setPosts)
                .finally(() => setLoading(false));
        }
    }, [selectedPage]);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Danh sách bài viết Fanpage</Typography>
            <Box sx={{ mb: 2 }}>
                <Typography>Chọn Fanpage:</Typography>
                <List>
                    {pages.map(page => (
                        <ListItem
                            key={page.pageId}
                            button
                            selected={selectedPage === page.pageId}
                            onClick={() => setSelectedPage(page.pageId)}
                        >
                            <ListItemText primary={page.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            {loading && <CircularProgress />}
            <List>
                {posts.map(post => (
                    <ListItem key={post.postId}>
                        <ListItemText
                            primary={post.message || "[Không có nội dung]"}
                            secondary={post.created_time}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}