// src/features/reviews/ReviewForm.jsx

import { Box, TextField, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const ReviewForm = ({ onSubmit, initialData = {} }) => {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (initialData && initialData.comment) {
      setComment(initialData.comment);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit({ comment });
      setComment('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {initialData?.id ? 'Edit Review' : 'Leave a Review'}
      </Typography>

      <TextField
        label="Your review"
        fullWidth
        multiline
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        margin="normal"
      />

      <Button variant="contained" onClick={handleSubmit}>
        {initialData?.id ? 'Update' : 'Submit'}
      </Button>
    </Box>
  );
};

export default ReviewForm;
