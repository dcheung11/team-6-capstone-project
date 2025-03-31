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
  Stack,
} from "@mui/material";
import NavBar from "../components/NavBar";
import StandingsTable from "../components/Tables/StandingsTable";

// McMaster colours - AI generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

// StandingsPage component: Displays the standings of teams in a selected season and division
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
      const sortedSeasons = data.seasons
        .filter((season) => season.status !== "upcoming")
        .sort((a, b) => {
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
          bgcolor: "#f5f5f5",
        }}
      >
        <Container sx={{ py: 4, flexGrow: 1 }}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                // AI Generated - Ombre bar styling and gradient effects
                background: `linear-gradient(to right, ${MCMASTER_COLOURS.maroon}, ${MCMASTER_COLOURS.gold})`,
                borderRadius: '2px 2px 0 0'
              },
              p: 3,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: "bold",
                color: MCMASTER_COLOURS.maroon,
                mb: 3
              }}
            >
              Standings
            </Typography>

            {/* Season & Division Selectors - styling AI generated*/}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ 
                mb: 4,
                '& .MuiFormControl-root': {
                  minWidth: { xs: '100%', sm: 220 },
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: MCMASTER_COLOURS.maroon,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: MCMASTER_COLOURS.maroon,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: MCMASTER_COLOURS.maroon,
                  }
                }
              }}
            >
              {/* Season Dropdown */}
              <FormControl>
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
                  sx={{
                    backgroundColor: 'white',
                  }}
                >
                  {seasons.map((season) => (
                    <MenuItem 
                      key={season._id} 
                      value={season._id}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}14`,
                          '&:hover': {
                            backgroundColor: `${MCMASTER_COLOURS.maroon}20`,
                          }
                        },
                        '&:hover': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}0A`,
                        }
                      }}
                    >
                      {season.name} {season.status === "archived" ? " (Archived)" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Division Dropdown */}
              <FormControl>
                <InputLabel id="division-select-label">Division</InputLabel>
                <Select
                  labelId="division-select-label"
                  label="Division"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                  }}
                >
                  {divisions.map((division) => (
                    <MenuItem 
                      key={division._id} 
                      value={division._id}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}14`,
                          '&:hover': {
                            backgroundColor: `${MCMASTER_COLOURS.maroon}20`,
                          }
                        },
                        '&:hover': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}0A`,
                        }
                      }}
                    >
                      {division.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

          {/* Standings Table */}
          {standings.length > 0 ? (
            <Box>
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
            </Box>
            ) : (
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }} align='center'>
              No teams in division
            </Typography>
          )}
          </Box> 
        </Container>
      </Box>
    </div>
  );
}
