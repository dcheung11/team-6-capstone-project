// Author: Damien Cheung
// Description: This component displays a card for each season with its details and a button to register a team if applicable.
// Last Modified: 2025-03-20

import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { useState, useEffect } from "react";

// SeasonsCard: Displays a card for each season with its details and a button to register a team if applicable.
export const SeasonsCard = (props) => {
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch player data by ID when the component mounts or when auth.playerId changes
  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        setLoading(true);
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        console.log("Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    if (auth.playerId) {
      fetchPlayerById(auth.playerId);
    }
  }, [auth.playerId]);

  // If no seasons exist or the seasons array is empty, display a message
  // Otherwise, display a card for each season
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
                {new Date(season.startDate).toLocaleDateString("en-CA")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>End Date:</strong>{" "}
                {new Date(season.endDate).toLocaleDateString("en-CA")}
              </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Teams Registered:</strong>{" "}
                  {season.registeredTeams.length}
                </Typography>
              </Box>
              {/* Only show the register button if the season is upcoming and the player is not already on a team */}
              {!loading && season.status === "upcoming" && !player?.team && (
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
              )}
              {season.status === "upcoming" && player?.team && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  You are already registered on a team.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }
};
