import React from 'react';
import {
  Box, Typography, Avatar, Paper, Button
} from '@mui/material';
import {
  Dashboard, EventNote, AccountCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchdashbord } from '../../../services/ConsultationService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const Sidebar = ({ handleUpgradeClick }) => (
  
  <Box sx={{ width: 240, bgcolor: '#f8f9fb', height: '100vh', p: 3 }}>
    <Typography variant="h6" fontWeight="bold" mb={3}>Designer Panel</Typography>
    <Box display="flex" flexDirection="column" gap={2} >
      <Button startIcon={<Dashboard />} component={Link} to="/designer/dashboard"fullWidth> Dashboard</Button>
      <Button startIcon={<EventNote />}component={Link} to="/designer/bookingappointment" fullWidth> Bookings</Button>
      <Button startIcon={<AccountCircle /> } component={Link} to="/designer/profile" >Profile</Button>
       <Button startIcon={<AccountCircle /> } component={Link} to="/designer/uploads" >uploads</Button>
       
       <Button startIcon={<AccountCircle /> }  onClick={handleUpgradeClick}>upgrade_subscription</Button>
    </Box>
  </Box>
);

const Designersideber = () => {
     const { data: dashboard, isLoading } = useQuery({
      queryKey: ['dashboard'],
      queryFn: fetchdashbord,
    });
    console.log(dashboard);
    const navigate = useNavigate();
    const handleUpgradeClick = () => {
 

  if (!dashboard.subscriptionEnd || new Date(dashboard.subscriptionEnd) < new Date()) {
    // Subscription is expired or missing
    navigate('/designer/upgrade_subscription');
  } else {
    // Subscription is still active
    Swal.fire({
      icon: 'info',
      title: 'Subscription Active',
      text: 'You already have an active subscription.',
      confirmButtonText: 'OK',
    });
  }
}
     if (isLoading) return <Typography>Loading...</Typography>;
  return (
    <Box display="flex">
      <Sidebar handleUpgradeClick={handleUpgradeClick} />
    </Box>
  );
};

export default Designersideber;
