import React from 'react';
import {
  Box, Typography, Paper, Avatar, List, ListItem,
  ListItemAvatar, ListItemText, Divider, Grid
} from '@mui/material';
import {
  MonetizationOn, EventNote, Person
} from '@mui/icons-material';
import Designersideber from './sideber'; // Sidebar component
import { fetchdashbord } from '../../../services/ConsultationService';
import { useQuery } from '@tanstack/react-query';

const bookings = [
  { name: 'Avinash Kr', date: '5 Oct 2024', status: 'Pending' },
  { name: 'GreatStack', date: '26 Sep 2024', status: 'Cancelled' },
  { name: 'GreatStack', date: '25 Sep 2024', status: 'Completed' },
  { name: 'GreatStack', date: '23 Sep 2024', status: 'Completed' },
];


const StatCard = ({ icon, label, value }) => (
  <Paper sx={{ p: 2, textAlign: 'center', flex: 1 }}>
    <Avatar sx={{ bgcolor: '#1976d2', mx: 'auto', mb: 1 }}>
      {icon}
    </Avatar>
    <Typography variant="h6">{value}</Typography>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
  </Paper>
);

const Designerdashbord = () => {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchdashbord,
  });
  console.log(dashboard);

  if (isLoading) return <Typography>Loading...</Typography>;
  return (
    <Box display="flex">
      {/* Sidebar */}
      <Designersideber />

      {/* Main Content */}
      <Box p={4} flexGrow={1} sx={{ bgcolor: '#f4f6f9', minHeight: '100vh' }}>
        {/* Top Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<MonetizationOn />} label="Subscription" value={dashboard.subscriptionType} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<EventNote />} label="Appointments" value={dashboard.bookedCount} />
          </Grid>
      
          <Grid item xs={12} sm={4}>
            <StatCard icon={<Person />} label="Clients" value={dashboard.totalClients} />
          </Grid>
              <Grid item xs={12} sm={4}>
            <StatCard icon={<EventNote />} label="SubscriptionStart" value={dashboard.subscriptionStart} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<EventNote />} label="SubscriptionEnd" value={dashboard.subscriptionEnd} />
          </Grid>
        </Grid>

        {/* Latest Bookings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Latest Bookings
          </Typography>
          <List>
            {dashboard?.slots_booked?.map((booking, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src="/user-avatar.png" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography color="primary" sx={{ fontWeight: 500 }}>
                        {booking.user}
                      </Typography>
                    }
                    secondary={`Booking on ${booking.date}`}
                  />
                  <Box ml="auto">
                    {booking.status === 'completed' && (
                      <Typography color="green">Completed</Typography>
                    )}
                    {booking.status === 'Confirmed' && (
                      <Typography color="green">Confirmed</Typography>
                    )}
                    {booking.status === 'cancelled' && (
                      <Typography color="red">Cancelled</Typography>
                    )}
                    {booking.status === 'booked' && (
                      <Typography color="orange">Pending</Typography>
                    )}
                  </Box>
                </ListItem>
                {index < bookings.length - 1 && <Divider />}
                {index < dashboard?.slots_booked?.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Designerdashbord;
