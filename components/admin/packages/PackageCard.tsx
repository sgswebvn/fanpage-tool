import { Card, CardContent, Typography, Button } from "@mui/material";
import { Package } from "../../../interfaces/package";

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <Card sx={{ minWidth: 275, m: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5">{pkg.name}</Typography>
        <Typography>Max Pages: {pkg.maxPages}</Typography>
        <Typography>Price: {pkg.price.toLocaleString()} VND</Typography>
        {pkg.customizable && <Typography color="secondary">Customizable</Typography>}
        <Button variant="contained" sx={{ mt: 2 }}>Mua ngay</Button>
      </CardContent>
    </Card>
  );
}