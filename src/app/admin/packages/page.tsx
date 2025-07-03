"use client";
import { useEffect, useState } from "react";
import { getPackages, createPackage, updatePackage, deletePackage } from "../../../../services/package";
import { Package } from "../../../../interfaces/package";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState({ name: "", maxPages: 1, price: 0, customizable: false });

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  const handleOpen = (pkg?: Package) => {
    setEditing(pkg || null);
    setForm(pkg ? { ...pkg } : { name: "", maxPages: 1, price: 0, customizable: false });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      const updated = await updatePackage(editing._id, form);
      setPackages(packages.map(p => p._id === updated._id ? updated : p));
    } else {
      const created = await createPackage(form);
      setPackages([...packages, created]);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deletePackage(id);
    setPackages(packages.filter(p => p._id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>Quản lý gói dịch vụ</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Thêm gói</Button>
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
            <TableRow key={pkg._id}>
              <TableCell>{pkg.name}</TableCell>
              <TableCell>{pkg.maxPages}</TableCell>
              <TableCell>{pkg.price}</TableCell>
              <TableCell>{pkg.customizable ? "Có" : "Không"}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(pkg)}>Sửa</Button>
                <Button color="error" onClick={() => handleDelete(pkg._id)}>Xoá</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Sửa gói" : "Thêm gói"}</DialogTitle>
        <DialogContent>
          <TextField label="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Max Pages" type="number" value={form.maxPages} onChange={e => setForm({ ...form, maxPages: +e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Giá" type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} fullWidth sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Huỷ</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}