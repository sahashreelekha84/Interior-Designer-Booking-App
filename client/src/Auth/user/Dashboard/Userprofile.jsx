import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Paper,
    Button,
    Divider
} from '@mui/material';
import Usersideber from './Sideber';
import axiosInstance from '../../../Api/axiosInstance/axiosInstance';
import { useQuery } from '@tanstack/react-query';
const fetchuserprofile= async () => {
  const res = await axiosInstance.get('http://localhost:3005/api/userprofile');
  console.log('fetchuserprofile',res?.data?.data);
  
  return res?.data?.data;
};

const Userdashboardprofile = () => {
      const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchuserprofile,
      });
      console.log(profile);
        if (isLoading) return <Typography>Loading...</Typography>;
    return (
        <Box display="flex">
            {/* Sidebar */}

            <Usersideber />
            {/* Main Content */}
            <Box flexGrow={1} p={4} sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
                <Paper sx={{ maxWidth: 700, p: 4, mx: 'auto' }} elevation={3}>
                    {/* Profile Header */}
                    <Box textAlign="center" mb={3}>
                        <Avatar
                            src=""
                            alt="Dr. Richard James"
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h5" fontWeight="bold">{profile.fullname}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            {profile.email}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* About Section */}
                    <Box mb={3}>
                        <Typography fontWeight="bold" gutterBottom>About</Typography>
                        <Typography variant="body2" color="text.secondary">
                           a brief summary that introduces someone, often highlighting their professional role, key skills, and relevant experiences. It can be used for social media, professional profiles, or even in introductions at events. The goal is to give a quick, engaging overview of who the person is and what they do. 
                        </Typography>
                    </Box>

                  

                    {/* Save Button */}
                    <Box textAlign="right">
                        <Button variant="contained" sx={{backgroundColor:'#e07c35ff'}}>Save</Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Userdashboardprofile;
