// Author: Damien Cheung
// Description: This component displays a division with its teams.
// It is used in the ScheduleView component to show the divisions and their teams.
// Last Modified: 2025-03-27

import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

// DivisionCard: Displays a division with its teams.
export const DivisionCard = (props) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h7" gutterBottom color="common.black">
          {props.division.name}
        </Typography>
        <Box sx={{ mt: 2, overflowY: "auto", height: "120px" }}>
          {(props.tempTeams || [])
            .filter((team) => team.divisionId == props.division.id)
            .map((team, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {team.name}
              </Typography>
            ))}
        </Box>
      </CardContent>
    </Card>
  );
};
