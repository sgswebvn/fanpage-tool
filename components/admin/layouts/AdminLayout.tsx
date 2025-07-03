"use client";
import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import ListItemButton from "@mui/material/ListItemButton";

const drawerWidth = 220;

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, href: "/admin" },
  { text: "Người dùng", icon: <PeopleIcon />, href: "/admin/users" },
  { text: "Gói dịch vụ", icon: <InventoryIcon />, href: "/admin/packages" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Link href="/login" style={{ color: "white", textDecoration: "none" }}>
            <LogoutIcon sx={{ mr: 1 }} /> Đăng xuất
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <Link href={item.href} key={item.text} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f4f6f8", p: 3, minHeight: "100vh" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}