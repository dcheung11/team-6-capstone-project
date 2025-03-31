import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import NavBar from "../../components/NavBar";
import AnnouncementForm from "../../components/Forms/AnnouncementForm";
import { createAnnouncement } from "../../api/announcements";

// McMaster colours - AI Generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

// CreateAnnouncementPage: Redirect Page for creating a new announcement (commissioner).
export default function CreateAnnouncementPage() {
  const navigate = useNavigate();

  ```  
  Function to handle the creation of a new announcement
  It takes the title and content as parameters and calls the createAnnouncement API function,
  then navigates back to the announcements page.
  ```
  const handleCreate = async ({ title, content }) => {
    try {
      await createAnnouncement(title, content);
      navigate("/announcements");
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <Box 
      sx={{ 
        bgcolor: MCMASTER_COLOURS.lightGrey, 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      <NavBar />
      <Container
        maxWidth="lg"
        sx={{ 
          py: { xs: 4, md: 6 }, 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 900,
            color: 'black',
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '2.25rem', md: '2.5rem' },
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              bgcolor: MCMASTER_COLOURS.gold,
              mx: 'auto',
              mt: 2,
              borderRadius: '2px'
            }
          }}
        >
          Create New Announcement
        </Typography>
        <AnnouncementForm onSubmit={handleCreate} />
      </Container>
    </Box>
  );
}
