import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import CardAnnouncement from "./CardAnnouncement";

export default function PastAnnouncementsSection({ pastAnnouncements, userRole }) {
  return (
    <Box sx={{ bgcolor: "#495965", py: 6, width: "100%", flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Typography 
        variant="h4" 
        color="primary.contrastText" 
        gutterBottom 
        sx={{
            mb: 4,
            fontWeight: 700,
          }}
        >
          Past Announcements
        </Typography>
        <Grid container spacing={3}>
          {pastAnnouncements.map((announcement) => (
            <Grid item xs={12} md={6} key={announcement._id}>
              <CardAnnouncement announcement={announcement} userRole={userRole} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
