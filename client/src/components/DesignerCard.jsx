import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { fetchconsultation } from '../services/ConsultationService';
import { useQuery } from '@tanstack/react-query';
const DesignerCard = ({ designer }) => {
  const designerId=localStorage.getItem('des_id')
  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchconsultation,
  })
  
 
  const review = reviews?.flatMap(x => x?.review || []) || [];
  console.log('review',review);
  const coming_review = review || [];
  // console.log('coming_review',coming_review);
  
  const userreview = coming_review?.filter(
    (slot) => slot.designerId === designerId
  );
  console.log(userreview);
  
  return (
    <Card>
     
      <img src={`http://localhost:3005/${designer.image}`} alt={designer.name} height={300}width={300}></img>
      <CardContent>
        <Typography variant="h6" sx={{fontWeight:'500'}}>{designer.designername}</Typography>
        <Typography variant="body2" color="text.secondary">
          {designer.style} • {designer.location}
        </Typography>
        <Typography variant="body2">⭐3</Typography>
        {/* <RatingStars value={designer.rating} /> */}
      </CardContent>
      <CardActions>
        <Button size="small"sx={{color:'#a04504ff'}} component={Link} to={`/designer/${designer._id}`}>
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default DesignerCard;