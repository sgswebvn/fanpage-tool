"use client";
import React, { useState } from "react";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import ArticleIcon from "@mui/icons-material/Article";
import FacebookIcon from "@mui/icons-material/Facebook";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

// Menu với icon chính xác theo chức năng
const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
    { text: "Quản lý tin nhắn", icon: <ChatIcon />, href: "/dashboard/messages/" },
    { text: "Quản lý bài viết", icon: <ArticleIcon />, href: "/dashboard/posts" },
    { text: "Quản lý Fanpage", icon: <FacebookIcon />, href: "/dashboard/fanpages" },
    { text: "Phân quyền nhân viên", icon: <AdminPanelSettingsIcon />, href: "/dashboard/permissions" },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const width = open ? 200 : 60;

    return (
        <Box
            component="aside"
            sx={{
                width,
                transition: 'width 0.2s',
                overflowX: 'hidden',
                boxShadow: 1,
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: '#fff',
                height: '100vh',
                position: 'relative',
                zIndex: 1200,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-end' : 'center', p: 1 }}>
                <IconButton onClick={() => setOpen(!open)}>
                    {open ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            <Divider />
            <List>
                {menu.map((item) => (
                    <Tooltip key={item.text} title={open ? '' : item.text} placement="right">
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            sx={{
                                justifyContent: open ? 'initial' : 'center',
                                px: 2,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 2 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            {open && <ListItemText primary={item.text} />}
                        </ListItemButton>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );
}
