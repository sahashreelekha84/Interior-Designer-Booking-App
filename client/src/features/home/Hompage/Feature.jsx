import { Box, Typography, Grid,  Container,  Card, CardContent} from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import WeekendIcon from '@mui/icons-material/Weekend';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import GroupIcon from '@mui/icons-material/Group';
import PlaceIcon from '@mui/icons-material/Place';
import React from 'react'

const Feature = () => {
    const features = [
  {
    icon: <DesignServicesIcon fontSize="large" />,
    title: 'Interior Design',
    description: 'Transform your space with expert design solutions',
  },
  {
    icon: <WeekendIcon fontSize="large" />,
    title: 'Furniture',
    description: 'Browse our curated selection of furniture',
  },
  {
    icon: <FormatPaintIcon fontSize="large" />,
    title: 'Paint Colors',
    description: 'Discover the perfect colors for your space',
  },
  {
    icon: <GroupIcon fontSize="large" />,
    title: 'User Designs',
    description: 'Get inspired by community designs',
  },
  {
    icon: <PlaceIcon fontSize="large" />,
    title: 'Nearby Pros',
    description: 'Find local interior design professionals',
  },
];
  return (
    <Box>
        <Container>
            
        <Box sx={{ px: 2, py: 6, backgroundColor: '#fff9ebff' }}>
            <Typography variant="h4" gutterBottom textAlign="center">
            Why Choose Us
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {features.map((item, index) => (
              <Grid item key={index} xs={12} sm={4} md={3}>
                <Card elevation={2} sx={{ p: 1, borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    {item.icon}
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Feature
