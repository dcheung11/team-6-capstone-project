import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import AnnouncementForm from "../components/AnnouncementForm";
import { getAnnouncementById, editAnnouncement, deleteAnnouncement } from "../api/announcements";

export default function EditAnnouncementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await getAnnouncementById(id);
        setAnnouncement(response.announcement); // Ensure we're accessing the correct key
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const handleEdit = async ({ title, content }) => {
    try {
      await editAnnouncement(id, title, content);
      navigate("/announcements"); // Redirect after editing
    } catch (error) {
      console.error("Error editing announcement:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        navigate("/announcements"); // Redirect after deletion
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  if (announcement === null) {
    return <Typography align="center" sx={{ mt: 4 }}>Fetching announcement details...</Typography>;
  }
  
  if (!announcement) {
    return <Typography align="center" sx={{ mt: 4, color: "red" }}>Error: Announcement not found.</Typography>;
  }  

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container
        maxWidth="lg"
        sx={{ mt: 4, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          Edit Announcement
        </Typography>
        <AnnouncementForm
          onSubmit={handleEdit}
          onDelete={handleDelete}
          initialTitle={announcement.title}
          initialContent={announcement.content}
          isEdit
        />
      </Container>
    </Box>
  );
}
