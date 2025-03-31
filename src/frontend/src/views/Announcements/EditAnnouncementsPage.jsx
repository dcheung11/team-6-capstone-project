// Author: Emma Wigglesworth
// Description: Page for editing a new announcement for the commissioner.
// Last Modified: 2025-02-23

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import NavBar from "../../components/NavBar";
import AnnouncementForm from "../../components/Forms/AnnouncementForm";
import { getAnnouncementById, editAnnouncement, deleteAnnouncement } from "../../api/announcements";
import { MCMASTER_COLOURS } from "../../utils/Constants.js";


// AI Generated - Ombre bar styling and gradient effects
// EditAnnouncementPage: Redirect Page for editing an existing announcement (commissioner).
export default function EditAnnouncementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the announcement by ID when the component mounts
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await getAnnouncementById(id);
        setAnnouncement(response.announcement);
      } catch (error) {
        console.error("Error fetching announcement:", error);
        setError("Failed to load announcement");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  // Function to handle the edit onclick - sends edit request to the API
  const handleEdit = async ({ title, content }) => {
    try {
      await editAnnouncement(id, title, content);
      navigate("/announcements");
    } catch (error) {
      console.error("Error editing announcement:", error);
      setError("Failed to save changes");
    }
  };

  // Function to handle the delete button click - sends delete request to the API
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        navigate("/announcements");
      } catch (error) {
        console.error("Error deleting announcement:", error);
        setError("Failed to delete announcement");
      }
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
          Edit Announcement
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress sx={{ color: MCMASTER_COLOURS.maroon }} />
          </Box>
        ) : error ? (
          <Typography 
            align="center" 
            sx={{ 
              mt: 4, 
              color: '#d32f2f',
              bgcolor: 'white',
              p: 3,
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            {error}
          </Typography>
        ) : announcement ? (
          <AnnouncementForm
            onSubmit={handleEdit}
            onDelete={handleDelete}
            initialTitle={announcement.title}
            initialContent={announcement.content}
            isEdit
          />
        ) : (
          <Typography 
            align="center" 
            sx={{ 
              mt: 4, 
              color: MCMASTER_COLOURS.grey,
              bgcolor: 'white',
              p: 3,
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            Announcement not found.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
