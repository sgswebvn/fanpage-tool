"use client";
import { AppBar, Toolbar, Box, Button, Stack, Avatar, Menu, MenuItem, IconButton, Divider } from "@mui/material";
import Link from "next/link";

interface NavbarProps {
    loggedIn: boolean;
    anchorEl: null | HTMLElement;
    handleAvatarClick: (event: React.MouseEvent<HTMLElement>) => void;
    handleClose: () => void;
    handleLogout: () => void;
}
const navLinks = [
    { label: "Giải pháp", href: "/solutions" },
    { label: "Bảng giá", href: "/pricing" },
    { label: "Khách hàng", href: "/customers" },
    { label: "Blog", href: "/blog" },
    { label: "Liên hệ", href: "/contact" },
];
export default function Navbar({
    loggedIn,
    anchorEl,
    handleAvatarClick,
    handleClose,
    handleLogout,
}: NavbarProps) {
    return (
        <AppBar position="sticky" sx={{ bgcolor: "#fff", color: "#222", boxShadow: "0 2px 8px #0001" }}>
            <Toolbar>
                <Box component={Link} href="/" sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                    <Box component="img" src="/logo-sapo.png" alt="Sapo Logo" sx={{ height: 40 }} />
                </Box>
                <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                    {navLinks.map((item) => (
                        <Button
                            key={item.label}
                            component={Link}
                            href={item.href}
                            color="inherit"
                            sx={{ fontWeight: 500 }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Stack>
                {!loggedIn ? (
                    <>
                        <Button component={Link} href="/auth/login" color="inherit" sx={{ fontWeight: 600 }}>
                            Đăng nhập
                        </Button>
                        <Button
                            variant="contained"
                            component={Link}
                            href="/auth/register"
                            sx={{ ml: 2, bgcolor: "#00e676", color: "#222", fontWeight: 700, boxShadow: "none" }}
                        >
                            Dùng thử miễn phí
                        </Button>
                    </>
                ) : (
                    <>
                        <IconButton onClick={handleAvatarClick} sx={{ ml: 2 }}>
                            <Avatar alt="Profile" src="/profile.png" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <MenuItem component={Link} href="/auth/profile" onClick={handleClose}>
                                Thông tin cá nhân
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}