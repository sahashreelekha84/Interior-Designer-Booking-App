import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const postFormData = async (formInput) => {
  console.log(formInput);
  
  try {
    const response = await axios.post('http://localhost:3005/api/usermessage', formInput, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw error; // important for useMutation to detect failure
  }
};
const Contact = () => {
  const [formData, setFormData] = useState({fullname: '',
    email: '',
    phone: '',
    subject: '',
    message: '', });
 

  const mutation = useMutation({
      mutationFn: postFormData ,
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        alert('Message send successful');
        
      },
      onError: (err) => alert(err.response?.data?.message || 'Login failed'),
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      mutation.mutate(formData);
    };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/023/550/315/small/interior-with-armchair-and-coffee-table-ai-generated-photo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          py: 14,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact Us
          </Typography>
          <Typography variant="h6" mt={2}>
            Let’s bring your dream space to life
          </Typography>
        </Box>
      </Box>

      {/* Get in Touch Title */}
      <Container sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#5c3d2e", mb: 1 }}
          >
            Get In Touch
          </Typography>
          <Divider
            sx={{
              width: 60,
              height: 3,
              backgroundColor: "#bfa27a",
              mx: "auto",
              mb: 2,
              borderRadius: 2,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            We'd love to hear from you — share your vision and let's make it real.
          </Typography>
        </Box>
        <Box sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#f5efe6",
                p: 4,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#5c3d2e", mb: 2 }}
              >
                Contact Details
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                📍 123 Interior Blvd, Design City, IN 560001
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                📞 +91 727887458
              </Typography>
              <Typography variant="body1">📧 sahashreelekha2000@gmail.com</Typography>
            </Box>
          </Grid>
        </Box>
        {/* Paper Wrapper */}
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            p: 4,
            borderRadius: 3,
            backgroundColor: '#efebe9',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Typography variant="h5" mb={3} color="#4E342E" fontWeight={600}>
            Get In Touch
          </Typography>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              type='text'
              variant="outlined"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            <TextField
              fullWidth
              label="Email"
              type='text'
              variant="outlined"
              value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            <TextField
              fullWidth
              label="Phone"
              type='text'
              variant="outlined"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
              type='text'
              value={formData.subject}
               onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            <TextField
              fullWidth
              label="Message"
              type='text'
              multiline
              rows={4}
              variant="outlined"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              sx={{ mb: 3, backgroundColor: '#fff' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
             disabled={mutation.isPending}
              sx={{
                backgroundColor: '#6D4C41',
                '&:hover': { backgroundColor: '#5D4037' },
              }}
            >
               {mutation.isPending ? 'Sending...' : 'Submit'}
            </Button>

            {/* {isSuccess && <Typography mt={2} color="green">Message sent successfully!</Typography>}
            {isError && <Typography mt={2} color="red">Failed to send message.</Typography>} */}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Contact;
