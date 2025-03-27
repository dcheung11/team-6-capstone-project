import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getAnnouncements } from "../api/announcements";
import PastAnnouncementsSection from "../components/PastAnnouncements";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";

// McMaster colours - AI Generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

export default function AnnouncementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const auth = useAuth();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!auth.playerId) return;
      try {
        const data = await getPlayerById(auth.playerId);
        setPlayer(data.player);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayer();
  }, [auth.playerId]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        const sortedAnnouncements = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const passedAnnouncement = location.state?.selectedAnnouncement;
        setAnnouncements(sortedAnnouncements);
        setSelectedAnnouncement(passedAnnouncement || sortedAnnouncements[0]); // Default to the most recent announcement
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const userRole = player?.role || "player"; // Default role if undefined

  // to exclude the selected announcement from past announcements
  const pastAnnouncements = announcements.filter(
    (announcement) => announcement._id !== selectedAnnouncement._id
  );
  
  return (
    <Box 
      sx={{ 
        bgcolor: MCMASTER_COLOURS.lightGrey, 
        minHeight: "100vh",
        height: '100%',
        position: 'fixed',
        width: '100%',
        overflowY: 'auto',
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      <NavBar />
      {!selectedAnnouncement || announcements.length === 0 ? (
        console.log('No announcements fetched')
      ) : (
        <>
          <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
            {/* Commissioner Controls */}
            {userRole === "commissioner" && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
                <Button
                  variant="contained"
                  sx={{ 
                    borderRadius: 2, 
                    backgroundColor: MCMASTER_COLOURS.maroon, 
                    "&:hover": { 
                      backgroundColor: '#5A002C'
                    },
                    px: 3,
                    py: 1
                  }}
                  onClick={() => navigate("/announcements/create")}
                >
                  Create New Announcement
                </Button>
              </Box>
            )}

            {/* Main Announcement */}
            <Box 
              sx={{ 
                position: 'relative',
                py: 4,
                px: { xs: 3, md: 6 },
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mb: 4,
                maxWidth: '850px',
                mx: 'auto',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(to right, ${MCMASTER_COLOURS.maroon}, ${MCMASTER_COLOURS.gold})`,
                  borderRadius: '2px 2px 0 0'
                }
              }}
            >
              {/* Category Tag */}
              <Box 
                sx={{ 
                  display: 'inline-block',
                  bgcolor: MCMASTER_COLOURS.maroon,
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  mb: 3,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Important Update
              </Box>

              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontSize: { xs: "2.25rem", md: "3rem" },
                  fontWeight: 900,
                  color: 'black',
                  mb: 3,
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: '80px',
                    height: '4px',
                    bgcolor: MCMASTER_COLOURS.gold,
                    mx: 'auto',
                    mt: 3,
                    borderRadius: '2px'
                  }
                }}
              >
                {selectedAnnouncement.title}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1,
                mb: 4,
                color: MCMASTER_COLOURS.grey,
                '& svg': { fontSize: '1rem' }
              }}>
                <Typography 
                  sx={{ 
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#333',
                  whiteSpace: 'pre-line',
                  maxWidth: '750px',
                  mx: 'auto',
                  '& p': {
                    mb: 2.5
                  },
                  '& strong': {
                    color: MCMASTER_COLOURS.maroon,
                    fontWeight: 600
                  }
                }}
              >
                {selectedAnnouncement.content}
              </Typography>

              {/* Edit Button for Main Announcement */}
              {userRole === "commissioner" && (
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "flex-end", 
                  mt: 4,
                  pt: 3,
                  borderTop: `1px solid ${MCMASTER_COLOURS.lightGrey}`
                }}>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: MCMASTER_COLOURS.maroon,
                      "&:hover": { 
                        backgroundColor: '#5A002C'
                      }
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

          {/* Past Announcements Section with updated styling */}
          <Box sx={{ 
            bgcolor: '#495965',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(to right, ${MCMASTER_COLOURS.gold}, ${MCMASTER_COLOURS.maroon})`,
            }
          }}>
            <PastAnnouncementsSection
              pastAnnouncements={pastAnnouncements}
              userRole={userRole}
              onReadMore={setSelectedAnnouncement}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
