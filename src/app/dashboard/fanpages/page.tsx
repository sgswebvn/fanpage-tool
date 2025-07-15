// app/fanpages/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Snackbar, Alert } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import api from "../../../../services/api";
import { getFacebookPages, connectPage } from "../../../../services/fanpages";
import { Fanpage } from "../../../../interfaces/post";

export default function FanpagesPage() {
    const [facebookId, setFacebookId] = useState<string | null>(null);
    const [pages, setPages] = useState<Fanpage[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success"
    });

    useEffect(() => {
        setLoading(true);
        api.get("/auth/me")
            .then(res => {
                setFacebookId(res.data.facebookId || null);
                if (res.data.facebookId) {
                    return getFacebookPages();
                }
                return null;
            })
            .then(res => {
                if (res) setPages(res);
            })
            .catch(err => setSnackbar({ open: true, message: err.message || "Không thể lấy thông tin người dùng!", severity: "error" }))
            .finally(() => setLoading(false));
    }, []);

    const handleConnectPage = async (page: Fanpage) => {
        setLoading(true);
        try {
            await connectPage(page.pageId, page.name, page.access_token);
            setSnackbar({ open: true, message: "Kết nối Fanpage thành công!", severity: "success" });
        } catch (err: any) {
            setSnackbar({ open: true, message: err.message || "Kết nối thất bại!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleConnectFacebook = () => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = `https://api.mutifacebook.pro.vn/auth/facebook?token=${token}`;
        } else {
            setSnackbar({ open: true, message: "Bạn cần đăng nhập trước!", severity: "error" });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
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
                            <ListItem
                                key={page.pageId}
                                secondaryAction={
                                    <Button variant="outlined" onClick={() => handleConnectPage(page)} disabled={loading}>
                                        Kết nối
                                    </Button>
                                }
                            >
                                <ListItemText primary={page.name} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}