import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Divider
} from '@mui/material';
import Designersideber from './sideber';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../../services/ConsultationService';

const Designerdashboardprofile = () => {
    const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchUsers,
  });
  console.log(profile);
  
  if (isLoading) return <Typography>Loading...</Typography>;
  return (
    <Box display="flex">
      {/* Sidebar */}
      <Designersideber />

      {/* Main Content */}
      <Box flexGrow={1} p={4} sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
        <Paper sx={{ maxWidth: 700, p: 4, mx: 'auto' }} elevation={3}>
       
          <Box textAlign="center" mb={3}>
            <Avatar
              
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >{profile.designername.slice(0,1)}</Avatar>
            <Typography variant="h5" fontWeight="bold">{profile.designername}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box mb={3}>
            <Typography fontWeight="bold" gutterBottom>About</Typography>
            <Typography variant="body2" color="text.secondary">
             {profile.bio}
            </Typography>
          </Box>

         
          <Box mb={3}>
            <Typography fontWeight="bold">Style:</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>{profile.style}</Typography>

            <Typography fontWeight="bold">Address:</Typography>
            <Typography variant="body2" color="text.secondary">{profile.location}</Typography>
           
          </Box>

      
          <Box textAlign="right">
            <Button variant="contained" color="primary">Save</Button>
          </Box>
         
        </Paper>
      </Box>
    </Box>
  );
};

export default Designerdashboardprofile;
