"use client";
import { Box, Typography, Paper } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Chào mừng đến với trang quản trị Fanpage Tool
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Đây là trang dashboard admin. Bạn có thể quản lý người dùng, gói dịch vụ,
          fanpage và nhiều chức năng khác tại đây.
        </Typography>
      </Paper>
    </Box>
  );
}