import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../Api/axiosInstance/axiosInstance";
// services/ReviewService.js
const fetchUserReview = async ({ userId, designerId }) => {
  const res = await axiosInstance.get(`http://localhost:3005/api/singlereview/${userId}/${designerId}`);
  return res.data;
};
const ConsultationCard = ({ consultation, userId, reviewInput, setReviewInput, handleSubmitReview, isPosting, openReviewId, setOpenReviewId  }) => {
   const designerId = Array.isArray(consultation.designerId)
    ? consultation.designerId[0]?._id || consultation.designerId[0]
    : consultation.designerId;

  const { data: review } = useQuery({
    queryKey: ['review', userId, designerId],
    queryFn: () => fetchUserReview({ userId, designerId }),
    enabled: !!userId && !!designerId,
  });
  return (
    <div>
      {/* <h3>{consultation.title}</h3>
      <p>{consultation.date}</p> */}
       <Card key={consultation._id} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6">{consultation.designername}</Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {consultation.date} • Time: {consultation.time}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }} color="primary">
          Status: {consultation.status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {review ? (
          <Box mb={2} p={2} bgcolor="#f9f9f9" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Your Review
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {review.message}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography variant="body2" fontWeight={500}>Rating:</Typography>
              <Rating value={review.rating} readOnly size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary">
              By {review.name} on {review.date}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No review yet.</Typography>
        )}

        {consultation.status === 'completed' ? (
          <>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
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
        ) : (
          <Typography variant="body2" color="text.secondary">
            You can review after the consultation is complete.
          </Typography>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default ConsultationCard;
