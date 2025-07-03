"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box, Alert, Link } from "@mui/material";
import api from "../../../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>Đăng nhập</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" fullWidth>Đăng nhập</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box sx={{ mt: 2 }}>
          <Link href="/forgot" underline="hover">Quên mật khẩu?</Link>
        </Box>
      </Box>
    </Container>
  );
}