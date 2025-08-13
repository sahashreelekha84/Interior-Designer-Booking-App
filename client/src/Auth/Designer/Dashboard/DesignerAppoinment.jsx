import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack
} from '@mui/material';
import Designersideber from './sideber';
import { fetchappointment } from '../../../services/designerService';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../Api/axiosInstance/axiosInstance';

const DesignerAppoinment = () => {
  const designerId = localStorage.getItem('des_id');
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment'],
    queryFn: fetchappointment,
  });

  const [updatedStatuses, setUpdatedStatuses] = useState({});

  const handleCancel = async (userId, designerId, slotDate, slotTime, rowId) => {
    try {
      await axiosInstance.post(`http://localhost:3005/api/cancelAppointment`, {
        userId,
        designerId,
        slotDate,
        slotTime
      });
      setUpdatedStatuses(prev => ({ ...prev, [rowId]: 'cancelled' }));
    } catch (error) {
      console.error('Cancel failed:', error.message);
    }
  };

  const handleConfirm = async (userId, designerId, slotDate, slotTime) => {
    try {
      await axiosInstance.post(`http://localhost:3005/api/confirmedAppointment`, {
        userId,
        designerId,
        slotDate,
        slotTime
      });
      setUpdatedStatuses((prev) => ({ ...prev, [`${userId}-${slotDate}-${slotTime}`]: 'confirmed' }));
    } catch (error) {
      console.error('Confirm failed:', error.message);
    }
  };

  const handleComplete = async (userId, designerId, slotDate, slotTime) => {
    try {
      await axiosInstance.post(`http://localhost:3005/api/completeAppointment`, {
        userId,
        designerId,
        slotDate,
        slotTime
      });
      setUpdatedStatuses((prev) => ({ ...prev, [`${userId}-${slotDate}-${slotTime}`]: 'completed' }));
    } catch (error) {
      console.error('Complete failed:', error.message);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box display="flex">
      <Designersideber />
      <Box p={3} flex={1}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          All Appointments
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f4f6f8' }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointment && appointment.length > 0 ? (
                appointment.map((item, index) => {
                  const statusKey = `${item.userId}-${item.date}-${item.time}`;
                  const rowStatus = updatedStatuses[statusKey] || item.status;

                  return (
                    <TableRow key={item._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.purpose}</TableCell>
                      <TableCell>{rowStatus}</TableCell>
                      <TableCell align="center">
                        {rowStatus !== 'cancelled' && (
                          <>
                            {(rowStatus === 'booked' || rowStatus === 'pending') ? (
                              <Stack direction="row" spacing={1}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleCancel(item.userId, designerId, item.date, item.time)
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  size="small"
                                  onClick={() =>
                                    handleConfirm(item.userId, designerId, item.date, item.time)
                                  }
                                >
                                  Confirm
                                </Button>
                              </Stack>
                            ) : rowStatus === 'confirmed' ? (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() =>
                                  handleComplete(item.userId, designerId, item.date, item.time)
                                }
                              >
                                Complete
                              </Button>
                            ) : null}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No appointments till now
                  </TableCell>
                </TableRow>
              )}


            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DesignerAppoinment;
