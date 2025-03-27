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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import {
  getArchivedSeasons,
  getOngoingSeasons,
  getUpcomingSeasons,
} from "../api/season";
import { getAnnouncements } from "../api/announcements";
import { SeasonsCard } from "../components/SeasonsCard";
import GSALogo from "../assets/GSALogo.png";
import LoadingOverlay from "../components/LoadingOverlay";
import { getPlayerById } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";
import NotificationsRow from "../components/NotificationsRow";
import NoDataCard from "../components/NoDataCard";

// McMaster colours - AI generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

const StyledCard = styled(Card)(({ theme }) => ({
  height: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
  },
}));

export default function HomePage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [upcomingSeasons, setUpcomingSeasons] = useState(null);
  const [ongoingSeasons, setOngoingSeasons] = useState(null);
  const [archivedSeasons, setArchivedSeasons] = useState(null);
  const [announcements, setAnnouncements] = useState([]); // Store fetched announcements
  // todo: can use these to show loading spinner or error message
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        setLoading(true);
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      }
    };

    const fetchUpcomingSeasons = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingSeasons();
        setUpcomingSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch upcoming seasons");
      }
    };

    const fetchOngoingSeasons = async () => {
      try {
        setLoading(true);
        const data = await getOngoingSeasons();
        setOngoingSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch ongoing seasons");
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        const sortedAnnouncements = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements(sortedAnnouncements.slice(0, 3)); // Get the 3 most recent announcements
      } catch (err) {
        setError(err.message || "Failed to fetch announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerById(auth.playerId);
    fetchUpcomingSeasons();
    fetchOngoingSeasons();
    fetchAnnouncements();
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        {loading && <LoadingOverlay loading={loading} />}
        {/* Hero Section */}
        <Box sx={{ bgcolor: 'white', pb: 8, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Container maxWidth="lg" sx={{ pt: 10, width: "100%" }}>
            <Grid container spacing={2} alignItems="center">
              {/* Title and Welcome Message */}
              <Grid item xs={8} md={8}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3.5rem", md: "5rem" },
                    fontWeight: 900,
                    color: "black",
                    mb: 2,
                    lineHeight: 1.1,
                  }}
                >
                  McMaster GSA
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ 
                    color: MCMASTER_COLOURS.grey, 
                    fontSize: "1.2rem",
                    maxWidth: "750px" 
                  }}
                >
                  Welcome to the McMaster Graduate Students Association Softball League! 
                </Typography>
              </Grid>

              {/* Logo */}
              <Grid
                item
                xs={4}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <img
                  src={GSALogo}
                  alt="GSA Logo"
                  style={{
                    width: "300px",
                    height: "auto",
                    objectFit: "contain",
                    paddingBottom: "55px",
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.1)',
              p: 4,
            }}
          >
            {/* Seasons Section */}
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2.5rem", md: "3rem" },
                fontWeight: 700,
                mb: 3,
                color: "black",
                fontFamily: "inherit",
              }}
            >
              Seasons
            </Typography>
            <Accordion 
              defaultExpanded={true}
              sx={{
                '&.MuiAccordion-root': {
                  boxShadow: 'none',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  mb: 2,
                  '&:before': {
                    display: 'none',
                  },
                },
                '& .MuiAccordionSummary-root': {
                  minHeight: 56,
                  backgroundColor: MCMASTER_COLOURS.lightGrey,
                  borderRadius: '8px 8px 0 0',
                  '&.Mui-expanded': {
                    minHeight: 56,
                    backgroundColor: MCMASTER_COLOURS.lightGrey,
                  },
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  '&.Mui-expanded': {
                    margin: '12px 0',
                  },
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                id="upcoming-header"
              >
                <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: MCMASTER_COLOURS.maroon }}>
                  Upcoming Seasons
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SeasonsCard seasons={upcomingSeasons} status="Upcoming" />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                '&.MuiAccordion-root': {
                  boxShadow: 'none',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  '&:before': {
                    display: 'none',
                  },
                },
                '& .MuiAccordionSummary-root': {
                  minHeight: 56,
                  backgroundColor: MCMASTER_COLOURS.lightGrey,
                  borderRadius: '8px 8px 0 0',
                  '&.Mui-expanded': {
                    minHeight: 56,
                    backgroundColor: MCMASTER_COLOURS.lightGrey,
                  },
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  '&.Mui-expanded': {
                    margin: '12px 0',
                  },
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                id="ongoing-header"
              >
                <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: MCMASTER_COLOURS.maroon }}>
                  Ongoing Seasons
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SeasonsCard seasons={ongoingSeasons} status="Ongoing" />
              </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 6, mb: 2 }}>
              <Divider sx={{ mb: 6 }} />
              
              {/* Announcements Section */}
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
                    fontSize: { xs: "2.5rem", md: "3rem" },
                    fontWeight: 700,
                    color: "black",
                    fontFamily: "inherit",
                  }}
                >
                  Announcements
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {announcements.length === 0 ? (
                  <Grid item xs={12}>
                    <NoDataCard text="No announcements available." />
                  </Grid>
                ) : (
                  announcements.map((announcement) => (
                    <Grid item xs={12} md={4} key={announcement._id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          backgroundColor: MCMASTER_COLOURS.lightGrey,
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 3,
                          }}
                        >
                          <Box>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                              sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: MCMASTER_COLOURS.maroon,
                              }}
                            >
                              {announcement.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={MCMASTER_COLOURS.grey}
                              sx={{ mb: 3 }}
                            >
                              {announcement.content.length > 100
                                ? `${announcement.content.substring(0, 100)}...`
                                : announcement.content}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: MCMASTER_COLOURS.maroon,
                              color: 'white',
                              borderRadius: 2,
                              width: "fit-content",
                              "&:hover": {
                                backgroundColor: '#5C002E',
                              },
                            }}
                            onClick={() =>
                              navigate(`/announcements`, {
                                state: { selectedAnnouncement: announcement },
                              })
                            }
                          >
                            Read More
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}