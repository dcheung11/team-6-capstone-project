import { useState, useEffect } from "react";
import { getStandingsByDivision } from "../api/standings"; 
import { getOngoingSeasons } from "../api/season"; 
import {
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  Box,
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
      const data = await getOngoingSeasons();
      setSeasons(data.seasons);
  
      // Set default season and divisions
      setSelectedSeason(data.seasons[0]._id);
      setDivisions(data.seasons[0].divisions || []);
      setSelectedDivision(data.seasons[0].divisions[0]?._id || "");
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
          <Typography variant="h4" gutterBottom>
            Standings
          </Typography>

          {/* Season & Division Selectors */}
          <Box>
            {/* Season Dropdown */}
            <FormControl sx={{ minWidth: 180, m: 2 }}>
              <Select
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
                    {season.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Division Dropdown */}
            <FormControl sx={{ minWidth: 180, m: 2 }}>
              <Select
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
          {standings.length > 0 ? (
            <Box>
              <StandingsTable standings={standings} />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                - Points are awarded as follows: 2 points for a win, 1 point for a
                draw, 0 points for a loss.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                - W - Wins, D - Draws, L - Losses, PTS - Points, RS - Runs Scored,
                RA - Runs Allowed.
              </Typography>
            </Box>
            ) : (
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }} align='center'>
              No teams in division
            </Typography>
          )}

        </Container>
      </Box>
    </div>
  );
}
