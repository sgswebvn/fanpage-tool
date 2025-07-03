"use client";
import { useEffect, useState } from "react";
import { getUsers, lockUser, unlockUser } from "../../../../services/user";
import { User } from "../../../../interfaces/user";
import AdminLayout from "../../../../components/admin/layouts/AdminLayout";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip } from "@mui/material";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { getUsers().then(setUsers); }, []);
  const handleLock = async (id: string) => { await lockUser(id); setUsers(users.map(u => u._id === id ? { ...u, isActive: false } : u)); };
  const handleUnlock = async (id: string) => { await unlockUser(id); setUsers(users.map(u => u._id === id ? { ...u, isActive: true } : u)); };
  return (
    <AdminLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>Quản lý người dùng</Typography>
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
            <TableRow key={user._id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Chip label={user.isActive ? "Hoạt động" : "Đã khoá"} color={user.isActive ? "success" : "error"} />
              </TableCell>
              <TableCell>
                {user.isActive
                  ? <Button color="error" onClick={() => handleLock(user._id)}>Khoá</Button>
                  : <Button color="primary" onClick={() => handleUnlock(user._id)}>Mở khoá</Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
}