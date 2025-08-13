// src/pages/UserDashboard.jsx
import {
  Box, Typography, CircularProgress, Alert, Grid, Paper, Avatar, List, ListItem,
  ListItemAvatar, ListItemText, Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../Api/axiosInstance/axiosInstance';
import Usersideber from './Sideber';
import { fetchconsultation } from '../../../services/ConsultationService';
import {
  MonetizationOn, EventNote, Person
} from '@mui/icons-material';
const getUserDashboardData = async () => {
  const res = await axiosInstance.get('http://localhost:3005/api/userdashboard');
  return res.data.data;
};
const StatCard = ({ icon, label, value }) => (
  <Paper sx={{ p: 2, textAlign: 'center', flex: 1 }}>
    <Avatar sx={{ bgcolor: '#e07c35ff', mx: 'auto', mb: 1 }}>
      {icon}
    </Avatar>
    <Typography variant="h6">{value}</Typography>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
  </Paper>
);
const UserDashboard = () => {
  const userId = localStorage.getItem('userId')
  const { data: userDashboard, isLoading, isError, error } = useQuery({
    queryKey: ['userDashboard'],
    queryFn: getUserDashboardData,
  });
  console.log(userDashboard);
  const { data: consultations } = useQuery({
    queryKey: ['consultations'],
    queryFn: fetchconsultation,
  });
  // const designerId=consultations.slots_booked.map(x=>{return x._id})
  //console.log(consultations);
  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchconsultation,
  })
  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;
  const slots_book = consultations?.flatMap(x => x?.slots_booked || []) || [];
  console.log(slots_book);
  const bookedSlots = slots_book || [];
  const userConsultations = bookedSlots?.filter(
    (slot) => slot.userId === userId
  );
  const userConsultationscomplete = bookedSlots?.filter(
    (slot) => slot.status === 'completed'&&slot.userId === userId
  );
  const userConsultationsbook = bookedSlots?.filter(
    (slot) => slot.status === 'booked'&&slot.userId === userId
  );
  const userConsultationsconfirm = bookedSlots?.filter(
    (slot) => slot.status === 'confirmed'&&slot.userId === userId
  );
  const userConsultationscancel = bookedSlots?.filter(
    (slot) => slot.status === 'cancelled'&&slot.userId === userId
  );
  console.log('userConsultationscance',userConsultationscancel);
  
  const review = reviews?.flatMap(x => x?.review || []) || [];
  console.log('review',review);
  const coming_review = review || [];
  const userreview = coming_review?.filter(
    (slot) => slot.userId === userId
  );
  //console.log(userConsultations?.length || 0);
  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={12} sm={3} md={2}>
        <Usersideber />
      </Grid>


      <Box p={4} flexGrow={1} sx={{ bgcolor: '#f4f6f9', minHeight: '100vh' }}>
        {/* Top Stats */}
        <Grid container spacing={3} m={4}>
          <Grid item xs={12} sm={4} lg={4}p={2}>
            <StatCard icon={<MonetizationOn />} label="Consultations" value={userConsultations?.length || 0} />
          </Grid>
          <Grid item xs={12} sm={4} lg={4} p={2}>
            <StatCard icon={<Person />} label="Reviews" value={userreview?.length || 0} />
          </Grid>

          <Grid item xs={12} sm={4}lg={4} p={2}>
            <StatCard icon={<EventNote />} label="Complete" value={userConsultationscomplete?.length || 0} />
          </Grid>
          <Grid item xs={12} sm={4} lg={4}p={2}>
            <StatCard icon={<EventNote />} label="Booked" value={userConsultationsbook.length || 0} />
          </Grid>
          <Grid item xs={12} sm={3} lg={4}p={2}>
            <StatCard icon={<EventNote />} label="Confirmed" value={userConsultationsconfirm?.length || 0} />
          </Grid>
          <Grid item xs={12} sm={3}lg={4} p={2}>
            <StatCard icon={<EventNote />} label="Canceled" value={userConsultationscancel?.length || 0} />
          </Grid>
        </Grid>


        {/* Latest Bookings */}
        {/* <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Latest Bookings
          </Typography>
          <List>
            {userreview?.map((review, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src="/user-avatar.png" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography color="primary" sx={{ fontWeight: 500 }}>
                        {review.name}
                      </Typography>
                    }

                  />
                  <Box ml="auto">

                    <Typography color="green">{review.message}</Typography>


                  </Box>
                </ListItem>

                {index < review.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper> */}
      </Box>
    </Grid>
  );
};

export default UserDashboard;
