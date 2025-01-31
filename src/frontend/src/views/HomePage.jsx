import React, { useEffect, useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  getArchivedSeasons,
  getOngoingSeasons,
  getUpcomingSeasons,
} from "../api/season";
import { SeasonsCard } from "../components/SeasonsCard";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
}));

export default function HomePage() {
  const [upcomingSeasons, setUpcomingSeasons] = useState(null);
  const [ongoingSeasons, setOngoingSeasons] = useState(null);
  const [archivedSeasons, setArchivedSeasons] = useState(null);

  // todo: can use these to show loading spinner or error message
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingSeasons = async () => {
      try {
        const data = await getUpcomingSeasons();
        setUpcomingSeasons(data.seasons);
        console.log("Upcoming Seasons:", data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch upcoming seasons");
      } finally {
        setLoading(false);
      }
    };

    const fetchOngoingSeasons = async () => {
      try {
        const data = await getOngoingSeasons();
        setOngoingSeasons(data.seasons);
        console.log("Ongoing Seasons:", data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch ongoing seasons");
      } finally {
        setLoading(false);
      }
    };

    const fetchArchivedSeasons = async () => {
      try {
        const data = await getArchivedSeasons();
        setArchivedSeasons(data.seasons);
        console.log("Archived Seasons:", data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch archived seasons");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingSeasons();
    fetchOngoingSeasons();
    fetchArchivedSeasons();
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4, width: "100%" }}>
          <Grid spacing={6} alignItems="center">
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
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 4, fontSize: "1.1rem" }}
              >
                Welcome to the McMaster Graduate Students Association Softball
                League!
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel1-content"
                  id="upcoming-header"
                >
                  <Typography component="span">Upcoming Seasons</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SeasonsCard seasons={upcomingSeasons} status="Upcoming" />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  id="ongoing-header"
                >
                  <Typography component="span">Ongoing Seasons</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SeasonsCard seasons={ongoingSeasons} status="Ongoing" />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  id="archived-header"
                >
                  <Typography component="span">Archived Seasons</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SeasonsCard seasons={archivedSeasons} status="Archived" />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Container>

        {/* Announcements Section */}
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
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
                    <CardMedia
                      component="img"
                      height="200"
                      alt={`Announcement ${item}`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Neque volutpat morbi
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
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
      </Box>
    </>
  );
}
