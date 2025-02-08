import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export const SeasonsCard = (props) => {
  if (!props.seasons || props.seasons.length === 0) {
    return (
      <Box sx={{ mb: 2, width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          No {props.status} Seasons
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for new seasons!
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          width: "100%",
        }}
      >
        {props.seasons.map((season) => (
          <Card sx={{ height: "100%", width: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {season.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {season.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Start Date:</strong>{" "}
                  {new Date(season.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>End Date:</strong>{" "}
                  {new Date(season.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Teams Registered:</strong>{" "}
                  {season.registeredTeams.length}
                </Typography>
              </Box>
              {season.status === "upcoming" && (
                <Button
                  href={`/registerteam/${season.id}`}
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#7a003c",
                    color: "common.white",
                    borderRadius: "50px",
                    mt: 2,
                    width: "100%",
                    "&:hover": {
                      bgcolor: "common.black",
                      opacity: 0.9,
                    },
                  }}
                >
                  Register Team
                </Button>
                // Todo : if player is on the team, show Registered text instedad of button and maybe a link to the team.
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }
};
