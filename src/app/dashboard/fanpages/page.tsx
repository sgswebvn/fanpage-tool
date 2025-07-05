"use client";
import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Snackbar, Alert } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import api from "../../../../services/api";

interface FacebookPage {
    pageId: string;
    name: string;
    access_token: string;
}

export default function FanpagesPage() {
    const [facebookId, setFacebookId] = useState<string | null>(null);
    const [pages, setPages] = useState<FacebookPage[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

    // Kiểm tra đã kết nối Facebook chưa
    useEffect(() => {
        setLoading(true);
        api.get("/auth/me")
            .then(res => {
                setFacebookId(res.data.facebookId || null);
                if (res.data.facebookId) {
                    // Nếu đã kết nối Facebook thì lấy danh sách page
                    return api.get("/auth/facebook/pages");
                }
                return null;
            })
            .then(res => {
                if (res && res.data) setPages(res.data);
            })
            .catch(() => setSnackbar({ open: true, message: "Không thể lấy thông tin người dùng!", severity: "error" }))
            .finally(() => setLoading(false));
    }, []);

    // Kết nối page vào hệ thống
    const handleConnectPage = async (page: FacebookPage) => {
        setLoading(true);
        try {
            await api.post("/pages/connect", {
                pageId: page.pageId,
                name: page.name,
                access_token: page.access_token,
            });
            setSnackbar({ open: true, message: "Kết nối Fanpage thành công!", severity: "success" });
        } catch (e: any) {
            setSnackbar({ open: true, message: e?.response?.data?.error || "Kết nối thất bại!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleConnectFacebook = () => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = `https://tool-fb.onrender.com/auth/facebook?token=${token}`;
        } else {
            alert("Bạn cần đăng nhập trước!");
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Kết nối Fanpage Facebook</Typography>
            {loading && <CircularProgress />}
            {!facebookId && !loading && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FacebookIcon />}
                    onClick={handleConnectFacebook}
                >
                    Kết nối Facebook
                </Button>
            )}
            {facebookId && (
                <Paper sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Chọn Fanpage để kết nối:</Typography>
                    <List>
                        {pages.map(page => (
                            <ListItem key={page.pageId} secondaryAction={
                                <Button variant="outlined" onClick={() => handleConnectPage(page)} disabled={loading}>
                                    Kết nối
                                </Button>
                            }>
                                <ListItemText primary={page.name} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}