import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import AnnouncementForm from "../components/AnnouncementForm";
import { createAnnouncement } from "../api/announcements";

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();

  const handleCreate = async ({ title, content }) => {
    try {
      await createAnnouncement(title, content);
      navigate("/announcements");
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container
        maxWidth="lg"
        sx={{ mt: 4, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          Create New Announcement
        </Typography>
        <AnnouncementForm onSubmit={handleCreate} />
      </Container>
    </Box>
  );
}
