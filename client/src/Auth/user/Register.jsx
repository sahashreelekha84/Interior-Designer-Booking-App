import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  InputLabel
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:3005/api';

const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      
       Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data?.message || 'Registration successful! Please verify your email.',
                        confirmButtonColor: '#3085d6',
                      })
      setStep(2);
    },
    onError: (err) => {
      alert(err?.response?.data?.message || 'Registration failed');
    },
  });

 const handleSubmit = (e) => {
  e.preventDefault();

  // Basic field validations
  const errors = [];

  if (!formData.fullname.trim()) {
    errors.push('Full Name is required');
  } else if (!/^[A-Za-z\s]{2,}$/.test(formData.fullname)) {
    errors.push('Full Name must only contain letters and spaces');
  }

  if (!formData.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Invalid email format');
  }

  if (!formData.password) {
    errors.push('Password is required');
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)
  ) {
    errors.push('Password must be at least 8 characters, include upper/lowercase, number & special char');
  }

  if (!formData.phone) {
    errors.push('Phone number is required');
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.push('Phone number must be exactly 10 digits');
  }

  if (errors.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      html: `<ul style="text-align: left;">${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
    });
    return;
  }

  mutation.mutate(formData);
};


  const handleVerifyCode = async () => {
    if (!formData.email || !verificationCode) {
      
         Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text:  'Please enter your email and OTP',
                        confirmButtonColor: '#3085d6',
                      })
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/verifyotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: verificationCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmailVerified(true);
    
         Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text:  'Email verified successfully!',
                        confirmButtonColor: '#3085d6',
                      })
        navigate('/user/login');
      } else {
        alert(data.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error(err);
 
      Swal.fire({
                  icon: 'error',
                  title: 'Failed',
                  text:"Error verifying OTP",
                  confirmButtonColor: '#d33',
                })
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/resendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
       
         Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text:  'OTP resent successfully!',
                        confirmButtonColor: '#3085d6',
                      })
        startResendTimer();
      } else {
        alert(data.message || 'Failed to resend OTP');
         Swal.fire({
                  icon: 'error',
                  title: 'Failed',
                  text:" Failed to resend OTP",
                  confirmButtonColor: '#d33',
                })
      }
    } catch (err) {
      console.error(err);
     
       Swal.fire({
                  icon: 'error',
                  title: 'Failed',
                  text: err?.response?.data?.message || 'Error resending OTP',
                  confirmButtonColor: '#d33',
                })
    }
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    let countdown = 30;
    setResendTimer(countdown);

    const timer = setInterval(() => {
      countdown -= 1;
      setResendTimer(countdown);
      if (countdown <= 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 4 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          {step === 1 ? 'Create User Account' : 'Verify Your Email'}
        </Typography>

        {step === 1 ? (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
             <TextField
              fullWidth
              label="Phone"
              type="text"
              variant="outlined"
              margin="normal"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3,backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff'}}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        ) : (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              sx={{ mt: 2,backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff' }}
            >
              Verify Email
            </Button>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Typography variant="body2">Didn't get the code?</Typography>
              <Button
                onClick={handleResendOTP}
                disabled={resendDisabled}
                size="small"
                sx={{color:'#8a3d06ff',border:'2px solid #8a3d06ff'}}
              >
                {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Button>
            </Box>
            {emailVerified && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Your email has been verified!
              </Alert>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link to="/user/login" style={{ textDecoration: 'none' }}>
                Login here
              </Link>
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
