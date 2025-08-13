import { Box, Typography, Rating, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ReviewList = ({ reviews, onEdit }) => {
  if (!reviews?.length) {
    return <Typography>No reviews yet.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {reviews.map((review) => (
        <Paper key={review.id} sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Rating value={review.rating} readOnly />
            {onEdit && (
              <IconButton onClick={() => onEdit(review)}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {review.comment}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(review.date).toLocaleDateString()}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ReviewList;
