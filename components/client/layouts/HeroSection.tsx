"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function HeroSection() {
    return (
        <Box
            sx={{
                height: { xs: 400, md: "80vh" },
                background: "url(/hero.jpg) center/cover no-repeat",
                position: "relative",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)" }} />
            <Container sx={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff" }}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "#00e676" }}>
                    Nền tảng quản lý bán hàng hợp kênh số 1 Việt Nam
                </Typography>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    Tiên phong công nghệ Headless Commerce & AI, Sapo mang đến trải nghiệm Omnichannel vượt trội cho 230,000+ nhà bán hàng
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: "#00e676", color: "#222", px: 6, py: 2, fontSize: 18, fontWeight: 700, boxShadow: "none" }}
                    component={Link}
                    href="/auth/register"
                >
                    Dùng thử miễn phí
                </Button>
            </Container>
        </Box>
    );
}