import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import Carousel from "react-material-ui-carousel";
import DesignerCard from '../../../components/DesignerCard';

const carouselItems = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWoh3EeA502ajsw1giCa7LMc9a14zoLqsMIA&s",
    title: "Welcome to Designer World",
    subtitle: "Your Interior Designer Journey Starts Here",
  },
  {
    image:
      "https://media.istockphoto.com/id/1293762741/photo/modern-living-room-interior-3d-render.jpg?s=612x612&w=0&k=20&c=iZ561ZIXOtPYGSzqlKUnLrliorreOYVz1pzu8WJmrnc=",
    title: "Curated Luxury Spaces",
    subtitle: "Designs that reflect your lifestyle",
  },
  {
    image:
      "https://www.centuryply.com/blogimage/bedroom_1.png",
    title: "Your Dream, Our Design",
    subtitle: "Elegant interiors crafted for you",
  },
];
const Banner = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3005/api/detailDesigner');
      const data = await res?.data?.data;
      console.log(data);

      // Filter designers by category or name (case-insensitive)
      const filtered = data.filter((designer) =>
        [
          ...(designer.portfolio.map((item) => item.category)),
          designer.designername,
        ]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      console.log('filtered',filtered);


      setResults(filtered);
    } catch (err) {
      setError('Failed to fetch designers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Carousel
  indicators={true}
  navButtonsAlwaysVisible
  animation="fade"
  interval={5000}
  autoPlay
  sx={{
     width: '100%',
    overflow: 'hidden',      
    pt: 1,                  
    m: 0,                    
  }}
>

  {carouselItems.map((item, i) => (
    <Box
      key={i}
      sx={{
        height: 550,
         width: '100%', 
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />
      {/* Content */}
      <Box sx={{ zIndex: 2 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="h6" mb={3}>
          {item.subtitle}
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 50,
            px: 2,
            py: 1,
            width: '90%',
            maxWidth: 500,
            display: 'flex',
            alignItems: 'center',
            mx: 'auto',
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="  Search  by  designer"
            style={{
              border: 'none',
              outline: 'none',
              flexGrow: 1,
              padding: '10px',
              fontSize: '16px',
              borderRadius: 50,
            }}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon color="primary" />
          </IconButton>
        </Box>

        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  ))}
</Carousel>
      <Container>
        {/* HERO SECTION */}
        {/* <Box
          sx={{
            height: '400px',
         
            backgroundImage:
              'url(https://chiedesign.in/wp-content/uploads/2022/05/Luxury-Interior-Design-Living-Room-1080x675.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            px: 2,
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome to Interio
          </Typography>
          <Typography variant="h6" mb={3}>
            Your Interior Design Journey Starts Here
          </Typography>

          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 50,
              px: 2,
              py: 1,
              width: '90%',
              maxWidth: 500,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by category or designer..."
              style={{
                border: 'none',
                outline: 'none',
                flexGrow: 1,
                padding: '10px',
                fontSize: '16px',
                borderRadius: 50,
              }}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon color="primary" />
            </IconButton>
          </Box>

          {loading && <CircularProgress sx={{ mt: 2 }} />}
          {error && <Typography color="error" mt={2}>{error}</Typography>}
        </Box> */}


        {/* Search Results */}
        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Search Results
            </Typography>
            <List>
              {results.map((designer) => (
                // <React.Fragment key={designer._id || idx}>
                //   <Typography variant="h6" mt={2}>
                //     {designer.designername}
                //   </Typography>
                //   {(designer.portfolio || []).map((item, i) => (
                //     <ListItem key={i}>
                //       <ListItemText
                //         primary={`Title: ${item.title}`}
                //         secondary={`Category: ${item.category}`}
                //       />
                //     </ListItem>
                //   ))}
                // </React.Fragment>
                <DesignerCard designer={designer} />
              ))}
            </List>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Banner;
