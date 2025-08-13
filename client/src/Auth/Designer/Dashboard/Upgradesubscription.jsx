import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpgradeSubscription = () => {
  const queryClient = useQueryClient();
  const [plan, setPlan] = useState('');
  const navigate = useNavigate();
  const designerId = localStorage.getItem('des_id');

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ designerId, subscriptionType }) => {
      const res = await axios.post(`http://localhost:3005/api/subscription`, {
        designerId,
        subscriptionType,
      });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data?.message || 'Subscription successfully updated!',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        queryClient.invalidateQueries(['subscription', designerId]);
        navigate('/designer/dashboard')
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error?.response?.data?.error || 'Something went wrong',
        confirmButtonColor: '#d33',
      })
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!designerId || !plan) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please select a subscription plan.',
      });
      return;
    }

    mutate({ designerId, subscriptionType: plan });
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
        <Typography variant="h5" align="center" color="primary" fontWeight="bold" gutterBottom>
          Upgrade Subscription
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth size="medium" sx={{ mb: 3 }}>
            <InputLabel id="plan-label">Select Subscription Plan</InputLabel>
            <Select
              labelId="plan-label"
              id="plan"
              value={plan}
              label="Select Subscription Plan"
              onChange={(e) => setPlan(e.target.value)}
            >
              <MenuItem value="">-- Choose a Plan --</MenuItem>
              <MenuItem value="1 Month">1 Month</MenuItem>
              <MenuItem value="3 Months">3 Months</MenuItem>
              <MenuItem value="6 Months">6 Months</MenuItem>
              <MenuItem value="1 Year">1 Year</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            disabled={isPending}
            variant="contained"
            sx={{
              backgroundColor: '#8a3d06',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#722e04',
              },
            }}
          >
            {isPending ? 'Processing...' : 'Upgrade Now'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UpgradeSubscription;
