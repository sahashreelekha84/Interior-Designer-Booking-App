import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,

  Divider,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import Swal from 'sweetalert2';
const Login = () => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });

  const navigate = useNavigate();
  // Mutation for login
  const loginMutation = useMutation({

    mutationFn: async (data) => {
      const response = await axios.post('http://localhost:3005/api/login', data);
      const username = response?.data?.user?.fullname;
      const role = response?.data?.user?.role;
      const userId = response?.data?.user?._id;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username",response?.data?.user?.fullname);
      localStorage.setItem("userId", response?.data?.user?._id);
      useUserStore.getState().setUser({
        username,
        role,
        userId
      });

      return response.data;
    },
    onSuccess: (data) => {
       Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: data?.message || 'Login successfully updated!',
                  confirmButtonColor: '#3085d6',
                })

      navigate('/')
    },
    onError: (err) => {
      Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: err?.response?.data?.message || 'Something went wrong',
            confirmButtonColor: '#d33',
          })
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <Box
      sx={{


        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Welcome To user Login
          </Typography>

          {/* Image and form side-by-side */}
          <Grid container spacing={2} alignItems="center">
            {/* Left image */}
            <Grid item xs={4} md={3}>
              <Box
                component="img"
                src="https://i.pinimg.com/736x/21/20/b0/2120b058cb9946e36306778243eadae5.jpg" // replace with your image path
                alt="Login illustration"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            </Grid>

            {/* Right form fields */}
            <Grid item xs={8} md={9}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 ,backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff'}} 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Logging in…' : 'Login'}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom links */}
          <Typography align="center" sx={{ mt: 3 }}>
            Don’t have an account?{' '}
            <Link to="/user/register" underline="hover">
              Register here
            </Link>
          </Typography>

          <Box textAlign="right" sx={{ mt: 2, }}>
            <Typography sx={{color: '#e48948ff'}}> <Link to="/user/forgetpassword" variant="body2">
              Forgot Password?
            </Link></Typography>
           
          </Box>
          <Divider sx={{ my: 3 }} />
     <Typography variant="body2"align="center" sx={{ mt: 3 }}>
            If u are a Designer & Don’t have an account?{' '}
            <Link to="/designer_register" underline="hover">
              Register here
            </Link>
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" align="center">
            If u are a Designer and already have account?{' '}
            <Link to="/designer_login" style={{ textDecoration: 'none', color: '#e48948ff' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>




    </Box>
  );
};

export default Login;
