import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:3005/api';

const loginUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/designer/login`, userData);
  console.log(response?.data);

  const username = response?.data?.user?.designername;
  const role = response?.data?.user?.role;
  const des_id = response?.data?.user?._id;
  // const slotIds = response?.data?.user?.slots_booked?.map(slot => slot._id);
  // if (slotIds) {
  //   localStorage.setItem("slotIds", JSON.stringify(slotIds));
  // }
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("username", response?.data?.user?.designername);
  localStorage.setItem("des_id", response?.data?.user?._id);
  useUserStore.getState().setUser({
    username,
    role,
    des_id
  });
  return response.data;
};

const DesignerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      Swal.fire({
             icon: 'success',
             title: 'Success',
             text: data?.message || 'Login successfully updated! Pls wait Admin soon Active ur post',
             confirmButtonColor: '#3085d6',
           })
      navigate('/designer/dashboard');
    },
    onError: (err) => { Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: err?.response?.data?.message || 'Something went wrong',
            confirmButtonColor: '#d33',
          })},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f8f9fa, #e0e0e0)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          Designer Login
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, py: 1.2,backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff' }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" align="center">
          If u don't have any account?{' '}
          <Link to="/designer_register" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Register here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default DesignerLogin;
