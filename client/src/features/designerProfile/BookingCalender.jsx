import { Box } from '@mui/material';
import CalendarPicker from '../../components/CalenderPicker'; 
import { useEffect, useState } from 'react';

const BookingCalendar = ({ onDateChange }) => {
  const [values, setValues] = useState({ date: '', time: '' });

  useEffect(() => {
    if (onDateChange && values.date && values.time) {
      onDateChange(values);
    }
  }, [values, onDateChange]);

  return (
    <Box>
      <CalendarPicker onChange={setValues} />
    </Box>
  );
};

export default BookingCalendar;
