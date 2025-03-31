// Author: Damien Cheung
// Description: This component displays a row of game cards for a specific team.
// Last Modified: 2025-02-10

import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { formatDate } from "../../utils/Formatting";

// GamesRow: Displays a row of game cards for a specific team.
export default function GamesRow(props) {
  const getOpponent = (game) => {
    return game.homeTeam._id === props.teamId ? game.awayTeam : game.homeTeam;
  };
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 6, overflowX: "auto" }}>
      {props.games.map((game, index) => (
        <Card key={index} sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {getOpponent(game).name}
            </Typography>
            <Typography variant="body1">{formatDate(game.date)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {game.field} - {game.time}
            </Typography>

            { props.player.role === "captain" &&
              (<Button
                variant="contained"
                size="small"
                sx={{
                  mt: 2,
                  bgcolor: "#800020",
                  "&:hover": {
                    bgcolor: "#600018",
                  },
                }}
                disabled={props.captain !== props.player} // Disable the button if homeScore or awayScore is null
            >
              Reschedule
            </Button>)}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
