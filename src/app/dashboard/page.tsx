"use client";

import { useEffect, useState } from "react";
import { getPackages } from "../../../services/package";
import { Package } from "../../../interfaces/package";
import PackageCard from "../../../components/admin/packages/PackageCard";
import { Container, Typography, Grid } from "@mui/material";

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  return (
    <Container>
      <Typography variant="h3" align="center" sx={{ mt: 4 }}>
        Tool Quản Lý Fanpage Facebook
      </Typography>
      <Typography align="center" sx={{ mb: 4 }}>
        Quản lý tin nhắn, bài viết, bình luận, page, gói dịch vụ... tất cả trong một!
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {packages.map((pkg) => (
          <Grid xs={12} sm={6} md={3} key={pkg._id}>
            <PackageCard pkg={pkg} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}