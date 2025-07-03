"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import api from "../../../../services/api";


export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/auth/register", form);
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng ký thất bại");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>Đăng ký</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Tên" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" fullWidth>Đăng ký</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Box>
    </Container>
  );
}