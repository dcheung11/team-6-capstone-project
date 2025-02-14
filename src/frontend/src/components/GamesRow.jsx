import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { formatDate } from "../utils/Formatting";

export default function GamesRow(props) {
  console.log(props.games);

  const getOpponent = (game) => {
    return game.team1._id === props.teamId ? game.team2 : game.team1;
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
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 2,
                bgcolor: "#800020",
                "&:hover": {
                  bgcolor: "#600018",
                },
              }}
            >
              Reschedule
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
