import {
  Box,
  Container,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Checkbox,
  FormGroup,
  TextField
} from '@mui/material';

import { useState } from 'react';
import DesignerFilter from '../DesignerFilter';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Designhome = () => {
   
  const navigate=useNavigate()
  const [homeType, setHomeType] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState({});

  const homeTypes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Duplex', 'Villa'];
  const budgetRanges = ['₹2L - ₹5L', '₹5L - ₹10L', '₹10L - ₹15L', '₹15L - ₹20L'];

  const preferences = {
    Kitchen: ['Granite', 'Drawer', 'Block', 'Modular', 'Backsplash'],
    'Living Room': ['TvUnit', 'Sofa', 'CoffeeTable', 'Bookshelf', 'AccentWall'],
    Bedroom: ['Wardrobe', 'Bed', 'SideTable', 'Mirror', 'AccentLighting'],
  };

  const handleChange = (category, item) => {
    setSelectedPrefs((prev) => {
      const selected = prev[category] || [];
      const updated = selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item];

      return {
        ...prev,
        [category]: updated,
      };
    });
  };

const handleDesignSubmit = async () => {
  const designData = {
    decoration_budget: {
      homeType: [homeType], // convert string to array
      budget: [budget],     // convert string to array
      preferences: {
        bedroom: selectedPrefs?.Bedroom || [],
        kitchen: selectedPrefs?.Kitchen || [],
        livingroom: selectedPrefs?.['Living Room'] || []
      }
    }
  };

  try {
    const res = await axios.post('http://localhost:3005/api/create/Design', designData);
    const matchedDesigners = res?.data?.data;

    console.log('matchedDesigners', matchedDesigners);

    navigate('/design-suggestions', {
      state: { designData, matchedDesigners }
    });
  } catch (error) {
    console.error('Error creating design:', error);
  }
};


  return (
    <Container>
      <Box sx={{mt:12}}>
    <Typography variant="h4" align="center" sx={{ mb:2, fontWeight: 'bold' }}>
            Design Your Dream Home
          </Typography>
      </Box>
      
      <Box sx={{ display: 'flex'}}>
        {/* Sidebar Left */}
        <Box sx={{ width: 300, bgcolor: '#fbf8efff', p: 3 ,}}>
          <Typography variant="h6" gutterBottom sx={{fontWeight:'700',fontSize:'26px'}}>
            Top Interior Design Companies
          </Typography>

          <DesignerFilter />
        </Box>

        {/* Right Content Area */}
        <Box sx={{ flex: 1, p: 4, backgroundColor: '#fef9f0ff' }}>
          

          {/* Home Type */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Select Your Home Type
            </Typography>
            <RadioGroup row value={homeType} onChange={(e) => setHomeType(e.target.value)}>
              {homeTypes.map((type) => (
                <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
              ))}
            </RadioGroup>
          </Box>

          {/* Budget Range */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Select Your Budget Range
            </Typography>
            <RadioGroup row value={budget} onChange={(e) => setBudget(e.target.value)}>
              {budgetRanges.map((range) => (
                <FormControlLabel key={range} value={range} control={<Radio />} label={range} />
              ))}
            </RadioGroup>
          </Box>

          {/* Preferences */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
              Interior Design Preferences
            </Typography>

            {Object.entries(preferences).map(([category, items]) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', color: '#a04504ff', mb: 1 }}
                >
                  {category}
                </Typography>
                <FormGroup>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedPrefs[category]?.includes(item) || false}
                              onChange={() => handleChange(category, item)} 
                            />
                          }
                          label={item}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            ))}

            <Button variant="contained" sx={{backgroundColor:'#a04504ff'}}color="primary" onClick={handleDesignSubmit}>
              Get Design Suggestions
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Designhome;
