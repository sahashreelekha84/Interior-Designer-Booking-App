import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { Card, CardContent, CardMedia } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:3005/api/detailDesigner');
  return res?.data?.data;
};

const DesignSuggestions = () => {
  const location = useLocation();
  const data = location.state.designData;
  //console.log(location.state.designData);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUsers,
  });

  if (!data || !data.decoration_budget) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No design data found.
        </Typography>
      </Box>
    );
  }

  const { homeType, budget, preferences } = data.decoration_budget;


  const normalize = (str) =>
    str?.toLowerCase().replace(/\s/g, '').replace(/–|—/g, '-').trim();

  const matchedDesigners = (user || []).filter((u) => {
    const designerBudget = u.decoration_budget?.budget || [];
    const designerHomeTypes = u.decoration_budget?.homeType || [];
    const designerPrefs = u.decoration_budget?.preferences || {};

    const submittedBudget = budget?.[0];
    const submittedHomeType = homeType?.[0];
    const submittedPrefs = preferences || {};


    const hasMatchingBudget = designerBudget.some(
      (b) => normalize(b) === normalize(submittedBudget)
    );


    const hasMatchingHomeType = designerHomeTypes.some(
      (h) => normalize(h) === normalize(submittedHomeType)
    );


    const hasMatchingPreferences = ['bedroom', 'kitchen', 'livingroom'].some(
      (room) => {
        const designerItems = designerPrefs[room] || [];
        const submittedItems = submittedPrefs[room] || [];

        return submittedItems.some((item) =>
          designerItems.some(
            (dItem) => normalize(dItem) === normalize(item)
          )
        );
      }
    );

    return hasMatchingBudget && hasMatchingHomeType && hasMatchingPreferences;
  });


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Design Suggestions</Typography>



      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Matched Designers
        </Typography>
        {matchedDesigners.length > 0 ? (
          matchedDesigners.map((designer, index) => (
            <Card key={index} sx={{ display: 'flex', mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={`http://localhost:3005/${designer.image}`}
                alt={designer.name}
                sx={{ width: 250, height: 250, borderRadius: 2, objectFit: 'cover' }}
              />

              <CardContent sx={{ flex: 1, ml: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {designer.designername || 'Unnamed Designer'}
                </Typography>

                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Home Type:</strong> {designer.decoration_budget?.homeType?.[0]}
                </Typography>

                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Budget:</strong> {designer.decoration_budget?.budget?.[0]}
                </Typography>

                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Style:</strong> {designer.style}
                </Typography>

                <Typography variant="body2" sx={{ color: 'gray'}}>
                  {designer.location} | ⭐ {designer.rating}
                </Typography><br></br>
                <Button variant="outlined" component={Link} to={`/designer/${designer._id}`}>Book Now</Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No matching designers found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DesignSuggestions;
