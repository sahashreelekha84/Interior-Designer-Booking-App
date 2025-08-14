import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Paper,
  TextField,
  Rating,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
const bookAppointment = async (bookingInfo) => {
  const { userId, designerId, date, time ,purpose} = bookingInfo;
  const response = await axios.post('http://localhost:3005/api/bookappointment', {
    userId,
    designerId,
    slotDate: date,
    slotTime: time,
    purpose:purpose
  });
  return response.data;
};

const submitReview = async (reviewData) => {
  const response = await axios.post('http://localhost:3005/api/review', reviewData);
  return response.data;
};

const DesignerProfilePage = () => {
  const { _id } = useParams();
  const designerId = _id;
  const userId = localStorage.getItem('userId');
  const [designerData, setDesignerData] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setpurpose] = useState('');
  const [showBookingAlert, setShowBookingAlert] = useState(false);
  // const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState({ name: '', message: '', rating: 0 });

  const queryClient = useQueryClient();

  const allReviews = async () => {
    const response = await axios.get(`http://localhost:3005/api/editdesigner/${_id}`);
    return response?.data?.data?.review || [];
  };

  const { data: allReview = [], isLoading } = useQuery({
    queryKey: ['allReview', _id],
    queryFn: allReviews,
  });

  console.log(allReview);


  useEffect(() => {
    const fetchDesigner = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/api/detailDesigner`);
        const foundDesigner = res?.data?.data?.find((d) => d._id === _id);
        setDesignerData(foundDesigner);
      } catch (err) {
        console.error('Failed to fetch designer:', err);
      }
    };
    fetchDesigner();
  }, [_id]);

  const { mutate: postReview, isPending: isPosting } = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allReview', _id] });
      setReviewInput({ name: '', message: '', rating: 0 });
      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'Your review has been submitted.',
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: err?.response?.data?.message || 'Failed to submit review.',
      });
    },
  });

  const handleSubmitReview = () => {
    const { name, message, rating } = reviewInput;
    if (!name || !message || !rating) {
      return alert('Please fill in all review fields.');
    }
    const newReview = {
      ...reviewInput,
      designerId: designerData._id,
      userId: localStorage.getItem('userId'),
      date: new Date().toLocaleDateString(),
    };
    postReview(newReview);
  };

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] }).then(()=>{})

      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: 'Your appointment has been booked.',
        timer: 2500,
        showConfirmButton: false,
      });
      setShowBookingAlert(true);
      setpurpose('')
      setDate('');
      setTime('');
      setTimeout(() => {
        setShowBookingAlert(false);
        navigate('/');
      }, 3000);
    },
    onError: (err) => {
      const statusCode = err?.response?.status;
      const message = err?.response?.data?.message || err.message;
      if (statusCode === 404) {
        if (message === 'User not found') {
          Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'You are not a valid user. Please log in as a user.',
          });
          navigate('/user/login');
        } else if (message === 'Cannot book a slot on a past time or past date') {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Time',
            text: 'Cannot book a past time. Choose a valid date/time.',
          });
        } else if (message === 'You have already booked an appointment on this date') {
          Swal.fire({
            icon: 'info',
            title: 'Already Booked',
            text: 'You have already booked a slot on this date.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: message,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: message,
        });
      }
      setDate('');
      setTime('');
    },
  });

  const handleBook = () => {
    if (!date || !time) return alert('Please select both date and time');
    mutate({ userId, designerId, date, time ,purpose});
  };

  if (!designerData) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Loading designer profile...</Typography>
      </Box>
    );
  }
  if (isLoading) return <Typography>Loading...</Typography>;
  return (
    <Box sx={{ p: 4, backgroundColor: '#f3ebe3', minHeight: '100vh' }}>
      {/* Profile Header */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 3,
          backgroundColor: '#5D4037',
          color: 'white',

          mx: 'auto',     // centers the Paper on the page
          textAlign: 'center', // centers text inside Grid item
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item>
            <Avatar
              alt={designerData.name}
              src={`http://localhost:3005/${designerData.image}`}
              sx={{ width: 100, height: 100, border: '3px solid #d7ccc8', mx: 'auto' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" fontWeight={600}>
              {designerData.designername}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#d7ccc8' }}>
              {designerData.style} • {designerData.location}
            </Typography>
            <Typography variant="body1" mt={2}>
              {designerData.bio}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Portfolio Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          backgroundColor: '#d7ccc8',

          mx: 'auto',     // horizontally center the Paper
          textAlign: 'center' // center heading text
        }}
      >
        {designerData.portfolio?.length > 0 && (
          <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#efebe9' }}>
            <Typography variant="h5" mb={2} color="#4E342E">
              Portfolio
            </Typography>
            <Grid container spacing={3}>
              {designerData.portfolio.map((item) =>
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

                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>
        )}
      </Paper>

      {/* Booking Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          backgroundColor: '#d7ccc8',

          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom color="#4E342E">
          Book an Appointment
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Your Purpose"
              type='text'
              variant="outlined"
              value={purpose}
              onChange={(e) => setpurpose( e.target.value )}
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Date (DD/MM/YYYY)"
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Time (HH:MM)"
              variant="outlined"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} sm={10} textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleBook}
              disabled={isPending}
              sx={{
                backgroundColor: '#6D4C41',
                '&:hover': { backgroundColor: '#5D4037' },
                px: 6,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {isPending ? 'Booking...' : 'BOOK NOW'}
            </Button>
          </Grid>

          {showBookingAlert && (
            <Grid item xs={12}>
              <Typography color="green">Booking successful!</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>


      {/* Review Form + Review List */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, backgroundColor: '#efebe9', margin: '0 auto' }}>
        <Typography variant="h5" mb={3} color="#4E342E" fontWeight={600}>Leave a Review</Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Your Name"
            variant="outlined"
            value={reviewInput.name}
            onChange={(e) => setReviewInput({ ...reviewInput, name: e.target.value })}
            sx={{ mb: 2, backgroundColor: '#fff' }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="#4E342E" fontWeight={500} gutterBottom>Rating</Typography>
            <Rating
              value={reviewInput.rating}
              onChange={(_, newValue) => setReviewInput({ ...reviewInput, rating: newValue })}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            label="Your Message"
            multiline
            rows={4}
            variant="outlined"
            value={reviewInput.message}
            onChange={(e) => setReviewInput({ ...reviewInput, message: e.target.value })}
            sx={{ mb: 3, backgroundColor: '#fff' }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmitReview}
            disabled={isPosting}
            sx={{ backgroundColor: '#6D4C41', '&:hover': { backgroundColor: '#5D4037' } }}
          >
            {isPosting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Box>

        <Box mt={5}>
          <Typography variant="h6" mb={2} color="#4E342E" fontWeight={600}>
            What others say
          </Typography>

          {allReview.length === 0 ? (
            <Typography>No reviews yet.</Typography>
          ) : (
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              style={{ paddingBottom: '2rem' }}
            >
              {allReview.map((review, idx) => (
                <SwiperSlide key={idx}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: '#fff',
                      borderLeft: '4px solid #6D4C41',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      minHeight: 150,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {review.name}{' '}
                      <Rating value={Number(review.rating)} readOnly size="small" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      "{review.message}"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Paper>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>

      </Paper>
    </Box>
  );
};

export default DesignerProfilePage;
