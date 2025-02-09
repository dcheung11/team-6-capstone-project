import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

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
        maxWidth: "800px",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
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
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        {/* Delete Button */}
        {isEdit && (
          <Button
            variant="outlined"
            size="large"
            color="error"
            onClick={onDelete}
            sx={{
              textTransform: "none",
              borderColor: "red",
              color: "red",
              "&:hover": { bgcolor: "rgba(255,0,0,0.1)" },
            }}
          >
            Delete
          </Button>
        )}
        {/* Cancel and Submit Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" size="large" sx={{ textTransform: "none" }}>
            {isEdit ? "Save Changes" : "Create Announcement"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
