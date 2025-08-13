import { Box, Typography, Card, CardContent, Button, Divider, TextField, Rating, Grid } from '@mui/material';
import { fetchconsultation } from '../../services/ConsultationService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import axiosInstance from '../../Api/axiosInstance/axiosInstance';
import Swal from 'sweetalert2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Usersideber from '../../Auth/user/Dashboard/Sideber';
const submitReview = async (reviewData) => {
  const response = await axiosInstance.post('http://localhost:3005/api/review', reviewData);
  return response.data;
};

const ConsultationsPage = () => {
  const queryClient = useQueryClient();
  const [editFormId, setEditFormId] = useState(null); // to track which consultation is being edited
  const [editData, setEditData] = useState({
    date: null,
    time: '',
    purpose: '',
  });

  const [openReviewId, setOpenReviewId] = useState(null);
  const userId = localStorage.getItem('userId'); // get current logged-in user
  const [reviewInput, setReviewInput] = useState({ name: '', message: '', rating: 0 });
  const { data: consultations, isLoading } = useQuery({
    queryKey: ['consultations'],
    queryFn: fetchconsultation,
  });
  // const designerId=consultations.slots_booked.map(x=>{return x._id})
  console.log(consultations);

  const { mutate: postReview, isPending: isPosting } = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {

      setReviewInput({ name: '', message: '', rating: 0 });
      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'Your review has been submitted.',
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: err?.response?.data?.message || 'Failed to submit review.',
      });
    },
  });

  const handleSubmitReview = (consultation) => {
    const { name, message, rating } = reviewInput;
    if (!name || !message || !rating) {
      return alert('Please fill in all review fields.');
    }

    const designerId =
      Array.isArray(consultation.designerId)
        ? consultation.designerId[0]?._id || consultation.designerId[0]
        : consultation.designerId;

    const newReview = {
      ...reviewInput,
      userId: localStorage.getItem('userId'),
      designerId,
      date: new Date().toLocaleDateString(),
    };

    postReview(newReview);
    setOpenReviewId(null); // close the form after submitting
  };

  const handleCancel = async (consultation) => {
    const userId = localStorage.getItem('userId');
    const designerId = Array.isArray(consultation.designerId)
      ? consultation.designerId[0]?._id || consultation.designerId[0]
      : consultation.designerId;

    try {
      await axiosInstance.post('http://localhost:3005/api/cancelAppointment', {
        userId,
        designerId,
        slotDate: consultation.date,
        slotTime: consultation.time,
        purpose: consultation.purpose || '',
      });

      Swal.fire('Cancelled!', 'Your consultation has been cancelled.', 'success');
      queryClient.invalidateQueries(['consultations']);
    } catch (error) {
      Swal.fire('Oops!', 'Cancellation failed. Try again.', 'error', error);
    }
  };
  const handleUpdate = async (consultation) => {
    const designerId = Array.isArray(consultation.designerId)
      ? consultation.designerId[0]?._id || consultation.designerId[0]
      : consultation.designerId;

    try {
      await axiosInstance.post(`http://localhost:3005/api/updateAppointment`, {
        userId,
        designerId,
        slotDate: dayjs(editData.date).format('DD/MM/YYYY'),
        slotTime: editData.time,
        purpose: editData.purpose,
      });

      Swal.fire('Updated!', 'Your consultation has been updated.', 'success');
      queryClient.invalidateQueries(['consultations']);
      setEditFormId(null);
      // Optionally refetch consultations here
    } catch (error) {
      Swal.fire('Oops!', 'Update failed. Try again.', 'error');
      console.error(error);
    }
  };




  if (isLoading) return <Typography>Loading...</Typography>;
  const slots_book = consultations.flatMap(x => x.slots_booked || []);
  console.log(slots_book);
  const bookedSlots = slots_book || [];

  // console.log(bookedSlots);
  // Filter consultations for current user
  const userConsultations = bookedSlots.filter(
    (slot) => slot.userId === userId
  );
  console.log(userConsultations);
  return (
    <Grid container>
      <Grid item xs={12} sm={3} md={2}>
        <Usersideber />
      </Grid>
      <Box p={4} flexGrow={1} sx={{ bgcolor: '#f4f6f9', minHeight: '100vh' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{textAlign:'center'}}>
          My Consultations
        </Typography>

        {userConsultations.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No consultations yet.
          </Typography>
        ) : (
          userConsultations.map((consultation) => (
            <Card key={consultation._id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">{consultation.designername}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {consultation.date} • Time: {consultation.time}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 ,color:'#e07c35ff'}}>
                  Status: {consultation.status}
                </Typography>

                <Divider sx={{ my: 2 }} />


                {consultation.status === 'booked' && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setEditFormId(editFormId === consultation._id ? null : consultation._id);
                        setEditData({
                          date: dayjs(consultation.date, 'DD/MM/YYYY'),
                          time: consultation.time,
                          purpose: consultation.purpose || '',
                        });
                      }}
                    >
                      Edit Booking
                    </Button>

                    {editFormId === consultation._id && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box mt={2} display="flex" flexDirection="column" gap={2}>
                          <DatePicker
                            label="New Date"
                            value={editData.date}
                            onChange={(newDate) =>
                              setEditData((prev) => ({ ...prev, date: newDate }))
                            }
                          />
                          <TextField
                            label="New Time"
                            value={editData.time}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, time: e.target.value }))
                            }
                          />
                          <TextField
                            label="Purpose"
                            value={editData.purpose}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, purpose: e.target.value }))
                            }
                          />

                          <Box display="flex" gap={2}>
                            <Button
                              variant="contained"
                              onClick={() => {
                                // your update API logic here
                                // console.log('Update API call here');
                                Swal.fire({
                                  title: 'Are you sure?',
                                  text: 'You are about to update this consultation.',
                                  icon: 'success',
                                  showCancelButton: true,
                                  confirmButtonColor: '#d33',
                                  cancelButtonColor: '#3085d6',
                                  confirmButtonText: 'Yes, update it!',
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleUpdate(consultation);
                                  }
                                });
                                setEditFormId(null);
                              }}
                            >
                              Update
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                Swal.fire({
                                  title: 'Are you sure?',
                                  text: 'You are about to cancel this consultation.',
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#d33',
                                  cancelButtonColor: '#3085d6',
                                  confirmButtonText: 'Yes, cancel it!',
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleCancel(consultation);
                                  }
                                });
                              }}
                            >
                              Cancel Booking
                            </Button>
                          </Box>
                        </Box>
                      </LocalizationProvider>
                    )}
                  </>
                )}


                {consultation.status === 'completed' ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{color:'#8a3d06ff',border:'2px solid #8a3d06ff'}}
                      onClick={() =>
                        setOpenReviewId(openReviewId === consultation._id ? null : consultation._id)
                      }
                    >
                      {isPosting ? 'Submitting...' : 'Leave/Edit Review'}
                    </Button>

                    {openReviewId === consultation._id && (
                      <Box mt={2} display="flex" flexDirection="column" gap={2}>
                        <TextField
                          label="Your Name"
                          variant="outlined"
                          size="small"
                          value={reviewInput.name}
                          onChange={(e) => setReviewInput({ ...reviewInput, name: e.target.value })}
                        />
                        <TextField
                          label="Your Review Message"
                          variant="outlined"
                          multiline
                          rows={3}
                          value={reviewInput.message}
                          onChange={(e) => setReviewInput({ ...reviewInput, message: e.target.value })}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>Rating:</Typography>
                          <Rating
                            name="rating"
                            value={reviewInput.rating}
                            onChange={(e, newValue) =>
                              setReviewInput({ ...reviewInput, rating: newValue })
                            }
                          />
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => handleSubmitReview(consultation)}
                          disabled={isPosting}
                        >
                          {isPosting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </Box>
                    )}
                  </>
                ) : consultation.status !== 'booked' && (
                  <Typography variant="body2" color="text.secondary">
                    You can review after the consultation is complete.
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>

    </Grid>

  );
};

export default ConsultationsPage;
