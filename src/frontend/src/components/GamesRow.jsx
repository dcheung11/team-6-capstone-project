import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export default function GamesRow(props) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 6, overflowX: "auto" }}>
      {props.games.map((game, index) => (
        <Card key={index} sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {game.team}
            </Typography>
            <Typography variant="body1">{game.date}</Typography>
            <Typography variant="body2" color="text.secondary">
              {game.field}
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
