import { useState, useEffect } from "react";
import { getStandingsByDivision } from "../api/standings"; 
import { getAllSeasons } from "../api/season"; 
import {
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  Box,
  InputLabel,
} from "@mui/material";
import NavBar from "../components/NavBar";
import StandingsTable from "../components/StandingsTable";

export default function StandingsPage() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [standings, setStandings] = useState([]);

  // Fetch seasons on mount
  useEffect(() => {
    fetchSeasons();
  }, []);

  // Fetch standings when division changes
  useEffect(() => {
    if (selectedDivision) {
      getStandingsByDivision(selectedDivision).then(setStandings);
    }
  }, [selectedDivision]);

  const fetchSeasons = async () => {
    try {
      const data = await getAllSeasons();
      
      // Sort seasons: first by status (ongoing first), then by start date (newest first)
      const sortedSeasons = data.seasons.sort((a, b) => {
        // First sort by status
        if (a.status !== b.status) {
          return a.status === "archived" ? 1 : -1;
        }
        // Then sort by start date 
        return new Date(b.startDate) - new Date(a.startDate);
      });
      
      setSeasons(sortedSeasons);
  
      // Set default season and divisions
      setSelectedSeason(sortedSeasons[0]._id);
      setDivisions(sortedSeasons[0].divisions || []);
      setSelectedDivision(sortedSeasons[0].divisions[0]?._id || "");
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };
  
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
        <Typography variant="h4" fontWeight="bold" gutterBottom >
          Standings
        </Typography>
          {/* Season & Division Selectors */}
          <Box>
            {/* Season Dropdown */}
            <FormControl sx={{ minWidth: 180, m: 2 }}>
              <InputLabel id="season-select-label">Season</InputLabel>
              <Select
                labelId="season-select-label"
                label="Season"
                value={selectedSeason}
                onChange={(e) => {
                  const seasonId = e.target.value;
                  setSelectedSeason(seasonId);
                  
                  // Find selected season and update divisions
                  const selected = seasons.find((s) => s._id === seasonId);
                  setDivisions(selected?.divisions || []);
                  setSelectedDivision(selected?.divisions[0]?._id || "");
                }}
              >
                {seasons.map((season) => (
                  <MenuItem key={season._id} value={season._id}>
                    {season.name} {season.status === "archived" ? " (Archived)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Division Dropdown */}
            <FormControl sx={{ minWidth: 180, m: 2 }}>
              <InputLabel id="division-select-label">Division</InputLabel>
              <Select
                labelId="division-select-label"
                label="Division"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                {divisions.map((division) => (
                  <MenuItem key={division._id} value={division._id}>
                    {division.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Standings Table */}
          <StandingsTable standings={standings} />

          {/* Footnotes */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            - Points are awarded as follows: 2 points for a win, 1 point for a
            draw, 0 points for a loss.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            - PTS - Points, W - Wins, D - Draws, L - Losses, RS - Runs Scored,
            RA - Runs Allowed, Run Diff - Run Differential.
          </Typography>
        </Container>
      </Box>
    </div>
  );
}
