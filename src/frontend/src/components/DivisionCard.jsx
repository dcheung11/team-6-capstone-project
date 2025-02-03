import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

export const DivisionCard = (props) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="common.black">
          Division: {props.division.name}
        </Typography>
        <Box sx={{ mt: 2, overflowY: "auto", height: "120px" }}>
          {props
            .calculateDivisionTeams(props.division.name)
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
