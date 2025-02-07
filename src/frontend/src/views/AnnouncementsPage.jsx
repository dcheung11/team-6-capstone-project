import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getAnnouncements } from "../api/announcements";
import PastAnnouncementsSection from "../components/PastAnnouncements";
import EditIcon from "@mui/icons-material/Edit";

export default function AnnouncementPage({ userRole = "commissioner" }) {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        const sortedAnnouncements = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncements(sortedAnnouncements);
        setSelectedAnnouncement(sortedAnnouncements[0]); // Default to the most recent announcement
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  if (!selectedAnnouncement || announcements.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  // to exclude the selected announcement from past announcements
  // (if user has selected READ MORE from past announcement list)
  const pastAnnouncements = announcements.filter(
    (announcement) => announcement._id !== selectedAnnouncement._id
  );
  

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        {/* Commissioner Controls */}
        {userRole === "commissioner" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#7A003C", "&:hover": { backgroundColor: "#59002B" } }}
              onClick={() => navigate("/announcements/create")}
            >
              Create New Announcement
            </Button>
          </Box>
        )}

        {/* Main Announcement */}
        <Box sx={{ py: 2 }}>
          <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{
            fontSize: { xs: "3rem", md: "4rem" },
            fontWeight: 900,
          }}
          >
            {selectedAnnouncement.title}
          </Typography>
          <Typography align="center" color="text.secondary" gutterBottom>
            {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
          </Typography>
          <Typography 
          paragraph
          sx={{
            fontSize: { md: "1.2rem" },
          }}
          >
            {selectedAnnouncement.content}</Typography>

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
                onClick={() => navigate(`/announcements/edit/${selectedAnnouncement._id}`)}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Past Announcements Section */}
      <PastAnnouncementsSection
        pastAnnouncements={pastAnnouncements}
        userRole={userRole}
        onReadMore={setSelectedAnnouncement} // Pass function to update the main announcement
      />
    </Box>
  );
}
