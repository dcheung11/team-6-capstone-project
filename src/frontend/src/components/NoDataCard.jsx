import React from "react";
import { Button, Stack, Container, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function NoDataCard(props) {
  return (
    <Container>
      <Stack spacing={2} alignItems="center">
        <ReportProblemIcon sx={{ fontSize: 60, color: "text.secondary" }} />
        <Typography variant="body1" color="text.secondary" align="center">
          {props.text}
        </Typography>
      </Stack>
    </Container>
  );
}
