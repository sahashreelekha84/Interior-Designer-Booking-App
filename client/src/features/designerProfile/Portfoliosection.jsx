// src/features/designerProfile/PortfolioSection.jsx

import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Stack,
  Button,
  Container,
  CardContent,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = ['All', 'Interior', 'Paint', 'Furniture'];

const fetchPortfolios = async (category) => {
  const endpoint = 'http://localhost:3005/api/detailDesigner';

  const res = await axios.get(endpoint);
  const designers = res?.data?.data || [];

  // Extract and flatten all portfolios
  const allPortfolios = designers.flatMap((designer) =>
    (designer.portfolio || []).map((item) => ({
      ...item,
      _id: designer._id + '_' + item.title, // unique key
    }))
  );

  //  Filter based on category if not "All"
  if (category !=='All') {
    return allPortfolios.filter((item) => item.category === category);
  }

  return allPortfolios;
};


const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: portfolios = [], isLoading, isError } = useQuery({
    queryKey: ['portfolios', selectedCategory],
    queryFn: () => fetchPortfolios(selectedCategory),
    staleTime: 5 * 60 * 1000,
  });
  console.log(portfolios);

  return (
    <Container maxWidth="xl">
      <Box mt={6}>
        <Typography variant="h6" gutterBottom fontWeight={600} textAlign="center"sx={{m:5}}>
          Design Portfolio
        </Typography>

        {/* Category Filter */}
        <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" justifyContent="center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat }
              onClick={() => setSelectedCategory(cat)}
              sx={{ textTransform: 'none', borderRadius: 5, px: 3,color:'#e68641ff',border:'2px solid #8a3d06ff'}}
            >
              {cat}
            </Button>
          ))}
        </Stack>

        {/* Portfolio Gallery */}
        {isLoading ? (
          <Typography textAlign="center">Loading...</Typography>
        ) : isError ? (
          <Typography color="error" textAlign="center">Failed to load portfolio.</Typography>
        ) : portfolios.length === 0 ? (
          <Typography textAlign="center">No portfolio found.</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {portfolios.map((item) =>
              item.images.map((img, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`${item._id}_${i}`}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:3005/${img.replace(/\\/g, '/')}`}
                      alt={`Portfolio ${i + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.title || `Project ${i + 1}`}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1, textTransform: 'none', borderRadius: 5 ,color:'#8a3d06ff',border:'2px solid #8a3d06ff'}}
                        component={Link}to={`/designer/${item.designerId}`}
                      >
                        View More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PortfolioSection;
