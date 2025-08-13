// Footer.tsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#774910ff', color: '#fff', pt: 6, pb: 4 }}>
      <Container >
        <Grid container spacing={6} alignItems="flex-start">
          {/* Column 1: Brand Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Interior Design
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.6 }}>
              Transform your living spaces into beautiful, functional environments<br></br>
              with our expert interior design services. We bring your vision to life<br></br>
              with creativity and precision.
            </Typography>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">
                Home
              </Link>
              <Link href="#" underline="hover" color="inherit">
                About Us
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Services
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Contact
              </Link>
            </Stack>
          </Grid>

          {/* Column 3: Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                info@interiordesign.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                123 Design Street, Creative City, ST 12345
              </Typography>
            </Stack>
          </Grid>

          {/* Column 4: Social */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Divider sx={{ width: '50px', backgroundColor: '#777', mb: 2 }} />
            <Stack direction="row" spacing={2}>
              <Link href="#" color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </Link>
              <Link href="#" color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </Link>
              <Link href="#" color="inherit" aria-label="Pinterest">
                <PinterestIcon />
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
