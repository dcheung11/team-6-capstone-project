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
import { getTeams } from "../api/team";

export default function ContactInfoTable({ currentSeasonId }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [divisions, setDivisions] = useState([]);

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

  if (loading) {
    return <Typography>Loading Contact Info...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!currentSeasonId) {
    return <Typography>Loading season information...</Typography>;
  }

  if (!teams || teams.length === 0) {
    return <Typography>No team contact info available for the current season.</Typography>;
  }

  const filteredTeams = selectedDivision === 'all' 
    ? teams 
    : teams.filter(team => team.divisionId.name === selectedDivision);

  return (
    <Box>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Division</InputLabel>
        <Select
          value={selectedDivision}
          label="Division"
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          <MenuItem value="all">All Divisions</MenuItem>
          {divisions.map((division) => (
            <MenuItem key={division} value={division}>
              {division}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Team Name</strong></TableCell>
              <TableCell><strong>Division</strong></TableCell>
              <TableCell><strong>Captain Name</strong></TableCell>
              <TableCell><strong>Captain Email</strong></TableCell>
              <TableCell><strong>Captain Phone</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((team) => {
              const captain = team.captainId;
              const captainFullName = captain
                ? `${captain.firstName} ${captain.lastName}`
                : "No Captain";

              return (
                <TableRow key={team._id}>
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
