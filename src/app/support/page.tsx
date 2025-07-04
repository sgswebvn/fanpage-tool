"use client";
import { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Snackbar, Alert } from "@mui/material";
import api from "../../../services/api";

export default function AdminSupport() {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/support", form);
      setSnackbar({ open: true, message: "Gửi yêu cầu hỗ trợ thành công!", severity: "success" });
      setForm({ subject: "", message: "" });
    } catch {
      setSnackbar({ open: true, message: "Gửi thất bại!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Gửi yêu cầu hỗ trợ</Typography>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Chủ đề"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nội dung"
            name="message"
            value={form.message}
            onChange={handleChange}
            fullWidth
            required
            multiline
            minRows={4}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi hỗ trợ"}
          </Button>
        </form>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
