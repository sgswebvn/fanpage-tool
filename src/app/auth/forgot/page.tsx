"use client";
import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import api from "../../../../services/api";

// Định nghĩa interface cho lỗi API
interface ApiError {
  response?: { data?: { error?: string } };
  message: string;
}

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/forgot", { email });
      setSuccess("Đã gửi email đặt lại mật khẩu (nếu email tồn tại)!");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || apiError.message || "Không thể gửi email");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Quên mật khẩu
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Gửi yêu cầu
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Container>
  );
}