import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3005/api/forgetpassword', { email });
      console.log('token',res?.data?.token);
      
      setMsg(res.data.message);
      setErr('');
      navigate(`/user/restpassword/${res?.data?.token}`)
    } catch (error) {
      setErr(error.response?.data?.message || 'Error sending email');
      setMsg('');
    }
  };

  return (
    <Box   sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}>
        <Paper elevation={6} sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 4 }}>
         <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      {msg && <Alert severity="success">{msg}</Alert>}
      {err && <Alert severity="error">{err}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{backgroundColor:'#8a3d06ff',border:'2px solid #8a3d06ff'}}>
          Send Reset Link
        </Button>
      </form>
        </Paper>
     
    </Box>
  );
};

export default ForgotPassword;
