import React from "react";
import { Button, Stack, Container, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function NoTeamsCard(props) {
  return (
    <Container>
      <Stack spacing={2} alignItems="center">
        <GroupIcon sx={{ fontSize: 60, color: "text.secondary" }} />
        <Typography variant="body1" color="text.secondary" align="center">
          No teams to show. Join or create a team to see team information.
        </Typography>
      </Stack>
    </Container>
  );
}
