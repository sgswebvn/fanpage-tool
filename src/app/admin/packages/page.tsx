"use client";
import { useEffect, useState } from "react";
import { getPackages, createPackage, updatePackage, deletePackage } from "../../../../services/package";
import { Package } from "../../../../interfaces/package";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState({ name: "", maxPages: 1, price: 0, customizable: false });

  useEffect(() => {
    getPackages().then(data => { setPackages(data); setLoading(false); });
  }, []);

  const handleOpen = (pkg?: Package) => {
    setEditing(pkg || null);
    setForm(pkg
      ? {
          name: pkg.name,
          maxPages: pkg.maxPages,
          price: pkg.price,
          customizable: pkg.customizable ?? false,
        }
      : { name: "", maxPages: 1, price: 0, customizable: false }
    );
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const updated = await updatePackage(editing._id, form);
        setPackages(packages.map(p => p._id === updated._id ? updated : p));
        setSnackbar({ open: true, message: "Cập nhật thành công", severity: "success" });
      } else {
        const created = await createPackage(form);
        setPackages([...packages, created]);
        setSnackbar({ open: true, message: "Thêm gói thành công", severity: "success" });
      }
      setOpen(false);
    } catch {
      setSnackbar({ open: true, message: "Lỗi thao tác", severity: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePackage(id);
      setPackages(packages.filter(p => p._id !== id));
      setSnackbar({ open: true, message: "Đã xoá gói", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Xoá thất bại", severity: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Quản lý gói dịch vụ</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => handleOpen()}>Thêm gói</Button>
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Max Pages</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Customizable</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map(pkg => (
                <TableRow key={pkg._id} hover>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{pkg.maxPages}</TableCell>
                  <TableCell>{pkg.price.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <Chip label={pkg.customizable ? "Có" : "Không"} color={pkg.customizable ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small" onClick={() => handleOpen(pkg)}>Sửa</Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(pkg._id)}>Xoá</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Sửa gói" : "Thêm gói"}</DialogTitle>
        <DialogContent>
          <TextField label="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Max Pages" type="number" value={form.maxPages} onChange={e => setForm({ ...form, maxPages: +e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Giá" type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} fullWidth sx={{ mb: 2 }} />
          <Box sx={{ mt: 1 }}>
            <Button
              variant={form.customizable ? "contained" : "outlined"}
              color="success"
              onClick={() => setForm({ ...form, customizable: !form.customizable })}
            >
              {form.customizable ? "Có thể tuỳ chỉnh" : "Không tuỳ chỉnh"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Huỷ</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}