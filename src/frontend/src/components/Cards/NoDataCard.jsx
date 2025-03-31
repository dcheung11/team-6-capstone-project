// Author: Damien Cheung
// Description: This component displays a message when there is no data to show.
// Last Modified: 2025-03-27

import React from "react";
import { Stack, Container, Typography } from "@mui/material";
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
