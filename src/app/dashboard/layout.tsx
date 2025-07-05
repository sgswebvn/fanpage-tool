import { Box } from "@mui/material";
import Header from "../../../components/client/dashboard/Header";
import Sidebar from "../../../components/client/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
            <Header />
            <Box sx={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "#f7f7fa" }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}