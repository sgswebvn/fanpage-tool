import { AppBar, Toolbar, Box, Container, Typography, Button, Stack, Card, CardContent, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
const solutions = [
  { title: 'Bán hàng hợp kênh', icon: '/icons/omnichannel.svg' },
  { title: 'Quản lý nhà hàng & dịch vụ', icon: '/icons/restaurant.svg' },
  { title: 'Thiết kế website', icon: '/icons/website.svg' },
  { title: 'Doanh nghiệp lớn', icon: '/icons/enterprise.svg' },
];

const features = [
  'Quản lý kho', 'Chat hợp kênh AI', 'Quản lý khách hàng', 'Báo cáo & Nhân viên'
];

const brands = ['Vinamik','Remax','Comet','Bear','Dunlopillo'];
const medias = ['VnExpress','Dân trí','VTV','Thanh Niên'];

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', color: '#222' }}>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', boxShadow: 'none' }}>
        <Toolbar>
          <Box component="img" src="/logo-sapo.png" alt="Sapo Logo" sx={{ height: 40, mr: 2 }} />
          <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
            {['Giải pháp', 'Bảng giá', 'Khách hàng', 'Blog', 'Liên hệ'].map(t => (
              <Button key={t} component={Link} href={`#${t.toLowerCase()}`} color="inherit">{t}</Button>
            ))}
          </Stack>
          <Button color="inherit" component={Link} href="/auth/login">Đăng nhập</Button>
          <Button variant="contained" component={Link} href="/auth/register" sx={{ ml: 2, bgcolor: '#00e676', color: '#222' }}>
            Dùng thử miễn phí
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{ height: { xs: 400, md: '100vh' }, background: 'url(/hero.jpg) center/cover no-repeat', position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />
        <Container sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 }, textAlign: 'center', color: '#fff' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#00e676' }}>
            Nền tảng quản lý bán hàng hợp kênh được sử dụng nhiều nhất Việt Nam
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Tiên phong công nghệ Headless Commerce & AI, Sapo mang đến trải nghiệm Omnichannel vượt trội cho 230,000+ nhà bán hàng
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: '#00e676', color: '#222', px: 6, py: 2, fontSize: 18 }}>
            Dùng thử miễn phí
          </Button>
        </Container>
      </Box>

      {/* Features */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          Giải pháp theo mô hình kinh doanh của bạn
        </Typography>
        <Grid container spacing={3}>
          {solutions.map((s, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Box component="img" src={s.icon} alt={s.title} sx={{ width: 60, mb: 2 }} />
                <Typography variant="h6">{s.title}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Advanced Features */}
      <Container sx={{ py: 8, bgcolor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          Tính năng vượt trội
        </Typography>
        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb:1 }}>{f}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Mô tả ngắn gọn cho {f.toLowerCase()}...
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Brands */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          Hơn 230,000 doanh nghiệp tin dùng
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {brands.map((logo, i) => (
            <Grid item key={i} xs={4} sm={2}>
              <Box component="img" src={`/brands/${logo}.png`} alt={logo} sx={{ width: '100%', filter: 'grayscale(100%)' }} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" align="center" sx={{ mt: 6, mb: 2 }}>
          Báo chí nói về Sapo
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          {medias.map((media,i)=>(
            <Box key={i} component="img" src={`/media/${media}.png`} alt={media} sx={{ height: 40, opacity: 0.7 }} />
          ))}
        </Stack>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#263238', color: '#ccc', py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            {/* Giới thiệu */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Sapo</Typography>
              <Typography variant="body2">Hub kinh doanh online & offline, đa nền tảng</Typography>
            </Grid>
            {/* Menu */}
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight:700, mb:1 }}>Menu</Typography>
              {['Giải pháp','Bảng giá','Blog','Liên hệ'].map(t=>(
                <Link key={t} href={`#${t.toLowerCase()}`} passHref>
                  <Typography component="a" variant="body2" sx={{ display:'block', color:'#ccc', textDecoration:'none', '&:hover':{color:'#fff'} }}>{t}</Typography>
                </Link>
              ))}
            </Grid>
            {/* Liên hệ */}
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight:700, mb:1 }}>Liên hệ</Typography>
              <Typography variant="body2">📞 1900 6750</Typography>
              <Typography variant="body2">✉️ support@sapo.vn</Typography>
              <Typography variant="body2" sx={{ mt:2, fontSize:'0.8rem' }}>
                © {new Date().getFullYear()} Sapo Technology JSC
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
