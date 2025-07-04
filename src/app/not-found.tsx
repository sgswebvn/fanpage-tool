"use client";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f7f7fa' }}>
      <Typography variant="h1" sx={{ fontWeight: 700, fontSize: { xs: 80, md: 120 }, color: '#1976d2', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2, color: '#333' }}>
        Không tìm thấy trang
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button component={Link} href="/" variant="contained" size="large">
        Về trang chủ
      </Button>
    </Box>
  );
}
