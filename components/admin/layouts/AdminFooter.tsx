import React from "react";
import { Box, Typography } from "@mui/material";

export default function AdminFooter() {
  return (
    <Box component="footer" sx={{ p: 2, textAlign: "center", bgcolor: "#fff", borderTop: 1, borderColor: "divider", boxShadow: 1 }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Fanpage Tool Admin. All rights reserved.
      </Typography>
    </Box>
  );
}
