'use client';

import React, { useEffect, useState } from 'react';
import { GetProfile } from '../../../../services/user';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        GetProfile()
            .then((data) => {
                setUser(data);
                setNewName(data.name);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Lỗi không xác định');
                setLoading(false);
            });
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch('/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) throw new Error('Cập nhật thất bại');

            const data = await response.json();
            setUser(data);
            setEditing(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box maxWidth={500} mx="auto" mt={6} px={2}>
            <Card elevation={4}>
                <CardHeader
                    avatar={<Avatar><PersonIcon /></Avatar>}
                    title="Thông tin người dùng"
                    subheader="Xem và cập nhật hồ sơ"
                />
                <CardContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {editing ? (
                            <>
                                <TextField
                                    label="Tên người dùng"
                                    variant="outlined"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    fullWidth
                                />
                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                    <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                                        Lưu
                                    </Button>
                                    <Button variant="outlined" onClick={() => setEditing(false)}>
                                        Hủy
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography variant="body1">
                                    <strong>Tên:</strong> {user?.name}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {user?.email}
                                </Typography>
                                <Box mt={2}>
                                    <Button variant="outlined" onClick={() => setEditing(true)}>
                                        Chỉnh sửa tên
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
