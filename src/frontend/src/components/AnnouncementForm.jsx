import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

// McMaster colors
const MCMASTER_COLORS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

export default function AnnouncementForm({ onSubmit, onDelete, initialTitle = "", initialContent = "", isEdit = false }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  // Update state when initial values change (useful for editing)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "850px",
        bgcolor: 'white',
        p: { xs: 3, md: 6 },
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(to right, ${MCMASTER_COLORS.maroon}, ${MCMASTER_COLORS.gold})`,
          borderRadius: '2px 2px 0 0'
        }
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: MCMASTER_COLORS.grey,
          fontWeight: 500
        }}
      >
        {isEdit ? "Update your announcement details below" : "Share important information with your teams"}
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: MCMASTER_COLORS.maroon,
            },
            '&.Mui-focused fieldset': {
              borderColor: MCMASTER_COLORS.maroon,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: MCMASTER_COLORS.maroon,
          }
        }}
      />

      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        required
        multiline
        rows={8}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: MCMASTER_COLORS.maroon,
            },
            '&.Mui-focused fieldset': {
              borderColor: MCMASTER_COLORS.maroon,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: MCMASTER_COLORS.maroon,
          }
        }}
      />

      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          gap: 2,
          borderTop: `1px solid ${MCMASTER_COLORS.lightGrey}`,
          pt: 3
        }}
      >
        {/* Delete Button */}
        {isEdit && (
          <Button
            variant="outlined"
            size="large"
            onClick={onDelete}
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                borderColor: '#b71c1c'
              },
              px: 3
            }}
          >
            Delete
          </Button>
        )}

        {/* Cancel and Submit Buttons */}
        <Box sx={{ display: "flex", gap: 2, ml: 'auto' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => window.history.back()}
            sx={{
              borderColor: MCMASTER_COLORS.grey,
              color: MCMASTER_COLORS.grey,
              '&:hover': {
                borderColor: MCMASTER_COLORS.maroon,
                color: MCMASTER_COLORS.maroon,
                bgcolor: 'transparent'
              },
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{
              bgcolor: MCMASTER_COLORS.maroon,
              '&:hover': {
                bgcolor: '#5A002C'
              },
              px: 3
            }}
          >
            {isEdit ? "Save Changes" : "Create Announcement"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
