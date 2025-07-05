"use client";
import { Container, Typography, Grid, Card, Box } from "@mui/material";

interface Solution {
    title: string;
    icon: string;
}
export default function SolutionsSection({ solutions }: { solutions: Solution[] }) {
    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
                Giải pháp theo mô hình kinh doanh của bạn
            </Typography>
            <Grid container spacing={3}>
                {solutions.map((s, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ textAlign: "center", p: 3, height: "100%", borderRadius: 3, boxShadow: "0 2px 8px #0001" }}>
                            <Box component="img" src={s.icon} alt={s.title} sx={{ width: 60, mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{s.title}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}