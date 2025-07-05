"use client";
import { Container, Typography, Grid, Paper } from "@mui/material";

export default function FeaturesSection({ features }: { features: string[] }) {
    return (
        <Container sx={{ py: 8, bgcolor: "#f9f9f9", borderRadius: 4 }}>
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
                Tính năng vượt trội
            </Typography>
            <Grid container spacing={4}>
                {features.map((f, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{f}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Mô tả ngắn gọn cho {f.toLowerCase()}...
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}