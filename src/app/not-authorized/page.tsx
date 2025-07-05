"use client";
import { Button } from "@mui/material";
import Link from "next/link";
export default function NotAuthorizedPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - Not Authorized</h1>
            <p>You do not have permission to access this page.</p>
            <p>Please contact your administrator if you believe this is an error.</p>

            <Button component={Link} href="/" variant="contained" size="large">
                Về trang chủ
            </Button>
        </div>

    );
}