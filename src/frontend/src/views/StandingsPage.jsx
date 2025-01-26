import {
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
import NavBar from "../components/NavBar";
import standings from "../data/standings.json";
import seasons from "../data/seasons.json";
import { useState } from "react";
import StandingsTable from "../components/StandingsTable";

export default function StandingsPage() {
  const [selectedSeason, setSelectedSeason] = useState("2025");
  const [selectedDivision, setSelectedDivision] = useState("Division A");

  // TODO: Fetch standings data from API using selectedSeason and selectedDivision

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container sx={{ py: 4, flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Standings
          </Typography>
          <Box>
            <FormControl sx={{ minWidth: 180 }}>
              <Select defaultValue="2025">
                {seasons.map((season) => (
                  <MenuItem value={season.name}>{season.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <Select defaultValue="Division A">
                {seasons
                  .filter((season) => season.name === selectedSeason)[0]
                  .divisions.map((division) => (
                    <MenuItem value={division.name}>{division.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <StandingsTable standings={standings} />

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            - Points are awarded as follows: 2 points for a win, 1 point for a
            draw, 0 points for a loss
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            - W - Wins, D - Draws, L - Losses, PTS - Points, RS - Runs Scored,
            RA - Runs Allowed
          </Typography>
        </Container>
      </Box>
    </div>
  );
}
