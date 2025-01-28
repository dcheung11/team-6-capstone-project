import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Container } from '@mui/material';
// import axios from 'axios';
import NavBar from "../components/NavBar";

export default function CreateAnnouncement() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // Suggestion for submitting announcements from DeepSeek
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post('/api/announcements', {
  //       title,
  //       content,
  //       postedBy: 'commissioner', // Replace with the actual user (e.g., from auth context)
  //       season: '65a1b2c3d4e5f6g7h8i9j0k', // Replace with the actual season ID
  //     });

  //     console.log('Announcement created:', response.data);
  //     navigate('/announcements'); // Redirect to the announcements page
  //   } catch (error) {
  //     console.error('Error creating announcement:', error);
  //   }
  // };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Centered Title */}
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Create New Announcement
        </Typography>

        {/* Form */}
        <Box sx={{ width: '100%', maxWidth: '800px', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
          {/* <form onSubmit={handleSubmit}> */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            <TextField
              label="Content"
              value={content}
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
                Create Announcement
            </Button>
            </Box>
          {/* </form> */}
        </Box>
      </Container>
    </Box>
  );
}