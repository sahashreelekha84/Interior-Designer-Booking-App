import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";


const AboutUs = () => {
  const items = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
      title: "Our Mission",
      desc: "To create innovative, functional, and elegant interiors that align with your aspirations.",
    },
    {
      icon: <StarIcon sx={{ fontSize: 32 }} />,
      title: "Our Values",
      desc: "Quality, creativity, and attention to detail are the cornerstones of our work.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      title: "Our Impact",
      desc: "Hundreds of satisfied clients across luxury homes, boutique stores, and collaborative offices.",
    },
  ];

  return (
    <Box sx={{ fontFamily: `'Segoe UI', sans-serif` }}>

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          height: "80vh",
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Image Side */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWoh3EeA502ajsw1giCa7LMc9a14zoLqsMIA&s)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
          }}
        />

        {/* Text Panel */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1e1a16",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, md: 10 },
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              About Us
            </Typography>
            <Typography variant="h6" color="gray">
              We design immersive environments that reflect your story and elevate daily living.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* About Description */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            sx={{
              color: "#5c3d2e",
              fontWeight: 700,
              fontFamily: `'Playfair Display', serif`,
              position: "relative",
              display: "inline-block",
              mb: 2,
              "&::after": {
                content: '""',
                position: "absolute",
                width: "60%",
                height: "4px",
                bottom: -8,
                left: "20%",
                background: "linear-gradient(to right, #bfa27a, #5c3d2e)",
                borderRadius: 2,
              },
            }}
          >
            Who We Are
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              mt: 2,
              fontSize: "1.1rem",
              lineHeight: 1.8,
            }}
          >
            With a keen sense of space and light, we are a studio of interior
            design experts transforming ordinary places into soulful
            environments. We specialize in residential sanctuaries and
            sophisticated commercial interiors.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "#5c3d2e",
              px: 4,
              py: 1.2,
              fontWeight: 500,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: 3,
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#4a2f24",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              },
            }}
          >
            Explore Our Story
          </Button>
        </Box>
      </Container>

      <Divider sx={{ my: 2 }} />

      {/* Mission, Values, Impact */}
  <Box sx={{ py: 10, backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#f8f1e6",
                    color: "#5c3d2e",
                    width: 80,
                    height: 80,
                    mb: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#5c3d2e", mb: 1 }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    px: 1,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    </Box>
  );
};

export default AboutUs;
