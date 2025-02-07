import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getAnnouncements } from "../api/announcements";
import PastAnnouncementsSection from "../components/PastAnnouncements";
import EditIcon from "@mui/icons-material/Edit"

export default function AnnouncementPage({ userRole = "commissioner" }) {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by newest first
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) {
    console.log("announcments loading...")
    return //<Typography>Loading...</Typography>;
  }

  const mainAnnouncement = announcements[0];
  const pastAnnouncements = announcements.slice(1, 7);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        {/* Commissioner Controls */}
        {userRole === "commissioner" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2, backgroundColor: "#7A003C", "&:hover": { backgroundColor: "#59002B" } }}
              onClick={() => navigate("/announcements/create")}
            >
              Create New Announcement
            </Button>
          </Box>
        )}

        {/* Main Announcement */}
        <Box sx={{ py: 4 }}>
          <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 800,
          }}
          >
            {mainAnnouncement.title}
          </Typography>
          <Typography align="center" color="text.secondary" gutterBottom>
            {new Date(mainAnnouncement.createdAt).toLocaleDateString()}
          </Typography>
          <Typography paragraph>{mainAnnouncement.content}</Typography>

          {/* Edit Button for Main Announcement */}
          {userRole === "commissioner" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                sx={{ 
                  borderRadius: 2, 
                  backgroundColor: "#7A003C", "&:hover": 
                  { backgroundColor: "#59002B" } 
                }}
                onClick={() => navigate(`/announcements/edit/${mainAnnouncement._id}`)}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Past Announcements Section */}
      <PastAnnouncementsSection pastAnnouncements={pastAnnouncements} userRole={userRole} />
    </Box>
  );
}
