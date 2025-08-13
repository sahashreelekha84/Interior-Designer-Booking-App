import React from 'react';
import {
  Box, Typography, Avatar, Paper, Button
} from '@mui/material';
import {
  Dashboard, EventNote, AccountCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <Box sx={{ width: 240, bgcolor: '#f8f9fb', height: '100vh', p: 3 }}>
    <Typography variant="h6" fontWeight="bold"sx={{color:'#8a3d06ff'}} m={3}p={3}>User Panel</Typography>
    <Box display="flex" flexDirection="column" gap={2} >
      <Button startIcon={<Dashboard />}sx={{color:'#e07c35ff'}} component={Link} to="/user/dashboard"fullWidth> Dashboard</Button>
     
      <Button startIcon={<AccountCircle /> }sx={{color:'#e07c35ff'}} component={Link} to="/user/profile" >Profile</Button>
       <Button startIcon={<AccountCircle /> } sx={{color:'#e07c35ff'}}component={Link} to="/user/consultations" >My Consultation</Button>
    </Box>
  </Box>
);

const Usersideber = () => {
  return (
    <Box display="flex">
      <Sidebar />
    </Box>
  );
};

export default Usersideber;
