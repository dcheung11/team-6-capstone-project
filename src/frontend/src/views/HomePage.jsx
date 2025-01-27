import React from "react";
import NavBar from "../components/NavBar";

import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
}))

export default function HomePage() {
  return (
    <><NavBar /><Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4rem" },
                fontWeight: 900,
                color: "text.primary",
                mb: 2,
              }}
            >
              McMaster GSA
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, fontSize: "1.1rem" }}>
              McMaster GSA is dedicated to providing a social and supportive community... lorem ipsum dolor sit amet...
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "common.black",
                color: "common.white",
                borderRadius: "50px",
                px: 4,
                "&:hover": {
                  bgcolor: "common.black",
                  opacity: 0.9,
                },
              }}
            >
              Register Team
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
          </Grid>
        </Grid>
      </Container>

      {/* Acknowledgments Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              mb: 4,
            }}
          >
            Acknowledgments
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            OG page has an acknowledgments tab that can be highlighted here so everyone can see and acknowledge.
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien, est felis, sagittis viverra nulla mattis
            scelerisque. Eget eras integer.
          </Typography>
        </Container>
      </Box>

      {/* Announcements Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
              }}
            >
              Announcements
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ bgcolor: "grey.100" }}>
                <ArrowBackIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: "grey.100" }}>
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
          </Box>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <StyledCard>
                  <CardMedia component="img" height="200" alt={`Announcement ${item}`} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Neque volutpat morbi
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Et blandit non sit ac egestas risus non.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "common.black",
                        color: "common.white",
                        borderRadius: "50px",
                        "&:hover": {
                          bgcolor: "common.black",
                          opacity: 0.9,
                        },
                      }}
                    >
                      Read
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box></>
  )
}


