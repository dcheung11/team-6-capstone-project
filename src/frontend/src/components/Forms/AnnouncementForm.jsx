import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { MCMASTER_COLOURS } from "../../utils/Constants";

// AnnouncementForm: A form component for creating or editing announcements.
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
          // AI Generated - Ombre bar styling and gradient effects
          background: `linear-gradient(to right, ${MCMASTER_COLOURS.maroon}, ${MCMASTER_COLOURS.gold})`,
          borderRadius: '2px 2px 0 0'
        }
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: MCMASTER_COLOURS.grey,
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
              borderColor: MCMASTER_COLOURS.maroon,
            },
            '&.Mui-focused fieldset': {
              borderColor: MCMASTER_COLOURS.maroon,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: MCMASTER_COLOURS.maroon,
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
              borderColor: MCMASTER_COLOURS.maroon,
            },
            '&.Mui-focused fieldset': {
              borderColor: MCMASTER_COLOURS.maroon,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: MCMASTER_COLOURS.maroon,
          }
        }}
      />

      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          gap: 2,
          borderTop: `1px solid ${MCMASTER_COLOURS.lightGrey}`,
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
              borderColor: MCMASTER_COLOURS.grey,
              color: MCMASTER_COLOURS.grey,
              '&:hover': {
                borderColor: MCMASTER_COLOURS.maroon,
                color: MCMASTER_COLOURS.maroon,
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
              bgcolor: MCMASTER_COLOURS.maroon,
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
