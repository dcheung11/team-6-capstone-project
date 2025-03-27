import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  TableContainer, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import { getTeams, getSeasons } from "../api/team";

// McMaster colours - AI Generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

export default function ContactInfoTable({ currentSeasonId, allSeasons }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [divisions, setDivisions] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(currentSeasonId);

  useEffect(() => {
    const fetchData = async () => {
      // If no currentSeasonId is provided, don't try to fetch data
      if (!currentSeasonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getTeams();
        
        // Filter teams to only show those in the current season
        const seasonTeams = data.teams.filter(team => {
          // Handle both string and ObjectId cases
          const teamSeasonId = team.seasonId?._id || team.seasonId;
          return teamSeasonId?.toString() === currentSeasonId?.toString();
        });

        // Get unique divisions from the filtered teams
        const uniqueDivisions = [...new Set(seasonTeams.map(team => team.divisionId.name))];
        setDivisions(uniqueDivisions);
        
        // Sort teams by division name
        const sorted = seasonTeams.sort((a, b) => 
          a.divisionId.name.localeCompare(b.divisionId.name)
        );
        
        setTeams(sorted);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError(err.message || "Failed to fetch contact info");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentSeasonId]);

  // all seasons provided if we're in commissioner view 
  useEffect(() => {
    if (allSeasons) {
      // Sort seasons: ongoing first, then archived, then by start date
      const sortedSeasons = allSeasons.sort((a, b) => {
        // First sort by status
        if (a.status !== b.status) {
          return a.status === "archived" ? 1 : -1;
        }
        // Then sort by start date
        return new Date(b.startDate) - new Date(a.startDate);
      });
      setSeasons(sortedSeasons);
    }
  }, [allSeasons]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MCMASTER_COLOURS.lightGrey
      }}>
        <Typography>Loading Contact Info...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MCMASTER_COLOURS.lightGrey
      }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!currentSeasonId) {
    return (
      <Box sx={{ 
        minHeight: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MCMASTER_COLOURS.lightGrey
      }}>
        <Typography>Loading season information...</Typography>
      </Box>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MCMASTER_COLOURS.lightGrey
      }}>
        <Typography>No team contact info available for the current season.</Typography>
      </Box>
    );
  }

  const filteredTeams = selectedDivision === 'all' 
    ? teams 
    : teams.filter(team => team.divisionId.name === selectedDivision);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        {/* Division Dropdown */}
        <FormControl 
          sx={{ 
            minWidth: 220,
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
          }}
        >
          <InputLabel>Division</InputLabel>
          <Select
            value={selectedDivision}
            label="Division"
            onChange={(e) => setSelectedDivision(e.target.value)}
            sx={{
              backgroundColor: 'white',
            }}
          >
            <MenuItem 
              value="all"
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
              All Divisions
            </MenuItem>
            {divisions.map((division) => (
              <MenuItem 
                key={division} 
                value={division}
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
                {division}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer 
        component={Paper}
        sx={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: MCMASTER_COLOURS.maroon}}>
              <TableCell sx={{ color: 'white' }}><strong>Team Name</strong></TableCell>
              <TableCell sx={{ color: 'white' }}><strong>Division</strong></TableCell>
              <TableCell sx={{ color: 'white' }}><strong>Captain Name</strong></TableCell>
              <TableCell sx={{ color: 'white' }}><strong>Captain Email</strong></TableCell>
              <TableCell sx={{ color: 'white' }}><strong>Captain Phone</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((team) => {
              const captain = team.captainId;
              const captainFullName = captain
                ? `${captain.firstName} ${captain.lastName}`
                : "No Captain";

              return (
                <TableRow 
                  key={team._id}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.divisionId.name}</TableCell>
                  <TableCell>{captainFullName}</TableCell>
                  <TableCell>{captain?.email || "N/A"}</TableCell>
                  <TableCell>{captain?.phoneNumber || "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
