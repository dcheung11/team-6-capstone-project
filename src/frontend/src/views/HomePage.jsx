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
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {loading && <LoadingOverlay loading={loading} />}
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4, width: "100%" }}>
          <Grid container spacing={2} alignItems="center">
            {/* Title and Welcome Message */}
            <Grid item xs={8} md={8}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", md: "4rem" },
                  fontWeight: 900,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                McMaster GSA
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", fontSize: "1.1rem" }}
              >
                Welcome to the McMaster Graduate Students Association Softball
                League!
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
                  paddingBottom: "3px",
                }}
              />
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          {/* Seasons Section */}
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Seasons
          </Typography>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
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
        </Container>
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              mt: 4,
            }}
          >
            Invitations
          </Typography>
          {player && player.invites && player.invites.length === 0 ? (
            <NoDataCard text="No invitations to show." />
          ) : (
            <NotificationsRow teamInvites={player && player.invites} />
          )}
        </Container>
        {/* Announcements Section */}
        <Box sx={{ py: 2 }}>
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
            </Box>

            <Grid container spacing={4}>
              {announcements.length === 0 ? (
                <Typography>No announcements available.</Typography>
              ) : (
                announcements.map((announcement) => (
                  <Grid item xs={12} md={4} key={announcement._id}>
                    <StyledCard>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h4"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {announcement.title}
                        </Typography>
                        <Typography
                          variant="body"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {announcement.content.length > 100
                            ? `${announcement.content.substring(0, 100)}...`
                            : announcement.content}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "common.black",
                            color: "common.white",
                            borderRadius: "50px",
                            width: "fit-content",
                            "&:hover": {
                              bgcolor: "#7A003C",
                              opacity: 0.9,
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
                    </StyledCard>
                  </Grid>
                ))
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
}
