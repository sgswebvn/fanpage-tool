// components/CommentList.tsx
import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button } from "@mui/material";
import { syncComments, getCommentsByPost, Comment } from "../services/comment";
import { useRouter } from "next/navigation";

interface CommentListProps {
    pageId: string;
    postId: string;
}

export default function CommentList({ pageId, postId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            try {
                // Đồng bộ bình luận từ API Facebook
                await syncComments(pageId, postId);
                // Lấy bình luận từ database
                const data = await getCommentsByPost(postId);
                console.log("Comments:", data); // Debug
                setComments(data);
            } catch (err: any) {
                const errorMessage = err.message || "Không thể tải bình luận";
                setError(errorMessage);
                if (errorMessage.includes("Token của trang đã hết hạn")) {
                    setError("Token của Fanpage đã hết hạn. Vui lòng kết nối lại.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (pageId && postId) {
            fetchComments();
        }
    }, [pageId, postId]);

    const handleReconnect = () => {
        router.push("/fanpages");
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Bình luận:</Typography>
            {loading && <CircularProgress size={20} />}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        error.includes("Token của trang đã hết hạn") ? (
                            <Button color="inherit" size="small" onClick={handleReconnect}>
                                Kết nối lại
                            </Button>
                        ) : null
                    }
                >
                    {error}
                </Alert>
            )}
            {comments.length === 0 && !loading && !error && (
                <Typography color="textSecondary">Chưa có bình luận nào.</Typography>
            )}
            <List>
                {comments.map(comment => (
                    <ListItem key={comment.commentId} sx={{ pl: comment.parent_id ? 4 : 0 }}>
                        <ListItemText
                            primary={comment.message}
                            secondary={`${comment.from} • ${new Date(comment.created_time).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}