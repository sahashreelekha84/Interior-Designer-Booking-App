import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

const CalenderPicker= ({ onDateChange }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (onDateChange && date && time) {
      onDateChange({ date, time });
    }
  }, [date, time, onDateChange]);

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <TextField
        type="date"
        placeholder="Select Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        sx={{ minWidth: 200 }}
      />
      <TextField
        type="time"
        placeholder="Select Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
};

export default CalenderPicker;
