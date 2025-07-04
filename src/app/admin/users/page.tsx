"use client";
import { useEffect, useState } from "react";
import { getUsers, lockUser, unlockUser } from "../../../../services/user";
import { User } from "../../../../interfaces/user";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    getUsers().then(data => { setUsers(data); setLoading(false); });
  }, []);

  const handleLock = async (id: string) => {
    try {
      await lockUser(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: false } : u));
      setSnackbar({ open: true, message: "Đã khoá người dùng", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Khoá thất bại", severity: "error" });
    }
  };
  const handleUnlock = async (id: string) => {
    try {
      await unlockUser(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: true } : u));
      setSnackbar({ open: true, message: "Đã mở khoá người dùng", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Mở khoá thất bại", severity: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Quản lý người dùng</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={user.role === "admin" ? "primary" : "default"} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.isActive ? "Hoạt động" : "Đã khoá"} color={user.isActive ? "success" : "error"} size="small" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {user.isActive ? (
                        <Button variant="outlined" color="error" size="small" onClick={() => handleLock(user._id)}>Khoá</Button>
                      ) : (
                        <Button variant="outlined" color="primary" size="small" onClick={() => handleUnlock(user._id)}>Mở khoá</Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}