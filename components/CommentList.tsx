import { useState } from "react";
import { getCommentsByPost, createComment } from "../services/comment";
import { Comment } from "../interfaces/comment";
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = () => {
    setLoading(true);
    getCommentsByPost(postId)
      .then(setComments)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    await createComment(postId, message);
    setMessage("");
    fetchComments();
    setSubmitting(false);
  };

  const handleReply = async (parentId: string) => {
    if (!replyMessage.trim()) return;
    setSubmitting(true);
    await createComment(postId, replyMessage, parentId);
    setReplyMessage("");
    setReplyTo(null);
    fetchComments();
    setSubmitting(false);
  };

  // Hiển thị comment cha và các comment con (reply)
  const renderComments = (parentId: string | null = null, level = 0) => {
    if (level > 1) return null; // chỉ cho phép 1 cấp reply
    return comments
      .filter(c => (c.parent_id ?? null) === parentId)
      .map(c => (
        <Box key={c.id} sx={{ ml: level * 3, mb: 1, maxWidth: 520 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, mr: 1
            }}>{typeof c.from === 'string' ? c.from[0] : c.from?.name?.[0] || 'U'}</Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ bgcolor: '#f0f2f5', borderRadius: 2, p: 1.2, minWidth: 0, boxShadow: 0, fontSize: 15 }}>
                <Typography fontWeight={600} fontSize={14} sx={{ mb: 0.2 }}>{typeof c.from === 'string' ? c.from : c.from?.name || "Ẩn danh"}</Typography>
                <Typography fontSize={15} sx={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{c.message}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography fontSize={11} color="#888">{new Date(c.created_time).toLocaleString()}</Typography>
                {level === 0 && (
                  <Button size="small" onClick={() => setReplyTo(c.id)} sx={{ textTransform: 'none', color: '#1976d2', fontSize: 13, minWidth: 0, px: 1 }}>Trả lời</Button>
                )}
              </Box>
            </Box>
          </Box>
          {replyTo === c.id && level === 0 && (
            <Box sx={{ ml: 5, mb: 1 }}>
              <TextField
                size="small"
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Nhập trả lời..."
                fullWidth
                multiline
                minRows={1}
                maxRows={3}
                sx={{ bgcolor: '#fff' }}
              />
              <Button size="small" onClick={() => handleReply(c.id)} disabled={submitting} sx={{ mt: 1, bgcolor: '#1976d2', color: '#fff', textTransform: 'none' }}>
                Gửi
              </Button>
              <Button size="small" onClick={() => setReplyTo(null)} sx={{ mt: 1, ml: 1, textTransform: 'none' }}>
                Hủy
              </Button>
            </Box>
          )}
          {renderComments(c.id, level + 1)}
        </Box>
      ));
  };

  return (
    <Box sx={{ mt: 2, bgcolor: '#f8f9fa', borderRadius: 2, p: 2, boxShadow: 1 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Bình luận</Typography>
      {loading ? <CircularProgress size={20} /> : (
        <List sx={{ p: 0 }}>{renderComments()}</List>
      )}
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15
        }}>U</Box>
        <TextField
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Viết bình luận..."
          fullWidth
          multiline
          minRows={1}
          maxRows={3}
          sx={{ bgcolor: '#fff' }}
        />
        <Button onClick={handleSubmit} disabled={submitting || !message.trim()} sx={{ mt: 0.5, bgcolor: '#1976d2', color: '#fff', textTransform: 'none', minWidth: 90 }}>
          Gửi bình luận
        </Button>
      </Box>
    </Box>
  );
}
