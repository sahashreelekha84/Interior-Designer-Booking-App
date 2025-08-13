import React from 'react'
import { Box, Typography, Grid, TextField, MenuItem, Button, Container, IconButton, Paper, Card, CardContent,RadioGroup, FormControlLabel, Radio,FormGroup,Checkbox} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
const testimonials = [
    {
      quote: 'Amazing experience! I found the best designer for my home.',
      author: 'Priya, Mumbai',
    },
    {
      quote: 'Easy to use and great professionals. Loved it!',
      author: 'Rohit, Bangalore',
    },
    {
      quote: 'Perfect place for anyone moving into a new home.',
      author: 'Anjali, Delhi',
    },
    {
      quote: 'Highly recommend it to anyone looking for interiors.',
      author: 'Rahul, Pune',
    },
  ];
const Testimonial = () => {
  return (
 <Box>
        {/* TESTIMONIAL SECTION */}
   <Box sx={{ py: 6 }}>
      <Container>
        <Typography variant="h4" gutterBottom textAlign="center">
          What Our Clients Say
        </Typography>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            600: { slidesPerView: 1 },
            900: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <Typography>"{item.quote}"</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  — {item.author}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
 </Box>
  )
}

export default Testimonial
