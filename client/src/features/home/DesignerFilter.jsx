import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DesignerCard from '../../components/DesignerCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:3005/api/detailDesigner');
  return res?.data?.data;
};

const DesignerFilter = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUsers,
  });

  const [location, setLocation] = useState('');
  const [style, setStyle] = useState('');
  const [filteredvalue, setFilteredValue] = useState([]);

  
  useEffect(() => {
    if (user) {
      setFilteredValue(user);
    }
  }, [user]);

  const submithandler = () => {
    const formdata = {
      location: location?.toLowerCase().trim(),
      style: style?.toLowerCase().trim(),
    };

    const filtered = user?.filter(
      (x) =>
        (!formdata.location || x.location?.toLowerCase().trim() === formdata.location) &&
        (!formdata.style || x.style?.toLowerCase().trim() === formdata.style)
    );

    setFilteredValue(filtered);
  };

  const clearFilters = () => {
    setLocation('');
    setStyle('');
    setFilteredValue(user); 
  };

  return (
    <Box>
      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
      
           <TextField
          select
          label="Filter by Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ minWidth: 200 }}
        >
            {user?.map(x=>(<MenuItem value={x?.location}>{x?.location}</MenuItem>))}
          {/* <MenuItem value="">All</MenuItem> */}
          
         
        </TextField>

        <TextField
          select
          label="Style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {user?.map(x=>(<MenuItem value={x.style}>{x.style}</MenuItem>))}
          {/* <MenuItem value="">All</MenuItem> */}
         
      
        </TextField>
      
       

        <Button variant="outlined" sx={{color:'#8a3d06ff',border:'3px solid #f4b07fff',}} onClick={clearFilters}>
          Clear Filters
        </Button>
        <Button variant="outlined" sx={{color:'#8a3d06ff',border:'3px solid #f4b07fff',}} onClick={submithandler}>
          Search
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredvalue?.length > 0 ? (
          filteredvalue.map((designer, index) => (
            <Box key={index}>
              <DesignerCard designer={designer} />
            </Box>
          ))
        ) : (
          <Typography>No designers found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default DesignerFilter;
