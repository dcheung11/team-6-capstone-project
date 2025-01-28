import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Container } from '@mui/material';
import axios from 'axios';
import NavBar from "../components/NavBar";

export default function EditAnnouncement() {
  const { id } = useParams(); // Get the announcement ID from the URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing announcement data
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`/api/announcements/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };
    fetchAnnouncement();
  }, [id]);

  // Suggestion for submitting announcements from DeepSeek
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.put(`/api/announcements/${id}`, {
  //       title,
  //       content,
  //     });

  //     console.log('Announcement updated:', response.data);
  //     navigate('/announcements'); // Redirect to the announcements page
  //   } catch (error) {
  //     console.error('Error updating announcement:', error);
  //   }
  // };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Centered Title */}
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Edit Announcement
        </Typography>

        {/* Form */}
        <Box sx={{ width: '100%', maxWidth: '800px', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
          {/* <form onSubmit={handleSubmit}> */}
            <TextField
              label="Title"
              value={`Announcement ${id}`}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            <TextField
              label="Content"
              value={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim dapibus quis id convallis vitae auctor feugiat massa"}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              required
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{ textTransform: 'none' }}
                onClick={() => navigate('/announcements')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" size="large" sx={{ textTransform: 'none' }}>
                Save Changes
              </Button>
            </Box>
          {/* </form> */}
        </Box>
      </Container>
    </Box>
  );
}