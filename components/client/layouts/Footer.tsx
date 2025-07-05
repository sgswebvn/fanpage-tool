"use client";
import { Box, Container, Typography, Grid } from "@mui/material";
import Link from "next/link";

export default function Footer() {
    return (
        <Box sx={{ bgcolor: "#263238", color: "#ccc", py: 6, mt: 8 }}>
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Sapo</Typography>
                        <Typography variant="body2">Hub kinh doanh online & offline, đa nền tảng</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Menu</Typography>
                        {["Giải pháp", "Bảng giá", "Blog", "Liên hệ"].map((t) => (
                            <Link key={t} href={`#${t.toLowerCase()}`} passHref>
                                <Typography component="a" variant="body2" sx={{ display: "block", color: "#ccc", textDecoration: "none", "&:hover": { color: "#fff" } }}>{t}</Typography>
                            </Link>
                        ))}
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Liên hệ</Typography>
                        <Typography variant="body2">📞 1900 6750</Typography>
                        <Typography variant="body2">✉️ support@sapo.vn</Typography>
                        <Typography variant="body2" sx={{ mt: 2, fontSize: "0.8rem" }}>
                            © {new Date().getFullYear()} Sapo Technology JSC
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}