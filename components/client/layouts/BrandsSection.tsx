"use client";
import { Container, Typography, Grid, Box, Stack } from "@mui/material";

export default function BrandsSection({ brands, medias }: { brands: string[]; medias: string[] }) {
    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
                Hơn 230,000 doanh nghiệp tin dùng
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {brands.map((logo, i) => (
                    <Grid item key={i} xs={4} sm={2}>
                        <Box component="img" src={`/brands/${logo}.png`} alt={logo} sx={{ width: "100%", filter: "grayscale(100%)" }} />
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h5" align="center" sx={{ mt: 6, mb: 2 }}>
                Báo chí nói về Sapo
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
                {medias.map((media, i) => (
                    <Box key={i} component="img" src={`/media/${media}.png`} alt={media} sx={{ height: 40, opacity: 0.7 }} />
                ))}
            </Stack>
        </Container>
    );
}