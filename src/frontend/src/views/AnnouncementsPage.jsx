import { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Card, CardContent, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { getAnnouncements } from "../api/announcements"; // Import API call

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: "100%",
}));

const DateAuthor = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export default function AnnouncementPage({ userRole = "commissioner" }) {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by newest first
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchData();
  }, []);

  if (announcements.length === 0) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
            No Announcements Yet
          </Typography>
        </Container>
      </Box>
    );
  }

  const mainAnnouncement = announcements[0];
  const pastAnnouncements = announcements.slice(1, 7);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {userRole === "commissioner" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#7A003C", "&:hover": { backgroundColor: "#59002B" } }}
              onClick={() => navigate("/announcements/create")}
            >
              Create New Announcement
            </Button>
          </Box>
        )}
        {userRole === "commissioner" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#7A003C", "&:hover": { backgroundColor: "#59002B" } }}
                onClick={() => navigate(`/announcements/edit/${mainAnnouncement._id}`)}
              >
                EDIT
              </Button>
            </Box>
          )}

        {/* Main Announcement */}
        <Box sx={{ py: 6, flexGrow: 1 }}>
          <Typography variant="h3" align="center" gutterBottom>
            {mainAnnouncement.title}
          </Typography>
          <Typography align="center" color="text.secondary" gutterBottom>
            {new Date(mainAnnouncement.createdAt).toLocaleDateString()}
          </Typography>
          <Typography paragraph sx={{ mt: 4 }}>
            {mainAnnouncement.content}
          </Typography>
        </Box>
      </Container>

      {/* Past Announcements */}
      <Box sx={{ bgcolor: "#495965", py: 6, width: "100%", flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" color="common.white" gutterBottom sx={{ mb: 4 }}>
            Past Announcements
          </Typography>

          <Grid container spacing={3}>
            {pastAnnouncements.map((announcement) => (
              <Grid item xs={12} md={6} key={announcement._id}>
                <StyledCard>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {announcement.content.length > 100 ? `${announcement.content.substring(0, 100)}...` : announcement.content}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <DateAuthor>
                        <FavoriteIcon sx={{ fontSize: 16 }} />
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </DateAuthor>
                      {userRole === "commissioner" && (
                        <Button
                          variant="text"
                          sx={{
                            color: "primary.contrastText",
                            textDecoration: "underline",
                            "&:hover": {
                              backgroundColor: "transparent",
                              textDecoration: "none",
                            },
                          }}
                          onClick={() => navigate(`/announcements/edit/${announcement._id}`)}
                        >
                          EDIT
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
